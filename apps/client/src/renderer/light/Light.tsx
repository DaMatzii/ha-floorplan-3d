import React from "react";
import { Html } from "@react-three/drei";
import { Lightbulb } from "lucide-react";
import { motion, animate, motionValue } from "framer-motion";
import { useEntity } from "@hakit/core";
import { useEvaluateAction } from "@/utils/EvaluateAction";
import { useFrame } from "@react-three/fiber";
import { useConfigStore } from "@/store/";
import type { EntityName } from "@hakit/core";
import type { Component } from "@/renderer/Components";
import type { Light, Room, Action } from "@/types";

const LightComponent: Component = {
  name: "LightComponent",
  component: (props: Light) => <LightComp {...props} />,
};

const LightComp: React.FC<Light> = ({
  position,
  entity_id,
  tap_action,
  double_tap_action,
}) => {
  const hassEntity = useEntity(entity_id as EntityName);
  const { evaluateAction } = useEvaluateAction();
  const [rotation, setRotation] = React.useState(0);

  const editorMode = useConfigStore((state) => state.editorMode);
  const clickTimeout = React.useRef(null);
  const isLightOn = () => {
    return (hassEntity as any).state.toLowerCase() === "on" ? 3 : 0;
  };

  const intensity = React.useRef(motionValue(isLightOn() ? 1 : 0)).current;

  const lightRef = React.useRef<any>(undefined);

  React.useEffect(() => {
    return () => clearTimeout(clickTimeout.current);
  }, []);

  const handleTapAction = (action: Action) => {
    console.log(action);
    evaluateAction(action, {}, { id: entity_id });

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
        <Html
          zIndexRange={[10, 0]}
          position={[position.x / 100, position.z / 100, position.y / 100]}
        >
          <motion.div
            className="bg-[hsl(0,0%,5%)] p-2 rounded-full border-2 border-[hsl(0,0%,30%)] "
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
            <Lightbulb className={`stroke-1`} size={24} />
          </motion.div>
        </Html>
      </mesh>
      {!editorMode && (
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
    </>
  );
};

export default LightComponent;
