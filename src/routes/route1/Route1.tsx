import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Earth from "../../components/Earth";
import SatelliteOrbit from "../../components/SatelliteOrbit";
import SpaceSatelliteOrbit from "../../components/SpaceSatelliteOrbit";

export default function Route1() {
  const [currentView, setCurrentView] = useState(1);
  const [cameraPosition, setCameraPosition] = useState([0, 10, 60]);
  const [cameraFov, setCameraFov] = useState(65);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<number | null>(null);

  // View configurations
  const views = {
    1: { position: [0, 10, 60], fov: 65, name: "Overview" },
    2: { position: [0, 8, 35], fov: 50, name: "Satellite Cluster" },
    3: { position: [-25, 2, 15], fov: 40, name: "Earth Close-up" },
  };

  // Transition functions
  const goToView2 = () => {
    setCameraPosition(views[2].position);
    setCameraFov(views[2].fov);
    setCurrentView(2);
  };

  const goToView3 = () => {
    setCameraPosition(views[3].position);
    setCameraFov(views[3].fov);
    setCurrentView(3);
  };

  // Automatic timed transitions
  useEffect(() => {
    const timer1 = setTimeout(() => {
      console.log("Transitioning to View 2: Satellite Cluster");
      goToView2();
    }, 3000); // After 3 seconds

    const timer2 = setTimeout(() => {
      console.log("Transitioning to View 3: Earth Close-up");
      goToView3();
    }, 6000); // After 6 seconds

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Scroll-based animation (existing functionality)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        setIsAnimating(true);

        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        const timeout = setTimeout(() => {
          setIsAnimating(false);
        }, 300);

        setScrollTimeout(timeout);
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      document.removeEventListener("wheel", handleWheel);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* View indicator */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1000,
          color: "white",
          fontSize: "18px",
          fontFamily: "Arial, sans-serif",
          background: "rgba(0,0,0,0.7)",
          padding: "10px 15px",
          borderRadius: "5px",
        }}
      >
        <div>Current View: {currentView}</div>
        <div>{views[currentView as keyof typeof views].name}</div>
        <div>
          Camera: [{cameraPosition[0].toFixed(1)},{" "}
          {cameraPosition[1].toFixed(1)}, {cameraPosition[2].toFixed(1)}]
        </div>
        <div>FOV: {cameraFov}°</div>
      </div>

      <Canvas
        camera={{
          position: cameraPosition as [number, number, number],
          fov: cameraFov,
        }}
      >
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
