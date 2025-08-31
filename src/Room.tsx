import { useThree } from "@react-three/fiber";
import { Shape, Vector3, PerspectiveCamera, Box3, MathUtils } from "three";
import { useEffect, useState, useRef } from "react";
import React from "react";
import { useControls, button, folder } from "leva";
import { Html, OrbitControls, MeshReflectorMaterial } from "@react-three/drei";
import Light from "./Light.tsx";
import * as THREE from "three";

type Point = { x: number; y: number };
interface Props {
  rooms: Room[];
}
interface FitCameraResult {
  distance: number;
  center: Vector3;
}
export type Room = { name: string; points: Point[] };
interface RoomMeshProps {
  points: Point[];
  color?: string;
}
interface WallData {
  id: string;
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  height: number;
  thickness: number;
}
function RoomButtons({ rooms, mainCameraRef }) {
  // const { camera } = useThree();

  const focusRoom = (room: Room) => {
    const x_vals = room.points.map((p) => p.x);
    const y_vals = room.points.map((p) => p.y);
    const min_x = Math.min(...x_vals);
    const max_x = Math.max(...x_vals);
    const min_y = Math.min(...y_vals);
    const max_y = Math.max(...y_vals);
    const width = max_x - min_x;
    const height = max_y - min_y;
    const center_x = min_x + width / 2;
    const center_y = min_y + height / 2;

    const points: Vector3[] = room.points.map((p) => new Vector3(p.x, 0, p.y));
    // console.log(mainCameraRef);
    // Set camera position and look
    // console.log("setting 89");
    // const { distance, center } = getCameraDistanceToFitPoints(
    // points,
    // mainCameraRef.current,
    // 1.2,
    // );

    mainCameraRef.current.position.set(
      center_x,
      800 / 100,
      center_y + 400 / 100,
    );
    mainCameraRef.current.rotation.set(-Math.PI / 2.8, 0, 0);
  };

  // Create a Leva button for each room
  const controlsConfig = rooms.reduce(
    (
      acc: Record<string, ReturnType<typeof button>>,
      room: Room,
    ): Record<string, ReturnType<typeof button>> => {
      acc[room.name] = button(() => focusRoom(room));
      return acc;
    },
    {} as Record<string, ReturnType<typeof button>>,
  );

  useControls(() => ({
    Rooms: folder(controlsConfig),
    Test: button(() => alert("TEEST")),
  }));

  return null;
}
function Lights(room) {
  console.log("Lights");
  const x_vals = room.points.map((p) => p.x);
  const y_vals = room.points.map((p) => p.y);

  const min_x = Math.min(...x_vals);
  const max_x = Math.max(...x_vals);
  const min_y = Math.min(...y_vals);
  const max_y = Math.max(...y_vals);

  const width = max_x - min_x;
  const height = max_y - min_y;

  const center_x = min_x + width / 2;
  const center_y = min_y + height / 2;

  return (
    <>
      <Light
        type="directional"
        helper
        size={2}
        color="red"
        position={[center_x, 100, center_y]}
        castShadow
      />
    </>
  );
}
export default function Room(xml: Document, camera: any) {
  const [walls, setWalls] = useState<WallData[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  // console.log(xml);
  console.log("CAMERA: ", xml.camera);
  React.useEffect(() => {
    if (xml !== undefined) {
      console.log("EMTPYYYY");
      console.log(xml);
      let xmlDoc: XMLDocument = xml.xml as XMLDocument;
      console.log(xmlDoc);
      const _walls: WallData[] = Array.from(
        xmlDoc.getElementsByTagName("wall"),
      ).map((wall) => ({
        id: wall.getAttribute("id") || "",
        xStart: parseFloat(wall.getAttribute("xStart") || "0") / 100,
        yStart: parseFloat(wall.getAttribute("yStart") || "0") / 100,
        xEnd: parseFloat(wall.getAttribute("xEnd") || "0") / 100,
        yEnd: parseFloat(wall.getAttribute("yEnd") || "0") / 100,
        height: parseFloat(wall.getAttribute("height") || "0") / 100,
        thickness: parseFloat(wall.getAttribute("thickness") || "0") / 100,
      }));
      setWalls(_walls);
      // console.log(_walls);
      const roomNodes = Array.from(xmlDoc.getElementsByTagName("room"));
      const _rooms: Room[] = [];

      for (const roomNode of roomNodes) {
        const pointNodes = roomNode.getElementsByTagName("point");
        let name = "xd";
        const nameAttr = roomNode.getAttribute("name");
        if (nameAttr !== null) {
          name = nameAttr;
        }
        const points: Point[] = [];

        for (const pointNode of Array.from(pointNodes)) {
          const x = parseFloat(pointNode.getAttribute("x") || "0") / 100;
          const y = parseFloat(pointNode.getAttribute("y") || "0") / 100;
          points.push({ x, y });
        }

        _rooms.push({ name: name, points: points });
        // console.log(points);
      }
      setRooms(_rooms);
    }
  }, [xml]);
  return (
    <>
      <RoomButtons rooms={rooms} mainCameraRef={xml.camera} />
      {walls !== [] ? <WallsScene walls={walls} /> : ""}
      {rooms.map((points, idx) => (
        <RoomMesh key={idx} points={points.points} color={"#a0a0a0"} />
      ))}
      {rooms.forEach((room) => {
        {
          /* <Lights room={room} />; */
        }
      })}
    </>
  );
}

const RoomMesh: React.FC<RoomMeshProps> = ({ points, color = "orange" }) => {
  const shape = React.useMemo(() => {
    const s = new Shape();
    // console.log("ROOM MESH");
    s.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      s.lineTo(points[i].x, points[i].y);
    }
    s.lineTo(points[0].x, points[0].y); // close the shape
    // console.log(points);
    return s;
  }, [points]);
  const middlePoint: Point = React.useMemo(() => {
    let x_vals = points.map((p: Point) => p.x);
    let y_vals = points.map((p: Point) => p.y);
    let min_x = Math.min(...x_vals);
    let max_x = Math.max(...x_vals);
    let min_y = Math.min(...y_vals);
    let max_y = Math.max(...y_vals);
    let width = max_x - min_x;
    let height = max_y - min_y;
    let center_x = min_x + width / 2;
    let center_y = min_y + height / 2;
    return { x: center_x, y: center_y };
  }, [points]);
  // console.log(middlePoint);

  return (
    <>
      {/* <mesh rotation={[-Math.PI / 2, 0, 0]}> */}
      {/*   <shapeGeometry args={[shape]} /> */}

      {/* </mesh> */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color="gray" side={THREE.BackSide} />

        {/*   <MeshReflectorMaterial */}
        {/*     blur={[400, 400]} */}
        {/*     resolution={1024} */}
        {/*     mixBlur={1} */}
        {/*     mixStrength={15} */}
        {/*     depthScale={1} */}
        {/*     minDepthThreshold={0.85} */}
        {/*     color="#808080" */}
        {/*     metalness={0.6} */}
        {/*     roughness={1} */}
        {/*     side={THREE.BackSide} */}
        {/*   /> */}
      </mesh>
    </>
  );
};
const Wall: React.FC<WallData> = ({
  xStart,
  yStart,
  xEnd,
  yEnd,
  height,
  thickness,
}) => {
  const dx = xEnd - xStart;
  const dy = yEnd - yStart;
  const length = Math.sqrt(dx ** 2 + dy ** 2);
  const angle = Math.atan2(dy, dx);

  const position: [number, number, number] = [
    (xStart + xEnd) / 2,
    height / 2,
    (yStart + yEnd) / 2,
  ];

  return (
    <mesh position={position} rotation={[0, -angle, 0]}>
      <boxGeometry args={[length, height, thickness]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

interface WallsSceneProps {
  walls: WallData[];
}

const WallsScene: React.FC<WallsSceneProps> = (walls: WallsSceneProps) => {
  // console.log(rooms);
  console.log("WALL SCENE IS RENDERED!!");
  console.log(walls);
  return (
    <>
      {walls.walls.map((wall) => (
        <Wall key={wall.id} {...wall} />
      ))}
    </>
  );
};
