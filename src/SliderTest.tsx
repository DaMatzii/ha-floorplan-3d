import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
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
  setCurrentIndex,
}) => {
  const x = useMotionValue(0);

  const itemWidth = 120;
  const [currentItem, setCurrentItem] = useState(0); // default to debug view
  const [pos, setPos] = useState(0); // store absolute position
  const [anim_pos, setAnimPos] = useState(0); // store absolute position

  const ref = useRef(null);

  return (
    <>
      <div className="bg-black w-32 h-32 absolute top-80 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <p>Current item: {rooms[currentItem]}</p>
      <p>Current item: {currentItem}</p>
      <p>: {pos}</p>
      <p>anim_pos: {anim_pos}</p>
      <p>x: {x.get()}</p>
      <motion.div
        drag="x"
        dragDirectionLock
        onDirectionLock={(direction) =>
          console.log("SET DIRECTION LOCK ", direction)
        }
        onDragEnd={() => {
          console.log("drag end");
          let to = currentItem * (120 + 40) * -1;
          animate(x, to, {
            type: "spring",
            stiffness: 300,
            damping: 30,
          });
          setAnimPos(to);
        }}
        onDrag={(drag) => {
          console.log(drag);
          if (ref.current === null) {
            return;
          }
          let currentScroll = x.get();
          setPos(currentScroll);
          console.log(currentScroll);
          let currentItem = Math.round(Math.abs(currentScroll) / (120 + 40));

          setCurrentItem(currentItem);
          console.log(rooms[currentItem]);
          setCurrentIndex(currentItem);

          console.log("ON DRAG", drag);
        }}
        style={{ x }}
        dragConstraints={{
          left: -120 * 12,
          right: 10,
        }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.2}
        whileDrag={{ cursor: "grabbing" }}
        className="absolute flex items-center left-[140px]  mt-[-100px] h-full gap-10 "
      >
        {rooms.map((room, index) => {
          return (
            <motion.div
              ref={ref}
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
                {room} {index}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
};

export default SliderTest;
