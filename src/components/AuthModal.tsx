/**
 * HealthSphere AI - Authentication & Demo Switcher Modal
 */

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, Heart, Sparkles, Check } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'patient' | 'elder' | 'caregiver' | 'admin'>('patient');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName,
            email,
            password,
            role,
            blood_group: bloodGroup,
            phone,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        onLoginSuccess(data.user, data.token);
        onClose();
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        onLoginSuccess(data.user, data.token);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'demo' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Demo login failed');
      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-sky-600 via-blue-600 to-teal-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold">
            {isRegister ? 'Join HealthSphere AI' : 'Welcome to HealthSphere'}
          </h3>
          <p className="text-sky-100 text-xs mt-1">
            Preventive healthcare cockpit adhering to SDG Goal 3 standards
          </p>
        </div>

        {/* Demo Fast Logins Banner */}
        <div className="bg-sky-50/70 p-4 border-b border-sky-100">
          <div className="text-[11px] font-bold text-sky-900 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Instant 1-Click Demo Profiles:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('sarah@healthsphere.org')}
              className="p-2 rounded-xl bg-white border border-sky-200 text-left hover:border-sky-500 hover:shadow-xs transition"
            >
              <div className="text-xs font-bold text-slate-800">Sarah J.</div>
              <div className="text-[10px] text-sky-600 font-medium">Patient / Mother</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('robert@healthsphere.org')}
              className="p-2 rounded-xl bg-white border border-amber-200 text-left hover:border-amber-500 hover:shadow-xs transition"
            >
              <div className="text-xs font-bold text-slate-800">Robert J.</div>
              <div className="text-[10px] text-amber-600 font-medium">Elder (75y)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@healthsphere.org')}
              className="p-2 rounded-xl bg-white border border-teal-200 text-left hover:border-teal-500 hover:shadow-xs transition"
            >
              <div className="text-xs font-bold text-slate-800">Dr. Vance</div>
              <div className="text-[10px] text-teal-600 font-medium">Admin & CMO</div>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Chen"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@healthsphere.org"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                >
                  <option value="patient">Patient / Individual</option>
                  <option value="elder">Senior / Elder Care</option>
                  <option value="caregiver">Family Caregiver</option>
                  <option value="admin">Clinical Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                >
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Connecting securely...</span>
            ) : isRegister ? (
              <span>Create Account</span>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-xs text-sky-600 hover:underline font-semibold"
            >
              {isRegister
                ? 'Already have an account? Sign in'
                : "Don't have an account? Register new profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
