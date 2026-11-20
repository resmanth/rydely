// ============================================================
// Home.jsx — Rydely Homepage Landing Page
// ------------------------------------------------------------
// This is the main entry page of Rydely. It renders sequential
// scrollytelling sections in order:
//   1. Global3DCar: Persistent Three.js 3D car canvas that animates on scroll
//   2. Hero: Headline, tagline, and city/date search widget
//   3. FeaturedVehicles: Carousel/grid of top available luxury cars
//   4. OwnerBanner: "List Your Car" monetization call-to-action banner
//   5. Testimonials: Verified customer rental reviews
//   6. Newsletter: Email subscription form for exclusive rental deals
// ============================================================

import Global3DCar from '../components/Global3DCar';
import Hero from '../components/Hero';
import FeaturedVehicles from '../components/FeaturedVehicles';
import OwnerBanner from '../components/OwnerBanner';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <div className="bg-[#070404] text-white relative">
      {/* ── Fixed 3D Car Scrollytelling Layer ── */}
      <Global3DCar />

      {/* ── 1. Hero Section (Headline & City Search Bar) ── */}
      <Hero />

      {/* ── 2. Featured Vehicles Catalog Highlights ── */}
      <FeaturedVehicles />

      {/* ── 3. Host Monetization CTA Banner ── */}
      <OwnerBanner />

      {/* ── 4. Customer Reviews & Ratings ── */}
      <Testimonials />

      {/* ── 5. Newsletter Subscription ── */}
      <Newsletter />
    </div>
  );
};

export default Home;
