// =============================================================================
// WhatsApp Service — Generates WhatsApp deep links for appointment requests
// =============================================================================
// This service generates wa.me links. No bots, no APIs — just simple deep links
// that open WhatsApp on the patient's device with a pre-filled message.
// =============================================================================

import { WHATSAPP_NUMBER, CLINIC_BRAND } from '../config';
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
 * Generates a pre-filled WhatsApp message for a FULL booking (Path B).
 * Includes patient name, phone, date, time, and reference number.
 */
export function generateAppointmentMessage(
  appointment: Pick<WhatsAppAppointment, 'date' | 'time' | 'id' | 'patientName' | 'patientPhone'>
): string {
  const dateDisplay = formatDateDisplay(appointment.date);
  return [
    `Hello ${CLINIC_BRAND}!`,
    ``,
    `My name is ${appointment.patientName} (Ph: ${appointment.patientPhone}).`,
    `I would like to book an appointment.`,
    ``,
    `📅 Date: ${dateDisplay}`,
    `🕐 Time: ${appointment.time}`,
    `📋 Ref: ${appointment.id}`,
    ``,
    `Please confirm my appointment. Thank you!`,
  ].join('\n');
}

/**
 * Generates a WhatsApp deep link (wa.me URL) with a pre-filled appointment message (Path B).
 */
export function generateWhatsAppLink(
  appointment: Pick<WhatsAppAppointment, 'date' | 'time' | 'id' | 'patientName' | 'patientPhone'>
): string {
  const message = generateAppointmentMessage(appointment);
  const encodedMessage = encodeURIComponent(message);
  const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Generates a simple "I want to book" WhatsApp link (Path A — Quick Book).
 * No form needed — patient just clicks and chats directly with the receptionist.
 */
export function generateQuickBookLink(): string {
  const message = `Hello ${CLINIC_BRAND}, I would like to book an appointment.`;
  const encodedMessage = encodeURIComponent(message);
  const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Generates a WhatsApp link for the receptionist to chat with a patient (Admin → Patient).
 * Used on the Admin Dashboard's "Chat on WhatsApp" button.
 */
export function generateAdminChatLink(
  patientPhone: string,
  appointment: Pick<WhatsAppAppointment, 'date' | 'time' | 'patientName'>
): string {
  const dateDisplay = formatDateDisplay(appointment.date);
  const message = [
    `Hello ${appointment.patientName},`,
    ``,
    `This is from ${CLINIC_BRAND}.`,
    `Your appointment on ${dateDisplay} at ${appointment.time} is confirmed.`,
    ``,
    `Thank you!`,
  ].join('\n');
  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = patientPhone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
