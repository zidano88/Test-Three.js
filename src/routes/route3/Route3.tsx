import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Earth from "../../components/Earth";
import SatelliteOrbit from "../../components/SatelliteOrbit";
import SpaceSatelliteOrbit from "../../components/SpaceSatelliteOrbit";

export default function Route3() {
  const [currentView, setCurrentView] = useState(1);
  const [cameraPosition, setCameraPosition] = useState([0, 10, 60]);
  const [cameraFov, setCameraFov] = useState(65);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<number | null>(null);
  const [scrollCount, setScrollCount] = useState(0);

  // View configurations
  const views = {
    1: { position: [0, 10, 60], fov: 65, name: "Overview" },
    2: { position: [0, 8, 35], fov: 50, name: "Satellite Cluster" },
    3: { position: [-25, 2, 15], fov: 40, name: "Earth Close-up" },
  };

  // Transition functions
  const goToView = (viewNumber: number) => {
    if (viewNumber >= 1 && viewNumber <= 3) {
      setCameraPosition(views[viewNumber as keyof typeof views].position);
      setCameraFov(views[viewNumber as keyof typeof views].fov);
      setCurrentView(viewNumber);
      console.log(
        `Transitioning to View ${viewNumber}: ${
          views[viewNumber as keyof typeof views].name
        }`
      );
    }
  };

  // Scroll-based view transitions
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        // Trigger animation
        setIsAnimating(true);

        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        const timeout = setTimeout(() => {
          setIsAnimating(false);
        }, 300);

        setScrollTimeout(timeout);

        // Count scroll events and change view every 3 scrolls
        setScrollCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            // Change to next view
            const nextView = currentView === 3 ? 1 : currentView + 1;
            goToView(nextView);
            return 0; // Reset counter
          }
          return newCount;
        });
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      document.removeEventListener("wheel", handleWheel);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout, currentView]);

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
        <div>Scrolls to next view: {3 - scrollCount}/3</div>
      </div>

      {/* Instructions */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          zIndex: 1000,
          color: "white",
          fontSize: "16px",
          background: "rgba(0,0,0,0.7)",
          padding: "15px",
          borderRadius: "5px",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
          Scroll-Based View Transitions
        </div>
        <div>• Scroll 3 times to advance to next view</div>
        <div>• Current view: {currentView}/3</div>
        <div>• Scrolls remaining: {3 - scrollCount}</div>
        <div style={{ marginTop: "10px", fontSize: "14px", opacity: 0.8 }}>
          Tip: Scroll slowly and steadily to trigger view changes
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: "120px",
          left: "20px",
          right: "20px",
          zIndex: 1000,
          height: "4px",
          background: "rgba(255,255,255,0.3)",
          borderRadius: "2px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(scrollCount / 3) * 100}%`,
            background: "#007bff",
            borderRadius: "2px",
            transition: "width 0.3s ease",
          }}
        />
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
