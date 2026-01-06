import React from "react";
import { Html } from "@react-three/drei";
import { useEntities, useEntity } from "@hakit/core";
import { motion } from "framer-motion";
import type { Component } from "@/renderer/Components";
import { useEvaluateAction } from "@/utils/EvaluateAction";
import type { ITemperatureDisplay, IAction } from "@/types";

const TemperatureDisplayComponent: Component = {
  name: "LightComponent",
  component: (props: ITemperatureDisplay) => <TemperatureDisplay {...props} />,
  visibleOnPreview: true,
};

const default_action = (entity_id) => {
  return {
    action: "hass-more-info",
    target: {
      entity_id: entity_id,
    },
  } as IAction;
};

const roundWithDecimals = (number: number, precision: number) => {
  return Number(
    Math.round(Number(number + "e" + precision)) + "e-" + precision,
  );
};

//TODO: Add unit of measurement,
//ISSUE: fix jumping around
const TemperatureDisplay: React.FC<ITemperatureDisplay> = ({
  top_sensor_id,
  bottom_sensor_id,
  position,
  font_size,
  tap_action,
  text_color = "#fffff",
  precision = 1,
}) => {
  const topValue = top_sensor_id
    ? roundWithDecimals(useEntity(top_sensor_id as any)["state"], precision)
    : "null";

  const bottomValue = bottom_sensor_id
    ? roundWithDecimals(useEntity(bottom_sensor_id as any)["state"], precision)
    : "null";

  const { evaluateAction } = useEvaluateAction();

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
          onClick={() =>
            evaluateAction(
              tap_action ??
                default_action(top_sensor_id ?? bottom_sensor_id ?? ""),
            )
          }
        >
          <div
            className="flex flex-col "
            style={{ fontSize: fontSizeWithPixels(1), color: text_color }}
          >
            {top_sensor_id && (
              <div>
                <span className={"font-bold"}>{topValue}</span>
                <span
                  className="align-text-top"
                  style={{ fontSize: fontSizeWithPixels(0.4) }}
                >
                  °C
                </span>
              </div>
            )}

            {bottom_sensor_id && (
              <div className=" -mt-30 text-center ">
                <span
                  style={{
                    fontSize: fontSizeWithPixels(0.75),
                    color: text_color,
                  }}
                >
                  {bottomValue}
                </span>
                <span
                  className="font-bold"
                  style={{ fontSize: fontSizeWithPixels(0.4) }}
                >
                  %
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </Html>
    </>
  );
};
export default TemperatureDisplayComponent;
