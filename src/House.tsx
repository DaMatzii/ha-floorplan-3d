import { useThree } from "@react-three/fiber";
import { Shape, Vector3, PerspectiveCamera, Box3, MathUtils } from "three";
import { useEffect, useState, useRef } from "react";
import React from "react";
import "./App.css";
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

function BoxWithLabel() {
  return (
    <mesh position={[0, 300, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="skyblue" />

      {/* HTML overlay */}
      <Html center>
        <div
          style={{
            background: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
            zIndex: 0,
          }}
        >
          Hello, I'm an overlay!
        </div>
      </Html>
    </mesh>
  );
}

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
function RoomButtons({ rooms, mainCameraRef }) {
  // const { camera } = useThree();

  const focusRoom = (room: Room) => {
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

    const points: Vector3[] = room.point.map((p) => new Vector3(p.x, 0, p.y));
    // console.log(mainCameraRef);
    // Set camera position and look
    // console.log("setting 89");
    // const { distance, center } = getCameraDistanceToFitPoints(
    // points,
    // mainCameraRef.current,
    // 1.2,
    // );

    mainCameraRef.current.position.set(center_x, 8, center_y + 2);
    mainCameraRef.current.rotation.set(-Math.PI / 2.8, 0, 0);
  };
  // console.log(rooms);
  let controlsConfig2 = {};
  if (rooms !== undefined) {
    for (let room of Object.values(rooms)) {
      controlsConfig2[room.name] = button(() => focusRoom(room));
      // console.log(room.name);
    }

    // controlsConfig = rooms.reduce(
    //   (
    //     acc: Record<string, ReturnType<typeof button>>,
    //     room: Room,
    //   ): Record<string, ReturnType<typeof button>> => {
    //     acc[room.name] = button(() => focusRoom(room));
    //     return acc;
    //   },
    //   {} as Record<string, ReturnType<typeof button>>,
    // );

    // console.log("config2:", controlsConfig2);
  }
  // Create a Leva button for each room

  useControls(() => ({
    Rooms: folder(controlsConfig2),
    Test: button(() => alert("TEEST")),
  }));

  return null;
}
function House({ mainCamera }) {
  const [xml, setXml] = useState<XMLDocument>();
  const [home, setHome] = useState<Home>();
  const [elems, setElems] = useState();

  console.log(mainCamera);

  useEffect(() => {
    const fetchXML = async () => {
      try {
        // const response = await fetch("http://localhost:5173/house.xml");
        fetch("http://localhost:5173/house.xml")
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

  return (
    <>
      <RoomButtons rooms={home?.room} mainCameraRef={mainCamera} />
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
      <TempTest />

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
