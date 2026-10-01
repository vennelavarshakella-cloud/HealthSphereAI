/**
 * HealthSphere AI - Medicine Reminder & Adherence Tracker
 */

import React, { useState } from 'react';
import {
  Pill,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  Bell,
  Volume2,
  Calendar,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { User, MedicineReminder, FamilyMember } from '../types';

interface MedicineReminderPageProps {
  currentUser: User | null;
  reminders: MedicineReminder[];
  familyMembers: FamilyMember[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: Partial<MedicineReminder>) => void;
}

export const MedicineReminderPage: React.FC<MedicineReminderPageProps> = ({
  currentUser,
  reminders,
  familyMembers,
  onToggleReminder,
  onAddReminder,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [frequency, setFrequency] = useState('Once daily');
  const [timeOfDay, setTimeOfDay] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Bedtime'>('Morning');
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [instructions, setInstructions] = useState('Take with food');
  const [assignedMemberId, setAssignedMemberId] = useState<string>('');

  const takenCount = reminders.filter(r => r.is_taken).length;
  const totalCount = reminders.length;
  const adherence = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAddReminder({
      user_id: currentUser ? currentUser.id : 'usr_001',
      family_member_id: assignedMemberId || null,
      medicine_name: name,
      dosage,
      frequency,
      time_of_day: timeOfDay,
      scheduled_time: scheduledTime,
      instructions,
    });
    setName('');
    setModalOpen(false);
  };

  const playChime = () => {
    // Web Audio API simple pleasant chime
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.log('AudioContext not supported');
    }
  };

  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Bedtime'] as const;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="bg-linear-to-r from-sky-900 via-blue-900 to-indigo-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold mb-3 border border-sky-400/30">
            <Pill className="w-3.5 h-3.5 text-sky-300" />
            <span>Prescription & Adherence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Medicine Reminders & Schedule
          </h1>
          <p className="text-sky-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Stay on track with zero missed doses. Features dosage safety instructions, adherence streaks, and audio reminder chimes.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              playChime();
              alert('🔔 Audio Chime Simulated: Reminder alert tone!');
            }}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-2"
            title="Test reminder chime"
          >
            <Volume2 className="w-4 h-4 text-sky-300" />
            <span>Test Chime</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication</span>
          </button>
        </div>
      </div>

      {/* Adherence Progress Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Today's Adherence Rate</h3>
            <p className="text-xs text-slate-500">
              {takenCount} of {totalCount} medications taken on time
            </p>
          </div>
          <span className="text-2xl font-black text-sky-600">{adherence}%</span>
        </div>

        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ${
              adherence >= 80 ? 'bg-emerald-500' : adherence >= 50 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${adherence}%` }}
          />
        </div>
      </div>

      {/* Time-of-Day Categorized Cards */}
      <div className="space-y-6">
        {timeSlots.map(slot => {
          const slotReminders = reminders.filter(r => r.time_of_day === slot);
          if (slotReminders.length === 0) return null;

          return (
            <div key={slot} className="space-y-3">
              <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>{slot} Medications</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slotReminders.map(rem => (
                  <div
                    key={rem.id}
                    onClick={() => {
                      onToggleReminder(rem.id);
                      if (!rem.is_taken) playChime();
                    }}
                    className={`p-5 rounded-3xl border-2 transition cursor-pointer flex items-center justify-between ${
                      rem.is_taken
                        ? 'bg-emerald-50/60 border-emerald-400 text-slate-700'
                        : 'bg-white border-slate-200 hover:border-sky-400 shadow-xs'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {rem.scheduled_time}
                        </span>
                        {rem.family_member_id && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            Robert (Grandfather)
                          </span>
                        )}
                      </div>
                      <div className={`text-base font-bold ${rem.is_taken ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {rem.medicine_name}
                      </div>
                      <div className="text-xs text-slate-600">
                        {rem.dosage} • {rem.frequency}
                      </div>
                      <p className="text-[11px] text-slate-500 italic">
                        Tip: {rem.instructions}
                      </p>
                    </div>

                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition shrink-0 ${
                        rem.is_taken
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Medication Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add New Prescription / Vitamin</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Medication Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CoQ10 200mg or Metformin"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dosage Form</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 Tablet or 500mg"
                    value={dosage}
                    onChange={e => setDosage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={e => setFrequency(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="As needed (PRN)">As needed (PRN)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time of Day</label>
                  <select
                    value={timeOfDay}
                    onChange={e => setTimeOfDay(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Bedtime">Bedtime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Take with warm meal; do not crush"
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md"
                >
                  Add to Medication Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
