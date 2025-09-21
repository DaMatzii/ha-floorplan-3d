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
// import House from "./House";
import { Routes, Route, Link } from "react-router-dom";
import { HassConnect, useEntity, useAreas } from "@hakit/core";
import SliderTest from "@/components/ui/SliderTest";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useHome } from "@/context/HomeContext";
import { useFloorplan } from "./hooks/useFloorplan.tsx";

import { backgroundBlurriness } from "three/src/nodes/TSL.js";
import FloorplanView from "./components/FloorplanView";
import { BottomSheet } from "@/components/ui/Bottomsheet";
import registry from "@/utils/Components.js";

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
  // if (loading) return null;

  const [activeCamera, setActiveCamera] = useState(1); // default to debug view
  const [isBottomSheetToggled, setBottomSheetToggle] = useState(false); // default to debug view
  const { home, focusedItem } = useHome();

  const sheetRef = useRef<{
    open: () => void;
    close: () => void;
    toggle: () => void;
  }>(null);

  const Comp =
    focusedItem.type !== ""
      ? registry.getParser("ui-hass-" + focusedItem.type)
      : null;

  React.useLayoutEffect(() => {
    sheetRef.current.open();
  }, [focusedItem]);

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
            <FloorplanView activeCamera={activeCamera} />
          </div>
        </div>
        <BottomSheet ref={sheetRef}>{Comp ? <Comp /> : 0}</BottomSheet>
      </div>
    </>
  );
}
