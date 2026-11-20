import { useState, useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { carsApi, bookingApi } from '../services/api';
import { mapCar } from '../services/carMapper';
import { allCityValues } from '../data/cities';

const getDateOffset = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
};

const CarDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated } = useAuth();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    // Dates from URL
    const pickupDate = searchParams.get('pickupDate') || getDateOffset(1);
    const pickupTime = searchParams.get('pickupTime') || '10:00';
    const returnDate = searchParams.get('returnDate') || getDateOffset(2);
    const returnTime = searchParams.get('returnTime') || '18:00';

    const pickupISO = `${pickupDate}T${pickupTime}`;
    const returnISO = `${returnDate}T${returnTime}`;

    useEffect(() => {
        let isCancelled = false;

        const executeLoad = async () => {
            if (location.state?.car) {
                if (!isCancelled) {
                    setCar(location.state.car);
                    setLoading(false);
                }
                return;
            }

            try {
                const cached = sessionStorage.getItem(`rydely-car-${id}`);
                if (cached && !isCancelled) {
                    setCar(JSON.parse(cached));
                    setLoading(false);
                    return;
                }
            } catch { /* ignore */ }

            try {
                const cities = allCityValues();
                const results = await Promise.allSettled(
                    cities.map((city) =>
                        carsApi.checkAvailability({
                            location: city,
                            pickupDate: pickupISO,
                            returnDate: returnISO,
                        })
                    )
                );
                let foundCar = null;
                for (const result of results) {
                    if (result.status === 'fulfilled' && result.value?.availableCars) {
                        const match = result.value.availableCars.find((carItem) => carItem._id === id);
                        if (match) {
                            foundCar = mapCar(match);
                            break;
                        }
                    }
                }
                if (!isCancelled) {
                    setCar(foundCar);
                }
            } catch {
                if (!isCancelled) {
                    setCar(null);
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        executeLoad();

        return () => {
            isCancelled = true;
        };
    }, [id, location.state, pickupISO, returnISO]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#070404] text-white flex flex-col items-center justify-center px-4 pt-24">
                <div className="text-5xl mb-5 animate-pulse">🚘</div>
                <h1 className="text-2xl font-black mb-3">Loading vehicle...</h1>
                <p className="text-slate-400 text-sm">Fetching details, please wait.</p>
            </div>
        );
    }

    // Not found
    if (!car) {
        return (
            <div className="min-h-screen bg-[#070404] text-white flex flex-col items-center justify-center px-4 pt-24">
                <div className="text-5xl mb-5">🚘</div>
                <h1 className="text-3xl font-black mb-3">Vehicle not found</h1>
                <p className="text-slate-400 text-sm mb-6 text-center">
                    This vehicle may no longer be available or the link may be incorrect.
                </p>
                <Link
                    to={{ pathname: '/cars', search: location.search }}
                    className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold"
                >
                    Browse all vehicles
                </Link>
            </div>
        );
    }

    const formattedPrice = `₹${car.price.toLocaleString('en-IN')}`;

    // Calculate trip days and total
    const pickupMs = new Date(pickupISO).getTime();
    const returnMs = new Date(returnISO).getTime();
    const rawDays = (returnMs - pickupMs) / (1000 * 60 * 60 * 24);
    const tripDays = Math.max(1, Math.ceil(rawDays));
    const isTooShort = rawDays < 1;
    const estimatedTotal = tripDays * car.price;

    const handleBooking = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location.pathname + location.search } });
            return;
        }
        if (isTooShort || booking) return;

        setBooking(true);
        try {
            await bookingApi.create({
                car: car.id,
                pickupDate: pickupISO,
                returnDate: returnISO,
            });
            toast.success('Booking created! 🎉');
            navigate('/profile');
        } catch (err) {
            toast.error(err.message || 'Booking failed');
        } finally {
            setBooking(false);
        }
    };

    const showDescription = car.description && car.description.trim();

    return (
        <div className="min-h-screen bg-[#070404] text-white font-['Outfit'] pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <Link
                    to={{ pathname: '/cars', search: location.search }}
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors mb-8"
                >
                    ← Back to vehicles
                </Link>

                {/* Heading */}
                <div className="mb-8">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-red-400 bg-red-950/50 border border-red-500/30 px-3 py-1 rounded-full">
                            {car.category}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                        {car.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
                        <span>📍 {car.location}</span>
                    </div>
                </div>

                {/* Main content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Vehicle information */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Image */}
                        <div className="relative min-h-[260px] sm:min-h-[420px] rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 flex items-center justify-center overflow-hidden p-8">
                            <div className="absolute w-64 h-40 rounded-full bg-red-600/10 blur-3xl" />

                            <img
                                src={car.image}
                                alt={car.name}
                                className="relative max-w-full max-h-[340px] object-contain drop-shadow-2xl"
                            />
                        </div>

                        {/* Vehicle overview */}
                        <section className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-bold mb-3">
                                About this vehicle
                            </h2>

                            <p className="text-sm leading-7 text-slate-400">
                                {showDescription
                                    ? car.description
                                    : `Experience the ${car.name}, available for self-drive rental in ${car.location}.`}
                            </p>

                            {car.specs && car.specs.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
                                    {car.specs.map((spec) => (
                                        <div
                                            key={spec.label}
                                            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
                                        >
                                            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
                                                {spec.label}
                                            </p>
                                            <p className="text-sm font-bold text-white">
                                                {spec.val}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Features — only shown if features exist */}
                        {car.features && car.features.length > 0 && (
                            <section className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 sm:p-8">
                                <h2 className="text-xl sm:text-2xl font-bold mb-5">
                                    What&apos;s included
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {car.features.map((feature) => (
                                        <div
                                            key={feature}
                                            className="flex items-center gap-3 text-sm text-slate-300"
                                        >
                                            <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-950/60 text-red-400">
                                                ✓
                                            </span>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Pricing card */}
                    <aside className="lg:col-span-1">
                        <div className="lg:sticky lg:top-28 bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                                Rental price
                            </p>

                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-3xl font-black text-red-400">
                                    {formattedPrice}
                                </span>
                                <span className="text-sm text-slate-400">/ day</span>
                            </div>

                            <div className="h-px bg-zinc-800 my-6" />

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between gap-3">
                                    <span className="text-slate-400">Location</span>
                                    <span className="text-white text-right">{car.location}</span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-slate-400">Pickup</span>
                                    <span className="text-white text-right">{pickupDate} {pickupTime}</span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-slate-400">Return</span>
                                    <span className="text-white text-right">{returnDate} {returnTime}</span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-slate-400">Duration</span>
                                    <span className="text-white font-semibold">{tripDays} {tripDays === 1 ? 'day' : 'days'}</span>
                                </div>
                            </div>

                            <div className="h-px bg-zinc-800 my-6" />

                            <div className="flex justify-between items-baseline mb-6">
                                <span className="text-sm text-slate-400 font-semibold">Estimated total</span>
                                <span className="text-2xl font-black text-white">₹{estimatedTotal.toLocaleString('en-IN')}</span>
                            </div>

                            {isTooShort ? (
                                <>
                                    <button
                                        type="button"
                                        disabled
                                        className="w-full py-4 rounded-xl bg-zinc-800 text-slate-400 text-sm font-bold cursor-not-allowed"
                                    >
                                        Return must be at least 1 day after pickup
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleBooking}
                                    disabled={booking}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-red-800 disabled:to-rose-800 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {booking ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Booking...
                                        </>
                                    ) : (
                                        'Book Now'
                                    )}
                                </button>
                            )}

                            {!isAuthenticated && (
                                <p className="text-[11px] text-slate-500 text-center mt-3 leading-5">
                                    You&apos;ll need to sign in before booking.
                                </p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;
