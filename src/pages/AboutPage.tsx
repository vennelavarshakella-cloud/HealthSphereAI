/**
 * HealthSphere AI - About Page
 * Detailing UN SDG Goal 3 compliance, clinical philosophy, and architecture.
 */

import React from 'react';
import {
  Heart,
  ShieldCheck,
  Target,
  Sparkles,
  Globe,
  Database,
  Award,
  Users,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Target className="w-3.5 h-3.5 text-emerald-600" />
          <span>United Nations Sustainable Development Goal 3</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Good Health and Well-Being for All at All Ages
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          HealthSphere AI was developed to shift the healthcare paradigm from reactive sick-care to proactive, AI-assisted preventive wellness.
        </p>
      </div>

      {/* SDG 3 Target Alignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-linear-to-br from-emerald-50 via-teal-50 to-white border border-emerald-200/80 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
            3.4
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Target 3.4: Reduce Mortality from NCDs & Foster Mental Health
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            By 2030, reduce by one third premature mortality from non-communicable diseases (cardiovascular disease, diabetes, hypertension) through prevention and treatment, and promote mental health and well-being.
          </p>
          <div className="pt-2 text-xs text-emerald-800 font-semibold space-y-1.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real-time cardiovascular telemetry & glucose monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Interactive box breathing & mindfulness stress reduction</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-linear-to-br from-sky-50 via-blue-50 to-white border border-sky-200/80 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-lg">
            3.8
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Target 3.8: Universal Health Coverage & Quality Preventive Services
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Achieve universal health coverage, including financial risk protection, access to quality essential healthcare services, and access to safe, effective, quality, and affordable essential medicines for all.
          </p>
          <div className="pt-2 text-xs text-sky-800 font-semibold space-y-1.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>Inclusive Elder Care with voice readers and high-contrast modes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>Free, accessible AI nutrition planning for diverse budgets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xs border border-slate-200/80 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-6 h-6 text-sky-600" />
          <span>Full-Stack Architecture & Normalized Database</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Frontend Engineering</h4>
            <p>
              Built with HTML5, CSS3, modern Vanilla JS / React SPA on Vite, styled with Tailwind CSS, Lucide icons, and web accessibility standards (ARIA).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Backend & MVC Architecture</h4>
            <p>
              Express full-stack REST server adhering to MVC principles with secure session tokens, form validation, and server-side Gemini 3.8 Flash AI.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">MySQL & PostgreSQL Schema</h4>
            <p>
              12 fully normalized tables with primary and foreign key constraints: `users`, `family_members`, `health_records`, `womens_health_logs`, and `nutrition_plans`.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
