import React, { useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { gsap } from "gsap";
import Earth from "../../components/Earth";
import SatelliteOrbit from "../../components/SatelliteOrbit";
import SpaceSatelliteOrbit from "../../components/SpaceSatelliteOrbit";

// Camera controller component for GSAP animations
function CameraController() {
  const { camera } = useThree();
  const cameraRef = useRef(camera);
  const [currentView, setCurrentView] = useState(1);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  // View configurations
  const views = {
    1: { position: [0, 10, 60], fov: 65, name: "Overview" },
    2: { position: [0, 8, 35], fov: 50, name: "Satellite Cluster" },
    3: { position: [-25, 2, 15], fov: 40, name: "Earth Close-up" },
  };

  // GSAP transition function
  const goToView = (viewNumber: number) => {
    if (viewNumber >= 1 && viewNumber <= 3 && viewNumber !== currentView) {
      const targetView = views[viewNumber as keyof typeof views];
      
      // Kill any existing animations
      gsap.killTweensOf(cameraRef.current.position);
      gsap.killTweensOf(cameraRef.current);

      // Animate camera position
      gsap.to(cameraRef.current.position, {
        x: targetView.position[0],
        y: targetView.position[1],
        z: targetView.position[2],
        duration: 2,
        ease: "power2.inOut",
      });

      // Animate camera FOV
      gsap.to(cameraRef.current, {
        fov: targetView.fov,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          cameraRef.current.updateProjectionMatrix();
        },
      });

      setCurrentView(viewNumber);
      console.log(`GSAP Transitioning to View ${viewNumber}: ${targetView.name}`);
    }
  };

  // Expose the function globally for button access
  useEffect(() => {
    (window as any).goToView = goToView;
    return () => {
      delete (window as any).goToView;
    };
  }, [currentView]);

  return null;
}

export default function Route5() {
  const [currentView, setCurrentView] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<number | null>(null);

  // View configurations for display
  const views = {
    1: { position: [0, 10, 60], fov: 65, name: "Overview" },
    2: { position: [0, 8, 35], fov: 50, name: "Satellite Cluster" },
    3: { position: [-25, 2, 15], fov: 40, name: "Earth Close-up" },
  };

  // Transition functions
  const goToView = (viewNumber: number) => {
    if (viewNumber >= 1 && viewNumber <= 3) {
      setCurrentView(viewNumber);
      // Call the GSAP function
      if ((window as any).goToView) {
        (window as any).goToView(viewNumber);
      }
    }
  };

  // User interaction triggers
  const handleNextView = () => {
    const nextView = currentView === 3 ? 1 : currentView + 1;
    goToView(nextView);
  };

  const handlePrevView = () => {
    const prevView = currentView === 1 ? 3 : currentView - 1;
    goToView(prevView);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          handleNextView();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handlePrevView();
          break;
        case "1":
        case "2":
        case "3":
          e.preventDefault();
          goToView(parseInt(e.key));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentView]);

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
        <div>Method: GSAP Animations</div>
        <div>Trigger: User Interaction</div>
      </div>

      {/* Navigation controls */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={handlePrevView}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ← Previous
        </button>
        <button
          onClick={handleNextView}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Next →
        </button>
      </div>

      {/* Quick view buttons */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        {[1, 2, 3].map((viewNum) => (
          <button
            key={viewNum}
            onClick={() => goToView(viewNum)}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              background: currentView === viewNum ? "#28a745" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            View {viewNum}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          left: "20px",
          zIndex: 1000,
          color: "white",
          fontSize: "14px",
          background: "rgba(0,0,0,0.7)",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <div>Controls:</div>
        <div>• Arrow keys or Space: Navigate</div>
        <div>• 1, 2, 3: Jump to view</div>
        <div>• Buttons below</div>
        <div style={{ marginTop: "5px", opacity: 0.8 }}>
          GSAP smooth transitions!
        </div>
      </div>

      <Canvas camera={{ position: [0, 10, 60], fov: 65 }}>
        {/* Camera controller for GSAP animations */}
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
    </div>
  );
}
