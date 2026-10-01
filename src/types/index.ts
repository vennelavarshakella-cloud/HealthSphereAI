/**
 * HealthSphere AI - Frontend TypeScript Type Definitions
 */

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'patient' | 'elder' | 'caregiver' | 'admin';
  phone?: string;
  blood_group?: string;
  chronic_conditions?: string;
  allergies?: string;
}

export interface FamilyMember {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  age: number;
  gender: string;
  blood_group: string;
  allergies: string;
  chronic_conditions: string;
  emergency_contact_phone: string;
  created_at: string;
}

export interface HealthRecord {
  id: string;
  user_id: string;
  family_member_id: string | null;
  record_date: string;
  systolic_bp: number;
  diastolic_bp: number;
  blood_sugar_mg_dl: number;
  heart_rate_bpm: number;
  weight_kg: number;
  height_cm: number;
  bmi: number;
  sleep_hours: number;
  exercise_mins: number;
  water_intake_liters: number;
  stress_level: number;
  smoking_status: 'never' | 'former' | 'occasional' | 'regular';
  alcohol_consumption: 'none' | 'occasional' | 'moderate' | 'heavy';
  health_score: number;
  risk_level: 'low' | 'moderate' | 'high' | 'critical';
  clinical_notes: string;
  created_at: string;
}

export interface HealthGuardianEvaluation {
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

export interface NutritionPlan {
  daily_calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  fiber_g: number;
  bmi: number;
  diet_philosophy: string;
  meal_plan: {
    breakfast: { title: string; calories: number; items: string[] };
    lunch: { title: string; calories: number; items: string[] };
    snacks: { title: string; calories: number; items: string[] };
    dinner: { title: string; calories: number; items: string[] };
  };
  key_nutrients_highlight: string[];
  budget_friendly_tips: string[];
}

export interface WomensHealthLog {
  id: string;
  user_id: string;
  log_date: string;
  cycle_day: number;
  period_flow: 'spotting' | 'light' | 'medium' | 'heavy' | 'none';
  pcos_symptoms: string[];
  pregnancy_week: number | null;
  iron_deficiency_symptoms: string[];
  menopause_symptoms: string[];
  notes: string;
  created_at: string;
}

export interface MoodTrackerLog {
  id: string;
  user_id: string;
  log_date: string;
  mood_level: number;
  mood_emotion: string;
  stress_score: number;
  sleep_quality: number;
  journal_entry: string;
  meditation_completed_mins: number;
  breathing_exercise_completed: boolean;
  created_at: string;
}

export interface MedicineReminder {
  id: string;
  user_id: string;
  family_member_id: string | null;
  medicine_name: string;
  dosage: string;
  frequency: string;
  time_of_day: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime';
  scheduled_time: string;
  instructions: string;
  is_taken: boolean;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  contact_name: string;
  relationship: string;
  phone_number: string;
  is_primary: boolean;
  address: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  family_member_id: string | null;
  doctor_name: string;
  department: string;
  hospital_clinic: string;
  appointment_date: string;
  appointment_time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'reminder' | 'alert' | 'insight' | 'emergency';
  is_read: boolean;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  author_name: string;
  author_role: string;
  category: 'Heart Health' | 'Diabetes Care' | 'Mental Peace' | 'Women Health' | 'Elder Care' | 'Nutrition';
  title: string;
  content: string;
  upvotes: number;
  replies_count: number;
  is_verified_expert: boolean;
  created_at: string;
}

export interface ElderAccessibilityConfig {
  largeFont: boolean;
  highContrast: boolean;
  speechEnabled: boolean;
}
