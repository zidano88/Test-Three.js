import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Earth from "./Earth";
import SatelliteOrbit from "./SatelliteOrbit";
import SpaceSatelliteOrbit from "./SpaceSatelliteOrbit";

// Camera controller component for GSAP animations
function CameraController() {
  const { camera } = useThree();
  const cameraRef = useRef(camera);
  const [currentView, setCurrentView] = useState(1);
  const [scrollCount, setScrollCount] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  // 🔧 EDIT CAMERA VIEWS HERE - Change these values to customize your views
  const views = {
    1: { position: [0, 0, 60], fov: 65, name: "Overview" },
    2: { position: [-10, -10, 80], fov: 65, name: "Satellite Cluster" },
    3: { position: [-10, 8, 110], fov: 85, name: "Earth Close-up" },
  };

  // GSAP transition function
  const goToView = (viewNumber: number) => {
    if (viewNumber >= 1 && viewNumber <= 3 && viewNumber !== currentView) {
      const targetView = views[viewNumber as keyof typeof views];

      // Start transition - satellites will orbit during this time
      setIsTransitioning(true);

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
        onComplete: () => {
          // Transition complete - stop satellite orbiting
          setIsTransitioning(false);
        },
      });

      setCurrentView(viewNumber);
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

  // Expose the transition state globally so components can access it
  useEffect(() => {
    (window as any).isTransitioning = isTransitioning;
    return () => {
      delete (window as any).isTransitioning;
    };
  }, [isTransitioning]);

  return null;
}

export default function SpaceScene() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);

  // Use the transition state from CameraController instead of scroll-based animation
  useEffect(() => {
    const interval = setInterval(() => {
      if ((window as any).isTransitioning !== undefined) {
        const transitioning = (window as any).isTransitioning;
        if (transitioning !== isAnimating) {
          setIsAnimating(transitioning);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Handle scroll events for paragraph progression
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        setCurrentParagraphIndex((prev) => (prev + 1) % 5);
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: true });
    return () => document.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      className="canvas-container"
      style={{ width: "100vw", height: "100vh", position: "relative" }}
    >
      {/* Text Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          pointerEvents: "none",
          height: "100vh",
        }}
      >
        {/* Test 1 */}
        <div
          style={{
            position: "absolute",
            left: "50px",
            right: "50px",
            top: currentParagraphIndex === 0 ? "50%" : "100vh",
            transform: "translateY(-50%)",
            fontSize: "24px",
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            textAlign: "center",
            padding: "20px",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "10px",
            transition: "top 0.5s ease-out",
            opacity: currentParagraphIndex === 0 ? 1 : 0,
          }}
        >
          Test 1!
        </div>

        {/* Test 2 */}
        <div
          style={{
            position: "absolute",
            left: "50px",
            right: "50px",
            top: currentParagraphIndex === 1 ? "50%" : "100vh",
            transform: "translateY(-50%)",
            fontSize: "24px",
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            textAlign: "center",
            padding: "20px",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "10px",
            transition: "top 0.5s ease-out",
            opacity: currentParagraphIndex === 1 ? 1 : 0,
          }}
        >
          Test 2!
        </div>

        {/* Test 3 */}
        <div
          style={{
            position: "absolute",
            left: "50px",
            right: "50px",
            top: currentParagraphIndex === 2 ? "50%" : "100vh",
            transform: "translateY(-50%)",
            fontSize: "24px",
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            textAlign: "center",
            padding: "20px",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "10px",
            transition: "top 0.5s ease-out",
            opacity: currentParagraphIndex === 2 ? 1 : 0,
          }}
        >
          Test 3!
        </div>

        {/* Test 4 */}
        <div
          style={{
            position: "absolute",
            left: "50px",
            right: "50px",
            top: currentParagraphIndex === 3 ? "50%" : "100vh",
            transform: "translateY(-50%)",
            fontSize: "24px",
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            textAlign: "center",
            padding: "20px",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "10px",
            transition: "top 0.5s ease-out",
            opacity: currentParagraphIndex === 3 ? 1 : 0,
          }}
        >
          Test 4!
        </div>

        {/* Test 5 */}
        <div
          style={{
            position: "absolute",
            left: "50px",
            right: "50px",
            top: currentParagraphIndex === 4 ? "50%" : "100vh",
            transform: "translateY(-50%)",
            fontSize: "24px",
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            textAlign: "center",
            padding: "20px",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "10px",
            transition: "top 0.5s ease-out",
            opacity: currentParagraphIndex === 4 ? 1 : 0,
          }}
        >
          Test 5!
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 60], fov: 65 }}>
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
