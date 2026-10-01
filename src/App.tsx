/**
 * HealthSphere AI – Smart Preventive Healthcare Platform
 * Full-Stack React Application adhering to UN SDG Goal 3: Good Health and Well-Being.
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { N8nChatWidget } from './components/N8nChatWidget';
import { N8nChatPage } from './pages/N8nChatPage';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { AIHealthGuardianPage } from './pages/AIHealthGuardianPage';
import { FamilyDashboardPage } from './pages/FamilyDashboardPage';
import { WomensWellnessPage } from './pages/WomensWellnessPage';
import { MentalWellnessPage } from './pages/MentalWellnessPage';
import { ElderCarePage } from './pages/ElderCarePage';
import { NutritionPlannerPage } from './pages/NutritionPlannerPage';
import { MedicineReminderPage } from './pages/MedicineReminderPage';
import { EmergencyAssistancePage } from './pages/EmergencyAssistancePage';
import { HealthAnalyticsPage } from './pages/HealthAnalyticsPage';
import { CommunitySupportPage } from './pages/CommunitySupportPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import {
  User,
  HealthRecord,
  MedicineReminder,
  FamilyMember,
  EmergencyContact,
  NotificationItem,
  WomensHealthLog,
  MoodTrackerLog,
  CommunityPost,
  ElderAccessibilityConfig,
} from './types';
import { api } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Pre-seeded active patient user
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_001',
    full_name: 'Sarah Jenkins',
    email: 'sarah@healthsphere.org',
    role: 'patient',
    phone: '+1 (555) 234-8901',
    blood_group: 'O+',
    chronic_conditions: 'Mild PCOS, Seasonal Allergies',
    allergies: 'Penicillin, Shellfish',
  });

  // Telemetry & Records State
  const [records, setRecords] = useState<HealthRecord[]>([
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
      clinical_notes: 'Slight fatigue noted. Recommended meditation and early bedtime.',
      created_at: '2026-09-27 09:00:00',
    },
  ]);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
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
    },
  ]);

  const [reminders, setReminders] = useState<MedicineReminder[]>([
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
      family_member_id: 'fam_001',
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
      family_member_id: 'fam_001',
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
    },
  ]);

  const [contacts, setContacts] = useState<EmergencyContact[]>([
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
      relationship: 'Hospital EMT Services',
      phone_number: '911',
      is_primary: false,
      address: 'County Central EMT Station 4',
      created_at: '2026-01-10 10:00:00',
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
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
    },
  ]);

  const [womensLogs, setWomensLogs] = useState<WomensHealthLog[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodTrackerLog[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
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
    },
  ]);

  // Elder Care Accessibility State
  const [elderConfig, setElderConfig] = useState<ElderAccessibilityConfig>({
    largeFont: false,
    highContrast: false,
    speechEnabled: false,
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Synchronize CSS class modifiers with body tag
  useEffect(() => {
    if (elderConfig.largeFont) {
      document.body.classList.add('elder-large-font');
    } else {
      document.body.classList.remove('elder-large-font');
    }

    if (elderConfig.highContrast) {
      document.body.classList.add('elder-high-contrast');
    } else {
      document.body.classList.remove('elder-high-contrast');
    }
  }, [elderConfig]);

  // Read Aloud speech synthesis
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    let textToSpeak = `HealthSphere AI platform. Currently viewing ${currentPage} page. UN SDG Goal 3: Good Health and Well-Being. Your current composite health score is ${records[0]?.health_score || 92} out of 100.`;

    if (currentPage === 'elder-care') {
      textToSpeak = 'Elder Care and Senior Longevity Portal. You can track your blood pressure, view large medication buttons, or press the red emergency button for immediate SOS dispatch.';
    } else if (currentPage === 'ai-guardian') {
      textToSpeak = 'AI Health Guardian Assessment. Enter your systolic and diastolic blood pressure, fasting glucose, sleep, and symptoms to receive real-time clinical analysis.';
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Handlers
  const handleToggleReminder = async (id: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, is_taken: !r.is_taken } : r))
    );
    try {
      await api.toggleMedicineReminder(id);
    } catch (e) {
      // already toggled in UI
    }
  };

  const handleAddReminder = async (rem: Partial<MedicineReminder>) => {
    const newRem: MedicineReminder = {
      id: `med_${Date.now()}`,
      user_id: currentUser?.id || 'usr_001',
      family_member_id: rem.family_member_id || null,
      medicine_name: rem.medicine_name || 'Prescription',
      dosage: rem.dosage || '1 Tablet',
      frequency: rem.frequency || 'Once daily',
      time_of_day: rem.time_of_day || 'Morning',
      scheduled_time: rem.scheduled_time || '08:00',
      instructions: rem.instructions || '',
      is_taken: false,
      start_date: new Date().toISOString().split('T')[0],
      end_date: null,
      created_at: new Date().toISOString(),
    };
    setReminders([newRem, ...reminders]);
    try {
      await api.addMedicineReminder(rem);
    } catch (e) {}
  };

  const handleAddFamilyMember = async (member: Partial<FamilyMember>) => {
    const newMem: FamilyMember = {
      id: `fam_${Date.now()}`,
      user_id: currentUser?.id || 'usr_001',
      name: member.name || 'Member',
      relationship: member.relationship || 'Relative',
      age: member.age || 30,
      gender: member.gender || 'Other',
      blood_group: member.blood_group || 'O+',
      allergies: member.allergies || 'None',
      chronic_conditions: member.chronic_conditions || 'None',
      emergency_contact_phone: member.emergency_contact_phone || '',
      created_at: new Date().toISOString(),
    };
    setFamilyMembers([...familyMembers, newMem]);
    try {
      await api.addFamilyMember(member);
    } catch (e) {}
  };

  const handleDeleteFamilyMember = async (id: string) => {
    setFamilyMembers(familyMembers.filter(f => f.id !== id));
    try {
      await api.deleteFamilyMember(id);
    } catch (e) {}
  };

  const handleAddEmergencyContact = async (c: Partial<EmergencyContact>) => {
    const newC: EmergencyContact = {
      id: `emg_${Date.now()}`,
      user_id: currentUser?.id || 'usr_001',
      contact_name: c.contact_name || 'Contact',
      relationship: c.relationship || 'Friend',
      phone_number: c.phone_number || '',
      is_primary: Boolean(c.is_primary),
      address: '',
      created_at: new Date().toISOString(),
    };
    setContacts([...contacts, newC]);
    try {
      await api.addEmergencyContact(c);
    } catch (e) {}
  };

  const handleAddCommunityPost = async (post: Partial<CommunityPost>) => {
    const newP: CommunityPost = {
      id: `post_${Date.now()}`,
      user_id: currentUser?.id || 'usr_001',
      author_name: post.author_name || currentUser?.full_name || 'Sarah Jenkins',
      author_role: post.author_role || 'Patient',
      category: post.category || 'Heart Health',
      title: post.title || 'Discussion',
      content: post.content || '',
      upvotes: 1,
      replies_count: 0,
      is_verified_expert: false,
      created_at: 'Just now',
    };
    setCommunityPosts([newP, ...communityPosts]);
    try {
      await api.addCommunityPost(post);
    } catch (e) {}
  };

  const handleUpvotePost = async (id: string) => {
    setCommunityPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
    try {
      await api.upvoteCommunityPost(id);
    } catch (e) {}
  };

  const handleMarkNotificationRead = async (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      await api.markNotificationRead(id);
    } catch (e) {}
  };

  const handleRecordSaved = (record: HealthRecord) => {
    setRecords([record, ...records]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors">
      {/* Navigation & Accessibility Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          setCurrentPage('home');
        }}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        elderConfig={elderConfig}
        onToggleLargeFont={() =>
          setElderConfig(c => ({ ...c, largeFont: !c.largeFont }))
        }
        onToggleHighContrast={() =>
          setElderConfig(c => ({ ...c, highContrast: !c.highContrast }))
        }
        onToggleSpeech={handleToggleSpeech}
        isSpeaking={isSpeaking}
        onStopSpeech={handleStopSpeech}
      />

      {/* Main Page Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={setCurrentPage}
            currentUser={currentUser}
            latestRecord={records[0] || null}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            currentUser={currentUser}
            records={records}
            reminders={reminders}
            familyMembers={familyMembers}
            onNavigate={setCurrentPage}
            onToggleReminder={handleToggleReminder}
          />
        )}

        {currentPage === 'n8n-chat' && (
          <N8nChatPage currentUser={currentUser} />
        )}

        {currentPage === 'ai-guardian' && (
          <AIHealthGuardianPage
            currentUser={currentUser}
            onRecordSaved={handleRecordSaved}
          />
        )}

        {currentPage === 'family' && (
          <FamilyDashboardPage
            currentUser={currentUser}
            familyMembers={familyMembers}
            onAddFamilyMember={handleAddFamilyMember}
            onDeleteFamilyMember={handleDeleteFamilyMember}
            records={records}
            reminders={reminders}
          />
        )}

        {currentPage === 'womens-wellness' && (
          <WomensWellnessPage
            currentUser={currentUser}
            logs={womensLogs}
            onAddLog={log => setWomensLogs([log as any, ...womensLogs])}
          />
        )}

        {currentPage === 'mental-wellness' && (
          <MentalWellnessPage
            currentUser={currentUser}
            logs={moodLogs}
            onAddMoodLog={log => setMoodLogs([log as any, ...moodLogs])}
          />
        )}

        {currentPage === 'elder-care' && (
          <ElderCarePage
            currentUser={currentUser}
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            elderConfig={elderConfig}
            onToggleLargeFont={() =>
              setElderConfig(c => ({ ...c, largeFont: !c.largeFont }))
            }
            onToggleHighContrast={() =>
              setElderConfig(c => ({ ...c, highContrast: !c.highContrast }))
            }
            onToggleSpeech={handleToggleSpeech}
            isSpeaking={isSpeaking}
            onStopSpeech={handleStopSpeech}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'nutrition' && (
          <NutritionPlannerPage currentUser={currentUser} />
        )}

        {currentPage === 'medicines' && (
          <MedicineReminderPage
            currentUser={currentUser}
            reminders={reminders}
            familyMembers={familyMembers}
            onToggleReminder={handleToggleReminder}
            onAddReminder={handleAddReminder}
          />
        )}

        {currentPage === 'emergency' && (
          <EmergencyAssistancePage
            currentUser={currentUser}
            contacts={contacts}
            onAddContact={handleAddEmergencyContact}
          />
        )}

        {currentPage === 'analytics' && (
          <HealthAnalyticsPage
            currentUser={currentUser}
            records={records}
          />
        )}

        {currentPage === 'community' && (
          <CommunitySupportPage
            currentUser={currentUser}
            posts={communityPosts}
            onAddPost={handleAddCommunityPost}
            onUpvotePost={handleUpvotePost}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={setCurrentPage} />
        )}

        {currentPage === 'services' && (
          <ServicesPage onNavigate={setCurrentPage} />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            latestRecord={records[0] || null}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentPage} />

      {/* Auth & Demo Account Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentPage('dashboard');
        }}
      />

      {/* Floating n8n Webhook Chatbot Widget */}
      <N8nChatWidget currentUser={currentUser} />
    </div>
  );
}
