import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CarCard.jsx
 *
 * Reusable Car Card component for Member 2 to map out cars on /cars.
 *
 * Props:
 * @param {string} id - Unique vehicle ID
 * @param {string} name - Vehicle model & variant (e.g. "Mahindra XUV700 AX7L")
 * @param {string} category - Vehicle type ("SUV", "Sedan", "Luxury", "4x4", "Hatchback")
 * @param {string} image - Image URL or imported asset
 * @param {number|string} price - Daily rental rate (e.g. 3499 or "₹3,499")
 * @param {string} priceUnit - Price cadence (default: "/ day")
 * @param {string} location - City / neighborhood (e.g. "Mumbai · Bandra West")
 * @param {number} rating - Host / car rating (e.g. 4.95)
 * @param {number|string} tripsCount - Completed trips (e.g. 42)
 * @param {string} hostName - Host name (e.g. "Aarav S.")
 * @param {boolean} isSuperhost - Whether host has superhost badge
 * @param {object|array} specs - Vehicle technical specs (transmission, fuel, seats, freeKms)
 * @param {array} features - List of features (e.g. ["Sunroof", "FASTag", "Doorstep Delivery"])
 * @param {string} badge - Top highlight pill (e.g. "POPULAR", "INSTANT BOOK", "NEW")
 * @param {boolean} isAvailable - Availability state (default: true)
 * @param {function} onBookNow - Callback when Book Now button is clicked
 */
const CarCard = ({
  id = 'car-1',
  name = 'Mahindra XUV700 AX7L',
  category = 'SUV',
  image = '',
  price = 3499,
  priceUnit = '/ day',
  location = 'Mumbai · Bandra West',
  rating = 4.95,
  tripsCount = 38,
  hostName = 'Verified Host',
  isSuperhost = true,
  specs = [
    { label: 'Transmission', val: 'Automatic' },
    { label: 'Fuel', val: 'Diesel Turbo' },
    { label: 'Seats', val: '7 Seater' },
    { label: 'Free KMs', val: '300 km/day' },
  ],
  features = ['FASTag Enabled', 'Sunroof', 'Doorstep Delivery'],
  badge = '',
  isAvailable = true,
  onBookNow,
}) => {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  const formattedPrice =
    typeof price === 'number'
      ? `₹${price.toLocaleString('en-IN')}`
      : String(price).startsWith('₹')
      ? price
      : `₹${price}`;

  const handleBook = () => {
    if (onBookNow) {
      onBookNow({ id, name, price, location });
    } else {
      navigate(`/cars?carId=${encodeURIComponent(id)}&carName=${encodeURIComponent(name)}`);
    }
  };

  // Normalize specs if provided as an object instead of array
  const normalizedSpecs = Array.isArray(specs)
    ? specs
    : Object.entries(specs).map(([label, val]) => ({ label, val }));

  return (
    <div className="group relative bg-zinc-950/85 hover:bg-zinc-900/95 backdrop-blur-xl border border-red-950/50 hover:border-red-500/50 rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-xl hover:shadow-[0_20px_40px_rgba(220,38,38,0.18)] hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden text-white font-['Outfit'] select-none">
      
      {/* Decorative Red Top Glow Bar on Hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* ── CARD TOP: Location & Badges ── */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Location Pill */}
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-zinc-900/90 border border-zinc-800 px-2.5 py-1 rounded-full truncate max-w-[200px]">
            <span className="text-red-400">📍</span>
            <span className="truncate">{location}</span>
          </span>

          {/* Highlight Badge */}
          {badge ? (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 shadow-sm shadow-red-600/40">
              {badge}
            </span>
          ) : isSuperhost ? (
            <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
              ★ Superhost
            </span>
          ) : (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {category}
            </span>
          )}
        </div>

        {/* ── CAR IMAGE STAGE ── */}
        <div className="relative w-full h-36 sm:h-44 flex items-center justify-center my-2 overflow-hidden rounded-2xl bg-gradient-to-b from-white/5 to-transparent">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute w-36 h-20 bg-red-600/15 rounded-full blur-2xl pointer-events-none group-hover:bg-red-600/25 transition-all" />

          {image ? (
            <img
              src={image}
              alt={name}
              onLoad={() => setImgLoaded(true)}
              className={`max-h-full max-w-[90%] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] group-hover:scale-108 transition-all duration-500 ease-out ${
                imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              loading="lazy"
            />
          ) : (
            <div className="text-slate-600 text-xs font-mono">NO IMAGE AVAILABLE</div>
          )}
        </div>

        {/* ── TITLE & HOST RATING ── */}
        <div className="mt-2 mb-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-red-400 transition-colors leading-tight line-clamp-1">
                {name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Hosted by <span className="text-slate-300 font-semibold">{hostName}</span>
              </p>
            </div>

            {/* Rating Stars & Trip Count */}
            <div className="flex items-center gap-1 bg-zinc-900/80 px-2 py-1 rounded-lg border border-zinc-800 shrink-0">
              <span className="text-amber-400 text-xs">★</span>
              <span className="text-xs font-bold text-white">{rating}</span>
              <span className="text-[10px] text-slate-500">({tripsCount})</span>
            </div>
          </div>
        </div>

        {/* ── TECHNICAL SPECS 4-CELL GRID ── */}
        <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-zinc-800/70 mb-3 text-left">
          {normalizedSpecs.slice(0, 4).map((s, i) => (
            <div key={i} className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-2.5 py-1.5">
              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                {s.label}
              </span>
              <span className="text-xs font-bold text-white truncate block">
                {s.val}
              </span>
            </div>
          ))}
        </div>

        {/* Features Chips */}
        {features && features.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {features.slice(0, 3).map((f, i) => (
              <span
                key={i}
                className="text-[10px] text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
              >
                ✓ {f}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── CARD FOOTER: Price & Book Now CTA ── */}
      <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-3">
        {/* Price Display */}
        <div>
          <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-400">
            Self-Drive Price
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-[#ff3535] drop-shadow-[0_0_12px_rgba(255,53,53,0.35)]">
              {formattedPrice}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {priceUnit}
            </span>
          </div>
        </div>

        {/* Book Now Button */}
        <button
          type="button"
          onClick={handleBook}
          disabled={!isAvailable}
          className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 shadow-md ${
            isAvailable
              ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/30 hover:shadow-red-500/40'
              : 'bg-zinc-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>{isAvailable ? 'Book Now' : 'Reserved'}</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

    </div>
  );
};

export default CarCard;
