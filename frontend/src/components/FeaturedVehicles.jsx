// ============================================================
// FeaturedVehicles.jsx — Scrollytelling Top Vehicles Showcase
// ------------------------------------------------------------
// This section displays top listed rental vehicles on the homepage.
//
// Dynamic Data Pipeline:
//   - Fetches live listed cars from the backend availability API
//     (using checkAvailability across configured cities).
//   - If listed cars exist in the database, maps the first 4 real
//     cars (e.g. Mahindra XUV700, Hyundai Aura, Ertiga, Alto, etc.)
//     into the 4 cards.
//   - Falls back gracefully to curated default vehicles if the database
//     is empty or the server is starting up.
//
// Layout Architecture:
//   - 3-Column Grid on desktop:
//       Left 2 cards (Cards 01 & 02)
//       Center `#car-slot-2` (docking target for the 3D top-down car)
//       Right 2 cards (Cards 03 & 04)
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carsApi } from '../services/api';
import { mapCar } from '../services/carMapper';
import { allCityValues } from '../data/cities';
import innovaImg from '../assets/cars/toyota-offer.png';
import safariImg from '../assets/cars/toyota-offer-2.png';
import xuvImg from '../assets/cars/bmw-offer.png';
import tharImg from '../assets/cars/nissan-offer.png';

// Fallback curated vehicles (used only if database has fewer than 4 listed cars)
const fallbackVehicles = [
  {
    num: '01',
    id: 'fallback-1',
    title: 'Mahindra XUV700 AX7L',
    subtitle: 'mStallion Turbo · 200 PS · Automatic',
    location: 'Delhi NCR',
    img: xuvImg,
    desc: 'Flagship 7-seater SUV with panoramic Skyroof, Level-2 ADAS, and Sony 3D audio. Perfect for family outstation trips and business travel.',
    specs: [
      { label: 'Transmission', val: 'Automatic' },
      { label: 'Daily Rate', val: '₹3,500 / day' },
      { label: 'Fuel', val: 'Petrol' },
      { label: 'Seating', val: '5 Seater' },
    ],
  },
  {
    num: '02',
    id: 'fallback-2',
    title: 'Tata Safari Dark Edition',
    subtitle: 'Kryotec 2.0L Diesel · 170 PS',
    location: 'Delhi NCR',
    img: safariImg,
    desc: 'Built on Land Rover D8 platform with ventilated captain seats, terrain response, and 5-star Bharat NCAP safety. Clean self-drive rental.',
    specs: [
      { label: 'Transmission', val: 'Automatic' },
      { label: 'Daily Rate', val: '₹3,299 / day' },
      { label: 'Fuel', val: 'Diesel' },
      { label: 'Seating', val: '7 Seater' },
    ],
  },
  {
    num: '03',
    id: 'fallback-3',
    title: 'Toyota Innova Hycross ZX',
    subtitle: 'Self-Charging Hybrid · 186 PS',
    location: 'Bengaluru',
    img: innovaImg,
    desc: 'The undisputed king of comfort. Powered ottoman lounge seating, 21.1 km/l hybrid fuel efficiency, whisper-quiet cabin, and zero deposit.',
    specs: [
      { label: 'Transmission', val: 'e-CVT Hybrid' },
      { label: 'Daily Rate', val: '₹3,899 / day' },
      { label: 'Fuel', val: 'Hybrid' },
      { label: 'Seating', val: '7 Seater' },
    ],
  },
  {
    num: '04',
    id: 'fallback-4',
    title: 'Mahindra Thar Earth 4x4',
    subtitle: 'mStallion 4WD · Convertible Soft-Top',
    location: 'Goa',
    img: tharImg,
    desc: 'Iconic open-air off-road 4x4 with 226mm ground clearance and shift-on-the-fly 4WD. The most popular self-drive rental for beach and Ghat drives.',
    specs: [
      { label: 'Transmission', val: 'Manual' },
      { label: 'Daily Rate', val: '₹3,199 / day' },
      { label: 'Fuel', val: 'Diesel' },
      { label: 'Seating', val: '4 Seater' },
    ],
  },
];

const FeaturedVehicles = () => {
  const [displayVehicles, setDisplayVehicles] = useState(fallbackVehicles);

  useEffect(() => {
    let isCancelled = false;

    const loadListedCars = async () => {
      try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 3);

        const pickupDate = `${tomorrow.toISOString().slice(0, 10)}T10:00`;
        const returnDate = `${dayAfter.toISOString().slice(0, 10)}T18:00`;

        const citiesList = allCityValues();
        const settledResults = await Promise.allSettled(
          citiesList.map((city) =>
            carsApi.checkAvailability({
              location: city,
              pickupDate,
              returnDate,
            })
          )
        );

        const fetchedCars = [];
        for (const res of settledResults) {
          if (res.status === 'fulfilled' && res.value?.availableCars) {
            fetchedCars.push(...res.value.availableCars.map(mapCar));
          }
        }

        if (isCancelled || fetchedCars.length === 0) return;

        // Transform real database cars into the featured card format
        const formattedLiveCars = fetchedCars.slice(0, 4).map((car, index) => {
          const numberStr = `0${index + 1}`;
          return {
            num: numberStr,
            id: car.id,
            title: car.name,
            subtitle: `${car.specs?.find(s => s.label === 'Fuel')?.val || 'Petrol'} · ${car.specs?.find(s => s.label === 'Transmission')?.val || 'Automatic'} · ${car.category?.toUpperCase() || 'SUV'}`,
            location: car.location,
            img: car.image || xuvImg,
            desc: car.description || 'Verified private vehicle available for self-drive rental with comprehensive insurance and zero deposit.',
            specs: [
              { label: 'Transmission', val: car.specs?.find(s => s.label === 'Transmission')?.val || 'Manual' },
              { label: 'Daily Rate', val: `₹${(car.price || 0).toLocaleString('en-IN')} / day` },
              { label: 'Fuel', val: car.specs?.find(s => s.label === 'Fuel')?.val || 'Petrol' },
              { label: 'Seating', val: car.specs?.find(s => s.label === 'Seats')?.val || '5 Seater' },
            ],
            rawCar: car,
          };
        });

        // Fill remaining slots from fallback if fewer than 4 cars in DB
        while (formattedLiveCars.length < 4) {
          const fallbackIndex = formattedLiveCars.length;
          formattedLiveCars.push(fallbackVehicles[fallbackIndex]);
        }

        setDisplayVehicles(formattedLiveCars);
      } catch (err) {
        console.error('Failed to load live listed cars for featured section:', err);
      }
    };

    loadListedCars();

    return () => {
      isCancelled = true;
    };
  }, []);

  const leftCards = displayVehicles.slice(0, 2);
  const rightCards = displayVehicles.slice(2, 4);

  return (
    <section
      id="features-section"
      className="relative min-h-screen py-24 lg:py-32 bg-[#070404] text-white font-['Outfit'] overflow-hidden border-t border-red-950/40"
    >
      {/* Studio Crimson Radial Lighting Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[750px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(140, 20, 20, 0.32) 0%, rgba(80, 10, 10, 0.12) 50%, transparent 80%)',
          filter: 'blur(50px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* --- Section Header --- */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-[11px] font-semibold tracking-widest uppercase mb-3 shadow-md shadow-red-950/40">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            🇮🇳 02 / Verified Host Fleet
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Featured Cars for Rent
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-normal">
            Rent self-drive cars directly from verified private owners with insurance, zero security deposit, and doorstep delivery.
          </p>
        </div>

        {/* ── 3-Column Grid: [Left 2 Cards] | [#car-slot-2 (Top-Down 3D Car Target)] | [Right 2 Cards] ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left Column (Vehicles 01 & 02) */}
          <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
            {leftCards.map((car) => (
              <div
                key={car.num}
                className="group relative bg-white/95 hover:bg-white backdrop-blur-xl border-t-[3px] border-t-[#ff3535] border border-white/80 hover:border-red-400/60 rounded-3xl p-6 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:shadow-[0_25px_60px_rgba(220,38,38,0.25)] hover:-translate-y-1 flex flex-col justify-between text-slate-900 overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-black tracking-widest text-[#ff3535]">
                      {car.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 truncate max-w-[200px]">
                      📍 {car.location}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-0.5 truncate">
                    {car.title}
                  </h3>

                  <p className="text-[11px] font-semibold text-slate-500 mb-2 truncate">
                    {car.subtitle}
                  </p>

                  {/* Vehicle Cutout Image */}
                  <div className="w-full h-28 flex items-center justify-center my-1 overflow-hidden">
                    <img
                      src={car.img}
                      alt={car.title}
                      className="max-h-full max-w-[85%] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {car.desc}
                  </p>
                </div>

                {/* Technical Specs 4-cell Grid */}
                <div className="grid grid-cols-2 gap-2 py-3 border-t border-slate-100 mb-4 text-left">
                  {car.specs.map((spec) => (
                    <div key={spec.label} className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold truncate">
                        {spec.label}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        {spec.val}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  to={car.id?.startsWith('fallback') ? `/cars?car=${encodeURIComponent(car.title)}` : `/cars/${car.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-red-500/25 cursor-pointer"
                >
                  <span>Rent This Car</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            ))}
          </div>

          {/* Center Column: Scrollytelling Docking Target for Global3DCar (#car-slot-2) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 relative">
            <div
              id="car-slot-2"
              className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] pointer-events-none"
            />
          </div>

          {/* Right Column (Vehicles 03 & 04) */}
          <div className="lg:col-span-4 flex flex-col gap-6 order-3">
            {rightCards.map((car) => (
              <div
                key={car.num}
                className="group relative bg-white/95 hover:bg-white backdrop-blur-xl border-t-[3px] border-t-[#ff3535] border border-white/80 hover:border-red-400/60 rounded-3xl p-6 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:shadow-[0_25px_60px_rgba(220,38,38,0.25)] hover:-translate-y-1 flex flex-col justify-between text-slate-900 overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-black tracking-widest text-[#ff3535]">
                      {car.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 truncate max-w-[200px]">
                      📍 {car.location}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-0.5 truncate">
                    {car.title}
                  </h3>

                  <p className="text-[11px] font-semibold text-slate-500 mb-2 truncate">
                    {car.subtitle}
                  </p>

                  {/* Vehicle Cutout Image */}
                  <div className="w-full h-28 flex items-center justify-center my-1 overflow-hidden">
                    <img
                      src={car.img}
                      alt={car.title}
                      className="max-h-full max-w-[85%] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {car.desc}
                  </p>
                </div>

                {/* Technical Specs 4-cell Grid */}
                <div className="grid grid-cols-2 gap-2 py-3 border-t border-slate-100 mb-4 text-left">
                  {car.specs.map((spec) => (
                    <div key={spec.label} className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold truncate">
                        {spec.label}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        {spec.val}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  to={car.id?.startsWith('fallback') ? `/cars?car=${encodeURIComponent(car.title)}` : `/cars/${car.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-red-500/25 cursor-pointer"
                >
                  <span>Rent This Car</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            ))}
          </div>

        </div>

        {/* --- Explore Full Catalog Call-to-Action --- */}
        <div className="mt-14 text-center">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-red-950/60 hover:bg-red-600 text-white border border-red-500/40 hover:border-red-400 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-red-950/50 active:scale-95"
          >
            <span>Browse All Cars Available for Rent</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedVehicles;
