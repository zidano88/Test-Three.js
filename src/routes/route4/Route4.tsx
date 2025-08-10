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

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  useEffect(() => {
    // View configurations
    const views = {
      1: { position: [0, 10, 60], fov: 65, name: "Overview" },
      2: { position: [0, 8, 35], fov: 50, name: "Satellite Cluster" },
      3: { position: [-25, 2, 15], fov: 40, name: "Earth Close-up" },
    };

    // Automatic timed transitions with GSAP
    const timeline = gsap.timeline();

    // Transition to View 2 after 3 seconds
    timeline.add(() => {
      console.log("Transitioning to View 2: Satellite Cluster");
      gsap.to(cameraRef.current.position, {
        x: views[2].position[0],
        y: views[2].position[1],
        z: views[2].position[2],
        duration: 2,
        ease: "power2.inOut",
      });
      gsap.to(cameraRef.current, {
        fov: views[2].fov,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          cameraRef.current.updateProjectionMatrix();
        },
      });
    }, 3);

    // Transition to View 3 after 6 seconds
    timeline.add(() => {
      console.log("Transitioning to View 3: Earth Close-up");
      gsap.to(cameraRef.current.position, {
        x: views[3].position[0],
        y: views[3].position[1],
        z: views[3].position[2],
        duration: 2,
        ease: "power2.inOut",
      });
      gsap.to(cameraRef.current, {
        fov: views[3].fov,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          cameraRef.current.updateProjectionMatrix();
        },
      });
    }, 6);

    return () => {
      timeline.kill();
    };
  }, []);

  return null;
}

export default function Route4() {
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
        <div>Method: GSAP Animations</div>
        <div>Trigger: Automatic Timed</div>
        <div style={{ marginTop: "10px", fontSize: "14px", opacity: 0.8 }}>
          View 2: 3s • View 3: 6s
        </div>
      </div>

      {/* GSAP Info */}
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
          GSAP Camera Transitions
        </div>
        <div>• Smooth 2-second transitions</div>
        <div>• Power2.inOut easing</div>
        <div>• Automatic timing</div>
        <div style={{ marginTop: "10px", fontSize: "14px", opacity: 0.8 }}>
          Watch the smooth camera movements!
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
