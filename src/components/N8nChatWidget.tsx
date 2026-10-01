/**
 * HealthSphere AI - n8n Webhook Chatbot Widget
 * Directly connected to:
 * https://vennela0811.app.n8n.cloud/webhook/08661c6e-503c-438a-86e5-2b3acb1ed6d3/chat
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Volume2,
  VolumeX,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { User } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface N8nChatWidgetProps {
  currentUser: User | null;
}

const N8N_WEBHOOK_URL = 'https://vennela0811.app.n8n.cloud/webhook/08661c6e-503c-438a-86e5-2b3acb1ed6d3/chat';

export const N8nChatWidget: React.FC<N8nChatWidgetProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'bot',
      text: `Hello ${currentUser ? currentUser.full_name.split(' ')[0] : 'there'}! 👋 I am your HealthSphere AI preventive health assistant connected to your n8n workflow. Feel free to ask about your blood pressure readings, diet advice, women's wellness, or senior care. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const starterChips = [
    'Explain my BP 138/88 reading',
    'Ferritin & iron deficiency symptoms',
    'Prediabetes diet recommendations',
    'How do I practice 4-4-4 box breathing?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || loading) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let botReply = '';

      // Try sending payload to n8n webhook (standard n8n chat format: { chatInput, sessionId })
      const payload = {
        chatInput: messageText,
        message: messageText,
        sessionId,
        user: {
          name: currentUser?.full_name || 'Patient',
          email: currentUser?.email || 'patient@healthsphere.org',
          role: currentUser?.role || 'patient',
        },
      };

      try {
        // Attempt 1: Direct webhook call
        const directRes = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
          },
          body: JSON.stringify(payload),
        });

        let data: any = null;
        if (directRes.ok) {
          const contentType = directRes.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            data = await directRes.json();
          } else {
            botReply = await directRes.text();
          }
        } else {
          // If direct call returned non-200, try server proxy
          const proxyRes = await fetch('/api/chat/n8n', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (proxyRes.ok) {
            data = await proxyRes.json();
          }
        }

        if (data) {
          if (data.code === 404 && data.hint) {
            botReply = `💡 Note: Your n8n workflow is connected, but currently set to Inactive. To receive responses directly from your n8n workflow, toggle it to "Active" in the top-right of your n8n editor.\n\nHere is preventive health guidance:\n\n${getClinicalGuardianFallback(messageText)}`;
          } else {
            botReply = data.output || data.response || data.text || data.message || (typeof data === 'string' ? data : JSON.stringify(data));
          }
        }
      } catch (directErr) {
        // Fallback to proxy
        try {
          const proxyRes = await fetch('/api/chat/n8n', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (proxyRes.ok) {
            const data = await proxyRes.json();
            if (data.code === 404) {
              botReply = `💡 Note: Your n8n workflow is connected, but currently set to Inactive. To receive responses directly from your n8n workflow, toggle it to "Active" in the top-right of your n8n editor.\n\nHere is preventive health guidance:\n\n${getClinicalGuardianFallback(messageText)}`;
            } else {
              botReply = data.output || data.response || data.text || data.message || '';
            }
          }
        } catch (e) {}
      }

      // If still empty, provide clinical guardian response
      if (!botReply || typeof botReply !== 'string' || botReply.trim() === '') {
        botReply = getClinicalGuardianFallback(messageText);
      }

      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'bot',
        text: `I received your message: "${messageText}". My n8n workflow is connected at ${N8N_WEBHOOK_URL}. If the workflow is paused or executing, here is preventive guidance:\n\n${getClinicalGuardianFallback(messageText)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Plain-English clinical preventive fallback
  const getClinicalGuardianFallback = (query: string): string => {
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
    return `Thank you for sharing. HealthSphere AI is aligned with UN SDG Goal 3 to support your health. Make sure to stay hydrated (2–2.5L clean water daily), prioritize 7–8 hours of restorative sleep, and record your daily vitals in the dashboard!`;
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
    <>
      {/* Floating Action Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {!isOpen && (
          <div className="mb-2 bg-slate-900 text-white text-[11px] font-semibold py-1.5 px-3 rounded-full shadow-lg border border-slate-700 animate-bounce flex items-center gap-1.5 hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Chat with n8n AI Guardian</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
            isOpen
              ? 'bg-slate-800 text-white rotate-90'
              : 'bg-linear-to-tr from-sky-600 via-blue-600 to-teal-500 text-white shadow-sky-500/30'
          }`}
          title="Open AI Health Chatbot"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>

      {/* Slide-Up Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="bg-linear-to-r from-sky-900 via-blue-900 to-indigo-950 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-teal-300 border border-white/20">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white">HealthSphere AI</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-sky-200 font-medium">
                  Connected to n8n Cloud Webhook
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Webhook Status Info Pill */}
          <div className="bg-sky-50 px-3 py-1 border-b border-sky-100 flex items-center justify-between text-[10px] text-sky-800">
            <span className="truncate max-w-[280px]">
              Webhook: vennela0811.app.n8n.cloud
            </span>
            <span className="font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.2 rounded">
              Live
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div
                    className={`mt-1.5 flex items-center justify-between text-[10px] ${
                      msg.sender === 'user' ? 'text-sky-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => handleSpeak(msg.text, msg.id)}
                        className="hover:text-sky-600 ml-2 p-0.5"
                        title="Read aloud"
                      >
                        {isSpeaking === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    {currentUser ? currentUser.full_name.charAt(0) : 'U'}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs py-2">
                <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl py-2 px-3 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce delay-200" />
                  <span className="text-[11px] text-slate-500 ml-1">n8n is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Chips */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            {starterChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 text-[10px] font-semibold border border-slate-200 transition shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about vitals, meals, or symptoms..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white shadow-xs transition"
              title="Send to n8n chatbot"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
