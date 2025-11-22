import { Canvas, useFrame, useThree } from "@react-three/fiber";

import {
  OrbitControls,
  PerspectiveCamera,
  useHelper,
  DragControls,
  TransformControls,
} from "@react-three/drei";
import React from "react";
import { XMLParser } from "fast-xml-parser";
import YAML from "yaml";

import * as monaco from "monaco-editor";
import { useHome } from "@/context/HomeContext";
import { ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import Editor from "@/editor/Monaco";
import Scene from "@/view/Scene";

const items = ["Item 1", "Item 2", "Item 3", "Item 4"];

function Test({ children, title }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <div className=" h-auto">
        <div
          className="bg-gray-800 flex"
          onClick={() => {
            console.log("CLICKED");
            setOpen(!isOpen);
          }}
        >
          <ChevronRight />
          <p>{title}</p>
        </div>
        <div className="pl-4 pt-2 flex flex-col h-auto gap-2">
          {isOpen ? (
            items.map((item, index) => (
              <p key={index} className="bg-gray-800 ">
                {item}
              </p>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
function Test124() {
  const { home } = useHome();
  return (
    <>
      <p className="text-3xl text-white">HOME: {JSON.stringify(home)}</p>
    </>
  );
}
type AppConfig = {
  buildings: any[];
};

export default function EditorView() {
  const [leftWidth, setLeftWidth] = useState(48); // Tailwind width units (rem)
  const [isDragging, setIsDragging] = useState(false);
  const editorRef = useRef(null);

  const [config, setConfig] = useState();
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);

  const { reloadConfig } = useHome();

  const startDrag = () => setIsDragging(true);
  const stopDrag = () => setIsDragging(false);

  const onDrag = (e) => {
    if (!isDragging) return;
    const containerWidth = window.innerWidth;
    const minWidth = 12; // Tailwind units (3rem)
    const maxWidth = containerWidth / 16 - minWidth; // convert px to rem
    const newWidth = Math.min(Math.max(e.clientX / 16, minWidth), maxWidth);
    setLeftWidth(newWidth);
  };

  // React.useEffect(() => {
  //   if (config === undefined) return;
  //   async function load() {
  //     const parsedConfig = YAML.parse(config);
  //
  //     const buildings = Object.entries(parsedConfig).map(([key, value]) => ({
  //       id: key,
  //       ...(value as any),
  //       floorplan: "test",
  //     }));
  //
  //     if (buildings === undefined) return;
  //
  //     for (let i = 0; i < buildings.length; i++) {
  //       const xmlText = await fetch(buildings[i].floorplan_name).then((r) =>
  //         r.text(),
  //       );
  //
  //       const parser = new XMLParser({
  //         ignoreAttributes: false,
  //         attributeNamePrefix: "",
  //       });
  //       const floorplan = parser.parse(xmlText);
  //       buildings[i].floorplan = floorplan?.home;
  //     }
  //     setAppConfig({
  //       buildings: buildings,
  //     });
  //   }
  //   load();
  // }, [config]);
  React.useEffect(() => {
    editorRef.current
      ?.getEditor()
      .addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        const code = editorRef.current?.getEditor().getValue();
        // console.log("Saving content:");
        // console.log(code);
        reloadConfig(code);
      });
  });

  return (
    <>
      <div className="bg-yellow-500 h-12 w-screen" />
      <div
        className="flex w-full h-64 select-none"
        onMouseMove={onDrag}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        <div
          className="bg-black  h-screen"
          style={{ width: `${leftWidth}rem` }}
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
            <Scene activeCamera={0} editorMode={true} />
          </Canvas>
        </div>
        <div
          className="w-2 bg-gray-500 cursor-ew-resize h-screen "
          onMouseDown={startDrag}
        />
        <div className="bg-green-500 h-screen w-12 flex-1">
          <Editor ref={editorRef} />
        </div>
      </div>
    </>
  );
}
