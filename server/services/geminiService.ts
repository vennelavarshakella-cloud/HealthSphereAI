/**
 * HealthSphere AI - Server-Side Gemini AI Integration
 * Powered by @google/genai using gemini-3.8-flash for clinical preventive health insights.
 */

import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface HealthGuardianInput {
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  systolic_bp: number;
  diastolic_bp: number;
  blood_sugar_mg_dl: number;
  sleep_hours: number;
  exercise_mins: number;
  stress_level: number;
  water_intake_liters: number;
  smoking_status: string;
  alcohol_consumption: string;
  symptoms?: string[];
  chronic_conditions?: string[];
}

export interface HealthGuardianOutput {
  health_score: number;
  risk_level: 'low' | 'moderate' | 'high' | 'critical';
  bmi: number;
  bmi_category: string;
  blood_pressure_status: string;
  glucose_status: string;
  cardiovascular_risk: string;
  metabolic_risk: string;
  health_tips: string[];
  lifestyle_suggestions: string[];
  dietary_recommendations: string[];
  urgent_warnings: string[];
  summary: string;
}

export async function evaluateHealthGuardian(input: HealthGuardianInput): Promise<HealthGuardianOutput> {
  const heightM = input.height_cm / 100;
  const bmi = Number((input.weight_kg / (heightM * heightM)).toFixed(1));
  let bmiCategory = 'Normal weight';
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi < 25) bmiCategory = 'Normal weight';
  else if (bmi < 30) bmiCategory = 'Overweight';
  else bmiCategory = 'Obesity';

  let bpStatus = 'Normal';
  if (input.systolic_bp >= 140 || input.diastolic_bp >= 90) bpStatus = 'Hypertension Stage 2';
  else if (input.systolic_bp >= 130 || input.diastolic_bp >= 80) bpStatus = 'Hypertension Stage 1';
  else if (input.systolic_bp >= 120 && input.diastolic_bp < 80) bpStatus = 'Elevated';

  let glucoseStatus = 'Normal Fasting';
  if (input.blood_sugar_mg_dl >= 126) glucoseStatus = 'Diabetic Range';
  else if (input.blood_sugar_mg_dl >= 100) glucoseStatus = 'Prediabetic Range';

  // Rule-based fallback foundation
  let score = 100;
  if (bmi > 25) score -= Math.min(15, (bmi - 25) * 2);
  if (bmi < 18.5) score -= 10;
  if (input.systolic_bp > 120) score -= Math.min(18, (input.systolic_bp - 120) * 0.8);
  if (input.blood_sugar_mg_dl > 100) score -= Math.min(15, (input.blood_sugar_mg_dl - 100) * 0.6);
  if (input.sleep_hours < 7) score -= (7 - input.sleep_hours) * 3;
  if (input.exercise_mins < 30) score -= (30 - input.exercise_mins) * 0.3;
  if (input.stress_level > 5) score -= (input.stress_level - 5) * 2.5;
  if (input.smoking_status !== 'never') score -= (input.smoking_status === 'regular' ? 15 : 8);
  if (input.alcohol_consumption === 'heavy') score -= 12;
  else if (input.alcohol_consumption === 'moderate') score -= 5;
  score = Math.max(35, Math.min(98, Math.round(score)));

  let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  if (score < 55 || input.systolic_bp >= 150 || input.blood_sugar_mg_dl >= 180) riskLevel = 'critical';
  else if (score < 70 || input.systolic_bp >= 135 || input.blood_sugar_mg_dl >= 125) riskLevel = 'high';
  else if (score < 85) riskLevel = 'moderate';

  const client = getAIClient();
  if (client) {
    try {
      const prompt = `You are HealthSphere AI, a senior preventive clinical health guardian aligned with UN Sustainable Development Goal 3 (Good Health and Well-Being).
Analyze the following patient profile and return a strictly valid JSON object matching the requested schema.

Patient Profile:
- Age: ${input.age}, Gender: ${input.gender}
- Height: ${input.height_cm}cm, Weight: ${input.weight_kg}kg, Computed BMI: ${bmi} (${bmiCategory})
- Blood Pressure: ${input.systolic_bp}/${input.diastolic_bp} mmHg (${bpStatus})
- Blood Sugar: ${input.blood_sugar_mg_dl} mg/dL (${glucoseStatus})
- Sleep: ${input.sleep_hours} hrs/night, Exercise: ${input.exercise_mins} mins/day
- Stress: ${input.stress_level}/10, Water: ${input.water_intake_liters} L/day
- Smoking: ${input.smoking_status}, Alcohol: ${input.alcohol_consumption}
- Reported Symptoms: ${input.symptoms && input.symptoms.length ? input.symptoms.join(', ') : 'None reported'}
- Known Conditions: ${input.chronic_conditions && input.chronic_conditions.length ? input.chronic_conditions.join(', ') : 'None'}

Provide:
1. health_score: integer between 30 and 100
2. risk_level: "low" | "moderate" | "high" | "critical"
3. cardiovascular_risk: concise risk assessment string
4. metabolic_risk: concise risk assessment string
5. health_tips: array of 4 actionable clinical preventive tips
6. lifestyle_suggestions: array of 4 evidence-based habit recommendations
7. dietary_recommendations: array of 3 specific nutrient/food recommendations
8. urgent_warnings: array of warning strings if any vital is dangerous, else empty array
9. summary: 2-3 sentence empathetic clinical summary explaining their overall status and preventive roadmap.

Output JSON only without code fences or extra text.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        return {
          health_score: parsed.health_score || score,
          risk_level: parsed.risk_level || riskLevel,
          bmi,
          bmi_category: bmiCategory,
          blood_pressure_status: bpStatus,
          glucose_status: glucoseStatus,
          cardiovascular_risk: parsed.cardiovascular_risk || (bpStatus === 'Normal' ? 'Optimal baseline' : 'Mild arterial strain detected'),
          metabolic_risk: parsed.metabolic_risk || (glucoseStatus === 'Normal Fasting' ? 'Healthy insulin sensitivity' : 'Prediabetic caution'),
          health_tips: parsed.health_tips || [
            'Maintain minimum 150 minutes of aerobic moderate activity each week.',
            'Aim for 2.5L clean water daily to optimize kidney filtration.',
            'Limit sodium intake to under 2,000mg/day to support healthy blood pressure.',
            'Ensure consistent 7-8 hours sleep cycle to regulate cortisol.',
          ],
          lifestyle_suggestions: parsed.lifestyle_suggestions || [
            'Implement 10 minutes of daily morning box breathing to regulate autonomic tone.',
            'Take a brisk 15-minute post-meal walk to blunt post-prandial glycemic excursions.',
            'Establish an evening digital curfew 45 minutes prior to sleep.',
            'Schedule annual comprehensive lipid and metabolic blood panels.',
          ],
          dietary_recommendations: parsed.dietary_recommendations || [
            'Focus on fiber-rich complex carbohydrates (oats, legumes, leafy greens).',
            'Incorporate plant-derived polyphenols and omega-3 essential fatty acids.',
            'Reduce ultra-processed snacks and added sugars.',
          ],
          urgent_warnings: parsed.urgent_warnings || (riskLevel === 'critical' ? ['Blood pressure or glucose exceeds safe threshold. Consult a physician promptly.'] : []),
          summary: parsed.summary || `Your calculated health score is ${score}/100 with a ${riskLevel} preventive risk tier. Adopting targeted hydration and stress regulation habits will sustain your vitality.`,
        };
      }
    } catch (err) {
      console.error('Gemini Health Guardian API error, falling back to clinical rule engine:', err);
    }
  }

  // Fallback clinical output
  return {
    health_score: score,
    risk_level: riskLevel,
    bmi,
    bmi_category: bmiCategory,
    blood_pressure_status: bpStatus,
    glucose_status: glucoseStatus,
    cardiovascular_risk: bpStatus === 'Normal' ? 'Optimal vascular profile' : 'Mild arterial resistance risk; lifestyle monitoring recommended',
    metabolic_risk: glucoseStatus === 'Normal Fasting' ? 'Optimal metabolic rate' : 'Elevated fasting glucose; decrease refined carbohydrates',
    health_tips: [
      'Target 150 minutes of moderate-intensity aerobic exercise (brisk walking, cycling) weekly.',
      'Maintain adequate hydration (at least 2.5 liters of clean water daily) to preserve renal function.',
      'Prioritize 7-8 hours of uninterrupted nocturnal sleep to optimize circadian rhythm and cellular repair.',
      'Incorporate mindfulness or 4-4-4 box breathing to diminish chronic sympathetic nervous strain.',
    ],
    lifestyle_suggestions: [
      'Engage in 15 minutes of low-impact stretching or yoga upon waking.',
      'Take a brisk 10-15 minute walk after dinner to improve insulin sensitivity.',
      'Reduce screen brightness and avoid blue light 1 hour prior to sleep.',
      'Log daily blood pressure readings at the same time every morning.',
    ],
    dietary_recommendations: [
      'Adopt a Mediterranean or whole-food plant-forward dietary pattern rich in leafy greens and polyphenols.',
      'Keep dietary sodium below 2,000 mg daily to ease vascular tension.',
      'Ensure adequate dietary magnesium and potassium from avocados, seeds, and leafy greens.',
    ],
    urgent_warnings: riskLevel === 'critical' ? ['Critical vital detected: please arrange immediate medical consultation.'] : [],
    summary: `Your personalized HealthSphere AI score is ${score}/100, placing you in the ${riskLevel.toUpperCase()} preventive health tier. By fine-tuning daily hydration, post-meal activity, and sleep consistency, you will substantially reduce long-term cardiovascular and metabolic risks in accordance with SDG Goal 3 standards.`,
  };
}

export interface NutritionPlanInput {
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  diet_type: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Eggetarian';
  budget_tier: 'Budget-Friendly' | 'Standard' | 'Premium';
  health_conditions?: string[];
  health_goals?: string;
  activity_level?: string;
}

export async function generateNutritionPlan(input: NutritionPlanInput) {
  const heightM = input.height_cm / 100;
  const bmi = Number((input.weight_kg / (heightM * heightM)).toFixed(1));

  // Harris-Benedict BMR estimate
  let bmr = 10 * input.weight_kg + 6.25 * input.height_cm - 5 * input.age;
  if (input.gender.toLowerCase() === 'female') {
    bmr -= 161;
  } else {
    bmr += 5;
  }
  const dailyCalories = Math.round(bmr * 1.35);
  const proteinG = Math.round((dailyCalories * 0.22) / 4);
  const carbsG = Math.round((dailyCalories * 0.50) / 4);
  const fatsG = Math.round((dailyCalories * 0.28) / 9);
  const fiberG = Math.max(30, Math.round(dailyCalories / 70));

  const client = getAIClient();
  if (client) {
    try {
      const prompt = `You are HealthSphere AI clinical nutritionist. Generate a tailored daily meal plan and macro breakdown.
Profile:
- Age: ${input.age}, Gender: ${input.gender}
- Height: ${input.height_cm}cm, Weight: ${input.weight_kg}kg, BMI: ${bmi}
- Diet Type: ${input.diet_type}
- Budget Tier: ${input.budget_tier}
- Conditions: ${input.health_conditions && input.health_conditions.length ? input.health_conditions.join(', ') : 'General Wellness'}
- Goals: ${input.health_goals || 'Sustainable preventive vitality and balanced blood glucose'}

Return JSON matching:
{
  "daily_calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fats_g": number,
  "fiber_g": number,
  "diet_philosophy": string,
  "meal_plan": {
    "breakfast": { "title": string, "calories": number, "items": string[] },
    "lunch": { "title": string, "calories": number, "items": string[] },
    "snacks": { "title": string, "calories": number, "items": string[] },
    "dinner": { "title": string, "calories": number, "items": string[] }
  },
  "key_nutrients_highlight": string[],
  "budget_friendly_tips": string[]
}
Output valid JSON only.`;

      const res = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      if (res && res.text) {
        const parsed = JSON.parse(res.text.trim());
        return {
          ...parsed,
          bmi,
        };
      }
    } catch (e) {
      console.error('Gemini Nutrition Planner error, using balanced nutrition engine:', e);
    }
  }

  // Fallback nutrition plan
  return {
    daily_calories: dailyCalories,
    protein_g: proteinG,
    carbs_g: carbsG,
    fats_g: fatsG,
    fiber_g: fiberG,
    bmi,
    diet_philosophy: `Scientifically calibrated ${input.diet_type} protocol optimized for ${input.budget_tier.toLowerCase()} budget and metabolic harmony.`,
    meal_plan: {
      breakfast: {
        title: input.diet_type === 'Vegan' ? 'Sprouted Moong & Chia Protein Porridge' : 'Spinach & Herb Omelet with Toasted Rye',
        calories: Math.round(dailyCalories * 0.25),
        items: [
          'High-fiber oats or steamed sprouted legumes',
          'Fresh berries or sliced seasonal fruit',
          'Crushed pumpkin seeds and chia seeds (15g)',
          'Warm lemon-infused hydration tea',
        ],
      },
      lunch: {
        title: input.diet_type.includes('Vegetarian') ? 'Warm Quinoa & Spiced Chickpea Rainbow Bowl' : 'Grilled Herb Salmon with Brown Rice & Steamed Asparagus',
        calories: Math.round(dailyCalories * 0.35),
        items: [
          'Complex whole grains (brown rice or quinoa 120g)',
          'Bioavailable protein source (lentils/tofu/wild fish 140g)',
          'Crisp cucumber, grated beet, and steamed greens',
          'Cold-pressed extra virgin olive oil vinaigrette',
        ],
      },
      snacks: {
        title: 'Roasted Crunchy Legumes with Green Tea',
        calories: Math.round(dailyCalories * 0.15),
        items: [
          'Roasted chickpeas or raw almonds (30g)',
          'Fresh sliced crisp celery and hummus',
          'Antioxidant-rich organic green tea',
        ],
      },
      dinner: {
        title: 'Hearty Lentil Vegetable Stew with Steamed Greens',
        calories: Math.round(dailyCalories * 0.25),
        items: [
          'Slow-simmered aromatic red lentil & sweet potato stew',
          'Garlic-sautéed kale and broccoli florets',
          'Sprouted grain flatbread or small cup wild rice',
          'Anti-inflammatory turmeric golden milk',
        ],
      },
    },
    key_nutrients_highlight: [
      'High Bioavailable Iron & Vitamin C co-factors to maximize absorption',
      'Prebiotic Inulin Fiber to foster healthy gut microbiome diversity',
      'Potassium and Magnesium to support endothelial arterial relaxation',
    ],
    budget_friendly_tips: [
      'Buy dry lentils, beans, and whole oats in bulk containers for 70% savings.',
      'Purchase seasonal local vegetables and flash-frozen berries for equal nutrient retention.',
      'Batch-cook legume bases on Sundays for easy portioned workday lunches.',
    ],
  };
}
