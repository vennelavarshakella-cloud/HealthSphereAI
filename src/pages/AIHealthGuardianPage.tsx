/**
 * HealthSphere AI - AI Health Guardian & Preventive Assessment
 * Evaluates real-time patient telemetry, symptoms, and computes clinical risk scores via Gemini AI.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  Printer,
  Info,
  Clock,
  Zap,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { User, HealthRecord, HealthGuardianEvaluation } from '../types';
import { api } from '../services/api';

interface AIHealthGuardianPageProps {
  currentUser: User | null;
  onRecordSaved: (record: HealthRecord) => void;
}

export const AIHealthGuardianPage: React.FC<AIHealthGuardianPageProps> = ({ currentUser, onRecordSaved }) => {
  // Input form state
  const [age, setAge] = useState<number>(34);
  const [gender, setGender] = useState<string>('Female');
  const [heightCm, setHeightCm] = useState<number>(168);
  const [weightKg, setWeightKg] = useState<number>(62.5);
  const [systolicBp, setSystolicBp] = useState<number>(118);
  const [diastolicBp, setDiastolicBp] = useState<number>(76);
  const [bloodSugar, setBloodSugar] = useState<number>(94);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [exerciseMins, setExerciseMins] = useState<number>(40);
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [waterIntakeLiters, setWaterIntakeLiters] = useState<number>(2.4);
  const [smokingStatus, setSmokingStatus] = useState<string>('never');
  const [alcoholConsumption, setAlcoholConsumption] = useState<string>('occasional');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<HealthGuardianEvaluation | null>(null);
  const [savedRecord, setSavedRecord] = useState<HealthRecord | null>(null);
  const [copied, setCopied] = useState(false);

  // Compute live BMI
  const heightM = heightCm / 100;
  const liveBmi = heightM > 0 ? Number((weightKg / (heightM * heightM)).toFixed(1)) : 22.0;

  const symptomOptions = [
    'Fatigue / Lack of Energy',
    'Morning Dizziness',
    'Mild Shortness of Breath',
    'Headaches',
    'Bloating / Digestive Discomfort',
    'Cold Hands & Feet',
    'Joint Stiffness',
    'Sleep Disruptions / Insomnia',
    'Frequent Thirst',
  ];

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleRunAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        user_id: currentUser ? currentUser.id : 'usr_001',
        age: Number(age),
        gender,
        height_cm: Number(heightCm),
        weight_kg: Number(weightKg),
        systolic_bp: Number(systolicBp),
        diastolic_bp: Number(diastolicBp),
        blood_sugar_mg_dl: Number(bloodSugar),
        sleep_hours: Number(sleepHours),
        exercise_mins: Number(exerciseMins),
        stress_level: Number(stressLevel),
        water_intake_liters: Number(waterIntakeLiters),
        smoking_status: smokingStatus,
        alcohol_consumption: alcoholConsumption,
        symptoms: selectedSymptoms.concat(customSymptom ? [customSymptom] : []),
      };

      const result = await api.assessHealth(payload);
      setEvaluation(result.evaluation);
      setSavedRecord(result.record);
      onRecordSaved(result.record);
    } catch (err: any) {
      alert('Assessment failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const handleShareSummary = () => {
    if (navigator.clipboard && evaluation) {
      const text = `HealthSphere AI Preventive Audit: Health Score ${evaluation.health_score}/100, Risk Level: ${evaluation.risk_level.toUpperCase()}. Status: ${evaluation.summary}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Page Title & Intro */}
      <div className="bg-linear-to-r from-sky-900 via-indigo-900 to-teal-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 text-xs font-semibold mb-3 border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Gemini 3.8 Flash Clinical Diagnostics Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Health Guardian Assessment
          </h1>
          <p className="text-sky-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Provide your latest vital signs, lifestyle parameters, and any active symptoms. The Guardian calculates your composite Health Score (0-100), cardiovascular risk, metabolic profile, and evidence-based preventive guidance.
          </p>
        </div>

        {/* Live calculated BMI Pill */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
          <span className="text-[11px] text-sky-200 block font-medium">Computed BMI</span>
          <div className="text-2xl font-extrabold text-white mt-0.5">{liveBmi}</div>
          <span className="text-[10px] text-emerald-300 font-bold">
            {liveBmi < 18.5 ? 'Underweight' : liveBmi < 25 ? 'Normal (Healthy)' : liveBmi < 30 ? 'Overweight' : 'Obesity'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <form onSubmit={handleRunAssessment} className="space-y-6">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-600" />
              <span>1. Demographics & Body Metrics</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  required
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  min="50"
                  max="250"
                  required
                  value={heightCm}
                  onChange={e => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="10"
                  max="300"
                  required
                  value={weightKg}
                  onChange={e => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 pt-2 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span>2. Vital Telemetry</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  min="70"
                  max="240"
                  required
                  value={systolicBp}
                  onChange={e => setSystolicBp(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  placeholder="e.g. 118"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Ideal &lt; 120</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  min="40"
                  max="140"
                  required
                  value={diastolicBp}
                  onChange={e => setDiastolicBp(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  placeholder="e.g. 76"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Ideal &lt; 80</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fasting Glucose (mg/dL)</label>
                <input
                  type="number"
                  min="40"
                  max="400"
                  required
                  value={bloodSugar}
                  onChange={e => setBloodSugar(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  placeholder="e.g. 94"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Normal 70-99</span>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 pt-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              <span>3. Lifestyle & Daily Habits</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sleep (Hrs/Night)</label>
                <input
                  type="number"
                  step="0.5"
                  min="2"
                  max="14"
                  value={sleepHours}
                  onChange={e => setSleepHours(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exercise (Mins/Day)</label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={exerciseMins}
                  onChange={e => setExerciseMins(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Water (Liters/Day)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="8"
                  value={waterIntakeLiters}
                  onChange={e => setWaterIntakeLiters(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Stress Scale (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={stressLevel}
                  onChange={e => setStressLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Smoking History</label>
                <select
                  value={smokingStatus}
                  onChange={e => setSmokingStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                >
                  <option value="never">Never Smoked</option>
                  <option value="former">Former Smoker (Quit)</option>
                  <option value="occasional">Occasional / Social</option>
                  <option value="regular">Regular Smoker</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alcohol Consumption</label>
                <select
                  value={alcoholConsumption}
                  onChange={e => setAlcoholConsumption(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                >
                  <option value="none">None / Teetotaler</option>
                  <option value="occasional">Occasional (1-2 / mo)</option>
                  <option value="moderate">Moderate (1-2 / wk)</option>
                  <option value="heavy">Frequent / Heavy</option>
                </select>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 pt-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>4. Real-Time Symptom Checklist</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {symptomOptions.map(sym => {
                const checked = selectedSymptoms.includes(sym);
                return (
                  <button
                    type="button"
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`p-2 rounded-xl text-[11px] font-medium text-left border transition ${
                      checked
                        ? 'bg-sky-50 border-sky-500 text-sky-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-linear-to-r from-sky-600 via-blue-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-sky-500/20 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing with Gemini AI Health Guardian...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Generate Health Score & Risk Analysis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {evaluation ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6 animate-in fade-in">
              {/* Header with Score & Risk Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                    Diagnostic Output
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">Clinical Preventive Summary</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareSummary}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1"
                    title="Copy Summary"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copied ? 'Copied!' : 'Share'}</span>
                  </button>
                  <button
                    onClick={handlePrintSummary}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1"
                    title="Print report"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Score Dial & Risk Tier */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-linear-to-br from-sky-50 to-teal-50 border border-sky-100 text-center">
                  <span className="text-xs text-sky-800 font-semibold block">Composite Health Score</span>
                  <div className="text-4xl font-black text-sky-950 mt-1">
                    {evaluation.health_score}
                    <span className="text-base font-normal text-slate-500">/100</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        evaluation.health_score >= 80
                          ? 'bg-emerald-500'
                          : evaluation.health_score >= 65
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${evaluation.health_score}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center flex flex-col justify-center">
                  <span className="text-xs text-slate-500 font-semibold block">Preventive Risk Tier</span>
                  <div className="mt-1">
                    <span
                      className={`inline-block uppercase font-extrabold px-3 py-1 rounded-full text-xs tracking-wider ${
                        evaluation.risk_level === 'low'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : evaluation.risk_level === 'moderate'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {evaluation.risk_level} Risk
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2">
                    Cardio: {evaluation.cardiovascular_risk}
                  </span>
                </div>
              </div>

              {/* Urgent Warnings */}
              {evaluation.urgent_warnings && evaluation.urgent_warnings.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-rose-700">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Clinical Alert Flag</span>
                  </div>
                  {evaluation.urgent_warnings.map((w, idx) => (
                    <p key={idx} className="leading-relaxed">{w}</p>
                  ))}
                </div>
              )}

              {/* Empathic Clinical Summary */}
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs text-slate-800 leading-relaxed">
                <span className="font-bold text-sky-900 block mb-1">AI Guardian Assessment:</span>
                {evaluation.summary}
              </div>

              {/* Actionable Health Tips */}
              <div>
                <h4 className="text-xs uppercase font-extrabold text-slate-700 tracking-wider mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Key Health Optimization Tips</span>
                </h4>
                <ul className="space-y-1.5">
                  {evaluation.health_tips.map((tip, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lifestyle Suggestions */}
              <div>
                <h4 className="text-xs uppercase font-extrabold text-slate-700 tracking-wider mb-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <span>Preventive Lifestyle Recommendations</span>
                </h4>
                <ul className="space-y-1.5">
                  {evaluation.lifestyle_suggestions.map((sug, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dietary guidance */}
              <div>
                <h4 className="text-xs uppercase font-extrabold text-slate-700 tracking-wider mb-2 flex items-center gap-1">
                  <Heart className="w-4 h-4 text-sky-600" />
                  <span>Targeted Dietary Adjustments</span>
                </h4>
                <ul className="space-y-1.5">
                  {evaluation.dietary_recommendations.map((diet, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <span>{diet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Record stored in MySQL/Postgres `health_records`</span>
                <span>ISO 27001 Clinical Protocol</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Ready to Analyze Your Health Profile
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Fill in your vital telemetry on the left and tap "Generate Health Score". The AI Guardian will inspect correlations between blood pressure, glucose, hydration, sleep, and reported symptoms.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="font-semibold text-slate-700">What you will receive:</div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Composite 0-100 Preventive Vitality Score</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Cardiovascular & Metabolic Risk Stratification</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Personalized lifestyle habits aligned with SDG Goal 3</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
