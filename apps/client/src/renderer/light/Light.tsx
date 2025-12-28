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
import type { ILight } from "@/types";
import { useClickAction, DefaultAction } from "@/hooks/useClickAction";

const LightComponent: Component = {
  name: "LightComponent",
  component: (props: ILight) => <LightComp {...props} />,
};

const LightComp: React.FC<ILight> = ({
  position,
  entity_id,
  tap_action,
  double_tap_action,
  hold_action,
}) => {
  const hassEntity = useEntity(entity_id as EntityName);
  const { evaluateAction } = useEvaluateAction();

  const editorMode = useConfigStore((state) => state.editorMode);
  const isLightOn = (hassEntity as any).state.toLowerCase() === "on";
  const intensity = React.useRef(motionValue(isLightOn ? 1 : 0)).current;
  const lightRef = React.useRef<any>(undefined);
  const [rotation, setRotation] = React.useState(0);

  const clickHandlers = useClickAction({
    onSingleClick: () => {
      evaluateAction(tap_action ?? DefaultAction(entity_id));
      setRotation(rotation + 360);
    },
    onDoubleClick: () => {
      evaluateAction(double_tap_action);
      if (double_tap_action) setRotation(rotation + 360);
    },
    onHold: () => evaluateAction(hold_action),
  });

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
            {...clickHandlers}
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
