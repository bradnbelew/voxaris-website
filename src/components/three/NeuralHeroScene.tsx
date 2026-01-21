import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function NeuralMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Slow rotation
    meshRef.current.rotation.y = t * 0.1;
    meshRef.current.rotation.x = t * 0.05;
    
    // Breathing pulse
    const scale = 1 + Math.sin(t) * 0.05;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[10, 2]} />
      <meshBasicMaterial
        color="#00ff00"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }
    return posArray;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Minimal drift
    pointsRef.current.rotation.y = -t * 0.05;
    
    // Mouse influence
    const mouseX = state.pointer.x * 0.5;
    const mouseY = state.pointer.y * 0.5;
    pointsRef.current.rotation.x = mouseY * 0.5;
    pointsRef.current.rotation.y += mouseX * 0.5;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00ff88"
        size={0.15}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}

export default function NeuralHeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: 75 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <fog attach="fog" args={['#0a0f1d', 0, 100]} />
      <NeuralMesh />
      <ParticleField />
    </Canvas>
  );
}
