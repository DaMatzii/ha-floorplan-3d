import React from "react";
import type { ComponentProps } from "../Components.ts";
import Light from "../Light.tsx";
import { Html } from "@react-three/drei";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { useEntity } from "@hakit/core";
import { useHome } from "@/context/HomeContext";

import { hash } from "three/src/nodes/TSL.js";
type Point = { x: number; y: number };
interface BoxWithLabelProps extends ComponentProps {
  room: any;
  position: any;
  entity: string;
}
const BoxWithLabel: React.FC<BoxWithLabelProps> = ({
  room,
  position,
  entity,
}) => {
  const hassEntity = useEntity(entity);
  const { setFocusedItem } = useHome();

  const [rotation, setRotation] = React.useState(0);

  const toggleLight = () => {
    hassEntity.service.toggle();
    setRotation(rotation + 360);
    console.log("LIIGHT");
  };
  const clickTimeout = React.useRef(null);

  React.useEffect(() => {
    return () => clearTimeout(clickTimeout.current);
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    if (e.detail === 1) {
      clickTimeout.current = setTimeout(() => {
        console.log("single click");
        toggleLight();
      }, 150);
    } else if (e.detail === 2) {
      clearTimeout(clickTimeout.current);
      setFocusedItem({
        type: hassEntity.entity_id.split(".")[0],
        hassID: hassEntity.entity_id,
      });
    }
  };
  return (
    <mesh>
      {/* <boxGeometry args={[1, 1, 1]} /> */}
      {/* <meshStandardMaterial color="skyblue" /> */}

      {/* HTML overlay */}
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
