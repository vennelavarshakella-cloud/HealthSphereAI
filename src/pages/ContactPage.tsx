/**
 * HealthSphere AI - Contact & Clinical Support Page
 */

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Heart,
  ShieldCheck,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Preventive Consultation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="text-center space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
          24/7 Global Care & Inquiries
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Connect with HealthSphere AI Support
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Reach our clinical advisory board, report urgent health record issues, or request SDG 3 institutional partnerships.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Send an Inquiry or Medical Feedback
          </h3>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900 text-sm">Message Delivered Successfully</h4>
              <p className="text-xs text-emerald-700">
                Our clinical support triage team will review your inquiry and respond to {email} within 4 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs text-emerald-800 underline font-bold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@healthsphere.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Department</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Preventive Consultation">Preventive Medicine Consultation</option>
                  <option value="Women Wellness">Women's Wellness & Prenatal</option>
                  <option value="Elder Care Support">Elder Care & Accessibility Support</option>
                  <option value="Technical Database">Technical & Database Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your inquiry, question, or clinical observation in detail..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Secure Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Clinical Centers & Helplines */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Emergency & Rapid Triage</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Critical Emergency:</strong>
                  <span className="text-slate-600">Dial 911 / 112 (24/7 Dispatch)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Clinical Desk:</strong>
                  <span className="text-slate-600">support@healthsphere.org</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Headquarters:</strong>
                  <span className="text-slate-600">450 Preventive Health Parkway, Suite 800</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
