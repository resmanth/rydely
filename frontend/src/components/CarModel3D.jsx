/* eslint-disable react-hooks/immutability */
/**
 * CarModel3D.jsx — BMW i8 GLTF Hero Viewer
 *
 * Enhanced to:
 *  - Make the 3D car significantly larger and bolder (targetSize: 5.0)
 *  - Position it at a cinematic 3/4 angle on the highway road
 *  - Natural outdoor highway lighting (sunlight + sky fill + BMW Electric Blue underglow)
 *  - Interactive: slow idle floating / rotation, drag to orbit, hover pause, scroll sink
 */

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

// Preload the BMW i8 model
useGLTF.preload('/car-model.gltf');

// ── Sleek Loader ────────────────────────────────────────────────────────────
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-sky-400 font-['Outfit'] text-xs font-semibold tracking-widest uppercase bg-black/60 backdrop-blur-md px-5 py-3 rounded-full border border-sky-500/30 shadow-2xl">
        <svg className="w-5 h-5 animate-spin text-sky-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span>Loading BMW i8…</span>
      </div>
    </Html>
  );
}

// ── The 3D car mesh ─────────────────────────────────────────────────────────
function CarMesh({ scrollY, hovered, setHovered }) {
  const groupRef = useRef();
  const { scene } = useGLTF('/car-model.gltf');

  useEffect(() => {
    // Auto-compute bounding box to centre & scale the car
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const centre = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(centre);

    // Centre the model on origin
    scene.position.sub(centre);

    // Make car significantly bigger to span more width: 6.8 units across
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 6.8;
    scene.scale.setScalar(targetSize / maxDim);

    // Sit directly on the ground plane (y = 0)
    const newBox = new THREE.Box3().setFromObject(scene);
    scene.position.y -= newBox.min.y;

    // Enhance materials: BMW Melbourne Red (Exact match to reference photo)
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.envMapIntensity = 0.60;
        const matName = (child.material.name || child.name || '').toLowerCase();

        if ('clearcoat' in child.material) {
          child.material.clearcoat = 0.28;
          child.material.clearcoatRoughness = 0.38;
        }

        if (matName.includes('paint')) {
          child.material.color = new THREE.Color(0x9e080d);
          child.material.roughness = 0.36;
          child.material.metalness = 0.30;
        } else if (matName.includes('material') || matName.includes('blu') || matName.includes('cali')) {
          child.material.color = new THREE.Color(0x8a060b);
          child.material.roughness = 0.38;
          child.material.metalness = 0.25;
        } else if (matName.includes('glass')) {
          child.material.transparent = true;
          child.material.opacity = 0.58;
          child.material.roughness = 0.10;
        } else if (matName.includes('glack')) {
          child.material.color = new THREE.Color(0x8c070c);
          child.material.roughness = 0.38;
          child.material.metalness = 0.25;
        }
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Slow subtle rotation when idle
    if (!hovered) {
      groupRef.current.rotation.y += delta * 0.18;
    }

    // Scroll-driven Y sink (car sinks as user scrolls)
    const targetY = -(scrollY * 0.0022);
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.08
    );

    // Gentle scale bounce on hover
    const targetScale = hovered ? 1.04 : 1.0;
    const current = groupRef.current.scale.x;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(current, targetScale, 0.1)
    );
  });

  return (
    <primitive
      ref={groupRef}
      object={scene}
      rotation={[0, -0.35, 0]} // Initial stylish 3/4 highway road angle
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}

// ── Main Exported Component ─────────────────────────────────────────────────
const CarModel3D = ({ scrollY = 0 }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="w-full h-[400px] sm:h-[500px] md:h-[580px] lg:h-[650px] relative"
      style={{
        cursor: hovered ? 'grab' : 'default',
        opacity: Math.max(0, 1 - scrollY / 600),
        transition: 'opacity 0.15s ease-out',
      }}
    >
      <Canvas
        shadows
        camera={{ position: [2.5, 1.15, 3.8], fov: 46 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ background: 'transparent' }}
      >
        {/* Soft Ambient Sky Fill */}
        <ambientLight intensity={0.85} color="#e0f2fe" />

        {/* Direct Warm Golden-Hour Sunlight */}
        <directionalLight
          position={[12, 16, 7]}
          intensity={2.6}
          color="#fffaf0"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={30}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
        />

        {/* Sky Fill Light (Cool Blue) */}
        <directionalLight position={[-8, 7, -5]} intensity={0.9} color="#7dd3fc" />

        {/* BMW Electric Blue Ground Reflection under chassis */}
        <pointLight position={[0, -0.1, 0]} intensity={1.8} color="#0284c7" distance={8} decay={2} />

        {/* Realistic Sunset/Outdoor Highway Environment */}
        <Environment preset="sunset" />

        {/* Realistic Contact Shadow on Highway Asphalt - wider span */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.8}
          scale={24}
          blur={2.4}
          far={6}
          color="#050814"
        />

        {/* Car Model */}
        <Suspense fallback={<Loader />}>
          <CarMesh scrollY={scrollY} hovered={hovered} setHovered={setHovered} />
        </Suspense>

        {/* Orbit Controls (Drag to inspect car, constrained to stay above ground) */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4.8}
          maxPolarAngle={Math.PI / 2.05}
          dampingFactor={0.08}
          enableDamping
          rotateSpeed={0.55}
        />
      </Canvas>
    </div>
  );
};

export default CarModel3D;
