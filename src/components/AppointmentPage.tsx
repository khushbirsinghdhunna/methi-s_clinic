import { useState, useEffect } from 'react';
import { getAvailableSlots, createAppointment } from '../services/appointmentService';
import { generateWhatsAppLink, generateQuickBookLink } from '../services/whatsappService';
import { DOCTOR_NAME } from '../config';

interface Slot {
  time: string;
  available: boolean;
}

export default function AppointmentPage() {
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    const next14Days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      next14Days.push(d);
    }
    setDates(next14Days);
    setSelectedDate(next14Days[0]);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    let isMounted = true;
    const fetchSlots = async () => {
      setLoading(true);
      setSelectedTime(null);
      try {
        const dateString = selectedDate.toISOString().split('T')[0];
        const data = await getAvailableSlots(dateString);
        if (isMounted) setSlots(data);
      } catch (err) {
        console.error(err);
        if (isMounted) setSlots([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSlots();
    return () => { isMounted = false; };
  }, [selectedDate]);

  const handleQuickWhatsAppChat = () => {
    const link = generateQuickBookLink();
    window.open(link, '_blank');
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;

    if (!patientName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 8) {
      setFormError('Please enter a valid WhatsApp phone number.');
      return;
    }

    setFormError('');
    setSubmitting(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const appointment = await createAppointment(
        dateString,
        selectedTime,
        patientName.trim(),
        patientPhone.trim()
      );
      const link = generateWhatsAppLink(appointment);
      window.open(link, '_blank');
      window.location.hash = '#/appointment/' + appointment.id;
    } catch (err) {
      console.error(err);
      setFormError('Failed to schedule appointment. Please try again or chat with us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const amSlots = slots.filter(s => s.time.includes('AM'));
  const pmSlots = slots.filter(s => s.time.includes('PM'));

  return (
    <div className="min-h-screen bg-[#F8F6F2] font-sans pb-32 md:pb-24 flex flex-col items-center">
      <header className="w-full flex items-center justify-between p-4 border-b border-[#D6D2CC] bg-[#F8F6F2] sticky top-0 z-10 max-w-2xl">
        <button
          onClick={() => window.location.hash = '#/'}
          className="p-2 -ml-2 rounded-full hover:bg-black/5 flex items-center justify-center text-[#0B1426]"
          aria-label="Back"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="font-display text-[11px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold text-center absolute left-1/2 -translate-x-1/2">
          DR METHI CLINIC
        </div>
        <div className="w-10"></div>
      </header>

      <main className="w-full max-w-2xl px-4 pt-6 flex-1">
        <h1 className="font-serif text-2xl sm:text-3xl text-[#0B1426] mb-2">Book an Appointment</h1>
        <p className="text-sm text-[#4A5568] mb-6">Choose how you would like to book your consultation with {DOCTOR_NAME}.</p>

        {/* Option A: Quick WhatsApp Chat */}
        <div className="bg-white rounded-[24px] border border-[#D6D2CC] p-5 mb-8 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366] shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-2xl">chat</span>
            </div>
            <div className="flex-1">
              <div className="font-display text-[11px] uppercase tracking-[0.15em] text-[#25D366] font-bold">
                Option 1 • Instant Chat
              </div>
              <h2 className="font-serif text-lg text-[#0B1426] mt-0.5">Direct WhatsApp Booking</h2>
              <p className="text-xs text-[#4A5568] mt-1 mb-4 leading-relaxed">
                Prefer to chat directly? Message our clinic reception on WhatsApp to check availability and schedule instantly.
              </p>
              <button
                type="button"
                onClick={handleQuickWhatsAppChat}
                className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full font-display text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">outgoing_mail</span>
                Message Us on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-3 items-center mb-8">
          <div className="flex-grow border-t border-[#D6D2CC]"></div>
          <span className="flex-shrink mx-4 font-display text-[10px] uppercase tracking-[0.2em] text-[#A09A92] font-semibold">
            Or Book Online Below
          </span>
          <div className="flex-grow border-t border-[#D6D2CC]"></div>
        </div>

        {/* Option B: Choose Date & Time */}
        <div className="mb-2">
          <div className="font-display text-[11px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold mb-1">
            Option 2 • Online Slot Selection
          </div>
          <p className="text-xs text-[#4A5568] mb-4">Select your preferred date, pick an open 10-minute slot, and enter your details.</p>
        </div>

        {/* Date Selector */}
        <div className="mb-8">
          <div className="font-display text-[10px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold mb-3">
            Select Date
          </div>
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {dates.map((d, i) => {
              const isSelected = selectedDate?.toDateString() === d.toDateString();
              const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
              const dateNum = d.getDate();
              const monthName = d.toLocaleDateString('en-US', { month: 'short' });

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedDate(d)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-[20px] border transition-colors ${
                    isSelected
                      ? 'bg-[#0B1426] text-white border-[#0B1426]'
                      : 'bg-white border-[#D6D2CC] text-[#0B1426] hover:bg-black/5'
                  }`}
                >
                  <span className={`text-[11px] uppercase ${isSelected ? 'text-white/80' : 'text-[#4A5568]'}`}>{dayName}</span>
                  <span className="text-xl font-medium my-0.5">{dateNum}</span>
                  <span className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-[#4A5568]'}`}>{monthName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Available Times */}
        <div className="mb-8">
          <div className="font-display text-[10px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold mb-4">
            Available Times
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <span className="material-symbols-outlined animate-spin text-[#C9A96E] text-3xl">progress_activity</span>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-8 text-[#4A5568] bg-white rounded-[20px] border border-[#D6D2CC]">
              No available times for this date. Please pick another date or chat with us directly.
            </div>
          ) : (
            <div className="space-y-6">
              {amSlots.length > 0 && (
                <div>
                  <h3 className="text-xs text-[#4A5568] mb-3">Morning</h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
                    {amSlots.map((slot, i) => {
                      const isSelected = selectedTime === slot.time;
                      if (!slot.available) {
                        return (
                          <button key={`am-${i}`} type="button" disabled className="py-2.5 rounded-[12px] bg-[#ffdad6]/30 text-[#93000a]/50 line-through cursor-not-allowed border border-transparent text-xs font-medium">
                            {slot.time}
                          </button>
                        );
                      }
                      return (
                        <button
                          key={`am-${i}`}
                          type="button"
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-2.5 rounded-[12px] text-xs font-medium transition-colors border ${
                            isSelected
                              ? 'bg-[#C9A96E] text-white border-[#C9A96E]'
                              : 'bg-white text-[#0B1426] border-[#D6D2CC] hover:bg-[#16a34a]/10 hover:border-[#16a34a]/30'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {pmSlots.length > 0 && (
                <div>
                  <h3 className="text-xs text-[#4A5568] mb-3">Afternoon / Evening</h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
                    {pmSlots.map((slot, i) => {
                      const isSelected = selectedTime === slot.time;
                      if (!slot.available) {
                        return (
                          <button key={`pm-${i}`} type="button" disabled className="py-2.5 rounded-[12px] bg-[#ffdad6]/30 text-[#93000a]/50 line-through cursor-not-allowed border border-transparent text-xs font-medium">
                            {slot.time}
                          </button>
                        );
                      }
                      return (
                        <button
                          key={`pm-${i}`}
                          type="button"
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-2.5 rounded-[12px] text-xs font-medium transition-colors border ${
                            isSelected
                              ? 'bg-[#C9A96E] text-white border-[#C9A96E]'
                              : 'bg-white text-[#0B1426] border-[#D6D2CC] hover:bg-[#16a34a]/10 hover:border-[#16a34a]/30'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Patient Details Form (appears when date and time are chosen) */}
        {selectedDate && selectedTime && (
          <div className="bg-white rounded-[24px] p-6 border border-[#C9A96E] mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#C9A96E]">event_available</span>
              <div>
                <p className="text-[11px] font-display uppercase tracking-wider text-[#A09A92] font-semibold">Selected Appointment Slot</p>
                <p className="font-serif text-lg text-[#0B1426]">
                  {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} • {selectedTime}
                </p>
              </div>
            </div>

            <div className="border-t border-[#F0EDE8] pt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#0B1426] mb-1.5">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pooja Sharma"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] border border-[#D6D2CC] focus:outline-none focus:border-[#C9A96E] text-sm bg-[#F8F6F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0B1426] mb-1.5">
                  WhatsApp Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] border border-[#D6D2CC] focus:outline-none focus:border-[#C9A96E] text-sm bg-[#F8F6F2]"
                />
                <p className="text-[11px] text-[#A09A92] mt-1">We will send your appointment confirmation to this number.</p>
              </div>

              {formError && (
                <div className="p-3 rounded-[12px] bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{formError}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#F8F6F2] via-[#F8F6F2] to-transparent pointer-events-none flex justify-center z-20">
        <div className="w-full max-w-2xl pointer-events-auto">
          <button
            type="button"
            disabled={!selectedDate || !selectedTime || !patientName.trim() || !patientPhone.trim() || submitting}
            onClick={handleBooking}
            className={`w-full py-4 rounded-full flex items-center justify-center gap-2 font-display text-xs uppercase tracking-widest font-semibold transition-all shadow-md ${
              !selectedDate || !selectedTime || !patientName.trim() || !patientPhone.trim() || submitting
                ? 'bg-[#0B1426]/30 text-white cursor-not-allowed shadow-none'
                : 'bg-[#0B1426] text-white hover:bg-[#0B1426]/90 hover:shadow-lg'
            }`}
          >
            {submitting ? (
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-lg">chat</span>
            )}
            {!selectedTime 
              ? 'Select a Time Slot Above' 
              : !patientName.trim() || !patientPhone.trim() 
              ? 'Enter Name & Phone to Continue' 
              : 'Confirm & Continue on WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  );
}

