import React, { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "../Components.ts";
import ReactDOM from "react-dom/client";
import Light from "../Light.tsx";
import { Shape } from "three";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import registry from "../Components.ts";
import type { JSX } from "react/jsx-runtime";

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
  useEffect(() => {
    setElems(renderRoomItems(room));
  }, [room]);
  // let real_x = x / 100;
  // let real_y = y / 100;
  // return <>{name === "" ? 0 : <RoomMesh points={point} color={name} />}</>;
  return (
    <>
      {elems}
      {room.name === "" ? (
        0
      ) : (
        <RoomMesh points={room.point} color={room.name} />
      )}
    </>
  );
};
export default Room;

const RoomMesh: React.FC<RoomMeshProps> = ({ points, color = "orange" }) => {
  const shape = React.useMemo(() => {
    // console.log(points);
    // console.log(color);
    const s = new Shape();
    s.moveTo(points[0].x / 100, points[0].y / 100);
    for (let i = 1; i < points.length; i++) {
      s.lineTo((points[i].x as number) / 100, (points[i].y as number) / 100);
    }
    return s;
  }, [points]);

  return (
    <>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        {/* <planeGeometry args={[3, 1.5]} /> */}

        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color="#494949" side={THREE.BackSide} />
      </mesh>
    </>
  );
};
