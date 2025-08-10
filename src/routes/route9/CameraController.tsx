import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useSpring } from "@react-spring/three";

interface CameraControllerProps {}

export default function CameraController({}: CameraControllerProps) {
  const { camera } = useThree();

  // Define the three camera views
  const views = {
    1: { position: [0, 10, 60] as [number, number, number], fov: 65 },
    2: { position: [0, 20, 40] as [number, number, number], fov: 75 },
    3: { position: [0, 5, 80] as [number, number, number], fov: 55 },
  };

  // Create spring animations for position and FOV
  const [springs, api] = useSpring(() => ({
    position: views[1].position,
    fov: views[1].fov,
    config: { mass: 1, tension: 170, friction: 26 },
  }));

  // Function to go to a specific view
  const goToView = (viewNumber: number) => {
    const view = views[viewNumber as keyof typeof views];
    if (view) {
      api.start({
        position: view.position,
        fov: view.fov,
      });
    }
  };

  // Expose the goToView function globally
  useEffect(() => {
    (window as any).goToView = goToView;

    return () => {
      delete (window as any).goToView;
    };
  }, [api]);

  // Apply spring values to camera
  useEffect(() => {
    if (springs.position) {
      camera.position.set(
        springs.position.get()[0],
        springs.position.get()[1],
        springs.position.get()[2]
      );
    }

    if (springs.fov) {
      camera.fov = springs.fov.get();
      camera.updateProjectionMatrix();
    }
  }, [springs, camera]);

  // This component doesn't render anything visible
  return null;
}
