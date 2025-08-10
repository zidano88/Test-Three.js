import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface EarthProps {
  isAnimating: boolean;
}

export default function Earth({ isAnimating }: EarthProps) {
  // const { scene } = useGLTF("/earth_night.glb");
  const { scene } = useGLTF("/earth2.glb");
  const earthRef = useRef<THREE.Group>(null);

  // Rotate Earth slowly only when animating
  useFrame((_, delta) => {
    if (earthRef.current && isAnimating) {
      earthRef.current.rotation.y += delta * 0.05;
    }
  });
  //NASA Earth
  // return <primitive ref={earthRef} object={scene} scale={500} />;

  //Custom Earth
  return (
    <primitive ref={earthRef} object={scene} scale={7} position={[-25, 0, 0]} />
  );
}

// useGLTF.preload("/earth_night.glb");
useGLTF.preload("/earth2.glb");
