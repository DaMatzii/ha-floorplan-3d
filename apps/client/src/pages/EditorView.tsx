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
import Toolbar from "@/components/Toolbar";
import { IBuilding } from "@/types";
import { XMLParser } from "fast-xml-parser";
import { parse } from "yaml";
import { useLoadHome } from "@/app/Home";

export default function EditorView() {
  // const { reload } = useHomeStore();
  const { setEditorMode } = useConfigStore();
  const [lastRefreshed, setLastRefreshed] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const { setHome, setReloadFunction } = useHomeStore();
  const { addError, reset, errors } = useErrorStore();
  const fetchHomeData = useLoadHome(
    () => {},
    () => {},
  );

  const url = "./api/events";

  React.useEffect(() => {
    setEditorMode(true);
  }, []);

  React.useEffect(() => {
    let intervalId = null;

    if (setLastRefreshed) {
      intervalId = setInterval(() => {
        const now = Date.now();
        const differenceMs = now - lastRefreshed;

        const differenceSeconds = Math.floor(differenceMs / 1000);

        setElapsedSeconds(differenceSeconds);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [lastRefreshed]);

  React.useEffect(() => {
    const loc = window.location;
    const wsProtocol = loc.protocol === "https:" ? "wss" : "ws";

    let wsUrl = `${wsProtocol}://${loc.host}/api/events`;
    if (import.meta.env.PROD) {
      const parts = window.location.pathname.split("/");
      wsUrl =
        (location.protocol === "https:" ? "wss://" : "ws://") +
        loc.host +
        "/api/hassio_ingress/" +
        parts[3] +
        "/api/events";
    }

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      reload();
      console.log("Received:", event.data);
    };

    return () => {
      // ws.close();
    };
  }, []);

  function reload() {
    fetchHomeData();
    setLastRefreshed(Date.now());
  }

  //TODO: Some way to view what the fuck is the room id
  return (
    <>
      <Toolbar date={elapsedSeconds} manualReload={reload} />
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

          <PerspectiveCamera position={[0, 10, 0]} makeDefault />
          <OrbitControls />
          <ambientLight intensity={3} color="#f4fffa" />
          <Scene activeCamera={0} editorMode={true} />
        </Canvas>
      </div>
    </>
  );
}
