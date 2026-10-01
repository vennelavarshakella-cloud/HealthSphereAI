/**
 * HealthSphere AI - Health Analytics & Telemetry Trends
 * Multi-day vital trajectories, blood pressure & glucose curves, BMI progression, and CSV/PDF export simulator.
 */

import React, { useState } from 'react';
import {
  Activity,
  Heart,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Droplets,
  Moon,
  Footprints,
} from 'lucide-react';
import { User, HealthRecord } from '../types';

interface HealthAnalyticsPageProps {
  currentUser: User | null;
  records: HealthRecord[];
}

export const HealthAnalyticsPage: React.FC<HealthAnalyticsPageProps> = ({ currentUser, records }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Simulated 7-day trend series for realistic clinical visualization
  const trendDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  const systolicData = [124, 122, 120, 119, 121, 118, 118];
  const diastolicData = [82, 80, 78, 76, 78, 76, 76];
  const glucoseData = [98, 96, 94, 95, 92, 94, 94];
  const sleepData = [6.8, 7.2, 7.5, 7.0, 7.8, 8.0, 7.5];

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Date,SystolicBP,DiastolicBP,Glucose,HeartRate,BMI,Sleep,Score\n';
    records.forEach(r => {
      csvContent += `${r.record_date},${r.systolic_bp},${r.diastolic_bp},${r.blood_sugar_mg_dl},${r.heart_rate_bpm},${r.bmi},${r.sleep_hours},${r.health_score}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'HealthSphere_Clinical_Telemetry.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="bg-linear-to-r from-sky-950 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold mb-3 border border-sky-400/30">
            <TrendingUp className="w-3.5 h-3.5 text-sky-300" />
            <span>Longitudinal Vital Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Predictive Health Analytics & Trends
          </h1>
          <p className="text-sky-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Correlate cardiovascular metrics, glycemic variance, and restorative sleep habits over time to track preventative health gains.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="bg-white/10 rounded-2xl p-1 flex">
            {(['7d', '30d', '90d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  timeRange === range
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-sky-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Blood Pressure Trend Visualizer */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <span>Blood Pressure Trend (Systolic vs Diastolic)</span>
              </h3>
              <p className="text-xs text-slate-500">Normal target: &lt; 120/80 mmHg</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowDownRight className="w-4 h-4" />
              <span>-4 mmHg (7d)</span>
            </span>
          </div>

          {/* Bar / Curve Visualizer */}
          <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-100">
            {trendDays.map((day, idx) => {
              const sys = systolicData[idx];
              const dia = diastolicData[idx];
              const sysHeight = ((sys - 100) / 40) * 100;
              const diaHeight = ((dia - 60) / 40) * 100;

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex justify-center gap-1 items-end h-36">
                    {/* Systolic Bar */}
                    <div
                      className="w-3 rounded-t-md bg-rose-500 hover:bg-rose-600 transition"
                      style={{ height: `${Math.max(15, sysHeight)}%` }}
                      title={`Systolic: ${sys} mmHg`}
                    />
                    {/* Diastolic Bar */}
                    <div
                      className="w-3 rounded-t-md bg-sky-400 hover:bg-sky-500 transition"
                      style={{ height: `${Math.max(15, diaHeight)}%` }}
                      title={`Diastolic: ${dia} mmHg`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-rose-500" />
              <span>Systolic (Average: 120 mmHg)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-sky-400" />
              <span>Diastolic (Average: 78 mmHg)</span>
            </div>
          </div>
        </div>

        {/* Blood Glucose Curve */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <span>Fasting Blood Glucose Stability</span>
              </h3>
              <p className="text-xs text-slate-500">Normal fasting range: 70 - 99 mg/dL</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Stable Euglycemia
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-100">
            {trendDays.map((day, idx) => {
              const gluc = glucoseData[idx];
              const height = ((gluc - 70) / 40) * 100;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex justify-center items-end h-36">
                    <div
                      className="w-6 rounded-t-lg bg-teal-500 hover:bg-teal-600 transition relative group"
                      style={{ height: `${Math.max(20, height)}%` }}
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-bold transition">
                        {gluc}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{day}</span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-100 text-xs text-teal-900">
            <strong>Clinical Note:</strong> Glycemic variability remains under 10%, indicating excellent insulin receptor sensitivity and low post-prandial oxidative stress.
          </div>
        </div>
      </div>

      {/* Raw Health Records History Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Health Records Ledger (MySQL Table: `health_records`)</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">BP (mmHg)</th>
                <th className="py-3 px-2">Glucose (mg/dL)</th>
                <th className="py-3 px-2">Pulse (BPM)</th>
                <th className="py-3 px-2">BMI</th>
                <th className="py-3 px-2">Sleep</th>
                <th className="py-3 px-2">Health Score</th>
                <th className="py-3 px-2">Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-2 font-medium text-slate-900">{r.record_date}</td>
                  <td className="py-3 px-2">{r.systolic_bp} / {r.diastolic_bp}</td>
                  <td className="py-3 px-2">{r.blood_sugar_mg_dl}</td>
                  <td className="py-3 px-2">{r.heart_rate_bpm}</td>
                  <td className="py-3 px-2">{r.bmi}</td>
                  <td className="py-3 px-2">{r.sleep_hours} hrs</td>
                  <td className="py-3 px-2 font-bold text-sky-700">{r.health_score} / 100</td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.risk_level === 'low'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.risk_level === 'moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {r.risk_level.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
