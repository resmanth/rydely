/**
 * App.jsx — Root component of the Rydely frontend.
 *
 * This file does three main things:
 * 1. Sets up the React Router (URL-based page navigation).
 * 2. Wraps the app in AuthProvider so every page can access login/logout state.
 * 3. Initialises Lenis for buttery-smooth scrolling across all pages.
 *
 * The AppLayout component handles the page structure:
 *   - Navbar, Preloader, and ScrollLogo appear on every page EXCEPT /login.
 *   - Footer appears on every page EXCEPT /login.
 *   - The <Routes> block decides which page component to show for each URL.
 */

// --- Page Imports ---
import CarDetails from './pages/CarDetails';
import Profile from './pages/Profile';
import ListYourCar from './pages/ListYourCar';
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerCars from './pages/owner/Cars';
import OwnerBookings from './pages/owner/Bookings';
import Home from './pages/Home';
import Cars from './pages/Cars';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Login from './pages/Login';

// --- React & Router Imports ---
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// --- UI Library Imports ---
import { Toaster } from 'react-hot-toast';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// --- Shared Component Imports ---
import Navbar from './components/Navbar';
import ScrollLogo from './components/ScrollLogo';
import Footer from './components/Footer';
import Preloader from './components/Preloader';

// --- Auth Context Import ---
import { AuthProvider } from './context/AuthContext';

// ============================================================
// AppLayout — The shell that wraps every page
// ============================================================
const AppLayout = () => {
  // useLocation() gives us the current URL path so we can
  // conditionally hide the Navbar/Footer on the login page.
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

      {/* --- Main Content Area (page components render here) --- */}
      <main className="flex-1">
        <Routes>
          {/* --- Public Pages --- */}
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetails />} />

          {/* Alias routes — multiple URLs all show the Cars page (for SEO / convenience) */}
          <Route path="/vehicles" element={<Cars />} />
          <Route path="/find-car" element={<Cars />} />
          <Route path="/rent-a-car" element={<Cars />} />
          <Route path="/rent-car" element={<Cars />} />

          {/* --- Informational Pages --- */}
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />

          {/* --- Contact Page (inline JSX, no separate component) --- */}
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

          {/* --- Owner Pages (car listing & management) --- */}
          <Route path="/offer-ride" element={<ListYourCar />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/cars" element={<OwnerCars />} />
          <Route path="/owner/bookings" element={<OwnerBookings />} />

          {/* --- User Account Pages --- */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      {/* --- Footer (hidden on login page) --- */}
      {!isLoginPage && <Footer />}
    </div>
  );
};

// ============================================================
// App — Top-level component that sets up providers & smooth scrolling
// ============================================================
const App = () => {
  /**
   * Lenis smooth-scroll setup.
   * Lenis intercepts native scroll events and applies a smooth easing
   * animation so the page scrolls fluidly instead of jumping.
   * We drive it with requestAnimationFrame so it updates every frame.
   */
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

    // Start the animation loop — Lenis needs to be called every frame
    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    // Cleanup: stop the loop and destroy Lenis when the component unmounts
    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      {/* AuthProvider gives every child component access to user/login/logout */}
      <AuthProvider>
        <AppLayout />
        {/* Toaster shows pop-up notifications (success, error, etc.) at the top-center */}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '14px',
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
};

export default App;
