import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { HeadingAnimator, ContentAnimator, DetailAnimator } from './AeternaBeforeAfter';
import doctorPortrait from '../../photos/doctor/doctor.webp';

import t01 from '../../photos/treatementoffered/01.avif';
import t02 from '../../photos/treatementoffered/02.jpg';
import t03 from '../../photos/treatementoffered/03.jpg';
import t04 from '../../photos/treatementoffered/04.webp';
import t05 from '../../photos/treatementoffered/05.jpg';
import t06 from '../../photos/treatementoffered/06.jpeg';
const treatmentPhotos = [t01, t02, t03, t04, t05, t06];

// Import all 60 hero cell frames
const heroCellFrames: string[] = [];
const frameModules = import.meta.glob('/herocell/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const sortedKeys = Object.keys(frameModules).sort();
for (const key of sortedKeys) {
  heroCellFrames.push(frameModules[key]);
}

interface HeroProps {
  onBookClick: () => void;
}

export default function AeternaHero({ onBookClick }: HeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const imagesLoadedRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Preload all frames as Image objects
  useEffect(() => {
    if (heroCellFrames.length === 0) return;
    let loaded = 0;
    const images: HTMLImageElement[] = [];
    heroCellFrames.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === heroCellFrames.length) {
          imagesRef.current = images;
          imagesLoadedRef.current = true;
        }
      };
      images[i] = img;
    });
  }, []);

  // Animate frames on canvas at ~24fps, looping
  useEffect(() => {
    if (heroCellFrames.length === 0) return;
    const fps = 12;
    const interval = 1000 / fps;
    let lastTime = 0;
    let animId: number;

    const draw = (timestamp: number) => {
      animId = requestAnimationFrame(draw);
      if (!imagesLoadedRef.current) return;
      const delta = timestamp - lastTime;
      if (delta < interval) return;
      lastTime = timestamp - (delta % interval);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = imagesRef.current[frameIndexRef.current];
      if (img) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      frameIndexRef.current = (frameIndexRef.current + 1) % heroCellFrames.length;
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  const fadeOutThreshold = 550;
  const opacity = Math.max(0, Math.min(1, 1 - scrollY / fadeOutThreshold));
  const isHidden = scrollY >= fadeOutThreshold;

  return (
    <section id="hero-section" className="relative w-full overflow-visible bg-transparent">
      <div 
        id="hero-fixed-portrait-container"
        className="fixed top-2 sm:top-0 md:-top-4 left-0 right-0 h-[75vh] sm:h-[85vh] md:h-[95vh] z-0 pointer-events-none flex items-center justify-center p-4 sm:p-6"
        style={{
          opacity: opacity,
          visibility: isHidden ? 'hidden' : 'visible',
          transform: `translateY(${scrollY * 0.15}px)`,
          transition: isHidden ? 'none' : 'opacity 0.05s ease-out, transform 0.05s ease-out'
        }}
      >
        <div className="relative w-[110%] h-[110%] max-w-[500px] sm:max-w-[660px] md:max-w-[770px] flex items-center justify-center" style={{ transform: 'translateX(15%) translateY(-10%)' }}>
          {/* Top Left Teal Gradient Highlight */}
          <div className="absolute top-[5%] left-[-5%] w-[40%] aspect-square bg-gradient-to-br from-teal-300/40 via-teal-300/10 to-transparent rounded-full blur-[40px] pointer-events-none" style={{ zIndex: -1 }} />
          {/* Circular Shape Gradient Highlight */}
          <div className="absolute top-[25%] left-[5%] w-[150%] aspect-square bg-gradient-to-br from-[#C9A96E]/80 via-[#C9A96E]/40 to-transparent rounded-full blur-[80px] pointer-events-none" style={{ zIndex: -1 }} />
          <div className="absolute top-[35%] left-[15%] w-[120%] aspect-square bg-[#d8bd8e]/50 rounded-full blur-[60px] pointer-events-none" style={{ zIndex: -1 }} />
          {/* Hero Cell Sequence Animation - behind doctor (z-0) */}
          <canvas
            ref={canvasRef}
            className="absolute w-[85%] h-[85%] object-contain pointer-events-none"
            style={{
              left: '-30%',
              top: '22%',
              zIndex: 0,
            }}
          />
          {/* Doctor portrait - in front (z-10) */}
          <img 
            id="dr-voss-fixed-portrait"
            src={doctorPortrait} 
            alt="Dr. Vanita Methi Portrait" 
            className="relative z-10 w-full h-full object-contain object-bottom select-none pointer-events-none drop-shadow-xl"
            style={{ imageRendering: 'high-quality', transform: 'translateZ(0)' }}
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="relative z-10 w-full flex flex-col bg-transparent">
        <div className="h-[48vh] sm:h-[52vh] md:h-[58vh] pointer-events-none w-full" />

        <div className="relative w-full overflow-hidden leading-[0] bg-transparent pointer-events-none z-20">
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#C9A96E]/25 to-transparent blur-2xl pointer-events-none rounded-t-[100%]" />
          <svg viewBox="0 0 1440 220" className="relative block w-full h-[100px] sm:h-[150px] md:h-[220px]" preserveAspectRatio="none">
            <defs>
              <linearGradient id="luxury-gold-edge" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(201,169,110,0)" />
                <stop offset="30%" stopColor="rgba(201,169,110,0.4)" />
                <stop offset="50%" stopColor="rgba(201,169,110,1)" />
                <stop offset="70%" stopColor="rgba(201,169,110,0.4)" />
                <stop offset="100%" stopColor="rgba(201,169,110,0)" />
              </linearGradient>
              <linearGradient id="blend-ivory" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(248,246,242,0.92)" />
                <stop offset="40%" stopColor="rgba(248,246,242,0.99)" />
                <stop offset="100%" stopColor="#F8F6F2" />
              </linearGradient>
            </defs>
            <path d="M 0,220 Q 720,10 1440,220" fill="none" stroke="url(#luxury-gold-edge)" strokeWidth="5" />
            <path d="M 0,220 Q 720,12 1440,220 L 1440,220 L 0,220 Z" fill="url(#blend-ivory)" />
          </svg>
        </div>

        <div className="relative w-full bg-[#F8F6F2] pt-8 sm:pt-12 pb-20 -mt-[1px] z-10 overflow-hidden">
          
          {/* Infinite Horizontal Photo Marquee */}
          <div className="w-full mb-10 sm:mb-16 flex overflow-hidden py-2 z-10 opacity-90 hover:opacity-100 transition-opacity duration-300">
            <div className="animate-marquee flex items-center gap-4 sm:gap-6">
              {[...treatmentPhotos, ...treatmentPhotos, ...treatmentPhotos, ...treatmentPhotos].map((photo, idx) => (
                <div key={idx} className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] flex-shrink-0 rounded-[16px] md:rounded-[20px] overflow-hidden shadow-sm border border-[#D6D2CC]/50">
                  <img src={photo} alt="Clinic Gallery" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col items-center text-center px-6">
            <DetailAnimator 
              text="Dr. Vanita Methi  •  DR METHI ENT CARE AND SKIN TALKS"
              className="font-display text-[12px] uppercase tracking-[0.25em] text-[#C9A96E] mb-4 font-bold block"
            />
            <h1 id="hero-title" className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0B1426] leading-tight mb-8 max-w-2xl flex flex-col items-center">
              <HeadingAnimator text="Where artistry" />
              <HeadingAnimator text="meets precision" className="italic text-[#C9A96E] font-normal font-serif" />
            </h1>
            
            {/* Vertical Clinic Photo Holder */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-[260px] h-[340px] sm:w-[320px] sm:h-[400px] md:w-[400px] md:h-[480px] rounded-[32px] overflow-hidden shadow-xl border border-[#D6D2CC]/60 mb-8 relative group shrink-0"
            >
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600" 
                alt="Clinic Interior"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-0 right-0 text-center pointer-events-none">
                <span className="font-display text-[10px] uppercase tracking-[0.2em] text-[#F8F6F2] font-semibold">
                  The Clinic
                </span>
              </div>
            </motion.div>

            <ContentAnimator 
              text="Reserve your private consultation with Dr. Vanita Methi at DR METHI ENT CARE AND SKIN TALKS. Board-certified dermatologist specializing in medical, clinical, and cosmetic skincare excellence."
              className="font-sans text-sm sm:text-base text-[#4A5568] mb-8 max-w-xl leading-relaxed font-light"
            />
            <motion.div 
              id="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md"
            >
              <button id="hero-schedule-btn" onClick={onBookClick} className="flex-1 px-6 py-3.5 bg-[#0B1426] text-[#ffffff] rounded-full font-display text-xs uppercase tracking-widest hover:bg-[#C9A96E] transition-all duration-300 font-semibold flex items-center justify-center gap-2 btn-shimmer active:scale-95 hover:scale-[1.02] cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">calendar_month</span> 
                SCHEDULE CONSULTATION
              </button>
              <a id="hero-call-btn" href="tel:2125550100" className="flex-1 px-6 py-3.5 bg-transparent border border-[#0B1426] text-[#0B1426] rounded-full font-display text-xs uppercase tracking-widest hover:bg-[#F0EDE8] transition-all duration-300 font-semibold flex items-center justify-center gap-2 active:scale-95 hover:scale-[1.02]">
                CALL (212) 555-0100 
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center w-full max-w-md mt-3"
            >
              <a 
                href="#/appointment" 
                className="px-8 py-3.5 bg-[#C9A96E] text-[#ffffff] rounded-full font-display text-xs uppercase tracking-widest hover:bg-[#b8953f] transition-all duration-300 font-semibold flex items-center justify-center gap-2 active:scale-95 hover:scale-[1.02] shadow-lg"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                BOOK AN APPOINTMENT
              </a>
            </motion.div>
            <DetailAnimator 
              text="New Patients Welcome  •  Discrete & Confidential  •  Board Certified Dermatologist"
              className="mt-10 text-[10px] text-[#4A5568] uppercase tracking-widest font-medium block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
