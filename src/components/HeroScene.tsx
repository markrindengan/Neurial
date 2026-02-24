import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Detect if the user is on a low-performance device.
 * We check for mobile AND low hardware concurrency (CPU cores).
 */
function useIsLowPerf(): boolean {
  const [low, setLow] = useState(false);
  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const lowCores = navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 4;
    setLow(isMobile && lowCores);
  }, []);
  return low;
}

function NeonSphere({
  position,
  color,
  speed,
  distort,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
  });
  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.5}>
      <mesh ref={ref} position={position}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function NeonTorus({
  position,
  color,
  speed,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.5;
    ref.current.rotation.z = state.clock.elapsedTime * speed * 0.3;
  });
  return (
    <Float speed={speed * 0.8} rotationIntensity={0.6} floatIntensity={1}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[0.8, 0.3, 16, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

function Particles({ count = 80 }: { count?: number }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00ffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/** Lightweight fallback scene for low-perf mobile devices */
function SimpleSphere() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    ref.current.rotation.x = state.clock.elapsedTime * 0.1;
  });
  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={1}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={0.2}
          roughness={0.4}
          metalness={0.7}
          wireframe
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  const isLowPerf = useIsLowPerf();

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      dpr={isLowPerf ? [1, 1] : [1, 1.5]}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: !isLowPerf, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 2, 4]} intensity={1} color="#00ffff" />
      <pointLight position={[3, -2, 2]} intensity={0.6} color="#ff00aa" />

      {isLowPerf ? (
        <>
          <SimpleSphere />
          <Particles count={30} />
        </>
      ) : (
        <>
          <NeonSphere position={[-2.5, 1, 0]} color="#00e5ff" speed={1.2} distort={0.4} />
          <NeonSphere position={[2.5, -0.5, -1]} color="#ff00aa" speed={0.8} distort={0.3} />
          <NeonTorus position={[0, 0.5, -2]} color="#aaff00" speed={1} />
          <Particles count={80} />
        </>
      )}
    </Canvas>
  );
}
