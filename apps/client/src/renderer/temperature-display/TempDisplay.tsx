import React from "react";
import { Html } from "@react-three/drei";
import { useEntities } from "@hakit/core";
import { motion } from "framer-motion";
import type { Component } from "@/renderer/Components";
import { useEvaluateAction } from "@/utils/EvaluateAction";
import type { ITemperatureDisplay } from "@/types";

const TemperatureDisplayComponent: Component = {
  name: "LightComponent",
  component: (props: ITemperatureDisplay) => <TemperatureDisplay {...props} />,
  visibleOnPreview: true,
};

//TODO: Add unit of measurement
const TemperatureDisplay: React.FC<ITemperatureDisplay> = ({
  top_sensor_id,
  bottom_sensor_id,
  position,
  font_size,
  tap_action,
}) => {
  const sensors = useEntities([top_sensor_id as any, bottom_sensor_id as any]);
  console.log(sensors);
  const { evaluateAction } = useEvaluateAction();

  const topValue = sensors[0]["state"] ?? "null";
  const bottomValue = sensors[1]["state"] ?? "null";

  const fontSizeWithPixels = (factor: number) => {
    return font_size * factor + "px";
  };
  return (
    <>
      <Html
        position={[position.x / 100, position.z / 100, position.y / 100]}
        rotation={[-Math.PI / 2, 0, 0]}
        distanceFactor={1}
        transform
        zIndexRange={[10, 0]}
        style={{
          userSelect: "none",
        }}
      >
        <motion.div
          style={{
            color: "white",
            userSelect: "none",
            cursor: "default",
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          transition={{
            duration: 0.2,
            scale: { type: "spring", visualDuration: 0.2, bounce: 0.5 },
          }}
          onClick={() => evaluateAction(tap_action)}
        >
          <div
            className="text-white flex flex-col "
            style={{ fontSize: fontSizeWithPixels(1) }}
          >
            <div>
              <span className={"font-bold"}>{topValue}</span>
              <span
                className="align-text-top"
                style={{ fontSize: fontSizeWithPixels(0.4) }}
              >
                °C
              </span>
            </div>

            <div className="text-white  -mt-30 text-center ">
              <span style={{ fontSize: fontSizeWithPixels(0.75) }}>
                {bottomValue}
              </span>
              <span
                className="font-bold"
                style={{ fontSize: fontSizeWithPixels(0.4) }}
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
