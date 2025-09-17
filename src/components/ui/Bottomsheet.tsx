import React, {
  useRef,
  useState,
  useEffect,
  createRef,
  forwardRef,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei";
import * as THREE from "three";
import House from "./House";
import { Routes, Route, Link } from "react-router-dom";
import { HassConnect, useEntity } from "@hakit/core";
import SliderTest from "./SliderTest";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useHome } from "./HomeContext";
import { useFloorplan } from "./hooks/useFloorplan.tsx";

type BottomSheetProps = {
  children: React.ReactNode;
};

export function BottomSheet({ children }: BottomSheetProps) {
  const { home, currentRoom } = useHome();
  const targetRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  // const y = useMotionValue("5vh");
  useEffect(() => {
    function updatePosition() {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        console.log(rect.bottom - 30);
        console.log("INNER: ", window.innerHeight);
        // rect.bottom = distance from viewport top to bottom of div
        // y.set("90vh");
        console.log("RECT: ", rect.bottom - rect.top);
        y.set(window.innerHeight - (rect.bottom - rect.top) / 2 - 48);
      }
    }

    updatePosition(); // initial
  }, [y]);

  useEffect(() => {
    console.log("HomeVIEW::: ", currentRoom);
  }, [currentRoom]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Bottom Sheet</h2>
      </div>
      <motion.div
        drag="y"
        dragDirectionLock
        onDragEnd={() => {}}
        onDrag={(drag) => {}}
        dragConstraints={{
          top: window.innerHeight * 0.25,
          bottom:
            window.innerHeight -
            (targetRef.current?.getBoundingClientRect().bottom -
              targetRef.current?.getBoundingClientRect().top) /
              2 -
            48,
        }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.2}
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
        {/* <p>Pro</p> */}
        {home !== undefined ? <SliderTest rooms={home.room} /> : 0}
      </div>
    </>
  );
}
