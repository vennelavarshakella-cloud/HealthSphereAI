/**
 * HealthSphere AI - Footer Component
 * Aligned with UN SDG Goal 3: Good Health and Well-Being
 */

import React from 'react';
import { Activity, ShieldCheck, Heart, Phone, Mail, MapPin, ExternalLink, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs mt-20">
      {/* SDG 3 Impact Highlight */}
      <div className="bg-linear-to-r from-emerald-900/60 via-teal-900/60 to-sky-900/60 border-b border-emerald-500/20 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Heart className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                United Nations SDG Goal 3: Ensure Healthy Lives and Promote Well-Being for All at All Ages
              </h4>
              <p className="text-slate-300 text-xs mt-0.5">
                Target 3.4 (Reduce premature mortality from non-communicable diseases by 33% through prevention & mental health) & Target 3.8 (Universal health coverage).
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('about')}
            className="whitespace-nowrap px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition"
          >
            Learn Our SDG Mission
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">HealthSphere AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-sm mb-4">
              A full-stack, AI-powered smart preventive healthcare platform designed to empower individuals, families, women, and elders with real-time risk predictions, nutrition planning, and proactive medical guidance.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">MySQL & PostgreSQL MVC</span>
              <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Gemini 3.8 Flash AI</span>
              <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">ISO 27001 Clinical Standard</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Clinical Modules</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('ai-guardian')} className="hover:text-white transition">AI Health Guardian</button>
              </li>
              <li>
                <button onClick={() => onNavigate('womens-wellness')} className="hover:text-white transition">Women's Wellness</button>
              </li>
              <li>
                <button onClick={() => onNavigate('mental-wellness')} className="hover:text-white transition">Mental Health & Box Breath</button>
              </li>
              <li>
                <button onClick={() => onNavigate('elder-care')} className="hover:text-white transition">Elder Care & Voice Mode</button>
              </li>
              <li>
                <button onClick={() => onNavigate('family')} className="hover:text-white transition">Family Health Dashboard</button>
              </li>
            </ul>
          </div>

          {/* Tools & Planning */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Tools & Systems</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('nutrition')} className="hover:text-white transition">AI Nutrition Planner</button>
              </li>
              <li>
                <button onClick={() => onNavigate('medicines')} className="hover:text-white transition">Medicine Adherence Reminders</button>
              </li>
              <li>
                <button onClick={() => onNavigate('emergency')} className="hover:text-rose-400 text-rose-300 font-semibold transition">Emergency SOS 911</button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="hover:text-white transition">Vital Trends & Analytics</button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition">Admin & Database Inspector</button>
              </li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Emergency Lines</h5>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-200">
                <span className="font-bold block text-red-400">Emergency Dispatch:</span>
                <span className="text-sm font-extrabold text-white">911 / 112 / 108</span>
              </div>
              <div className="text-slate-400">
                <span className="block font-medium text-slate-300">Poison Control:</span>
                <span>1-800-222-1222</span>
              </div>
              <div className="text-slate-400">
                <span className="block font-medium text-slate-300">Mental Crisis Hotline:</span>
                <span>988 (Lifeline 24/7)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer & Copyright */}
        <div className="border-t border-slate-800 mt-10 pt-6 text-slate-500 text-[11px] leading-relaxed flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="max-w-3xl">
            <strong className="text-slate-400">Clinical Disclaimer:</strong> HealthSphere AI provides predictive health analytics, educational nutrition planning, and symptom triage for preventive wellness purposes under SDG Goal 3 guidelines. It is not an alternative to acute medical diagnosis or clinical doctor consultation. In acute emergencies, contact emergency services immediately.
          </p>
          <div className="flex gap-4 text-slate-400 whitespace-nowrap">
            <button onClick={() => onNavigate('about')} className="hover:underline">About</button>
            <button onClick={() => onNavigate('services')} className="hover:underline">Services</button>
            <button onClick={() => onNavigate('contact')} className="hover:underline">Contact</button>
            <button onClick={() => onNavigate('admin')} className="hover:underline">DB Schema</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
