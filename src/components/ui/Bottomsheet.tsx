import React, { useRef, useEffect } from "react";
import SliderTest from "./SliderTest";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useHome } from "@/context//HomeContext";
import BottomSheetContext from "@/context/BottomSheetContext";

export const BottomSheet = ({ children }) => {
  const { home } = useHome();
  const targetRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const [openY, setOpenY] = React.useState(0);

  const [constraints, setConstraints] = React.useState({
    top: 0,
    bottom: 0,
  });

  useEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const newConstraints = {
        top: window.innerHeight * 0.25,
        bottom: window.innerHeight - (rect.bottom - rect.top) / 2 - 48,
      };

      setOpenY(newConstraints.top);
      setConstraints(newConstraints);
      y.set(newConstraints.bottom);
    }
  }, [y]);

  useEffect(() => {
    const target = isOpen ? openY : constraints.bottom;

    animate(y, target, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  }, [isOpen, constraints, openY]);

  const handleDragEnd = (_: any, info: { delta: { x: number; y: number } }) => {
    const isOpening = info.delta.y < 0;
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
            bg-white
            rounded-t-2xl shadow-lg z-5
	    h-screen
	    "
      >
        <div className="w-full flex justify-center">
          <div className="w-16 h-1.5 bg-gray-400 mt-1 rounded-full cursor-grab" />
        </div>

        <BottomSheetContext.Provider
          value={{ isOpen, openY, setIsOpen, setOpenY }}
        >
          <div className="mt-3">{children}</div>
        </BottomSheetContext.Provider>
      </motion.div>
      <div
        ref={targetRef}
        className="bottom-0 h-12 left-0 w-screen bg-white absolute z-10"
      >
        <SliderTest rooms={home.room} />
      </div>
    </>
  );
};
