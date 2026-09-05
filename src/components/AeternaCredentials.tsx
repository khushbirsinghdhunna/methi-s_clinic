import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeadingAnimator, ContentAnimator, DetailAnimator } from './AeternaBeforeAfter';
import damagedImg from '../../photos/cell/damage.webp';
import healedImg from '../../photos/cell/heal.webp';

import t01 from '../../photos/treatementoffered/01.avif';
import t02 from '../../photos/treatementoffered/02.jpg';
import t03 from '../../photos/treatementoffered/03.jpg';
import t04 from '../../photos/treatementoffered/04.webp';
import t05 from '../../photos/treatementoffered/05.jpg';
import t06 from '../../photos/treatementoffered/06.jpeg';
const treatmentPhotos = [t01, t02, t03, t04, t05, t06];

import ce01 from '../../photos/clinicexcellence/01.png';
import ce02 from '../../photos/clinicexcellence/02.png';
import ce03 from '../../photos/clinicexcellence/03.png';
import ce04 from '../../photos/clinicexcellence/04.png';
import ceMbbs from '../../photos/clinicexcellence/left.png';
import ceDnb from '../../photos/clinicexcellence/right.png';
const clinicExcellencePhotos = [ce01, ce02, ce03, ce04];


const stats = [
  { value: "MBBS, DNB, FIAD", label: "Skin Specialist", desc: "Complex medical & cosmetic dermatology" },
  { value: "15,000+", label: "Advanced Skincare", desc: "Lasers, injectables & skin rejuvenation" },
  { value: "18", label: "Years of Expertise", desc: "Precision crafted through clinical mastery" },
  { value: "4.9", label: "Patient Review", desc: "Based on 3,400+ verified patient reviews" }
];

const treatments = [
  {
    num: "01",
    title: "Acne Treatment & Scarring",
    desc: "Advanced hormonal acne therapy, deep cystic acne treatment, subcision, TCA cross, and laser scar resurfacing"
  },
  {
    num: "02",
    title: "Laser Skin Resurfacing",
    desc: "Fraxel dual laser, CO2 fractional resurfacing, IPL photofacial, PicoSure for pigmentation, and non-ablative rejuvenation"
  },
  {
    num: "03",
    title: "Botox & Dermal Fillers",
    desc: "Neuromodulators, Juvederm, Restylane, Sculptra collagen stimulation, under-eye rejuvenation, and liquid facelifts"
  },
  {
    num: "04",
    title: "Advanced Chemical Peels",
    desc: "TCA peels, Vi Peel, Cosmelan depigmentation, Jessner's peel, and customized exfoliation for glowing skin"
  },
  {
    num: "05",
    title: "Microneedling & PRP",
    desc: "Collagen induction therapy, radiofrequency microneedling (Morpheus8), and platelet-rich plasma for hair and skin"
  },
  {
    num: "06",
    title: "Skin Cancer Screening",
    desc: "Comprehensive full-body mole checks, dermoscopy, biopsy, and precision excision with minimal scarring"
  }
];

export default function AeternaCredentials() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress through the total height of this sticky trigger container
      const totalScrollHeight = rect.height - viewportHeight;
      if (totalScrollHeight <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollHeight));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Initial calculation
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Determine active phase
  // Phase 1 (Expertise & Qualifications): 0.0 to 0.35
  // Transition window: 0.35 to 0.38
  // Phase 2 (Treatments Offered): 0.38 to 0.95
  const isPastHalf = scrollProgress >= 0.37;

  // Horizontal stats carousel progress (mapped from 0.0 to 0.32)
  const horizontalProgress = Math.min(1, Math.max(0, scrollProgress / 0.32));

  // Treatments vertical tracking progress (mapped from 0.38 to 0.94, sweeping from -0.35 to 1.35 for fully faded entrance/exit)
  const timelineProgress = Math.min(1.35, Math.max(-0.35, ((scrollProgress - 0.38) / 0.56) * 1.7 - 0.35));

  // Discrete progress function ("nothing happens until 8th and snaps instantly at 9th")
  // Divided into 5 intervals for 6 cards (0, 0.2, 0.4, 0.6, 0.8, 1.0)
  const rawT = timelineProgress * 5; 
  let steppedT = 0;
  
  if (rawT < 0) {
    // Card 0 fades in as rawT goes from -0.8 to 0.0 (graceful but direct entry)
    const t = Math.min(1, Math.max(0, (rawT + 0.8) / 0.8));
    const smoothT = 3 * t * t - 2 * t * t * t;
    steppedT = -1 + smoothT;
  } else if (rawT > 5) {
    // Card 5 remains fully active and stays centered at index 5 until the overall section exits
    steppedT = 5;
  } else {
    // Between card 0 and 5: hold the index until 80% through the interval, then snap rapidly over the last 20%
    const integerPart = Math.floor(rawT);
    const fractionalPart = rawT - integerPart;
    if (fractionalPart < 0.80) {
      steppedT = integerPart;
    } else {
      const t = (fractionalPart - 0.80) / 0.20; // fast 20% transition window
      const smoothT = 3 * t * t - 2 * t * t * t;
      steppedT = integerPart + smoothT;
    }
  }

  const smoothTimelineProgress = steppedT / 5;

  // Clamped stepped timeline progress for background line and glowing dot travel
  const clampedSmoothTimelineProgress = Math.min(1, Math.max(0, smoothTimelineProgress));

  // Determine which treatment index is currently active for the photo
  const activeTreatmentIdx = Math.min(treatments.length - 1, Math.max(0, Math.round(smoothTimelineProgress * (treatments.length - 1))));

  // Smooth exit fade out at the very end of the sticky container (from 0.94 to 1.0)
  const exitOpacity = scrollProgress > 0.94 ? Math.max(0, 1 - (scrollProgress - 0.94) / 0.06) : 1;
  const phase2Opacity = isPastHalf ? exitOpacity : 0;

  return (
    <section 
      ref={containerRef}
      id="credentials-section" 
      className="relative w-full h-[760vh] bg-[#F0EDE8] rounded-[32px] overflow-visible my-8"
    >
      {/* Absolute anchors for navigation links */}
      <div id="credentials-anchor" className="absolute top-0 h-1 w-1 pointer-events-none" />
      <div id="timeline-section" className="absolute top-[52%] h-1 w-1 pointer-events-none" />

      {/* Sticky Frame viewport */}
      <div className="sticky top-[72px] h-[calc(100vh-100px)] md:h-[calc(100vh-140px)] w-full flex flex-col justify-center overflow-hidden py-4 md:py-8 px-4 md:px-12 select-none">
        
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-between relative">

          <div 
            className="absolute top-0 right-0 transform translate-x-[35%] -translate-y-[40%] sm:translate-x-[30%] sm:-translate-y-[45%] md:translate-x-[30%] md:-translate-y-[50%] lg:translate-x-[30%] lg:-translate-y-[55%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[850px] md:h-[850px] lg:w-[1050px] lg:h-[1050px] group z-0 transition-opacity duration-300 pointer-events-none"
            style={{ opacity: exitOpacity }}
          >
            <img 
              src={damagedImg} 
              alt="Pre-Treatment State"
              className="absolute inset-0 w-full h-full object-contain grayscale-[15%] contrast-[105%] group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <img 
              src={healedImg} 
              alt="Post-Treatment State"
              className="absolute inset-0 w-full h-full object-contain contrast-[105%] group-hover:scale-105 transition-transform duration-700 animate-heal"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* ==================== PHASE 1: EXPERTISE & QUALIFICATIONS ==================== */}
          <div 
            className="absolute inset-0 flex flex-col justify-between transition-all duration-500 ease-out py-1 md:py-3 z-10"
            style={{
              opacity: isPastHalf ? 0 : 1,
              transform: `translateY(${isPastHalf ? -40 : 0}px)`,
              pointerEvents: isPastHalf ? 'none' : 'auto'
            }}
          >
            <div className="flex flex-col h-full gap-2 md:gap-4 justify-start">
              
              {/* Top Row: Heading + Space reserved for Top-Right Photo Holder */}
              <div className="relative flex justify-between items-start gap-4 shrink-0 pr-[145px] md:pr-[400px] lg:pr-[520px]">
                <div className="max-w-xl">
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0B1426] leading-tight flex flex-col items-start">
                    <HeadingAnimator text="Clinical" className="text-[#C9A96E]" />
                    <HeadingAnimator text="Excellence" className="italic font-normal" />
                  </h2>
                </div>
              </div>

              {/* Middle Row: 4 Stats Cards shifted upwards and more compact */}
              <div className="relative w-full overflow-hidden py-1 shrink-0 mt-6 md:mt-10">

                <div 
                  className="flex gap-4 transition-transform duration-100 ease-out pl-[8vw] md:pl-[80px]"
                  style={{
                    transform: isMobile 
                      ? `translateX(calc(-${horizontalProgress} * (60vw + 16px) * 2.8))`
                      : `translateX(calc(-${horizontalProgress} * (260px + 16px) * 1.8))`
                  }}
                >
                  {stats.map((stat, idx) => {
                    const itemTarget = idx / (stats.length - 1);
                    const isLocalActive = Math.abs(horizontalProgress - itemTarget) < 0.25 || (idx === 0 && horizontalProgress < 0.1) || (idx === stats.length - 1 && horizontalProgress > 0.9);

                    return (
                      <div 
                        key={idx}
                        className={`w-[60vw] md:w-[260px] h-[250px] md:h-[300px] shrink-0 rounded-[16px] md:rounded-[20px] p-4 md:p-5 flex flex-col border shadow-xs transition-all duration-300 ${
                          isLocalActive 
                            ? 'bg-[#0B1426] text-[#ffffff] border-[#0B1426] scale-102 shadow-md' 
                            : 'bg-[#ffffff] text-[#0B1426] border-[#D6D2CC]/60 scale-98'
                        }`}
                      >
                        <div className="shrink-0">
                          <h3 className={`font-serif font-bold mb-1 flex items-center transition-colors ${isLocalActive ? 'text-[#C9A96E]' : 'text-[#0B1426]'}`}>
                            {idx === 0 ? (
                              <span className="text-[17px] md:text-[21px] whitespace-nowrap tracking-tight">{stat.value}</span>
                            ) : idx === 3 ? (
                              <span className="text-2xl md:text-3xl flex items-center gap-1.5">
                                {stat.value}
                                <svg className={`w-5 h-5 md:w-6 md:h-6 ${isLocalActive ? 'text-[#C9A96E]' : 'text-[#C9A96E]/80'}`} fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                              </span>
                            ) : (
                              <span className="text-2xl md:text-3xl">{stat.value}</span>
                            )}
                          </h3>
                          <p className="font-display text-[8px] md:text-[10px] uppercase tracking-widest font-bold opacity-80 mb-3">
                            {stat.label}
                          </p>
                        </div>
                        {/* Horizontal Photo Holder in remaining space */}
                        <div className="w-full flex-1 mt-1 rounded-[12px] md:rounded-[14px] overflow-hidden relative group">
                          <img 
                            src={clinicExcellencePhotos[idx]} 
                            alt={stat.label} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Row: Two Custom Cards */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 w-full h-[180px] md:h-[220px] shrink-0 mt-6 md:mt-12">
                {/* Card 1: MBBS */}
                <div className="bg-[#ffffff] rounded-[16px] md:rounded-[20px] border border-[#C9A96E]/20 shadow-xs flex flex-col overflow-hidden h-full group">
                  <div className="w-full h-[60%] overflow-hidden relative">
                    <img src={ceMbbs} alt="MBBS" className="w-full h-full object-cover grayscale-[10%] transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                  <div className="p-3 md:p-4 flex flex-col justify-center h-[40%] bg-white z-10">
                    <h4 className="font-serif text-lg md:text-xl font-bold text-[#0B1426] leading-tight">MBBS</h4>
                    <p className="font-sans text-[9px] md:text-[11px] text-[#4A5568]/90 font-light mt-0.5 truncate">Bachelor of Medicine, Bachelor of Surgery</p>
                  </div>
                </div>

                {/* Card 2: DNB & FIAD */}
                <div className="bg-[#ffffff] rounded-[16px] md:rounded-[20px] border border-[#C9A96E]/20 shadow-xs flex flex-col overflow-hidden h-full group">
                  <div className="w-full h-[60%] overflow-hidden relative">
                    <img src={ceDnb} alt="DNB & FIAD" className="w-full h-full object-cover grayscale-[10%] transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                  <div className="p-3 md:p-4 flex flex-col justify-center h-[40%] bg-white z-10">
                    <h4 className="font-serif text-lg md:text-xl font-bold text-[#0B1426] leading-tight">DNB &amp; FIAD</h4>
                    <p className="font-sans text-[9px] md:text-[11px] text-[#4A5568]/90 font-light mt-0.5 truncate">Diplomate of National Board &amp; Fellow</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div 
            className="absolute inset-0 flex flex-col justify-start items-start gap-3 md:gap-4 transition-all duration-500 ease-out py-2 md:py-6 z-10"
            style={{
              opacity: phase2Opacity,
              transform: `translateY(${isPastHalf ? 0 : 40}px)`,
              pointerEvents: isPastHalf ? 'auto' : 'none'
            }}
          >
            {/* Top-Left Heading */}
            <div className="w-full shrink-0 pr-[145px] md:pr-[400px] lg:pr-[520px]">
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#0B1426] leading-tight flex flex-col items-start">
                <HeadingAnimator text="Procedures" className="text-[#C9A96E]" />
                <HeadingAnimator text="Offered" className="italic font-normal" />
              </h2>
            </div>

            {/* High Fidelity Vertical Timeline Scroll-Spy & Premium Card Holder */}
            <div className="w-full max-w-6xl mx-auto flex flex-row items-center relative mt-6 sm:mt-10 md:mt-14 px-2 sm:px-6 z-20">
              
              {/* Timeline Indicator (Left) */}
              <div className="relative w-12 sm:w-16 md:w-20 h-[200px] sm:h-[280px] md:h-[360px] flex-shrink-0 -ml-8 sm:-ml-16 md:-ml-28 lg:-ml-36">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1.5px] md:w-[2px] bg-[#D6D2CC] rounded-full" />
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-0 w-[1.5px] md:w-[2px] bg-[#C9A96E] rounded-full origin-top transition-all duration-100"
                  style={{ height: `calc(${clampedSmoothTimelineProgress} * 100%)` }}
                />
                <div 
                  className="absolute left-1/2 w-[8px] h-[8px] md:w-[12px] md:h-[12px] rounded-full bg-[#C9A96E] border-2 border-[#F0EDE8] shadow-md flex items-center justify-center transition-all duration-100 z-10"
                  style={{ 
                    top: `calc(${clampedSmoothTimelineProgress} * 100%)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>
 
              {/* Premium Central Card Holder (10:8 Ratio scaled up) */}
              <div className="flex-1 flex flex-col justify-center items-center h-full pl-2 sm:pl-4 md:pl-0">
                <div className="relative w-full max-w-[460px] sm:max-w-[620px] md:max-w-[760px] lg:max-w-[900px] aspect-[4/3] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl border border-[#D6D2CC]/50 group">
                  
                  {/* Image Backgrounds */}
                  {treatmentPhotos.map((photo, i) => (
                    <img 
                      key={i}
                      src={photo} 
                      alt={`Treatment ${i + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-[0.22,1,0.36,1] ${activeTreatmentIdx === i ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                    />
                  ))}
                </div>

                {/* Dynamic Text Content Below Photo */}
                <div className="w-full max-w-[460px] sm:max-w-[620px] md:max-w-[760px] lg:max-w-[900px] mt-4 sm:mt-6 overflow-hidden flex flex-col justify-end">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTreatmentIdx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <span className="font-serif text-[#C9A96E] text-sm sm:text-base md:text-lg font-bold mb-1 block">
                        {treatments[activeTreatmentIdx].num}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-[#0B1426] uppercase tracking-wider font-bold leading-tight">
                        {treatments[activeTreatmentIdx].title}
                      </h3>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
 
            </div>

            {/* Infinite Horizontal Photo Marquee */}
            <div className="w-full mt-auto mb-4 md:mb-8 overflow-hidden py-4 z-10 opacity-90 hover:opacity-100 transition-opacity duration-300">
              <div className="animate-marquee flex items-center gap-3 sm:gap-4 md:gap-6">
                {[...treatmentPhotos, ...treatmentPhotos, ...treatmentPhotos, ...treatmentPhotos].map((photo, idx) => (
                  <div key={idx} className="w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] md:w-[160px] md:h-[160px] flex-shrink-0 rounded-[16px] md:rounded-[20px] overflow-hidden shadow-lg border border-white/40">
                    <img src={photo} alt="Treatment Gallery" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
