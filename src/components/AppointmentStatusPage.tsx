import { useState, useEffect } from 'react';
import { getAppointment } from '../services/appointmentService';
import { WhatsAppAppointment, AppointmentStatus } from '../types';

interface AppointmentStatusPageProps {
  appointmentId: string;
}

interface StatusConfig {
  label: string;
  badgeClass: string;
  message: string;
}

const STATUS_CONFIGS: Record<AppointmentStatus, StatusConfig> = {
  pending: {
    label: 'Pending Confirmation',
    badgeClass: 'bg-[#C9A96E]/20 text-[#C9A96E] border border-[#C9A96E]/30',
    message: 'Your appointment request has been received. The clinic will confirm your appointment shortly.',
  },
  confirmed: {
    label: 'Confirmed',
    badgeClass: 'bg-green-100 text-green-800 border border-green-200',
    message: 'Your appointment has been confirmed. Please arrive 10 minutes early.',
  },
  rescheduled: {
    label: 'Rescheduled',
    badgeClass: 'bg-blue-100 text-blue-800 border border-blue-200',
    message: 'Your appointment has been rescheduled. Please check the updated details above.',
  },
  cancelled: {
    label: 'Cancelled',
    badgeClass: 'bg-[#ffdad6] text-[#93000a] border border-[#ffdad6]',
    message: 'This appointment has been cancelled. Please book a new appointment if needed.',
  },
  completed: {
    label: 'Completed',
    badgeClass: 'bg-[#F0EDE8] text-[#4A5568] border border-[#D6D2CC]',
    message: 'This appointment has been completed. Thank you for visiting.',
  },
};

/**
 * Formats date into "Weekday, Day Month" format (e.g. "Tuesday, 3 September")
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        });
      }
    }
    const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export default function AppointmentStatusPage({ appointmentId }: AppointmentStatusPageProps) {
  const [appointment, setAppointment] = useState<WhatsAppAppointment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAppointmentData = async (initialLoad = false) => {
      if (initialLoad) {
        setIsLoading(true);
      }
      try {
        const data = await getAppointment(appointmentId);
        if (isMounted) {
          setAppointment(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Appointment not found');
        }
      } finally {
        if (isMounted && initialLoad) {
          setIsLoading(false);
        }
      }
    };

    // Initial fetch
    fetchAppointmentData(true);

    // Refresh every 5 seconds
    const interval = setInterval(() => {
      fetchAppointmentData(false);
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [appointmentId]);

  const currentStatus = appointment?.status || 'pending';
  const statusConfig = STATUS_CONFIGS[currentStatus] || STATUS_CONFIGS.pending;
  const doctorName = appointment?.doctor || 'Dr. Vanita Methi';

  return (
    <div className="bg-[#F8F6F2] text-[#0B1426] min-h-screen antialiased flex flex-col">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F8F6F2]/90 backdrop-blur-md border-b border-[#D6D2CC]/60">
        <div className="max-w-md mx-auto px-6 h-14 flex items-center justify-between relative">
          <a
            href="#/"
            className="text-[#0B1426] hover:text-[#C9A96E] transition-colors p-1.5 -ml-1.5 rounded-full flex items-center justify-center active:scale-95"
            aria-label="Back to home"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </a>
          <span className="font-serif text-lg md:text-xl tracking-[0.25em] text-[#0B1426] font-medium absolute left-1/2 -translate-x-1/2 whitespace-nowrap select-none">
            DR METHI CLINIC
          </span>
          <div className="w-8" aria-hidden="true" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md mx-auto w-full px-6 pt-20 pb-28 md:pb-16 flex flex-col items-center">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#C9A96E]/30 border-t-[#C9A96E] rounded-full animate-spin mb-4" />
            <p className="font-sans text-sm text-[#4A5568]">Loading appointment status...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && !appointment && (
          <div className="w-full mt-8 bg-white rounded-[24px] border border-[#ffdad6] p-8 text-center shadow-sm">
            <div className="w-14 h-14 bg-[#ffdad6]/60 text-[#93000a] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[28px]">event_busy</span>
            </div>
            <h2 className="font-serif text-2xl text-[#0B1426] mb-2 font-medium">Appointment Not Found</h2>
            <p className="font-sans text-sm text-[#4A5568] mb-6 leading-relaxed">
              We were unable to locate an appointment with reference <span className="font-semibold text-[#0B1426]">"{appointmentId}"</span>.
            </p>
            <a
              href="#/"
              className="inline-block w-full py-3.5 bg-[#0B1426] text-white rounded-full font-display text-xs uppercase tracking-widest font-semibold hover:bg-[#C9A96E] transition-colors text-center active:scale-95 shadow-md"
            >
              Return to Home
            </a>
          </div>
        )}

        {/* Appointment Status Content */}
        {!isLoading && appointment && (
          <div className="w-full flex flex-col items-center">
            {/* Heading & Doctor Info */}
            <div className="text-center mt-2 mb-6">
              <h1 className="font-serif text-2xl text-[#0B1426] font-medium">
                Appointment Status
              </h1>
              <p className="font-sans text-sm text-[#4A5568] mt-1">
                {doctorName}
              </p>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-[24px] border border-[#D6D2CC] p-6 shadow-sm w-full">
              {/* Date and Time Section */}
              <div className="text-center pb-5 border-b border-[#D6D2CC]/50">
                <div className="font-serif text-lg text-[#0B1426] font-semibold">
                  {formatDate(appointment.date)}
                </div>
                <div className="font-sans text-sm text-[#4A5568] mt-1 flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#C9A96E]">schedule</span>
                  <span>{appointment.time}</span>
                </div>
              </div>

              {/* Status Badge & Context Message */}
              <div className="pt-5 flex flex-col items-center text-center">
                <span
                  className={`inline-flex items-center px-4 py-1.5 rounded-full font-display text-xs uppercase tracking-wider font-semibold ${statusConfig.badgeClass}`}
                >
                  {statusConfig.label}
                </span>

                <p className="font-sans text-xs text-[#4A5568] mt-4 leading-relaxed max-w-xs">
                  {statusConfig.message}
                </p>
              </div>

              {/* Patient Details (if available) */}
              {appointment.patientName && (
                <div className="mt-5 pt-4 border-t border-[#D6D2CC]/40 flex justify-between items-center text-xs font-sans">
                  <span className="text-[#4A5568]">Patient</span>
                  <span className="text-[#0B1426] font-medium">{appointment.patientName}</span>
                </div>
              )}

              {/* Reference ID inside the card footer */}
              <div className="mt-4 pt-3 border-t border-[#D6D2CC]/40 text-center">
                <span className="font-display text-[10px] text-[#4A5568] uppercase tracking-wider">
                  Ref: {appointment.id}
                </span>
              </div>
            </div>

            {/* Live Polling Indicator */}
            <div className="mt-6 flex items-center gap-2 text-[11px] font-sans text-[#4A5568]/70">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A96E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A96E]"></span>
              </span>
              <span>Live status updates active (every 5s)</span>
            </div>

            {/* Quick Action Button */}
            <div className="w-full mt-8">
              <a
                href="#/"
                className="w-full py-3.5 border border-[#D6D2CC] text-[#0B1426] rounded-full font-display text-xs uppercase tracking-widest font-semibold hover:bg-[#F0EDE8] transition-colors block text-center active:scale-95"
              >
                Back to Main Clinic
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
