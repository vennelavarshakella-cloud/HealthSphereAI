/**
 * HealthSphere AI - Client API Service
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

export const api = {
  // Auth
  async login(email: string, password?: string): Promise<{ token: string; user: User }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async register(data: Partial<User> & { password?: string }): Promise<{ token: string; user: User }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  // Health Guardian
  async assessHealth(data: any): Promise<{ evaluation: HealthGuardianEvaluation; record: HealthRecord }> {
    const res = await fetch('/api/health-guardian/assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Evaluation failed');
    }
    return res.json();
  },

  // Nutrition Planner
  async getNutritionPlan(data: any): Promise<NutritionPlan> {
    const res = await fetch('/api/nutrition/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Nutrition plan generation failed');
    }
    return res.json();
  },

  // Family Members
  async getFamilyMembers(userId: string): Promise<FamilyMember[]> {
    const res = await fetch(`/api/family-members?user_id=${encodeURIComponent(userId)}`);
    return res.json();
  },

  async addFamilyMember(member: Partial<FamilyMember>): Promise<FamilyMember> {
    const res = await fetch('/api/family-members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });
    return res.json();
  },

  async deleteFamilyMember(id: string): Promise<void> {
    await fetch(`/api/family-members/${id}`, { method: 'DELETE' });
  },

  // Health Records
  async getHealthRecords(userId: string): Promise<HealthRecord[]> {
    const res = await fetch(`/api/health-records?user_id=${encodeURIComponent(userId)}`);
    return res.json();
  },

  // Women's Health
  async getWomensHealth(userId: string): Promise<WomensHealthLog[]> {
    const res = await fetch(`/api/womens-health?user_id=${encodeURIComponent(userId)}`);
    return res.json();
  },

  async addWomensHealthLog(log: Partial<WomensHealthLog>): Promise<WomensHealthLog> {
    const res = await fetch('/api/womens-health', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
    return res.json();
  },

  // Mood Tracker
  async getMoodLogs(userId: string): Promise<MoodTrackerLog[]> {
    const res = await fetch(`/api/mood-tracker?user_id=${encodeURIComponent(userId)}`);
    return res.json();
  },

  async addMoodLog(log: Partial<MoodTrackerLog>): Promise<MoodTrackerLog> {
    const res = await fetch('/api/mood-tracker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
    return res.json();
  },

  // Medicine Reminders
  async getMedicineReminders(userId: string): Promise<MedicineReminder[]> {
    const res = await fetch(`/api/medicine-reminders?user_id=${encodeURIComponent(userId)}`);
    return res.json();
  },

  async addMedicineReminder(reminder: Partial<MedicineReminder>): Promise<MedicineReminder> {
    const res = await fetch('/api/medicine-reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reminder),
    });
    return res.json();
  },

  async toggleMedicineReminder(id: string): Promise<MedicineReminder> {
    const res = await fetch(`/api/medicine-reminders/${id}/toggle`, {
      method: 'PATCH',
    });
    return res.json();
  },

  // Emergency Contacts
  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    const res = await fetch(`/api/emergency-contacts?user_id=${encodeURIComponent(userId)}`);
    return res.json();
  },

  async addEmergencyContact(contact: Partial<EmergencyContact>): Promise<EmergencyContact> {
    const res = await fetch('/api/emergency-contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    return res.json();
  },

  // Community
  async getCommunityPosts(): Promise<CommunityPost[]> {
    const res = await fetch('/api/community/posts');
    return res.json();
  },

  async addCommunityPost(post: Partial<CommunityPost>): Promise<CommunityPost> {
    const res = await fetch('/api/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    return res.json();
  },

  async upvoteCommunityPost(id: string): Promise<CommunityPost> {
    const res = await fetch(`/api/community/posts/${id}/upvote`, { method: 'POST' });
    return res.json();
  },

  // Appointments & Notifications
  async getAppointments(userId: string): Promise<Appointment[]> {
    const res = await fetch(`/api/appointments?user_id=${encodeURIComponent(userId)}`);
    return res.json();
  },

  async getNotifications(userId: string): Promise<NotificationItem[]> {
    const res = await fetch(`/api/notifications?user_id=${encodeURIComponent(userId)}`);
    return res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
  },

  // Admin & DB Inspector
  async getAdminMetrics(): Promise<any> {
    const res = await fetch('/api/admin/metrics');
    return res.json();
  },

  async getDatabaseSchema(): Promise<any> {
    const res = await fetch('/api/admin/database-schema');
    return res.json();
  },
};
