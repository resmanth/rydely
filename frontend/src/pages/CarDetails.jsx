import { Link, useLocation, useParams } from 'react-router-dom';
import { sampleCars } from '../data/cars';

const CarDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const car = sampleCars.find((vehicle) => vehicle.id === id);

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

                        {car.badge && (
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                                ★ {car.badge}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                        {car.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
                        <span>📍 {car.location}</span>
                        <span>★ {car.rating} ({car.tripsCount} trips)</span>
                        <span>Hosted by {car.hostName}</span>
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
                                Experience the {car.name}, available for self-drive rental
                                in {car.location}. This vehicle is hosted by {car.hostName}
                                and is rated {car.rating} by previous renters.
                            </p>

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
                        </section>

                        {/* Features */}
                        <section className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-bold mb-5">
                                What's included
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

                        {/* Host */}
                        <section className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 sm:p-8">
                            <h2 className="text-xl font-bold mb-5">Meet your host</h2>

                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center text-xl font-black">
                                    {car.hostName.charAt(0)}
                                </div>

                                <div>
                                    <p className="font-bold text-white">{car.hostName}</p>
                                    <p className="text-sm text-slate-400">
                                        {car.isSuperhost ? '★ Rydely Superhost' : 'Verified host'}
                                    </p>
                                </div>
                            </div>
                        </section>
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
                                    <span className="text-slate-400">Instant booking</span>
                                    <span className={car.instantBooking ? 'text-green-400' : 'text-amber-400'}>
                                        {car.instantBooking ? 'Available' : 'Not available'}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-slate-400">Doorstep delivery</span>
                                    <span className={car.doorstepDelivery ? 'text-green-400' : 'text-slate-500'}>
                                        {car.doorstepDelivery ? 'Available' : 'Not available'}
                                    </span>
                                </div>
                            </div>

                            <div className="h-px bg-zinc-800 my-6" />

                            <button
                                type="button"
                                disabled
                                className="w-full py-4 rounded-xl bg-zinc-800 text-slate-400 text-sm font-bold cursor-not-allowed"
                            >
                                Booking flow coming next
                            </button>

                            <p className="text-[11px] text-slate-500 text-center mt-3 leading-5">
                                Booking, date selection and final price calculation will be
                                implemented in the next phase.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;
