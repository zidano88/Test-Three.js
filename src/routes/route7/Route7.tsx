import React, { useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import Earth from "../../components/Earth";
import SatelliteOrbit from "../../components/SatelliteOrbit";
import SpaceSatelliteOrbit from "../../components/SpaceSatelliteOrbit";

// Camera controller component for React Spring animations
function CameraController() {
  const { camera } = useThree();

  // View configurations
  const views = {
    1: { position: [0, 10, 60], fov: 65, name: "Overview" },
    2: { position: [0, 8, 35], fov: 50, name: "Satellite Cluster" },
    3: { position: [-25, 2, 15], fov: 40, name: "Earth Close-up" },
  };

  // React Spring animation for camera
  const [springs, api] = useSpring(() => ({
    position: views[1].position as [number, number, number],
    fov: views[1].fov,
    config: { mass: 1, tension: 170, friction: 26 },
  }));

  // Automatic timed transitions
  useEffect(() => {
    const timer1 = setTimeout(() => {
      console.log("React Spring Transitioning to View 2: Satellite Cluster");
      api.start({
        position: views[2].position as [number, number, number],
        fov: views[2].fov,
      });
    }, 3000);

    const timer2 = setTimeout(() => {
      console.log("React Spring Transitioning to View 3: Earth Close-up");
      api.start({
        position: views[3].position as [number, number, number],
        fov: views[3].fov,
      });
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [api]);

  // Update camera position and FOV based on spring values
  useEffect(() => {
    const unsubscribe = springs.position.onChange((value) => {
      camera.position.set(value[0], value[1], value[2]);
    });

    const unsubscribeFov = springs.fov.onChange((value) => {
      camera.fov = value;
      camera.updateProjectionMatrix();
    });

    return () => {
      unsubscribe();
      unsubscribeFov();
    };
  }, [springs, camera]);

  return null;
}

export default function Route7() {
  const [currentView, setCurrentView] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<number | null>(null);

  // View configurations for display
  const views = {
    1: { position: [0, 10, 60], fov: 65, name: "Overview" },
    2: { position: [0, 8, 35], fov: 50, name: "Satellite Cluster" },
    3: { position: [-25, 2, 15], fov: 40, name: "Earth Close-up" },
  };

  // Update current view based on time
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentView(2);
    }, 3000);

    const timer2 = setTimeout(() => {
      setCurrentView(3);
    }, 6000);

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
        <div>Method: React Spring</div>
        <div>Trigger: Automatic Timed</div>
        <div style={{ marginTop: "10px", fontSize: "14px", opacity: 0.8 }}>
          View 2: 3s • View 3: 6s
        </div>
      </div>

      {/* React Spring Info */}
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
          React Spring Camera Transitions
        </div>
        <div>• Physics-based animations</div>
        <div>• Mass: 1, Tension: 170, Friction: 26</div>
        <div>• Automatic timing</div>
        <div style={{ marginTop: "10px", fontSize: "14px", opacity: 0.8 }}>
          Watch the natural camera movements!
        </div>
      </div>

      <Canvas camera={{ position: [0, 10, 60], fov: 65 }}>
        {/* Camera controller for React Spring animations */}
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
