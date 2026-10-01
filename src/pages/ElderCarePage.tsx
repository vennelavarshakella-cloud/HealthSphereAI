/**
 * HealthSphere AI - Elder Care & Senior Longevity Module
 * High-visibility large font interfaces, voice navigation, blood pressure & glucose trackers, and giant SOS emergency button.
 */

import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Pill,
  Volume2,
  VolumeX,
  Type,
  ShieldAlert,
  PhoneCall,
  CheckCircle2,
  Sun,
  AlertTriangle,
  User as UserIcon,
  Plus,
} from 'lucide-react';
import { User, MedicineReminder, ElderAccessibilityConfig } from '../types';

interface ElderCarePageProps {
  currentUser: User | null;
  reminders: MedicineReminder[];
  onToggleReminder: (id: string) => void;
  elderConfig: ElderAccessibilityConfig;
  onToggleLargeFont: () => void;
  onToggleHighContrast: () => void;
  onToggleSpeech: () => void;
  isSpeaking: boolean;
  onStopSpeech: () => void;
  onNavigate: (page: string) => void;
}

export const ElderCarePage: React.FC<ElderCarePageProps> = ({
  currentUser,
  reminders,
  onToggleReminder,
  elderConfig,
  onToggleLargeFont,
  onToggleHighContrast,
  onToggleSpeech,
  isSpeaking,
  onStopSpeech,
  onNavigate,
}) => {
  // Blood Pressure Logger
  const [systolic, setSystolic] = useState<number>(138);
  const [diastolic, setDiastolic] = useState<number>(86);
  const [bpMessage, setBpMessage] = useState<string>('Stage 1 Hypertension border. Limit table salt today.');

  // Sugar Tracker
  const [glucose, setGlucose] = useState<number>(132);
  const [mealType, setMealType] = useState<'fasting' | 'post-meal'>('fasting');

  // Quick SOS Confirmation Modal
  const [sosModalOpen, setSosModalOpen] = useState(false);

  const handleLogBp = () => {
    let msg = 'Normal Blood Pressure. Keep up your daily walks!';
    if (systolic >= 140 || diastolic >= 90) {
      msg = 'Stage 2 Hypertension detected. Notify your physician Dr. Marcus Sterling.';
    } else if (systolic >= 130 || diastolic >= 80) {
      msg = 'Stage 1 Hypertension. Drink a glass of water, rest for 10 minutes, and re-check.';
    }
    setBpMessage(msg);
    alert('Blood pressure recorded in health records!');
  };

  const speakElderInstructions = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Welcome to Senior Care. Your morning medications are Amlodipine 5mg. Your current blood pressure is ${systolic} over ${diastolic}. If you feel unwell or dizzy, press the red Emergency button at the top of the screen.`;
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Elder Care Banner */}
      <div className="bg-linear-to-r from-amber-700 via-orange-800 to-amber-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-amber-200 text-xs font-semibold mb-3 border border-white/20">
            <Heart className="w-3.5 h-3.5 text-amber-300" />
            <span>Senior Friendly • High Accessibility Mode</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Elder Care & Longevity Portal
          </h1>
          <p className="text-amber-100 text-sm mt-1 max-w-xl leading-relaxed">
            Simplified navigation, extra-large text, instant voice assistance, and direct emergency caregiver notifications.
          </p>
        </div>

        {/* Accessibility Toolbar */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onToggleLargeFont}
            className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              elderConfig.largeFont
                ? 'bg-amber-300 text-slate-950 ring-4 ring-amber-400'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Type className="w-5 h-5" />
            <span>{elderConfig.largeFont ? 'Large Font: ON' : 'Make Text Bigger'}</span>
          </button>

          <button
            onClick={speakElderInstructions}
            className="px-4 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:bg-amber-50 transition"
          >
            <Volume2 className="w-5 h-5 text-amber-600" />
            <span>Speak Page Aloud</span>
          </button>
        </div>
      </div>

      {/* Giant Emergency Alert Bar */}
      <div className="bg-linear-to-r from-red-600 to-rose-700 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-8 h-8 text-white animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">Need Urgent Medical Help?</h2>
            <p className="text-xs sm:text-sm text-red-100">
              One tap dispatches an emergency alert to your family and paramedic hotline (911).
            </p>
          </div>
        </div>

        <button
          onClick={() => setSosModalOpen(true)}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-red-700 hover:bg-red-50 font-black text-base sm:text-lg shadow-2xl transition transform hover:scale-105"
        >
          🚨 PRESS FOR SOS
        </button>
      </div>

      {/* Senior Vitals Trackers: Blood Pressure & Blood Sugar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Blood Pressure Tracker */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-600" />
              <span>Blood Pressure Monitor</span>
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
              Target: 120/80
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                Upper Number (Systolic)
              </label>
              <input
                type="number"
                value={systolic}
                onChange={e => setSystolic(Number(e.target.value))}
                className="w-full p-4 text-2xl font-black rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                Lower Number (Diastolic)
              </label>
              <input
                type="number"
                value={diastolic}
                onChange={e => setDiastolic(Number(e.target.value))}
                className="w-full p-4 text-2xl font-black rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm font-semibold text-amber-900">
            {bpMessage}
          </div>

          <button
            onClick={handleLogBp}
            className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm transition"
          >
            Save Today's Blood Pressure
          </button>
        </div>

        {/* Card 2: Blood Sugar Tracker */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-teal-600" />
              <span>Blood Glucose Level</span>
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-800">
              mg / dL
            </span>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
              Sugar Reading (mg/dL)
            </label>
            <input
              type="number"
              value={glucose}
              onChange={e => setGlucose(Number(e.target.value))}
              className="w-full p-4 text-2xl font-black rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setMealType('fasting')}
              className={`flex-1 py-3 rounded-2xl text-xs sm:text-sm font-bold border-2 transition ${
                mealType === 'fasting'
                  ? 'border-teal-600 bg-teal-50 text-teal-900'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              Morning Fasting
            </button>
            <button
              onClick={() => setMealType('post-meal')}
              className={`flex-1 py-3 rounded-2xl text-xs sm:text-sm font-bold border-2 transition ${
                mealType === 'post-meal'
                  ? 'border-teal-600 bg-teal-50 text-teal-900'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              2 Hours After Meal
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs sm:text-sm font-semibold text-teal-900">
            {mealType === 'fasting' && glucose <= 100
              ? 'Normal fasting blood sugar. Optimal insulin control!'
              : mealType === 'fasting' && glucose <= 125
              ? 'Prediabetic range. Take a 20-minute morning walk after breakfast.'
              : 'Above target. Avoid sugary beverages and take prescribed medications.'}
          </div>

          <button
            onClick={() => alert('Blood sugar logged successfully!')}
            className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm transition"
          >
            Save Sugar Reading
          </button>
        </div>
      </div>

      {/* Simplified Large Button Medication Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Pill className="w-6 h-6 text-sky-600" />
            <span>Senior Medication Cards (Tap When Taken)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Large high-contrast buttons designed for easy touch on tablet and phones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map(rem => (
            <div
              key={rem.id}
              onClick={() => onToggleReminder(rem.id)}
              className={`p-6 rounded-3xl border-2 transition cursor-pointer flex items-center justify-between ${
                rem.is_taken
                  ? 'bg-emerald-50 border-emerald-500 text-slate-700'
                  : 'bg-white border-slate-300 hover:border-amber-500 shadow-sm'
              }`}
            >
              <div className="space-y-1">
                <div className="text-xs uppercase font-extrabold text-amber-700 tracking-wider">
                  {rem.time_of_day} • {rem.scheduled_time}
                </div>
                <div className={`text-lg font-black ${rem.is_taken ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {rem.medicine_name}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                  {rem.dosage} — {rem.instructions}
                </div>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 transition ${
                  rem.is_taken
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 border-2 border-slate-300 text-slate-600'
                }`}
              >
                {rem.is_taken ? <CheckCircle2 className="w-8 h-8" /> : 'TAKE'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SOS Modal Simulation */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl border-4 border-red-600">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto animate-pulse">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-red-700">Confirm Emergency SOS</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              This will immediately send your current simulated GPS coordinates to your primary caregiver{' '}
              <strong>Sarah Jenkins (+1 555-234-8901)</strong> and open the direct line to local EMT Dispatch (911).
            </p>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  alert('Emergency SOS dispatched! Caregivers alerted and GPS coordinates shared.');
                  setSosModalOpen(false);
                }}
                className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-xl transition"
              >
                🚨 YES, DISPATCH EMERGENCY ALERT
              </button>
              <button
                onClick={() => setSosModalOpen(false)}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Cancel / False Alarm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
