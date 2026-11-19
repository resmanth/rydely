/**
 * Global3DCar.jsx
 *
 * Implements silky-smooth scrollytelling mechanics inspired by
 * https://templates.makedreamwebsite.com/3d-car-website/
 *
 * - Single fixed Three.js canvas over the entire page (pointer-events: none)
 * - In Hero (#car-slot-1): car is in sleek side-profile view with mouse-follow parallax
 * - As user scrolls toward Features (#car-slot-2): car smoothly travels down the screen,
 *   rolls and rotates into a TOP-DOWN (bird's-eye) view, docking perfectly between
 *   the 4 featured cards!
 * - High-end studio lighting with RoomEnvironment HDR reflections, bright Alpine pearl paint,
 *   and glowing BMW Electric Blue trim so the car never looks dark.
 * - Synchronized with Lenis smooth-scrolling for zero-jitter, continuous 60/120fps motion.
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const Global3DCar = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Three.js Renderer ──
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 2000);

    // ── Environment Map (Soft ambient studio fill for rich Melbourne Red pigment) ──
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;

    // ── High-End Automotive Studio Lighting (Matches reference car studio gradient) ──
    const hemi = new THREE.HemisphereLight(0xfceeee, 0x200808, 1.4);
    scene.add(hemi);

    // Front-Left Key Light (Casts crisp highlight along shoulder line & hood contour)
    const key = new THREE.DirectionalLight(0xfff5f5, 2.2);
    key.position.set(-8, 9, 8);
    scene.add(key);

    // Direct Overhead Studio Light
    const topLight = new THREE.DirectionalLight(0xfff0f0, 1.8);
    topLight.position.set(0, 15, 0);
    scene.add(topLight);

    // Crimson Red Rim Light (Accentuates rear fenders & roofline in deep red)
    const rim = new THREE.DirectionalLight(0xbe1c21, 2.2);
    rim.position.set(8, 6, -8);
    scene.add(rim);

    // Front-Right Fill Light
    const fill = new THREE.DirectionalLight(0xfff2f2, 1.2);
    fill.position.set(8, -2, 6);
    scene.add(fill);

    // Deep Crimson Ground bounce under chassis
    const bounce = new THREE.DirectionalLight(0x78060e, 0.9);
    bounce.position.set(0, -5, 0);
    scene.add(bounce);

    let carLength = 0;
    let carHeight = 0;
    let carWidth = 0;
    let carReady = false;

    function resize() {
      if (!renderer || !camera) return;
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    const group = new THREE.Group();
    scene.add(group);

    const qStart = new THREE.Quaternion();
    const qEnd = new THREE.Quaternion();
    const qMouse = new THREE.Quaternion();
    const qMid = new THREE.Quaternion();

    // ── Loading Manager & Events ──
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const p = Math.round((itemsLoaded / itemsTotal) * 100);
      window.dispatchEvent(new CustomEvent('rydely-3d-progress', { detail: { progress: p } }));
    };
    loadingManager.onLoad = () => {
      window.dispatchEvent(new CustomEvent('rydely-3d-progress', { detail: { progress: 100 } }));
    };

    // ── Load the BMW i8 model ──
    const loader = new GLTFLoader(loadingManager);
    loader.load(
      '/car-model.gltf',
      (gltf) => {
        const car = gltf.scene;

        // Custom showroom material tuning (Exact BMW Melbourne Red from reference photo)
        car.traverse((o) => {
          if (!o.isMesh) return;
          o.castShadow = true;
          o.receiveShadow = true;
          if (o.material) {
            o.material.envMapIntensity = 0.60;
            const matName = (o.material.name || o.name || '').toLowerCase();

            // Clearcoat: Controlled, sleek automotive clearcoat (less shiny, no harsh mirror glare)
            if ('clearcoat' in o.material) {
              o.material.clearcoat = 0.28;
              o.material.clearcoatRoughness = 0.38;
            }

            // Main Car Body Paint: Melbourne Red Metallic (Sampled directly from user reference photo)
            if (matName.includes('paint')) {
              o.material.color = new THREE.Color(0x9e080d); // Deep metallic Melbourne Red (#9e080d)
              o.material.roughness = 0.36; // Luxurious automotive clearcoat sheen
              o.material.metalness = 0.30; // Subtle metallic flake depth
              o.material.envMapIntensity = 0.65;
            }
            // Aero Accents & Calipers: Cohesive Deep Crimson Red
            else if (matName.includes('material') || matName.includes('blu') || matName.includes('cali')) {
              o.material.color = new THREE.Color(0x8a060b); // Deep rich crimson
              o.material.roughness = 0.38;
              o.material.metalness = 0.25;
              o.material.envMapIntensity = 0.55;
            }
            // Canopy / Roof / Hood Center: Cohesive Deep Red Body
            else if (matName.includes('glack')) {
              o.material.color = new THREE.Color(0x8c070c); // Matching deep red tone
              o.material.roughness = 0.38;
              o.material.metalness = 0.25;
              o.material.envMapIntensity = 0.55;
            }
            // Glass Canopy & Windshield: Deep tinted automotive glass
            else if (matName.includes('glass')) {
              o.material.transparent = true;
              o.material.opacity = 0.58;
              o.material.roughness = 0.10;
              o.material.metalness = 0.10;
              o.material.color = new THREE.Color(0x1f2937);
              o.material.envMapIntensity = 0.70;
            }
            // Wheels / Rims: Machined Silver Alloy (Matches photo)
            else if (matName.includes('chrome') || matName.includes('bhrome') || matName.includes('disc')) {
              o.material.color = new THREE.Color(0xd5dade);
              o.material.metalness = 0.85;
              o.material.roughness = 0.25;
              o.material.envMapIntensity = 0.70;
            }
            // Headlights & Taillights
            else if (matName.includes('light')) {
              o.material.emissive = new THREE.Color(0xff3333);
              o.material.emissiveIntensity = 1.6;
            }
            // Front & Rear Bumper lower air intakes, diffuser, and tires: Sleek Dark Black/Charcoal (Matches photo lower bumper)
            else if (matName.includes('tire') || matName.includes('mlack') || matName.includes('bumpa')) {
              o.material.color = new THREE.Color(0x1c1c1f);
              o.material.roughness = 0.80;
              o.material.metalness = 0.05;
              o.material.envMapIntensity = 0.25;
            }
          }
        });

        // Compute accurate dimensions along all 3 axes
        const box = new THREE.Box3().setFromObject(car);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        car.position.sub(center);
        group.add(car);

        // In world coordinates of the GLTF:
        // size.z is car length (~5.00), size.x is width (~2.30), size.y is height (~1.44)
        carLength = size.z;
        carWidth = size.x;
        carHeight = size.y;

        // Start orientation (Hero): side profile, nose pointing LEFT (-X), roof pointing UP (+Y), right side facing camera (+Z)
        qStart.setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0));

        // End orientation (Features): bird's-eye top-down view, nose pointing DOWN screen (-Y), roof facing camera (+Z)
        qEnd.setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));

        carReady = true;

        // Pre-render immediate first frame to avoid any canvas flicker
        const r1 = document.getElementById('car-slot-1')?.getBoundingClientRect();
        if (r1) {
          const tan2 = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
          const initDist = Math.max(
            (carLength * window.innerHeight) / (r1.width * 0.88 * tan2),
            (carHeight * window.innerHeight) / (r1.height * 0.82 * tan2)
          );
          camera.position.set(0, 0, initDist);
          camera.lookAt(0, 0, 0);
          group.quaternion.copy(qStart);
          renderer.render(scene, camera);
        }

        // Notify preloader that 3D scene is rendered and ready!
        window.dispatchEvent(new CustomEvent('rydely-3d-ready'));
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          const p = Math.round((xhr.loaded / xhr.total) * 95);
          window.dispatchEvent(new CustomEvent('rydely-3d-progress', { detail: { progress: p } }));
        }
      },
      (err) => {
        console.error('Failed to load car model:', err);
        window.dispatchEvent(new CustomEvent('rydely-3d-ready'));
      }
    );

    // ── Turntable rotation following mouse in Hero ──
    let targetYaw = 0;
    let targetPitch = 0;
    let mouseYaw = 0;
    let mousePitch = 0;

    const handleMouseMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      targetYaw = nx * 0.35;
      targetPitch = ny * 0.08;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const smoothstep = (t) => t * t * (3 - 2 * t);
    let animId = null;
    let lastOpacity = 1;

    function animate() {
      animId = requestAnimationFrame(animate);
      if (!carReady) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const slot1 = document.getElementById('car-slot-1');
      const slot2 = document.getElementById('car-slot-2');
      const ownerSection = document.getElementById('owner-section');

      if (!slot1 || !slot2) return;

      // Graceful fade out when scrolling into lower sections
      if (ownerSection) {
        const ownerRect = ownerSection.getBoundingClientRect();
        if (ownerRect.top < vh) {
          const fade = THREE.MathUtils.clamp(ownerRect.top / (vh * 0.6), 0, 1);
          if (Math.abs(fade - lastOpacity) > 0.01) {
            canvas.style.opacity = String(fade);
            lastOpacity = fade;
          }
        } else if (lastOpacity !== 1) {
          canvas.style.opacity = '1';
          lastOpacity = 1;
        }
      }

      // Responsive fallback for mobile viewports (car stays parked in Hero)
      if (vw <= 900) {
        const r1 = slot1.getBoundingClientRect();
        const tan2 = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const dist = Math.max(
          (carLength * vh) / (r1.width * 0.88 * tan2),
          (carHeight * vh) / (r1.height * 0.82 * tan2)
        );
        const wpp = (dist * tan2) / vh;
        const scx = r1.left + r1.width / 2;
        const scy = r1.top + r1.height / 2;
        group.position.set((scx - vw / 2) * wpp, -(scy - vh / 2) * wpp, 0);

        mouseYaw += (targetYaw - mouseYaw) * 0.06;
        mousePitch += (targetPitch - mousePitch) * 0.06;
        qMouse.setFromEuler(new THREE.Euler(mousePitch, mouseYaw, 0));
        group.quaternion.copy(qMouse).multiply(qStart);

        camera.position.set(0, 0, dist);
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        return;
      }

      // ── Scrollytelling Transition: Slot 1 (Hero) → Slot 2 (Featured Top-Down) ──
      const r1 = slot1.getBoundingClientRect();
      const r2 = slot2.getBoundingClientRect();

      // Target scroll distance is when slot2 is centered in the viewport
      const currentScrollY = window.scrollY;
      const slot2CenterDocY = r2.top + currentScrollY + r2.height / 2;
      const targetScrollY = Math.max(1, slot2CenterDocY - vh / 2);

      const rawProgress = THREE.MathUtils.clamp(currentScrollY / targetScrollY, 0, 1);
      const t = smoothstep(rawProgress);

      // Blend slot positions in viewport coordinates
      const cx = THREE.MathUtils.lerp(r1.left + r1.width / 2, r2.left + r2.width / 2, t);
      const cy = THREE.MathUtils.lerp(r1.top + r1.height / 2, r2.top + r2.height / 2, t);

      // Camera distance:
      // Hero (t=0) fits carLength across slot 1 width and carHeight down slot 1 height;
      // Top view (t=1) fits carLength down slot 2 height and carWidth across slot 2 width
      const tan2 = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const d1 = Math.max(
        (carLength * vh) / (r1.width * 0.88 * tan2),
        (carHeight * vh) / (r1.height * 0.82 * tan2)
      );
      const d2 = Math.max(
        (carLength * vh) / (r2.height * 0.86 * tan2),
        (carWidth * vh) / (r2.width * 0.82 * tan2)
      );
      const dist = THREE.MathUtils.lerp(d1, d2, t);

      // Move the 3D car group to match screen coordinates
      const worldPerPixel = (dist * tan2) / vh;
      group.position.set((cx - vw / 2) * worldPerPixel, -(cy - vh / 2) * worldPerPixel, 0);

      // Mouse turntable parallax in Hero (fades smoothly out as scroll progresses)
      mouseYaw += (targetYaw - mouseYaw) * 0.06;
      mousePitch += (targetPitch - mousePitch) * 0.06;
      const m = Math.max(0, 1 - t * 1.5);
      qMouse.setFromEuler(new THREE.Euler(mousePitch * m, mouseYaw * m, 0));

      // Continuous spherical linear interpolation between side profile and top-down view
      qMid.slerpQuaternions(qStart, qEnd, t);
      group.quaternion.copy(qMouse).multiply(qMid);

      camera.position.set(0, 0, dist);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      pmremGenerator.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="car-canvas"
      className="fixed inset-0 w-screen h-screen pointer-events-none z-30 transition-opacity duration-300"
    />
  );
};

export default Global3DCar;