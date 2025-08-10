import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Satellite() {
  const { scene } = useGLTF("/satellite.glb");
  const ref = useRef<THREE.Group>(null);

  // Rotate continuously
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2; // slow spin
    }
  });

  return <primitive ref={ref} object={scene} scale={1} />;
}

// Preload the model
useGLTF.preload("/satellite.glb");
