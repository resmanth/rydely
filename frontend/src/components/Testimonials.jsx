const testimonials = [
  {
    id: 1,
    name: 'Aarav Sharma',
    role: 'Car Renter · Tech Lead',
    location: 'Gurugram, Haryana',
    route: 'Rented: Mahindra XUV700 AX7L',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    quote: "Rented an XUV700 for a 4-day self-drive road trip to Jaipur with my family. Far cleaner and better maintained than commercial car rental fleets, with zero security deposit drama!",
    verifiedBadge: 'Verified Renter · 5★',
  },
  {
    id: 2,
    name: 'Priya Nambiar',
    role: 'Car Owner (Host) · Designer',
    location: 'Indiranagar, Bengaluru',
    route: 'Hosted: Toyota Innova Hycross',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    quote: "My Hycross used to sit in my apartment basement for weeks. Listing it on Rydely now earns me ₹55,000 every month. The DigiLocker KYC on every driver gives me total peace of mind.",
    verifiedBadge: 'Superhost · 5.0 ★ (48 Trips)',
  },
  {
    id: 3,
    name: 'Rohan Deshmukh',
    role: 'Car Owner (Host) · Founder',
    location: 'Kothrud, Pune',
    route: 'Hosted: Tata Safari Dark Edition',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    quote: "I work hybrid and only use my car on weekends. Renting it out on Rydely during weekdays covers my entire vehicle EMI and insurance costs. Payouts hit my bank account automatically.",
    verifiedBadge: 'Host · 4.98 ★ (42 Trips)',
  },
  {
    id: 4,
    name: 'Ananya Iyer',
    role: 'Car Renter · Cloud Architect',
    location: 'Electronic City, Bengaluru',
    route: 'Rented: Toyota Innova Hycross',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    quote: "Needed a reliable 7-seater for a road trip to Coorg. The host delivered the car right to my doorstep, fully sanitized and with a full tank. Way superior to conventional rental agencies.",
    verifiedBadge: 'Verified Renter · 5★',
  },
  {
    id: 5,
    name: 'Vikram Singhania',
    role: 'Car Owner (Host) · Investor',
    location: 'Bandra West, Mumbai',
    route: 'Hosted: Mahindra Thar 4x4',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    quote: "Listed my Thar Earth 4x4 on Rydely for weekend rentals. Enthusiast drivers take excellent care of it, and the comprehensive insurance coverage gives complete security.",
    verifiedBadge: 'Host · 5.0 ★ (26 Trips)',
  },
  {
    id: 6,
    name: 'Dr. Sneha Reddy',
    role: 'Car Renter · Cardiologist',
    location: 'Jubilee Hills, Hyderabad',
    route: 'Rented: Mahindra XUV700',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
    quote: "Seamless self-drive experience in Hyderabad. Key handover was prompt, the car was in showroom condition with FASTag preloaded, and zero paperwork delays.",
    verifiedBadge: 'Verified Renter · 5★',
  },
  {
    id: 7,
    name: 'Karanpreet Singh',
    role: 'Car Owner (Host) · Entrepreneur',
    location: 'Sector 17, Chandigarh',
    route: 'Hosted: Tata Safari Dark',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    quote: "Listing my secondary vehicle on Rydely has become a consistent passive income stream in Chandigarh. The platform handles guest verification and deposits seamlessly.",
    verifiedBadge: 'Host · 4.96 ★ (34 Trips)',
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-[#070404] font-['Outfit'] border-t border-red-950/40 text-white relative overflow-hidden">
      
      {/* ── Keyframe styles for continuous infinite scroll ── */}
      <style>{`
        @keyframes infiniteReviewScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .infinite-review-track {
          display: flex;
          width: max-content;
          animation: infiniteReviewScroll 42s linear infinite;
          will-change: transform;
        }
        .infinite-review-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Ambient Crimson Glow behind carousel */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(160, 20, 20, 0.2) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-[11px] font-semibold tracking-widest uppercase mb-3 shadow-md shadow-red-950/50">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            🇮🇳 Verified Hosts & Renters
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Loved by Car Owners & Drivers
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-normal">
            Real stories from car owners earning passive income and guests renting self-drive cars across India.
          </p>

          {/* Interactive Pause Hint */}
          <div className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-mono text-slate-500 tracking-wider">
            <span>⏸️</span>
            <span>Hover any card to pause scroll</span>
          </div>
        </div>
      </div>

      {/* ── Infinite Scrolling Carousel Container ── */}
      <div className="relative w-full overflow-hidden py-4">

        {/* Left Edge Fade Mask */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#070404] via-[#070404]/80 to-transparent z-20" />

        {/* Right Edge Fade Mask */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#070404] via-[#070404]/80 to-transparent z-20" />

        {/* Continuous Track (Duplicated 2x for a mathematically seamless infinite loop) */}
        <div className="infinite-review-track flex gap-6 px-4">
          {[...testimonials, ...testimonials].map((t, idx) => (
            <div
              key={`${t.id}-${idx}`}
              className="w-[340px] sm:w-[380px] shrink-0 bg-zinc-950/85 hover:bg-zinc-900/95 backdrop-blur-xl border border-red-950/60 hover:border-red-500/50 p-6 rounded-3xl shadow-xl hover:shadow-red-600/10 transition-all duration-300 flex flex-col justify-between select-none cursor-pointer group"
            >
              <div>
                {/* Author Info */}
                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-red-500/40 group-hover:border-red-500 transition-colors shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white leading-snug truncate group-hover:text-red-400 transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">
                      {t.role}
                    </p>
                    <p className="text-[10px] text-red-400 font-semibold truncate">
                      {t.location}
                    </p>
                  </div>
                </div>

                {/* Car Tag + Stars */}
                <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-zinc-800/80">
                  <span className="text-[10px] font-semibold text-slate-300 bg-zinc-900 px-2.5 py-0.5 rounded-full border border-zinc-800 truncate">
                    🚗 {t.route}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-400 text-xs shrink-0">
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed italic mb-4">
                  "{t.quote}"
                </p>
              </div>

              {/* Verified Trust Tag */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="truncate">{t.verifiedBadge}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
};

export default Testimonials;
