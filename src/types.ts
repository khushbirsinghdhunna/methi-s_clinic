export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  concern: string;
  date: string;
  time: string;
  notes?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  text: string;
  treatment: string;
  date: string;
  isCustom?: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// =============================================================================
// WhatsApp Appointment System Types
// =============================================================================

export type AppointmentStatus = 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';

export interface WhatsAppAppointment {
  id: string;
  doctor: string;
  patientName: string;
  patientPhone: string;
  date: string;           // ISO date string e.g. "2026-09-03"
  time: string;           // Display time e.g. "5:30 PM"
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  source: 'whatsapp';
  notes: string;
}

export interface Availability {
  day: string;            // "monday" | "tuesday" | ... | "sunday"
  startTime: string;      // 24h format e.g. "10:00"
  endTime: string;        // 24h format e.g. "13:00"
  active: boolean;
}

export interface BlockedDate {
  date: string;           // ISO date e.g. "2026-09-05"
  reason?: string;
}
