import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { bookingApi } from '../../services/api';

const OwnerBookings = () => {
  const { isOwner, authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
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

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bookingApi.owner();
      setBookings(res.bookings || []);
    } catch (err) {
      setError(err.message || 'Could not load owner bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && isOwner) {
      fetchBookings();
    }
  }, [isAuthenticated, isOwner, fetchBookings]);

  const handleStatusChange = async (bookingId, status) => {
    setActionLoadingId(bookingId);
    try {
      await bookingApi.changeStatus({ bookingId, status });
      toast.success(`Booking ${status} successfully`);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
      );
    } catch (err) {
      toast.error(err.message || `Failed to update booking to ${status}`);
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
              RYDELY HOST OPERATIONS / BOOKING LOGS
            </div>
            <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              RENTAL<span className="text-red-600"> REQUESTS.</span>
            </h1>
          </div>
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
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            My Machines
          </Link>
          <Link
            to="/owner/bookings"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white shadow-md shadow-red-950/40"
          >
            Bookings & Requests ({bookings.length})
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#111113] p-12 text-center text-zinc-500 animate-pulse">
            LOADING GUEST BOOKINGS...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-[#111113] p-12 text-center max-w-xl mx-auto">
            <div className="text-4xl mb-4">▤</div>
            <h2 className="text-2xl font-bold mb-2">No Booking Inquiries Yet</h2>
            <p className="text-sm text-zinc-500">
              When drivers reserve your machines, requests will show up here for you to confirm.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const carTitle = `${b.car?.brand || ''} ${b.car?.model || ''}`.trim() || 'Vehicle';
              const isActioning = actionLoadingId === b._id;

              return (
                <div
                  key={b._id}
                  className="rounded-3xl border border-white/[0.08] bg-[#111113] p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Left: Car & Renter Details */}
                  <div className="flex items-start sm:items-center gap-5">
                    {b.car?.image ? (
                      <img
                        src={b.car.image}
                        alt={carTitle}
                        className="w-24 h-20 sm:w-32 sm:h-24 rounded-2xl object-cover bg-zinc-900 shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-20 sm:w-32 sm:h-24 rounded-2xl bg-zinc-900 flex items-center justify-center text-xs text-zinc-600 shrink-0 font-mono">
                        NO IMAGE
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] tracking-widest uppercase font-bold text-red-400">
                          {b.car?.category || 'VEHICLE'}
                        </span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-xs text-zinc-400">
                          Booking #{b._id.slice(-5).toUpperCase()}
                        </span>
                      </div>

                      <h2 className="text-xl font-black text-white">{carTitle}</h2>

                      <div className="mt-2 text-xs text-zinc-400 space-y-0.5">
                        <p>
                          <span className="text-zinc-500 font-semibold">Renter:</span> {b.user?.name || 'Guest Driver'}{' '}
                          <span className="text-zinc-600">({b.user?.email})</span>
                        </p>
                        <p>
                          <span className="text-zinc-500 font-semibold">Dates:</span>{' '}
                          {new Date(b.pickupDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} —{' '}
                          {new Date(b.returnDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Price, Status & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 border-white/[0.06] pt-4 lg:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                        Total Payout
                      </span>
                      <span className="text-2xl font-black text-white">
                        ₹{(b.price ?? 0).toLocaleString('en-IN')}
                      </span>
                      <div className="mt-1">
                        <span
                          className={`text-[9px] tracking-wider uppercase px-2.5 py-0.5 rounded-full border font-bold ${
                            b.status === 'confirmed'
                              ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                              : b.status === 'pending'
                              ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                              : 'text-red-400 border-red-500/30 bg-red-500/10'
                          }`}
                        >
                          ● {b.status}
                        </span>
                      </div>
                    </div>

                    {b.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isActioning}
                          onClick={() => handleStatusChange(b._id, 'confirmed')}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-950/40"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          disabled={isActioning}
                          onClick={() => handleStatusChange(b._id, 'cancelled')}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold border border-red-500/40 text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </div>
                    )}
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

export default OwnerBookings;
