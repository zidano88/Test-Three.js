import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface SpaceSatelliteProps {
  isAnimating: boolean;
  position?: [number, number, number];
}

export default function SpaceSatellite({
  isAnimating,
  position = [0, 0, 0],
}: SpaceSatelliteProps) {
  const { scene } = useGLTF("/satellite.glb");
  const ref = useRef<THREE.Group>(null);

  // Rotate continuously when animating
  useFrame((state, delta) => {
    if (ref.current && isAnimating) {
      ref.current.rotation.y += delta * 0.3; // slow spin
    }
  });

  return <primitive ref={ref} object={scene} scale={10} position={position} />; // Larger scale for bigger satellite
}

// Preload the model
useGLTF.preload("/satellite.glb");
