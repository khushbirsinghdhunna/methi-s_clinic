// =============================================================================
// Appointment Service — Frontend API client for the appointment system
// =============================================================================
// This service communicates with the Express server endpoints.
// The data layer is currently in-memory on the server (mock/temporary).
// To connect a real database, only the server endpoints need to change —
// this client code remains the same.
// =============================================================================

import { WhatsAppAppointment, Availability, BlockedDate, AppointmentStatus } from '../types';

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export async function loginAdmin(password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error('Invalid password');
  const data = await res.json();
  localStorage.setItem('adminToken', data.token);
  return data.token;
}

export function logoutAdmin() {
  localStorage.removeItem('adminToken');
}

export function hasAdminToken(): boolean {
  return !!localStorage.getItem('adminToken');
}

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------

/** Create a new pending appointment (patient selects date + time). */
export async function createAppointment(date: string, time: string): Promise<WhatsAppAppointment> {
  const res = await fetch(`${API_BASE}/wa-appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, time }),
  });
  if (!res.ok) throw new Error('Failed to create appointment');
  return res.json();
}

/** Get a single appointment by ID (for patient status page). */
export async function getAppointment(id: string): Promise<WhatsAppAppointment> {
  const res = await fetch(`${API_BASE}/wa-appointments/${id}`);
  if (!res.ok) throw new Error('Appointment not found');
  return res.json();
}

/** Get all appointments (admin). */
export async function getAllAppointments(): Promise<WhatsAppAppointment[]> {
  const res = await fetch(`${API_BASE}/wa-appointments`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return res.json();
}

/** Update an appointment's status and optionally patient info (admin). */
export async function updateAppointment(
  id: string,
  updates: {
    status?: AppointmentStatus;
    patientName?: string;
    patientPhone?: string;
    date?: string;
    time?: string;
    notes?: string;
  }
): Promise<WhatsAppAppointment> {
  const res = await fetch(`${API_BASE}/wa-appointments/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update appointment');
  return res.json();
}

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

/** Get the weekly availability configuration. */
export async function getAvailabilityConfig(): Promise<Availability[]> {
  const res = await fetch(`${API_BASE}/availability`);
  if (!res.ok) throw new Error('Failed to fetch availability');
  return res.json();
}

/** Update the weekly availability configuration (admin). */
export async function updateAvailabilityConfig(config: Availability[]): Promise<Availability[]> {
  const res = await fetch(`${API_BASE}/availability`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ availability: config }),
  });
  if (!res.ok) throw new Error('Failed to update availability');
  return res.json();
}

/** Get available time slots for a specific date (accounts for booked slots and blocked dates). */
export async function getAvailableSlots(date: string): Promise<{ time: string; available: boolean }[]> {
  const res = await fetch(`${API_BASE}/availability/${date}/slots`);
  if (!res.ok) throw new Error('Failed to fetch slots');
  return res.json();
}

// ---------------------------------------------------------------------------
// Blocked Dates
// ---------------------------------------------------------------------------

/** Get all blocked dates. */
export async function getBlockedDates(): Promise<BlockedDate[]> {
  const res = await fetch(`${API_BASE}/blocked-dates`);
  if (!res.ok) throw new Error('Failed to fetch blocked dates');
  return res.json();
}

/** Block a specific date (admin). */
export async function blockDate(date: string, reason?: string): Promise<BlockedDate> {
  const res = await fetch(`${API_BASE}/blocked-dates`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ date, reason }),
  });
  if (!res.ok) throw new Error('Failed to block date');
  return res.json();
}

/** Unblock a specific date (admin). */
export async function unblockDate(date: string): Promise<void> {
  const res = await fetch(`${API_BASE}/blocked-dates/${date}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to unblock date');
}
