import React, { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "../Components.ts";
import ReactDOM from "react-dom/client";
import Light from "../Light.tsx";
import { Shape } from "three";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import html2canvas from "html2canvas";
type Point = { x: number; y: number };
interface RoomMeshProps {
  points: Point[];
  color: string;
}
interface RoomProps extends ComponentProps {
  point: any;
}
const Room: React.FC<RoomProps> = ({ point, name }) => {
  // let real_x = x / 100;
  // let real_y = y / 100;
  // console.log(name);
  return <>{name === "" ? 0 : <RoomMesh points={point} color={name} />}</>;
};
export default Room;

const RoomMesh: React.FC<RoomMeshProps> = ({ points, color = "orange" }) => {
  const shape = React.useMemo(() => {
    console.log(points);
    console.log(color);
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
        <Html
          position={[-0.5, 0, 0.51]}
          rotation={[0, 0, 0]}
          distanceFactor={1}
          transform
          occlude
        >
          <div
            style={{
              background: "rgba(0,0,0,0.7)",
              padding: "4px 8px",
              borderRadius: "4px",
              color: "white",
              fontSize: "5rem",
              userSelect: "none",
              cursor: "default",
            }}
          >
            Side Label
          </div>
        </Html>
      </mesh>
    </>
  );
};
