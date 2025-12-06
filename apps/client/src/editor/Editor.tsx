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
import { useErrorStore, useConfigStore } from "@/store";
import ErrorList from "@/components/ErrorList";

export default function EditorView() {
  const { reload } = useHomeStore();
  const { setEditorMode } = useConfigStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const errors = useErrorStore((state) => state.errors);
  const url = "./api/events";

  React.useEffect(() => {
    setEditorMode(true);
  }, []);

  React.useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      console.log("Reloading!");
      reload();
    };

    eventSource.onerror = (error) => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  function handleClick() {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <>
      <ErrorList
        closeModal={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
      />
      <div className="bg-normal flex  absolute border-1 left-2 top-2 rounded-md border-border h-8 w-[40vw] text-text items-center pl-2 pr-2 z-10">
        <div className="w-full h-full grid  ">
          <h1>Ha Floorplan 3D</h1>
          <button
            onClick={handleClick}
            className="h-max justify-self-end rounded-md"
          >
            {errors.length}
          </button>
        </div>
      </div>
      <div className="bg-black   h-screen w-screen">
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
          {/* <Stats /> */}
          <Grid
            renderOrder={-1}
            position={[0, 0.1, 0]}
            infiniteGrid
            cellSize={1}
            cellColor="white"
            sectionColor="white"
          />
          <ambientLight intensity={3} color="#f4fffa" />
          <Scene activeCamera={0} editorMode={true} />
        </Canvas>
      </div>
    </>
  );
}
