// ============================================================
// Login.jsx — Unified Authentication Portal (Sign In & Sign Up)
// ------------------------------------------------------------
// This page handles both renter & host authentication:
//   - Toggle between 'signin' and 'signup' modes
//   - URL search parameter sync (`?mode=signup` or `?mode=signin`)
//   - Sign Up: collects Full Name, Email, Phone (+91), and Password
//   - Sign In: collects Email and Password
//   - Form validation: 8+ character password, match confirmation, terms checkbox
//   - Calls `login()` or `register()` from AuthContext, saves JWT to localStorage
//   - Redirects to homepage `/` on success
//   - Left column showcases Bharat trust features (DigiLocker KYC, UPI payouts, ₹10L insurance)
// ============================================================

import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import carLogo from '../assets/carlogo.png';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Mode from URL query parameters (e.g. /login?mode=signup)
  const urlMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [mode, setMode] = useState(urlMode);
  const [prevUrlMode, setPrevUrlMode] = useState(urlMode);

  // Form input states
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Keep internal mode synchronized if the URL parameter changes
  if (urlMode !== prevUrlMode) {
    setPrevUrlMode(urlMode);
    setMode(urlMode);
    setFormError('');
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Sign Up extra validations
    if (mode === 'signup') {
      if (!fullName.trim()) return setFormError('Full name is required');
      if (!phoneNumber.trim()) return setFormError('Phone number is required');
      if (password !== confirmPassword) return setFormError('Passwords do not match');
      if (!agreedToTerms) return setFormError('Please agree to the terms & conditions');
    }

    // Common validations
    if (!emailAddress.trim()) return setFormError('Email is required');
    if (!password.trim() || password.length < 8) {
      return setFormError('Password must be at least 8 characters');
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        await register(fullName.trim(), emailAddress.trim(), password);
      } else {
        await login(emailAddress.trim(), password);
      }

      // Route to home upon successful authentication
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSignUp = mode === 'signup';

  return (
    <div className="min-h-screen bg-[#070404] font-['Outfit'] flex flex-col relative overflow-hidden">

      {/* --- Ambient Crimson Background Glows --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(120, 20, 20, 0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-[10%] right-[5%] w-[600px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(80, 10, 10, 0.25) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* --- Top Navigation Header --- */}
      <header className="relative z-20 w-full px-6 sm:px-10 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <img
            src={carLogo}
            alt="Rydely"
            className="h-10 w-auto object-contain brightness-110 drop-shadow-[0_0_15px_rgba(255,53,53,0.35)] transition-transform group-hover:scale-105"
          />
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-white/70 hover:text-white px-3.5 py-1.5 rounded-full border border-white/15 hover:border-white/30 transition-all cursor-pointer"
        >
          ← Back to Home
        </Link>
      </header>

      {/* --- Main Content: 2-Column Desktop Grid --- */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 pb-12 pt-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left Column: Brand Value Propositions & Trust Features */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 pr-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                {isSignUp ? 'Join the' : 'Welcome back to'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  Rydely
                </span>{' '}
                community
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                {isSignUp
                  ? 'Create your account to rent self-drive cars directly from local owners, or list your car to earn monthly passive income.'
                  : 'Sign in to manage your car rentals, host listings, and payouts on Rydely.'
                }
              </p>
            </div>

            {/* Indian Mobility Trust Badges */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/25 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">Aadhaar & DL Verified</span>
                  <p className="text-[11px] text-slate-500">Every host and rider is identity-checked via DigiLocker</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/25 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">Instant UPI Settlements</span>
                  <p className="text-[11px] text-slate-500">Fare splits and host payouts via UPI in seconds</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/25 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">₹10 Lakh Ride Cover</span>
                  <p className="text-[11px] text-slate-500">Complimentary insurance on every intercity journey</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="bg-zinc-950/80 border border-red-950/40 rounded-2xl p-3 text-center">
                <span className="block text-lg font-black text-[#ff3535]">15+</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Expressways</span>
              </div>
              <div className="bg-zinc-950/80 border border-red-950/40 rounded-2xl p-3 text-center">
                <span className="block text-lg font-black text-[#ff3535]">50K+</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Verified Users</span>
              </div>
              <div className="bg-zinc-950/80 border border-red-950/40 rounded-2xl p-3 text-center">
                <span className="block text-lg font-black text-[#ff3535]">4.9★</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Avg Rating</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Form Card */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="relative bg-zinc-950/80 backdrop-blur-2xl border border-red-950/50 rounded-3xl p-7 sm:p-9 shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">

              {/* Decorative top crimson gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ff4b3a] via-[#ff3535] to-transparent" />

              {/* Mode Switcher Tabs */}
              <div className="flex items-center bg-zinc-900 rounded-xl p-1 mb-7 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setFormError(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    !isSignUp
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setFormError(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    isSignUp
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Card Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-1">
                {isSignUp ? 'Create your account' : 'Sign in to Rydely'}
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                {isSignUp
                  ? 'Fill in your details to get started on the expressway'
                  : 'Enter your credentials to access your rides'
                }
              </p>

              {/* Error Message Box */}
              {formError && (
                <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {formError}
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Full Name (Sign Up only) */}
                {isSignUp && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-4 py-2.5 text-sm font-medium bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl text-white placeholder:text-slate-600 focus:outline-none transition-all"
                    />
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 text-sm font-medium bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl text-white placeholder:text-slate-600 focus:outline-none transition-all"
                  />
                </div>

                {/* Phone Number (Sign Up only) */}
                {isSignUp && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-2.5 text-xs font-bold text-slate-400 bg-zinc-900/80 border border-zinc-800 rounded-xl shrink-0">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full px-4 py-2.5 text-sm font-medium bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl text-white placeholder:text-slate-600 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Password Field */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 pr-10 text-sm font-medium bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl text-white placeholder:text-slate-600 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Sign Up only) */}
                {isSignUp && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 text-sm font-medium bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl text-white placeholder:text-slate-600 focus:outline-none transition-all"
                    />
                  </div>
                )}

                {/* Terms Agreement (Sign Up) or Remember Me (Sign In) */}
                {isSignUp ? (
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500/30 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-400 leading-relaxed">
                      I agree to Rydely's{' '}
                      <Link to="/terms" className="text-red-400 hover:text-red-300 underline underline-offset-2">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-red-400 hover:text-red-300 underline underline-offset-2">Privacy Policy</Link>
                    </span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500/30 cursor-pointer"
                      />
                      <span className="text-[11px] text-slate-500 font-medium">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-[11px] text-red-400 hover:text-red-300 font-semibold transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-red-800 disabled:to-rose-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-500/40 transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      {isSignUp ? 'Creating account...' : 'Signing in...'}
                    </>
                  ) : (
                    <>
                      {isSignUp ? 'Create Account' : 'Sign In'}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-zinc-950">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Social OAuth Sign In Options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>

              {/* Mode switch helper link */}
              <p className="mt-6 text-center text-xs text-slate-500">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => { setMode(isSignUp ? 'signin' : 'signup'); setFormError(''); }}
                  className="text-red-400 hover:text-red-300 font-bold cursor-pointer transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>

            </div>
          </div>

        </div>
      </div>

      {/* --- Bottom Legal & Support Footer --- */}
      <footer className="relative z-10 w-full px-6 sm:px-10 py-5 flex items-center justify-between text-[10px] font-mono text-slate-600 tracking-widest border-t border-red-950/30">
        <span>© 2026 RYDELY INDIA PVT. LTD.</span>
        <div className="flex items-center gap-4">
          <Link to="/terms" className="hover:text-slate-400 transition-colors">TERMS</Link>
          <Link to="/privacy" className="hover:text-slate-400 transition-colors">PRIVACY</Link>
          <Link to="/contact" className="hover:text-slate-400 transition-colors">SUPPORT</Link>
        </div>
      </footer>

    </div>
  );
};

export default Login;
