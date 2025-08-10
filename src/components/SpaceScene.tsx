import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useState, useEffect } from "react";
import Earth from "./Earth";
import SatelliteOrbit from "./SatelliteOrbit";
import SpaceSatelliteOrbit from "./SpaceSatelliteOrbit";

export default function SpaceScene() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<number | null>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only trigger animation on vertical scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        setIsAnimating(true);

        // Clear existing timeout
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        // Set a new timeout to stop animation after scrolling stops
        const timeout = setTimeout(() => {
          setIsAnimating(false);
        }, 300); // Stop animation 300ms after scrolling stops

        setScrollTimeout(timeout);
      }
    };

    // Add wheel listener to the document
    document.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      document.removeEventListener("wheel", handleWheel);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  return (
    <div
      className="canvas-container"
      style={{ width: "100vw", height: "100vh" }}
    >
      <Canvas camera={{ position: [0, 0, 60], fov: 65 }}>
        {/* Sunlight - bright */}
        <directionalLight
          position={[50, 0, 20]}
          intensity={10}
          color={"#ffffff"}
        />
        {/* Fill light */}
        <ambientLight intensity={0.5} />

        {/* Stars */}
        <Stars radius={300} depth={60} count={20000} factor={7} fade />

        {/* Earth */}
        <Earth isAnimating={isAnimating} />

        {/* Orbiting satellite fleet */}
        <SatelliteOrbit isAnimating={isAnimating} />

        {/* Large single satellite orbit */}
        <SpaceSatelliteOrbit isAnimating={isAnimating} />

        {/* Controls */}
        <OrbitControls zoomSpeed={0.3} />
      </Canvas>
    </div>
  );
}
