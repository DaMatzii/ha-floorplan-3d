import React from "react";
import type { ComponentProps } from "../Components.ts";
import Light from "../Light.tsx";
import { Html } from "@react-three/drei";
import { HassConnect, useEntity, useEntities, useDevice } from "@hakit/core";

type Point = { x: number; y: number };
type TemperatureSensor = { temperature: number; humidity: number };
interface TemperatureDisplayProps extends ComponentProps {
  hassId: any;
  room: any;
  xOffset: any;
  yOffset: any;
  fontSize: number;
  // points: Point[];
}
const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({
  hassId,
  room,
  xOffset,
  yOffset,
  fontSize,
}) => {
  const [reading, setReading] = React.useState<TemperatureSensor>({
    temperature: 0,
    humidity: 0,
  }); // default to debug view
  // console.log(hassId);

  const lightStrip = useEntities([
    "sensor.atc_651c_temperature",
    "sensor.atc_651c_humidity",
  ]);
  React.useEffect(() => {
    console.log("LIGHTSTRIP ", lightStrip);
    setReading({
      temperature: Number(lightStrip[0]["state"]),
      humidity: Number(lightStrip[1]["state"]),
    });
  }, []);
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
          position={[middlePoint.x - xOffset, 1, middlePoint.y - yOffset]}
          rotation={[-Math.PI / 2, 0, 0]}
          distanceFactor={1}
          transform
          onClick={() => {
            console.log("lol");
          }}
          // occlude
        >
          <div
            style={{
              color: "white",
              fontSize: fontSize + "px",
              userSelect: "none",
              cursor: "default",
              // zIndex: -1,
              pointerEvents: "none",
            }}
          >
            <div className="flex flex-col items-center justify-center z-0">
              <div className="flex items-start text-white">
                <span className={"text-[" + fontSize + "px] font-bold"}>
                  {reading.temperature}
                </span>
                <span className={"text-[" + (fontSize - 100) + "px] mt-30"}>
                  °C
                </span>
              </div>

              <div className="flex items-start -mt-30 text-white">
                <span className={"text-[" + fontSize + "px]"}>
                  {reading.humidity}
                </span>
                <span
                  className={
                    "text-[" + (fontSize - 100) + "px] font-bold mt-40"
                  }
                >
                  %
                </span>
              </div>
            </div>
          </div>
        </Html>
      </mesh>
    </>
  );
};
export default TemperatureDisplay;
