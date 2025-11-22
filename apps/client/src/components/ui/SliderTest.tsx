import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useHome } from "@/context/HomeContext";
import { useRooms } from "@/hooks/";

const SliderTest = () => {
  const x = useMotionValue(0);

  const itemWidth = 96 + 40;
  const [currentItem, setCurrentItem] = useState(0);

  const { setCurrentRoom } = useHome();

  const ref = useRef(null);
  const real_rooms = useRooms();

  return (
    <>
      <motion.div
        drag="x"
        dragDirectionLock
        onDragEnd={() => {
          let to = currentItem * itemWidth * -1;
          animate(x, to, {
            type: "spring",
            stiffness: 300,
            damping: 30,
          });
        }}
        onDrag={() => {
          if (ref.current === null) {
            return;
          }
          let currentScroll = x.get();
          let currentItem1 = Math.round(Math.abs(currentScroll) / itemWidth);

          setCurrentItem(currentItem1);
          setCurrentRoom(real_rooms[currentItem1]);
        }}
        style={{ x }}
        dragConstraints={{
          left: -128 * real_rooms.length,
          right: 0,
        }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.2}
        whileDrag={{ cursor: "grabbing" }}
        className="absolute flex items-center left-1/2 h-12 w-24 bottom-0 gap-10 -translate-x-1/2 "
      >
        {real_rooms.map((room, index: number) => {
          return (
            <motion.div
              ref={ref}
              key={index}
              className={`flex-shrink-0 w-24 cursor-pointer select-none  ${
                index === currentItem - 1 ||
                index === currentItem + 1 ||
                index === currentItem
                  ? ""
                  : "opacity-0"
              }`}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
              onClick={() => {
                let to = index * itemWidth * -1;
                animate(x, to, {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                });
                setCurrentItem(index);
                setCurrentRoom(real_rooms[index]);
              }}
            >
              <div
                className={`text-sm text-center font-medium whitespace-nowrap ${
                  index === currentItem
                    ? "text-[hsl(0,0%,90%)] bg-none"
                    : index === currentItem + 1
                      ? "bg-clip-text text-transparent bg-[linear-gradient(to_right,_#ffffff,_#000000)]"
                      : index === currentItem - 1
                        ? "bg-clip-text text-transparent bg-[linear-gradient(to_left,_#ffffff,_#000000)]"
                        : ""
                }`}
              >
                {room.alias ?? "testi"}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
};

export default SliderTest;
