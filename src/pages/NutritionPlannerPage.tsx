/**
 * HealthSphere AI - AI Nutrition Planner & Macro Tracker
 * Custom diet planning tailored to Age, BMI, Health Conditions, Budget, and Dietary Types.
 */

import React, { useState } from 'react';
import {
  Apple,
  Sparkles,
  PieChart,
  CheckCircle2,
  DollarSign,
  Heart,
  TrendingUp,
  Utensils,
  Flame,
  Info,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { User, NutritionPlan } from '../types';
import { api } from '../services/api';

interface NutritionPlannerPageProps {
  currentUser: User | null;
}

export const NutritionPlannerPage: React.FC<NutritionPlannerPageProps> = ({ currentUser }) => {
  const [age, setAge] = useState<number>(34);
  const [gender, setGender] = useState<string>('Female');
  const [heightCm, setHeightCm] = useState<number>(168);
  const [weightKg, setWeightKg] = useState<number>(62.5);
  const [dietType, setDietType] = useState<'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Eggetarian'>('Vegetarian');
  const [budgetTier, setBudgetTier] = useState<'Budget-Friendly' | 'Standard' | 'Premium'>('Standard');
  const [healthGoals, setHealthGoals] = useState<string>('PCOS balance, sustained energy, cardiovascular resilience');
  const [conditions, setConditions] = useState<string[]>(['Mild PCOS']);

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<NutritionPlan | null>(null);

  // Daily logged macros state for interactive user tracking
  const [loggedCalories, setLoggedCalories] = useState<number>(1450);
  const [loggedProtein, setLoggedProtein] = useState<number>(68);
  const [loggedCarbs, setLoggedCarbs] = useState<number>(185);
  const [loggedFats, setLoggedFats] = useState<number>(42);

  const conditionOptions = [
    'Hypertension (Low Sodium)',
    'Type 2 Diabetes (Low GI)',
    'High Cholesterol (Low Sat Fat)',
    'PCOS (Hormonal & Insulin balance)',
    'Weight Management / Fat Loss',
    'Athletic Endurance',
  ];

  const toggleCondition = (cond: string) => {
    if (conditions.includes(cond)) {
      setConditions(conditions.filter(c => c !== cond));
    } else {
      setConditions([...conditions, cond]);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const generated = await api.getNutritionPlan({
        user_id: currentUser ? currentUser.id : 'usr_001',
        age,
        gender,
        height_cm: heightCm,
        weight_kg: weightKg,
        diet_type: dietType,
        budget_tier: budgetTier,
        health_conditions: conditions,
        health_goals: healthGoals,
      });
      setPlan(generated);
    } catch (err: any) {
      alert('Nutrition planning error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-sky-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-400/30">
            <Apple className="w-3.5 h-3.5 text-emerald-300" />
            <span>Target 3.4: Nutritional Disease Prevention</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Nutrition Planner & Daily Macro Tracker
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Generate balanced culinary protocols calibrated to your exact metabolic rate, health conditions, budget tier, and cultural dietary preferences.
          </p>
        </div>

        {/* Live Macro Progress Pill */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
          <span className="text-[11px] text-emerald-200 block font-medium">Daily Energy Target</span>
          <div className="text-2xl font-extrabold text-white mt-0.5">
            {plan ? plan.daily_calories : 2050}{' '}
            <span className="text-xs font-normal text-emerald-200">kcal</span>
          </div>
          <span className="text-[10px] text-emerald-300 font-bold">
            {dietType} • {budgetTier}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Planner Configuration Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-600" />
            <span>Nutritional Parameters</span>
          </h3>

          <form onSubmit={handleGeneratePlan} className="space-y-4">
            {/* Diet Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Dietary Category</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'] as const).map(dt => (
                  <button
                    key={dt}
                    type="button"
                    onClick={() => setDietType(dt)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      dietType === dt
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {dt}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Tier */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Budget Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Budget-Friendly', 'Standard', 'Premium'] as const).map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudgetTier(b)}
                    className={`py-2 rounded-xl text-xs font-bold border transition text-center ${
                      budgetTier === b
                        ? 'bg-sky-50 border-sky-600 text-sky-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Age, Height, Weight */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-xs rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={e => setHeightCm(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-xs rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={e => setWeightKg(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-xs rounded-xl border border-slate-200"
                />
              </div>
            </div>

            {/* Condition Filters */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Health Conditions to Accommodate
              </label>
              <div className="flex flex-wrap gap-1.5">
                {conditionOptions.map(cond => {
                  const isChecked = conditions.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleCondition(cond)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${
                        isChecked
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-800 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Health Goals</label>
              <input
                type="text"
                value={healthGoals}
                onChange={e => setHealthGoals(e.target.value)}
                placeholder="e.g. Hormonal balance, lean muscle, lower systolic BP"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Calculating Dietary Protocol...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Generate AI Nutrition Plan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Nutrition Plan Output & Meal Structure */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Macro Breakdown Display */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Calculated Macronutrient Distribution</h3>
                <p className="text-xs text-slate-500">
                  Target: {plan ? plan.daily_calories : 2050} kcal/day based on Harris-Benedict Metabolic Rate
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {dietType}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100">
                <span className="text-[10px] uppercase font-bold text-sky-700">Protein</span>
                <div className="text-xl font-black text-sky-950 mt-1">
                  {plan ? plan.protein_g : 95}g
                </div>
                <span className="text-[10px] text-slate-400">~20% energy</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                <span className="text-[10px] uppercase font-bold text-amber-700">Complex Carbs</span>
                <div className="text-xl font-black text-amber-950 mt-1">
                  {plan ? plan.carbs_g : 240}g
                </div>
                <span className="text-[10px] text-slate-400">Low-GI complex</span>
              </div>

              <div className="p-3 rounded-2xl bg-teal-50 border border-teal-100">
                <span className="text-[10px] uppercase font-bold text-teal-700">Healthy Fats</span>
                <div className="text-xl font-black text-teal-950 mt-1">
                  {plan ? plan.fats_g : 58}g
                </div>
                <span className="text-[10px] text-slate-400">Omega-3 & MUFA</span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-700">Prebiotic Fiber</span>
                <div className="text-xl font-black text-emerald-950 mt-1">
                  {plan ? plan.fiber_g : 38}g
                </div>
                <span className="text-[10px] text-slate-400">Gut diversity</span>
              </div>
            </div>

            {/* Interactive Meal Schedule */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs uppercase font-extrabold text-slate-700 tracking-wider">
                Full-Day Clinical Meal Blueprint
              </h4>

              {/* Breakfast */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase">
                    🌅 Breakfast (460 kcal)
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">08:00 AM</span>
                </div>
                <h5 className="text-xs font-bold text-slate-800">
                  {plan?.meal_plan.breakfast.title || 'Chia Seed & Steel-Cut Oats Bowl with Almonds & Blueberries'}
                </h5>
                <ul className="text-[11px] text-slate-600 list-disc pl-4 space-y-0.5">
                  {(plan?.meal_plan.breakfast.items || [
                    'Rolled steel-cut oats (60g) with unsweetened almond milk',
                    'Crushed walnuts & chia seeds (15g)',
                    'Fresh blueberries (50g)',
                  ]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Lunch */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-800 uppercase">
                    ☀️ Lunch (620 kcal)
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">01:00 PM</span>
                </div>
                <h5 className="text-xs font-bold text-slate-800">
                  {plan?.meal_plan.lunch.title || 'Quinoa Mediterranean Salad with Chickpeas & Steamed Greens'}
                </h5>
                <ul className="text-[11px] text-slate-600 list-disc pl-4 space-y-0.5">
                  {(plan?.meal_plan.lunch.items || [
                    'Organic cooked quinoa (120g) & spiced chickpeas (100g)',
                    'Diced cucumbers, cherry tomatoes, kalamata olives',
                    'Extra virgin cold-pressed olive oil & lemon juice dressing',
                  ]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Snacks */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 uppercase">
                    ☕ Afternoon Snack (280 kcal)
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">04:30 PM</span>
                </div>
                <h5 className="text-xs font-bold text-slate-800">
                  {plan?.meal_plan.snacks.title || 'Roasted Pumpkin Seeds with Greek Yogurt & Green Tea'}
                </h5>
                <ul className="text-[11px] text-slate-600 list-disc pl-4 space-y-0.5">
                  {(plan?.meal_plan.snacks.items || [
                    'Low-fat probiotic yogurt (150g)',
                    'Raw pumpkin seed mix (25g)',
                    'Unsweetened green tea',
                  ]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Dinner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-800 uppercase">
                    🌙 Dinner (590 kcal)
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">07:30 PM</span>
                </div>
                <h5 className="text-xs font-bold text-slate-800">
                  {plan?.meal_plan.dinner.title || 'Steamed Tofu & Broccoli Stir-Fry over Brown Jasmine Rice'}
                </h5>
                <ul className="text-[11px] text-slate-600 list-disc pl-4 space-y-0.5">
                  {(plan?.meal_plan.dinner.items || [
                    'Firm organic non-GMO tofu (150g)',
                    'Broccoli florets, bell peppers & snap peas',
                    'Brown jasmine rice (100g) with ginger glaze',
                  ]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
