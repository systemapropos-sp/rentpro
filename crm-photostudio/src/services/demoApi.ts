import { DEMO_USER, DEMO_USERS, DEMO_LEADS, DEMO_JOBS, DEMO_CONTACTS, DEMO_EVENTS, DEMO_DOCUMENTS, DEMO_TEMPLATES, DEMO_ACTIVITIES, DEMO_STATS } from './demoData';
import type { Lead, Job, Contact, CalendarEvent, Document, QuestionnaireTemplate, ActivityLog, DashboardStats } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const demoApi = {
  // Auth
  async login(email: string, password: string): Promise<{ user: typeof DEMO_USER | null; error: string | null }> {
    await delay(400);
    if (password === 'demo123') {
      if (email.toLowerCase().includes('studio') || email.toLowerCase().includes('admin')) {
        return { user: DEMO_USER, error: null };
      }
      return { user: DEMO_USERS[1], error: null };
    }
    return { user: null, error: 'Invalid credentials. Use any email + demo123' };
  },

  // Dashboard
  async getStats(): Promise<DashboardStats> {
    await delay(200);
    return DEMO_STATS;
  },

  // Leads
  async getLeads(): Promise<Lead[]> {
    await delay(300);
    return DEMO_LEADS.map(l => ({ ...l, assigned_user: DEMO_USERS.find(u => u.id === l.assigned_to) }));
  },

  async updateLeadStatus(id: string, status: Lead['status']): Promise<Lead> {
    await delay(200);
    const lead = DEMO_LEADS.find(l => l.id === id);
    if (lead) lead.status = status;
    return lead || DEMO_LEADS[0];
  },

  async createLead(lead: Partial<Lead>): Promise<Lead> {
    await delay(300);
    return { ...DEMO_LEADS[0], ...lead, id: 'lead-' + Date.now() } as Lead;
  },

  // Jobs
  async getJobs(): Promise<Job[]> {
    await delay(300);
    return DEMO_JOBS.map(j => ({ ...j, assigned_user: DEMO_USERS.find(u => u.id === j.assigned_to) }));
  },

  // Contacts
  async getContacts(): Promise<Contact[]> {
    await delay(200);
    return DEMO_CONTACTS;
  },

  // Calendar
  async getEvents(): Promise<CalendarEvent[]> {
    await delay(200);
    return DEMO_EVENTS;
  },

  // Documents
  async getDocuments(): Promise<Document[]> {
    await delay(200);
    return DEMO_DOCUMENTS;
  },

  // Templates
  async getTemplates(): Promise<QuestionnaireTemplate[]> {
    await delay(200);
    return DEMO_TEMPLATES;
  },

  // Activities
  async getActivities(): Promise<ActivityLog[]> {
    await delay(200);
    return DEMO_ACTIVITIES;
  },
};
