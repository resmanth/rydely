import { Link } from 'react-router-dom';
import member1Img from '../assets/member1.jpeg';
import member2Img from '../assets/member2.jpeg';
import member3Img from '../assets/member3.jpeg';
import member4Img from '../assets/member4.png';

/**
 * Team Members Data
 * Official team member photos loaded directly from assets
 */
const teamMembers = [
  {
    id: 1,
    name: 'Aditya Dhanraj Singh',
    role: 'Founder & Chief Executive Officer',
    badge: 'VISION & STRATEGY',
    bio: 'Passionate about unlocking India’s mobility infrastructure. Leading product architecture, host monetization programs, and expansion across National Highway corridors.',
    tags: ['Product Vision', 'Host Ecosystem', 'Growth Strategy'],
    image: member1Img,
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com',
    },
  },
  {
    id: 2,
    name: 'Suryanshu Tiwari',
    role: 'Chief Technology Officer',
    badge: 'ENGINEERING & ARCHITECTURE',
    bio: 'Architecting scalable cloud microservices, DigiLocker automated KYC pipelines, real-time telematics matching, and frictionless instant UPI settlements.',
    tags: ['Full-Stack Cloud', 'DigiLocker KYC', 'System Security'],
    image: member2Img,
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com',
    },
  },
  {
    id: 3,
    name: 'Gagandeep',
    role: 'Head of Product & Design',
    badge: 'PRODUCT & EXPERIENCE',
    bio: 'Crafting intuitive automotive booking interfaces, 3D interactive scrollytelling mechanics, and high-conversion flows for both self-drive guests and private car hosts.',
    tags: ['UI/UX Design', '3D Scrollytelling', 'User Research'],
    image: member3Img,
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com',
    },
  },
  {
    id: 4,
    name: 'Resmanth kumar beesetti',
    role: 'Head of Operations & Trust',
    badge: 'OPERATIONS & SAFETY',
    bio: 'Managing vehicle onboarding standards, ₹20 Lakh damage insurance partnerships, 24/7 National Highway roadside assistance, and customer happiness across 15+ cities.',
    tags: ['Fleet Operations', 'Insurance Partnerships', 'Trust & Safety'],
    image: member4Img,
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com',
    },
  },
];

const pillars = [
  {
    icon: '🛡️',
    title: 'Trust & Verification First',
    desc: 'We never compromise on safety. Every host and driver goes through automated DigiLocker Aadhaar & Driving License checks. Our algorithmic trust engine ensures peace of mind for every key handover.',
  },
  {
    icon: '💰',
    title: 'Empowering Car Owners',
    desc: 'Cars are often the second-largest purchase Indian families make, yet they spend 90% of their life parked idle. Rydely turns a depreciating asset into a steady passive income engine generating ₹40,000–₹80,000/month.',
  },
  {
    icon: '🚀',
    title: 'Frictionless Self-Drive',
    desc: 'No traditional rental counters, no ₹20,000 blocked deposits, and no tired commercial taxi drivers. Rent the exact car you want directly from a verified neighbour or local owner with doorstep delivery.',
  },
  {
    icon: '🇮🇳',
    title: 'Tailored for Bharat',
    desc: 'From seamless UPI settlements and preloaded FASTag expressway toll management to ₹20 Lakh insurance coverage and 24/7 National Highway Roadside Assistance, everything is engineered for India.',
  },
];

const stats = [
  { num: '50K+', label: 'Verified Community Members' },
  { num: '15+', label: 'Cities & Airport Hubs' },
  { num: '₹20 Lakh', label: 'Trip Damage Insurance' },
  { num: '4.95 ★', label: 'Average User Rating' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-[#070404] text-white font-['Outfit'] pt-24 sm:pt-28 pb-16">
      
      {/* ── Hero Section (Single clean header, no duplicate logo) ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center mb-20">
        {/* Crimson Ambient Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.22) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        <div className="relative z-10">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-red-400 mb-3 px-3.5 py-1 rounded-full bg-red-950/60 border border-red-500/30">
            🇮🇳 About Rydely India
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-5 leading-tight">
            Unlocking India's 40 Million Parked Cars
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            We are building India's largest peer-to-peer car sharing and self-drive vehicle rental marketplace. By connecting verified private car owners with respectful drivers, we make personal mobility accessible, sustainable, and economically rewarding.
          </p>
        </div>
      </section>

      {/* ── Key Metrics Strip ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-zinc-950/80 border border-red-950/60 p-6 sm:p-8 rounded-3xl shadow-xl">
          {stats.map((s, i) => (
            <div key={i} className="text-center p-3">
              <span className="text-3xl sm:text-4xl font-black text-[#ff3535] drop-shadow-[0_0_15px_rgba(255,53,53,0.35)] block mb-1">
                {s.num}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4 Team Members Section (Alternating Image & Info Layout) ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-red-400 bg-red-950/60 border border-red-500/30 px-3.5 py-1 rounded-full">
            THE LEADERSHIP TEAM
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 mb-3">
            Meet the Team Behind Rydely
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Passionate builders, engineers, and automotive enthusiasts creating India's premier peer-to-peer car rental ecosystem.
          </p>
        </div>

        {/* Alternating Members List */}
        <div className="space-y-10 sm:space-y-12">
          {teamMembers.map((member, index) => {
            // Alternating layout:
            // Member 1 (index 0): Image on Right, Info on Left
            // Member 2 (index 1): Image on Left, Info on Right
            // Member 3 (index 2): Image on Right, Info on Left
            // Member 4 (index 3): Image on Left, Info on Right
            const isImageOnRight = index % 2 === 0;

            return (
              <div
                key={member.id}
                className="bg-zinc-950/85 hover:bg-zinc-900/90 border border-red-950/60 hover:border-red-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Decorative Red Accent Beam */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div
                  className={`flex flex-col ${
                    isImageOnRight ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } items-center gap-8 lg:gap-12`}
                >
                  {/* ── Member Info Column ── */}
                  <div className="flex-1 space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-500/30">
                        {member.badge}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        0{member.id} // BHARAT_CORE
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white group-hover:text-red-400 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-sm sm:text-base text-red-400 font-semibold mt-1">
                        {member.role}
                      </p>
                    </div>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                      {member.bio}
                    </p>

                    {/* Skill/Contribution Tags */}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {member.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-lg"
                        >
                          ✓ {tag}
                        </span>
                      ))}
                    </div>

                    {/* Social Media Links */}
                    <div className="flex items-center gap-3 pt-2">
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} LinkedIn`}
                        className="w-9 h-9 rounded-xl border border-zinc-800 bg-zinc-900/80 flex items-center justify-center text-slate-400 hover:text-white hover:border-red-500 hover:bg-red-950/40 transition-all"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </a>
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} Twitter`}
                        className="w-9 h-9 rounded-xl border border-zinc-800 bg-zinc-900/80 flex items-center justify-center text-slate-400 hover:text-white hover:border-red-500 hover:bg-red-950/40 transition-all"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>
                      <a
                        href={member.social.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} GitHub`}
                        className="w-9 h-9 rounded-xl border border-zinc-800 bg-zinc-900/80 flex items-center justify-center text-slate-400 hover:text-white hover:border-red-500 hover:bg-red-950/40 transition-all"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                      </a>
                    </div>
                  </div>

                  {/* ── Member Image Column ── */}
                  <div className="w-full sm:w-80 lg:w-96 shrink-0 relative">
                    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] bg-zinc-900 border-2 border-red-950/60 group-hover:border-red-500/60 transition-colors shadow-2xl">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Gradient Vignette over photo base */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Name chip at bottom of image */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                        <span className="font-bold text-white drop-shadow-md">
                          {member.name.split(' ')[0]}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-[10px] font-bold text-white shadow">
                          Core Team
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── The Problem & The Mission ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-gradient-to-r from-zinc-950 via-red-950/30 to-zinc-950 border border-red-950/60 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-red-400">
                OUR MISSION
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
                Why We Built Rydely
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                India's highway and expressway infrastructure has grown exponentially over the last five years, yet intercity and local travel remained stuck with high commercial taxi fares or clunky, impersonal fleet rental companies with exorbitant security deposits.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Meanwhile, millions of premium SUVs and cars sit parked in apartment basements for days at a time. Rydely bridges this gap: giving car owners a safe way to generate high-yield passive returns while giving drivers access to immaculate personal cars with doorstep delivery.
              </p>
            </div>

            <div className="space-y-4 bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl">
              <div className="border-b border-zinc-800 pb-3">
                <span className="text-xs font-bold text-white block">🚗 90% Idle Time</span>
                <span className="text-xs text-slate-400">The average private vehicle in India is parked 21+ hours a day.</span>
              </div>
              <div className="border-b border-zinc-800 pb-3">
                <span className="text-xs font-bold text-white block">💸 Rising Vehicle EMIs</span>
                <span className="text-xs text-slate-400">Fuel, insurance, and interest rates make vehicle ownership expensive.</span>
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 block">✨ The Rydely Solution</span>
                <span className="text-xs text-slate-400">P2P car sharing offsets 100% of ownership costs while expanding travel freedom.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 Core Pillars ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-red-400">
            OUR FOUNDATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            The Pillars of Our Community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="bg-zinc-950/80 hover:bg-zinc-900/90 border border-red-950/50 hover:border-red-500/40 p-7 rounded-3xl transition-all duration-300 shadow-xl group"
            >
              <span className="text-3xl mb-4 block">{p.icon}</span>
              <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors mb-2">
                {p.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-normal">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Office & Legal Credibility ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-zinc-950/80 border border-zinc-900 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-mono font-bold text-red-400 tracking-wider">
              REGISTERED INDIAN HEADQUARTERS
            </span>
            <h3 className="text-xl font-bold text-white mt-1 mb-2">
              Rydely Technologies India Pvt. Ltd.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Prestige Tech Park, Outer Ring Road, Marathahalli, Bengaluru, Karnataka 560103.
            </p>
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 font-mono">
              <span>DPIIT #DIPP124802</span>
              <span>·</span>
              <span>CIN: U72900KA2026PTC184920</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Contact Team
            </Link>
            <Link
              to="/cars"
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-red-600/30"
            >
              Explore Cars
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
