import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { HeadingAnimator, ContentAnimator, DetailAnimator } from './AeternaBeforeAfter';
import doctorPortrait from '../../photos/doctor/doctor.webp';

const credentials = [
  { icon: 'school', label: 'MBBS, MD' },
  { icon: 'workspace_premium', label: 'Board Certified Specialists' },
  { icon: 'timer', label: '25+ Years (Dermatology)' },
  { icon: 'timer', label: '30+ Years (ENT)' },
];

const philosophyPoints = [
  {
    icon: 'biotech',
    title: 'Comprehensive Care',
    desc: 'Refining healthcare solutions in dermatology and cosmetology + ear, nose and throat ailments.',
  },
  {
    icon: 'spa',
    title: 'Dermatology & Cosmetology',
    desc: 'Tailored treatments for psoriasis, vitiligo, allergies, acne, alopecia, and nail diseases.',
  },
  {
    icon: 'hearing',
    title: 'Advanced ENT Services',
    desc: 'Utilising the latest diagnostic tools and surgeries for vertigo, deafness, sinus endoscopy, and ear micro-surgery.',
  },
];

const milestones = [
  { year: '2012', text: 'Completed MD in Dermatology with Gold Medal distinction' },
  { year: '2015', text: 'Advanced Fellowship in Cosmetic Dermatology & Laser Medicine' },
  { year: '2018', text: 'Founded DR METHI ENT CARE AND SKIN TALKS — a boutique dermatology practice' },
  { year: '2021', text: 'Published 20+ peer-reviewed papers in clinical dermatology' },
  { year: '2024', text: "Recognised among India's Top 50 Dermatologists" },
];

export default function AeternaAboutDoctor() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [activePhilosophy, setActivePhilosophy] = useState(0);

  // Auto-cycle philosophy cards
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhilosophy((prev) => (prev + 1) % philosophyPoints.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="about-doctor-section"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* ——— Background Decor ——— */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Warm radial glow behind photo */}
        <div className="absolute top-[10%] left-[-10%] w-[60%] aspect-square bg-gradient-to-br from-[#C9A96E]/15 via-[#C9A96E]/5 to-transparent rounded-full blur-[120px]" />
        {/* Subtle top-right accent */}
        <div className="absolute top-0 right-0 w-[35%] aspect-square bg-gradient-to-bl from-[#0B1426]/5 to-transparent rounded-full blur-[100px]" />
        {/* Thin gold horizontal rule */}
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#C9A96E]/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* ——— Section Header ——— */}
        <div className="text-center mb-16 sm:mb-20">
          <DetailAnimator
            text="About DR METHI ENT CARE AND SKIN TALKS"
            className="font-display text-[12px] uppercase tracking-[0.25em] text-[#C9A96E] mb-4 font-bold block"
          />
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0B1426] leading-tight flex flex-col items-center">
            <HeadingAnimator text="Refining Healthcare Solutions" />
            <HeadingAnimator text="in Dermatology & ENT" className="italic text-[#C9A96E] font-normal" />
          </h2>
        </div>

        {/* ——— Main Content Grid ——— */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* -------- LEFT: Doctor Portrait Card -------- */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:sticky lg:top-28"
          >
            {/* Decorative gold ring */}
            <div className="absolute -inset-3 rounded-[36px] border border-[#C9A96E]/20 pointer-events-none" />
            <div className="absolute -inset-6 rounded-[40px] border border-[#C9A96E]/8 pointer-events-none hidden sm:block" />

            <div className="relative w-full max-w-[420px] rounded-[32px] overflow-hidden shadow-2xl group">
              {/* Image with parallax */}
              <motion.div style={{ y: parallaxY }} className="relative">
                <img
                  src={doctorPortrait}
                  alt="Dr. Vanita Methi — Board Certified Dermatologist"
                  className="w-full aspect-[3/4] object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{ imageRendering: 'high-quality', transform: 'translateZ(0)' }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426] via-[#0B1426]/30 to-transparent" />
              </motion.div>

              {/* Name plate */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium mb-1">
                    Dr. Vanita & Dr. Aditya Methi
                  </h3>
                  <p className="font-display text-[11px] uppercase tracking-[0.2em] text-[#C9A96E] font-semibold">
                    Founders & Chief Consultants
                  </p>
                </motion.div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
                className="absolute top-5 right-5 bg-[#0B1426]/80 backdrop-blur-xl border border-[#C9A96E]/30 rounded-2xl px-4 py-3 text-center shadow-lg"
              >
                <span className="font-serif text-xl text-[#C9A96E] font-bold block leading-none">30+</span>
                <span className="font-display text-[8px] uppercase tracking-[0.15em] text-white/70 font-semibold">Years</span>
              </motion.div>
            </div>
          </motion.div>

          {/* -------- RIGHT: Details -------- */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-10"
          >
            {/* Bio */}
            <div>
              <ContentAnimator
                text="A state-of-the-art clinic refining healthcare solutions in dermatology and cosmetology + ear, nose and throat ailments."
                className="font-sans text-sm sm:text-base text-[#4A5568] leading-relaxed font-light"
              />
              <div className="mt-4">
                <ContentAnimator
                  text="Dr. Vanita Methi draws on over 25 years of dedicated experience to provide tailored treatments for psoriasis, vitiligo, allergies, fungal infections, acne, various types of alopecia (hair fall) and nail diseases, along with anti-ageing therapies including botox, fillers, chemical peels, PRP and a variety of lasers."
                  className="font-sans text-sm sm:text-base text-[#4A5568] leading-relaxed font-light"
                />
              </div>
              <div className="mt-4">
                <ContentAnimator
                  text="Dr. Aditya Methi, with his experience of 30 years, utilises the latest diagnostic tools and surgeries for vertigo (dizziness), deafness, nasal and sinus endoscopy, ear micro-surgery, tonsils, thyroid problems, neck swellings and oral ulcers."
                  className="font-sans text-sm sm:text-base text-[#4A5568] leading-relaxed font-light"
                />
              </div>
            </div>

            {/* Credential Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="grid grid-cols-2 gap-3"
            >
              {credentials.map((cred, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="flex items-center gap-3 bg-white/60 border border-[#D6D2CC]/50 rounded-2xl px-4 py-3.5 backdrop-blur-sm hover:border-[#C9A96E]/40 hover:bg-white/80 transition-all duration-300 group/cred"
                >
                  <span
                    className="material-symbols-outlined text-[20px] text-[#C9A96E] transition-transform duration-300 group-hover/cred:scale-110"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    {cred.icon}
                  </span>
                  <span className="font-sans text-xs text-[#0B1426] font-medium leading-snug">{cred.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* ——— Philosophy Cards (interactive) ——— */}
            <div>
              <DetailAnimator
                text="Treatment Philosophy"
                className="font-display text-[11px] uppercase tracking-[0.2em] text-[#C9A96E] font-bold mb-4 block"
              />
              <div className="flex flex-col gap-3">
                {philosophyPoints.map((point, i) => {
                  const isActive = activePhilosophy === i;
                  return (
                    <motion.div
                      key={i}
                      onClick={() => setActivePhilosophy(i)}
                      layout
                      className={`relative cursor-pointer rounded-2xl border px-5 py-4 transition-all duration-500 overflow-hidden ${
                        isActive
                          ? 'bg-[#0B1426] border-[#C9A96E]/40 shadow-lg'
                          : 'bg-white/40 border-[#D6D2CC]/40 hover:border-[#C9A96E]/30 hover:bg-white/60'
                      }`}
                    >
                      {/* Progress bar for active card */}
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#C9A96E] to-[#C9A96E]/40"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 4, ease: 'linear' }}
                          key={`progress-${i}-${activePhilosophy}`}
                        />
                      )}
                      <div className="flex items-start gap-4">
                        <span
                          className={`material-symbols-outlined text-[22px] mt-0.5 shrink-0 transition-colors duration-300 ${
                            isActive ? 'text-[#C9A96E]' : 'text-[#0B1426]/40'
                          }`}
                          style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                          {point.icon}
                        </span>
                        <div>
                          <h4
                            className={`font-serif text-sm sm:text-base font-medium mb-1 transition-colors duration-300 ${
                              isActive ? 'text-white' : 'text-[#0B1426]'
                            }`}
                          >
                            {point.title}
                          </h4>
                          <motion.p
                            initial={false}
                            animate={{
                              height: isActive ? 'auto' : 0,
                              opacity: isActive ? 1 : 0,
                            }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed font-light overflow-hidden"
                          >
                            {point.desc}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ——— Timeline ——— */}
            <div>
              <DetailAnimator
                text="Career Milestones"
                className="font-display text-[11px] uppercase tracking-[0.2em] text-[#C9A96E] font-bold mb-5 block"
              />
              <div className="relative pl-6 border-l-2 border-[#C9A96E]/20 flex flex-col gap-6">
                {milestones.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 * i, duration: 0.5 }}
                    className="relative group/mile"
                  >
                    {/* Dot on timeline */}
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-[#C9A96E] bg-[#F8F6F2] group-hover/mile:bg-[#C9A96E] transition-colors duration-300" />
                    <span className="font-display text-[10px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold">{m.year}</span>
                    <p className="font-sans text-xs sm:text-sm text-[#4A5568] mt-0.5 leading-relaxed font-light">{m.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ——— Signature CTA ——— */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-[#0B1426] rounded-[24px] p-6 sm:p-8 relative overflow-hidden"
            >
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, #C9A96E 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }} />

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="flex-1">
                  <h4 className="font-serif text-lg sm:text-xl text-white font-medium mb-1.5">
                    Begin Your Consultation
                  </h4>
                  <p className="font-sans text-xs text-white/50 leading-relaxed font-light">
                    To schedule tele-consultations, please contact the clinic reception. Every journey begins with understanding your unique needs.
                  </p>
                </div>
                <a
                  href="tel:2125550100"
                  className="shrink-0 px-6 py-3 bg-[#C9A96E] text-[#0B1426] rounded-full font-display text-[11px] uppercase tracking-wider font-bold hover:bg-white transition-all duration-300 active:scale-95 flex items-center gap-2 btn-shimmer"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  Book a Visit
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
