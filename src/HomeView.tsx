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

import { backgroundBlurriness } from "three/src/nodes/TSL.js";
type DebugCameraProps = {
  makeDefault?: boolean;
};
const DebugCamera = forwardRef<THREE.PerspectiveCamera, DebugCameraProps>(
  ({ makeDefault }, ref) => {
    const internalRef = useRef<THREE.PerspectiveCamera>(null);

    // Expose internal ref to parent if provided
    React.useImperativeHandle(ref, () => internalRef.current!, []);

    // Attach a CameraHelper
    useHelper(internalRef, THREE.CameraHelper, "cyan");

    return (
      <PerspectiveCamera
        ref={internalRef}
        makeDefault={makeDefault}
        position={[0, 0, 0]}
      />
    );
  },
);
const DEBUG_CAMERA = 1;
const NORMAL_CAMERA = 0;
const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      style={{
        zIndex: 10,
        top: 20,
        left: 20,
        padding: "0.5rem 1rem",
        fontSize: "1rem",
        color: "white",
      }}
    >
      {children}
    </button>
  );
};

export default function HomeView() {
  const [activeCamera, setActiveCamera] = useState(1); // default to debug view
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const { home, currentRoom } = useHome();

  const y = useMotionValue(700);

  useEffect(() => {
    console.log("HomeVIEW::: ", currentRoom);
  }, [currentRoom]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 20,
          left: 20,
          display: "flex",
          flexDirection: "column",
          gap: "10px", // space between buttons
        }}
      >
        <Button
          onClick={() => {
            setActiveCamera((prev) =>
              prev === DEBUG_CAMERA ? NORMAL_CAMERA : DEBUG_CAMERA,
            );
          }}
        >
          Switch Camera ({activeCamera})
        </Button>
      </div>
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Top area */}
        <div className="flex-1 flex items-center justify-center  z-0">
          <div
            className="canvas-container w-screen h-screen"
            style={{
              backgroundColor: "#000000",
            }}
          >
            <Canvas
              shadows
              dpr={[1, 2]}
              camera={{
                fov: 45,
                near: 0.1,
                far: 1000000,
                position: [10, 15, 20],
              }}
            >
              <PerspectiveCamera position={[0, 0, 10]} makeDefault />
              <DebugCamera
                ref={camera}
                makeDefault={activeCamera === DEBUG_CAMERA}
              />

              {/* <ambientLight intensity={0.5} /> */}
              {/* <directionalLight position={[0, 500, 500]} /> */}
              {/* <OrbitControls enableRotate={true} /> */}
              <House mainCamera={camera} />
              {/* <gridHelper args={[2000, 20]} /> */}
              {activeCamera === NORMAL_CAMERA ? <OrbitControls /> : <></>}
            </Canvas>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Bottom Sheet</h2>
        </div>
        <motion.div
          drag="y"
          dragDirectionLock
          onDragEnd={() => {}}
          onDrag={(drag) => {}}
          dragConstraints={{
            top: 400,
            bottom: 680,
          }}
          dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
          dragElastic={0.2}
          style={{ y }}
          whileDrag={{ cursor: "grabbing" }}
          className="
            fixed
            bottom-0
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

          <div className="bottom z-1 mt-4 ml-4">
            <h1>slider</h1>
          </div>
        </motion.div>
        <div className="bottom-0 h-12 left-0 w-screen bg-white absolute z-10">
          {/* <p>Pro</p> */}
          {home !== undefined ? <SliderTest rooms={home.room} /> : 0}
        </div>
      </div>

      <div className=""></div>
    </>
  );
}
