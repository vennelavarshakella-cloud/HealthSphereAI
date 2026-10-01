/**
 * HealthSphere AI - Express Full-Stack Server
 * Implements REST APIs, Authentication, Gemini AI Health Guardian, and Vite Middleware.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { dbStore, UserRow, HealthRecordRow, FamilyMemberRow, MedicineReminderRow, WomensHealthLogRow, MoodTrackerLogRow, EmergencyContactRow } from './server/db/store.ts';
import { evaluateHealthGuardian, generateNutritionPlan } from './server/services/geminiService.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// API Routes

// 1. Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = dbStore.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());

  if (!user) {
    return res.status(401).json({ error: 'User not found with this email address.' });
  }

  // Pre-seeded or simple check
  return res.json({
    token: `token_${user.id}_${Date.now()}`,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      blood_group: user.blood_group,
      chronic_conditions: user.chronic_conditions,
      allergies: user.allergies,
    },
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { full_name, email, password, role, phone, blood_group, height_cm, weight_kg, allergies, chronic_conditions } = req.body;
  if (!full_name || !email) {
    return res.status(400).json({ error: 'Full name and email are required.' });
  }

  const existing = dbStore.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newUser: UserRow = {
    id: `usr_${Date.now()}`,
    full_name,
    email: email.trim(),
    password_hash: 'hashed_' + (password || 'default'),
    role: role || 'patient',
    phone: phone || '',
    date_of_birth: '1995-01-01',
    gender: 'Other',
    blood_group: blood_group || 'O+',
    height_cm: Number(height_cm) || 170,
    weight_kg: Number(weight_kg) || 68,
    allergies: allergies || '',
    chronic_conditions: chronic_conditions || '',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  dbStore.users.push(newUser);

  res.status(201).json({
    token: `token_${newUser.id}_${Date.now()}`,
    user: {
      id: newUser.id,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      blood_group: newUser.blood_group,
    },
  });
});

app.get('/api/auth/users', (req: Request, res: Response) => {
  const sanitized = dbStore.users.map(u => ({
    id: u.id,
    full_name: u.full_name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    blood_group: u.blood_group,
    chronic_conditions: u.chronic_conditions,
  }));
  res.json(sanitized);
});

// 2. Health Guardian AI Evaluation
app.post('/api/health-guardian/assess', async (req: Request, res: Response) => {
  try {
    const input = req.body;
    const evaluation = await evaluateHealthGuardian(input);

    // Save record to normalized health_records table
    const newRecord: HealthRecordRow = {
      id: `hr_${Date.now()}`,
      user_id: input.user_id || 'usr_001',
      family_member_id: input.family_member_id || null,
      record_date: new Date().toISOString().split('T')[0],
      systolic_bp: Number(input.systolic_bp) || 120,
      diastolic_bp: Number(input.diastolic_bp) || 80,
      blood_sugar_mg_dl: Number(input.blood_sugar_mg_dl) || 95,
      heart_rate_bpm: Number(input.heart_rate_bpm) || 72,
      weight_kg: Number(input.weight_kg) || 70,
      height_cm: Number(input.height_cm) || 170,
      bmi: evaluation.bmi,
      sleep_hours: Number(input.sleep_hours) || 7,
      exercise_mins: Number(input.exercise_mins) || 30,
      water_intake_liters: Number(input.water_intake_liters) || 2,
      stress_level: Number(input.stress_level) || 3,
      smoking_status: input.smoking_status || 'never',
      alcohol_consumption: input.alcohol_consumption || 'none',
      health_score: evaluation.health_score,
      risk_level: evaluation.risk_level,
      clinical_notes: evaluation.summary,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    dbStore.health_records.unshift(newRecord);

    res.json({
      evaluation,
      record: newRecord,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process health evaluation.' });
  }
});

// 3. Nutrition Planner AI
app.post('/api/nutrition/plan', async (req: Request, res: Response) => {
  try {
    const input = req.body;
    const plan = await generateNutritionPlan(input);

    // Store in nutrition_plans table
    const newPlan = {
      id: `np_${Date.now()}`,
      user_id: input.user_id || 'usr_001',
      diet_type: input.diet_type || 'Vegetarian',
      daily_calories: plan.daily_calories,
      protein_g: plan.protein_g,
      carbs_g: plan.carbs_g,
      fats_g: plan.fats_g,
      fiber_g: plan.fiber_g,
      budget_tier: input.budget_tier || 'Standard',
      health_goals: input.health_goals || 'Preventive Vitality',
      meal_plan: plan.meal_plan,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    dbStore.nutrition_plans.unshift(newPlan as any);

    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate nutrition plan.' });
  }
});

// 4. Family Members CRUD
app.get('/api/family-members', (req: Request, res: Response) => {
  const userId = (req.query.user_id as string) || 'usr_001';
  const members = dbStore.family_members.filter(f => f.user_id === userId);
  res.json(members);
});

app.post('/api/family-members', (req: Request, res: Response) => {
  const { user_id, name, relationship, age, gender, blood_group, allergies, chronic_conditions, emergency_contact_phone } = req.body;
  if (!name || !relationship) {
    return res.status(400).json({ error: 'Name and relationship are required.' });
  }

  const member: FamilyMemberRow = {
    id: `fam_${Date.now()}`,
    user_id: user_id || 'usr_001',
    name,
    relationship,
    age: Number(age) || 30,
    gender: gender || 'Other',
    blood_group: blood_group || 'O+',
    allergies: allergies || 'None',
    chronic_conditions: chronic_conditions || 'None',
    emergency_contact_phone: emergency_contact_phone || '',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  dbStore.family_members.push(member);
  res.status(201).json(member);
});

app.delete('/api/family-members/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const index = dbStore.family_members.findIndex(m => m.id === id);
  if (index !== -1) {
    dbStore.family_members.splice(index, 1);
    return res.json({ success: true, message: 'Family member removed.' });
  }
  res.status(404).json({ error: 'Not found.' });
});

// 5. Health Records
app.get('/api/health-records', (req: Request, res: Response) => {
  const userId = (req.query.user_id as string) || 'usr_001';
  const records = dbStore.health_records.filter(r => r.user_id === userId);
  res.json(records);
});

// 6. Women's Health
app.get('/api/womens-health', (req: Request, res: Response) => {
  const userId = (req.query.user_id as string) || 'usr_001';
  const logs = dbStore.womens_health_logs.filter(l => l.user_id === userId);
  res.json(logs);
});

app.post('/api/womens-health', (req: Request, res: Response) => {
  const { user_id, cycle_day, period_flow, pcos_symptoms, pregnancy_week, iron_deficiency_symptoms, menopause_symptoms, notes } = req.body;
  const newLog: WomensHealthLogRow = {
    id: `wh_${Date.now()}`,
    user_id: user_id || 'usr_001',
    log_date: new Date().toISOString().split('T')[0],
    cycle_day: Number(cycle_day) || 1,
    period_flow: period_flow || 'none',
    pcos_symptoms: Array.isArray(pcos_symptoms) ? pcos_symptoms : [],
    pregnancy_week: pregnancy_week ? Number(pregnancy_week) : null,
    iron_deficiency_symptoms: Array.isArray(iron_deficiency_symptoms) ? iron_deficiency_symptoms : [],
    menopause_symptoms: Array.isArray(menopause_symptoms) ? menopause_symptoms : [],
    notes: notes || '',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  dbStore.womens_health_logs.unshift(newLog);
  res.status(201).json(newLog);
});

// 7. Mood Tracker
app.get('/api/mood-tracker', (req: Request, res: Response) => {
  const userId = (req.query.user_id as string) || 'usr_001';
  const logs = dbStore.mood_tracker_logs.filter(m => m.user_id === userId);
  res.json(logs);
});

app.post('/api/mood-tracker', (req: Request, res: Response) => {
  const { user_id, mood_level, mood_emotion, stress_score, sleep_quality, journal_entry, meditation_completed_mins, breathing_exercise_completed } = req.body;
  const newMood: MoodTrackerLogRow = {
    id: `mood_${Date.now()}`,
    user_id: user_id || 'usr_001',
    log_date: new Date().toISOString().split('T')[0],
    mood_level: Number(mood_level) || 3,
    mood_emotion: mood_emotion || 'Balanced',
    stress_score: Number(stress_score) || 4,
    sleep_quality: Number(sleep_quality) || 4,
    journal_entry: journal_entry || '',
    meditation_completed_mins: Number(meditation_completed_mins) || 0,
    breathing_exercise_completed: Boolean(breathing_exercise_completed),
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  dbStore.mood_tracker_logs.unshift(newMood);
  res.status(201).json(newMood);
});

// 8. Medicine Reminders
app.get('/api/medicine-reminders', (req: Request, res: Response) => {
  const userId = (req.query.user_id as string) || 'usr_001';
  const reminders = dbStore.medicine_reminders.filter(r => r.user_id === userId);
  res.json(reminders);
});

app.post('/api/medicine-reminders', (req: Request, res: Response) => {
  const { user_id, family_member_id, medicine_name, dosage, frequency, time_of_day, scheduled_time, instructions } = req.body;
  const reminder: MedicineReminderRow = {
    id: `med_${Date.now()}`,
    user_id: user_id || 'usr_001',
    family_member_id: family_member_id || null,
    medicine_name: medicine_name || 'Prescription',
    dosage: dosage || '1 tablet',
    frequency: frequency || 'Daily',
    time_of_day: time_of_day || 'Morning',
    scheduled_time: scheduled_time || '08:00',
    instructions: instructions || 'Take with water',
    is_taken: false,
    start_date: new Date().toISOString().split('T')[0],
    end_date: null,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  dbStore.medicine_reminders.unshift(reminder);
  res.status(201).json(reminder);
});

app.patch('/api/medicine-reminders/:id/toggle', (req: Request, res: Response) => {
  const id = req.params.id;
  const item = dbStore.medicine_reminders.find(m => m.id === id);
  if (item) {
    item.is_taken = !item.is_taken;
    return res.json(item);
  }
  res.status(404).json({ error: 'Reminder not found.' });
});

// 9. Emergency Contacts
app.get('/api/emergency-contacts', (req: Request, res: Response) => {
  const userId = (req.query.user_id as string) || 'usr_001';
  const contacts = dbStore.emergency_contacts.filter(c => c.user_id === userId);
  res.json(contacts);
});

app.post('/api/emergency-contacts', (req: Request, res: Response) => {
  const { user_id, contact_name, relationship, phone_number, is_primary, address } = req.body;
  const newContact: EmergencyContactRow = {
    id: `emg_${Date.now()}`,
    user_id: user_id || 'usr_001',
    contact_name,
    relationship,
    phone_number,
    is_primary: Boolean(is_primary),
    address: address || '',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  dbStore.emergency_contacts.push(newContact);
  res.status(201).json(newContact);
});

// 10. Community Posts
app.get('/api/community/posts', (req: Request, res: Response) => {
  res.json(dbStore.community_posts);
});

app.post('/api/community/posts', (req: Request, res: Response) => {
  const { user_id, author_name, author_role, category, title, content } = req.body;
  const newPost = {
    id: `post_${Date.now()}`,
    user_id: user_id || 'usr_001',
    author_name: author_name || 'Community Member',
    author_role: author_role || 'Patient',
    category: category || 'General',
    title,
    content,
    upvotes: 1,
    replies_count: 0,
    is_verified_expert: false,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  dbStore.community_posts.unshift(newPost as any);
  res.status(201).json(newPost);
});

app.post('/api/community/posts/:id/upvote', (req: Request, res: Response) => {
  const post = dbStore.community_posts.find(p => p.id === req.params.id);
  if (post) {
    post.upvotes += 1;
    return res.json(post);
  }
  res.status(404).json({ error: 'Post not found.' });
});

// 11. Appointments
app.get('/api/appointments', (req: Request, res: Response) => {
  const userId = (req.query.user_id as string) || 'usr_001';
  res.json(dbStore.appointments.filter(a => a.user_id === userId));
});

// 12. Notifications
app.get('/api/notifications', (req: Request, res: Response) => {
  const userId = (req.query.user_id as string) || 'usr_001';
  res.json(dbStore.notifications.filter(n => n.user_id === userId));
});

app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
  const notif = dbStore.notifications.find(n => n.id === req.params.id);
  if (notif) {
    notif.is_read = true;
    return res.json(notif);
  }
  res.status(404).json({ error: 'Notification not found.' });
});

// 13. Admin & Database Inspector API
app.get('/api/admin/metrics', (req: Request, res: Response) => {
  const stats = dbStore.getDatabaseStatistics();
  res.json({
    stats,
    users_overview: dbStore.users.map(u => ({ id: u.id, name: u.full_name, email: u.email, role: u.role })),
    system_status: {
      uptime_seconds: Math.round(process.uptime()),
      node_version: process.version,
      database_engine: 'MySQL / PostgreSQL Normalized Architecture',
      gemini_ai_engine: process.env.GEMINI_API_KEY ? 'gemini-3.8-flash (Active)' : 'Clinical Rule Engine (Active)',
      sdg_target: 'SDG 3: Good Health and Well-Being (Target 3.4 & 3.8)',
    },
  });
});

app.get('/api/admin/database-schema', (req: Request, res: Response) => {
  try {
    const sqlPath = path.resolve(process.cwd(), 'server/db/schema.sql');
    let sqlContent = '';
    if (fs.existsSync(sqlPath)) {
      sqlContent = fs.readFileSync(sqlPath, 'utf8');
    }
    res.json({
      sql: sqlContent,
      tables: {
        users: dbStore.users,
        family_members: dbStore.family_members,
        health_records: dbStore.health_records,
        womens_health_logs: dbStore.womens_health_logs,
        mood_tracker_logs: dbStore.mood_tracker_logs,
        medicine_reminders: dbStore.medicine_reminders,
        nutrition_plans: dbStore.nutrition_plans,
        appointments: dbStore.appointments,
        emergency_contacts: dbStore.emergency_contacts,
        health_reports: dbStore.health_reports,
        notifications: dbStore.notifications,
        community_posts: dbStore.community_posts,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HealthSphere AI server listening on port ${PORT}`);
  });
}

startServer();
