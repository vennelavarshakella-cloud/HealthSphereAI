/**
 * HealthSphere AI - Patient & Family Clinical Dashboard
 */

import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Droplets,
  Moon,
  Footprints,
  Pill,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  User as UserIcon,
} from 'lucide-react';
import { User, HealthRecord, MedicineReminder, FamilyMember } from '../types';

interface DashboardPageProps {
  currentUser: User | null;
  records: HealthRecord[];
  reminders: MedicineReminder[];
  familyMembers: FamilyMember[];
  onNavigate: (page: string) => void;
  onToggleReminder: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  records,
  reminders,
  familyMembers,
  onNavigate,
  onToggleReminder,
}) => {
  const latestRecord = records[0] || null;

  // Adherence calculation
  const totalReminders = reminders.length;
  const takenReminders = reminders.filter(r => r.is_taken).length;
  const adherencePercent = totalReminders > 0 ? Math.round((takenReminders / totalReminders) * 100) : 100;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-sky-900 via-blue-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Preventive Care Cockpit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser ? currentUser.full_name : 'Sarah Jenkins'}
          </h1>
          <p className="text-sky-100/90 text-xs sm:text-sm max-w-xl">
            Here is your daily health telemetry. Your vitals are tracked against SDG Goal 3 standards for early risk interception.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('ai-guardian')}
            className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Health Assessment</span>
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-1.5"
          >
            <TrendingUp className="w-4 h-4 text-sky-300" />
            <span>Detailed Analytics</span>
          </button>
        </div>
      </div>

      {/* Main Vitals Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Health Score */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2 p-5 rounded-3xl bg-linear-to-br from-white to-sky-50/50 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Health Index</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Optimal
            </span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-slate-900">
              {latestRecord ? latestRecord.health_score : 92}
            </span>
            <span className="text-slate-400 text-sm font-semibold">/ 100</span>
          </div>
          <div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${latestRecord ? latestRecord.health_score : 92}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Low 10-year cardiovascular & metabolic risk score.
            </p>
          </div>
        </div>

        {/* Card 2: Blood Pressure */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Blood Pressure</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900">
              {latestRecord ? `${latestRecord.systolic_bp}/${latestRecord.diastolic_bp}` : '118/76'}
            </div>
            <span className="text-[10px] text-slate-400">mmHg</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
            Normal &lt; 120/80
          </span>
        </div>

        {/* Card 3: Blood Sugar */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Blood Sugar</span>
            <Activity className="w-4 h-4 text-teal-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900">
              {latestRecord ? latestRecord.blood_sugar_mg_dl : '94.0'}
            </div>
            <span className="text-[10px] text-slate-400">mg/dL Fasting</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
            Euglycemic Range
          </span>
        </div>

        {/* Card 4: Water Intake */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Hydration</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900">
              {latestRecord ? latestRecord.water_intake_liters : '2.4'}
            </div>
            <span className="text-[10px] text-slate-400">/ 2.5 Liters Goal</span>
          </div>
          <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full w-fit">
            96% of Target
          </span>
        </div>

        {/* Card 5: Sleep */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Rest & Sleep</span>
            <Moon className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900">
              {latestRecord ? latestRecord.sleep_hours : '7.5'}
            </div>
            <span className="text-[10px] text-slate-400">Hours Sleep</span>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit">
            Restorative
          </span>
        </div>
      </div>

      {/* Middle Row: Medication Reminders & Family Members Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Medication Schedule & Adherence */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Today's Medication Schedule</h3>
              <p className="text-xs text-slate-500">
                {takenReminders} of {totalReminders} taken today ({adherencePercent}% adherence streak)
              </p>
            </div>
            <button
              onClick={() => onNavigate('medicines')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {reminders.slice(0, 4).map(rem => (
              <div
                key={rem.id}
                onClick={() => onToggleReminder(rem.id)}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                  rem.is_taken
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                    : 'bg-white border-slate-200 hover:border-sky-300 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                      rem.is_taken
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {rem.is_taken && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${rem.is_taken ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {rem.medicine_name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {rem.dosage} • {rem.time_of_day} ({rem.scheduled_time})
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rem.is_taken
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {rem.is_taken ? 'Taken' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Family Member Quick Telemetry */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Family Health Network</h3>
            <button
              onClick={() => onNavigate('family')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>View Family</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {familyMembers.map(member => (
              <div
                key={member.id}
                onClick={() => onNavigate('family')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-sky-50/50 border border-slate-200/70 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{member.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {member.relationship} • {member.age} yrs • Blood {member.blood_group}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {member.chronic_conditions === 'None' ? 'Healthy' : 'Monitored'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('family')}
            className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-sky-500 text-slate-600 hover:text-sky-600 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Family Member Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
