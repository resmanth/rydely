/**
 * Hero.jsx
 *
 * The hero / landing section displayed at the top of the homepage.
 * Features:
 *   - Full-screen background video with a poster image fallback
 *   - Gradient overlays for text readability and atmosphere
 *   - An anchor point where the ScrollLogo component is rendered by its parent
 *   - Headline + subtitle about peer-to-peer car rental
 *   - A slot for a 3D car model rendered by Three.js (car-slot-1)
 *   - A telemetry stats strip (host earnings, damage cover, verification, rates)
 *   - A floating search form with city input, pickup/return date & time, doorstep toggle,
 *     vehicle category filter pills, and a "Find Available Cars" submit button
 *   - A quick-access strip of popular cities (Mumbai, Bengaluru, Delhi NCR, Goa)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgVideo from '../assets/bg.mp4';
import sunsetRoad from '../assets/sunset-road.jpg';

/**
 * getDateOffset(days)
 * Returns a date string in YYYY-MM-DD format, offset by `days` from today.
 * Used to set default pickup (tomorrow) and return (4 days from now) dates.
 */
const getDateOffset = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const Hero = () => {
  const navigate = useNavigate();

  // --- Search Form State ---
  // Each piece of state corresponds to one field in the search form
  const [city, setCity] = useState('');                                    // City or location text input
  const [pickupDate, setPickupDate] = useState(() => getDateOffset(1));    // Default: tomorrow
  const [pickupTime, setPickupTime] = useState('10:00');                   // Default: 10:00 AM
  const [returnDate, setReturnDate] = useState(() => getDateOffset(4));    // Default: 4 days from now
  const [returnTime, setReturnTime] = useState('18:00');                   // Default: 6:00 PM
  const [doorstepDelivery, setDoorstepDelivery] = useState(true);          // Whether user wants car delivered
  const [selectedCategory, setSelectedCategory] = useState('all');         // 'all' | 'suv' | 'luxury' | 'instant'

  /**
   * searchCars(searchCity)
   * Validates the search dates and navigates to the /cars page with all
   * search parameters as URL query strings.
   * Can accept an explicit city (used by the popular cities buttons).
   */
  const searchCars = (searchCity = city) => {
    const pickupDateTime = `${pickupDate}T${pickupTime}`;
    const returnDateTime = `${returnDate}T${returnTime}`;

    // Validation: pickup date must not be in the past
    if (pickupDate < getDateOffset(0)) {
      alert('Pickup date cannot be in the past.');
      return;
    }

    // Validation: return must be after pickup
    if (returnDateTime <= pickupDateTime) {
      alert('Return date and time must be after pickup.');
      return;
    }

    // Build the query string from all form fields and navigate to the car listing page
    const query = new URLSearchParams({
      city: searchCity.trim(),
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      delivery: String(doorstepDelivery),
      category: selectedCategory,
    }).toString();

    navigate(`/cars?${query}`);
  };

  // Form submit handler — prevents default form submission and calls searchCars
  const handleSearch = (e) => {
    e.preventDefault();
    searchCars();
  };

  return (
    <section className="relative min-h-[110vh] flex flex-col justify-between overflow-hidden bg-[#070404] font-['Outfit']">

      {/* --- LAYER 1: Background Video --- */}
      {/* Autoplaying, looping, muted video covering the entire section.
          Falls back to the sunsetRoad poster image if the video can't load. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={sunsetRoad}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-65"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
      </div>

      {/* --- Atmospheric Gradient Overlays --- */}
      {/* Multiple gradient layers stacked on top of the video to darken the edges
          and make the white text readable against the video background. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-[#070404] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/50 pointer-events-none" />
      {/* A subtle red radial glow placed behind the hero content area */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          top: '32%',
          width: '85%',
          height: '280px',
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(180, 20, 20, 0.32) 0%, rgba(220, 38, 38, 0.12) 40%, transparent 80%)',
          filter: 'blur(40px)',
        }}
      />

      {/* --- LAYER 2: Hero Content --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 flex flex-col flex-1 justify-between">

        {/* --- Logo Anchor Point --- */}
        {/* The ScrollLogo component uses this element as its "hero position" target.
            When the user is at the top of the page, the logo sits here; on scroll,
            it animates up into the navbar-logo-dock. */}
        <div
          id="hero-logo-anchor"
          className="relative w-full flex items-center justify-center h-28 sm:h-36 pointer-events-none mt-2 sm:mt-4"
        >
          {/* Red glowing halo behind the logo position */}
          <div
            className="absolute w-80 h-28 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 53, 53, 0.32) 0%, transparent 70%)',
              filter: 'blur(24px)',
            }}
          />
        </div>

        {/* --- Headline & Subtitle --- */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mt-2 mb-2">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            Rent Cars Directly from{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-100 to-red-500">
              Local Owners
            </span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium max-w-lg drop-shadow-md">
            India's self-drive car rental marketplace. Zero deposit hassles · Comprehensive insurance · Doorstep delivery in Mumbai, Bengaluru, Delhi NCR, Pune & Goa
          </p>
        </div>

        {/* --- 3D Car Display Slot --- */}
        {/* This empty div is a mount target for a Three.js-rendered 3D car model.
            The parent page injects the car model into this element by its ID. */}
        <div className="relative w-full max-w-6xl mx-auto my-1">
          <div id="car-slot-1" className="relative w-full h-[280px] sm:h-[350px] lg:h-[380px] pointer-events-none" />

          {/* --- Telemetry Stats Strip --- */}
          {/* Four key platform stats displayed in a row under the 3D car */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pb-3 pt-1 text-center font-['Outfit']">
            <div>
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">HOST EARNINGS</span>
              <span className="text-base sm:text-xl font-black text-[#ff3535] drop-shadow-[0_0_15px_rgba(255,53,53,0.4)]">UP TO ₹80K/MO</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">DAMAGE COVER</span>
              <span className="text-base sm:text-xl font-black text-[#ff3535] drop-shadow-[0_0_15px_rgba(255,53,53,0.4)]">₹20 LAKH</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">VERIFICATION</span>
              <span className="text-base sm:text-xl font-black text-[#ff3535] drop-shadow-[0_0_15px_rgba(255,53,53,0.4)]">100% DIGILOCKER</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">RENTAL RATES</span>
              <span className="text-base sm:text-xl font-black text-[#ff3535] drop-shadow-[0_0_15px_rgba(255,53,53,0.4)]">FROM ₹1,499/DAY</span>
            </div>
          </div>
        </div>

        {/* --- Floating Search Form --- */}
        {/* The main car search console. Users fill in city, dates, times, delivery
            preference, and vehicle category, then hit "Find Available Cars". */}
        <div className="relative w-full max-w-6xl mx-auto mt-2 sm:mt-0">
          <form
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.45)] border border-white/70 text-slate-800 transition-all"
          >
            {/* --- Top Grid: Location & Date Inputs --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 pb-4 border-b border-slate-100">

              {/* --- 1. City / Pickup Location Input --- */}
              <div className="flex flex-col justify-between bg-slate-50/80 hover:bg-slate-50 rounded-xl p-3 border border-slate-200/80 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    City / Location
                  </span>
                  {/* Doorstep Delivery Toggle — small switch in the city input card */}
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-600 font-medium">
                    <span>Doorstep delivery?</span>
                    <button
                      type="button"
                      onClick={() => setDoorstepDelivery(!doorstepDelivery)}
                      className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        doorstepDelivery ? 'bg-red-600' : 'bg-slate-300'
                      }`}
                      aria-label="Toggle doorstep delivery"
                    >
                      <span
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          doorstepDelivery ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  {/* Location pin icon */}
                  <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Bengaluru, Delhi NCR, Pune, Goa"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* --- 2. Pickup Date & Time Input --- */}
              <div className="flex flex-col justify-between bg-slate-50/80 hover:bg-slate-50 rounded-xl p-3 border border-slate-200/80 transition-colors">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Trip Starts (Date & Time)
                </div>
                <div className="flex items-center gap-2">
                  {/* Calendar icon */}
                  <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    min={getDateOffset(0)}
                    value={pickupDate}
                    onChange={(e) => {
                      const nextDate = e.target.value;
                      setPickupDate(nextDate);

                      // If the return date is now before the new pickup date, auto-correct it
                      if (returnDate < nextDate) {
                        setReturnDate(nextDate);
                      }
                    }}
                    className="bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-medium text-slate-600 focus:outline-none cursor-pointer border-l border-slate-200 pl-2"
                  />
                </div>
              </div>

              {/* --- 3. Return Date & Time Input --- */}
              <div className="flex flex-col justify-between bg-slate-50/80 hover:bg-slate-50 rounded-xl p-3 border border-slate-200/80 transition-colors">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Trip Ends (Date & Time)
                </div>
                <div className="flex items-center gap-2">
                  {/* Calendar icon */}
                  <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    min={pickupDate || getDateOffset(0)}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  />
                  <input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-medium text-slate-600 focus:outline-none cursor-pointer border-l border-slate-200 pl-2"
                  />
                </div>
              </div>

              {/* --- 4. "Own a Car?" Callout Card --- */}
              {/* A small promotional card encouraging car owners to list their cars */}
              <div className="flex flex-col justify-between bg-red-50/70 hover:bg-red-50 rounded-xl p-3 border border-red-200/80 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">
                    Own a Car?
                  </span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                    Earn Money
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-600 leading-tight">
                    Rent your idle car to verified guests
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/offer-ride')}
                    className="text-xs font-bold text-red-600 hover:text-red-700 underline shrink-0 cursor-pointer ml-2"
                  >
                    List Car →
                  </button>
                </div>
              </div>

            </div>

            {/* --- Bottom Row: Category Filter Pills + Search Button --- */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
              
              {/* Vehicle category filter pills — selecting one highlights it red */}
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-400 mr-1">Vehicle Type:</span>
                
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  All Vehicles
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('suv')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === 'suv'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  🚙 SUVs & 4x4s
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('luxury')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === 'luxury'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  ✨ Luxury & Hybrids
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('instant')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === 'instant'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  ⚡ Instant Booking
                </button>
              </div>

              {/* Search Submit Button */}
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-600/35 hover:shadow-red-500/45 transition-all cursor-pointer shrink-0 active:scale-[0.98]"
              >
                <span>Find Available Cars</span>
                {/* Right arrow icon */}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

            </div>

          </form>

          {/* --- Popular Cities Quick Strip --- */}
          {/* Desktop-only row of clickable city buttons. Clicking one sets the city
              and immediately triggers a search for that city. */}
          <div className="hidden md:flex items-center justify-center gap-2 mt-3 text-[11px] text-white/80 font-medium">
            <span className="text-red-400 font-semibold">Popular Cities:</span>
            <button
              type="button"
              onClick={() => { setCity('Mumbai'); searchCars('Mumbai'); }}
              className="hover:text-white bg-black/50 hover:bg-red-950/60 px-3 py-1 rounded-full border border-red-500/20 hover:border-red-500/40 transition-colors"
            >
              Mumbai (from ₹1,800/d)
            </button>
            <button
              type="button"
              onClick={() => { setCity('Bengaluru'); searchCars('Bengaluru'); }}
              className="hover:text-white bg-black/50 hover:bg-red-950/60 px-3 py-1 rounded-full border border-red-500/20 hover:border-red-500/40 transition-colors"
            >
              Bengaluru (from ₹1,600/d)
            </button>
            <button
              type="button"
              onClick={() => { setCity('Delhi NCR'); searchCars('Delhi NCR'); }}
              className="hover:text-white bg-black/50 hover:bg-red-950/60 px-3 py-1 rounded-full border border-red-500/20 hover:border-red-500/40 transition-colors"
            >
              Delhi NCR (from ₹1,500/d)
            </button>
            <button
              type="button"
              onClick={() => { setCity('Goa'); searchCars('Goa'); }}
              className="hover:text-white bg-black/50 hover:bg-red-950/60 px-3 py-1 rounded-full border border-red-500/20 hover:border-red-500/40 transition-colors"
            >
              Goa (from ₹2,200/d)
            </button>
          </div>
        </div>

      </div>

    </section>
  );
};

export default Hero;
