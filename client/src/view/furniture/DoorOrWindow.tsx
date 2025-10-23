import React from "react";
import Furniture from "./Furniture";

interface DoorOrWindowProps {
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
      <Furniture
        x={x}
        y={y}
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
