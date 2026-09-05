interface BottomNavProps {
  onNavigate: (section: string) => void;
  onOpenConsultant: () => void;
}

export default function AeternaBottomNav({ onNavigate, onOpenConsultant }: BottomNavProps) {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 w-[92%] max-w-sm flex items-center gap-2.5 z-40 md:hidden" style={{ bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
      <nav id="bottom-nav" className="flex-1 rounded-full bg-[#ffffff]/85 backdrop-blur-xl border border-[#D6D2CC]/50 shadow-xl transition-all duration-300">
        <div className="flex justify-around items-center px-2 py-1.5 mx-auto">
          <button onClick={() => onNavigate('home')} className="flex flex-col items-center justify-center text-[#0B1426] p-1 hover:text-[#C9A96E] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px] mb-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>home</span>
            <span className="font-display text-[8px] uppercase tracking-wider font-bold">Home</span>
          </button>
          <button onClick={() => onNavigate('credentials')} className="flex flex-col items-center justify-center text-[#0B1426] p-1 hover:text-[#C9A96E] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px] mb-0.5">content_cut</span>
            <span className="font-display text-[8px] uppercase tracking-wider font-bold">Procedures</span>
          </button>
          <button onClick={() => onNavigate('results')} className="flex flex-col items-center justify-center text-[#0B1426] p-1 hover:text-[#C9A96E] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px] mb-0.5">auto_awesome</span>
            <span className="font-display text-[8px] uppercase tracking-wider font-bold">Results</span>
          </button>
          <button onClick={() => onNavigate('clinic')} className="flex flex-col items-center justify-center text-[#0B1426] p-1 hover:text-[#C9A96E] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px] mb-0.5">location_on</span>
            <span className="font-display text-[8px] uppercase tracking-wider font-bold">Suite</span>
          </button>
        </div>
      </nav>
      <a id="mobile-call-trigger" href="tel:2125550100" className="w-11 h-11 shrink-0 rounded-full bg-[#0B1426] hover:bg-[#C9A96E] text-[#ffffff] flex items-center justify-center shadow-xl border border-[#C9A96E]/30 active:scale-95 transition-all duration-300 cursor-pointer" aria-label="Call Office">
        <span className="material-symbols-outlined text-[18px]">call</span>
      </a>
    </div>
  );
}
