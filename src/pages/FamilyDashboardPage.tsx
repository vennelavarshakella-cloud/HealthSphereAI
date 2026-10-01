/**
 * HealthSphere AI - Family Health Dashboard Module
 * Manage multi-generational health records, vaccination schedules, allergy alerts, and emergency caregiver access.
 */

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Trash2,
  Calendar,
  Pill,
  Activity,
  Plus,
} from 'lucide-react';
import { User, FamilyMember, HealthRecord, MedicineReminder } from '../types';

interface FamilyDashboardPageProps {
  currentUser: User | null;
  familyMembers: FamilyMember[];
  onAddFamilyMember: (member: Partial<FamilyMember>) => void;
  onDeleteFamilyMember: (id: string) => void;
  records: HealthRecord[];
  reminders: MedicineReminder[];
}

export const FamilyDashboardPage: React.FC<FamilyDashboardPageProps> = ({
  currentUser,
  familyMembers,
  onAddFamilyMember,
  onDeleteFamilyMember,
  records,
  reminders,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Member Form state
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Child');
  const [age, setAge] = useState<number>(4);
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const selectedMember = familyMembers.find(f => f.id === selectedMemberId) || null;

  // Immunization schedule seed for demonstration
  const pediatricVaccinations = [
    { name: 'MMR (Measles, Mumps, Rubella)', milestone: 'Age 12-15 Months', status: 'Completed', date: '2023-04-10' },
    { name: 'DTaP (Diphtheria, Tetanus, Pertussis)', milestone: 'Age 4-6 Years Booster', status: 'Upcoming', date: '2026-11-20' },
    { name: 'Varicella (Chickenpox)', milestone: 'Age 4-6 Years Booster', status: 'Upcoming', date: '2026-11-20' },
    { name: 'Annual Seasonal Influenza', milestone: 'Annual Autumn Shot', status: 'Completed', date: '2025-10-15' },
  ];

  const seniorVaccinations = [
    { name: 'Pneumococcal Conjugate (PCV20)', milestone: 'Age 65+', status: 'Completed', date: '2024-05-12' },
    { name: 'Shingrix (Shingles 2-dose series)', milestone: 'Age 50+', status: 'Completed', date: '2024-08-20' },
    { name: 'Tdap (Tetanus booster)', milestone: 'Every 10 years', status: 'Upcoming', date: '2027-02-14' },
    { name: 'RSV Vaccine', milestone: 'Single Dose for Seniors', status: 'Completed', date: '2025-11-04' },
  ];

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAddFamilyMember({
      name,
      relationship,
      age: Number(age),
      gender,
      blood_group: bloodGroup,
      allergies: allergies || 'None',
      chronic_conditions: conditions || 'None',
      emergency_contact_phone: emergencyPhone,
    });
    setName('');
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="bg-linear-to-r from-sky-900 via-indigo-900 to-teal-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold mb-3 border border-sky-400/30">
            <Users className="w-3.5 h-3.5 text-sky-300" />
            <span>Family Caregiver Hub • Unified Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Family Health & Vaccination Dashboard
          </h1>
          <p className="text-sky-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Centralized health history, pediatrician immunization logs, chronic condition tracking, and emergency contacts for your entire household.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Family Members Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sarah Self Profile */}
        <div
          onClick={() => setSelectedMemberId(null)}
          className={`p-5 rounded-3xl border-2 transition cursor-pointer flex flex-col justify-between ${
            selectedMemberId === null
              ? 'bg-sky-50/80 border-sky-600 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
              S
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
              Primary Account
            </span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Sarah Jenkins</h4>
            <p className="text-xs text-slate-500">Self • 34 yrs • Blood O+</p>
            <span className="text-[11px] text-slate-600 mt-2 block font-medium">
              Conditions: Mild PCOS
            </span>
          </div>
        </div>

        {/* Other Family Members */}
        {familyMembers.map(member => {
          const isSelected = selectedMemberId === member.id;
          return (
            <div
              key={member.id}
              onClick={() => setSelectedMemberId(member.id)}
              className={`p-5 rounded-3xl border-2 transition cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-sky-50/80 border-sky-600 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                  {member.name.charAt(0)}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {member.relationship}
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (confirm(`Remove ${member.name}?`)) onDeleteFamilyMember(member.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition"
                    title="Delete Member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                <p className="text-xs text-slate-500">
                  {member.relationship} • {member.age} yrs • Blood {member.blood_group}
                </p>
                <span className="text-[11px] text-slate-600 mt-2 block font-medium truncate">
                  Allergies: {member.allergies || 'None'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Member Detailed View */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
          <div>
            <span className="text-xs uppercase font-extrabold text-sky-600 tracking-wider">
              Active Member Profile
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              {selectedMember ? selectedMember.name : 'Sarah Jenkins (Self)'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
              Emergency Phone:{' '}
              {selectedMember && selectedMember.emergency_contact_phone
                ? selectedMember.emergency_contact_phone
                : '+1 (555) 234-8901'}
            </span>
          </div>
        </div>

        {/* Immunization & Preventive Schedule */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Vaccination & Preventative Inoculation Ledger</span>
            </h4>
            <span className="text-xs text-slate-500">WHO / CDC Clinical Schedule</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(selectedMember && selectedMember.age >= 60 ? seniorVaccinations : pediatricVaccinations).map(
              (vac, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900">{vac.name}</div>
                    <div className="text-[11px] text-slate-500">Milestone: {vac.milestone}</div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        vac.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {vac.status}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{vac.date}</span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add Family Member Profile</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lily Jenkins"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={e => setRelationship(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Child">Child</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Sibling">Sibling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={emergencyPhone}
                    onChange={e => setEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Known Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Peanuts, Penicillin (or None)"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chronic Medical Conditions</label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension, Asthma (or None)"
                  value={conditions}
                  onChange={e => setConditions(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md"
                >
                  Save to Family Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
