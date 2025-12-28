import React, { useRef, useEffect } from "react";
import { RoomSelector } from "@/components/RoomSelector";
import { motion, useMotionValue, animate } from "framer-motion";
import { useHomeStore, useBottomSheetStore } from "@/store";

export const BottomSheet = ({ children }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const { isOpen, setIsOpen, maxHeight, cardsNode } = useBottomSheetStore();

  const [constraints, setConstraints] = React.useState({
    top: 0,
    bottom: 0,
  });

  useEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const newConstraints = {
        top: maxHeight,
        bottom: window.innerHeight - (rect.bottom - rect.top) / 2 - 48,
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
      <motion.div
        drag="y"
        dragDirectionLock
        dragConstraints={constraints}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ y }}
        whileDrag={{ cursor: "grabbing" }}
        className="
	  fixed
            left-0
            right-0
	    bg-dark
	    h-screen
            rounded-t-2xl shadow-lg border-1 border-border
overflow-y-auto
z-5

overscroll-none
pointer-events-auto
	    "
      >
        <div className="w-full flex justify-center">
          <div className="w-16 h-1.5 bg-border mt-1 rounded-full cursor-grab" />
        </div>
        {children}
      </motion.div>
      <div
        ref={targetRef}
        className={`bottom-0 h-16 left-0 w-screen absolute z-10 bg-dark border-1 border-x-border `}
      >
        <RoomSelector />
      </div>
    </>
  );
};
