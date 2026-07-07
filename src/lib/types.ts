export type UserRole = 'secretary' | 'lupon_chairman' | 'lupon_member' | 'complainant' | 'respondent';
export type CaseStatus = 'filed' | 'under_mediation' | 'settled' | 'escalated' | 'closed';
export type HearingStatus = 'scheduled' | 'completed' | 'cancelled';

export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  role: UserRole;
  contact: string | null;
  address: string | null;
  created_at: string;
}

export interface Case {
  id: number;
  case_number: string;
  title: string;
  description: string | null;
  complainant_id: number;
  complainant_name?: string;
  respondent_name: string;
  respondent_address: string | null;
  respondent_contact: string | null;
  respondent_password: string | null;
  status: CaseStatus;
  lupon_chairman_id: number | null;
  lupon_chairman_name?: string;
  filing_date: string;
  settlement_date: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface Hearing {
  id: number;
  case_id: number;
  hearing_number: number;
  scheduled_date: string;
  status: HearingStatus;
  notes: string | null;
  created_at: string;
}

export interface Attendance {
  id: number;
  hearing_id: number;
  user_id: number;
  user_name?: string;
  role: string;
  attended: boolean;
}

export interface Summon {
  id: number;
  case_id: number;
  generated_by: number;
  respondent_credentials: string | null;
  status: 'generated' | 'delivered';
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id: number | null;
  user_name?: string;
  action: string;
  details: string | null;
  created_at: string;
}

export interface CaseAssignment {
  id: number;
  case_id: number;
  lupon_member_id: number;
  member_name?: string;
  role: 'member' | 'pangkat';
  created_at: string;
}

export interface FilingReport {
  id: number;
  case_id: number;
  generated_by: number;
  report_details: string | null;
  created_at: string;
}
