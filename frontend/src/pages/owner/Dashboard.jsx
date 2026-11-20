import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ownerApi } from '../../services/api';

const OwnerDashboard = () => {
  const { isOwner, authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    if (!isAuthenticated || !isOwner) return;

    let cancelled = false;
    const fetchDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await ownerApi.dashboard();
        if (!cancelled) {
          setData(res.dashboardData || {});
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load dashboard data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDashboard();
    return () => { cancelled = true; };
  }, [isAuthenticated, isOwner]);

  if (authLoading || (loading && !data && !error)) {
    return (
      <main className="relative min-h-screen bg-[#080809] text-white pt-28 sm:pt-32 pb-20 font-['Outfit']">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-7 lg:px-10">
          <div className="rounded-3xl border border-white/10 bg-[#111113] p-12 text-center text-zinc-500 animate-pulse">
            LOADING OWNER HQ...
          </div>
        </div>
      </main>
    );
  }

  const stats = [
    { label: 'FLEET SIZE', value: String(data?.totalCars ?? 0), note: 'Machines listed', icon: '🚘' },
    { label: 'MONTHLY REVENUE', value: `₹${(data?.monthlyRevenue ?? 0).toLocaleString('en-IN')}`, note: 'Current month confirmed', icon: '₹' },
    { label: 'ALL BOOKINGS', value: String(data?.totalBookings ?? 0), note: 'Lifetime volume', icon: '▤' },
    { label: 'PENDING ACTION', value: String(data?.pendingBookings ?? 0), note: 'Awaiting host response', icon: '⏳' },
    { label: 'COMPLETED RIDES', value: String(data?.completedBookings ?? 0), note: 'Successful journeys', icon: '✳' },
  ];

  return (
    <main className="relative min-h-screen bg-[#080809] text-white pt-28 sm:pt-32 pb-20 font-['Outfit']">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-7 lg:px-10">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-5 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] tracking-[.3em] text-red-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              RYDELY HOST OPERATIONS / FLEET CONSOLE
            </div>
            <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              HOST<span className="text-red-600"> HQ.</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/offer-ride"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-950/50 transition-all"
            >
              <span>+ List Another Machine</span>
            </Link>
          </div>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
          <Link
            to="/owner/dashboard"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white shadow-md shadow-red-950/40"
          >
            Dashboard Overview
          </Link>
          <Link
            to="/owner/cars"
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            My Machines ({data?.totalCars ?? 0})
          </Link>
          <Link
            to="/owner/bookings"
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Bookings & Requests ({data?.pendingBookings ? `${data.pendingBookings} pending` : (data?.totalBookings ?? 0)})
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113] p-5 hover:border-red-500/40 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] tracking-[.2em] text-zinc-500 font-bold">{s.label}</span>
                <span className="text-red-500 text-lg">{s.icon}</span>
              </div>
              <div className="mt-5 text-2xl sm:text-3xl font-black tracking-tight">{s.value}</div>
              <p className="mt-1 text-xs text-zinc-500 truncate">{s.note}</p>
            </div>
          ))}
        </div>

        {/* Recent Bookings Section */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#111113] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Recent Activity</h2>
              <p className="text-xs text-zinc-500 mt-1">Latest rental requests on your fleet</p>
            </div>
            <Link
              to="/owner/bookings"
              className="text-xs text-red-400 hover:text-red-300 font-bold tracking-wider uppercase"
            >
              View All Bookings ↗
            </Link>
          </div>

          {!data?.recentBookings || data.recentBookings.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              No bookings recorded yet. Ensure your machines are marked available!
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentBookings.map((b) => (
                <div
                  key={b._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-red-500/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {b.car?.image ? (
                      <img
                        src={b.car.image}
                        alt="Car"
                        className="w-16 h-12 object-cover rounded-lg shrink-0 bg-zinc-900"
                      />
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-zinc-900 flex items-center justify-center text-[10px] text-zinc-600 shrink-0">
                        CAR
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-white">
                        {b.car?.brand} {b.car?.model}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {new Date(b.pickupDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} —{' '}
                        {new Date(b.returnDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <span className="text-sm font-black text-white">
                      ₹{(b.price ?? 0).toLocaleString('en-IN')}
                    </span>
                    <span
                      className={`text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full border font-bold ${
                        b.status === 'confirmed'
                          ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                          : b.status === 'pending'
                          ? 'text-amber-400 border-amber-500/20 bg-amber-500/10'
                          : 'text-red-400 border-red-500/20 bg-red-500/10'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default OwnerDashboard;
