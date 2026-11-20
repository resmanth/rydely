/**
 * Navbar.jsx
 *
 * The main navigation bar displayed at the top of every page.
 * Features:
 *   - Fixed position that changes appearance on scroll (transparent → solid dark background)
 *   - Desktop layout: left nav links, center logo dock, right nav links + auth actions
 *   - Mobile layout: hamburger toggle that opens a full drawer menu
 *   - Shows different buttons depending on whether the user is logged in (Logout) or not (Log In / Sign In)
 *   - If the user is a car owner, shows a "Host HQ" link to the owner dashboard
 */
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import carLogo from '../assets/carlogo.png';

const Navbar = () => {
  // --- Auth & Routing ---
  // Pull authentication state and user info from our global auth context
  const { isAuthenticated, logout, user, isOwner } = useAuth();

  // --- Component State ---
  // Controls whether the mobile hamburger drawer is open
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Tracks whether the user has scrolled past 20px (triggers the solid navbar style)
  const [scrolled, setScrolled] = useState(false);

  // Get the current URL path (to highlight the active nav link)
  const location = useLocation();
  // Programmatic navigation (used after logout to redirect to home)
  const navigate = useNavigate();

  // --- Scroll Listener Effect ---
  // Attaches a scroll event listener on mount that sets `scrolled` to true when
  // the page is scrolled more than 20px down. Cleans up the listener on unmount.
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Navigation Link Definitions ---
  // Links displayed to the LEFT of the logo on desktop
  const leftNavLinks = [
    { name: 'Rent a Car', path: '/cars' },
    { name: 'List Your Car', path: '/offer-ride' },
    { name: 'How It Works', path: '/how-it-works' },
  ];

  // Links displayed to the RIGHT of the logo on desktop
  const rightNavLinks = [
    { name: 'About', path: '/about' },
  ];

  // Helper: returns true if the given path matches the current URL (used for active styling)
  const isActive = (path) => location.pathname === path;

  // Logs the user out and redirects to the homepage
  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

          {/* --- Desktop Left Navigation Links --- */}
          {/* These links (Rent a Car, List Your Car, How It Works) are hidden on mobile */}
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

          {/* --- Mobile Hamburger Button (visible on small screens only) --- */}
          {/* Toggles the mobile drawer menu open/closed */}
          <div className="flex lg:hidden flex-1 justify-start">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {/* Show X icon when menu is open, hamburger icon when closed */}
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

          {/* --- Center: Logo Dock Target --- */}
          {/* This empty div is an anchor point. The ScrollLogo component animates into
              this slot when the user scrolls down. It acts as a "dock" for the floating logo. */}
          <div
            id="navbar-logo-dock"
            className="relative flex items-center justify-center w-24 sm:w-32 h-14 shrink-0 pointer-events-auto"
          />

          {/* --- Desktop Right Navigation & Auth Actions --- */}
          {/* Contains: About link, currency badge, owner dashboard link, profile link, login/logout */}
          <div className="hidden lg:flex items-center justify-end gap-4 flex-1">
            {/* Right-side nav links (currently just "About") */}
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

            {/* Currency Badge — static indicator showing INR (₹) */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-[11px] font-bold text-red-200 tracking-wider">
              <span>🇮🇳</span>
              <span>INR (₹)</span>
            </div>

            {/* Owner Dashboard Link — only shown if user is a car owner/host */}
            {isOwner && (
              <Link
                to="/owner/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-xs font-bold text-red-300 transition-all cursor-pointer shadow-sm shadow-red-950/40"
              >
                <span>⚡ Host HQ</span>
              </Link>
            )}

            {/* Profile Button — links to the user profile page */}
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-red-500/40 text-xs font-semibold text-white transition-all group cursor-pointer"
              aria-label="User Profile"
            >
              {/* Small circular avatar icon */}
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm shadow-red-600/40">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {/* Show user's first name if logged in, otherwise "Profile" */}
              <span className="group-hover:text-red-400 transition-colors">{isAuthenticated && user?.name ? user.name.split(' ')[0] : 'Profile'}</span>
            </Link>

            {/* Auth Buttons — Logout if logged in, otherwise Log In / Sign In */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
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

          {/* --- Mobile Right Action Buttons (visible on small screens only) --- */}
          {/* Compact profile icon + login/logout button for mobile */}
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
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-bold text-white border border-white/30 rounded-lg hover:bg-white/10"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-md shadow-red-600/30"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* --- Mobile Drawer Menu --- */}
      {/* Full-width dropdown that appears below the navbar when the hamburger is toggled.
          Contains: logo, profile link, owner dashboard (if owner), all nav links, auth buttons. */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/15 bg-black/95 backdrop-blur-2xl px-5 pt-4 pb-6 space-y-4 shadow-2xl">
          {/* Rydely logo at the top of the drawer */}
          <div className="flex justify-center pb-2 border-b border-white/10">
            <img src={carLogo} alt="Rydely" className="h-9 w-auto object-contain brightness-110 drop-shadow-[0_0_12px_rgba(255,53,53,0.35)]" />
          </div>

          {/* Navigation links list */}
          <nav className="flex flex-col space-y-1">
            {/* Profile link */}
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

            {/* Owner dashboard link — only rendered for car hosts */}
            {isOwner && (
              <Link
                to="/owner/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-bold text-red-300 bg-red-950/30 border border-red-500/30 flex items-center gap-2"
              >
                <span>⚡ Host HQ Dashboard</span>
              </Link>
            )}

            {/* All navigation links (left + right combined) */}
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

          {/* --- Mobile Drawer Auth Buttons --- */}
          <div className="pt-3 border-t border-white/10 flex items-center gap-3">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="flex-1 text-center py-2.5 text-sm font-semibold text-white border border-white/20 rounded-xl hover:bg-white/10"
              >
                Log Out
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
