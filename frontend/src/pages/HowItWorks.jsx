import { useState } from 'react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('renter'); // 'renter' | 'host'
  const [carType, setCarType] = useState('mid-suv'); // 'sedan' | 'mid-suv' | 'premium'
  const [daysPerMonth, setDaysPerMonth] = useState(12);

  // Earnings calculation
  const dailyRates = {
    sedan: 1800,
    'mid-suv': 3200,
    premium: 4500,
  };
  const estimatedMonthly = dailyRates[carType] * daysPerMonth;

  const renterSteps = [
    {
      num: '01',
      title: 'Find Your Ideal Car',
      subtitle: 'Filter by city, vehicle type, and doorstep delivery',
      desc: 'Browse hundreds of verified cars listed by local owners across Mumbai, Bengaluru, Delhi NCR, Pune, Goa & more. From rugged Thar 4x4s to luxury Innova Hycross hybrids, choose the exact car you want to drive.',
      icon: '🔍',
    },
    {
      num: '02',
      title: '60-Second DigiLocker KYC',
      subtitle: 'Fast, paperless identity & Driving License verification',
      desc: 'Verify your identity instantly using government-backed DigiLocker. No physical paperwork, no lengthy waiting times, and zero security deposit hassles. Once approved, you can book any car instantly.',
      icon: '🛡️',
    },
    {
      num: '03',
      title: 'Doorstep Delivery or Local Pickup',
      subtitle: 'Meet the host or have the car delivered to your address',
      desc: 'Have the car delivered directly to your home, office, or airport arrival terminal, or meet the host at a convenient local landmark. Do a quick 2-minute condition walkthrough on the app, take the keys, and set off.',
      icon: '🔑',
    },
    {
      num: '04',
      title: 'Drive with Complete Freedom',
      subtitle: '₹20 Lakh insurance coverage on every trip',
      desc: 'Enjoy your road trip with 24/7 roadside assistance and comprehensive damage cover. FASTag expressway tolls and fuel are settled transparently via UPI upon trip completion.',
      icon: '🛣️',
    },
  ];

  const hostSteps = [
    {
      num: '01',
      title: 'List Your Car in 5 Minutes',
      subtitle: 'Share your vehicle details, RC, and photos',
      desc: 'Enter your car make, model, registration number, and clear photos. Set your own daily rental price, daily kilometer limit, and choose your preferred pickup locations.',
      icon: '📝',
    },
    {
      num: '02',
      title: 'Maintain 100% Calendar Control',
      subtitle: 'Rent it out only when you do not need it',
      desc: 'Block out dates when you need your car for personal use. Set availability for weekdays while you work from home, or for periods when you are traveling out of town.',
      icon: '📅',
    },
    {
      num: '03',
      title: 'Safe Handover to Verified Drivers',
      subtitle: 'All renters are Aadhaar & Driving License verified',
      desc: 'Rest easy knowing only identity-checked, licensed drivers can book your car. Rydely provides ₹20 Lakh comprehensive insurance and GPS tracking for complete vehicle protection.',
      icon: '🤝',
    },
    {
      num: '04',
      title: 'Get Paid Directly to Your Bank',
      subtitle: 'Instant UPI payouts after every completed rental',
      desc: 'Your rental earnings are deposited directly into your bank account via UPI within hours of trip completion. Offset your car EMIs, insurance, and maintenance effortlessly.',
      icon: '💰',
    },
  ];

  const faqs = [
    {
      q: 'Is my car safe when I rent it out to someone?',
      a: 'Yes, 100%. Every single driver must pass a mandatory DigiLocker Aadhaar & Driving License background check before booking. Additionally, every rental is protected by a ₹20 Lakh comprehensive insurance policy covering accidental damage and third-party liabilities.',
    },
    {
      q: 'Do renters need to pay a heavy security deposit?',
      a: 'Unlike traditional rental agencies that block ₹10,000–₹25,000 on your credit card, Rydely uses algorithmic risk scoring and DigiLocker KYC to offer zero-deposit rentals on verified profiles.',
    },
    {
      q: 'What is the fuel and FASTag policy?',
      a: 'Cars are provided with a full or documented fuel level and preloaded FASTag. Renters simply return the car with the same fuel level, and toll expenses incurred during the trip are settled automatically via UPI.',
    },
    {
      q: 'How much can I earn as a car owner (host)?',
      a: 'Hosts renting out mid-size SUVs (like Creta or Thar) typically earn ₹35,000–₹50,000 per month by sharing their vehicle for 10–14 days. Premium 7-seaters like Innova Hycross or XUV700 earn upwards of ₹65,000–₹85,000/month.',
    },
    {
      q: 'What if the car breaks down during a trip?',
      a: 'Every Rydely rental includes 24/7 National Roadside Assistance (RSA) across all Indian National Highways and cities. Our support team dispatches a service technician immediately or arranges an alternative vehicle.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070404] text-white font-['Outfit'] pt-24 sm:pt-28 pb-16">
      
      {/* ── Page Header Hero ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center mb-16">
        {/* Crimson Ambient Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.22) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        <div className="relative z-10">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-red-400 mb-3 px-3.5 py-1 rounded-full bg-red-950/60 border border-red-500/30">
            🇮🇳 Peer-to-Peer Car Sharing
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
            How Rydely Works
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether you want to rent a verified self-drive car or earn monthly passive income from your parked vehicle, Rydely makes car sharing simple, safe, and transparent.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex items-center bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-2xl mt-8 shadow-xl">
            <button
              type="button"
              onClick={() => setActiveTab('renter')}
              className={`px-6 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'renter'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/35'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🚗</span>
              <span>I Want to Rent a Car</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('host')}
              className={`px-6 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'host'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/35'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>💼</span>
              <span>I Want to List My Car (Host)</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Step-by-Step Flow ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(activeTab === 'renter' ? renterSteps : hostSteps).map((s) => (
            <div
              key={s.num}
              className="bg-zinc-950/80 hover:bg-zinc-900/90 border border-red-950/50 hover:border-red-500/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-xl hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{s.icon}</span>
                  <span className="font-mono text-xs font-black text-red-500 bg-red-950/50 border border-red-500/30 px-2.5 py-1 rounded-full">
                    STEP {s.num}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors mb-1.5">
                  {s.title}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mb-3">
                  {s.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  {s.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <span>✓</span>
                <span>Verified Safe & Instant</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive Host Earnings Calculator (Visible in Host Tab or as preview) ── */}
      <section id="calculator" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-gradient-to-r from-zinc-950 via-red-950/40 to-zinc-950 border border-red-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-500/30">
              Host Calculator
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3 mb-2">
              Calculate Your Monthly Car Earnings
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              See how much your idle car can generate when listed for self-drive rent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Controls */}
            <div className="space-y-6">
              {/* Car Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Your Car Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCarType('sedan')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      carType === 'sedan'
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                        : 'bg-zinc-900 border-zinc-800 text-slate-300 hover:border-zinc-700'
                    }`}
                  >
                    <span className="block text-sm font-bold">Hatch / Sedan</span>
                    <span className="block text-[10px] text-red-200">~₹1,800/d</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCarType('mid-suv')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      carType === 'mid-suv'
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                        : 'bg-zinc-900 border-zinc-800 text-slate-300 hover:border-zinc-700'
                    }`}
                  >
                    <span className="block text-sm font-bold">SUV / Thar</span>
                    <span className="block text-[10px] text-red-200">~₹3,200/d</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCarType('premium')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      carType === 'premium'
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                        : 'bg-zinc-900 border-zinc-800 text-slate-300 hover:border-zinc-700'
                    }`}
                  >
                    <span className="block text-sm font-bold">Luxury / Hycross</span>
                    <span className="block text-[10px] text-red-200">~₹4,500/d</span>
                  </button>
                </div>
              </div>

              {/* Days Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Days Rented Per Month
                  </span>
                  <span className="text-sm font-black text-red-400 bg-red-950/60 px-2.5 py-0.5 rounded-full border border-red-500/30">
                    {daysPerMonth} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="28"
                  value={daysPerMonth}
                  onChange={(e) => setDaysPerMonth(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>2 days (weekends only)</span>
                  <span>14 days</span>
                  <span>28 days (full month)</span>
                </div>
              </div>
            </div>

            {/* Results Display Box */}
            <div className="bg-zinc-900/90 border border-red-500/30 rounded-2xl p-6 sm:p-8 text-center flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                  Estimated Monthly Income
                </span>
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-red-100 to-red-400 drop-shadow-[0_0_20px_rgba(255,53,53,0.4)]">
                  ₹{estimatedMonthly.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold block mt-2">
                  ✓ Covers monthly EMI, service, and insurance
                </span>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800">
                <Link
                  to="/offer-ride"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-600/30 active:scale-95"
                >
                  <span>List Your Car & Start Earning</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-red-400">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-6 transition-all hover:border-red-500/30"
            >
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-red-500 font-mono">Q.</span> {f.q}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-normal pl-6">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom Call to Action ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-red-950/80 via-red-900/60 to-rose-950/80 border border-red-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
            Ready to Experience Peer-to-Peer Mobility?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
            Join thousands of verified owners and travelers across India. Rent a self-drive car or list your vehicle in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/cars"
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg active:scale-95"
            >
              Browse Cars for Rent
            </Link>
            <Link
              to="/offer-ride"
              className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-600/30 active:scale-95"
            >
              List Your Car
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HowItWorks;
