import Global3DCar from '../components/Global3DCar';
import Hero from '../components/Hero';
import FeaturedVehicles from '../components/FeaturedVehicles';
import OwnerBanner from '../components/OwnerBanner';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <div className="bg-[#070404] text-white relative">
      {/* ── Fixed 3D Car Scrollytelling Layer (Matches templates.makedreamwebsite.com) ── */}
      <Global3DCar />

      {/* 1. Hero Stage (Starts in side-profile with video background & search) */}
      <Hero />

      {/* 2. Featured Vehicles (Smoothly travels down into top-down view between the 4 cards) */}
      <FeaturedVehicles />

      {/* 3. Owner Monetization CTA Banner (Car fades out as page continues) */}
      <OwnerBanner />

      {/* 4. Customer Testimonials */}
      <Testimonials />

      {/* 5. Newsletter Deal Subscription */}
      <Newsletter />
    </div>
  );
};

export default Home;
