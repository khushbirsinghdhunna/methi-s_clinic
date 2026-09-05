import { useState } from 'react';

interface HeaderProps {
  onBookClick: () => void;
  onNavigate: (section: string) => void;
  onOpenConsultant: () => void;
}

export default function AeternaHeader({ onBookClick, onNavigate, onOpenConsultant }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header id="main-header" className="fixed top-0 w-full z-50 bg-[#F8F6F2]/90 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center px-6 py-2.5 md:py-3 max-w-7xl mx-auto w-full">
          <button 
            id="menu-toggle-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#0B1426] hover:text-[#C9A96E] transition-colors duration-300 active:scale-95 flex items-center justify-center p-1.5"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <div className="font-serif text-lg md:text-xl tracking-[0.25em] text-[#0B1426] font-medium text-center cursor-pointer select-none" onClick={() => handleNavClick('home')}>
            DR METHI CLINIC
          </div>

          <button 
            id="header-book-btn"
            onClick={onBookClick}
            className="font-display text-[12px] uppercase tracking-widest text-[#0B1426] hover:text-[#C9A96E] transition-colors duration-300 font-semibold cursor-pointer active:scale-95"
          >
            Book Now
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-[100%] left-0 w-full bg-[#F8F6F2] border-b border-[#D6D2CC] shadow-lg py-8 px-6 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8 md:justify-center text-center animate-fadeIn">
            <button id="nav-link-about" onClick={() => handleNavClick('about')} className="font-display text-[15px] uppercase tracking-widest text-[#0B1426] hover:text-[#C9A96E] transition-colors font-semibold">About Dr. Vanita Methi</button>
            <button id="nav-link-credentials" onClick={() => handleNavClick('credentials')} className="font-display text-[15px] uppercase tracking-widest text-[#0B1426] hover:text-[#C9A96E] transition-colors font-semibold">Board Certifications</button>
            <button id="nav-link-milestones" onClick={() => handleNavClick('milestones')} className="font-display text-[15px] uppercase tracking-widest text-[#0B1426] hover:text-[#C9A96E] transition-colors font-semibold">Career Milestones</button>
            <button id="nav-link-results" onClick={() => handleNavClick('results')} className="font-display text-[15px] uppercase tracking-widest text-[#0B1426] hover:text-[#C9A96E] transition-colors font-semibold">Surgical Results</button>
            <button id="nav-link-testimonials" onClick={() => handleNavClick('testimonials')} className="font-display text-[15px] uppercase tracking-widest text-[#0B1426] hover:text-[#C9A96E] transition-colors font-semibold">Patient Journeys</button>
            <button id="nav-link-clinic" onClick={() => handleNavClick('clinic')} className="font-display text-[15px] uppercase tracking-widest text-[#0B1426] hover:text-[#C9A96E] transition-colors font-semibold">The Suite</button>
            <a href="#/appointment" onClick={() => setIsMenuOpen(false)} className="font-display text-[15px] uppercase tracking-widest text-[#C9A96E] hover:text-[#0B1426] transition-colors font-bold flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              Book Appointment
            </a>
            <button id="nav-link-ai-consultant" onClick={() => { onOpenConsultant(); setIsMenuOpen(false); }} className="font-display text-[15px] uppercase tracking-widest text-[#C9A96E] hover:text-[#0B1426] transition-colors font-bold flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              AI Advisor
            </button>
          </div>
        )}
      </header>
    </>
  );
}
