import { useThree } from "@react-three/fiber";
import { Shape, Vector3, PerspectiveCamera, Box3, MathUtils } from "three";
import { a, useSpring } from "@react-spring/three";
import { useEffect, useState, useRef } from "react";
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls, button, folder } from "leva";
import Light from "./Light";
import type Home from "./Home.ts";
import { parseHome, renderHome } from "./Parser";
import TempTest from "./TempTest";
import {
  Html,
  OrbitControls,
  MeshReflectorMaterial,
  Environment,
} from "@react-three/drei";
import Room from "./Room";
import { useHome } from "./HomeContext";

/**
 * Calculates the required camera distance to fit all given 3D points into the view.
 */
// export function getCameraDistanceToFitPoints(
//   points: Vector3[],
//   camera: PerspectiveCamera,
//   fitMargin: number = 1.2,
// ): FitCameraResult {
//   const boundingBox = new Box3().setFromPoints(points);
//   const size = new Vector3();
//   boundingBox.getSize(size);
//
//   const center = new Vector3();
//   boundingBox.getCenter(center);
//
//   const fov = MathUtils.degToRad(camera.fov);
//   const aspect = camera.aspect;
//
//   const height = size.y * fitMargin;
//   const width = size.x * fitMargin;
//
//   const distanceY = height / (2 * Math.tan(fov / 2));
//   const horizontalFOV = 2 * Math.atan(Math.tan(fov / 2) * aspect);
//   const distanceX = width / (2 * Math.tan(horizontalFOV / 2));
//
//   const distance = Math.max(distanceX, distanceY);
//
//   return { distance, center };
//
// }
type Point = { x: number; y: number };
type Room = {
  areaVisible: "true" | "false"; // could also be boolean if you convert it
  areaXOffset: string;
  areaYOffset: string;
  floorColor: string;
  id: string;
  name: string;
  nameXOffset: string;
  nameYOffset: string;
  point: Point[];
};
interface RoomMeshProps {
  points: Point[];
  color?: string;
}
function House({ mainCamera, currentRoom }) {
  const [xml, setXml] = useState<XMLDocument>();
  // const [home, setHome] = useState<Home>();
  const [elems, setElems] = useState();
  const { home, setHome } = useHome();
  const [target, setTarget] = useState([0, 0, 10]);

  // Spring for camera position
  const { position } = useSpring({
    position: target,
    config: { mass: 1, tension: 200, friction: 26, duration: 30 },
  });

  // Update camera position every frame
  useFrame(() => {
    if (mainCamera.current) {
      const [x, y, z] = position.get();
      mainCamera.current.position.set(x, y, z);
    }
  });
  // console.log(mainCamera);
  const focus = (room: Room) => {
    const x_vals = room.point.map((p) => p.x / 100);
    const y_vals = room.point.map((p) => p.y / 100);
    const min_x = Math.min(...x_vals);
    const max_x = Math.max(...x_vals);
    const min_y = Math.min(...y_vals);
    const max_y = Math.max(...y_vals);
    const width = max_x - min_x;
    const height = max_y - min_y;
    const center_x = min_x + width / 2;
    const center_y = min_y + height / 2;

    setTarget([center_x, 15, center_y + 2]);
    mainCamera.current.rotation.set(-Math.PI / 2, 0, 0);
  };

  useEffect(() => {
    const fetchXML = async () => {
      try {
        // const response = await fetch("http://localhost:5173/house.xml");
        fetch("/house.xml")
          .then((response) => response.text())
          .then((str) => {
            setHome(parseHome(str));
          });
      } catch (error) {
        console.error("Error fetching XML:", error);
      }
    };
    fetchXML();
  }, []);
  useEffect(() => {
    setElems(renderHome(home));
    console.log(home);
  }, [home]);
  useEffect(() => {
    console.log("xml updated:", xml);
    if (xml !== undefined) {
      console.log((xml as XMLDocument).getElementsByName("room"));
    }
  }, [xml]);
  const targetRef = useRef();

  useEffect(() => {
    if (home === undefined) {
      return;
    }
    focus(home.room[currentRoom]);
  });

  return (
    <>
      {/* <RoomButtons rooms={home?.room} mainCameraRef={mainCamera} /> */}
      {elems}
      <Environment preset="apartment" />
      <Light
        type="directional"
        helper
        size={2}
        DebugColor="red"
        position={[9, 10, 9]}
        color="#fff2cc"
        intensity={5}
        target-position={[2, 2, 2]}
        castShadow
      />
      {/* <TempTest /> */}

      <object3D ref={targetRef} position={[5, 4, 2]} />

      <fog attach="fog" args={["#17171b", 30, 100000]} />
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[200, 200]}
          resolution={1024}
          mixBlur={1}
          mixStrength={15}
          depthScale={0.5}
          minDepthThreshold={0.85}
          color="#17171b"
          metalness={0.6}
          roughness={1}
        />
      </mesh>
    </>
  );
}
export default House;
