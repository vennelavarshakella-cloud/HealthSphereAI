/**
 * HealthSphere AI - Mental Wellness Module
 * Mood Spectrum Tracker, Interactive Box Breathing Tool, Ambient Meditation Timer, Daily Journal, and Affirmations.
 */

import React, { useState, useEffect } from 'react';
import {
  Brain,
  Smile,
  Frown,
  Meh,
  Sun,
  Wind,
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { User, MoodTrackerLog } from '../types';

interface MentalWellnessPageProps {
  currentUser: User | null;
  logs: MoodTrackerLog[];
  onAddMoodLog: (log: Partial<MoodTrackerLog>) => void;
}

export const MentalWellnessPage: React.FC<MentalWellnessPageProps> = ({
  currentUser,
  logs,
  onAddMoodLog,
}) => {
  // Mood Tracker State
  const [selectedMood, setSelectedMood] = useState<number>(4);
  const [emotion, setEmotion] = useState<string>('Optimistic');
  const [stressScore, setStressScore] = useState<number>(3);
  const [sleepQuality, setSleepQuality] = useState<number>(4);
  const [journalEntry, setJournalEntry] = useState<string>('');
  const [loggedToday, setLoggedToday] = useState(false);

  // Box Breathing Exercise State (4s Inhale, 4s Hold, 4s Exhale, 4s Hold)
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold After Exhale'>('Inhale');
  const [breathCountdown, setBreathCountdown] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  // Meditation Timer State
  const [meditationMinutes, setMeditationMinutes] = useState<number>(10);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(600);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<'gentle_rain' | 'forest_birds' | 'ocean_waves' | 'none'>('gentle_rain');

  // Daily Affirmation
  const affirmations = [
    'I prioritize rest and balance knowing they are foundational to lifelong health.',
    'Every deep breath nourishes my nervous system and calms my mind.',
    'I release tension from things outside my control and focus on the present step.',
    'My health journey is a practice of kindness toward my mind and body.',
  ];
  const [todayQuote] = useState(affirmations[Math.floor(Math.random() * affirmations.length)]);

  // Box Breathing Interval Loop
  useEffect(() => {
    let interval: any = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathCountdown(prev => {
          if (prev > 1) return prev - 1;

          // Transition phase
          setBreathPhase(currPhase => {
            if (currPhase === 'Inhale') return 'Hold';
            if (currPhase === 'Hold') return 'Exhale';
            if (currPhase === 'Exhale') return 'Hold After Exhale';
            setCyclesCompleted(c => c + 1);
            return 'Inhale';
          });
          return 4;
        });
      }, 1000);
    } else {
      setBreathCountdown(4);
      setBreathPhase('Inhale');
    }
    return () => clearInterval(interval);
  }, [breathingActive]);

  // Meditation Timer Countdown
  useEffect(() => {
    let timer: any = null;
    if (timerRunning && timerSecondsLeft > 0) {
      timer = setInterval(() => {
        setTimerSecondsLeft(t => t - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && timerRunning) {
      setTimerRunning(false);
      alert('Meditation session completed! Well done.');
    }
    return () => clearInterval(timer);
  }, [timerRunning, timerSecondsLeft]);

  const handleSaveMoodLog = () => {
    onAddMoodLog({
      mood_level: selectedMood,
      mood_emotion: emotion,
      stress_score: stressScore,
      sleep_quality: sleepQuality,
      journal_entry: journalEntry,
      meditation_completed_mins: timerRunning ? Math.round((meditationMinutes * 60 - timerSecondsLeft) / 60) : 10,
      breathing_exercise_completed: cyclesCompleted > 0,
    });
    setLoggedToday(true);
    alert('Mental wellness log saved successfully!');
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-teal-900 via-emerald-950 to-sky-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold mb-3 border border-teal-400/30">
            <Brain className="w-3.5 h-3.5 text-teal-300" />
            <span>Target 3.4: Promoting Mental Health & Well-Being</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mental Wellness & Stress Regulation
          </h1>
          <p className="text-teal-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Nourish cognitive vitality, decrease cortisol spikes, and practice proven box breathing to recalibrate your parasympathetic nervous system.
          </p>
        </div>

        {/* Daily Quote Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 max-w-xs text-xs text-teal-100 italic leading-relaxed shrink-0">
          <span className="text-[10px] font-bold text-amber-300 uppercase not-italic block mb-1">
            Today's Mindful Affirmation:
          </span>
          "{todayQuote}"
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Box Breathing & Meditation */}
        <div className="lg:col-span-6 space-y-6">
          {/* Box Breathing Tool (Navy SEAL & Clinical Protocol) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Wind className="w-5 h-5 text-teal-600" />
                  <span>Clinical 4-4-4-4 Box Breathing</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Activates the vagus nerve and dampens sympathetic fight-or-flight within 2 minutes.
                </p>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                {cyclesCompleted} Cycles Done
              </span>
            </div>

            {/* Breathing Animation Canvas / Interactive Visualizer */}
            <div className="py-8 flex flex-col items-center justify-center bg-linear-to-b from-teal-50/50 to-sky-50/50 rounded-2xl border border-teal-100 relative overflow-hidden">
              <div
                className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-xl ${
                  breathPhase === 'Inhale'
                    ? 'scale-125 bg-linear-to-tr from-teal-400 to-emerald-400 text-white'
                    : breathPhase === 'Hold' || breathPhase === 'Hold After Exhale'
                    ? 'scale-115 bg-linear-to-tr from-sky-400 to-indigo-500 text-white'
                    : 'scale-90 bg-linear-to-tr from-teal-200 to-sky-200 text-slate-800'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider">{breathPhase}</span>
                <span className="text-4xl font-black mt-1">{breathCountdown}s</span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setBreathingActive(!breathingActive)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                    breathingActive
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20'
                  }`}
                >
                  {breathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{breathingActive ? 'Pause Exercise' : 'Start 4-4-4-4 Breathing'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBreathingActive(false);
                    setCyclesCompleted(0);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                  title="Reset Counter"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Guided Meditation Timer */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Ambient Mindfulness Timer</span>
              </h3>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                {formatTimer(timerSecondsLeft)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                {[5, 10, 15, 20].map(mins => (
                  <button
                    key={mins}
                    onClick={() => {
                      setMeditationMinutes(mins);
                      setTimerSecondsLeft(mins * 60);
                      setTimerRunning(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      meditationMinutes === mins
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 ${
                  timerRunning ? 'bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{timerRunning ? 'Pause' : 'Start'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Mood Spectrum & Journal Entry */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800">Daily Emotional Spectrum & Journal</h3>
            <p className="text-xs text-slate-500">
              Correlates mental state with your physiological vitals in `mood_tracker_logs`.
            </p>
          </div>

          {/* Mood 1-5 selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">How are you feeling right now?</label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { level: 1, label: 'Low / Distressed', icon: Frown, color: 'hover:bg-rose-50 border-rose-200' },
                { level: 2, label: 'Tired / Drained', icon: Meh, color: 'hover:bg-amber-50 border-amber-200' },
                { level: 3, label: 'Neutral / Balanced', icon: Smile, color: 'hover:bg-slate-100 border-slate-200' },
                { level: 4, label: 'Optimistic / Good', icon: Smile, color: 'hover:bg-teal-50 border-teal-200' },
                { level: 5, label: 'Radiant / Joyful', icon: Sun, color: 'hover:bg-emerald-50 border-emerald-200' },
              ].map(m => {
                const Icon = m.icon;
                const isSelected = selectedMood === m.level;
                return (
                  <button
                    key={m.level}
                    type="button"
                    onClick={() => setSelectedMood(m.level)}
                    className={`p-3 rounded-2xl flex flex-col items-center text-center transition border ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-md font-bold'
                        : `bg-slate-50 text-slate-700 ${m.color}`
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-1" />
                    <span className="text-[10px] leading-tight line-clamp-1">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emotion tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Primary Emotional Theme</label>
            <div className="flex flex-wrap gap-2">
              {['Peaceful', 'Grateful', 'Optimistic', 'Focused', 'Anxious', 'Fatigued', 'Overwhelmed', 'Content'].map(emo => (
                <button
                  key={emo}
                  type="button"
                  onClick={() => setEmotion(emo)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                    emotion === emo
                      ? 'bg-sky-100 border-sky-400 text-sky-800 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {emo}
                </button>
              ))}
            </div>
          </div>

          {/* Stress & Sleep sliders */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Stress Score: <span className="text-sky-600 font-bold">{stressScore}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={stressScore}
                onChange={e => setStressScore(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rest Quality: <span className="text-indigo-600 font-bold">{sleepQuality}/5</span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={sleepQuality}
                onChange={e => setSleepQuality(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Journal Entry */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reflective Health Journal
            </label>
            <textarea
              rows={4}
              placeholder="What went well today? What thoughts or sensations felt most prominent?"
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 leading-relaxed"
            />
          </div>

          <button
            onClick={handleSaveMoodLog}
            className="w-full py-3.5 rounded-2xl bg-linear-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white font-extrabold text-xs shadow-md shadow-teal-500/20 transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Mental Health Log</span>
          </button>
        </div>
      </div>
    </div>
  );
};
