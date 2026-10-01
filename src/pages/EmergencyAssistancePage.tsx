/**
 * HealthSphere AI - Emergency Assistance & Interactive First Aid Guide
 * One-Tap SOS Dispatcher, Siren Simulation, and Step-by-Step Clinical First Aid (Heart Attack, Stroke, Burns, Snake Bites).
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Heart,
  Activity,
  Flame,
  AlertTriangle,
  MapPin,
  Clock,
  CheckCircle2,
  Volume2,
  VolumeX,
  Plus,
  Send,
  User as UserIcon,
} from 'lucide-react';
import { User, EmergencyContact } from '../types';

interface EmergencyAssistancePageProps {
  currentUser: User | null;
  contacts: EmergencyContact[];
  onAddContact: (contact: Partial<EmergencyContact>) => void;
}

export const EmergencyAssistancePage: React.FC<EmergencyAssistancePageProps> = ({
  currentUser,
  contacts,
  onAddContact,
}) => {
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [sosDispatched, setSosDispatched] = useState(false);
  const [activeGuide, setActiveGuide] = useState<'heart' | 'stroke' | 'burns' | 'snake' | 'choking'>('heart');

  // Contact modal
  const [modalOpen, setModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [relationship, setRelationship] = useState('Caregiver');
  const [phone, setPhone] = useState('');

  // Audio Siren Simulator using Web Audio API
  const toggleSiren = () => {
    if (sirenPlaying) {
      setSirenPlaying(false);
      return;
    }

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(1000, audioCtx.currentTime + 0.5);
      osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 1.0);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      setSirenPlaying(true);

      setTimeout(() => {
        osc.stop();
        setSirenPlaying(false);
      }, 4000);
    } catch (e) {
      setSirenPlaying(false);
    }
  };

  const handleDispatchSos = () => {
    toggleSiren();
    setSosDispatched(true);
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !phone) return;
    onAddContact({
      user_id: currentUser ? currentUser.id : 'usr_001',
      contact_name: contactName,
      relationship,
      phone_number: phone,
      is_primary: false,
    });
    setContactName('');
    setPhone('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* SOS Alert Banner */}
      <div className="bg-linear-to-r from-red-700 via-rose-800 to-red-950 text-white p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-red-100 text-xs font-bold border border-white/20">
              <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
              <span>Priority 1 Clinical Emergency Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              One-Tap Emergency SOS Dispatch
            </h1>
            <p className="text-red-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Triggers simulated GPS location broadcasting to your primary caregiver network and instantly connects you to certified first responders.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleDispatchSos}
              className="px-8 py-5 rounded-2xl bg-white text-red-700 hover:bg-red-50 font-black text-lg shadow-2xl transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-6 h-6 animate-bounce" />
              <span>TRIGGER SOS NOW</span>
            </button>

            <button
              onClick={toggleSiren}
              className={`px-4 py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition border ${
                sirenPlaying
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              {sirenPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{sirenPlaying ? 'Stop Siren' : 'Play Alarm Siren'}</span>
            </button>
          </div>
        </div>

        {/* SOS Dispatched confirmation box */}
        {sosDispatched && (
          <div className="p-4 rounded-2xl bg-black/40 border border-white/30 backdrop-blur-md space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>SOS Alert Broadcast Active</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px]">Simulated GPS Coordinates:</span>
                <strong>37.7749° N, 122.4194° W (Accuracy: 4m)</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Dispatched To:</span>
                <strong>David Jenkins (+1 555-345-6789)</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Paramedic Status:</span>
                <strong>Routing unit to address (ETA 6 mins)</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Phone Hotlines Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
          <span className="text-xs uppercase font-extrabold text-red-600 block">Ambulance / EMT</span>
          <div className="text-2xl font-black text-slate-900 mt-1">911 / 112</div>
          <span className="text-[10px] text-slate-400 font-medium">Global Emergency Line</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
          <span className="text-xs uppercase font-extrabold text-amber-600 block">Poison Control</span>
          <div className="text-xl font-black text-slate-900 mt-1">1-800-222-1222</div>
          <span className="text-[10px] text-slate-400 font-medium">Toxic Ingestion Hotline</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
          <span className="text-xs uppercase font-extrabold text-teal-600 block">Crisis Lifeline</span>
          <div className="text-2xl font-black text-slate-900 mt-1">988</div>
          <span className="text-[10px] text-slate-400 font-medium">Mental Health Support 24/7</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
          <span className="text-xs uppercase font-extrabold text-purple-600 block">Women Safety</span>
          <div className="text-xl font-black text-slate-900 mt-1">1-800-799-7233</div>
          <span className="text-[10px] text-slate-400 font-medium">Domestic & Safety Hotline</span>
        </div>
      </div>

      {/* Interactive First Aid Protocols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Guide Navigator */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Life-Saving First Aid Library
          </h3>

          <div className="space-y-2">
            {[
              { id: 'heart', label: 'Heart Attack & CPR', icon: Heart, color: 'text-rose-600' },
              { id: 'stroke', label: 'Stroke FAST Protocol', icon: Activity, color: 'text-sky-600' },
              { id: 'burns', label: 'Burn Classification & Care', icon: Flame, color: 'text-amber-600' },
              { id: 'snake', label: 'Snake Bite Do’s & Don’ts', icon: AlertTriangle, color: 'text-emerald-600' },
              { id: 'choking', label: 'Choking & Heimlich Maneuver', icon: ShieldAlert, color: 'text-indigo-600' },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeGuide === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveGuide(tab.id as any)}
                  className={`w-full p-3.5 rounded-2xl text-xs font-bold transition flex items-center justify-between border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
                    <span>{tab.label}</span>
                  </div>
                  <span>→</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Guide Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
          {activeGuide === 'heart' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Heart Attack Signs & Hands-Only CPR</h3>
                  <p className="text-xs text-slate-500">American Heart Association (AHA) Protocol</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 space-y-1.5">
                  <span className="font-bold text-rose-900 block">Critical Warning Symptoms:</span>
                  <ul className="list-disc pl-4 space-y-1 text-rose-800">
                    <li>Crushing chest pressure, fullness, or pain in center of chest</li>
                    <li>Pain radiating to jaw, neck, back, or left arm</li>
                    <li>Cold sweat, lightheadedness, sudden extreme shortness of breath</li>
                    <li>Women often report unusual fatigue, nausea, or epigastric discomfort</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-800 block">Immediate Actions:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    <li>Call 911 immediately — every minute saves heart muscle</li>
                    <li>Chew one full-dose uncoated adult Aspirin (325mg) if not allergic</li>
                    <li>Keep person seated and calm; loosen tight clothing around neck</li>
                    <li>If unresponsive and no breathing, begin Hands-Only CPR</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <span className="text-xs uppercase font-extrabold text-rose-400">Hands-Only CPR Protocol</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Place heel of hand in center of chest. Interlock fingers. Push hard and fast at 100 to 120 beats per minute (to the tempo of "Stayin' Alive"). Compress chest at least 2 inches deep. Do not stop until AED arrives or paramedics take over.
                </p>
              </div>
            </div>
          )}

          {activeGuide === 'stroke' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Stroke FAST Detection Protocol</h3>
                  <p className="text-xs text-slate-500">Time is Brain: 1.9 Million Neurons Lost Per Minute</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
                  <div className="text-2xl font-black text-sky-600">F</div>
                  <strong className="text-xs text-slate-800 block mt-1">Face Drooping</strong>
                  <p className="text-[10px] text-slate-600 mt-1">Ask the person to smile. Does one side of the face droop?</p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
                  <div className="text-2xl font-black text-sky-600">A</div>
                  <strong className="text-xs text-slate-800 block mt-1">Arm Weakness</strong>
                  <p className="text-[10px] text-slate-600 mt-1">Ask them to raise both arms. Does one arm drift downward?</p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
                  <div className="text-2xl font-black text-sky-600">S</div>
                  <strong className="text-xs text-slate-800 block mt-1">Speech Slur</strong>
                  <p className="text-[10px] text-slate-600 mt-1">Ask them to repeat a simple phrase. Is speech slurred or strange?</p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <div className="text-2xl font-black text-rose-600">T</div>
                  <strong className="text-xs text-rose-900 block mt-1">Time to Call 911</strong>
                  <p className="text-[10px] text-rose-800 mt-1">Call immediately. Note the exact time symptoms first started!</p>
                </div>
              </div>
            </div>
          )}

          {activeGuide === 'burns' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Thermal & Chemical Burn Treatment</h3>
                  <p className="text-xs text-slate-500">First-aid rules to prevent infection and scarring</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <strong className="text-emerald-900 block font-bold">1. Cool Immediately with Running Water:</strong>
                  <p className="text-emerald-800">
                    Hold the burned area under cool (not freezing) running tap water for 10-20 minutes. Never use ice or ice water, as extreme cold damages tissue further.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                  <strong className="text-rose-900 block font-bold">2. What NEVER to Do:</strong>
                  <p className="text-rose-800">
                    Do NOT apply butter, toothpaste, grease, or oil. Do NOT pop blisters, as the skin roof is a sterile biological bandage.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-800 block font-bold">3. Sterile Dressing:</strong>
                  <p className="text-slate-600">
                    Cover loosely with sterile non-adherent gauze or clean plastic wrap. Seek medical attention if burn is larger than palm or on hands, face, or joints.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeGuide === 'snake' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Snake Bite Protocol: Do’s & Don’ts</h3>
                  <p className="text-xs text-slate-500">Evidence-based envenomation response</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <span className="font-bold text-emerald-900 block">DO THIS:</span>
                  <ul className="list-disc pl-4 space-y-1 text-emerald-800">
                    <li>Keep patient calm and completely still to slow venom circulation</li>
                    <li>Immobilize the bitten limb below heart level</li>
                    <li>Remove rings, watches, and tight clothing before swelling begins</li>
                    <li>Take a photo of the snake from safe distance for antivenom typing</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <span className="font-bold text-rose-900 block">NEVER DO THIS:</span>
                  <ul className="list-disc pl-4 space-y-1 text-rose-800">
                    <li>Do NOT apply a tight arterial tourniquet (causes tissue necrosis)</li>
                    <li>Do NOT cut the wound with knives or razor blades</li>
                    <li>Do NOT attempt to suck out the venom with your mouth</li>
                    <li>Do NOT apply ice, electricity, or folk remedies</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeGuide === 'choking' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Choking Relief: 5 Back Blows & Heimlich Thrusts</h3>
                  <p className="text-xs text-slate-500">Red Cross & AHA Standard Airway Clearance</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block">Step 1: Check for Universal Choking Sign:</strong>
                  Hands clutched to throat, unable to speak, cough, or breathe.
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block">Step 2: 5 Firm Back Blows:</strong>
                  Lean person forward and deliver 5 firm blows between shoulder blades with the heel of your hand.
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block">Step 3: 5 Abdominal Thrusts (Heimlich):</strong>
                  Stand behind person, wrap arms around waist. Make a fist just above navel. Grasp fist with other hand and thrust inward and upward forcefully.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contacts Directory */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Personal Emergency Contact List</h3>
            <p className="text-xs text-slate-500">
              Notified automatically in case of high-risk vital events or SOS activation
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map(c => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{c.contact_name}</span>
                  {c.is_primary && (
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500">{c.relationship} • {c.phone_number}</div>
              </div>

              <button
                onClick={() => alert(`Simulating rapid phone call to ${c.contact_name} (${c.phone_number})`)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Contact Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Emergency Contact</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Jenkins"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spouse / Sister / Physician"
                  value={relationship}
                  onChange={e => setRelationship(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
