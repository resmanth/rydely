import { useSearchParams, Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import xuvImg from '../assets/cars/bmw-offer.png';
import safariImg from '../assets/cars/toyota-offer-2.png';

/**
 * Cars.jsx — Basic placeholder page for Rent a Car / Find Car
 * Member 2 will implement the live fleet catalog and dynamic filters here.
 * Member 1 provides the reusable CarCard component and captures search params passed from Hero.
 */
const sampleCars = [
  {
    id: 'car-1',
    name: 'Mahindra XUV700 AX7L',
    category: 'SUV',
    image: xuvImg,
    price: 3499,
    priceUnit: '/ day',
    location: 'Mumbai · Bandra & BKC',
    rating: 4.96,
    tripsCount: 38,
    hostName: 'Aarav Sharma',
    isSuperhost: true,
    badge: 'POPULAR SUV',
    specs: [
      { label: 'Transmission', val: 'Automatic' },
      { label: 'Fuel', val: 'Diesel Turbo' },
      { label: 'Seats', val: '7 Seater' },
      { label: 'Free KMs', val: '300 km/day' },
    ],
    features: ['Panoramic Sunroof', 'FASTag Preloaded', 'Doorstep Delivery', 'Level-2 ADAS'],
  },
  {
    id: 'car-2',
    name: 'Tata Safari Dark Edition',
    category: 'SUV',
    image: safariImg,
    price: 3299,
    priceUnit: '/ day',
    location: 'Delhi NCR · Cyber City',
    rating: 4.98,
    tripsCount: 52,
    hostName: 'Rohan Deshmukh',
    isSuperhost: true,
    badge: 'TOP RATED',
    specs: [
      { label: 'Transmission', val: 'Automatic' },
      { label: 'Fuel', val: '2.0L Diesel' },
      { label: 'Seats', val: '7 Captain Seats' },
      { label: 'Free KMs', val: '250 km/day' },
    ],
    features: ['Ventilated Seats', 'JBL 9-Speaker Audio', 'FASTag', 'Doorstep Delivery'],
  },
];

const Cars = () => {
  const [searchParams] = useSearchParams();
  const city = searchParams.get('city') || '';
  const pickupDate = searchParams.get('pickupDate') || '';
  const pickupTime = searchParams.get('pickupTime') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const returnTime = searchParams.get('returnTime') || '';
  const category = searchParams.get('category') || '';
  const delivery = searchParams.get('delivery');

  const hasSearchParams = Boolean(city || pickupDate || category);

  return (
    <div className="min-h-screen bg-[#070404] text-white font-['Outfit'] pt-24 sm:pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Page Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-red-400 bg-red-950/60 border border-red-500/30 px-3.5 py-1 rounded-full">
            VEHICLE FLEET · FIND & RENT
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-4 mb-3 tracking-tight">
            Rent a Car · Find Cars
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Browse verified self-drive cars available from local hosts.
          </p>
        </div>

        {/* ── Search Baton Passing Telemetry Banner ── */}
        {hasSearchParams && (
          <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-red-500/30 shadow-lg shadow-red-950/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-red-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SEARCH CRITERIA RECEIVED:</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap text-xs font-semibold text-slate-300">
              {city && (
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                  📍 City: <span className="text-white font-bold">{city}</span>
                </span>
              )}
              {pickupDate && (
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                  🗓️ Trip: <span className="text-white font-bold">{pickupDate} {pickupTime}</span> → <span className="text-white font-bold">{returnDate} {returnTime}</span>
                </span>
              )}
              {category && category !== 'all' && (
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                  🚘 Type: <span className="text-white font-bold uppercase">{category}</span>
                </span>
              )}
              {delivery === 'true' && (
                <span className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg">
                  ⚡ Doorstep Delivery
                </span>
              )}
            </div>
            <Link
              to="/cars"
              className="text-xs text-red-400 hover:text-red-300 underline font-medium"
            >
              Clear
            </Link>
          </div>
        )}

        {/* ── Hand-off Notice for Member 2 ── */}
        <div className="mb-10 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-slate-300 font-bold">Team Hand-off:</span> Fleet catalog and live database filters will be mapped by Member 2. Reusable UI building block <code className="text-red-400 font-mono">CarCard.jsx</code> is integrated below.
          </div>
          <Link to="/" className="text-red-400 hover:text-red-300 font-semibold inline-flex items-center gap-1 shrink-0">
            ← Back to Home
          </Link>
        </div>

        {/* ── Sample Cars Grid Using Reusable CarCard Component ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {sampleCars.map((car) => (
            <CarCard
              key={car.id}
              {...car}
              onBookNow={(booking) => {
                alert(`Booking initiated for ${booking.name} at ${booking.price}/day!`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
