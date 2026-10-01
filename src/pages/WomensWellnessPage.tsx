/**
 * HealthSphere AI - Women's Wellness Module
 * Period Tracker, Pregnancy Milestones, PCOS Awareness, Menopause Support, and Iron Deficiency Checker.
 */

import React, { useState } from 'react';
import {
  Smile,
  Calendar,
  Baby,
  Activity,
  Heart,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Droplet,
  Info,
  Apple,
  ShieldCheck,
  ChevronRight,
  Plus,
  Clock,
} from 'lucide-react';
import { User, WomensHealthLog } from '../types';

interface WomensWellnessPageProps {
  currentUser: User | null;
  logs: WomensHealthLog[];
  onAddLog: (log: Partial<WomensHealthLog>) => void;
}

export const WomensWellnessPage: React.FC<WomensWellnessPageProps> = ({ currentUser, logs, onAddLog }) => {
  const [activeTab, setActiveTab] = useState<'period' | 'pregnancy' | 'pcos' | 'iron' | 'screenings'>('period');

  // Period Tracker State
  const [cycleDay, setCycleDay] = useState<number>(14);
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [flow, setFlow] = useState<'none' | 'spotting' | 'light' | 'medium' | 'heavy'>('none');
  const [periodNotes, setPeriodNotes] = useState<string>('');

  // Pregnancy Tracker State
  const [pregnancyWeek, setPregnancyWeek] = useState<number>(18);
  const [kickCount, setKickCount] = useState<number>(12);

  // PCOS symptoms
  const [pcosSymptoms, setPcosSymptoms] = useState<string[]>(['Mild bloating']);
  const allPcosSymptoms = ['Irregular cycle', 'Acne / Oily skin', 'Pelvic cramping', 'Hair thinning', 'Mild bloating', 'Insulin resistance cravings'];

  // Iron Deficiency Quiz
  const [ironScore, setIronScore] = useState<number>(0);
  const [ironAnswers, setIronAnswers] = useState<{ [key: string]: boolean }>({});

  const ironQuestions = [
    { id: 'fatigue', text: 'Do you experience chronic unexplainable afternoon fatigue or brain fog?' },
    { id: 'cold', text: 'Do your hands, feet, or extremities frequently feel cold even in warm rooms?' },
    { id: 'pale', text: 'Have you noticed paleness inside your lower eyelids or under fingernails?' },
    { id: 'dizzy', text: 'Do you feel lightheaded or dizzy when standing up quickly?' },
    { id: 'brittle', text: 'Are your nails noticeably brittle or hair shedding more than usual?' },
  ];

  const handleToggleIron = (id: string) => {
    const updated = { ...ironAnswers, [id]: !ironAnswers[id] };
    setIronAnswers(updated);
    const count = Object.values(updated).filter(Boolean).length;
    setIronScore(count);
  };

  const togglePcos = (sym: string) => {
    if (pcosSymptoms.includes(sym)) {
      setPcosSymptoms(pcosSymptoms.filter(s => s !== sym));
    } else {
      setPcosSymptoms([...pcosSymptoms, sym]);
    }
  };

  const handleSavePeriodLog = () => {
    onAddLog({
      cycle_day: cycleDay,
      period_flow: flow,
      pcos_symptoms: pcosSymptoms,
      notes: periodNotes,
    });
    alert('Women’s health log recorded successfully!');
  };

  // Determine Cycle Phase
  let phaseName = 'Follicular Phase';
  let phaseAdvice = 'Estrogen is climbing. Energy and focus are high. Great window for strength training and high-fiber cruciferous vegetables.';
  if (cycleDay >= 1 && cycleDay <= 5) {
    phaseName = 'Menstrual Phase';
    phaseAdvice = 'Progesterone and estrogen are low. Focus on rest, warm herbal teas, magnesium, and bioavailable dietary iron.';
  } else if (cycleDay >= 13 && cycleDay <= 16) {
    phaseName = 'Ovulatory Phase (Peak Fertility)';
    phaseAdvice = 'LH surge and peak estrogen. Optimal energy and stamina. Emphasize light antioxidant-dense meals, hydration, and zinc.';
  } else if (cycleDay > 16) {
    phaseName = 'Luteal Phase';
    phaseAdvice = 'Progesterone dominance. Metabolism increases slightly. Support hormonal stability with complex carbohydrates and B6 vitamins.';
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-purple-900 via-indigo-900 to-rose-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold mb-3 border border-purple-400/30">
            <Smile className="w-3.5 h-3.5 text-purple-300" />
            <span>Comprehensive Female Physiological Health</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Women's Wellness & Hormonal Harmony
          </h1>
          <p className="text-purple-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Personalized cycle intelligence, maternal pregnancy milestones, PCOS symptom logging, and ferritin iron deficiency triage.
          </p>
        </div>

        {/* Quick Phase Pill */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
          <span className="text-[11px] text-purple-200 block font-medium">Current Phase</span>
          <div className="text-xl font-extrabold text-white mt-0.5">{phaseName}</div>
          <span className="text-[10px] text-rose-300 font-bold">Day {cycleDay} of {cycleLength}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'period', label: 'Period & Ovulation Tracker', icon: Calendar },
          { id: 'pregnancy', label: 'Pregnancy Journey', icon: Baby },
          { id: 'pcos', label: 'PCOS & Menopause Care', icon: Activity },
          { id: 'iron', label: 'Iron Deficiency Checker', icon: Droplet },
          { id: 'screenings', label: 'Preventive Screenings', icon: ShieldCheck },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Period & Ovulation Tracker */}
      {activeTab === 'period' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Cycle Navigation & Vitals</span>
              <span className="text-xs font-semibold text-purple-600">Day {cycleDay}</span>
            </h3>

            {/* Visual Cycle Ring Simulation */}
            <div className="p-6 rounded-2xl bg-linear-to-br from-purple-50 via-rose-50 to-amber-50 border border-purple-100 text-center space-y-2">
              <span className="text-xs uppercase font-extrabold text-purple-900 tracking-wider">
                {phaseName}
              </span>
              <div className="text-3xl font-black text-purple-950">
                Cycle Day {cycleDay}
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {phaseAdvice}
              </p>
              <div className="pt-2">
                <input
                  type="range"
                  min="1"
                  max={cycleLength}
                  value={cycleDay}
                  onChange={e => setCycleDay(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>Day 1 (Menses)</span>
                  <span>Day 14 (Ovulation)</span>
                  <span>Day {cycleLength} (Cycle End)</span>
                </div>
              </div>
            </div>

            {/* Flow selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Today's Flow Intensity</label>
              <div className="grid grid-cols-5 gap-2">
                {(['none', 'spotting', 'light', 'medium', 'heavy'] as const).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFlow(f)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition border ${
                      flow === f
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Journal & Daily Symptoms</label>
              <textarea
                rows={3}
                placeholder="Log physical sensations, cramps, temperature shifts, energy levels..."
                value={periodNotes}
                onChange={e => setPeriodNotes(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={handleSavePeriodLog}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Cycle Data in Medical History</span>
            </button>
          </div>

          {/* Side Guidance */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Apple className="w-4 h-4 text-emerald-600" />
                <span>Phase-Aligned Micronutrient Focus</span>
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="text-slate-800 block">Iron & Vitamin C (Bioavailability):</strong>
                  <p className="text-slate-600 mt-0.5">
                    Lentils, baby spinach, pumpkin seeds paired with lemon juice to replenish blood loss.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="text-slate-800 block">Magnesium Glycinate:</strong>
                  <p className="text-slate-600 mt-0.5">
                    Relaxes uterine smooth muscle and diminishes nocturnal cramping.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="text-slate-800 block">Omega-3 Fatty Acids:</strong>
                  <p className="text-slate-600 mt-0.5">
                    Reduces prostaglandin E2 synthesis to alleviate inflammatory menstrual migraines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pregnancy Journey */}
      {activeTab === 'pregnancy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Maternal & Fetal Milestones</h3>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                Week {pregnancyWeek} (Trimester 2)
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-linear-to-r from-rose-50 to-pink-50 border border-rose-100 text-center space-y-2">
              <span className="text-xs font-extrabold uppercase text-rose-800 tracking-wider">
                Fetal Size Comparison
              </span>
              <div className="text-3xl font-black text-rose-950">Size of a Bell Pepper 🫑</div>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                At 18 weeks, baby's nervous system is maturing rapidly, myelin is coating nerves, and baby can now hear your heartbeat and soothing voice!
              </p>
              <div className="pt-3">
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={pregnancyWeek}
                  onChange={e => setPregnancyWeek(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>Trimester 1 (W1-12)</span>
                  <span>Trimester 2 (W13-26)</span>
                  <span>Trimester 3 (W27-40)</span>
                </div>
              </div>
            </div>

            {/* Kick Counter */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Daily Fetal Kick Counter</span>
                <span className="text-[11px] text-slate-500">Target: 10 kicks in 2 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-rose-600">{kickCount}</span>
                <button
                  onClick={() => setKickCount(kickCount + 1)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition"
                >
                  + Log Kick
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">Recommended Prenatal Screenings</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Nuchal Translucency & First Trimester Blood Screen (Completed)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Anatomy Ultrasound (Scheduled Week 20)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Gestational Diabetes Glucose Tolerance Test (Upcoming Week 26)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: PCOS & Menopause Support */}
      {activeTab === 'pcos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              PCOS Symptom Tracker & Insulin Sensitivity
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Polycystic Ovary Syndrome (PCOS) affects 1 in 8 women globally. Tracking metabolic symptoms enables proactive dietary interventions to stabilize blood sugar and normalize ovulation.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Select Active Symptoms</label>
              <div className="grid grid-cols-2 gap-2">
                {allPcosSymptoms.map(sym => {
                  const checked = pcosSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => togglePcos(sym)}
                      className={`p-2.5 rounded-xl text-xs font-medium text-left border transition ${
                        checked
                          ? 'bg-purple-50 border-purple-500 text-purple-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong className="block font-bold mb-1">Menopause Transition (Perimenopause) Note:</strong>
              If you are aged 45+ experiencing hot flashes, night sweats, or sudden mood fluctuations, logging baseline estradiol and FSH levels with your gynecologist provides clarity on hormone therapy options.
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">PCOS Evidence-Based Protocols</h4>
              <div className="space-y-2 text-xs text-slate-600">
                <p>• <strong>Inositol (40:1 Myo to D-Chiro ratio):</strong> Restores ovarian insulin receptor sensitivity.</p>
                <p>• <strong>Low Glycemic Index Nutrition:</strong> Prevents sharp post-meal insulin spikes that trigger androgen overproduction.</p>
                <p>• <strong>Resistance Training:</strong> Increases GLUT-4 transporter translocation in skeletal muscles.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Iron Deficiency Checker */}
      {activeTab === 'iron' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Ferritin & Iron Deficiency Screening</h3>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                Interactive Clinical Triage
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Iron deficiency anemia is the single most common nutritional deficiency worldwide, disproportionately impacting women due to menstruation and pregnancy. Complete the clinical symptom screener below:
            </p>

            <div className="space-y-3">
              {ironQuestions.map(q => {
                const checked = Boolean(ironAnswers[q.id]);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleIron(q.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      checked
                        ? 'bg-rose-50/70 border-rose-400 text-rose-950 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs leading-relaxed">{q.text}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="w-4 h-4 accent-rose-600 rounded shrink-0 ml-3"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-800 text-sm">Iron Risk Assessment Result</h4>
              <div className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-3xl font-black text-rose-600">{ironScore} / 5</div>
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Symptoms Positive
                </span>
                <div className="mt-2 text-xs">
                  {ironScore >= 3 ? (
                    <span className="text-rose-700 font-bold bg-rose-100 px-3 py-1 rounded-full inline-block">
                      Elevated Risk for Latent Iron Depletion
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-full inline-block">
                      Low Iron Deficiency Probability
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                <p>
                  <strong>Clinical Recommendation:</strong> If you scored 3 or more, standard hemoglobin blood tests can miss depleted iron stores. Request a <strong>Serum Ferritin</strong> blood test (optimal target: &gt; 50 ng/mL).
                </p>
                <p>
                  <strong>Dietary Synergy:</strong> Pair non-heme iron (lentils, spinach, tofu) with Vitamin C rich foods (bell peppers, oranges) to multiply absorption by up to 300%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Preventive Screenings */}
      {activeTab === 'screenings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
            Recommended Preventive Screening Timetable
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs uppercase font-extrabold text-purple-700">Ages 21 - 29</span>
              <h4 className="text-sm font-bold text-slate-800">Pap Smear & Cervical Screening</h4>
              <p className="text-xs text-slate-600">
                Every 3 years. Checks for cellular cervical abnormalities early when they are 99% treatable.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs uppercase font-extrabold text-purple-700">Ages 30 - 49</span>
              <h4 className="text-sm font-bold text-slate-800">HPV Co-Testing & Clinical Breast Exam</h4>
              <p className="text-xs text-slate-600">
                Every 5 years for HPV + Pap. Annual clinical breast examination by a physician.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs uppercase font-extrabold text-purple-700">Ages 50+</span>
              <h4 className="text-sm font-bold text-slate-800">Mammogram & Bone Density (DEXA)</h4>
              <p className="text-xs text-slate-600">
                Biennial screening mammography and baseline bone mineral density scan to intercept osteoporosis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
