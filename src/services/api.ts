/**
 * HealthSphere AI - Client API Service
 * Interacts with full-stack Express backend when available,
 * with automatic resilient clinical fallback for static hosting (e.g. Vercel, Netlify).
 */

import {
  User,
  FamilyMember,
  HealthRecord,
  HealthGuardianEvaluation,
  NutritionPlan,
  WomensHealthLog,
  MoodTrackerLog,
  MedicineReminder,
  EmergencyContact,
  Appointment,
  NotificationItem,
  CommunityPost,
} from '../types';

function computeFallbackAssessment(input: any): { evaluation: HealthGuardianEvaluation; record: HealthRecord } {
  const heightM = (input.height_cm || 170) / 100;
  const weightKg = input.weight_kg || 70;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let bmiCat = 'Normal weight';
  if (bmi < 18.5) bmiCat = 'Underweight';
  else if (bmi < 25) bmiCat = 'Normal weight';
  else if (bmi < 30) bmiCat = 'Overweight';
  else bmiCat = 'Obesity';

  const systolic = input.systolic_bp || 120;
  const diastolic = input.diastolic_bp || 80;
  const glucose = input.blood_sugar_mg_dl || 95;

  let bpStatus = 'Normal';
  if (systolic >= 140 || diastolic >= 90) bpStatus = 'Hypertension Stage 2';
  else if (systolic >= 130 || diastolic >= 80) bpStatus = 'Hypertension Stage 1';
  else if (systolic >= 120 && diastolic < 80) bpStatus = 'Elevated';

  let glucoseStatus = 'Normal Fasting';
  if (glucose >= 126) glucoseStatus = 'Diabetic Range';
  else if (glucose >= 100) glucoseStatus = 'Prediabetic Range';

  let score = 100;
  if (bmi > 25) score -= Math.min(15, (bmi - 25) * 2);
  if (bmi < 18.5) score -= 10;
  if (systolic > 120) score -= Math.min(18, (systolic - 120) * 0.8);
  if (glucose > 100) score -= Math.min(15, (glucose - 100) * 0.6);
  if ((input.sleep_hours || 7) < 7) score -= (7 - (input.sleep_hours || 7)) * 3;
  if ((input.exercise_mins || 30) < 30) score -= (30 - (input.exercise_mins || 30)) * 0.3;
  if ((input.stress_level || 3) > 5) score -= ((input.stress_level || 3) - 5) * 2.5;
  if (input.smoking_status && input.smoking_status !== 'never') score -= (input.smoking_status === 'regular' ? 15 : 8);
  if (input.alcohol_consumption === 'heavy') score -= 12;
  else if (input.alcohol_consumption === 'moderate') score -= 5;
  score = Math.max(35, Math.min(98, Math.round(score)));

  let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  if (score < 55 || systolic >= 150 || glucose >= 180) riskLevel = 'critical';
  else if (score < 70 || systolic >= 135 || glucose >= 125) riskLevel = 'high';
  else if (score < 85) riskLevel = 'moderate';

  const evaluation: HealthGuardianEvaluation = {
    health_score: score,
    risk_level: riskLevel,
    bmi,
    bmi_category: bmiCat,
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

  const record: HealthRecord = {
    id: `hr_${Date.now()}`,
    user_id: input.user_id || 'usr_001',
    family_member_id: input.family_member_id || null,
    record_date: new Date().toISOString().split('T')[0],
    systolic_bp: systolic,
    diastolic_bp: diastolic,
    blood_sugar_mg_dl: glucose,
    heart_rate_bpm: input.heart_rate_bpm || 72,
    weight_kg: weightKg,
    height_cm: input.height_cm || 170,
    bmi,
    sleep_hours: input.sleep_hours || 7,
    exercise_mins: input.exercise_mins || 30,
    water_intake_liters: input.water_intake_liters || 2.4,
    stress_level: input.stress_level || 3,
    smoking_status: input.smoking_status || 'never',
    alcohol_consumption: input.alcohol_consumption || 'none',
    health_score: score,
    risk_level: riskLevel,
    clinical_notes: evaluation.summary,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  return { evaluation, record };
}

function computeFallbackNutrition(input: any): NutritionPlan {
  const heightM = (input.height_cm || 170) / 100;
  const weightKg = input.weight_kg || 70;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let bmr = 10 * weightKg + 6.25 * (input.height_cm || 170) - 5 * (input.age || 30);
  if ((input.gender || 'female').toLowerCase() === 'female') {
    bmr -= 161;
  } else {
    bmr += 5;
  }
  const dailyCalories = Math.round(bmr * 1.35);
  const proteinG = Math.round((dailyCalories * 0.22) / 4);
  const carbsG = Math.round((dailyCalories * 0.50) / 4);
  const fatsG = Math.round((dailyCalories * 0.28) / 9);
  const fiberG = Math.max(30, Math.round(dailyCalories / 70));

  return {
    daily_calories: dailyCalories,
    protein_g: proteinG,
    carbs_g: carbsG,
    fats_g: fatsG,
    fiber_g: fiberG,
    bmi,
    diet_philosophy: `Scientifically calibrated ${input.diet_type || 'Vegetarian'} protocol optimized for ${(input.budget_tier || 'standard').toLowerCase()} budget and metabolic harmony.`,
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
        title: (input.diet_type || '').includes('Vegetarian') ? 'Warm Quinoa & Spiced Chickpea Rainbow Bowl' : 'Grilled Herb Salmon with Brown Rice & Steamed Asparagus',
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

export const api = {
  // Auth
  async login(email: string, password?: string): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // fallback
    }

    // Static / Offline fallback
    const role: any = email.includes('admin') ? 'admin' : email.includes('robert') ? 'elder' : 'patient';
    const name = email.includes('admin') ? 'Dr. Aris Vance (CMO)' : email.includes('robert') ? 'Robert Jenkins' : 'Sarah Jenkins';
    return {
      token: `token_${Date.now()}`,
      user: {
        id: `usr_${Date.now()}`,
        full_name: name,
        email,
        role,
        blood_group: role === 'elder' ? 'A+' : 'O+',
        chronic_conditions: role === 'elder' ? 'Hypertension, Type 2 Diabetes' : 'Mild PCOS',
      },
    };
  },

  async register(data: Partial<User> & { password?: string }): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    return {
      token: `token_${Date.now()}`,
      user: {
        id: `usr_${Date.now()}`,
        full_name: data.full_name || 'Patient',
        email: data.email || 'patient@healthsphere.org',
        role: data.role || 'patient',
        blood_group: data.blood_group || 'O+',
      },
    };
  },

  // Health Guardian
  async assessHealth(data: any): Promise<{ evaluation: HealthGuardianEvaluation; record: HealthRecord }> {
    try {
      const res = await fetch('/api/health-guardian/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.evaluation) return json;
      }
    } catch (e) {}

    return computeFallbackAssessment(data);
  },

  // Nutrition Planner
  async getNutritionPlan(data: any): Promise<NutritionPlan> {
    try {
      const res = await fetch('/api/nutrition/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.daily_calories) return json;
      }
    } catch (e) {}

    return computeFallbackNutrition(data);
  },

  // Family Members
  async getFamilyMembers(userId: string): Promise<FamilyMember[]> {
    try {
      const res = await fetch(`/api/family-members?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async addFamilyMember(member: Partial<FamilyMember>): Promise<FamilyMember> {
    try {
      const res = await fetch('/api/family-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      id: `fam_${Date.now()}`,
      user_id: 'usr_001',
      name: member.name || 'Family Member',
      relationship: member.relationship || 'Relative',
      age: member.age || 30,
      gender: member.gender || 'Other',
      blood_group: member.blood_group || 'O+',
      allergies: member.allergies || 'None',
      chronic_conditions: member.chronic_conditions || 'None',
      emergency_contact_phone: member.emergency_contact_phone || '',
      created_at: new Date().toISOString(),
    };
  },

  async deleteFamilyMember(id: string): Promise<void> {
    try {
      await fetch(`/api/family-members/${id}`, { method: 'DELETE' });
    } catch (e) {}
  },

  // Health Records
  async getHealthRecords(userId: string): Promise<HealthRecord[]> {
    try {
      const res = await fetch(`/api/health-records?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  // Women's Health
  async getWomensHealth(userId: string): Promise<WomensHealthLog[]> {
    try {
      const res = await fetch(`/api/womens-health?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async addWomensHealthLog(log: Partial<WomensHealthLog>): Promise<WomensHealthLog> {
    try {
      const res = await fetch('/api/womens-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      id: `wh_${Date.now()}`,
      user_id: 'usr_001',
      log_date: new Date().toISOString().split('T')[0],
      cycle_day: log.cycle_day || 14,
      period_flow: log.period_flow || 'none',
      pcos_symptoms: log.pcos_symptoms || [],
      pregnancy_week: log.pregnancy_week || null,
      iron_deficiency_symptoms: log.iron_deficiency_symptoms || [],
      menopause_symptoms: log.menopause_symptoms || [],
      notes: log.notes || '',
      created_at: new Date().toISOString(),
    };
  },

  // Mood Tracker
  async getMoodLogs(userId: string): Promise<MoodTrackerLog[]> {
    try {
      const res = await fetch(`/api/mood-tracker?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async addMoodLog(log: Partial<MoodTrackerLog>): Promise<MoodTrackerLog> {
    try {
      const res = await fetch('/api/mood-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      id: `mood_${Date.now()}`,
      user_id: 'usr_001',
      log_date: new Date().toISOString().split('T')[0],
      mood_level: log.mood_level || 4,
      mood_emotion: log.mood_emotion || 'Optimistic',
      stress_score: log.stress_score || 3,
      sleep_quality: log.sleep_quality || 4,
      journal_entry: log.journal_entry || '',
      meditation_completed_mins: log.meditation_completed_mins || 10,
      breathing_exercise_completed: Boolean(log.breathing_exercise_completed),
      created_at: new Date().toISOString(),
    };
  },

  // Medicine Reminders
  async getMedicineReminders(userId: string): Promise<MedicineReminder[]> {
    try {
      const res = await fetch(`/api/medicine-reminders?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async addMedicineReminder(reminder: Partial<MedicineReminder>): Promise<MedicineReminder> {
    try {
      const res = await fetch('/api/medicine-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      id: `med_${Date.now()}`,
      user_id: 'usr_001',
      family_member_id: reminder.family_member_id || null,
      medicine_name: reminder.medicine_name || 'Prescription',
      dosage: reminder.dosage || '1 Tablet',
      frequency: reminder.frequency || 'Once daily',
      time_of_day: reminder.time_of_day || 'Morning',
      scheduled_time: reminder.scheduled_time || '08:00',
      instructions: reminder.instructions || '',
      is_taken: false,
      start_date: new Date().toISOString().split('T')[0],
      end_date: null,
      created_at: new Date().toISOString(),
    };
  },

  async toggleMedicineReminder(id: string): Promise<MedicineReminder> {
    try {
      const res = await fetch(`/api/medicine-reminders/${id}/toggle`, {
        method: 'PATCH',
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      id,
      user_id: 'usr_001',
      family_member_id: null,
      medicine_name: 'Medication',
      dosage: '1 tab',
      frequency: 'Daily',
      time_of_day: 'Morning',
      scheduled_time: '08:00',
      instructions: '',
      is_taken: true,
      start_date: '2026-01-01',
      end_date: null,
      created_at: new Date().toISOString(),
    };
  },

  // Emergency Contacts
  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    try {
      const res = await fetch(`/api/emergency-contacts?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async addEmergencyContact(contact: Partial<EmergencyContact>): Promise<EmergencyContact> {
    try {
      const res = await fetch('/api/emergency-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      id: `emg_${Date.now()}`,
      user_id: 'usr_001',
      contact_name: contact.contact_name || 'Emergency Contact',
      relationship: contact.relationship || 'Family',
      phone_number: contact.phone_number || '911',
      is_primary: Boolean(contact.is_primary),
      address: '',
      created_at: new Date().toISOString(),
    };
  },

  // Community
  async getCommunityPosts(): Promise<CommunityPost[]> {
    try {
      const res = await fetch('/api/community/posts');
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async addCommunityPost(post: Partial<CommunityPost>): Promise<CommunityPost> {
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      id: `post_${Date.now()}`,
      user_id: 'usr_001',
      author_name: post.author_name || 'Community Member',
      author_role: post.author_role || 'Patient',
      category: post.category || 'Heart Health',
      title: post.title || 'Discussion',
      content: post.content || '',
      upvotes: 1,
      replies_count: 0,
      is_verified_expert: false,
      created_at: 'Just now',
    };
  },

  async upvoteCommunityPost(id: string): Promise<CommunityPost> {
    try {
      const res = await fetch(`/api/community/posts/${id}/upvote`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      id,
      user_id: 'usr_001',
      author_name: 'Member',
      author_role: 'Patient',
      category: 'Heart Health',
      title: '',
      content: '',
      upvotes: 2,
      replies_count: 0,
      is_verified_expert: false,
      created_at: 'Just now',
    };
  },

  // Appointments & Notifications
  async getAppointments(userId: string): Promise<Appointment[]> {
    try {
      const res = await fetch(`/api/appointments?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async getNotifications(userId: string): Promise<NotificationItem[]> {
    try {
      const res = await fetch(`/api/notifications?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async markNotificationRead(id: string): Promise<void> {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    } catch (e) {}
  },

  // Admin & DB Inspector
  async getAdminMetrics(): Promise<any> {
    try {
      const res = await fetch('/api/admin/metrics');
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      stats: {
        database_type: 'Relational (PostgreSQL / MySQL Normalized Schema)',
        compliance: 'SDG Goal 3 (Good Health and Well-Being)',
        total_records: 30,
        tables: [
          { name: 'users', count: 3, primary_key: 'id' },
          { name: 'family_members', count: 3, primary_key: 'id' },
          { name: 'health_records', count: 3, primary_key: 'id' },
          { name: 'womens_health_logs', count: 2, primary_key: 'id' },
          { name: 'mood_tracker_logs', count: 2, primary_key: 'id' },
          { name: 'medicine_reminders', count: 4, primary_key: 'id' },
          { name: 'nutrition_plans', count: 1, primary_key: 'id' },
          { name: 'emergency_contacts', count: 2, primary_key: 'id' },
        ],
      },
    };
  },

  async getDatabaseSchema(): Promise<any> {
    try {
      const res = await fetch('/api/admin/database-schema');
      if (res.ok) return await res.json();
    } catch (e) {}
    return { sql: '-- Normalized MySQL/PostgreSQL schema loaded' };
  },
};
