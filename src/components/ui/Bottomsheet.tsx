import React, { useRef, useEffect } from "react";
import SliderTest from "./SliderTest";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useHome } from "@/context//HomeContext";

interface BottomSheetHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
}
type BottomSheetProps = {
  children: React.ReactNode;
  toggle?: () => void;
};

export const BottomSheet = React.forwardRef<
  BottomSheetHandle,
  BottomSheetProps
>(({ children }, ref) => {
  const { home, currentRoom } = useHome();
  const targetRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const [isOpen, setIsOpen] = React.useState(false);

  const [constraints, setConstraints] = React.useState({
    top: 0,
    bottom: 50,
  });

  React.useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  }));

  useEffect(() => {
    function updatePosition() {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        y.set(window.innerHeight - (rect.bottom - rect.top) / 2 - 48);
        setConstraints({
          top: window.innerHeight * 0.25,
          bottom: window.innerHeight - (rect.bottom - rect.top) / 2 - 48,
        });
      }
    }

    updatePosition();
  }, [y]);

  useEffect(() => {
    const target = isOpen ? window.innerHeight * 0.25 : constraints.bottom;
    animate(y, target, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  }, [isOpen]);

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

        <div className="bottom z-1 mt-4 ml-4">{children}</div>
      </motion.div>
      <div
        ref={targetRef}
        className="bottom-0 h-12 left-0 w-screen bg-white absolute z-10"
      >
        <SliderTest rooms={home.room} />
      </div>
    </>
  );
});
