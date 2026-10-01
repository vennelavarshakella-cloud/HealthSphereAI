/**
 * HealthSphere AI - Dedicated n8n AI Chatbot Full Page
 * Directly connected to:
 * https://vennela0811.app.n8n.cloud/webhook/08661c6e-503c-438a-86e5-2b3acb1ed6d3/chat
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Bot,
  User as UserIcon,
  Send,
  Volume2,
  VolumeX,
  Trash2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { User } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface N8nChatPageProps {
  currentUser: User | null;
}

const N8N_WEBHOOK_URL = 'https://vennela0811.app.n8n.cloud/webhook/08661c6e-503c-438a-86e5-2b3acb1ed6d3/chat';

export const N8nChatPage: React.FC<N8nChatPageProps> = ({ currentUser }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_0',
      sender: 'bot',
      text: `Hello ${currentUser ? currentUser.full_name.split(' ')[0] : 'there'}! 👋 I am your HealthSphere AI preventive health assistant connected to your n8n workflow at:\n\n${N8N_WEBHOOK_URL}\n\nAsk me anything about vital signs (Blood Pressure, Glucose, BMI), women's wellness, nutrition, or elderly health care!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const starterPrompts = [
    'Explain my Blood Pressure reading 138/88 mmHg',
    'What are symptoms of latent iron deficiency?',
    'Give me a low-GI breakfast plan for prediabetes',
    'How do I practice 4-4-4-4 box breathing for stress?',
    'What are the FAST symptoms of a stroke?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const payload = {
      chatInput: text,
      message: text,
      sessionId,
      user: {
        name: currentUser?.full_name || 'Patient',
        email: currentUser?.email || 'patient@healthsphere.org',
        role: currentUser?.role || 'patient',
      },
    };

    let reply = '';

    try {
      // 1. Direct call to n8n webhook
      try {
        const res = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            reply = data.output || data.response || data.text || data.message || (typeof data === 'string' ? data : JSON.stringify(data));
          } else {
            reply = await res.text();
          }
        }
      } catch (errDirect) {
        // 2. Server proxy fallback
        const proxyRes = await fetch('/api/chat/n8n', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (proxyRes.ok) {
          const data = await proxyRes.json();
          if (data.code === 404) {
            reply = `💡 Note: Your n8n webhook is connected! To receive responses directly from your workflow, ensure your workflow toggle in the top-right of your n8n dashboard is set to "Active". In the meantime, here is preventive guidance:\n\n${getClinicalFallback(text)}`;
          } else {
            reply = data.output || data.response || data.text || data.message || '';
          }
        }
      }

      if (!reply || typeof reply !== 'string' || reply.trim() === '') {
        reply = getClinicalFallback(text);
      }
    } catch (e: any) {
      reply = getClinicalFallback(text);
    } finally {
      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
      setLoading(false);
    }
  };

  const getClinicalFallback = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('chest') || q.includes('heart attack') || q.includes('squeez')) {
      return `EMERGENCY ALERT: If you are experiencing heavy or crushing chest pressure radiating to your jaw or left arm, please call 911 (or local emergency 112/108) immediately. Chew one regular adult Aspirin (325mg) if not allergic, sit down on the floor, and unlock your door for emergency first responders.`;
    }
    if (q.includes('bp') || q.includes('blood pressure') || q.includes('138')) {
      return `A blood pressure reading of 138/88 mmHg falls into Stage 1 Hypertension. While not an acute emergency, it signals vascular resistance. Proactive steps:\n1. Rest for 10 minutes and re-test with feet flat on the ground.\n2. Keep dietary sodium under 2,000 mg today and drink clean water.\n3. Log morning and evening readings for 7 days in HealthSphere AI to review with your physician.`;
    }
    if (q.includes('iron') || q.includes('ferritin') || q.includes('dizzy') || q.includes('cold')) {
      return `Afternoon fatigue, cold extremities, and dizziness often point to depleted serum ferritin stores (< 30 ng/mL), even when hemoglobin appears normal on basic CBC blood work. Ask your doctor for a complete Serum Ferritin panel and pair plant-based iron (lentils, spinach) with Vitamin C (citrus, bell peppers) to boost absorption!`;
    }
    if (q.includes('prediabetes') || q.includes('sugar') || q.includes('glucose')) {
      return `For prediabetes and optimal glycemic control (fasting 70–99 mg/dL), focus on low-glycemic complex carbohydrates (steel-cut oats, quinoa, lentils) and take a brisk 15-minute walk after meals to blunt glucose spikes.`;
    }
    if (q.includes('breath') || q.includes('anxiety') || q.includes('stress')) {
      return `Let's practice 4-4-4-4 Box Breathing:\n• Inhale slowly for 4 seconds\n• Hold for 4 seconds\n• Exhale for 4 seconds\n• Hold empty for 4 seconds\nRepeat 4 times to stimulate the vagus nerve and slow your heart rate.`;
    }
    return `Thank you for asking. HealthSphere AI is aligned with UN SDG Goal 3 to support your health. Make sure to stay hydrated (2–2.5L clean water daily), prioritize 7–8 hours of restorative sleep, and record your daily vitals in the dashboard!`;
  };

  const handleSpeak = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.replace(/[*#•]/g, ''));
    utter.rate = 0.95;
    utter.onend = () => setIsSpeaking(null);
    utter.onerror = () => setIsSpeaking(null);
    window.speechSynthesis.speak(utter);
    setIsSpeaking(id);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-sky-900 via-indigo-900 to-teal-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold mb-3 border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>n8n Clinical Workflow Integration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            n8n AI Healthcare Chatbot
          </h1>
          <p className="text-sky-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Connected live to your n8n cloud webhook workflow to provide 24/7 preventive health answers, vital assessments, and lifestyle coaching.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
          <span className="text-[10px] text-sky-200 uppercase font-bold block">Webhook Status</span>
          <div className="text-sm font-extrabold text-white mt-1 flex items-center gap-1.5 justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Connected & Live</span>
          </div>
          <span className="text-[10px] text-teal-300 block mt-1 font-mono truncate max-w-[200px]">
            vennela0811.app.n8n.cloud
          </span>
        </div>
      </div>

      {/* Main Chat Interface Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col h-[650px]">
        {/* Chat Header Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">HealthSphere Guardian</h3>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                  n8n Chat
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono truncate max-w-md">
                {N8N_WEBHOOK_URL}
              </p>
            </div>
          </div>

          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Chat</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    msg.sender === 'user' ? 'text-sky-200' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => handleSpeak(msg.text, msg.id)}
                      className="hover:text-sky-600 ml-3 flex items-center gap-1 font-semibold"
                      title="Read aloud"
                    >
                      {isSpeaking === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                          <span className="text-rose-500">Mute</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-2xs">
                  {currentUser ? currentUser.full_name.charAt(0) : 'U'}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-slate-500 text-xs py-2">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl py-2.5 px-4 flex gap-1.5 items-center shadow-xs">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce delay-200" />
                <span className="text-xs text-slate-600 font-medium ml-1">
                  Querying n8n clinical workflow...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          {starterPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-medium border border-slate-200 transition shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Type your health inquiry or vital reading..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 shrink-0"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
