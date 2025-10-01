import React from "react";
import type { ComponentProps } from "../Components.ts";
import Light from "../Light.tsx";
import { Html } from "@react-three/drei";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { useEntity, useHass } from "@hakit/core";
import { useHome } from "@/context/HomeContext";
import { evaluateAction } from "@/utils/EvaluateAction";

import { hash } from "three/src/nodes/TSL.js";
type Point = { x: number; y: number };
interface BoxWithLabelProps extends ComponentProps {
  room: any;
  position: any;
  entity_id: string;
  tap_action: any;
}
const BoxWithLabel: React.FC<BoxWithLabelProps> = ({
  room,
  position,
  entity_id,
  tap_action,
  double_tap_action,
}) => {
  const hassEntity = useEntity(entity_id);
  const { callService } = useHass();
  const { setFocusedItem } = useHome();
  const [rotation, setRotation] = React.useState(0);
  const clickTimeout = React.useRef(null);

  React.useEffect(() => {
    return () => clearTimeout(clickTimeout.current);
  }, []);

  const handleTapAction = (action) => {
    evaluateAction(action, callService, {
      "more-info": () => {
        setFocusedItem({
          type: hassEntity.entity_id.split(".")[0],
          hassID: hassEntity.entity_id,
        });
      },
    });

    if (action.action === "call-service") setRotation(rotation + 360);
  };

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
        };
      }
      handleTapAction(double_tap_action);
    }
  };
  return (
    <mesh>
      <Html position={[position.x / 100, position.z / 100, position.y / 100]}>
        <motion.div
          className="bg-white p-2 rounded-full"
          animate={{
            rotate: rotation,
            color:
              hassEntity.state.toLowerCase() === "on" ? "#fbbf24" : "#9ca3af",
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          onClick={handleClick}
        >
          <Lightbulb className={`font-bold`} size={24} strokeWidth={3} />
        </motion.div>
      </Html>
    </mesh>
  );
};
export default BoxWithLabel;
