import CarDetails from './pages/CarDetails';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Navbar from './components/Navbar';
import ScrollLogo from './components/ScrollLogo';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cars from './pages/Cars';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Login from './pages/Login';
import Preloader from './components/Preloader';

const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#070404] text-white font-['Outfit'] selection:bg-red-500/30 selection:text-red-200 flex flex-col justify-between">
      {/* Show preloader, navbar & animated scroll logo on non-login pages */}
      {!isLoginPage && (
        <>
          <Preloader />
          <Navbar />
          <ScrollLogo />
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/vehicles" element={<Cars />} />
          <Route path="/find-car" element={<Cars />} />
          <Route path="/rent-a-car" element={<Cars />} />
          <Route path="/rent-car" element={<Cars />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/contact"
            element={
              <div className="max-w-4xl mx-auto px-4 py-32 text-center">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 bg-red-950/60 px-3 py-1 rounded-full border border-red-500/30">
                  24/7 Support
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 mb-4">Contact Rydely</h1>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                  Have questions about listing your car or booking a self-drive rental? Our Bengaluru team is available round the clock.
                </p>
                <div className="inline-flex items-center gap-4 text-sm font-semibold text-slate-300 bg-zinc-900/90 border border-zinc-800 px-6 py-3 rounded-2xl">
                  <span>📞 +91 (80) 4567 8900</span>
                  <span>·</span>
                  <span className="text-red-400">support@rydely.in</span>
                </div>
              </div>
            }
          />
          <Route path="/offer-ride" element={<HowItWorks />} />
          <Route
            path="/profile"
            element={
              <div className="max-w-4xl mx-auto px-4 py-32 text-center font-['Outfit']">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-red-600/40">
                  👤
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">My Profile & Bookings</h1>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Manage your active self-drive rentals, identity verification, and listed vehicles.
                </p>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      {/* ── 1. Master Global Footer Sitting at the Bottom of Every Page ── */}
      {!isLoginPage && <Footer />}
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
