// ============================================================
// ScrollLogo.jsx — Dynamic Scrollytelling Logo Animation
// ------------------------------------------------------------
// This component renders the Rydely brand logo with interactive physics:
//   - On Homepage: Starts prominent in the Hero section, and as the user
//     scrolls down, it smoothly glides and scales down to dock into
//     the center of the sticky Navbar (`#navbar-logo-dock`).
//   - On Subpages: Stays permanently docked neatly in the Navbar.
//   - Clicking the logo scrolls smoothly back to top (on Home) or navigates to `/`.
// ============================================================

import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import carLogo from '../assets/carlogo.png';

// Native base dimensions of carlogo.png (300:192 aspect ratio)
const BASE_WIDTH = 240;
const BASE_HEIGHT = 153.6;

const ScrollLogo = () => {
  const logoRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const logoElement = logoRef.current;
    if (!logoElement) return;

    let animationFrameId = null;

    // Recalculates exact coordinates of Hero anchor and Navbar dock on every frame
    const updateLogoPosition = () => {
      const isMobile = window.innerWidth <= 640;

      // Scale targets: Hero vs Docked in Navbar
      const heroScale = isMobile ? 0.75 : 1.0;
      const dockScale = isMobile ? 0.24 : 0.325;

      // Find navbar target dock element
      const dockElement = document.getElementById('navbar-logo-dock');
      const dockRect = dockElement ? dockElement.getBoundingClientRect() : null;

      const dockCenterX = dockRect
        ? dockRect.left + dockRect.width / 2
        : window.innerWidth / 2;
      const dockCenterY = dockRect
        ? dockRect.top + dockRect.height / 2
        : 40;

      // Check if on Home page and hero anchor is in DOM
      const heroAnchor = isHomePage ? document.getElementById('hero-logo-anchor') : null;

      // If on subpage (or hero anchor not present), dock directly in the navbar
      if (!heroAnchor) {
        logoElement.style.transform = `translate3d(${dockCenterX - BASE_WIDTH / 2}px, ${dockCenterY - BASE_HEIGHT / 2}px, 0) scale(${dockScale})`;
        logoElement.style.filter = 'drop-shadow(0 0 10px rgba(255, 53, 53, 0.3)) drop-shadow(0 2px 6px rgba(0,0,0,0.6))';
        logoElement.style.opacity = '1';
        return;
      }

      const heroRect = heroAnchor.getBoundingClientRect();
      const currentScrollY = window.scrollY;

      // Absolute document coordinates of hero anchor center
      const heroCenterDocY = heroRect.top + currentScrollY + heroRect.height / 2;
      const heroCenterX = heroRect.left + heroRect.width / 2;

      // Total vertical distance the logo travels to dock into the navbar
      const totalDistance = Math.max(80, heroCenterDocY - dockCenterY);

      // Scroll progress from 0 (Hero) to 1 (Docked)
      const rawProgress = Math.min(1, Math.max(0, currentScrollY / totalDistance));

      // Smoothstep easing for a natural docking feel
      const progressEased = rawProgress * rawProgress * (3 - 2 * rawProgress);

      // Interpolate horizontal & vertical position
      const currentCenterX = heroCenterX + (dockCenterX - heroCenterX) * progressEased;
      const naturalY = heroCenterDocY - currentScrollY;
      const currentCenterY = Math.max(dockCenterY, naturalY + (dockCenterY - naturalY) * progressEased);

      // Scale smoothly interpolates from heroScale to dockScale
      const currentScale = heroScale + (dockScale - heroScale) * progressEased;

      // Soften drop shadow glow as it docks
      const blurRadius = Math.round(28 * (1 - progressEased) + 8 * progressEased);
      const glowOpacity = (0.5 * (1 - progressEased) + 0.22 * progressEased).toFixed(2);

      logoElement.style.transform = `translate3d(${currentCenterX - BASE_WIDTH / 2}px, ${currentCenterY - BASE_HEIGHT / 2}px, 0) scale(${currentScale})`;
      logoElement.style.filter = `drop-shadow(0 0 ${blurRadius}px rgba(255, 53, 53, ${glowOpacity})) drop-shadow(0 4px 12px rgba(0,0,0,0.6))`;
      logoElement.style.opacity = '1';
    };

    const renderLoop = () => {
      updateLogoPosition();
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    window.addEventListener('resize', updateLogoPosition);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateLogoPosition);
    };
  }, [isHomePage]);

  // Click handler: smooth scroll to top on Home, navigate to / on subpages
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (isHomePage) {
      if (window.scrollY > 30) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div
      ref={logoRef}
      onClick={handleLogoClick}
      role="button"
      tabIndex={0}
      aria-label="Rydely Home"
      className="fixed top-0 left-0 z-50 pointer-events-auto cursor-pointer select-none origin-center"
      style={{
        width: `${BASE_WIDTH}px`,
        height: `${BASE_HEIGHT}px`,
        willChange: 'transform',
        opacity: 0,
        transition: 'opacity 0.25s ease-out',
      }}
    >
      <img
        src={carLogo}
        alt="Rydely"
        className="w-full h-full object-contain brightness-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
      />
    </div>
  );
};

export default ScrollLogo;
