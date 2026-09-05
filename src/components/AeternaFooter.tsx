import { HeadingAnimator, DetailAnimator } from './AeternaBeforeAfter';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function AeternaFooter({ onNavigate }: FooterProps) {
  return (
    <footer className="relative z-10 w-full rounded-t-[32px] border-t border-[#D6D2CC] bg-[#ffffff] flex flex-col items-center px-6 pt-16 pb-28 md:pb-16 text-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="font-serif text-3xl tracking-[0.25em] text-[#0B1426] font-medium mb-10 select-none flex justify-center">
          <HeadingAnimator text="METHI" />
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 md:gap-12 font-sans text-sm text-[#4A5568] mb-12">
          <button onClick={() => onNavigate('about')} className="hover:text-[#C9A96E] transition-colors duration-200 cursor-pointer">About Dr. Vanita Methi</button>
          <button onClick={() => onNavigate('credentials')} className="hover:text-[#C9A96E] transition-colors duration-200 cursor-pointer">Board Certifications</button>
          <button onClick={() => onNavigate('results')} className="hover:text-[#C9A96E] transition-colors duration-200 cursor-pointer">Surgical Results</button>
          <button onClick={() => onNavigate('testimonials')} className="hover:text-[#C9A96E] transition-colors duration-200 cursor-pointer">Patient Journeys</button>
          <button onClick={() => onNavigate('clinic')} className="hover:text-[#C9A96E] transition-colors duration-200 cursor-pointer">Privacy Policy</button>
        </div>
        <div className="w-full h-[1px] bg-[#F0EDE8] mb-8"></div>
        <div className="flex justify-center">
          <DetailAnimator 
            text="© 2026 DR METHI ENT CARE AND SKIN TALKS. ALL RIGHTS RESERVED."
            className="font-display text-[10px] text-[#4A5568] tracking-widest font-bold block"
          />
        </div>
      </div>
    </footer>
  );
}
