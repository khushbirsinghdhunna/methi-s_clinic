import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Review } from '../types';
import { HeadingAnimator, DetailAnimator } from './AeternaBeforeAfter';

const initialReviews: Review[] = [
  {
    id: "rev-1",
    author: "Sophia Delacroix",
    role: "Fashion Editor, Upper East Side",
    rating: 5,
    text: "Dr. Vanita Methi's acne treatment was nothing short of miraculous. My profile is now perfectly balanced, and the recovery was far smoother than I anticipated. Her artistry is unmatched.",
    treatment: "Acne Treatment",
    date: "2026-05-12"
  },
  {
    id: "rev-2",
    author: "Alexandra Whitmore",
    role: "Attorney, Tribeca",
    rating: 5,
    text: "I researched dermatologists for two years before choosing Dr. Vanita Methi for my laser resurfacing. The results are stunning — I look refreshed and natural, never overdone. Her laser technique is masterful.",
    treatment: "CO2 Laser Resurfacing",
    date: "2026-06-01"
  },
  {
    id: "rev-3",
    author: "Julian Blackwood",
    role: "Architect, Brooklyn Heights",
    rating: 5,
    text: "After significant weight loss, Dr. Vanita Methi performed my chemical peel. The precision and attention to detail were extraordinary. I finally feel confident in my own skin.",
    treatment: "Chemical Peel",
    date: "2026-06-10"
  },
  {
    id: "rev-4",
    author: "Genevieve Laurent",
    role: "Gallery Director, Chelsea",
    rating: 5,
    text: "My microneedling results are incredibly natural-looking. Dr. Vanita Methi took the time to understand exactly what I wanted and delivered beyond my expectations. Absolute perfection.",
    treatment: "Microneedling",
    date: "2026-06-15"
  },
  {
    id: "rev-5",
    author: "Dr. Marcus Thorne",
    role: "Cardiologist, Central Park West",
    rating: 5,
    text: "As a fellow physician, I appreciate Dr. Vanita Methi's evidence-based clinical approach. Her botox work on my wife was technically flawless — she looks 15 years younger.",
    treatment: "Botox",
    date: "2026-06-20"
  }
];

export default function AeternaTestimonials() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [treatment, setTreatment] = useState('General Consultation');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!author || !text) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, role, rating, text, treatment })
      });
      if (res.ok) {
        setSuccessMsg("Thank you for sharing your transformation story!");
        setAuthor('');
        setRole('');
        setText('');
        setTreatment('General Consultation');
        setRating(5);
        fetchReviews();
        setTimeout(() => {
          setSuccessMsg('');
          setShowReviewForm(false);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="testimonials-section" className="py-20 bg-[#0B1426] text-[#ffffff] rounded-[32px] mx-4 my-8 overflow-hidden relative">
      <div className="absolute top-10 right-10 opacity-10 font-serif text-9xl pointer-events-none font-light">"</div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <DetailAnimator 
              text="Patient Journeys"
              className="font-display text-[12px] uppercase tracking-[0.25em] text-[#C9A96E] mb-3 font-semibold block"
            />
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#ffffff] leading-tight flex flex-col items-start">
              <HeadingAnimator text="Voices of" />
              <HeadingAnimator text="Confidence" className="italic text-[#C9A96E] font-normal" />
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-6 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-serif text-2xl font-bold">4.97</span>
                <div className="flex text-[#C9A96E]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                  ))}
                </div>
              </div>
              <span className="font-sans text-[10px] text-white/50 uppercase tracking-widest block">Based on 3,400+ Verified Patient Reviews</span>
            </div>

            <button 
              id="submit-story-btn"
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-3 bg-[#C9A96E] text-[#0B1426] rounded-full font-display text-xs uppercase tracking-wider hover:bg-[#C9A96E] hover:text-[#ffffff] transition-all duration-300 font-bold active:scale-95 cursor-pointer shrink-0"
            >
              Share Your Story
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Horizontal Scrolling Track */}
      <div className="relative w-full overflow-hidden py-4 z-10">
        {/* Elegant horizontal fading gradients for depth */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#0B1426] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#0B1426] to-transparent z-20 pointer-events-none" />

        {reviews.length > 0 ? (
          <div className="flex gap-6 animate-marquee select-none py-2 hover:[animation-play-state:paused]">
            {/* Double the list for seamless marquee loop */}
            {[...reviews, ...reviews].map((review, idx) => (
              <div 
                key={`${review.id}-${idx}`}
                className="w-[280px] sm:w-[350px] shrink-0 bg-white/5 border border-white/10 rounded-[24px] p-6 sm:p-8 relative shadow-lg backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]"
              >
                <div>
                  <span className="material-symbols-outlined absolute top-6 right-6 text-[#C9A96E]/20 text-[36px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                     format_quote
                  </span>

                  <div className="flex flex-col gap-0.5 mb-3">
                    <h4 className="font-serif text-lg font-medium text-[#ffffff]">
                      {review.author}
                    </h4>
                    <span className="font-sans text-[11px] text-white/50">
                      {review.role}
                    </span>
                  </div>

                  <div className="flex text-[#C9A96E] mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                    ))}
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed italic mb-6 font-light">
                    "{review.text}"
                  </p>
                </div>

                <div className="inline-block px-3 py-1 rounded-full border border-[#C9A96E]/20 text-[#C9A96E] text-[9px] font-display uppercase tracking-widest font-bold self-start">
                  {review.treatment}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/40">Loading patient journeys...</div>
        )}
      </div>

      {/* Share Story Modal/Form */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 bg-[#0B1426]/80 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#F8F6F2] text-[#0B1426] w-full max-w-lg rounded-[28px] p-8 shadow-2xl relative border border-[#C9A96E]/20"
          >
            <button 
              onClick={() => setShowReviewForm(false)}
              className="absolute top-6 right-6 text-[#0B1426] hover:text-[#C9A96E]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="font-serif text-2xl mb-2 font-medium">Share Your Transformation</h3>
            <p className="font-sans text-xs text-[#4A5568] mb-6">Your honest feedback inspires others on their aesthetic transformation journeys.</p>

            {successMsg ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-[48px] text-[#C9A96E] mb-4">check_circle</span>
                <p className="font-serif text-lg text-[#0B1426]">{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block font-display text-[10px] uppercase tracking-wider text-[#C9A96E] font-bold mb-1">Your Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-transparent border-b border-[#0B1426]/20 focus:border-[#C9A96E] py-2 px-1 text-sm outline-none font-sans"
                    placeholder="e.g. Victoria Sterling"
                  />
                </div>
                <div>
                  <label className="block font-display text-[10px] uppercase tracking-wider text-[#C9A96E] font-bold mb-1">Occupation &amp; Location</label>
                  <input 
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-transparent border-b border-[#0B1426]/20 focus:border-[#C9A96E] py-2 px-1 text-sm outline-none font-sans"
                    placeholder="e.g. Attorney, Manhattan"
                  />
                </div>
                <div>
                  <label className="block font-display text-[10px] uppercase tracking-wider text-[#C9A96E] font-bold mb-1">Treatment Received</label>
                  <select
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full bg-transparent border-b border-[#0B1426]/20 focus:border-[#C9A96E] py-2 px-1 text-sm outline-none font-sans"
                  >
                    <option value="Rhinoplasty & Facial Sculpting">Rhinoplasty & Facial Sculpting</option>
                    <option value="Breast Augmentation & Lift">Breast Augmentation & Lift</option>
                    <option value="Body Contouring & Liposuction">Body Contouring & Liposuction</option>
                    <option value="Facelift & Neck Lift">Facelift & Neck Lift</option>
                    <option value="Blepharoplasty & Eye Rejuvenation">Blepharoplasty & Eye Rejuvenation</option>
                    <option value="Non-Surgical Injectables">Non-Surgical Injectables</option>
                    <option value="General Consultation">General Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-display text-[10px] uppercase tracking-wider text-[#C9A96E] font-bold mb-1">Your Experience (Story)</label>
                  <textarea 
                    required
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-transparent border border-[#0B1426]/20 rounded-xl focus:border-[#C9A96E] p-3 text-sm outline-none font-sans resize-none"
                    placeholder="Detail your transformation..."
                  />
                </div>
                <div>
                  <label className="block font-display text-[10px] uppercase tracking-wider text-[#C9A96E] font-bold mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-[#C9A96E] hover:scale-110 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: `"FILL" ${star <= rating ? 1 : 0}` }}>
                           star
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 mt-4 bg-[#0B1426] text-white rounded-full font-display text-xs uppercase tracking-widest font-semibold hover:bg-[#C9A96E] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "SUBMIT YOUR STORY"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}
