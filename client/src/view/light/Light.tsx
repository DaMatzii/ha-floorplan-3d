import React from "react";
import { Html } from "@react-three/drei";
import { Lightbulb } from "lucide-react";
import { motion, useMotionValue, animate, motionValue } from "framer-motion";
import { useEntity, useHass } from "@hakit/core";
import { useHome } from "@/context/HomeContext";
import { evaluateAction } from "@/utils/EvaluateAction";
import { a, useSpring } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { useBottomSheet } from "@/context/HomeContext";
import { useView } from "@/context/ViewContext";
import HassLight from "./HassLight";
import type { Component } from "@/view/handler/Components";

import type { EntityName } from "@hakit/core";

interface Light {
  room: any;
  position: any;
  entity_id: EntityName;
  tap_action: any;
  index: number;
  double_tap_action: any;
}

const LightComponent: Component = {
  name: "LightComponent",
  bottomSheetY: 0.8,
  component: (props: Light) => <Light {...props} />,
  card: (props: any) => <HassLight {...props} />,
};

const Light: React.FC<Light> = ({
  room,
  position,
  entity_id,
  tap_action,
  double_tap_action,
  index,
}) => {
  const hassEntity = useEntity(entity_id);
  const { callService } = useHass();
  const { setFocusedItem } = useHome();
  const [rotation, setRotation] = React.useState(0);
  const clickTimeout = React.useRef(null);
  const isLightOn = () => {
    return (hassEntity as any).state.toLowerCase() === "on" ? 3 : 0;
  };

  const { openBottomSheet } = useBottomSheet();

  const { editorMode } = useView();
  const intensity = React.useRef(motionValue(isLightOn() ? 1 : 0)).current;

  const lightRef = React.useRef<any>(undefined);

  React.useEffect(() => {
    return () => clearTimeout(clickTimeout.current);
  }, []);

  const handleTapAction = (action) => {
    console.log(action);
    evaluateAction(action, callService, openBottomSheet, {}, { id: entity_id });

    if (action.action === "call-service") setRotation(rotation + 360);
  };

  React.useEffect(() => {
    const controls = animate(
      intensity,
      (hassEntity as any).state.toLowerCase() === "on" ? 3 : 0,
      {
        repeatType: "reverse",
        duration: 0.3,
        ease: "easeInOut",
      },
    );

    return () => controls.stop();
  });

  useFrame(() => {
    if (lightRef.current) lightRef.current.intensity = intensity.get();
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (e.detail === 1) {
      clickTimeout.current = setTimeout(() => {
        console.log("single click");
        handleTapAction(tap_action);
      }, 150);
    } else if (e.detail === 2) {
      clearTimeout(clickTimeout.current);
      if (double_tap_action === undefined) {
        //Default action to more-info if not set maybe in thefuture load from defalt-action
        double_tap_action = {
          action: "more-info",
          card: "light",
        };
      }
      handleTapAction(double_tap_action);
    }
  };
  return (
    <>
      <mesh>
        <Html position={[position.x / 100, position.z / 100, position.y / 100]}>
          <motion.div
            className="bg-white p-2 rounded-full"
            animate={{
              rotate: rotation,
              color:
                (hassEntity as any).state.toLowerCase() === "on"
                  ? "#fbbf24"
                  : "#9ca3af",

              scale: 1,
              opacity: 1,
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
            onClick={handleClick}
          >
            <Lightbulb className={`font-bold`} size={24} strokeWidth={3} />
          </motion.div>
        </Html>
      </mesh>
      {editorMode ? (
        0
      ) : (
        <pointLight
          ref={lightRef}
          position={[
            position.x / 100 + 0.2,
            position.z / 100,
            position.y / 100,
          ]}
          color="orange"
          intensity={3}
        />
      )}
      ;
    </>
  );
};

export default LightComponent;
