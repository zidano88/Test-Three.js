import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Earth from "../../components/Earth";
import SatelliteOrbit from "../../components/SatelliteOrbit";
import SpaceSatelliteOrbit from "../../components/SpaceSatelliteOrbit";
import CameraController from "./CameraController";

export default function Route9() {
  const [currentView, setCurrentView] = useState(1);
  const [scrollCount, setScrollCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        setIsAnimating(true);

        // Increment scroll count
        setScrollCount((prev) => prev + 1);

        // Every 3 scrolls, trigger camera transition
        if (scrollCount % 3 === 0) {
          const nextView = currentView === 3 ? 1 : currentView + 1;
          setCurrentView(nextView);

          // Call the global goToView function
          if (window.goToView) {
            window.goToView(nextView);
          }
        }

        // Clear animation after a short delay
        setTimeout(() => setIsAnimating(false), 300);
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, [scrollCount, currentView]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 10, 60], fov: 65 }}>
        {/* Camera Controller for React Spring transitions */}
        <CameraController />

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

      {/* UI Overlay */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "white",
          fontFamily: "Arial, sans-serif",
          zIndex: 1000,
        }}
      >
        <h3>Route 9: React Spring + Scroll-Based Transitions</h3>
        <p>Current View: {currentView}</p>
        <p>Scroll Count: {scrollCount}</p>
        <p>Scroll 3 times to trigger next view</p>
        <div
          style={{
            width: "200px",
            height: "10px",
            backgroundColor: "rgba(255,255,255,0.3)",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((scrollCount % 3) / 3) * 100}%`,
              height: "100%",
              backgroundColor: "white",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}
