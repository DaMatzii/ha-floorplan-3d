import React from "react";
import type { ComponentProps } from "../Components.ts";
import Light from "../Light.tsx";
import { Html } from "@react-three/drei";

type Point = { x: number; y: number };
interface TemperatureDisplayProps extends ComponentProps {
  hassId: any;
  room: any;
  // points: Point[];
}
const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({
  hassId,
  room,
}) => {
  // console.log(hassId);
  console.log(room);
  const middlePoint: Point = React.useMemo(() => {
    // console.log(room);
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
    return { x: center_x, y: center_y };
    // return { x: 10, y: 10 };
  }, [room]);
  return (
    <>
      <mesh>
        <Html
          position={[middlePoint.x + 0.55555, 1, middlePoint.y - 0.4]}
          rotation={[-Math.PI / 2, 0, 0]}
          distanceFactor={1}
          transform
          occlude
        >
          <div
            style={{
              color: "white",
              fontSize: "5rem",
              userSelect: "none",
              cursor: "default",
            }}
          >
            <div className="flex flex-col items-center justify-center ">
              <div className="flex items-start text-white">
                <span className="text-[500px] font-bold">23.4</span>
                <span className="text-[100px] mt-30">°C</span>
              </div>

              <div className="flex items-start -mt-40 text-white">
                <span className="text-[300px]">47.3</span>
                <span className="text-[80] font-bold mt-20">%</span>
              </div>
            </div>
          </div>
        </Html>
      </mesh>
    </>
  );
};
export default TemperatureDisplay;
