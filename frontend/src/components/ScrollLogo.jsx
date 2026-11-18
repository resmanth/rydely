import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import carLogo from '../assets/carlogo.png';

const BASE_WIDTH = 240;
const BASE_HEIGHT = 153.6; // 300:192 aspect ratio

const ScrollLogo = () => {
  const logoRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const logoEl = logoRef.current;
    if (!logoEl) return;

    let animId = null;

    const updatePosition = () => {
      const isMobile = window.innerWidth <= 640;

      // Target scale when hovering in Hero vs docked in Navbar
      const heroScale = isMobile ? 0.75 : 1.0; // 180px on mobile, 240px on desktop
      const dockScale = isMobile ? 0.24 : 0.325; // 58px on mobile, 78px on desktop

      // Target dock element in the center of the Navbar
      const dockEl = document.getElementById('navbar-logo-dock');
      const dockRect = dockEl ? dockEl.getBoundingClientRect() : null;

      const dockCenterX = dockRect
        ? dockRect.left + dockRect.width / 2
        : window.innerWidth / 2;
      const dockCenterY = dockRect
        ? dockRect.top + dockRect.height / 2
        : 40;

      // Check if on Home page and hero anchor is in DOM
      const heroAnchor = isHome ? document.getElementById('hero-logo-anchor') : null;

      if (!heroAnchor) {
        // Subpage: dock directly in the navbar
        logoEl.style.transform = `translate3d(${dockCenterX - BASE_WIDTH / 2}px, ${dockCenterY - BASE_HEIGHT / 2}px, 0) scale(${dockScale})`;
        logoEl.style.filter = 'drop-shadow(0 0 10px rgba(255, 53, 53, 0.3)) drop-shadow(0 2px 6px rgba(0,0,0,0.6))';
        logoEl.style.opacity = '1';
        return;
      }

      const heroRect = heroAnchor.getBoundingClientRect();
      const currentScrollY = window.scrollY;

      // Absolute document Y of hero anchor center
      const heroCenterDocY = heroRect.top + currentScrollY + heroRect.height / 2;
      const heroCenterX = heroRect.left + heroRect.width / 2;

      // Total vertical distance the logo travels to dock into the navbar
      const totalDistance = Math.max(80, heroCenterDocY - dockCenterY);

      // Scroll progress from 0 (Hero) to 1 (Docked)
      const rawProgress = Math.min(1, Math.max(0, currentScrollY / totalDistance));

      // Smoothstep easing for a fluid, natural docking feel (Damru Fest style)
      const t = rawProgress * rawProgress * (3 - 2 * rawProgress);

      // Interpolate horizontal center
      const currentCenterX = heroCenterX + (dockCenterX - heroCenterX) * t;

      // Natural viewport Y moves with scroll, eases into dock and clamps at dockCenterY
      const naturalY = heroCenterDocY - currentScrollY;
      const currentCenterY = Math.max(dockCenterY, naturalY + (dockCenterY - naturalY) * t);

      // Scale interpolates smoothly from heroScale to dockScale
      const currentScale = heroScale + (dockScale - heroScale) * t;

      // Soften drop shadow as it docks
      const blurRadius = Math.round(28 * (1 - t) + 8 * t);
      const glowOpacity = (0.5 * (1 - t) + 0.22 * t).toFixed(2);

      logoEl.style.transform = `translate3d(${currentCenterX - BASE_WIDTH / 2}px, ${currentCenterY - BASE_HEIGHT / 2}px, 0) scale(${currentScale})`;
      logoEl.style.filter = `drop-shadow(0 0 ${blurRadius}px rgba(255, 53, 53, ${glowOpacity})) drop-shadow(0 4px 12px rgba(0,0,0,0.6))`;
      logoEl.style.opacity = '1';
    };

    const loop = () => {
      updatePosition();
      animId = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('resize', updatePosition);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isHome]);

  const handleClick = (e) => {
    e.preventDefault();
    if (isHome) {
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
      onClick={handleClick}
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
