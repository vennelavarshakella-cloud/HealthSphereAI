/**
 * HealthSphere AI - Admin Dashboard & MySQL/PostgreSQL Database Inspector
 * Live table records inspector, raw SQL schema DDL viewer, and system metrics.
 */

import React, { useState, useEffect } from 'react';
import {
  Database,
  Users,
  ShieldCheck,
  Server,
  Code,
  Activity,
  Layers,
  Search,
  RefreshCw,
  Table as TableIcon,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'tables' | 'sql' | 'ai-training'>('metrics');
  const [metrics, setMetrics] = useState<any>(null);
  const [dbData, setDbData] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState<string>('users');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [m, d] = await Promise.all([api.getAdminMetrics(), api.getDatabaseSchema()]);
      setMetrics(m);
      setDbData(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tableList = [
    'users',
    'family_members',
    'health_records',
    'womens_health_logs',
    'mood_tracker_logs',
    'medicine_reminders',
    'nutrition_plans',
    'appointments',
    'emergency_contacts',
    'health_reports',
    'notifications',
    'community_posts',
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold mb-3 border border-sky-400/30">
            <Server className="w-3.5 h-3.5 text-teal-300" />
            <span>PostgreSQL & MySQL Normalized Data Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Admin Cockpit & Database Inspector
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Inspect live relational tables, verify primary and foreign key constraints, and monitor system metrics.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'metrics'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System & Table Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'tables'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TableIcon className="w-4 h-4" />
          <span>Live Relational Tables Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'sql'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Raw SQL DDL Schema</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-training')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'ai-training'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI Chatbot Training Kit</span>
        </button>
      </div>

      {/* Tab 1: System Metrics & Table Counts */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs uppercase font-extrabold text-slate-400">Database Engine</span>
              <div className="text-lg font-black text-slate-900 mt-1">MySQL / PostgreSQL</div>
              <span className="text-[10px] text-emerald-600 font-bold">Normalized 3NF</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs uppercase font-extrabold text-slate-400">Total Records</span>
              <div className="text-2xl font-black text-sky-600 mt-1">
                {metrics?.stats?.total_records || 36}
              </div>
              <span className="text-[10px] text-slate-500">Across 12 tables</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs uppercase font-extrabold text-slate-400">AI Diagnostics</span>
              <div className="text-lg font-black text-slate-900 mt-1">Gemini 3.8 Flash</div>
              <span className="text-[10px] text-teal-600 font-bold">Server-side Active</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs uppercase font-extrabold text-slate-400">Global Standard</span>
              <div className="text-lg font-black text-slate-900 mt-1">UN SDG Goal 3</div>
              <span className="text-[10px] text-indigo-600 font-bold">Good Health & Well-Being</span>
            </div>
          </div>

          {/* Table Breakdown Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Relational Database Table Inventory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(metrics?.stats?.tables || []).map((tbl: any) => (
                <div
                  key={tbl.name}
                  onClick={() => {
                    setSelectedTable(tbl.name);
                    setActiveTab('tables');
                  }}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-sky-50/50 border border-slate-200/70 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 font-mono">{tbl.name}</div>
                    <div className="text-[10px] text-slate-500">PK: {tbl.primary_key}</div>
                  </div>
                  <span className="text-xs font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full">
                    {tbl.count} rows
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Live Relational Tables Inspector */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          {/* Table Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {tableList.map(tbl => (
              <button
                key={tbl}
                onClick={() => setSelectedTable(tbl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                  selectedTable === tbl
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tbl}
              </button>
            ))}
          </div>

          {/* Table Content */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-mono">Table: {selectedTable}</h3>
                <p className="text-xs text-slate-500">
                  Showing live normalized records stored in database engine
                </p>
              </div>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                {(dbData?.tables?.[selectedTable] || []).length} Records
              </span>
            </div>

            <div className="overflow-x-auto">
              {(!dbData?.tables?.[selectedTable] || dbData.tables[selectedTable].length === 0) ? (
                <p className="text-xs text-slate-400 py-6 text-center">No records logged in this table yet.</p>
              ) : (
                <table className="w-full text-xs text-left border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px]">
                      {Object.keys(dbData.tables[selectedTable][0]).map(col => (
                        <th key={col} className="py-2.5 px-3 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dbData.tables[selectedTable].map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        {Object.values(row).map((val: any, cidx: number) => (
                          <td key={cidx} className="py-2.5 px-3 max-w-xs truncate text-slate-700">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Raw SQL DDL Schema */}
      {activeTab === 'sql' && (
        <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">server/db/schema.sql (MySQL & PostgreSQL DDL)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">12 Normalized Tables (3NF)</span>
          </div>

          <pre className="p-4 bg-black/60 rounded-2xl border border-slate-800 overflow-x-auto text-[11px] leading-relaxed text-emerald-300/90 max-h-[600px] overflow-y-auto">
            {dbData?.sql || '-- Loading schema.sql...'}
          </pre>
        </div>
      )}

      {/* Tab 4: AI Chatbot Training Kit & Knowledge Base */}
      {activeTab === 'ai-training' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-linear-to-r from-purple-900 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-2">
            <span className="text-xs uppercase font-extrabold text-amber-300 tracking-wider">
              Clinical Fine-Tuning & Knowledge Base Manual
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">
              HealthSphere AI Chatbot Training Kit
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 max-w-2xl leading-relaxed">
              Use these clinical instructions, safety redlines, and JSONL formatted conversation pairs to train or fine-tune models (Gemini 3.8 Flash, LLaMA, OpenAI, or Mistral) or populate vector databases for RAG.
            </p>
          </div>

          {/* Section 1: System Instruction */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">1. Master System Instruction (Persona & Guardrails)</h3>
                <p className="text-xs text-slate-500">Inject as the `system_instruction` parameter in your AI model</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`You are HealthSphere AI, a senior preventive clinical health guardian aligned with UN Sustainable Development Goal 3: Good Health and Well-Being (specifically Targets 3.4 and 3.8).\n\nCore Mission:\n- Deliver compassionate, evidence-based preventive health education.\n- Interpret vital telemetry (BP, Fasting Glucose, BMI, Resting Heart Rate, Sleep, Water).\n- Provide specialized guidance for Women's Wellness (cycle phases, PCOS, pregnancy, ferritin iron deficiency), Elder Care, Mental Wellness (box breathing, vagus nerve), and Personalized Nutrition.\n\nAbsolute Safety Guardrails:\n1. Non-Diagnostic Triage: Never provide an authoritative medical diagnosis; always recommend consulting a licensed physician.\n2. Acute Emergency Escalation: If user reports crushing chest pain, stroke symptoms (FAST: Face, Arms, Speech, Time), severe dyspnea, or suicidal thoughts, IMMEDIATELY halt conversational analysis and instruct them to call Emergency Services (911 / 112 / 988).\n3. Pharmacology Boundaries: Explain mechanism of action and adherence tips only; NEVER adjust prescription dosages or tell users to stop prescribed medicines.\n4. Tone: Empathetic, professional, plain-spoken, reassuring.`);
                  alert('System prompt copied to clipboard!');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition"
              >
                Copy System Prompt
              </button>
            </div>

            <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto">
              {`You are HealthSphere AI, a senior preventive clinical health guardian aligned with UN Sustainable Development Goal 3: Good Health and Well-Being (specifically Targets 3.4 and 3.8).

Core Mission:
- Deliver compassionate, evidence-based preventive health education.
- Interpret vital telemetry (BP, Fasting Glucose, BMI, Resting Heart Rate, Sleep, Water).
- Provide specialized guidance for Women's Wellness (cycle phases, PCOS, pregnancy, ferritin iron deficiency), Elder Care, Mental Wellness (box breathing, vagus nerve), and Personalized Nutrition.

Absolute Safety Guardrails:
1. Non-Diagnostic Triage: Never provide an authoritative medical diagnosis; always recommend consulting a licensed physician.
2. Acute Emergency Escalation: If user reports crushing chest pain, stroke symptoms (FAST: Face, Arms, Speech, Time), severe dyspnea, or suicidal thoughts, IMMEDIATELY halt conversational analysis and instruct them to call Emergency Services (911 / 112 / 988).
3. Pharmacology Boundaries: Explain mechanism of action and adherence tips only; NEVER adjust prescription dosages or tell users to stop prescribed medicines.
4. Tone: Empathetic, professional, plain-spoken, reassuring.`}
            </div>
          </div>

          {/* Section 2: Clinical Thresholds Matrix */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              2. Clinical Knowledge Base Thresholds (Ground Truth)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-rose-700 block text-sm">Blood Pressure (AHA 2025)</span>
                <p>• <strong>Normal:</strong> &lt; 120/80 mmHg</p>
                <p>• <strong>Elevated:</strong> 120–129 / &lt; 80 mmHg (Dietary sodium &lt; 2000mg)</p>
                <p>• <strong>Stage 1:</strong> 130–139 or 80–89 mmHg (Lifestyle + clinical review)</p>
                <p>• <strong>Stage 2:</strong> ≥ 140 or ≥ 90 mmHg (Physician consultation)</p>
                <p>• <strong>Crisis:</strong> &gt; 180 and/or &gt; 120 mmHg (Immediate Emergency 911)</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-teal-700 block text-sm">Fasting Glucose & Ferritin</span>
                <p>• <strong>Normal Fasting Glucose:</strong> 70 – 99 mg/dL</p>
                <p>• <strong>Prediabetes:</strong> 100 – 125 mg/dL (Zone 2 cardio, low GI meals)</p>
                <p>• <strong>Diabetic Range:</strong> ≥ 126 mg/dL (Requires HbA1c test)</p>
                <p>• <strong>Ferritin Optimal:</strong> &gt; 50 ng/mL (Target for active women)</p>
                <p>• <strong>Latent Iron Depletion:</strong> &lt; 30 ng/mL (Pair plant iron + Vit C)</p>
              </div>
            </div>
          </div>

          {/* Section 3: Fine-Tuning JSONL Dataset */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">3. Fine-Tuning Dataset (JSONL Multi-Turn Conversations)</h3>
                <p className="text-xs text-slate-500">Ready for Gemini fine-tuning, OpenAI fine-tuning, or LLaMA LoRA training</p>
              </div>
              <button
                onClick={() => {
                  const dataset = `{"messages": [{"role": "system", "content": "You are HealthSphere AI, a preventive health guardian aligned with SDG Goal 3."}, {"role": "user", "content": "I measured my blood pressure this morning and it was 138/88. Should I be worried?"}, {"role": "assistant", "content": "A reading of 138/88 mmHg falls into Stage 1 Hypertension. While not an acute emergency (provided you have no severe chest pain or shortness of breath), it indicates increased vascular resistance. Rest for 10 minutes, take a second reading, keep daily sodium under 2000mg, and log readings for 7 days to share with your physician."}]}
{"messages": [{"role": "system", "content": "You are HealthSphere AI, a preventive health guardian aligned with SDG Goal 3."}, {"role": "user", "content": "I have been feeling dizzy, my hands are cold, and afternoon fatigue is severe despite 8 hours of sleep."}, {"role": "assistant", "content": "These symptoms are classic indicators of latent iron deficiency or depleted serum ferritin stores. Standard CBC tests can show normal hemoglobin while ferritin is depleted below 30 ng/mL. Ask your doctor for a full iron panel including Serum Ferritin and TIBC, and pair dietary iron with Vitamin C."}]}
{"messages": [{"role": "system", "content": "You are HealthSphere AI, a preventive health guardian aligned with SDG Goal 3."}, {"role": "user", "content": "My left chest feels heavy like an elephant is sitting on it, and pain is radiating to my jaw."}, {"role": "assistant", "content": "EMERGENCY ALERT: Please call 911 (or local emergency 112/108) immediately. Do not wait. Crushing chest pressure radiating to the jaw is a classic sign of an acute heart attack. Chew one regular adult Aspirin (325mg) if not allergic, sit down on the floor, and unlock your door for first responders."}]}`;
                  navigator.clipboard.writeText(dataset);
                  alert('JSONL training dataset copied to clipboard!');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition"
              >
                Copy JSONL Dataset
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-purple-300 rounded-2xl font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap">
              {`{"messages": [{"role": "system", "content": "You are HealthSphere AI, a preventive health guardian aligned with SDG Goal 3."}, {"role": "user", "content": "I measured my blood pressure this morning and it was 138/88. Should I be worried?"}, {"role": "assistant", "content": "A reading of 138/88 mmHg falls into Stage 1 Hypertension. While not an acute emergency (provided you have no severe chest pain or shortness of breath), it indicates increased vascular resistance. Rest for 10 minutes, take a second reading, keep daily sodium under 2000mg, and log readings for 7 days to share with your physician."}]}

{"messages": [{"role": "system", "content": "You are HealthSphere AI, a preventive health guardian aligned with SDG Goal 3."}, {"role": "user", "content": "I have been feeling dizzy, my hands are cold, and afternoon fatigue is severe despite 8 hours of sleep."}, {"role": "assistant", "content": "These symptoms are classic indicators of latent iron deficiency or depleted serum ferritin stores. Standard CBC tests can show normal hemoglobin while ferritin is depleted below 30 ng/mL. Ask your doctor for a full iron panel including Serum Ferritin and TIBC, and pair dietary iron with Vitamin C."}]}

{"messages": [{"role": "system", "content": "You are HealthSphere AI, a preventive health guardian aligned with SDG Goal 3."}, {"role": "user", "content": "My left chest feels heavy like an elephant is sitting on it, and pain is radiating to my jaw."}, {"role": "assistant", "content": "EMERGENCY ALERT: Please call 911 (or local emergency 112/108) immediately. Do not wait. Crushing chest pressure radiating to the jaw is a classic sign of an acute heart attack. Chew one regular adult Aspirin (325mg) if not allergic, sit down on the floor, and unlock your door for first responders."}]}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
