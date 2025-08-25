import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
const box: React.CSSProperties = {
  width: 52,
  height: 52,
  border: "1px solid #f5f5f5",
  position: "absolute",
  backgroundColor: "black",
};

const SliderTest = ({
  rooms = [
    "Living Room",
    "Kitchen",
    "Bedroom",
    "Bathroom",
    "Office",
    "Dining Room",
    "Guest Room",
    "Study",
  ],
}) => {
  const scrollX = useMotionValue(0);
  const itemWidth = 120;

  return (
    <>
      <motion.div
        drag="x"
        dragDirectionLock
        onDirectionLock={(direction) =>
          console.log("SET DIRECTION LOCK ", direction)
        }
        onDragEnd={() => console.log("DRAG_END")}
        onDrag={(drag) => console.log("ON DRAG", drag)}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.2}
        whileDrag={{ cursor: "grabbing" }}
        className="flex items-center h-full gap-10 "
      >
        {rooms.map((room, index) => {
          return (
            <motion.div
              key={room}
              className="flex-shrink-0 flex items-center justify-center cursor-pointer select-none bg-gray-300"
              style={{ width: itemWidth }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            >
              <div className="text-sm font-medium whitespace-nowrap">
                {room}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
};

export default SliderTest;
