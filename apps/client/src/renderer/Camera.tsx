import { useSpring } from "@react-spring/three";
import { useEffect, useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useHomeStore } from "@/store";
import { useCurrentRoom } from "@/hooks";

//TODO: Pinch zoom
function XYCameraControls({ reached }) {
  const { camera } = useThree();
  const isDragging = useRef(false);
  const lastTouch = useRef(new THREE.Vector2());

  useEffect(() => {
    const handleTouchStart = (event) => {
      if (!event.touches || event.touches.length === 0) return;
      isDragging.current = true;
      const touch = event.touches[0];
      lastTouch.current.set(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (event) => {
      if (
        !isDragging.current ||
        !reached.current ||
        !event.touches ||
        event.touches.length === 0
      )
        return;

      const touch = event.touches[0];
      const deltaX = touch.clientX - lastTouch.current.x;
      const deltaY = touch.clientY - lastTouch.current.y;
      const factor = 0.03;

      camera.position.x -= deltaX * factor;
      camera.position.z -= deltaY * factor;

      lastTouch.current.set(touch.clientX, touch.clientY);
      event.preventDefault();
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [camera, reached]);

  return null;
}

//ISSUE: Coming of preview doesnt always focus back to whole room
export default function Camera() {
  const { currentRoom, isPreview } = useCurrentRoom();
  const [target, setTarget] = useState([0, 0, 10]);
  const { floorplans } = useHomeStore();
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const reachedRef = useRef(false);

  const { position } = useSpring({
    position: target,
    config: { mass: 1000, tension: 10, friction: 0, duration: 100 },
    onRest: ({ finished }) => {
      if (!finished) return;
      reachedRef.current = true;
    },
  });

  useEffect(() => {
    reachedRef.current = false;
  }, [target]);

  useFrame(() => {
    if (reachedRef.current) return;

    const [x, y, z] = position.get();
    camera.current.position.set(x, y, z);
  });

  const focus = (room: any) => {
    if (!room) return;
    const x_vals = room.point.map((p) => p.x / 100);
    const y_vals = room.point.map((p) => p.y / 100);
    const center = centerOfPoints(x_vals, y_vals);

    setTarget([center.x, center.z + 5, center.y]);
    camera.current.rotation.set(-Math.PI / 2, 0, 0);
  };

  const focusOnHouse = () => {
    const floorplan = floorplans[Object.keys(floorplans)[0]];
    const x_vals = floorplan.room.flatMap((d) => d.point.map((p) => p.x / 100));
    const y_vals = floorplan.room.flatMap((d) => d.point.map((p) => p.y / 100));
    const center = centerOfPoints(x_vals, y_vals);

    setTarget([center.x, center.z, center.y]);
    camera.current.rotation.set(-Math.PI / 2, 0, 0);
  };

  const centerOfPoints = (x_vals, y_vals) => {
    const points = x_vals.map((x, i) => new THREE.Vector3(x, y_vals[i], 0));
    const box = new THREE.Box3();
    points.forEach((point) => box.expandByPoint(point));

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    const fov = camera.current.fov * (Math.PI / 180);
    const offset = 1.25;
    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * offset;

    return { x: center.x, z: cameraZ, y: center.y };
  };

  useEffect(() => {
    if (isPreview) {
      focusOnHouse();
      return;
    }

    for (const floorplan in Object.keys(floorplans)) {
      const index = Object.keys(floorplans)[floorplan];
      focus(floorplans[index]?.room.find((b) => b.id === currentRoom));
      break;
    }
  }, [currentRoom, isPreview]);

  return (
    <>
      <PerspectiveCamera position={[0, 0, 10]} ref={camera} makeDefault />
      {isPreview && <XYCameraControls reached={reachedRef} />}
    </>
  );
}
