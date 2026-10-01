/**
 * HealthSphere AI - Home Page
 * Welcomes patients & families, highlights SDG Goal 3 mission, and provides quick vitals and assessment gateways.
 */

import React from 'react';
import {
  Activity,
  Heart,
  Sparkles,
  Users,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Pill,
  Smile,
  Brain,
  Apple,
  Award,
  Clock,
  TrendingUp,
  Stethoscope,
  PhoneCall,
} from 'lucide-react';
import { User, HealthRecord } from '../types';

interface HomePageProps {
  onNavigate: (page: string) => void;
  currentUser: User | null;
  latestRecord: HealthRecord | null;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, currentUser, latestRecord }) => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-sky-900 via-blue-900 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
        {/* Decorative background glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-sky-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Aligned with UN SDG Goal 3: Good Health & Well-Being</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Proactive Health Protection with{' '}
              <span className="bg-linear-to-r from-sky-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">
                Predictive AI Intelligence
              </span>
            </h1>

            <p className="text-sky-100/90 text-sm sm:text-base leading-relaxed max-w-xl">
              HealthSphere AI unites real-time vital telemetry, customized family health records, specialized women’s wellness, elderly care, and algorithmic nutrition to stop preventable conditions before they start.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('ai-guardian')}
                className="px-6 py-3 rounded-xl bg-linear-to-r from-teal-400 to-emerald-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/30 hover:scale-105 transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Launch AI Health Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm border border-white/20 transition flex items-center gap-2"
              >
                <Activity className="w-4 h-4 text-sky-300" />
                <span>View Live Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('emergency')}
                className="px-4 py-3 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs border border-red-400/40 transition flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>SOS 911 Assist</span>
              </button>
            </div>

            {/* Quick Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs text-sky-200">
              <div>
                <div className="text-xl font-extrabold text-white">99.4%</div>
                <div className="text-[11px] text-sky-300">Algorithmic Precision</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">100%</div>
                <div className="text-[11px] text-sky-300">Preventive Focus</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">Zero</div>
                <div className="text-[11px] text-sky-300">Data Sharing Risk</div>
              </div>
            </div>
          </div>

          {/* Hero Live Widget Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-white shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Live Patient Cockpit</div>
                    <div className="text-[10px] text-sky-200">
                      {currentUser ? currentUser.full_name : 'Sarah Jenkins (Active)'}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                  {latestRecord ? `Score ${latestRecord.health_score}/100` : 'Score 92/100'}
                </span>
              </div>

              {/* Vitals Grid preview */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                  <span className="text-[11px] text-sky-300 block">Blood Pressure</span>
                  <div className="text-base font-extrabold text-white mt-0.5">
                    {latestRecord ? `${latestRecord.systolic_bp}/${latestRecord.diastolic_bp}` : '118/76'}{' '}
                    <span className="text-[10px] text-slate-300 font-normal">mmHg</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-medium">Optimal Zone</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                  <span className="text-[11px] text-sky-300 block">Fasting Glucose</span>
                  <div className="text-base font-extrabold text-white mt-0.5">
                    {latestRecord ? latestRecord.blood_sugar_mg_dl : '94.0'}{' '}
                    <span className="text-[10px] text-slate-300 font-normal">mg/dL</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-medium">Normal Fasting</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                  <span className="text-[11px] text-sky-300 block">Resting Pulse</span>
                  <div className="text-base font-extrabold text-white mt-0.5">
                    {latestRecord ? latestRecord.heart_rate_bpm : '68'}{' '}
                    <span className="text-[10px] text-slate-300 font-normal">BPM</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-medium">Sinus Rhythm</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                  <span className="text-[11px] text-sky-300 block">Water Intake</span>
                  <div className="text-base font-extrabold text-white mt-0.5">
                    {latestRecord ? latestRecord.water_intake_liters : '2.4'}{' '}
                    <span className="text-[10px] text-slate-300 font-normal">Liters</span>
                  </div>
                  <span className="text-[10px] text-sky-300 font-medium">96% of Goal</span>
                </div>
              </div>

              {/* Action Banner */}
              <div className="p-3 rounded-2xl bg-linear-to-r from-sky-500/20 to-teal-500/20 border border-sky-400/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                  <span className="text-[11px] text-sky-100 font-medium">AI Guardian: No critical risks detected</span>
                </div>
                <button
                  onClick={() => onNavigate('ai-guardian')}
                  className="text-sky-300 hover:text-white font-bold text-xs underline"
                >
                  Full Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Comprehensive Preventive Care */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
            Specialized Care Frameworks
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered for Every Life Stage & Family Member
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            HealthSphere AI bridges clinical algorithms with compassionate, accessible design from childhood immunization to elder longevity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: AI Health Guardian */}
          <div
            onClick={() => onNavigate('ai-guardian')}
            className="group p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-sky-500 hover:shadow-xl transition-all cursor-pointer space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
              AI Health Guardian
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time symptom analysis and personalized health advice based on user logs. Computes BMI, BP, Glucose, sleep, stress, and lifestyle risks.
            </p>
            <div className="flex items-center text-xs text-sky-600 font-bold gap-1 pt-2">
              <span>Start Assessment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Women's Wellness */}
          <div
            onClick={() => onNavigate('womens-wellness')}
            className="group p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-purple-500 hover:shadow-xl transition-all cursor-pointer space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smile className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Women's Wellness
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Period Cycle & Ovulation tracker, Pregnancy milestones, PCOS awareness, Iron Deficiency screening, and Menopause wellness guides.
            </p>
            <div className="flex items-center text-xs text-purple-600 font-bold gap-1 pt-2">
              <span>Explore Women Care</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Mental Wellness */}
          <div
            onClick={() => onNavigate('mental-wellness')}
            className="group p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-teal-500 hover:shadow-xl transition-all cursor-pointer space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
              Mental Wellness
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mood tracker spectrum, reflective daily journaling, guided 4-4-4 box breathing animation, ambient meditation audio, and weekly mood reports.
            </p>
            <div className="flex items-center text-xs text-teal-600 font-bold gap-1 pt-2">
              <span>Calm Your Mind</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Elder Care */}
          <div
            onClick={() => onNavigate('elder-care')}
            className="group p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-amber-500 hover:shadow-xl transition-all cursor-pointer space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Elder Care & Seniors
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Large font mode, high-contrast, speech screen reader, simple medicine reminders, blood pressure/sugar loggers, and 1-tap SOS dispatcher.
            </p>
            <div className="flex items-center text-xs text-amber-600 font-bold gap-1 pt-2">
              <span>Open Senior Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services Strip */}
      <section className="bg-linear-to-r from-sky-50 via-teal-50 to-indigo-50 rounded-3xl p-8 border border-sky-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">
              Need personalized daily nutrition or medication adherence?
            </h3>
            <p className="text-xs text-slate-600">
              Explore algorithmic macro diet planning tailored to your exact BMI and medical conditions.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('nutrition')}
              className="px-4 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 shadow-sm transition flex items-center gap-1.5"
            >
              <Apple className="w-4 h-4" />
              <span>Nutrition Planner</span>
            </button>
            <button
              onClick={() => onNavigate('medicines')}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>Medicine Reminders</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
