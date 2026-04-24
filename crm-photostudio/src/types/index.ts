export type LeadStatus = 'new' | 'qualified' | 'proposal_sent' | 'contract_signed' | 'active_job';
export type JobStatus = 'pending' | 'in_progress' | 'editing' | 'review' | 'delivered' | 'archived';
export type ShootType = 'wedding' | 'portrait' | 'family' | 'senior' | 'engagement' | 'maternity' | 'event' | 'commercial' | 'other';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ContactType = 'client' | 'vendor' | 'referral' | 'prospect';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'photographer' | 'editor';
  studio_name: string;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  shoot_type: ShootType;
  status: LeadStatus;
  priority: Priority;
  event_date?: string;
  budget?: number;
  notes?: string;
  source?: string;
  assigned_to: string;
  assigned_user?: User;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface Job {
  id: string;
  lead_id: string;
  client_name: string;
  shoot_type: ShootType;
  status: JobStatus;
  event_date: string;
  delivery_date?: string;
  location?: string;
  package_name?: string;
  price: number;
  deposit: number;
  balance: number;
  notes?: string;
  assigned_to: string;
  assigned_user?: User;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface Contact {
  id: string;
  type: ContactType;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'shoot' | 'meeting' | 'delivery' | 'personal';
  client_name?: string;
  location?: string;
  duration_minutes: number;
  notes?: string;
  color?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'invoice' | 'gallery' | 'questionnaire' | 'other';
  client_name: string;
  size: string;
  url?: string;
  created_at: string;
}

export interface QuestionnaireTemplate {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
  shoot_type?: ShootType;
  created_at: string;
}

export interface Question {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'date' | 'number' | 'yesno';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: 'lead' | 'job' | 'contact' | 'document';
  entity_name: string;
  user_name: string;
  created_at: string;
}

export interface DashboardStats {
  new_leads: number;
  active_jobs: number;
  pending_invoices: number;
  monthly_revenue: number;
  leads_change: number;
  jobs_change: number;
  invoices_change: number;
  revenue_change: number;
}
