import React from "react";
import { Html } from "@react-three/drei";
import { useEntities } from "@hakit/core";
import { motion } from "framer-motion";
import type { Component } from "@/view/handler/Components";

type Point = { x: number; y: number };
type TemperatureSensor = { temperature: number; humidity: number };
interface TemperatureDisplayProps {
  hassId: any;
  topSensor: string;
  bottomSensor: string;
  position: any;
  fontSize: number;
  // points: Point[];
}
const TemperatureDisplayComponent: Component = {
  name: "LightComponent",
  bottomSheetY: 0.75,
  component: (props: TemperatureDisplayProps) => (
    <TemperatureDisplay {...props} />
  ),
};

const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({
  hassId,
  topSensor,
  bottomSensor,
  position,
  fontSize,
}) => {
  const [reading, setReading] = React.useState<TemperatureSensor>({
    temperature: 0,
    humidity: 0,
  }); // default to debug view
  // console.log(hassId);

  const lightStrip = useEntities([topSensor as any, bottomSensor as any]);
  React.useEffect(() => {
    setReading({
      temperature: Number(lightStrip[0]["state"]),
      humidity: Number(lightStrip[1]["state"]),
    });
  }, []);

  return (
    <>
      <Html
        position={[position.x / 100, position.z / 100, position.y / 100]}
        rotation={[-Math.PI / 2, 0, 0]}
        distanceFactor={1}
        transform
        pointerEvents="none"
        style={{
          userSelect: "none",
        }}
        // occlude
      >
        <motion.div
          style={{
            color: "white",
            fontSize: fontSize + "px",
            userSelect: "none",
            cursor: "default",
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          transition={{
            duration: 0.2,
            scale: { type: "spring", visualDuration: 0.2, bounce: 0.5 },
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

            <div className="flex items-start -mt-40 text-white">
              <span className={"text-[" + fontSize + "px]"}>
                {reading.humidity}
              </span>
              <span
                className={"text-[" + (fontSize - 100) + "px] font-bold mt-30"}
              >
                %
              </span>
            </div>
          </div>
        </motion.div>
      </Html>
    </>
  );
};
export default TemperatureDisplayComponent;
