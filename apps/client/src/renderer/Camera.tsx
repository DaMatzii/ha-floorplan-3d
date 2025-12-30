import { useSpring } from "@react-spring/three";
import { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import DebugCamera from "@/utils/DebugCamera";
import { useHomeStore } from "@/store";
import type { IRoom } from "@/types";
import { useCurrentRoom } from "@/hooks";

interface CameraProps {
  activeCamera: number;
}

export default function Camera({ activeCamera }: CameraProps) {
  const { currentRoom, isPreview } = useCurrentRoom();

  const [target, setTarget] = useState([0, 0, 10]);
  const { floorplans } = useHomeStore();
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const { position } = useSpring({
    position: target,
    config: { mass: 1000, tension: 10, friction: 0, duration: 100 },
  });

  useFrame(() => {
    if (camera.current) {
      const [x, y, z] = position.get();
      camera.current.position.set(x, y, z);
    }
  });

  const focus = (room: any) => {
    if (!room) return;
    const x_vals = room.point.map((p) => p.x / 100);
    const y_vals = room.point.map((p) => p.y / 100);
    const points = x_vals.map((x, i) => new THREE.Vector3(x, y_vals[i], 0));

    const box = new THREE.Box3();
    points.forEach((point) => box.expandByPoint(point));

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    const fov = camera.current.fov * (Math.PI / 180);
    const offset = 1.25;
    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * offset;

    setTarget([center.x, cameraZ + 5, center.y]);
    camera.current.rotation.set(-Math.PI / 2, 0, 0);
  };

  useEffect(() => {
    if (isPreview) {
      setTarget([10, 20, 10]);
      camera.current.rotation.set(-Math.PI / 2, 0, 0);
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
      <PerspectiveCamera position={[0, 0, 10]} makeDefault />
      <DebugCamera ref={camera} makeDefault={activeCamera === 1} />

      {activeCamera === 0 ? <OrbitControls /> : <></>}
    </>
  );
}
