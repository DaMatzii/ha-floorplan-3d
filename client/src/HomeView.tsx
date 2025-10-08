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
import { useUI } from "@/hooks/useUI";
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

function renderCards(cards) {
  const renderList: JSX.Element[] = [];
  let runningNumber = 0;
  for (const i in cards) {
    const entity = cards[i];
    console.log(entity);
    let Comp = registry.getParser("ui-" + entity?.type);
    if (Comp) {
      renderList.push(
        <Comp key={entity?.type + "-" + runningNumber} {...(entity as any)} />,
      );
      runningNumber += 1;
    }
  }
  return renderList;
}
export default function HomeView() {
  // if (loading) return null;

  const [activeCamera, setActiveCamera] = useState(1); // default to debug view
  const [isBottomSheetToggled, setBottomSheetToggle] = useState(false); // default to debug view
  const [cards, setCards] = useState([]); // default to debug view
  const { home, focusedItem } = useHome();
  const ui = useUI("ui.yaml");

  useEffect(() => {
    setCards(renderCards(ui?.cards ?? []));
  }, [focusedItem]);

  // const Comp =
  // focusedItem.type !== ""
  // ? registry.getParser("ui-hass-" + focusedItem.type)
  // : null;

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
          gap: "10px",
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
        <BottomSheet>{cards}</BottomSheet>
      </div>
    </>
  );
}
