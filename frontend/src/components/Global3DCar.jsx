// ============================================================
// Global3DCar.jsx — Scrollytelling Interactive Three.js 3D Vehicle
// ------------------------------------------------------------
// This component powers the 3D automotive experience on the homepage:
//   - Single full-screen fixed canvas (`pointer-events: none`)
//   - Loads the BMW i8 GLTF model (`/car-model.gltf`) with GLTFLoader
//   - ACESFilmic tone mapping and RoomEnvironment studio reflections
//   - Shaders calibrated to BMW Melbourne Red Metallic (`#9e080d`)
//   - Stage 1 (Hero `#car-slot-1`): Sleek side-profile view with mouse parallax
//   - Stage 2 (Features `#car-slot-2`): Smoothly rolls and rotates via
//     quaternion spherical linear interpolation (`slerp`) into a
//     bird's-eye top-down view between the 4 featured car cards.
//   - Stage 3: Smoothly fades out as user scrolls toward the footer.
// ============================================================

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const Global3DCar = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- 1. Three.js Renderer Setup ---
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

    // --- 2. Environment Reflections Map ---
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;

    // --- 3. Studio Lighting Rig ---
    const hemiLight = new THREE.HemisphereLight(0xfceeee, 0x200808, 1.4);
    scene.add(hemiLight);

    // Front-Left Key Light: Highlights shoulder lines and hood contour
    const keyLight = new THREE.DirectionalLight(0xfff5f5, 2.2);
    keyLight.position.set(-8, 9, 8);
    scene.add(keyLight);

    // Direct Overhead Studio Light
    const topLight = new THREE.DirectionalLight(0xfff0f0, 1.8);
    topLight.position.set(0, 15, 0);
    scene.add(topLight);

    // Crimson Red Rim Light: Accentuates rear fenders
    const rimLight = new THREE.DirectionalLight(0xbe1c21, 2.2);
    rimLight.position.set(8, 6, -8);
    scene.add(rimLight);

    // Front-Right Fill Light
    const fillLight = new THREE.DirectionalLight(0xfff2f2, 1.2);
    fillLight.position.set(8, -2, 6);
    scene.add(fillLight);

    // Deep Crimson Ground bounce under chassis
    const bounceLight = new THREE.DirectionalLight(0x78060e, 0.9);
    bounceLight.position.set(0, -5, 0);
    scene.add(bounceLight);

    let carLength = 0;
    let carHeight = 0;
    let carWidth = 0;
    let carReady = false;

    // Viewport resize handler
    function handleResize() {
      if (!renderer || !camera) return;
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', handleResize);
    handleResize();

    const carGroup = new THREE.Group();
    scene.add(carGroup);

    // Orientation quaternions
    const qStart = new THREE.Quaternion();
    const qEnd = new THREE.Quaternion();
    const qMouse = new THREE.Quaternion();
    const qMid = new THREE.Quaternion();

    // --- 4. Loading Manager & Dispatch Events ---
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const percent = Math.round((itemsLoaded / itemsTotal) * 100);
      window.dispatchEvent(new CustomEvent('rydely-3d-progress', { detail: { progress: percent } }));
    };
    loadingManager.onLoad = () => {
      window.dispatchEvent(new CustomEvent('rydely-3d-progress', { detail: { progress: 100 } }));
    };

    // --- 5. Load the 3D GLTF Vehicle Model ---
    const gltfLoader = new GLTFLoader(loadingManager);
    gltfLoader.load(
      '/car-model.gltf',
      (gltf) => {
        const carModel = gltf.scene;

        // Custom material shaders: BMW Melbourne Red metallic finish
        carModel.traverse((meshNode) => {
          if (!meshNode.isMesh) return;
          meshNode.castShadow = true;
          meshNode.receiveShadow = true;
          if (meshNode.material) {
            meshNode.material.envMapIntensity = 0.60;
            const materialName = (meshNode.material.name || meshNode.name || '').toLowerCase();

            // Clearcoat: Controlled, sleek automotive clearcoat
            if ('clearcoat' in meshNode.material) {
              meshNode.material.clearcoat = 0.28;
              meshNode.material.clearcoatRoughness = 0.38;
            }

            // Main Car Body Paint: Melbourne Red Metallic (#9e080d)
            if (materialName.includes('paint')) {
              meshNode.material.color = new THREE.Color(0x9e080d);
              meshNode.material.roughness = 0.36;
              meshNode.material.metalness = 0.30;
              meshNode.material.envMapIntensity = 0.65;
            }
            // Aero Accents & Calipers: Cohesive Deep Crimson Red
            else if (materialName.includes('material') || materialName.includes('blu') || materialName.includes('cali')) {
              meshNode.material.color = new THREE.Color(0x8a060b);
              meshNode.material.roughness = 0.38;
              meshNode.material.metalness = 0.25;
              meshNode.material.envMapIntensity = 0.55;
            }
            // Canopy / Roof / Hood Center: Cohesive Deep Red Body
            else if (materialName.includes('glack')) {
              meshNode.material.color = new THREE.Color(0x8c070c);
              meshNode.material.roughness = 0.38;
              meshNode.material.metalness = 0.25;
              meshNode.material.envMapIntensity = 0.55;
            }
            // Glass Canopy & Windshield: Deep tinted automotive glass
            else if (materialName.includes('glass')) {
              meshNode.material.transparent = true;
              meshNode.material.opacity = 0.58;
              meshNode.material.roughness = 0.10;
              meshNode.material.metalness = 0.10;
              meshNode.material.color = new THREE.Color(0x1f2937);
              meshNode.material.envMapIntensity = 0.70;
            }
            // Wheels / Rims: Machined Silver Alloy
            else if (materialName.includes('chrome') || materialName.includes('bhrome') || materialName.includes('disc')) {
              meshNode.material.color = new THREE.Color(0xd5dade);
              meshNode.material.metalness = 0.85;
              meshNode.material.roughness = 0.25;
              meshNode.material.envMapIntensity = 0.70;
            }
            // Headlights & Taillights
            else if (materialName.includes('light')) {
              meshNode.material.emissive = new THREE.Color(0xff3333);
              meshNode.material.emissiveIntensity = 1.6;
            }
            // Lower bumper, diffuser, and tires: Sleek Dark Charcoal
            else if (materialName.includes('tire') || materialName.includes('mlack') || materialName.includes('bumpa')) {
              meshNode.material.color = new THREE.Color(0x1c1c1f);
              meshNode.material.roughness = 0.80;
              meshNode.material.metalness = 0.05;
              meshNode.material.envMapIntensity = 0.25;
            }
          }
        });

        // Compute accurate dimensions along all 3 axes
        const boundingBox = new THREE.Box3().setFromObject(carModel);
        const centerVector = boundingBox.getCenter(new THREE.Vector3());
        const sizeVector = boundingBox.getSize(new THREE.Vector3());
        carModel.position.sub(centerVector);
        carGroup.add(carModel);

        carLength = sizeVector.z;
        carWidth = sizeVector.x;
        carHeight = sizeVector.y;

        // Start orientation (Hero): side profile, nose pointing LEFT (-X), roof pointing UP (+Y)
        qStart.setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0));

        // End orientation (Features): bird's-eye top-down view, nose pointing DOWN screen (-Y)
        qEnd.setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));

        carReady = true;

        // Pre-render immediate first frame to avoid any canvas flicker
        const heroSlotRect = document.getElementById('car-slot-1')?.getBoundingClientRect();
        if (heroSlotRect) {
          const tanHalfFov = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
          const initialDist = Math.max(
            (carLength * window.innerHeight) / (heroSlotRect.width * 0.88 * tanHalfFov),
            (carHeight * window.innerHeight) / (heroSlotRect.height * 0.82 * tanHalfFov)
          );
          camera.position.set(0, 0, initialDist);
          camera.lookAt(0, 0, 0);
          carGroup.quaternion.copy(qStart);
          renderer.render(scene, camera);
        }

        // Notify preloader that 3D scene is rendered and ready!
        window.dispatchEvent(new CustomEvent('rydely-3d-ready'));
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 95);
          window.dispatchEvent(new CustomEvent('rydely-3d-progress', { detail: { progress: percent } }));
        }
      },
      (err) => {
        console.error('Failed to load car model:', err);
        window.dispatchEvent(new CustomEvent('rydely-3d-ready'));
      }
    );

    // --- 6. Mouse Turntable Parallax in Hero ---
    let targetYaw = 0;
    let targetPitch = 0;
    let mouseYaw = 0;
    let mousePitch = 0;

    const handleMouseMove = (e) => {
      const normalizedX = e.clientX / window.innerWidth - 0.5;
      const normalizedY = e.clientY / window.innerHeight - 0.5;
      targetYaw = normalizedX * 0.35;
      targetPitch = normalizedY * 0.08;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const smoothstep = (t) => t * t * (3 - 2 * t);
    let animationFrameId = null;
    let lastOpacity = 1;

    // --- 7. Main Scrollytelling Animation Loop ---
    function renderLoop() {
      animationFrameId = requestAnimationFrame(renderLoop);
      if (!carReady) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const heroSlot = document.getElementById('car-slot-1');
      const featuresSlot = document.getElementById('car-slot-2');
      const ownerSection = document.getElementById('owner-section');

      if (!heroSlot || !featuresSlot) return;

      // Graceful fade out when scrolling into lower sections
      if (ownerSection) {
        const ownerRect = ownerSection.getBoundingClientRect();
        if (ownerRect.top < viewportHeight) {
          const fadeAmount = THREE.MathUtils.clamp(ownerRect.top / (viewportHeight * 0.6), 0, 1);
          if (Math.abs(fadeAmount - lastOpacity) > 0.01) {
            canvas.style.opacity = String(fadeAmount);
            lastOpacity = fadeAmount;
          }
        } else if (lastOpacity !== 1) {
          canvas.style.opacity = '1';
          lastOpacity = 1;
        }
      }

      // Responsive fallback for mobile viewports (car stays parked in Hero)
      if (viewportWidth <= 900) {
        const r1 = heroSlot.getBoundingClientRect();
        const tanHalfFov = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const dist = Math.max(
          (carLength * viewportHeight) / (r1.width * 0.88 * tanHalfFov),
          (carHeight * viewportHeight) / (r1.height * 0.82 * tanHalfFov)
        );
        const worldPerPixel = (dist * tanHalfFov) / viewportHeight;
        const screenCenterX = r1.left + r1.width / 2;
        const screenCenterY = r1.top + r1.height / 2;
        carGroup.position.set((screenCenterX - viewportWidth / 2) * worldPerPixel, -(screenCenterY - viewportHeight / 2) * worldPerPixel, 0);

        mouseYaw += (targetYaw - mouseYaw) * 0.06;
        mousePitch += (targetPitch - mousePitch) * 0.06;
        qMouse.setFromEuler(new THREE.Euler(mousePitch, mouseYaw, 0));
        carGroup.quaternion.copy(qMouse).multiply(qStart);

        camera.position.set(0, 0, dist);
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        return;
      }

      // --- Scrollytelling Transition: Hero (#car-slot-1) → Featured (#car-slot-2) ---
      const rect1 = heroSlot.getBoundingClientRect();
      const rect2 = featuresSlot.getBoundingClientRect();

      const currentScrollY = window.scrollY;
      const slot2CenterDocY = rect2.top + currentScrollY + rect2.height / 2;
      const targetScrollY = Math.max(1, slot2CenterDocY - viewportHeight / 2);

      const rawProgress = THREE.MathUtils.clamp(currentScrollY / targetScrollY, 0, 1);
      const progressEased = smoothstep(rawProgress);

      // Blend slot positions in viewport coordinates
      const currentCenterX = THREE.MathUtils.lerp(rect1.left + rect1.width / 2, rect2.left + rect2.width / 2, progressEased);
      const currentCenterY = THREE.MathUtils.lerp(rect1.top + rect1.height / 2, rect2.top + rect2.height / 2, progressEased);

      // Camera distance calculation: fits nicely across slot bounds
      const tanHalfFov = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const distHero = Math.max(
        (carLength * viewportHeight) / (rect1.width * 0.88 * tanHalfFov),
        (carHeight * viewportHeight) / (rect1.height * 0.82 * tanHalfFov)
      );
      const distTopDown = Math.max(
        (carLength * viewportHeight) / (rect2.height * 0.86 * tanHalfFov),
        (carWidth * viewportHeight) / (rect2.width * 0.82 * tanHalfFov)
      );
      const currentDist = THREE.MathUtils.lerp(distHero, distTopDown, progressEased);

      // Move 3D group to match calculated viewport screen coordinates
      const worldPerPixel = (currentDist * tanHalfFov) / viewportHeight;
      carGroup.position.set((currentCenterX - viewportWidth / 2) * worldPerPixel, -(currentCenterY - viewportHeight / 2) * worldPerPixel, 0);

      // Mouse turntable parallax in Hero (fades smoothly out as scroll progresses)
      mouseYaw += (targetYaw - mouseYaw) * 0.06;
      mousePitch += (targetPitch - mousePitch) * 0.06;
      const mouseParallaxMultiplier = Math.max(0, 1 - progressEased * 1.5);
      qMouse.setFromEuler(new THREE.Euler(mousePitch * mouseParallaxMultiplier, mouseYaw * mouseParallaxMultiplier, 0));

      // Continuous spherical linear interpolation between side profile and top-down view
      qMid.slerpQuaternions(qStart, qEnd, progressEased);
      carGroup.quaternion.copy(qMouse).multiply(qMid);

      camera.position.set(0, 0, currentDist);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    renderLoop();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
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
