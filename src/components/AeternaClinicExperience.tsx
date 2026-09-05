import React from 'react';
import { motion } from 'motion/react';
import { HeadingAnimator, ContentAnimator, DetailAnimator } from './AeternaBeforeAfter';

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600",
    title: "Private Recovery Suite",
    gridClass: "col-span-2 h-[380px]"
  },
  {
    src: "https://images.unsplash.com/photo-1551190822-a9ce113ac100?auto=format&fit=crop&q=80&w=300",
    title: "Surgical Consultation Room",
    gridClass: "h-[180px]"
  },
  {
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=300",
    title: "Operating Theater",
    gridClass: "h-[180px]"
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
    title: "Aesthetic Wellness Center",
    gridClass: "col-span-2 h-[220px]"
  }
];

export default function AeternaClinicExperience() {
  return (
    <section id="clinic-section" className="py-20 bg-[#F8F6F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <DetailAnimator 
            text="Visit Us"
            className="font-display text-[12px] uppercase tracking-[0.25em] text-[#C9A96E] mb-3 font-semibold block"
          />
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0B1426] leading-tight mb-6 flex flex-col items-center">
            <HeadingAnimator text="The Surgical" />
            <HeadingAnimator text="Suite" className="italic font-normal font-serif text-[#C9A96E]" />
          </h2>
          <ContentAnimator 
            text="Designed as a sanctuary of surgical artistry — DR METHI ENT CARE AND SKIN TALKS pairs the surgical expertise of Dr. Vanita Methi with state-of-the-art operating theaters and recovery suites."
            className="font-sans text-base text-[#4A5568] leading-relaxed font-light block"
          />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {gallery.map((img, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.215, 0.610, 0.355, 1.000], delay: idx * 0.12 }}
              className={`relative rounded-[24px] overflow-hidden group shadow-md ${img.gridClass}`}
            >
              <img 
                src={img.src} 
                alt={img.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 referrerpolicy='no-referrer'"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426]/80 via-[#0B1426]/20 to-transparent flex items-end p-6">
                <p className="font-serif text-white text-base sm:text-lg tracking-wider font-medium">{img.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact and Map Split Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Contact Details Card */}
          <div className="md:col-span-5 bg-[#F0EDE8] rounded-[24px] p-8 border border-[#D6D2CC]/50 flex flex-col justify-center shadow-sm">
            <DetailAnimator 
              text="CONTACT & DETAILS"
              className="font-display text-xs uppercase tracking-[0.2em] text-[#C9A96E] font-bold mb-8 block"
            />

            <ul className="space-y-6">
              <li className="flex items-start gap-4 hover:text-[#C9A96E] transition-colors duration-200">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-[#C9A96E]">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                </div>
                <div>
                  <DetailAnimator 
                    text="Clinic Location"
                    className="font-display text-[10px] uppercase tracking-wider text-[#4A5568] font-bold mb-0.5 block"
                  />
                  <DetailAnimator 
                    text="740 Park Avenue, Penthouse Suite\nNew York, NY 10021"
                    className="font-sans text-sm text-[#0B1426] block"
                  />
                </div>
              </li>

              <li className="flex items-start gap-4 hover:text-[#C9A96E] transition-colors duration-200">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-[#C9A96E]">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </div>
                <div>
                  <DetailAnimator 
                    text="Telephone Inquiry"
                    className="font-display text-[10px] uppercase tracking-wider text-[#4A5568] font-bold mb-0.5 block"
                  />
                  <DetailAnimator 
                    text="(212) 555-0100"
                    className="font-sans text-sm text-[#0B1426] font-medium block"
                  />
                </div>
              </li>

              <li className="flex items-start gap-4 hover:text-[#C9A96E] transition-colors duration-200">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-[#C9A96E]">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </div>
                <div>
                  <DetailAnimator 
                    text="Email Support"
                    className="font-display text-[10px] uppercase tracking-wider text-[#4A5568] font-bold mb-0.5 block"
                  />
                  <DetailAnimator 
                    text="concierge@methiclinic.com"
                    className="font-sans text-sm text-[#0B1426] truncate font-medium block"
                  />
                </div>
              </li>
            </ul>
          </div>

          {/* Interactive Map Block */}
          <div className="md:col-span-7 bg-[#C9A96E]/10 rounded-[24px] p-8 border border-[#C9A96E]/20 flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden min-h-[250px] group hover:bg-[#C9A96E]/25 transition-colors duration-300">
            <div className="w-12 h-12 bg-[#0B1426] text-white rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:shadow-lg transition-transform duration-300">
              <span className="material-symbols-outlined text-[24px]">location_on</span>
            </div>
            
            <HeadingAnimator 
              text="DR METHI ENT CARE AND SKIN TALKS"
              className="font-serif text-lg text-[#0B1426] font-semibold mb-1 block"
            />
            <ContentAnimator 
              text="Our AAAASF-accredited surgical center is equipped with state-of-the-art operating theaters, advanced imaging technology, and luxurious private recovery suites."
              className="font-sans text-xs text-[#4A5568] max-w-sm mb-6 leading-relaxed block"
            />

            <a 
              href="https://maps.google.com/?q=740+Park+Avenue+New+York+NY+10021"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-[#0B1426] hover:bg-[#C9A96E] text-[#ffffff] rounded-full font-display text-[11px] uppercase tracking-widest font-semibold flex items-center gap-2 transition-colors duration-300"
            >
              Get Directions
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
