import { Canvas, useFrame, useThree } from "@react-three/fiber";

import {
  OrbitControls,
  PerspectiveCamera,
  useHelper,
  DragControls,
  TransformControls,
  Grid,
} from "@react-three/drei";
import React from "react";

import { Stats } from "@react-three/drei";

import { useRef, useState } from "react";
import Scene from "@/renderer/Scene";
import { useHomeStore } from "@/store/HomeStore";

export default function EditorView() {
  const { reload } = useHomeStore();
  function handleClick() {
    reload();
  }

  const url = "./api/events";

  React.useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      // console.log("New message:", event.data);
      reload();
    };

    eventSource.onerror = (error) => {
      // console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      // console.log("Closing EventSource connection.");
      eventSource.close();
    };
  }, [url]);

  return (
    <>
      <div className="bg-yellow-500 h-12 w-screen flex justify-end"></div>
      <div className="bg-black  h-screen w-screen">
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
          <Stats />
          <Grid
            renderOrder={-1}
            position={[0, 0.1, 0]}
            infiniteGrid
            cellSize={1}
            cellColor="white"
            sectionColor="white"
          />
          <ambientLight intensity={1} color="#f4fffa" />
          <Scene activeCamera={0} editorMode={true} />
        </Canvas>
      </div>
    </>
  );
}
