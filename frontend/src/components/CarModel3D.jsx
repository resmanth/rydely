// ============================================================
// CarModel3D.jsx — Standalone React Three Fiber BMW i8 Viewer
// ------------------------------------------------------------
// An optional/modular Three.js viewer component built with
// React Three Fiber (@react-three/fiber and @react-three/drei).
// It demonstrates:
//   - GLTF model loading with OrbitControls
//   - Soft ContactShadows and dynamic highway lighting
//   - Interactive hover, turntable rotation, and idle float
// ============================================================

/* eslint-disable react-hooks/immutability */
import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

// Preload the BMW i8 model
useGLTF.preload('/car-model.gltf');

// Sleek Loader Fallback
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

// The 3D car mesh component
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

    // Scale so the largest dimension is 5 units
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 5.0;
    const scale = targetSize / maxDim;
    scene.scale.setScalar(scale);

    // Place the tyres on the ground
    scene.position.y += (size.y * scale) / 2;
  }, [scene]);

  // Frame animation: idle breathing float & scroll response
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!hovered) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
      // Very slow idle rotation
      groupRef.current.rotation.y += delta * 0.12;
    }

    // Scroll sink: sink slightly as page scrolls
    const targetY = -scrollY * 0.001;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      rotation={[0.08, -0.65, 0]}
    >
      <primitive object={scene} />
      <ContactShadows
        position={[0, -0.02, 0]}
        opacity={0.85}
        scale={10}
        blur={2}
        far={4}
        color="#000000"
      />
    </group>
  );
}

const CarModel3D = ({ scrollY = 0 }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [4.2, 1.8, 4.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 8]} intensity={2.2} castShadow />
        <directionalLight position={[-10, 8, -6]} intensity={1.0} color="#ff3535" />
        <pointLight position={[0, -0.5, 0]} intensity={2.5} color="#0066b1" distance={6} />

        <Suspense fallback={<Loader />}>
          <CarMesh scrollY={scrollY} hovered={hovered} setHovered={setHovered} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minPolarAngle={Math.PI / 4}
          rotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
};

export default CarModel3D;
