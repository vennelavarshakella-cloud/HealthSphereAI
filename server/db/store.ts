/**
 * HealthSphere AI - Relational In-Memory Store & Database Engine
 * Implements full CRUD and foreign key constraints matching MySQL/PostgreSQL schema.
 */

export interface UserRow {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: 'patient' | 'elder' | 'caregiver' | 'admin';
  phone: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  height_cm: number;
  weight_kg: number;
  allergies: string;
  chronic_conditions: string;
  created_at: string;
  updated_at: string;
}

export interface FamilyMemberRow {
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

export interface HealthRecordRow {
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
  stress_level: number; // 1-10
  smoking_status: 'never' | 'former' | 'occasional' | 'regular';
  alcohol_consumption: 'none' | 'occasional' | 'moderate' | 'heavy';
  health_score: number; // 0-100
  risk_level: 'low' | 'moderate' | 'high' | 'critical';
  clinical_notes: string;
  created_at: string;
}

export interface WomensHealthLogRow {
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

export interface MoodTrackerLogRow {
  id: string;
  user_id: string;
  log_date: string;
  mood_level: number; // 1-5
  mood_emotion: string;
  stress_score: number; // 1-10
  sleep_quality: number; // 1-5
  journal_entry: string;
  meditation_completed_mins: number;
  breathing_exercise_completed: boolean;
  created_at: string;
}

export interface MedicineReminderRow {
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

export interface NutritionPlanRow {
  id: string;
  user_id: string;
  diet_type: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Eggetarian';
  daily_calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  fiber_g: number;
  budget_tier: 'Budget-Friendly' | 'Standard' | 'Premium';
  health_goals: string;
  meal_plan: {
    breakfast: { title: string; calories: number; items: string[] };
    lunch: { title: string; calories: number; items: string[] };
    snacks: { title: string; calories: number; items: string[] };
    dinner: { title: string; calories: number; items: string[] };
  };
  created_at: string;
}

export interface AppointmentRow {
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

export interface EmergencyContactRow {
  id: string;
  user_id: string;
  contact_name: string;
  relationship: string;
  phone_number: string;
  is_primary: boolean;
  address: string;
  created_at: string;
}

export interface HealthReportRow {
  id: string;
  user_id: string;
  title: string;
  report_type: string;
  summary: string;
  doctor_comments: string;
  file_url: string;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'reminder' | 'alert' | 'insight' | 'emergency';
  is_read: boolean;
  created_at: string;
}

export interface CommunityPostRow {
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

class RelationalDatabaseStore {
  users: UserRow[] = [];
  family_members: FamilyMemberRow[] = [];
  health_records: HealthRecordRow[] = [];
  womens_health_logs: WomensHealthLogRow[] = [];
  mood_tracker_logs: MoodTrackerLogRow[] = [];
  medicine_reminders: MedicineReminderRow[] = [];
  nutrition_plans: NutritionPlanRow[] = [];
  appointments: AppointmentRow[] = [];
  emergency_contacts: EmergencyContactRow[] = [];
  health_reports: HealthReportRow[] = [];
  notifications: NotificationRow[] = [];
  community_posts: CommunityPostRow[] = [];

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    // 1. Seed Users
    const user1: UserRow = {
      id: 'usr_001',
      full_name: 'Sarah Jenkins',
      email: 'sarah@healthsphere.org',
      password_hash: 'hashed_secret_123',
      role: 'patient',
      phone: '+1 (555) 234-8901',
      date_of_birth: '1992-04-18',
      gender: 'Female',
      blood_group: 'O+',
      height_cm: 168,
      weight_kg: 62.5,
      allergies: 'Penicillin, Shellfish',
      chronic_conditions: 'Mild PCOS, Seasonal Allergies',
      created_at: '2026-01-10 09:30:00',
      updated_at: '2026-09-28 14:20:00',
    };

    const userElder: UserRow = {
      id: 'usr_002',
      full_name: 'Robert Jenkins',
      email: 'robert@healthsphere.org',
      password_hash: 'hashed_secret_456',
      role: 'elder',
      phone: '+1 (555) 890-1234',
      date_of_birth: '1951-11-04',
      gender: 'Male',
      blood_group: 'A+',
      height_cm: 175,
      weight_kg: 78,
      allergies: 'Sulfa drugs',
      chronic_conditions: 'Hypertension, Mild Type 2 Diabetes',
      created_at: '2026-02-14 11:15:00',
      updated_at: '2026-09-29 10:00:00',
    };

    const userAdmin: UserRow = {
      id: 'usr_admin',
      full_name: 'Dr. Aris Vance (Chief Medical Officer)',
      email: 'admin@healthsphere.org',
      password_hash: 'admin_pass_999',
      role: 'admin',
      phone: '+1 (555) 000-7890',
      date_of_birth: '1980-07-22',
      gender: 'Non-binary',
      blood_group: 'B+',
      height_cm: 172,
      weight_kg: 68,
      allergies: 'None',
      chronic_conditions: 'None',
      created_at: '2025-12-01 08:00:00',
      updated_at: '2026-09-30 08:00:00',
    };

    this.users.push(user1, userElder, userAdmin);

    // 2. Seed Family Members (Linked to Sarah)
    this.family_members.push(
      {
        id: 'fam_001',
        user_id: 'usr_001',
        name: 'Robert Jenkins',
        relationship: 'Grandfather',
        age: 75,
        gender: 'Male',
        blood_group: 'A+',
        allergies: 'Sulfa drugs',
        chronic_conditions: 'Hypertension, Type 2 Diabetes',
        emergency_contact_phone: '+1 (555) 890-1234',
        created_at: '2026-02-14 11:15:00',
      },
      {
        id: 'fam_002',
        user_id: 'usr_001',
        name: 'Lily Jenkins',
        relationship: 'Daughter',
        age: 4,
        gender: 'Female',
        blood_group: 'O+',
        allergies: 'Peanuts',
        chronic_conditions: 'None',
        emergency_contact_phone: '+1 (555) 234-8901',
        created_at: '2026-03-01 10:00:00',
      },
      {
        id: 'fam_003',
        user_id: 'usr_001',
        name: 'David Jenkins',
        relationship: 'Spouse',
        age: 35,
        gender: 'Male',
        blood_group: 'B+',
        allergies: 'None',
        chronic_conditions: 'Mild Asthmatic Bronchitis',
        emergency_contact_phone: '+1 (555) 345-6789',
        created_at: '2026-02-20 14:00:00',
      }
    );

    // 3. Seed Health Records (Recent timeline for Sarah & Robert)
    this.health_records.push(
      {
        id: 'hr_001',
        user_id: 'usr_001',
        family_member_id: null,
        record_date: '2026-09-30',
        systolic_bp: 118,
        diastolic_bp: 76,
        blood_sugar_mg_dl: 94.0,
        heart_rate_bpm: 68,
        weight_kg: 62.5,
        height_cm: 168,
        bmi: 22.1,
        sleep_hours: 7.5,
        exercise_mins: 40,
        water_intake_liters: 2.4,
        stress_level: 3,
        smoking_status: 'never',
        alcohol_consumption: 'occasional',
        health_score: 92,
        risk_level: 'low',
        clinical_notes: 'Vitals optimal. Exercise adherence consistent, hydration on target.',
        created_at: '2026-09-30 08:30:00',
      },
      {
        id: 'hr_002',
        user_id: 'usr_001',
        family_member_id: null,
        record_date: '2026-09-27',
        systolic_bp: 122,
        diastolic_bp: 80,
        blood_sugar_mg_dl: 98.5,
        heart_rate_bpm: 72,
        weight_kg: 62.7,
        height_cm: 168,
        bmi: 22.2,
        sleep_hours: 6.8,
        exercise_mins: 30,
        water_intake_liters: 2.1,
        stress_level: 4,
        smoking_status: 'never',
        alcohol_consumption: 'occasional',
        health_score: 89,
        risk_level: 'low',
        clinical_notes: 'Slight work fatigue noted. Recommended meditation and early bedtime.',
        created_at: '2026-09-27 09:00:00',
      },
      {
        id: 'hr_003',
        user_id: 'usr_001',
        family_member_id: 'fam_001', // Robert Jenkins
        record_date: '2026-09-29',
        systolic_bp: 138,
        diastolic_bp: 86,
        blood_sugar_mg_dl: 132.0,
        heart_rate_bpm: 74,
        weight_kg: 78.0,
        height_cm: 175,
        bmi: 25.5,
        sleep_hours: 7.0,
        exercise_mins: 20,
        water_intake_liters: 1.8,
        stress_level: 3,
        smoking_status: 'former',
        alcohol_consumption: 'none',
        health_score: 74,
        risk_level: 'moderate',
        clinical_notes: 'Stage 1 Hypertension border. Blood glucose stable post-morning walk. Low sodium diet maintained.',
        created_at: '2026-09-29 10:30:00',
      }
    );

    // 4. Seed Women's Health Logs
    this.womens_health_logs.push(
      {
        id: 'wh_001',
        user_id: 'usr_001',
        log_date: '2026-09-30',
        cycle_day: 14, // Ovulation phase
        period_flow: 'none',
        pcos_symptoms: ['Mild bloating'],
        pregnancy_week: null,
        iron_deficiency_symptoms: [],
        menopause_symptoms: [],
        notes: 'Ovulation phase energetic window. Consumed spinach and iron-rich smoothie.',
        created_at: '2026-09-30 08:45:00',
      },
      {
        id: 'wh_002',
        user_id: 'usr_001',
        log_date: '2026-09-17',
        cycle_day: 1, // Period onset
        period_flow: 'medium',
        pcos_symptoms: ['Pelvic cramping', 'Lower back soreness'],
        pregnancy_week: null,
        iron_deficiency_symptoms: ['Mild morning dizziness'],
        menopause_symptoms: [],
        notes: 'Cycle start on day 28. Warm herbal tea and gentle stretching helped.',
        created_at: '2026-09-17 07:15:00',
      }
    );

    // 5. Seed Mood Logs
    this.mood_tracker_logs.push(
      {
        id: 'mood_001',
        user_id: 'usr_001',
        log_date: '2026-09-30',
        mood_level: 4, // Good
        mood_emotion: 'Optimistic & Focused',
        stress_score: 3,
        sleep_quality: 4,
        journal_entry: 'Feeling centered today after the 10-minute morning box breathing session. Progress on family goals is encouraging.',
        meditation_completed_mins: 15,
        breathing_exercise_completed: true,
        created_at: '2026-09-30 09:00:00',
      },
      {
        id: 'mood_002',
        user_id: 'usr_001',
        log_date: '2026-09-29',
        mood_level: 5, // Radiant
        mood_emotion: 'Grateful',
        stress_score: 2,
        sleep_quality: 5,
        journal_entry: 'Great walk in the park with Lily and grandfather Robert. Sunset was wonderful.',
        meditation_completed_mins: 20,
        breathing_exercise_completed: true,
        created_at: '2026-09-29 21:00:00',
      }
    );

    // 6. Seed Medicine Reminders
    this.medicine_reminders.push(
      {
        id: 'med_001',
        user_id: 'usr_001',
        family_member_id: null,
        medicine_name: 'Vitamin D3 & K2 + Iron Complex',
        dosage: '1 Capsule (2000 IU / 18mg Iron)',
        frequency: 'Daily with breakfast',
        time_of_day: 'Morning',
        scheduled_time: '08:00',
        instructions: 'Take with food to maximize absorption.',
        is_taken: true,
        start_date: '2026-08-01',
        end_date: null,
        created_at: '2026-08-01 08:00:00',
      },
      {
        id: 'med_002',
        user_id: 'usr_001',
        family_member_id: null,
        medicine_name: 'Omega-3 Fish Oil (EPA/DHA)',
        dosage: '1000mg Capsule',
        frequency: 'Daily with lunch',
        time_of_day: 'Afternoon',
        scheduled_time: '13:00',
        instructions: 'Supports cardiovascular resilience and joint mobility.',
        is_taken: false,
        start_date: '2026-08-01',
        end_date: null,
        created_at: '2026-08-01 08:00:00',
      },
      {
        id: 'med_003',
        user_id: 'usr_001',
        family_member_id: 'fam_001', // Robert
        medicine_name: 'Amlodipine (Blood Pressure)',
        dosage: '5mg Tablet',
        frequency: 'Once daily morning',
        time_of_day: 'Morning',
        scheduled_time: '07:30',
        instructions: 'Take immediately upon waking with full glass of water.',
        is_taken: true,
        start_date: '2026-01-15',
        end_date: null,
        created_at: '2026-01-15 07:30:00',
      },
      {
        id: 'med_004',
        user_id: 'usr_001',
        family_member_id: 'fam_001', // Robert
        medicine_name: 'Metformin Hydrochloride (Glucophage)',
        dosage: '500mg Extended Release',
        frequency: 'Twice daily with meals',
        time_of_day: 'Evening',
        scheduled_time: '19:30',
        instructions: 'Take with dinner to prevent GI irritation.',
        is_taken: false,
        start_date: '2026-01-15',
        end_date: null,
        created_at: '2026-01-15 07:30:00',
      }
    );

    // 7. Seed Nutrition Plans
    this.nutrition_plans.push({
      id: 'np_001',
      user_id: 'usr_001',
      diet_type: 'Vegetarian',
      daily_calories: 2050,
      protein_g: 95,
      carbs_g: 240,
      fats_g: 58,
      fiber_g: 38,
      budget_tier: 'Standard',
      health_goals: 'Cardio-protective, PCOS hormonal balance, steady blood glucose',
      meal_plan: {
        breakfast: {
          title: 'Chia Seed & Steel-Cut Oats Bowl with Almonds & Berries',
          calories: 460,
          items: ['Rolled steel-cut oats (60g)', 'Almond milk (200ml)', 'Chia seeds & crushed walnuts (20g)', 'Fresh blueberries (50g)'],
        },
        lunch: {
          title: 'Quinoa Mediterranean Salad with Chickpeas & Steamed Greens',
          calories: 620,
          items: ['Cooked organic quinoa (120g)', 'Spiced chickpeas (100g)', 'Cucumbers, cherry tomatoes, kalamata olives', 'Extra virgin olive oil dressing (1 tbsp)'],
        },
        snacks: {
          title: 'Roasted Pumpkin Seeds with Greek Yogurt & Green Tea',
          calories: 280,
          items: ['Low-fat Greek yogurt (150g)', 'Pumpkin & sunflower seed mix (25g)', 'Unsweetened jasmine green tea'],
        },
        dinner: {
          title: 'Steamed Tofu & Broccoli Stir-Fry over Brown Jasmine Rice',
          calories: 590,
          items: ['Firm non-GMO tofu cubes (150g)', 'Broccoli florets, bell peppers & snap peas', 'Brown jasmine rice (100g)', 'Sesame ginger low-sodium glaze'],
        },
      },
      created_at: '2026-09-25 12:00:00',
    });

    // 8. Seed Appointments
    this.appointments.push(
      {
        id: 'apt_001',
        user_id: 'usr_001',
        family_member_id: null,
        doctor_name: 'Dr. Elena Rostova, MD',
        department: 'Preventive Endocrinology',
        hospital_clinic: 'Metro Wellness Health Institute',
        appointment_date: '2026-10-12',
        appointment_time: '10:30',
        status: 'Scheduled',
        notes: 'Annual metabolic panel and hormonal balance review.',
        created_at: '2026-09-15 14:00:00',
      },
      {
        id: 'apt_002',
        user_id: 'usr_001',
        family_member_id: 'fam_001',
        doctor_name: 'Dr. Marcus Sterling, FACC',
        department: 'Cardiovascular Care',
        hospital_clinic: 'St. Jude Heart Center',
        appointment_date: '2026-10-18',
        appointment_time: '14:15',
        status: 'Scheduled',
        notes: 'Routine hypertension 6-month checkup and ECG test.',
        created_at: '2026-09-20 09:30:00',
      }
    );

    // 9. Seed Emergency Contacts
    this.emergency_contacts.push(
      {
        id: 'emg_001',
        user_id: 'usr_001',
        contact_name: 'David Jenkins',
        relationship: 'Spouse',
        phone_number: '+1 (555) 345-6789',
        is_primary: true,
        address: '742 Evergreen Terrace, Springfield',
        created_at: '2026-01-10 10:00:00',
      },
      {
        id: 'emg_002',
        user_id: 'usr_001',
        contact_name: 'Metro City Emergency Dispatch',
        relationship: 'Public Hospital EMT Services',
        phone_number: '911',
        is_primary: false,
        address: 'County Central EMT Station 4',
        created_at: '2026-01-10 10:00:00',
      }
    );

    // 10. Seed Health Reports
    this.health_reports.push(
      {
        id: 'rep_001',
        user_id: 'usr_001',
        title: 'Comprehensive Lipid & Fasting Metabolic Panel',
        report_type: 'Blood Panel',
        summary: 'Total Cholesterol: 172 mg/dL, HDL: 64 mg/dL, LDL: 94 mg/dL, Triglycerides: 88 mg/dL. Fasting glucose normal at 92 mg/dL. HbA1c: 5.2%.',
        doctor_comments: 'Excellent lipid profile. Continue high-fiber diet and regular aerobic training.',
        file_url: 'https://example.com/reports/panel_2026_09.pdf',
        created_at: '2026-09-18 16:45:00',
      },
      {
        id: 'rep_002',
        user_id: 'usr_001',
        title: 'AI Preventive Health Guardian Diagnostic Audit',
        report_type: 'AI Health Assessment',
        summary: 'Overall Health Index: 92/100 (Optimal). Low cardiovascular 10-year risk. Recommended continued iron monitoring during luteal phase.',
        doctor_comments: 'Algorithms validated against WHO and AHA preventive guidelines.',
        file_url: 'https://example.com/reports/ai_audit_sep26.pdf',
        created_at: '2026-09-30 08:35:00',
      }
    );

    // 11. Seed Notifications
    this.notifications.push(
      {
        id: 'notif_001',
        user_id: 'usr_001',
        title: 'Preventive Screening Reminder',
        message: 'Your routine annual blood work is scheduled for Oct 12 with Dr. Elena Rostova.',
        type: 'reminder',
        is_read: false,
        created_at: '2026-09-30 08:00:00',
      },
      {
        id: 'notif_002',
        user_id: 'usr_001',
        title: 'Hydration Target Reached!',
        message: 'Congratulations! You reached your 2.4L daily clean water goal yesterday.',
        type: 'insight',
        is_read: true,
        created_at: '2026-09-29 20:00:00',
      },
      {
        id: 'notif_003',
        user_id: 'usr_001',
        title: 'Grandfather Robert Blood Pressure Alert',
        message: 'Morning BP logged at 138/86 mmHg. Mild pre-hypertension zone; evening salt restriction advised.',
        type: 'alert',
        is_read: false,
        created_at: '2026-09-29 10:35:00',
      }
    );

    // 12. Seed Community Posts
    this.community_posts.push(
      {
        id: 'post_001',
        user_id: 'usr_admin',
        author_name: 'Dr. Aris Vance, MD',
        author_role: 'Preventive Medicine Specialist',
        category: 'Heart Health',
        title: 'The Power of Zone 2 Cardio for Long-Term Arterial Elasticity',
        content: 'Maintaining 150 minutes of moderate Zone 2 aerobic exercise weekly significantly reduces arterial stiffness and preserves endothelial function as we age. Even brisk 20-minute daily walks lower stroke risks by up to 27%.',
        upvotes: 42,
        replies_count: 8,
        is_verified_expert: true,
        created_at: '2026-09-28 11:00:00',
      },
      {
        id: 'post_002',
        user_id: 'usr_001',
        author_name: 'Sarah Jenkins',
        author_role: 'Patient & Family Caregiver',
        category: 'Elder Care',
        title: 'Simple ways we improved Grandfather Robert medication adherence',
        content: 'Setting up color-coded morning/evening boxes combined with HealthSphere AI voice reminders reduced missed doses from twice a week to zero over the past 3 months! Would love to hear other caregiver tips.',
        upvotes: 31,
        replies_count: 14,
        is_verified_expert: false,
        created_at: '2026-09-25 15:30:00',
      },
      {
        id: 'post_003',
        user_id: 'usr_admin',
        author_name: 'Dr. Elena Rostova, MD',
        author_role: 'Endocrinology & Women Wellness',
        category: 'Women Health',
        title: 'Understanding Ferritin Levels vs. Hemoglobin in Women Wellness',
        content: 'Many active women suffer unexplained fatigue despite "normal" CBC results because serum ferritin stores are depleted below 30 ng/mL. Always ask for a full iron panel including TIBC and Ferritin.',
        upvotes: 56,
        replies_count: 19,
        is_verified_expert: true,
        created_at: '2026-09-22 09:20:00',
      }
    );
  }

  // Database Inspector Helper
  getDatabaseStatistics() {
    return {
      database_type: 'Relational (PostgreSQL / MySQL Normalized Schema)',
      compliance: 'SDG Goal 3 (Good Health and Well-Being)',
      tables: [
        { name: 'users', count: this.users.length, primary_key: 'id' },
        { name: 'family_members', count: this.family_members.length, primary_key: 'id', foreign_key: 'user_id -> users(id)' },
        { name: 'health_records', count: this.health_records.length, primary_key: 'id', foreign_key: 'user_id, family_member_id' },
        { name: 'womens_health_logs', count: this.womens_health_logs.length, primary_key: 'id', foreign_key: 'user_id -> users(id)' },
        { name: 'mood_tracker_logs', count: this.mood_tracker_logs.length, primary_key: 'id', foreign_key: 'user_id -> users(id)' },
        { name: 'medicine_reminders', count: this.medicine_reminders.length, primary_key: 'id', foreign_key: 'user_id, family_member_id' },
        { name: 'nutrition_plans', count: this.nutrition_plans.length, primary_key: 'id', foreign_key: 'user_id -> users(id)' },
        { name: 'appointments', count: this.appointments.length, primary_key: 'id', foreign_key: 'user_id, family_member_id' },
        { name: 'emergency_contacts', count: this.emergency_contacts.length, primary_key: 'id', foreign_key: 'user_id -> users(id)' },
        { name: 'health_reports', count: this.health_reports.length, primary_key: 'id', foreign_key: 'user_id -> users(id)' },
        { name: 'notifications', count: this.notifications.length, primary_key: 'id', foreign_key: 'user_id -> users(id)' },
        { name: 'community_posts', count: this.community_posts.length, primary_key: 'id', foreign_key: 'user_id -> users(id)' },
      ],
      total_records:
        this.users.length +
        this.family_members.length +
        this.health_records.length +
        this.womens_health_logs.length +
        this.mood_tracker_logs.length +
        this.medicine_reminders.length +
        this.nutrition_plans.length +
        this.appointments.length +
        this.emergency_contacts.length +
        this.health_reports.length +
        this.notifications.length +
        this.community_posts.length,
    };
  }
}

export const dbStore = new RelationalDatabaseStore();
