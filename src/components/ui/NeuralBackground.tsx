import { useEffect, useRef } from "react";
import * as THREE from "three";

export function NeuralBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.002); // Deep Ink

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Neural Mesh (Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(10, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00, // Electric Green
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Particles
    const pGeo = new THREE.BufferGeometry();
    const pCount = 2000;
    const pArray = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      pArray[i] = (Math.random() - 0.5) * 100;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pArray, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.15,
      color: 0x00ff88,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      sphere.rotation.y += 0.002;
      particles.rotation.y -= 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    const currentMount = mountRef.current;
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      currentMount?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10"
      style={{ background: "linear-gradient(to bottom, #0a0f1d, #1a1f2e)" }}
    />
  );
}
