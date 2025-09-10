import React from "react";
import type { ComponentProps } from "../Components.ts";
import Light from "../Light.tsx";
import { Html } from "@react-three/drei";
import Furniture from "./Furniture.tsx";

// type Point = { x: number; y: number };
interface DoorOrWindowProps extends ComponentProps {
  x: number;
  y: number;
  z: number;
  depth: number;
  width: number;
  height: number;
  elevation: number;
  name: string;
  angle: number;
  catalogId: string;
  dropOnTopElevation: number;
}
const DoorOrWindow: React.FC<DoorOrWindowProps> = ({
  x,
  y,
  z,
  depth,
  width,
  height,
  elevation,
  name,
  angle = 0,
  catalogId,
  dropOnTopElevation,
}) => {
  if (elevation === undefined || name.toLowerCase().includes("door")) {
    elevation = 0;
  }
  return (
    <>
      <mesh
        position={[x / 100, 0.6 + elevation / 100, y / 100]}
        // position={[x / 100, 0, y / 100]}
        rotation={[0, angle, 0]}
      >
        {/* <boxGeometry args={[width / 100, height / 100, depth / 100]} /> */}
      </mesh>
      <Furniture
        x={x}
        y={y}
        name={name}
        height={height}
        depth={depth}
        width={width}
        catalogId={catalogId}
        angle={angle}
        elevation={elevation - dropOnTopElevation}
      />
    </>
  );
};
export default DoorOrWindow;
