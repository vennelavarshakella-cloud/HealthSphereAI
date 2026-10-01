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
} from 'lucide-react';
import { api } from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'tables' | 'sql'>('metrics');
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
    </div>
  );
};
