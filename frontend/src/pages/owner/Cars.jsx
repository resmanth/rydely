import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { ownerApi } from '../../services/api';

const OwnerCars = () => {
  const { isOwner, authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
        return;
      }
      if (!isOwner) {
        navigate('/offer-ride', { replace: true });
        return;
      }
    }
  }, [authLoading, isAuthenticated, isOwner, navigate]);

  useEffect(() => {
    let isCancelled = false;

    if (!isAuthenticated || !isOwner) {
      return;
    }

    const loadOwnerCars = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await ownerApi.cars();
        if (!isCancelled) {
          setCars(res.cars || []);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Could not load your cars');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadOwnerCars();

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated, isOwner]);

  const handleToggleAvailability = async (carId) => {
    setActionLoadingId(carId);
    try {
      const res = await ownerApi.toggleCar(carId);
      toast.success(res.isAvailable ? 'Machine is now available for rent' : 'Machine marked unavailable');
      setCars((prev) =>
        prev.map((c) => (c._id === carId ? { ...c, isAvailable: res.isAvailable } : c))
      );
    } catch (err) {
      toast.error(err.message || 'Failed to toggle availability');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteCar = async (carId, name) => {
    if (!window.confirm(`Are you sure you want to permanently remove "${name}" from Rydely?`)) {
      return;
    }

    setActionLoadingId(carId);
    try {
      await ownerApi.deleteCar(carId);
      toast.success('Machine removed from listing');
      setCars((prev) => prev.filter((c) => c._id !== carId));
    } catch (err) {
      toast.error(err.message || 'Failed to delete machine');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#080809] text-white pt-28 sm:pt-32 pb-20 font-['Outfit']">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-7 lg:px-10">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-5 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] tracking-[.3em] text-red-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              RYDELY HOST OPERATIONS / MY FLEET
            </div>
            <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              MY<span className="text-red-600"> MACHINES.</span>
            </h1>
          </div>
          <Link
            to="/offer-ride"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-950/50 transition-all cursor-pointer"
          >
            <span>+ Add Machine</span>
          </Link>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
          <Link
            to="/owner/dashboard"
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Dashboard Overview
          </Link>
          <Link
            to="/owner/cars"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white shadow-md shadow-red-950/40"
          >
            My Machines ({cars.length})
          </Link>
          <Link
            to="/owner/bookings"
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Bookings & Requests
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#111113] p-12 text-center text-zinc-500 animate-pulse">
            LOADING YOUR FLEET...
          </div>
        ) : cars.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-[#111113] p-12 text-center max-w-xl mx-auto">
            <div className="text-4xl mb-4">🚘</div>
            <h2 className="text-2xl font-bold mb-2">No Machines Listed Yet</h2>
            <p className="text-sm text-zinc-500 mb-6">
              Start earning by listing your personal vehicle on the Rydely platform.
            </p>
            <Link
              to="/offer-ride"
              className="inline-flex px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors"
            >
              List Your First Machine →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => {
              const fullName = `${car.brand} ${car.model}`;
              const isActioning = actionLoadingId === car._id;

              return (
                <div
                  key={car._id}
                  className="rounded-3xl border border-white/[0.08] bg-[#111113] p-6 flex flex-col justify-between hover:border-red-500/40 transition-all shadow-xl"
                >
                  <div>
                    {/* Top badging */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        📍 {car.location}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          car.isAvailable
                            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                            : 'text-zinc-500 border-zinc-700 bg-zinc-900'
                        }`}
                      >
                        {car.isAvailable ? '● ACTIVE' : '○ PAUSED'}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="w-full h-40 rounded-2xl bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center p-3 mb-4 overflow-hidden">
                      {car.image ? (
                        <img
                          src={car.image}
                          alt={fullName}
                          className="max-h-full max-w-full object-contain drop-shadow-lg"
                        />
                      ) : (
                        <span className="text-xs text-zinc-600">NO IMAGE</span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-black text-white">{fullName}</h2>
                    <p className="text-xs text-zinc-500 mt-0.5 uppercase tracking-wider">
                      {car.year} · {car.category} · {car.fuel_type} · {car.transmission}
                    </p>

                    {/* Details chip grid */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/[0.06] text-xs">
                      <div>
                        <span className="block text-[10px] text-zinc-500 uppercase font-bold">Daily Rate</span>
                        <span className="font-black text-red-400">₹{(car.pricePerDay || 0).toLocaleString('en-IN')}/day</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-zinc-500 uppercase font-bold">Seats</span>
                        <span className="font-bold text-white">{car.seating_capacity} Seater</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={isActioning}
                      onClick={() => handleToggleAvailability(car._id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer disabled:opacity-50 ${
                        car.isAvailable
                          ? 'border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
                          : 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10'
                      }`}
                    >
                      {car.isAvailable ? 'Pause Listing' : 'Make Live'}
                    </button>
                    <button
                      type="button"
                      disabled={isActioning}
                      onClick={() => handleDeleteCar(car._id, fullName)}
                      className="px-3 py-2 rounded-xl text-xs font-bold border border-red-500/30 text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default OwnerCars;
