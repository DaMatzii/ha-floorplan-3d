import React from "react";
import type { ComponentProps } from "../Components.ts";
import Light from "../Light.tsx";
import { Html } from "@react-three/drei";

type Point = { x: number; y: number };
interface BoxWithLabelProps extends ComponentProps {
  room: any;
  xOffset: number;
  yOffset: number;
}
const BoxWithLabel: React.FC<BoxWithLabelProps> = ({
  room,
  xOffset,
  yOffset,
}) => {
  const middlePoint: Point = React.useMemo(() => {
    // console.log(room);
    console.log("OFFSETS:", xOffset, yOffset);
    let x_vals = room.point.map((p: Point) => p.x / 100);
    let y_vals = room.point.map((p: Point) => p.y / 100);
    let min_x = Math.min(...x_vals);
    let max_x = Math.max(...x_vals);
    let min_y = Math.min(...y_vals);
    let max_y = Math.max(...y_vals);
    let width = max_x - min_x;
    let height = max_y - min_y;
    let center_x = min_x + width / 2;
    let center_y = min_y + height / 2;
    return {
      x: center_x + Number(xOffset),
      y: center_y + Number(yOffset),
    };
  }, [room, xOffset, yOffset]);
  return (
    <mesh>
      {/* <boxGeometry args={[1, 1, 1]} /> */}
      {/* <meshStandardMaterial color="skyblue" /> */}

      {/* HTML overlay */}
      <Html position={[middlePoint.x, 3, middlePoint.y]}>
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
};
export default BoxWithLabel;
