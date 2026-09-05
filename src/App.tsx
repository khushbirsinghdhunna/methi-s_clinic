import { useState } from 'react';
import AeternaHeader from './components/AeternaHeader';
import AeternaHero from './components/AeternaHero';
import AeternaCredentials from './components/AeternaCredentials';
import AeternaBeforeAfter from './components/AeternaBeforeAfter';
import AeternaTestimonials from './components/AeternaTestimonials';
import AeternaClinicExperience from './components/AeternaClinicExperience';
import AeternaAboutDoctor from './components/AeternaAboutDoctor';
import AeternaFooter from './components/AeternaFooter';
import AeternaBookingModal from './components/AeternaBookingModal';
import AeternaVirtualConsultant from './components/AeternaVirtualConsultant';
import AeternaBottomNav from './components/AeternaBottomNav';
import { Appointment } from './types';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isConsultantOpen, setIsConsultantOpen] = useState(false);
  const [activeBookings, setActiveBookings] = useState<Appointment[]>([]);

  // Smooth scroll helper for navigational anchors
  const handleNavigate = (section: string) => {
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    let targetId = '';
    switch (section) {
      case 'about':
        targetId = 'hero-section';
        break;
      case 'credentials':
        targetId = 'credentials-section';
        break;
      case 'milestones':
        targetId = 'timeline-section';
        break;
      case 'results':
        targetId = 'results-section';
        break;
      case 'testimonials':
        targetId = 'testimonials-section';
        break;
      case 'clinic':
        targetId = 'clinic-section';
        break;
      default:
        return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      const offset = 60;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleBookingSuccess = (booking: Appointment) => {
    setActiveBookings(prev => [booking, ...prev]);
  };

  const handleCancelBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: 'POST' });
      if (res.ok) {
        setActiveBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#F8F6F2] text-[#0B1426] min-h-screen relative overflow-x-clip antialiased">
      <AeternaHeader 
        onBookClick={() => setIsBookingOpen(true)} 
        onNavigate={handleNavigate}
        onOpenConsultant={() => setIsConsultantOpen(true)}
      />

      <main className="relative">
        <AeternaHero onBookClick={() => setIsBookingOpen(true)} />

        {activeBookings.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 mb-8 animate-fadeIn">
            <div className="bg-[#C9A96E]/10 border border-[#C9A96E]/40 rounded-[24px] p-6">
              <h3 className="font-display text-xs uppercase tracking-[0.2em] text-[#C9A96E] font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">bookmark_added</span>
                Active Clinical Reservations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeBookings.map((b) => (
                  <div key={b.id} className="bg-white border border-[#D6D2CC] rounded-[18px] p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-serif text-sm font-semibold">{b.concern}</span>
                        <span className={`text-[9px] font-display uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'confirmed' ? 'bg-[#C9A96E]/30 text-[#0B1426]' : 'bg-[#ffdad6] text-[#93000a]'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-[#4A5568]">Scheduled: {b.date} at {b.time}</p>
                      <p className="font-sans text-[10px] text-[#4A5568]/60 mt-1">Ref ID: {b.id}</p>
                    </div>

                    {b.status === 'confirmed' && (
                      <button 
                        onClick={() => handleCancelBooking(b.id)}
                        className="mt-4 text-[10px] font-display tracking-wider uppercase text-[#93000a] text-left hover:underline cursor-pointer font-bold"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <AeternaCredentials />
        <AeternaBeforeAfter />
        <AeternaTestimonials />
        <AeternaAboutDoctor />
        <AeternaClinicExperience />
      </main>

      <AeternaFooter onNavigate={handleNavigate} />

      <AeternaBottomNav 
        onNavigate={handleNavigate} 
        onOpenConsultant={() => setIsConsultantOpen(true)}
      />

      <AeternaVirtualConsultant 
        isOpen={isConsultantOpen}
        onClose={() => setIsConsultantOpen(false)}
        onOpen={() => setIsConsultantOpen(true)}
        onBookClick={() => setIsBookingOpen(true)}
      />

      {isBookingOpen && (
        <AeternaBookingModal 
          onClose={() => setIsBookingOpen(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
