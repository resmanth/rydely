import { Link } from 'react-router-dom';
import bannerCar from '../assets/cars/bmw-offer.png';

const OwnerBanner = () => {
  return (
    <section id="owner-section" className="py-16 lg:py-20 bg-[#070404] font-['Outfit'] border-t border-red-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Curved Crimson Banner Card */}
        <div className="relative rounded-3xl bg-gradient-to-r from-red-950 via-red-800 to-rose-950 text-white px-8 py-12 sm:px-12 sm:py-14 lg:px-16 lg:py-16 overflow-hidden shadow-2xl shadow-red-950/60 border border-red-500/30">
          
          {/* Subtle Ambient Radial Lighting */}
          <div
            className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-950/80 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 max-w-xl">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-red-200 mb-2 px-3.5 py-1 rounded-full bg-red-900/50 border border-red-400/30">
                🇮🇳 Car Owner Host Program
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                Turn Your Parked Car into ₹50,000+ Every Month
              </h2>
              
              <p className="text-sm sm:text-base text-red-100/90 leading-relaxed mb-6 font-normal">
                Have a car sitting idle in your garage or driveway? List it on Rydely and rent it out to verified guests. Set your own daily price, maintain 100% control of your calendar, and rest easy with ₹20 Lakh insurance coverage.
              </p>

              {/* 3 Indian Host Benefits Chips */}
              <div className="grid grid-cols-3 gap-3 mb-8 text-center">
                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 border border-red-500/20">
                  <span className="block text-lg font-black text-white">₹50,000+</span>
                  <span className="text-[10px] text-red-200 uppercase tracking-wider font-semibold">Avg. Host Earnings</span>
                </div>
                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 border border-red-500/20">
                  <span className="block text-lg font-black text-white">₹20 Lakh</span>
                  <span className="text-[10px] text-red-200 uppercase tracking-wider font-semibold">Insurance & Damage Cover</span>
                </div>
                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 border border-red-500/20">
                  <span className="block text-lg font-black text-white">Instant UPI</span>
                  <span className="text-[10px] text-red-200 uppercase tracking-wider font-semibold">Direct Bank Payouts</span>
                </div>
              </div>

              <div>
                <Link
                  to="/offer-ride"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-white hover:bg-red-50 text-slate-950 text-sm font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  List your car for rent in 5 mins →
                </Link>
              </div>
            </div>

            {/* Right Car Visual Column */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative mt-4 lg:mt-0">
              <div className="relative w-full max-w-md">
                <img
                  src={bannerCar}
                  alt="List your car for rent across India"
                  className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.65)] transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default OwnerBanner;
