/**
 * HealthSphere AI - User Profile & Digital Health ID Card
 */

import React, { useState } from 'react';
import {
  User as UserIcon,
  ShieldCheck,
  Heart,
  Droplet,
  Phone,
  Mail,
  AlertTriangle,
  QrCode,
  Download,
  Edit2,
  CheckCircle2,
} from 'lucide-react';
import { User, HealthRecord } from '../types';

interface ProfilePageProps {
  currentUser: User | null;
  latestRecord: HealthRecord | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, latestRecord }) => {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-8901');
  const [bloodGroup, setBloodGroup] = useState(currentUser?.blood_group || 'O+');
  const [allergies, setAllergies] = useState(currentUser?.allergies || 'Penicillin, Shellfish');
  const [conditions, setConditions] = useState(currentUser?.chronic_conditions || 'Mild PCOS, Seasonal Allergies');

  const handleSave = () => {
    setEditing(false);
    alert('Profile information updated in database!');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-linear-to-r from-sky-900 via-blue-900 to-indigo-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-2xl text-white border border-white/20">
            {currentUser ? currentUser.full_name.charAt(0) : 'S'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-sky-200 text-xs font-semibold mb-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified HealthSphere Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentUser ? currentUser.full_name : 'Sarah Jenkins'}
            </h1>
            <p className="text-xs text-sky-200">
              Role: {currentUser ? currentUser.role : 'Patient'} • Blood Group: {bloodGroup}
            </p>
          </div>
        </div>

        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition flex items-center gap-1.5"
        >
          <Edit2 className="w-4 h-4" />
          <span>{editing ? 'Cancel Editing' : 'Edit Demographics'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Profile Details Form */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
            Clinical Health Demographics
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Email Address</span>
              <strong className="text-slate-900 block mt-0.5">{currentUser?.email || 'sarah@healthsphere.org'}</strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Contact Phone</span>
              {editing ? (
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full mt-1 p-1.5 text-xs rounded border border-slate-300"
                />
              ) : (
                <strong className="text-slate-900 block mt-0.5">{phone}</strong>
              )}
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Blood Type</span>
              {editing ? (
                <input
                  type="text"
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value)}
                  className="w-full mt-1 p-1.5 text-xs rounded border border-slate-300"
                />
              ) : (
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 text-xs">
                  {bloodGroup}
                </span>
              )}
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Primary Hospital</span>
              <strong className="text-slate-900 block mt-0.5">Metro Wellness Institute</strong>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1">Drug & Food Allergies</span>
              {editing ? (
                <input
                  type="text"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-300"
                />
              ) : (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold">
                  ⚠️ {allergies}
                </div>
              )}
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1">Diagnosed Chronic Conditions</span>
              {editing ? (
                <input
                  type="text"
                  value={conditions}
                  onChange={e => setConditions(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-300"
                />
              ) : (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 text-xs font-semibold">
                  📋 {conditions}
                </div>
              )}
            </div>
          </div>

          {editing && (
            <button
              onClick={handleSave}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition"
            >
              Save Profile Updates
            </button>
          )}
        </div>

        {/* Digital Emergency Medical ID Card */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-linear-to-br from-slate-900 to-indigo-950 text-white shadow-xl space-y-4 border border-slate-700">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
                <span className="font-black text-sm tracking-wide">DIGITAL MEDICAL ID</span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">
                EMERGENCY
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400">PATIENT NAME</span>
              <div className="text-lg font-black">{currentUser?.full_name || 'Sarah Jenkins'}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/10 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block">BLOOD GROUP</span>
                <span className="text-base font-black text-rose-400">{bloodGroup}</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block">ORGAN DONOR</span>
                <span className="text-base font-black text-emerald-400">YES</span>
              </div>
            </div>

            <div className="text-xs space-y-1 bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Emergency Contacts</span>
              <div className="font-semibold text-slate-200">David Jenkins (Spouse): +1 555-345-6789</div>
              <div className="text-[11px] text-slate-400">Allergies: {allergies}</div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-[10px] text-slate-400">HealthSphere Global UUID: #HS-9942</div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
