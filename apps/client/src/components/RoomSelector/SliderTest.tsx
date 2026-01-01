import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useHomeStore } from "@/store";
import { useRooms, useCurrentRoom } from "@/hooks/";

export const RoomSelector = () => {
  const x = useMotionValue(0);

  const itemWidth = 96 + 40;
  const [currentItem, setCurrentItem] = useState(0);

  const { setCurrentRoom, currentRoom, setIsPreview } = useCurrentRoom();

  const ref = useRef(null);
  const real_rooms = useRooms();

  useEffect(() => {
    const currentRoomIndex: number = real_rooms.findIndex((room: any) => {
      return room.id === currentRoom;
    });

    setCurrentItem(currentRoomIndex);
    x.set(currentRoomIndex * itemWidth * -1);
  }, [currentRoom]);

  useEffect(() => {
    if (!real_rooms[currentItem]) return;

    setCurrentRoom(real_rooms[currentItem].id);
    setIsPreview(false);
    let to = currentItem * itemWidth * -1;
    animate(x, to, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  }, [currentItem]);

  return (
    <>
      <motion.div
        drag="x"
        dragDirectionLock
        onDragEnd={() => {
          if (ref.current === null) {
            return;
          }

          console.log("onDragEnd");
          let currentScroll = x.get();
          let currentItem1 = Math.round(Math.abs(currentScroll) / itemWidth);

          setCurrentItem(currentItem1);
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
                setCurrentItem(index);
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
                {room.alias ?? "Not named"}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
};
