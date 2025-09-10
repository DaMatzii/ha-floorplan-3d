import React, { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "../Components.ts";
import ReactDOM from "react-dom/client";
import Light from "../Light.tsx";
import { Shape } from "three";
import * as THREE from "three";
import { useBounds } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import registry from "../Components.ts";
import type { JSX } from "react/jsx-runtime";
import { useHome } from "../HomeContext";

type Point = { x: number; y: number };
interface RoomMeshProps {
  points: Point[];
  color: string;
}
interface RoomProps extends ComponentProps {
  point: any;
}

function renderRoomItems(root: any) {
  const renderList: JSX.Element[] = [];
  // console.log(root);
  console.log("RENDER RUN!!");
  let runningNumber = 0;
  for (const type in root) {
    if (typeof root[type] === "object") {
      if (Array.isArray(root[type])) {
        for (const value in root[type]) {
          let Comp = registry.getParser("room-" + type);
          if (Comp) {
            renderList.push(
              <Comp
                key={type + "-" + runningNumber}
                room={root}
                {...(root[type][value] as any)}
              />,
            );
            runningNumber += 1;
          }
        }
        continue;
      }
      let Comp = registry.getParser("room-" + type);
      if (Comp) {
        renderList.push(
          <Comp
            key={type + "-" + runningNumber}
            room={root}
            {...(root[type] as any)}
          />,
        );
        runningNumber += 1;
      }
    }
  }
  return renderList;
}

const Room: React.FC<RoomProps> = (room) => {
  const [elems, setElems] = useState();
  const ref = useRef(0);

  useEffect(() => {
    setElems(renderRoomItems(room));
  }, [room]);
  // let real_x = x / 100;
  // let real_y = y / 100;
  // return <>{name === "" ? 0 : <RoomMesh points={point} color={name} />}</>;

  return (
    <>
      {elems}
      {room.name === "" ? 0 : <RoomMesh room={room} points={room.point} />}
    </>
  );
};
export default Room;

const RoomMesh: React.FC<RoomMeshProps> = ({ room, points }) => {
  const [color, setColor] = useState("orange");

  let x_vals = points.map((p: Point) => p.x / 100);
  let y_vals = points.map((p: Point) => p.y / 100);
  let min_x = Math.min(...x_vals);
  let max_x = Math.max(...x_vals);
  let min_y = Math.min(...y_vals);
  let max_y = Math.max(...y_vals);

  const [shape, geometry] = React.useMemo(() => {
    // console.log(points);
    // console.log(color);

    const s = new Shape();
    s.moveTo(points[0].x / 100, points[0].y / 100);
    for (let i = 1; i < points.length; i++) {
      s.lineTo((points[i].x as number) / 100, (points[i].y as number) / 100);
    }

    const geo = new THREE.ExtrudeGeometry(s, {
      depth: 5, // height
      bevelEnabled: false,
    });
    const boxMatrix = new THREE.Matrix4()
      .makeRotationX(Math.PI / 2)
      .setPosition(new THREE.Vector3(-(max_x - min_x), 0, -(max_y - min_y)));

    geo.applyMatrix4(boxMatrix);
    return [s, geo];
  }, [points]);
  return (
    <>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        {/* <planeGeometry args={[3, 1.5]} /> */}

        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color="#494949" side={THREE.BackSide} />
      </mesh>
      <mesh
        position={[min_x + (max_x - min_x) / 2, 0, min_y + (max_y - min_y) / 2]}
        onClick={() => setColor(color === "orange" ? "hotpink" : "orange")}
      >
        {/* <boxGeometry args={[max_x - min_x, 1, max_y - min_y]} /> */}

        {/* <meshStandardMaterial color={color} /> */}
      </mesh>
      {/* <mesh geometry={geometry} position={[max_x / 2, 0, max_y / 2]}> */}
      {/* <meshNormalMaterial /> */}
      {/* </mesh> */}
    </>
  );
};
