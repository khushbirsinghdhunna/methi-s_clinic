// =============================================================================
// WhatsApp Service — Generates WhatsApp deep links for appointment requests
// =============================================================================
// IMPORTANT: This service only generates wa.me links. It does NOT send messages
// automatically. Actual WhatsApp Business API integration can be added later
// without rewriting the appointment UI.
// =============================================================================

import { WHATSAPP_NUMBER, DOCTOR_NAME, CLINIC_BRAND } from '../config';
import { WhatsAppAppointment } from '../types';

/**
 * Formats a date string (ISO) into a human-readable format.
 * e.g. "2026-09-03" → "Wednesday, 3 September"
 */
function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/**
 * Generates a pre-filled WhatsApp message for an appointment request.
 */
export function generateAppointmentMessage(appointment: Pick<WhatsAppAppointment, 'date' | 'time' | 'id'>): string {
  const dateDisplay = formatDateDisplay(appointment.date);
  return [
    `Hello ${CLINIC_BRAND},`,
    ``,
    `I would like to request an appointment.`,
    ``,
    `Date: ${dateDisplay}`,
    `Time: ${appointment.time}`,
    `Ref: ${appointment.id}`,
    ``,
    `Please let me know how I can confirm the appointment.`,
  ].join('\n');
}

/**
 * Generates a WhatsApp deep link (wa.me URL) with a pre-filled appointment message.
 * Opens WhatsApp on the user's device with the message ready to send.
 */
export function generateWhatsAppLink(appointment: Pick<WhatsAppAppointment, 'date' | 'time' | 'id'>): string {
  const message = generateAppointmentMessage(appointment);
  const encodedMessage = encodeURIComponent(message);
  // Remove any non-digit characters from the phone number for wa.me format
  const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}
