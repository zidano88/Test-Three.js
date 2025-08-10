import React, { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SatelliteOrbitProps {
  isAnimating: boolean;
}

export default function SatelliteOrbit({ isAnimating }: SatelliteOrbitProps) {
  const { scene } = useGLTF("/satellite.glb");
  const pivotRef = useRef<THREE.Group | null>(null);

  // config
  const rows = 5;
  const cols = 10;
  const verticalSpacing = 1.5;
  const orbitRadius = 50; // increase if Earth is much larger
  const satelliteScale = 1;
  // const orbitSpeed = 0.18;
  const orbitSpeed = 0.88;

  // cluster settings: control the horizontal spacing / big gap
  const clusterArcDeg = 40; // <-- width of each row's line (degrees). smaller -> bigger gap
  const clusterCenterDeg = 100; // <-- where the cluster sits around the orbit (degrees)
  const clusterArc = THREE.MathUtils.degToRad(clusterArcDeg);
  const startAngle =
    THREE.MathUtils.degToRad(clusterCenterDeg) - clusterArc / 2;

  // build primitives once
  const satellites = useMemo(() => {
    const items: React.ReactElement[] = [];
    for (let r = 0; r < rows; r++) {
      const y = (r - (rows - 1) / 2) * verticalSpacing;
      for (let c = 0; c < cols; c++) {
        const t = cols > 1 ? c / (cols - 1) : 0; // normalized position inside cluster
        const theta = startAngle + t * clusterArc; // angle inside the cluster arc
        const x = Math.cos(theta) * orbitRadius;
        const z = Math.sin(theta) * orbitRadius;

        const clone = scene.clone(true) as THREE.Object3D;
        items.push(
          <primitive
            key={`sat-${r}-${c}`}
            object={clone}
            position={[x, y, z]}
            scale={satelliteScale}
          />
        );
      }
    }
    return items;
  }, [
    scene,
    rows,
    cols,
    verticalSpacing,
    orbitRadius,
    satelliteScale,
    startAngle,
    clusterArc,
  ]);

  // orbit + make satellites face earth only when animating
  useFrame((_, delta) => {
    if (!pivotRef.current || !isAnimating) return;
    pivotRef.current.rotation.y += delta * orbitSpeed;

    // ensure each satellite faces Earth center (0,0,0)
    pivotRef.current.children.forEach((child) => {
      child.lookAt(-25, 0, 0);
    });
  });

  return (
    <group
      ref={pivotRef}
      position={[-25, 0, 0]} // Move pivot to Earth's position
      rotation={[0.1, 0, 0.1]}
    >
      {satellites}
    </group>
  );
}

useGLTF.preload("/satellite.glb");
