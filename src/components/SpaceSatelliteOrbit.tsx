import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import SpaceSatellite from "./SpaceSatellite";
import * as THREE from "three";

interface SpaceSatelliteOrbitProps {
  isAnimating: boolean;
}

export default function SpaceSatelliteOrbit({
  isAnimating,
}: SpaceSatelliteOrbitProps) {
  const pivotRef = useRef<THREE.Group | null>(null);

  // config for single large satellite
  const orbitRadius = 70; // Much larger orbit radius
  const orbitSpeed = 0.3; // Slower orbit speed for larger radius
  const startAngleDeg = 110; // Starting position around the orbit (degrees)

  // orbit the satellite around Earth
  useFrame((_, delta) => {
    if (!pivotRef.current || !isAnimating) return;
    pivotRef.current.rotation.y += delta * orbitSpeed;
  });

  return (
    <group
      ref={pivotRef}
      position={[-25, 0, 0]} // Match Earth's position
      rotation={[-0.1, 0, 0]} // Slight tilt for more interesting orbit
    >
      {/* Single large satellite positioned at the orbit radius with custom start angle */}
      <SpaceSatellite
        isAnimating={isAnimating}
        position={[
          Math.cos(THREE.MathUtils.degToRad(startAngleDeg)) * orbitRadius,
          0,
          Math.sin(THREE.MathUtils.degToRad(startAngleDeg)) * orbitRadius,
        ]} // Position satellite at orbit radius with custom start angle
      />
    </group>
  );
}
