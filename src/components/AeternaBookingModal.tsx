import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Appointment } from '../types';

interface BookingModalProps {
  onClose: () => void;
  onBookingSuccess: (booking: Appointment) => void;
}

const timeSlots = [
  "09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:00 PM", "04:30 PM"
];

const prepGuidelines: Record<string, string[]> = {
  "Rhinoplasty & Facial Sculpting": [
    "Complete all pre-operative blood work and medical clearance 2 weeks prior.",
    "Discontinue aspirin, ibuprofen, fish oil, and blood-thinning supplements 14 days before surgery.",
    "Arrange for a responsible adult to drive you home and stay with you for 24 hours post-surgery.",
    "No eating or drinking after midnight the night before your procedure (NPO after midnight).",
    "Plan for 7-10 days of initial recovery; a nasal splint will be worn for the first week."
  ],
  "Breast Augmentation & Lift": [
    "Complete mammogram and pre-operative lab work as directed by Dr. Vanita Methi.",
    "Stop all blood-thinning medications and herbal supplements 14 days prior.",
    "Purchase a supportive clinical compression bra before your procedure date.",
    "Arrange for 2 weeks off from work and strenuous physical activity.",
    "Arrive in comfortable, loose-fitting clothing that buttons or zips in front."
  ],
  "Body Contouring & Liposuction": [
    "Maintain a stable weight for at least 3 months prior to your procedure.",
    "Complete all required pre-operative testing and medical clearance.",
    "Purchase compression garments as specified during your consultation.",
    "Stay well hydrated in the days leading up to surgery.",
    "Arrange for assistance at home for the first 48-72 hours post-procedure."
  ],
  "Facelift & Neck Lift": [
    "Discontinue smoking and nicotine products at least 4 weeks before and after surgery.",
    "Stop aspirin, anti-inflammatory drugs, and herbal supplements 14 days prior.",
    "Complete all pre-operative lab work and cardiac clearance if applicable.",
    "Plan for 2-3 weeks of initial recovery with progressive return to normal activities.",
    "Arrive with clean hair and no facial products on the day of surgery."
  ],
  "Blepharoplasty & Eye Rejuvenation": [
    "Obtain an ophthalmological clearance if you have any pre-existing eye conditions.",
    "Discontinue blood-thinning medications and supplements 14 days prior.",
    "Purchase artificial tears and cold compresses for post-operative comfort.",
    "Arrange for someone to drive you home; your vision may be temporarily blurred.",
    "Plan for 7-10 days before sutures are removed and bruising subsides."
  ],
  "Non-Clinical Injectables": [
    "Avoid alcohol consumption for 24 hours before your appointment.",
    "Discontinue blood-thinning medications 5 days prior to minimize bruising.",
    "Arrive with a clean face free of makeup, moisturizers, or sunscreen.",
    "Avoid strenuous exercise for 24 hours after treatment."
  ],
  "General Consultation": [
    "Prepare a list of your aesthetic goals and any previous clinical procedures.",
    "Bring recent photos showing areas of concern from multiple angles.",
    "Have a list of current medications and allergies ready for review.",
    "Dr. Vanita Methi will provide a comprehensive, personalized clinical plan."
  ]
};

export default function AeternaBookingModal({ onClose, onBookingSuccess }: BookingModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [concern, setConcern] = useState('Rhinoplasty & Facial Sculpting');
  const [date, setDate] = useState('');
  const [time, setTime] = useState(timeSlots[2]); // Default 12:00 PM
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, concern, date, time, notes })
      });

      if (response.ok) {
        const data = await response.json();
        setConfirmedBooking(data);
        onBookingSuccess(data);
      } else {
        const err = await response.json();
        setErrorMsg(err.error || "Failed to finalize appointment. Please try again.");
      }
    } catch (err) {
      setErrorMsg("An unexpected connection error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1426]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#F8F6F2] text-[#0B1426] w-full max-w-2xl rounded-[28px] p-6 sm:p-10 shadow-2xl relative border border-[#C9A96E]/20 my-8"
      >
        {/* Close Button */}
        <button 
          id="close-booking-modal"
          onClick={onClose}
          className="absolute top-6 right-6 text-[#0B1426] hover:text-[#C9A96E] transition-colors p-2 cursor-pointer"
          aria-label="Close booking modal"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        {confirmedBooking ? (
          /* Elegant booking success receipt */
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#C9A96E]/20 text-[#C9A96E] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
            </div>
            
            <h3 className="font-serif text-3xl text-[#0B1426] mb-2 font-semibold">Consultation Reserved</h3>
            <p className="font-sans text-xs text-[#4A5568] uppercase tracking-widest mb-6">DR METHI ENT CARE AND SKIN TALKS — Plastic &amp; Reconstructive Dermatology</p>
            
            {/* Ticket details */}
            <div className="bg-[#F0EDE8] rounded-[20px] p-6 text-left border border-[#D6D2CC] max-w-md mx-auto mb-8 space-y-3 font-sans text-sm">
              <div className="flex justify-between border-b border-[#D6D2CC] pb-2 text-xs text-[#4A5568] uppercase tracking-wider font-semibold">
                <span>Confirmation ID</span>
                <span className="text-[#C9A96E]">{confirmedBooking.id}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#4A5568] font-light">Patient Name</span>
                <span className="font-medium text-[#0B1426]">{confirmedBooking.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5568] font-light">Service Treatment</span>
                <span className="font-medium text-[#0B1426]">{confirmedBooking.concern}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5568] font-light">Scheduled Session</span>
                <span className="font-medium text-[#0B1426]">{confirmedBooking.date} at {confirmedBooking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5568] font-light">Location</span>
                <span className="font-medium text-[#0B1426] text-right">740 Park Ave, NYC</span>
              </div>
            </div>

            {/* Preparation Guidelines */}
            <div className="max-w-md mx-auto text-left mb-8 bg-[#C9A96E]/10 rounded-[20px] p-6 border border-[#C9A96E]/20">
              <h4 className="font-display text-[11px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">info</span>
                PRE-OPERATIVE PREPARATION GUIDE
              </h4>
              <ul className="space-y-2.5">
                {(prepGuidelines[confirmedBooking.concern] || prepGuidelines["General Consultation"]).map((pointer, pidx) => (
                  <li key={pidx} className="flex gap-2.5 text-xs text-[#4A5568] leading-relaxed">
                    <span className="text-[#C9A96E] shrink-0 font-bold">•</span>
                    <span>{pointer}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              id="booking-done-btn"
              onClick={onClose}
              className="px-8 py-3.5 bg-[#0B1426] text-white rounded-full font-display text-xs uppercase tracking-widest hover:bg-[#C9A96E] transition-colors duration-300 font-bold active:scale-95 cursor-pointer"
            >
              Return to Methi
            </button>
          </div>
        ) : (
          /* Consultation booking Form */
          <div>
            <div className="mb-8">
              <span className="font-display text-[11px] uppercase tracking-[0.2em] text-[#C9A96E] font-bold block mb-1">RESERVATION</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#0B1426]">Private Consultation</h3>
              <p className="font-sans text-xs sm:text-sm text-[#4A5568] mt-1 font-light">
                Please provide your details below. Dr. Vanita Methi and the DR METHI ENT CARE AND SKIN TALKS concierge team will ensure discrete and tailored care.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-[#ffdad6] text-[#93000a] text-xs font-sans rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Details Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-display text-[10px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold mb-1">
                    Your Full Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-[#0B1426]/20 focus:border-[#C9A96E] py-2 px-1 text-sm outline-none font-sans"
                    placeholder="e.g. Victoria Sterling"
                  />
                </div>
                <div>
                  <label className="block font-display text-[10px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold mb-1">
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-[#0B1426]/20 focus:border-[#C9A96E] py-2 px-1 text-sm outline-none font-sans"
                    placeholder="e.g. sophia@example.com"
                  />
                </div>
              </div>

              {/* Contact and treatment concerns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-display text-[10px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold mb-1">
                    Phone Number *
                  </label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent border-b border-[#0B1426]/20 focus:border-[#C9A96E] py-2 px-1 text-sm outline-none font-sans"
                    placeholder="e.g. (212) 555-0100"
                  />
                </div>
                <div>
                  <label className="block font-display text-[10px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold mb-1">
                    Procedure of Interest *
                  </label>
                  <select 
                    value={concern}
                    onChange={(e) => setConcern(e.target.value)}
                    className="w-full bg-transparent border-b border-[#0B1426]/20 focus:border-[#C9A96E] py-2 px-1 text-sm outline-none font-sans"
                  >
                    <option value="Rhinoplasty & Facial Sculpting">Rhinoplasty & Facial Sculpting</option>
                    <option value="Breast Augmentation & Lift">Breast Augmentation & Lift</option>
                    <option value="Body Contouring & Liposuction">Body Contouring & Liposuction</option>
                    <option value="Facelift & Neck Lift">Facelift & Neck Lift</option>
                    <option value="Blepharoplasty & Eye Rejuvenation">Blepharoplasty & Eye Rejuvenation</option>
                    <option value="Non-Clinical Injectables">Non-Clinical Injectables</option>
                    <option value="General Consultation">General Consultation</option>
                  </select>
                </div>
              </div>

              {/* Date and Time selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-display text-[10px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold mb-1">
                    Preferred Date *
                  </label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent border-b border-[#0B1426]/20 focus:border-[#C9A96E] py-2 px-1 text-sm outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block font-display text-[10px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold mb-2">
                    Preferred Time Slot *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setTime(slot)}
                        className={`py-2 text-[10px] sm:text-xs font-display uppercase tracking-wider rounded-xl border transition-all ${
                          time === slot 
                            ? 'bg-[#0B1426] border-[#0B1426] text-white font-bold' 
                            : 'bg-transparent border-[#D6D2CC] hover:border-[#C9A96E] text-[#0B1426]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block font-display text-[10px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold mb-1">
                  Additional Notes or Questions
                </label>
                <textarea 
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-transparent border border-[#0B1426]/20 rounded-xl focus:border-[#C9A96E] p-3 text-sm outline-none font-sans resize-none"
                  placeholder="Tell us about your aesthetic goals or previous procedures..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 border border-[#D6D2CC] text-[#0B1426] rounded-full font-display text-xs uppercase tracking-widest font-semibold hover:bg-[#F0EDE8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-[#0B1426] text-white rounded-full font-display text-xs uppercase tracking-widest font-semibold hover:bg-[#C9A96E] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmitting ? "Processing..." : "CONFIRM RESERVATION"}
                </button>
              </div>

            </form>
          </div>
        )}

      </motion.div>
    </div>
  );
}
