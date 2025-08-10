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
  const [scrollCount, setScrollCount] = useState(0);

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
      console.log(
        `GSAP Transitioning to View ${viewNumber}: ${targetView.name}`
      );
    }
  };

  // Scroll-based view transitions with GSAP
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
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
    };
  }, [currentView]);

  // Expose the function globally for button access
  useEffect(() => {
    (window as any).goToView = goToView;
    (window as any).getScrollCount = () => scrollCount;
    (window as any).getCurrentView = () => currentView;
    return () => {
      delete (window as any).goToView;
      delete (window as any).getScrollCount;
      delete (window as any).getCurrentView;
    };
  }, [currentView, scrollCount]);

  return null;
}

export default function Route6() {
  const [currentView, setCurrentView] = useState(1);
  const [scrollCount, setScrollCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<number | null>(null);

  // View configurations for display
  const views = {
    1: { position: [0, 10, 60], fov: 65, name: "Overview" },
    2: { position: [0, 8, 35], fov: 50, name: "Satellite Cluster" },
    3: { position: [-25, 2, 15], fov: 40, name: "Earth Close-up" },
  };

  // Update local state from global GSAP state
  useEffect(() => {
    const interval = setInterval(() => {
      if ((window as any).getCurrentView) {
        const gsapView = (window as any).getCurrentView();
        const gsapScrollCount = (window as any).getScrollCount();
        if (gsapView !== currentView) {
          setCurrentView(gsapView);
        }
        if (gsapScrollCount !== scrollCount) {
          setScrollCount(gsapScrollCount);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentView, scrollCount]);

  // Manual view navigation
  const goToView = (viewNumber: number) => {
    if (viewNumber >= 1 && viewNumber <= 3) {
      setCurrentView(viewNumber);
      setScrollCount(0);
      // Call the GSAP function
      if ((window as any).goToView) {
        (window as any).goToView(viewNumber);
      }
    }
  };

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
        <div>Trigger: Scroll-Based</div>
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
          GSAP Scroll-Based Transitions
        </div>
        <div>• Scroll 3 times to advance to next view</div>
        <div>• Current view: {currentView}/3</div>
        <div>• Scrolls remaining: {3 - scrollCount}</div>
        <div style={{ marginTop: "10px", fontSize: "14px", opacity: 0.8 }}>
          Tip: Scroll slowly and steadily to trigger smooth GSAP transitions
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

      {/* Manual navigation */}
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
