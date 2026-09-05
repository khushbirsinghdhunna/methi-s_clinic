import { useState, useEffect } from 'react';
import { getAvailableSlots, createAppointment } from '../services/appointmentService';
import { generateWhatsAppLink } from '../services/whatsappService';
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
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

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

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    setSubmitting(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const appointment = await createAppointment(dateString, selectedTime);
      const link = generateWhatsAppLink(appointment);
      window.open(link, '_blank');
      window.location.hash = '#/appointment/' + appointment.id;
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const amSlots = slots.filter(s => s.time.includes('AM'));
  const pmSlots = slots.filter(s => s.time.includes('PM'));

  return (
    <div className="min-h-screen bg-[#F8F6F2] font-sans pb-28 md:pb-16 flex flex-col items-center">
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
        <p className="text-sm text-[#4A5568] mb-8">Choose a convenient date and time for your consultation.</p>

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
        <div className="mb-10">
          <div className="font-display text-[10px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold mb-4">
            Available Times
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <span className="material-symbols-outlined animate-spin text-[#C9A96E] text-3xl">progress_activity</span>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-8 text-[#4A5568] bg-white rounded-[20px] border border-[#D6D2CC]">
              No available times for this date
            </div>
          ) : (
            <div className="space-y-6">
              {amSlots.length > 0 && (
                <div>
                  <h3 className="text-xs text-[#4A5568] mb-3">Morning</h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {amSlots.map((slot, i) => {
                      const isSelected = selectedTime === slot.time;
                      if (!slot.available) {
                        return (
                          <button key={`am-${i}`} disabled className="py-3 rounded-[12px] bg-[#ffdad6]/30 text-[#93000a]/50 line-through cursor-not-allowed border border-transparent text-sm">
                            {slot.time}
                          </button>
                        );
                      }
                      return (
                        <button
                          key={`am-${i}`}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-3 rounded-[12px] text-sm transition-colors border ${
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
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {pmSlots.map((slot, i) => {
                      const isSelected = selectedTime === slot.time;
                      if (!slot.available) {
                        return (
                          <button key={`pm-${i}`} disabled className="py-3 rounded-[12px] bg-[#ffdad6]/30 text-[#93000a]/50 line-through cursor-not-allowed border border-transparent text-sm">
                            {slot.time}
                          </button>
                        );
                      }
                      return (
                        <button
                          key={`pm-${i}`}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-3 rounded-[12px] text-sm transition-colors border ${
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

        {/* Selection Summary */}
        {selectedDate && selectedTime && (
          <div className="bg-white rounded-[20px] p-4 border border-[#C9A96E] mb-8">
            <p className="text-xs text-[#4A5568]">Selected:</p>
            <p className="font-medium text-[#0B1426] mt-1">
              {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} • {selectedTime}
            </p>
          </div>
        )}
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#F8F6F2] via-[#F8F6F2] to-transparent pointer-events-none flex justify-center z-10">
        <div className="w-full max-w-2xl pointer-events-auto">
          <button
            disabled={!selectedDate || !selectedTime || submitting}
            onClick={handleBooking}
            className={`w-full py-4 rounded-full flex items-center justify-center gap-2 font-display text-xs uppercase tracking-widest font-semibold transition-colors ${
              !selectedDate || !selectedTime || submitting
                ? 'bg-[#0B1426]/30 text-white cursor-not-allowed'
                : 'bg-[#0B1426] text-white hover:bg-[#0B1426]/90'
            }`}
          >
            {submitting ? (
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-lg">chat</span>
            )}
            Continue on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

