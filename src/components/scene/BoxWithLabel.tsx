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
  xOffset: number;
  yOffset: number;
  hassEntity: string;
}
const BoxWithLabel: React.FC<BoxWithLabelProps> = ({
  room,
  xOffset,
  yOffset,
  hassEntity,
}) => {
  const entity = useEntity(hassEntity);
  const { setFocusedItem } = useHome();

  const [rotation, setRotation] = React.useState(0);

  const middlePoint: Point = React.useMemo(() => {
    // console.log(room);
    console.log("OFFSETS:", xOffset, yOffset);
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
    return {
      x: center_x + Number(xOffset),
      y: center_y + Number(yOffset),
    };
  }, [room, xOffset, yOffset]);

  const toggleLight = () => {
    entity.service.toggle();
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
        type: entity.entity_id.split(".")[0],
        hassID: entity.entity_id,
      });
    }
  };
  return (
    <mesh>
      {/* <boxGeometry args={[1, 1, 1]} /> */}
      {/* <meshStandardMaterial color="skyblue" /> */}

      {/* HTML overlay */}
      <Html position={[middlePoint.x, 3, middlePoint.y]}>
        <motion.div
          className="bg-white p-2 rounded-full"
          animate={{
            rotate: rotation,
            color: entity.state.toLowerCase() === "on" ? "#fbbf24" : "#9ca3af",
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
