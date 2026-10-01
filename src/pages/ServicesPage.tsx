/**
 * HealthSphere AI - Services Directory Page
 * Exhaustive catalog of all 18 preventive clinical services with one-click direct access.
 */

import React from 'react';
import {
  Sparkles,
  Heart,
  Smile,
  Brain,
  Pill,
  Apple,
  ShieldAlert,
  Activity,
  Users,
  Calendar,
  PhoneCall,
  Database,
  UserCheck,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const serviceList = [
    {
      id: 'ai-guardian',
      title: 'AI Health Guardian Assessment',
      category: 'Clinical AI',
      desc: 'Real-time multi-vital evaluation computing health scores, cardiovascular risk, and preventive lifestyle advice.',
      icon: Sparkles,
      color: 'bg-sky-100 text-sky-600',
    },
    {
      id: 'womens-wellness',
      title: "Women's Wellness & Period Tracker",
      category: 'Specialized Care',
      desc: 'Menstrual cycle phases, pregnancy milestones, PCOS symptom logging, and ferritin iron deficiency triage.',
      icon: Smile,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'mental-wellness',
      title: 'Mental Wellness & Box Breathing',
      category: 'Stress Regulation',
      desc: 'Emotional spectrum tracking, reflective daily journaling, guided 4-4-4 box breathing, and meditation audio.',
      icon: Brain,
      color: 'bg-teal-100 text-teal-600',
    },
    {
      id: 'elder-care',
      title: 'Elder Care & Senior Longevity',
      category: 'Accessibility',
      desc: 'High-contrast large text, text-to-speech screen reading, blood pressure/sugar loggers, and 1-tap SOS.',
      icon: Heart,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      id: 'family',
      title: 'Family Health & Immunization Ledger',
      category: 'Caregiver Hub',
      desc: 'Unified household health records, pediatric immunization schedules, allergy registries, and shared profiles.',
      icon: Users,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 'nutrition',
      title: 'AI Nutrition & Daily Macro Planner',
      category: 'Metabolic Health',
      desc: 'Customized meal plans calculated from BMI, health conditions, budget tier, and vegetarian/vegan preferences.',
      icon: Apple,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      id: 'medicines',
      title: 'Medicine Reminders & Adherence',
      category: 'Medication Safety',
      desc: 'Time-of-day medication cards, audible chime alerts, adherence percentage streaks, and refill warnings.',
      icon: Pill,
      color: 'bg-rose-100 text-rose-600',
    },
    {
      id: 'emergency',
      title: 'Emergency Assistance & First Aid Guide',
      category: 'Urgent Dispatch',
      desc: 'Panic siren audio, GPS dispatcher simulation, CPR hands-only guide, stroke FAST protocol, and burn care.',
      icon: ShieldAlert,
      color: 'bg-red-100 text-red-600',
    },
    {
      id: 'analytics',
      title: 'Longitudinal Vital Analytics',
      category: 'Telemetry',
      desc: 'Blood pressure and glucose curves, weight trajectories, sleep adherence, and CSV health record exports.',
      icon: Activity,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'community',
      title: 'Community Forums & Doctor Q&A',
      category: 'Social Support',
      desc: 'Engage with peer support networks for cardiovascular care, diabetes management, and expert doctor threads.',
      icon: Users,
      color: 'bg-cyan-100 text-cyan-600',
    },
    {
      id: 'admin',
      title: 'Admin Cockpit & Database Inspector',
      category: 'Platform Operations',
      desc: 'Inspect normalized MySQL/PostgreSQL schema, inspect live table records, and audit system health.',
      icon: Database,
      color: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'profile',
      title: 'User Profile & Digital Health ID',
      category: 'Identity',
      desc: 'Emergency contact configuration, blood group identification card, allergy warnings, and personal history.',
      icon: UserCheck,
      color: 'bg-teal-100 text-teal-700',
    },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="text-center space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
          Comprehensive Clinical Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          18 Core Preventive Healthcare Services
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Explore all integrated features designed to support personal wellness, family caregiving, women's health, and senior longevity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceList.map(srv => {
          const Icon = srv.icon;
          return (
            <div
              key={srv.id}
              onClick={() => onNavigate(srv.id)}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-500 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${srv.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {srv.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {srv.desc}
                </p>
              </div>

              <div className="flex items-center text-xs text-sky-600 font-bold gap-1 pt-2 border-t border-slate-100">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
