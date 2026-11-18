import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import carLogo from '../assets/carlogo.png';

const Navbar = ({ isAuthenticated = false, onAuthClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftNavLinks = [
    { name: 'Rent a Car', path: '/cars' },
    { name: 'List Your Car', path: '/offer-ride' },
    { name: 'How It Works', path: '/how-it-works' },
  ];

  const rightNavLinks = [
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070404]/85 backdrop-blur-xl border-b border-red-500/20 shadow-2xl shadow-black/70 py-1'
          : 'bg-gradient-to-b from-black/70 via-black/25 to-transparent border-b border-transparent py-2.5'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* ── Left Navigation Links (Desktop) ── */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1">
            {leftNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[13px] font-semibold tracking-wider uppercase transition-colors duration-150 ${
                  isActive(link.path)
                    ? 'text-red-400 font-bold'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Left Menu Button */}
          <div className="flex lg:hidden flex-1 justify-start">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* ── Center: Navbar Logo Dock Target ── */}
          {/* ScrollLogo animates smoothly into this anchor slot on scroll */}
          <div
            id="navbar-logo-dock"
            className="relative flex items-center justify-center w-24 sm:w-32 h-14 shrink-0 pointer-events-auto"
          />

          {/* ── Right Navigation & Auth Actions (Desktop) ── */}
          <div className="hidden lg:flex items-center justify-end gap-4 flex-1">
            {rightNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[13px] font-semibold tracking-wider uppercase transition-colors duration-150 ${
                  isActive(link.path)
                    ? 'text-red-400 font-bold'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Currency Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-[11px] font-bold text-red-200 tracking-wider">
              <span>🇮🇳</span>
              <span>INR (₹)</span>
            </div>

            {/* Profile Button */}
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-red-500/40 text-xs font-semibold text-white transition-all group cursor-pointer"
              aria-label="User Profile"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm shadow-red-600/40">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="group-hover:text-red-400 transition-colors">Profile</span>
            </Link>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={onAuthClick}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white border border-white/30 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-white/90 hover:text-white px-3 py-2 transition-colors uppercase tracking-wider"
                >
                  Log In
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl shadow-lg shadow-red-600/35 transition-all active:scale-[0.98] uppercase tracking-wider"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Action */}
          <div className="flex lg:hidden flex-1 justify-end items-center gap-2">
            <Link
              to="/profile"
              aria-label="Profile"
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-sm shadow-red-600/40">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </Link>
            <Link
              to="/login"
              className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-md shadow-red-600/30"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>

      {/* ── Mobile Drawer Menu ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/15 bg-black/95 backdrop-blur-2xl px-5 pt-4 pb-6 space-y-4 shadow-2xl">
          <div className="flex justify-center pb-2 border-b border-white/10">
            <img src={carLogo} alt="Rydely" className="h-9 w-auto object-contain brightness-110 drop-shadow-[0_0_12px_rgba(255,53,53,0.35)]" />
          </div>

          <nav className="flex flex-col space-y-1">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/5 flex items-center gap-2"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white text-[10px]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span>My Profile</span>
            </Link>

            {[...leftNavLinks, ...rightNavLinks].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-red-400 bg-red-950/40 font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex items-center gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 text-sm font-semibold text-white border border-white/20 rounded-xl hover:bg-white/10"
            >
              Log In
            </Link>
            <Link
              to="/login?mode=signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-md shadow-red-600/30"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
