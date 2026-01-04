import { useSpring } from "@react-spring/three";
import { useEffect, useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useHomeStore } from "@/store";
import { useCurrentRoom } from "@/hooks";

//TODO: Pinch zoom
const getPinchDistance = (touch1, touch2) => {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

export function XYCameraControls({ reached }) {
  const { camera } = useThree();
  const isDragging = useRef(false);
  const isPinching = useRef(false);
  const lastTouch = useRef(new THREE.Vector2());
  const lastPinchDist = useRef(0);

  const PAN_SPEED = 0.03;
  const ZOOM_SPEED = 0.05;
  const MIN_ZOOM = 2;
  const MAX_ZOOM = 50;

  useEffect(() => {
    const handleTouchStart = (event) => {
      if (!event.touches) return;

      if (event.touches.length === 1) {
        isDragging.current = true;
        isPinching.current = false;
        const touch = event.touches[0];
        lastTouch.current.set(touch.clientX, touch.clientY);
      }

      if (event.touches.length === 2) {
        isDragging.current = false;
        isPinching.current = true;

        lastPinchDist.current = getPinchDistance(
          event.touches[0],
          event.touches[1],
        );
      }
    };

    const handleTouchMove = (event) => {
      if (!reached.current || !event.touches) return;

      if (event.touches.length === 1 && isDragging.current) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - lastTouch.current.x;
        const deltaY = touch.clientY - lastTouch.current.y;

        camera.position.x -= deltaX * PAN_SPEED;
        camera.position.z -= deltaY * PAN_SPEED;

        lastTouch.current.set(touch.clientX, touch.clientY);
      }

      if (event.touches.length === 2 && isPinching.current) {
        const currentDist = getPinchDistance(
          event.touches[0],
          event.touches[1],
        );

        const deltaDist = currentDist - lastPinchDist.current;

        const newY = camera.position.y - deltaDist * ZOOM_SPEED;

        camera.position.y = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newY));

        lastPinchDist.current = currentDist;
      }

      if (isDragging.current || isPinching.current) {
        event.preventDefault();
      }
    };

    const handleTouchEnd = (event) => {
      if (event.touches.length === 0) {
        isDragging.current = false;
        isPinching.current = false;
      }

      if (event.touches.length === 1) {
        isPinching.current = false;
        isDragging.current = true;
        lastTouch.current.set(
          event.touches[0].clientX,
          event.touches[0].clientY,
        );
      }
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
