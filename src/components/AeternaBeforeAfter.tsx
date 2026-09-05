import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import beforeImg from '../../photos/beforeandafter/before.webp';
import afterImg from '../../photos/beforeandafter/after.webp';

// 1. Heading Animator: typewriter effect with single letter y-axis offset & whole word y + x offset
export function HeadingAnimator({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const words = text.split(" ");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      }
    }
  };

  const wordVariants = {
    hidden: { 
      y: 12, 
      x: 4, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        staggerChildren: 0.04,
      }
    }
  };

  const letterVariants = {
    hidden: { 
      y: 8, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.25,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10px" }}
      className={`inline-flex flex-wrap ${className || ""}`}
      style={style}
    >
      {words.map((word, wordIdx) => (
        <motion.span
          key={wordIdx}
          variants={wordVariants}
          className="inline-block mr-[0.25em] whitespace-nowrap"
        >
          {Array.from(word).map((letter, letterIdx) => (
            <motion.span
              key={letterIdx}
              variants={letterVariants}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </motion.span>
  );
}

// 2. Content Animator: simple word-by-word animation with x and y offset coming one by one
export function ContentAnimator({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.15,
      }
    }
  };

  const wordVariants = {
    hidden: { 
      x: 6, 
      y: 6, 
      opacity: 0 
    },
    visible: { 
      x: 0, 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10px" }}
      className={`inline-flex flex-wrap ${className || ""}`}
      style={style}
    >
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          variants={wordVariants}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// 3. Detail Animator: line by line animation
export function DetailAnimator({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const lines = text.split("\n");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      }
    }
  };

  const lineVariants = {
    hidden: { 
      y: 6, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10px" }}
      className={`block ${className || ""}`}
      style={style}
    >
      {lines.map((line, idx) => (
        <motion.span
          key={idx}
          variants={lineVariants}
          className="block"
        >
          {line}
        </motion.span>
      ))}
    </motion.span>
  );
}

const treatments = [
  {
    id: "rhinoplasty",
    tag: "6 MONTHS POST-OPERATIVE",
    title: "Rhinoplasty & Nasal Sculpting",
    desc: "Complete nasal profile refinement, dorsal hump correction, tip projection adjustment, and airway optimization for harmonious facial balance.",
    beforeLabel: "NASAL ASYMMETRY / DORSAL HUMP",
    afterLabel: "REFINED BALANCED PROFILE",
    beforeBg: "bg-[#E8E4DF] text-[#4A5568] border-[#8B9AAF]",
    afterBg: "bg-[#F8F6F2] text-[#C9A96E] border-[#C9A96E]"
  },
  {
    id: "facelift",
    tag: "3 MONTHS POST-OPERATIVE",
    title: "Laser Skin Resurfacing & Neck Lift",
    desc: "Comprehensive facial rejuvenation with SMAS repositioning, jowl correction, platysma tightening, and natural volume restoration.",
    beforeLabel: "SAGGING JOWLS / NECK LAXITY",
    afterLabel: "SCULPTED YOUTHFUL CONTOUR",
    beforeBg: "bg-[#D6D2CC] text-[#4A5568] border-[#8B9AAF]",
    afterBg: "bg-[#F8F6F2] text-[#C9A96E] border-[#C9A96E]"
  },
  {
    id: "breast",
    tag: "4 MONTHS POST-OPERATIVE",
    title: "Breast Augmentation & Lift",
    desc: "Dual-plane augmentation with anatomical implants, periareolar mastopexy, and natural fat grafting for proportional, elegant results.",
    beforeLabel: "VOLUME LOSS / PTOSIS",
    afterLabel: "PROPORTIONAL NATURAL SILHOUETTE",
    beforeBg: "bg-[#E0DCD7] text-[#4A5568] border-[#8B9AAF]",
    afterBg: "bg-[#F8F6F2] text-[#C9A96E] border-[#C9A96E]"
  },
  {
    id: "bodycontour",
    tag: "2 MONTHS POST-OPERATIVE",
    title: "360° Melasma Treatment & Liposuction",
    desc: "Power-assisted liposuction with autologous fat transfer, circumferential abdominoplasty, and precision body sculpting for defined athletic contour.",
    beforeLabel: "EXCESS ADIPOSITY / LOOSE SKIN",
    afterLabel: "SCULPTED DEFINED PHYSIQUE",
    beforeBg: "bg-[#DAD6D0] text-[#4A5568] border-[#8B9AAF]",
    afterBg: "bg-[#F8F6F2] text-[#C9A96E] border-[#C9A96E]"
  }
];

export default function AeternaBeforeAfter() {
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({
    rhinoplasty: 50,
    facelift: 50,
    breast: 50,
    bodycontour: 50
  });

  const carouselRef = useRef<HTMLDivElement>(null);

  // Initial hint animation to show slider is draggable
  useEffect(() => {
    let start: number | null = null;
    const duration = 2200; // 2.2 seconds animation
    
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = elapsed / duration;
      
      if (progress < 1) {
        // Smooth sine wave oscillation: 50 -> 80 -> 20 -> 50
        const angle = progress * Math.PI * 2;
        const wave = Math.sin(angle);
        const currentPos = 50 + wave * 30;
        setSliderPositions(prev => ({ ...prev, rhinoplasty: currentPos }));
        requestAnimationFrame(animate);
      } else {
        setSliderPositions(prev => ({ ...prev, rhinoplasty: 50 }));
      }
    };

    // Delay slightly to let the page settle
    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleSliderChange = (id: string, val: number) => {
    setSliderPositions(prev => ({ ...prev, [id]: val }));
  };

  const scrollPrev = () => {
    if (carouselRef.current) {
      const card = carouselRef.current.firstElementChild as HTMLElement;
      if (card) {
        const cardWidth = card.getBoundingClientRect().width;
        carouselRef.current.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
      }
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      const card = carouselRef.current.firstElementChild as HTMLElement;
      if (card) {
        const cardWidth = card.getBoundingClientRect().width;
        carouselRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
      }
    }
  };

  // Interpolation helper for smooth transition as slider drags
  const interpolateColor = (color1: number[], color2: number[], factor: number) => {
    const r = Math.round(color1[0] + (color2[0] - color1[0]) * factor);
    const g = Math.round(color1[1] + (color2[1] - color1[1]) * factor);
    const b = Math.round(color1[2] + (color2[2] - color1[2]) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <section id="results-section" className="py-20 bg-[#F0EDE8] rounded-[32px] mx-4 my-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-6">
          <div className="max-w-2xl">
            <DetailAnimator 
              text="Real Results" 
              className="font-display text-[12px] uppercase tracking-[0.25em] text-[#C9A96E] mb-3 font-semibold" 
            />
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0B1426] leading-tight flex flex-col items-start">
              <HeadingAnimator text="Before &" />
              <HeadingAnimator text="After" className="italic font-normal" />
            </h2>
          </div>
        </div>

        {/* Horizontal Scrollable Container Wrapped in Relative Wrapper */}
        <div className="relative group">
          
          {/* Left Navigation Arrow (Naked, positioned outside the card boundaries in the padding zone) */}
          <button 
            onClick={scrollPrev}
            className="absolute -left-5 sm:-left-7 md:-left-10 lg:-left-12 top-[100px] -translate-y-1/2 z-30 flex items-center justify-center text-[#0B1426] hover:text-[#C9A96E] transition-all duration-300 cursor-pointer active:scale-90 focus:outline-none"
            aria-label="Previous treatment"
          >
            <span className="material-symbols-outlined text-[32px] sm:text-[38px] md:text-[44px] font-light">chevron_left</span>
          </button>

          {/* Right Navigation Arrow (Naked, positioned outside the card boundaries in the padding zone) */}
          <button 
            onClick={scrollNext}
            className="absolute -right-5 sm:-right-7 md:-right-10 lg:-right-12 top-[100px] -translate-y-1/2 z-30 flex items-center justify-center text-[#0B1426] hover:text-[#C9A96E] transition-all duration-300 cursor-pointer active:scale-90 focus:outline-none"
            aria-label="Next treatment"
          >
            <span className="material-symbols-outlined text-[32px] sm:text-[38px] md:text-[44px] font-light">chevron_right</span>
          </button>

          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 px-1 scroll-smooth"
          >
          {treatments.map((treatment) => {
            const pos = sliderPositions[treatment.id];
            const factor = pos / 100; // 0 (AFTER / normal light) to 1 (BEFORE / dark)

            // Interpolate styles dynamically as the slider moves
            // BG: #ffffff -> #0B1426
            const currentBg = interpolateColor([255, 255, 255], [11, 20, 38], factor);
            // Border: #D6D2CC -> #4A5568
            const currentBorder = interpolateColor([214, 210, 204], [74, 85, 104], factor);
            // Title Text: #0B1426 -> #F8F6F2
            const currentTitleColor = interpolateColor([11, 20, 38], [248, 246, 242], factor);
            // Description Text: #4A5568 -> #C9A96E
            const currentDescColor = interpolateColor([74, 85, 104], [201, 169, 110], factor);
            // Tag Text: #C9A96E -> #F8F6F2
            const currentTagColor = interpolateColor([201, 169, 110], [248, 246, 242], factor);

            return (
              <div 
                key={treatment.id}
                className="w-full md:w-[calc(50%-12px)] sm:w-[480px] shrink-0 snap-start rounded-[24px] overflow-hidden shadow-md flex flex-col transition-shadow duration-300 hover:shadow-lg border"
                style={{ 
                  backgroundColor: currentBg,
                  borderColor: currentBorder
                }}
              >
                {/* Visual Slider Interactive Container */}
                <div className="relative h-[200px] select-none overflow-hidden bg-[#0B1426]">
                  
                  {/* AFTER (Background level) */}
                  <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center`}>
                    <img src={afterImg} alt="After Treatment" className="absolute inset-0 w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm text-[#0B1426] text-[9px] px-2 py-0.5 rounded-full font-display tracking-widest font-bold z-10 shadow-sm border border-black/5">
                      AFTER
                    </span>
                  </div>

                  {/* BEFORE (Clipping Layer on Top) */}
                  <div 
                    className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center border-r-2 border-white/80 shadow-[4px_0_12px_rgba(0,0,0,0.15)]`}
                    style={{ 
                      clipPath: `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)`
                    }}
                  >
                    <img src={beforeImg} alt="Before Treatment" className="absolute inset-0 w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-[#0B1426]/80 backdrop-blur-sm text-[#ffffff] text-[9px] px-2 py-0.5 rounded-full font-display tracking-widest font-bold z-10 shadow-sm">
                      BEFORE
                    </span>
                  </div>

                  {/* Range Input Slider Overlay */}
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={pos} 
                    onChange={(e) => handleSliderChange(treatment.id, Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-ew-resize"
                  />

                  {/* Interactive Button Anchor Handle Indicator */}
                  <div 
                    className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none z-20"
                    style={{ left: `${pos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-[#ffffff] rounded-full flex items-center justify-center shadow-lg pointer-events-none border border-[#D6D2CC] hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[16px] text-[#0B1426]">code</span>
                    </div>
                  </div>

                </div>

                {/* Text Description Block */}
                <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <DetailAnimator 
                      text={treatment.tag} 
                      className="font-display text-[9px] font-bold tracking-[0.2em] mb-1 transition-colors duration-300"
                      style={{ color: currentTagColor }}
                    />
                    <HeadingAnimator 
                      text={treatment.title} 
                      className="font-serif text-lg font-medium mb-1.5 transition-colors duration-300 block"
                      style={{ color: currentTitleColor }}
                    />
                    <ContentAnimator 
                      text={treatment.desc} 
                      className="font-sans text-xs leading-relaxed transition-colors duration-300"
                      style={{ color: currentDescColor }}
                    />
                  </div>

                  {/* Little interaction micro-indicator */}
                  <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: currentBorder }}>
                    <span className="font-display text-[8px] uppercase tracking-wider font-semibold opacity-60" style={{ color: currentDescColor }}>
                      {pos === 50 ? "Explore States" : pos < 50 ? "Showing AFTER Treatment" : "Showing BEFORE Treatment"}
                    </span>
                    <span className="material-symbols-outlined text-[14px] animate-pulse" style={{ color: currentTagColor }}>
                      {pos < 50 ? "sparkles" : "info"}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
        </div>

      </div>
    </section>
  );
}
