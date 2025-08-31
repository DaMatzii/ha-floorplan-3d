import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
const box: React.CSSProperties = {
  width: 52,
  height: 52,
  border: "1px solid #f5f5f5",
  position: "absolute",
  backgroundColor: "black",
};

function getRotateY(index: any, currentItem: any) {
  if (index === currentItem - 1) return -50;
  if (index === currentItem + 1) return 50;
  return 0;
}

const SliderTest = ({ rooms, setCurrentIndex }) => {
  const x = useMotionValue(0);

  const itemWidth = 96 + 40;
  const [currentItem, setCurrentItem] = useState(0); // default to debug view
  const [pos, setPos] = useState(0); // store absolute position
  const [anim_pos, setAnimPos] = useState(0); // store absolute position
  const radius = 120;

  // let real_rooms = rooms.map((p: any) => {
  //   if (p !== undefined && p.name !== undefined) {
  //     console.log(p);
  //     return p;
  //   }
  // });
  const real_rooms = rooms.filter(
    (el: any) =>
      el !== "" && el !== null && el !== undefined && el.name !== undefined,
  );
  console.log(real_rooms);

  const ref = useRef(null);

  return (
    <>
      {/* <div className="bg-gray-300 w-32 h-32 absolute top-80 left-1/2 -translate-x-1/2 -translate-y-1/2"></div> */}
      {/* <div className="absolute left-1/2 bg-yellow-200 w-32 h-32 -translate-x-1/2"></div> */}

      {/* <p>Current item: {rooms[currentItem]}</p> */}
      {/* <p>Current item: {currentItem}</p> */}
      {/* <p>: {pos}</p> */}
      {/* <p>anim_pos: {anim_pos}</p> */}
      {/* <p>x: {x.get()}</p> */}
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
          setAnimPos(to);
        }}
        onDrag={(drag) => {
          if (ref.current === null) {
            return;
          }
          let currentScroll = x.get();
          setPos(currentScroll);
          // console.log(currentScroll);
          let currentItem = Math.round(Math.abs(currentScroll) / itemWidth);

          setCurrentItem(currentItem);
          setCurrentIndex(currentItem);
        }}
        style={{ x }}
        dragConstraints={{
          left: -128 * real_rooms.lenght,
          right: 0,
        }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.2}
        whileDrag={{ cursor: "grabbing" }}
        className="absolute flex items-center left-1/2 h-12 w-24 gap-10 -translate-x-1/2 "
      >
        {real_rooms.map((room, index) => {
          {
            console.log(room);
          }
          return (
            <motion.div
              ref={ref}
              key={index}
              className={`flex-shrink-0 w-24 cursor-pointer select-none  ${
                index === currentItem - 1 ||
                index === currentItem + 1 ||
                index === currentItem
                  ? ""
                  : "bg-yellow-200 opacity-0"
              }`}
              // style={{ width: itemWidth }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            >
              <div
                className={`text-sm text-center font-medium whitespace-nowrap ${
                  index === currentItem
                    ? "text-black bg-none" // current item is black
                    : index === currentItem + 1
                      ? "bg-clip-text text-transparent bg-[linear-gradient(to_left,_#f3f4f6_0%,_#f3f4f6_20%,_#000000_100%)]" // next item, fade starts fast
                      : index === currentItem - 1
                        ? "bg-clip-text text-transparent bg-[linear-gradient(to_right,_#f3f4f6_0%,_#f3f4f6_20%,_#000000_100%)]" // previous item, colors swapped, fade starts fast
                        : "" // other items
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
