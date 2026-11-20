
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const navItems = [
  { id: 'overview', icon: '◈', label: 'Overview' },
  { id: 'bookings', icon: '▤', label: 'My bookings' },
  { id: 'saved', icon: '♡', label: 'Saved machines' },
  { id: 'personal', icon: '◎', label: 'Personal details' },
];

const demoUser = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  role: 'user',
};

const demoStats = [
  { label: 'TOTAL RIDES', value: '12', note: 'Machines experienced', icon: '↗' },
  { label: 'DISTANCE COVERED', value: '2,840 KM', note: 'Miles of memories', icon: '⌁' },
  { label: 'MEMBER STATUS', value: 'ELITE', note: 'Part of the Rydely club', icon: '✳' },
];

const demoBookings = [
  {
    car: 'Porsche 911 Carrera',
    type: 'SPORTS',
    dates: '18 Nov — 21 Nov, 2026',
    price: '₹24,000',
    status: 'CONFIRMED',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000',
  },
  {
    car: 'Mercedes-Benz G-Wagon',
    type: 'LUXURY SUV',
    dates: '02 Dec — 04 Dec, 2026',
    price: '₹18,500',
    status: 'UPCOMING',
    image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1000',
  },
];

const Profile = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('overview');
  const [user, setUser] = useState(demoUser);
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('rydely-token');

    // No token? Show the demo profile instead of redirecting.
    if (!token) {
      setUser(demoUser);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API}/api/user/data`, {
          headers: { Authorization: token },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Could not load your profile');
        }

        setUser(data.user);
        setIsDemo(false);
        setError('');
      } catch (err) {
        // Keep the page accessible even if the backend is unavailable.
        setUser(demoUser);
        setIsDemo(true);
        setError('Live account data is unavailable. Showing demo profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const initials = (user?.name || 'R').trim().charAt(0).toUpperCase();

  const logout = () => {
    localStorage.removeItem('rydely-token');
    setUser(demoUser);
    setIsDemo(true);
    setActive('overview');
  };

  const stats = isDemo
    ? demoStats
    : [
        { label: 'TOTAL RIDES', value: '12', note: 'Your journey so far', icon: '↗' },
        { label: 'DISTANCE COVERED', value: '2,840 KM', note: 'Kilometres travelled', icon: '⌁' },
        { label: 'MEMBER STATUS', value: 'DRIVER', note: 'Part of the Rydely club', icon: '✳' },
      ];

  const sections = {
    overview: (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {stats.map(stat => (
            <div key={stat.label} className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113] p-5 hover:border-red-500/40 transition-all duration-500">
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-red-600/10 blur-3xl group-hover:bg-red-600/20 transition-all" />
              <div className="relative flex justify-between items-start">
                <span className="text-[10px] tracking-[.2em] text-zinc-500 font-bold">{stat.label}</span>
                <span className="text-red-500 text-xl">{stat.icon}</span>
              </div>
              <div className="relative mt-7 text-3xl font-black tracking-tight">{stat.value}</div>
              <p className="relative mt-1 text-xs text-zinc-500">{stat.note}</p>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-[#100d0e] p-7 sm:p-10 mb-6">
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 85% 50%, rgba(220,38,38,.3), transparent 55%)' }} />
          <div className="relative max-w-xl">
            <span className="text-[10px] tracking-[.3em] text-red-400 font-bold">YOUR NEXT CHAPTER</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black leading-[.95] tracking-tight">THE ROAD<br /><span className="text-red-500">IS YOURS.</span></h2>
            <p className="mt-5 text-sm text-zinc-400 max-w-sm leading-6">The perfect machine is waiting. Find your next drive and make every kilometre count.</p>
            <Link to="/cars" className="inline-flex mt-7 items-center gap-4 bg-red-600 hover:bg-red-500 text-white px-6 py-4 rounded-xl text-xs font-black tracking-widest transition-all hover:translate-y-[-2px] shadow-lg shadow-red-950/50">
              EXPLORE THE FLEET <span className="text-lg">↗</span>
            </Link>
          </div>
          <div className="absolute right-5 bottom-5 sm:right-10 sm:bottom-8 text-[90px] sm:text-[150px] font-black italic text-white/[0.035] select-none leading-none">R.</div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <button onClick={() => setActive('bookings')} className="text-left rounded-2xl border border-white/[0.08] bg-[#111113] p-5 hover:border-red-500/40 transition-all">
            <span className="text-2xl text-red-500">▤</span>
            <h3 className="mt-5 font-bold">Your bookings</h3>
            <p className="mt-1 text-xs text-zinc-500">Keep track of your rides and reservations.</p>
            <span className="inline-block mt-4 text-[10px] tracking-widest text-red-400 font-bold">VIEW BOOKINGS ↗</span>
          </button>
          <button onClick={() => setActive('personal')} className="text-left rounded-2xl border border-white/[0.08] bg-[#111113] p-5 hover:border-red-500/40 transition-all">
            <span className="text-2xl text-red-500">◎</span>
            <h3 className="mt-5 font-bold">Your identity</h3>
            <p className="mt-1 text-xs text-zinc-500">Review your account information.</p>
            <span className="inline-block mt-4 text-[10px] tracking-widest text-red-400 font-bold">VIEW DETAILS ↗</span>
          </button>
        </div>
      </>
    ),

    bookings: (
      <div className="space-y-4">
        {demoBookings.map((booking, index) => (
          <div key={booking.car} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113]">
            <div className="grid sm:grid-cols-[220px_1fr]">
              <img src={booking.image} alt={booking.car} className="w-full h-48 sm:h-full object-cover" />
              <div className="p-6">
                <div className="flex justify-between gap-3 flex-wrap">
                  <span className="text-[9px] tracking-[.2em] text-red-400 font-bold">{booking.type}</span>
                  <span className="text-[9px] tracking-widest text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 rounded-full">{booking.status}</span>
                </div>
                <h3 className="mt-3 text-2xl font-black">{booking.car}</h3>
                <p className="mt-2 text-xs text-zinc-500">{booking.dates}</p>
                <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
                  <span className="text-xs text-zinc-500">BOOKING #{String(1024 + index).padStart(5, '0')}</span>
                  <span className="text-xl font-black">{booking.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <p className="text-[10px] text-zinc-600 text-center tracking-widest">SAMPLE BOOKINGS — CONNECTED BOOKING HISTORY COMING SOON</p>
      </div>
    ),

    saved: (
      <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-8 sm:p-12 text-center">
        <div className="text-5xl text-red-500 mb-5">♡</div>
        <h2 className="text-2xl font-black">YOUR DREAM DRIVE LIST.</h2>
        <p className="text-sm text-zinc-500 mt-3 max-w-sm mx-auto">Save cars you love and keep your favourites close. This space is ready for your picks.</p>
        <Link to="/cars" className="inline-flex mt-7 bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl text-xs font-black tracking-widest">EXPLORE CARS ↗</Link>
      </div>
    ),

    personal: (
      <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-6 sm:p-9">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-5 mb-6 gap-3">
          <div>
            <h2 className="text-xl font-black">IDENTITY FILE</h2>
            <p className="text-xs text-zinc-500 mt-1">Your registered account information</p>
          </div>
          <span className="text-[9px] tracking-widest text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 rounded-full">● ACCOUNT ACTIVE</span>
        </div>
        {[
          ['FULL NAME', user?.name],
          ['EMAIL ADDRESS', user?.email],
          ['ACCOUNT TYPE', user?.role || 'user'],
        ].map(([label, value]) => (
          <div key={label} className="py-4 border-b border-white/[0.06] last:border-0">
            <p className="text-[9px] tracking-[.2em] font-bold text-zinc-500">{label}</p>
            <p className="mt-2 text-sm font-semibold text-white break-all">{value || 'Not provided'}</p>
          </div>
        ))}
        <p className="mt-5 text-[11px] text-zinc-600">
          {isDemo ? 'Demo information shown for preview. Live account details will appear after backend authentication.' : 'Profile editing will be enabled when the backend supports account updates.'}
        </p>
      </div>
    ),
  };

  return (
    <main className="relative min-h-screen bg-[#080809] text-white overflow-hidden pt-28 sm:pt-32 pb-20">
      <div className="fixed pointer-events-none inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 80% 10%, rgba(153,27,27,.18), transparent 30%), radial-gradient(circle at 5% 70%, rgba(127,29,29,.12), transparent 25%)' }} />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-7 lg:px-10">
        <div className="flex flex-wrap justify-between items-end gap-5 mb-9">
          <div>
            <div className="flex items-center gap-2 text-[10px] tracking-[.3em] text-red-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              RYDELY PRIVATE NETWORK / DRIVER HQ
            </div>
            <h1 className="mt-4 text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-.07em] leading-[.85]">
              YOUR<br /><span className="text-red-600">UNIVERSE.</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[9px] tracking-[.25em] text-zinc-600 font-bold">MEMBER ACCESS</p>
            <p className="mt-2 text-xs text-zinc-400 font-mono">RYD / 2026</p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#111113] p-12 text-center text-zinc-500 animate-pulse">LOADING YOUR DRIVER PROFILE...</div>
        ) : (
          <>
            {error && (
              <p className="mb-4 text-xs text-amber-400 border border-amber-500/20 bg-amber-500/5 rounded-xl p-3">{error}</p>
            )}

            {isDemo && (
              <div className="mb-4 flex items-center justify-between gap-3 flex-wrap rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">
                <span className="text-[10px] tracking-widest font-bold text-amber-300">◉ DEMO PREVIEW — SAMPLE ACCOUNT DATA</span>
                <Link to="/login" className="text-[10px] tracking-widest font-bold text-white hover:text-red-400">SIGN IN ↗</Link>
              </div>
            )}

            <section className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#111113] mb-6">
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(110deg, transparent 35%, rgba(127,29,29,.18), transparent 85%)' }} />
              <div className="relative p-6 sm:p-9 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
                  <div className="absolute inset-0 rounded-[28px] bg-red-600 blur-xl opacity-30" />
                  <div className="relative w-full h-full rounded-[28px] bg-gradient-to-br from-red-500 to-red-950 border border-red-400/30 flex items-center justify-center text-5xl font-black shadow-2xl">
                    {initials}
                  </div>
                  <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 border-[5px] border-[#111113]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] tracking-[.3em] font-bold text-red-400">WELCOME BACK, DRIVER</p>
                  <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight truncate">{user?.name || 'Rydely Driver'}</h2>
                  <p className="mt-2 text-sm text-zinc-500 truncate">{user?.email}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-[9px] tracking-widest font-bold rounded-full px-3 py-2 bg-white/[0.05] border border-white/10 text-zinc-300">✳ RYDELY MEMBER</span>
                    <span className="text-[9px] tracking-widest font-bold rounded-full px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">● ONLINE</span>
                  </div>
                </div>
                <button onClick={logout} className="self-start sm:self-center rounded-xl border border-white/10 px-5 py-3 text-[10px] tracking-widest font-bold text-zinc-400 hover:text-white hover:border-red-500/50 transition-all">
                  {isDemo ? 'EXIT DEMO ↗' : 'LOG OUT ↗'}
                </button>
              </div>
              <div className="h-[2px] bg-gradient-to-r from-red-600 via-red-400/40 to-transparent" />
            </section>

            <div className="grid lg:grid-cols-[250px_1fr] gap-6">
              <aside className="rounded-2xl border border-white/[0.08] bg-[#101012] p-3 h-fit">
                <p className="px-4 pt-3 pb-4 text-[9px] tracking-[.25em] font-bold text-zinc-600">CONTROL CENTRE</p>
                {navItems.map(item => (
                  <button key={item.id} onClick={() => setActive(item.id)} className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left text-xs font-bold transition-all ${active === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-950/50' : 'text-zinc-500 hover:text-white hover:bg-white/[0.04]'}`}>
                    <span className="text-lg">{item.icon}</span>{item.label}
                    {active === item.id && <span className="ml-auto">↗</span>}
                  </button>
                ))}
                <div className="mt-5 p-4 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                  <p className="text-[9px] text-zinc-600 tracking-widest font-bold">NEED A HAND?</p>
                  <Link to="/contact" className="block mt-2 text-xs text-red-400 font-bold">Contact support ↗</Link>
                </div>
              </aside>

              <section className="min-w-0">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[9px] tracking-[.25em] text-red-400 font-bold">DRIVER / {active.toUpperCase()}</p>
                    <h2 className="text-2xl sm:text-3xl font-black mt-1">{navItems.find(x => x.id === active)?.label}</h2>
                  </div>
                  <span className="hidden sm:block text-[9px] tracking-widest text-zinc-600">RYDELY SYSTEMS © 2026</span>
                </div>
                {sections[active]}
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Profile;
