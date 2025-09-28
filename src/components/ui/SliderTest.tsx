import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useHome } from "@/context/HomeContext";

function getRotateY(index: any, currentItem: any) {
  if (index === currentItem - 1) return -50;
  if (index === currentItem + 1) return 50;
  return 0;
}

const SliderTest = () => {
  const x = useMotionValue(0);

  const itemWidth = 96 + 40;
  const [currentItem, setCurrentItem] = useState(0);

  const { setCurrentRoom, home } = useHome();
  // console.log(rooms);
  let rooms = [];
  for (let i = 0; i < home.buildings.length; i++) {
    const building = home.buildings[i];
    rooms.push(...building.floorplan?.room);
  }
  console.log(rooms);

  const real_rooms = rooms
    .map((room, originalIndex) => ({ room, originalIndex })) // attach original index
    .filter(
      ({ room }) =>
        room !== "" &&
        room !== null &&
        room !== undefined &&
        room.name !== undefined,
    );

  const ref = useRef(null);

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
          let currentItem = Math.round(Math.abs(currentScroll) / itemWidth);

          setCurrentItem(currentItem);
          setCurrentRoom(real_rooms[currentItem].originalIndex);
        }}
        style={{ x }}
        dragConstraints={{
          left: -128 * real_rooms.lenght,
          right: 0,
        }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.2}
        whileDrag={{ cursor: "grabbing" }}
        className="absolute flex items-center left-1/2 h-12 w-24 bottom-0 gap-10 -translate-x-1/2 "
      >
        {real_rooms.map(({ room, originalIndex }, index: number) => {
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
                setCurrentRoom(originalIndex);
              }}
            >
              <div
                className={`text-sm text-center font-medium whitespace-nowrap ${
                  index === currentItem
                    ? "text-black bg-none"
                    : index === currentItem + 1
                      ? "bg-clip-text text-transparent bg-[linear-gradient(to_left,_#f3f4f6_0%,_#f3f4f6_20%,_#000000_100%)]"
                      : index === currentItem - 1
                        ? "bg-clip-text text-transparent bg-[linear-gradient(to_right,_#f3f4f6_0%,_#f3f4f6_20%,_#000000_100%)]"
                        : ""
                }`}
              >
                {room.name}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
};

export default SliderTest;
