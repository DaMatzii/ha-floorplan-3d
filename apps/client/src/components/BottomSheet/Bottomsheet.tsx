import React, { useRef, useEffect, useState } from "react";
import { RoomSelector } from "@/components/RoomSelector";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import { useHomeStore, useBottomSheetStore } from "@/store";

export const BottomSheet = ({ children }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  // const y = useTransform(yRaw, (latest) => `${latest}px`);
  const { isOpen, setIsOpen, maxHeight, cardsNode } = useBottomSheetStore();

  const [constraints, setConstraints] = React.useState({
    top: 0,
    bottom: 0,
  });

  useEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );

      console.log("WIndow inner", window.innerHeight);
      console.log("rect top", rect.top);
      console.log("rect.bottom", rect.bottom);

      const px = 16 * 0.25 * rootFontSize;
      const two_px = 2 * 0.25 * rootFontSize;

      const newConstraints = {
        top: 0.25 * window.innerHeight,
        bottom: window.innerHeight - (rect.bottom - rect.top) - 10,
      };

      setConstraints(newConstraints);
      y.set(newConstraints.bottom);
    }
  }, [y, maxHeight]);

  useEffect(() => {
    const target = isOpen ? maxHeight : constraints.bottom;

    animate(y, target, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  }, [isOpen, cardsNode, constraints]);

  const handleDragEnd = (_: any, info: { delta: { x: number; y: number } }) => {
    const isOpening = info.delta.y < 10;
    setIsOpen(isOpening);
  };

  return (
    <>
      <div className="absolute  bottom-0 -translate-y-[65px] h-10 w-screen" />
      <div className="fixed bottom-0  flex items-center justify-center pointer-events-none inset-x-1">
        <div className="relative w-screen  h-screen overflow-hidden border-b rounded-xl pointer-events-none">
          <motion.div
            drag="y"
            dragDirectionLock
            dragConstraints={constraints}
            dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ y }}
            whileDrag={{ cursor: "grabbing" }}
            className="absolute inset-x-0  bg-dark h-screen rounded-xl shadow-2xl p-6 touch-none select-none cursor-grab active:cursor-grabbing pointer-events-auto "
            ref={sidebarRef}
          >
            <div className="w-full flex justify-center">
              <div className="w-16 h-1.5 bg-border mt-1 rounded-full cursor-grab" />
            </div>
            {children}
          </motion.div>
          <div
            ref={targetRef}
            className={`h-16 bottom-0  w-screen absolute z-10   text-text flex items-center justify-center bg-dark  pointer-events-auto  `}
          >
            <RoomSelector />
          </div>
        </div>
      </div>
    </>
  );
};

//TODO: Fix scrolling on safari
// export const BottomSheet = ({ children }) => {
//   const targetRef = useRef<HTMLDivElement>(null);
//   const y = useMotionValue(30);
//   const { isOpen, setIsOpen, maxHeight, cardsNode } = useBottomSheetStore();
//
//   const [constraints, setConstraints] = React.useState({
//     top: 0,
//     bottom: 0,
//   });
//
//   useEffect(() => {
//     if (targetRef.current) {
//       const rect = targetRef.current.getBoundingClientRect();
//       const newConstraints = {
//         top: maxHeight,
//         bottom: window.innerHeight - (rect.bottom - rect.top) / 2 - 48,
//       };
//
//       setConstraints(newConstraints);
//       y.set(newConstraints.bottom);
//     }
//   }, [y, maxHeight]);
//
//   useEffect(() => {
//     const target = isOpen ? maxHeight : constraints.bottom;
//
//     animate(y, target, {
//       type: "spring",
//       stiffness: 300,
//       damping: 30,
//     });
//   }, [isOpen, cardsNode, constraints]);
//
//   const handleDragEnd = (_: any, info: { delta: { x: number; y: number } }) => {
//     const isOpening = info.delta.y < 10;
//     setIsOpen(isOpening);
//   };
//
//   return (
//     <>
//       <div className="absolute bottom-5 z-5 ">
//         <motion.div
//           drag="y"
//           dragDirectionLock
//           dragConstraints={constraints}
//           dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
//           dragElastic={0.2}
//           onDragEnd={handleDragEnd}
//           style={{ y }}
//           whileDrag={{ cursor: "grabbing" }}
//           className="
// 	  fixed
//             left-0
//             right-0
// 	    h-screen
//             rounded-t-2xl shadow-lg border-1 border-border
// overflow-y-auto
// z-5
// bottom-5
// overscroll-none
// pointer-events-auto
// bg-yellow-500/50
// 	    "
//         >
//           <div className="w-full flex justify-center">
//             <div className="w-16 h-1.5 bg-border mt-1 rounded-full cursor-grab" />
//           </div>
//           {children}
//         </motion.div>
//         <div
//           ref={targetRef}
//           className={`bottom-5 h-16 left-0 w-screen absolute z-10 bg-dark border-1 border-x-border `}
//         >
//           <RoomSelector />
//         </div>
//       </div>
//     </>
//   );
// };
