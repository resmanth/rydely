/**
 * Footer.jsx
 *
 * The site-wide footer rendered at the bottom of every page.
 * Layout (5-column grid on desktop, stacked on mobile):
 *   Column 1-2: Brand logo, description, trust badges, social media links
 *   Column 3:   Popular rental cities (links to /cars?city=...)
 *   Column 4:   Hosts & Renters links (list car, browse, how it works, etc.)
 *   Column 5:   Contact info (address, phone, email, roadside assistance)
 * Bottom bar: Copyright, DPIIT recognition, GSTIN, and legal policy links
 */
import { Link } from 'react-router-dom';
import carLogo from '../assets/carlogo.png';

const Footer = () => {
  return (
    <footer className="bg-[#070404] text-slate-400 font-['Outfit'] border-t border-red-950/40 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        
        {/* --- Main 5-Column Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-zinc-900">
          
          {/* --- Column 1-2: Brand & Description (spans 2 columns on desktop) --- */}
          <div className="lg:col-span-2 space-y-4">
            {/* Rydely logo — links back to homepage */}
            <Link to="/" className="inline-flex items-center group">
              <img
                src={carLogo}
                alt="Rydely"
                className="h-12 w-auto object-contain brightness-110 drop-shadow-[0_0_16px_rgba(255,53,53,0.35)] transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Brief brand description */}
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed font-normal">
              India's premier peer-to-peer self-drive car rental & vehicle sharing marketplace. Connect private car owners with verified drivers for local commutes and outstation road trips with complete insurance coverage.
            </p>

            {/* Trust badges — verification and insurance highlights */}
            <div className="pt-1 flex items-center flex-wrap gap-2 text-[11px] text-slate-300">
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-semibold inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                100% Aadhaar & DL Verified
              </span>
              <span className="px-2.5 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 font-semibold">
                🛡️ ₹20 Lakh Insurance
              </span>
            </div>

            {/* --- Social Media Links --- */}
            <div className="flex items-center gap-3 pt-3 text-slate-400">
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/60 flex items-center justify-center hover:text-red-400 hover:border-red-500 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/60 flex items-center justify-center hover:text-red-400 hover:border-red-500 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" aria-label="Twitter / X" className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/60 flex items-center justify-center hover:text-red-400 hover:border-red-500 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/60 flex items-center justify-center hover:text-red-400 hover:border-red-500 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* --- Column 3: Popular Rental Cities --- */}
          <div>
            <h4 className="text-[11px] font-bold text-white tracking-widest uppercase mb-4 font-mono">
              Top Rental Cities
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/cars?city=Mumbai" className="hover:text-red-400 transition-colors">Rent Cars in Mumbai</Link></li>
              <li><Link to="/cars?city=Bengaluru" className="hover:text-red-400 transition-colors">Rent Cars in Bengaluru</Link></li>
              <li><Link to="/cars?city=Delhi" className="hover:text-red-400 transition-colors">Rent Cars in Delhi NCR</Link></li>
              <li><Link to="/cars?city=Pune" className="hover:text-red-400 transition-colors">Rent Cars in Pune</Link></li>
              <li><Link to="/cars?city=Goa" className="hover:text-red-400 transition-colors">Rent Cars in Goa (Airport)</Link></li>
              <li><Link to="/cars?city=Hyderabad" className="hover:text-red-400 transition-colors">Rent Cars in Hyderabad</Link></li>
            </ul>
          </div>

          {/* --- Column 4: Hosts & Renters Links --- */}
          <div>
            <h4 className="text-[11px] font-bold text-white tracking-widest uppercase mb-4 font-mono">
              Hosts & Renters
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/offer-ride" className="hover:text-red-400 transition-colors font-semibold text-white">List Your Car (Host & Earn)</Link></li>
              <li><Link to="/cars" className="hover:text-red-400 transition-colors">Browse Self-Drive Cars</Link></li>
              <li><Link to="/how-it-works" className="hover:text-red-400 transition-colors">How Car Sharing Works</Link></li>
              <li><Link to="/how-it-works#insurance" className="hover:text-red-400 transition-colors">₹20 Lakh Damage Cover</Link></li>
              <li><Link to="/how-it-works#calculator" className="hover:text-red-400 transition-colors">Host Earnings Calculator</Link></li>
              <li><Link to="/about" className="hover:text-red-400 transition-colors">About Rydely India</Link></li>
            </ul>
          </div>

          {/* --- Column 5: Contact & Support --- */}
          <div>
            <h4 className="text-[11px] font-bold text-white tracking-widest uppercase mb-4 font-mono">
              Contact & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="text-white font-medium">Prestige Tech Park, Outer Ring Rd</li>
              <li>Marathahalli, Bengaluru, KA 560103</li>
              <li className="pt-1 text-slate-300">
                <span className="text-slate-500 font-mono text-[10px]">24/7 HELPLINE:</span> +91 (80) 4567 8900
              </li>
              <li className="text-slate-300">
                <span className="text-slate-500 font-mono text-[10px]">WHATSAPP:</span> +91 98765 43210
              </li>
              <li className="text-red-400 font-medium pt-1">
                support@rydely.in
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                Roadside Assistance: <span className="text-emerald-400 font-semibold">1800-RYDELY (Toll-Free)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* --- Bottom Bar: Copyright, Regulatory Info & Legal Links --- */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Rydely Technologies India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center flex-wrap gap-4 text-[11px] text-slate-400">
            <span>🇮🇳 DPIIT Recognized #DIPP124802</span>
            <span>·</span>
            <span>GSTIN: 29AABCR1234F1Z5</span>
            <span>·</span>
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link to="/cancellation" className="hover:text-slate-300 transition-colors">Cancellation Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
