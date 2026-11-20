// ============================================================
// Preloader.jsx — Automotive Supercar Cockpit Loading Screen
// ------------------------------------------------------------
// This component renders an automotive digital instrument cluster HUD:
//   - Circular speedometer needle & neon glow arc (0 to 320 KM/H)
//   - Dynamic engine tachometer revving from 1,200 to 8,000 RPM
//   - Perspective 3D cyber grid floor with headlight beam sweeps
//   - Real-time event listeners:
//       - 'rydely-3d-progress': reports 3D model parsing status
//       - 'rydely-3d-ready': triggers ignition & hyperdrive dissolve warp
//   - Failsafe timer (4.5s) to guarantee the website always opens even
//     on slow networks or devices without WebGL2.
// ============================================================

import { useState, useEffect } from 'react';
import carLogo from '../assets/carlogo.png';

const Preloader = () => {
  // Loading & cockpit telemetry states
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(1000);
  const [statusMessage, setStatusMessage] = useState('ENGAGING HIGHWAY TELEMETRY...');
  const [isReady, setIsReady] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);

  useEffect(() => {
    let targetProgress = 18;

    // Smooth physics ticker for speedometer, RPM, and percentage progression
    const ticker = setInterval(() => {
      setProgress((prev) => {
        if (prev < targetProgress) {
          const next = prev + Math.max(0.6, (targetProgress - prev) * 0.16);
          const p = Math.min(next, 99);
          // Speed curves up to 320 km/h
          setSpeed(Math.round(p * 3.2));
          // RPM revs between 1,200 and 7,800
          setRpm(Math.round(1200 + (p / 100) * 6600));
          return p;
        }
        return prev;
      });
    }, 35);

    // Custom event dispatched from Global3DCar.jsx while loading BMW 3D assets
    const handleProgress = (e) => {
      const val = e.detail?.progress ?? 0;
      targetProgress = Math.max(targetProgress, val);
      if (val < 30) {
        setStatusMessage('INITIALIZING 3D ENGINE // WEBGL2');
      } else if (val < 65) {
        setStatusMessage('SCANNING BHARAT FLEET // TATA · MAHINDRA · TOYOTA');
      } else if (val < 90) {
        setStatusMessage('CALIBRATING STUDIO ENVIRONMENT // ACES FILMIC');
      } else {
        setStatusMessage('SYSTEMS NOMINAL // IGNITION ARMED');
      }
    };

    // Custom event dispatched when Three.js finishes rendering first frame
    const handleReady = () => {
      targetProgress = 100;
      setProgress(100);
      setSpeed(320);
      setRpm(8000);
      setStatusMessage('ENGINE IGNITED // LAUNCHING');
      setIsReady(true);
    };

    window.addEventListener('rydely-3d-progress', handleProgress);
    window.addEventListener('rydely-3d-ready', handleReady);

    // Failsafe timeout: unlock after 4.5 seconds if 3D model takes too long
    const failsafe = setTimeout(() => {
      handleReady();
    }, 4500);

    return () => {
      clearInterval(ticker);
      clearTimeout(failsafe);
      window.removeEventListener('rydely-3d-progress', handleProgress);
      window.removeEventListener('rydely-3d-ready', handleReady);
    };
  }, []);

  // When 100% reached and 3D car is ready, trigger hyperdrive warp dissolve
  useEffect(() => {
    if (isReady && progress >= 100) {
      const timer = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setIsDestroyed(true);
        }, 750);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isReady, progress]);

  // Remove completely from DOM when animation finishes
  if (isDestroyed) return null;

  // Gauge arc stroke offset calculations
  const circumference = 2 * Math.PI * 88;
  const strokeOffset = circumference - (circumference * (progress * 0.75)) / 100;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-[#070404] text-white select-none overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isFading ? 'opacity-0 scale-110 blur-md pointer-events-none' : 'opacity-100 scale-100 blur-0'
      }`}
    >
      {/* --- Keyframe Animation Styles --- */}
      <style>{`
        @keyframes cyberGrid {
          0% { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }
        @keyframes laserBar {
          0% { transform: translateX(-120%); opacity: 0.1; }
          50% { transform: translateX(120%); opacity: 0.8; }
          100% { transform: translateX(-120%); opacity: 0.1; }
        }
        @keyframes beamSweep {
          0%, 100% { opacity: 0.2; transform: rotate(-10deg); }
          50% { opacity: 0.7; transform: rotate(10deg); }
        }
        @keyframes hudFlash {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.3; }
        }
        .grid-floor {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(220, 38, 38, 0.16) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(220, 38, 38, 0.16) 1px, transparent 1px);
          animation: cyberGrid 1.2s linear infinite;
        }
      `}</style>

      {/* --- Ambient Background Lighting & Perspective Grid --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(180, 20, 20, 0.35) 0%, rgba(220, 38, 38, 0.12) 50%, transparent 80%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Perspective Road Floor */}
        <div
          className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[160vw] h-[55vh] grid-floor origin-bottom pointer-events-none opacity-40"
          style={{
            transform: 'perspective(450px) rotateX(68deg)',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 15%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 15%, transparent 90%)',
          }}
        />

        {/* Headlight Beam Sweep */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[300px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(239, 68, 68, 0.14) 0%, transparent 70%)',
            animation: 'beamSweep 4s ease-in-out infinite',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* --- Top HUD Telemetry Bar --- */}
      <div className="relative z-10 w-full px-6 sm:px-12 pt-8 flex items-center justify-between text-[10px] font-mono tracking-widest text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-white font-bold">RYDELY_CORE // V3.2</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-red-400">INDIA_EXPRESSWAY_NETWORK</span>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-slate-500">FASTAG:</span>
            <span className="text-emerald-400 font-bold">CONNECTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">MODE:</span>
            <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/30 text-red-300 font-bold">
              LAUNCH_CONTROL
            </span>
          </div>
        </div>
      </div>

      {/* --- Center Cockpit HUD Instrument Cluster --- */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-4">

        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-6">

          {/* Speedometer Ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="#1c0a0a"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * 0.25}
              strokeLinecap="round"
            />
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="url(#speedGradient)"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              className="transition-all duration-150 ease-out"
            />
            <defs>
              <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#991b1b" />
                <stop offset="65%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>
          </svg>

          {/* Internal rotating dashed bezel */}
          <div className="absolute inset-4 rounded-full border border-red-500/10 flex items-center justify-center">
            <div className="w-full h-full rounded-full border-2 border-dashed border-red-500/20 animate-[spin_20s_linear_infinite]" />
          </div>

          {/* Digital Telemetry Display */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <div className="flex items-baseline justify-center">
              <span className="font-['Outfit'] font-black text-6xl sm:text-7xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-red-100 to-red-400 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                {speed}
              </span>
              <span className="font-mono text-xs font-bold text-red-400 ml-1.5 uppercase tracking-widest">
                KM/H
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1 font-mono text-[11px] font-bold">
              <span className="px-2 py-0.5 rounded bg-red-600 text-white shadow-md shadow-red-600/50">
                GEAR 7
              </span>
              <span className="text-slate-400">
                {rpm.toLocaleString()} <span className="text-slate-500 text-[9px]">RPM</span>
              </span>
            </div>

            <div className="mt-3 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950/80 border border-red-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="font-mono text-[10px] text-red-200 font-extrabold tracking-wider">
                {Math.round(progress)}% LOADED
              </span>
            </div>
          </div>

        </div>

        {/* Brand Logo & Laser Scanner */}
        <div className="text-center">
          <div className="inline-block relative">
            <img
              src={carLogo}
              alt="Rydely"
              className="h-14 sm:h-16 w-auto object-contain mx-auto brightness-110 drop-shadow-[0_0_30px_rgba(255,53,53,0.55)]"
            />
            <div className="relative w-full h-[2px] bg-red-950 mt-3 overflow-hidden rounded-full">
              <div
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_10px_#ef4444]"
                style={{ animation: 'laserBar 1.8s ease-in-out infinite' }}
              />
            </div>
          </div>

          <p className="mt-3 text-[11px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase text-red-400/90">
            BHARAT P2P CAR RENTAL & HOST MARKETPLACE
          </p>
        </div>

        {/* Progress HUD Bar */}
        <div className="w-72 sm:w-96 mt-6">
          <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-red-900/40 p-[1px] relative shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-800 via-red-500 to-white shadow-[0_0_15px_rgba(239,68,68,1)] transition-all duration-150 ease-out"
              style={{ width: `${Math.min(100, Math.max(3, progress))}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2.5 text-[10px] font-mono tracking-wider">
            <span className="text-slate-400 flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {statusMessage}
            </span>
            <span className="text-red-400 font-extrabold shrink-0 ml-2">
              READY
            </span>
          </div>
        </div>

      </div>

      {/* --- Bottom Status Footer --- */}
      <div className="relative z-10 w-full px-6 sm:px-12 pb-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-slate-500 tracking-widest border-t border-red-950/40 pt-4">
        <div className="flex items-center gap-4">
          <span>LATENCY: 14MS</span>
          <span>·</span>
          <span>FPS: 120</span>
          <span>·</span>
          <span className="text-slate-400">ENGINE: THREE.JS ACES</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span>PRESS ACCELERATOR TO EMBARK</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
