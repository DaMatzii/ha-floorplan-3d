import React, {
  useRef,
  useState,
  useEffect,
  createRef,
  forwardRef,
} from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomeView from "./HomeView";
import TestView from "./TestView";
import { HassConnect, useStore } from "@hakit/core";
import { motion } from "framer-motion";

import { HomeProvider } from "./HomeContext";
import { parseHome, renderHome } from "./Parser";
import type Home from "./Home.ts";

function SomeComponent() {
  const connection = useStore((state) => state.connection);

  return (
    <div>
      <h1>HassConnect Status Loading</h1>
      <p>Status: {connection ? "Connected" : "Disconnected"}</p>
    </div>
  );
}
function Error() {
  return <p>erroororor</p>;
}

function RotationTest() {
  const text = "HELLO WORLD";
  const radius = 140; // radius of the 3D circle
  const fontSize = 24;

  const angleStep = 80 / text.length; // even angular spacing

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 perspective-[1000px]">
      <div
        className="relative"
        style={{ transformStyle: "preserve-3d", width: 0, height: 0 }}
      >
        {Array.from(text).map((char, i) => {
          const angle = i * angleStep;
          return (
            <span
              key={i}
              className="absolute font-bold text-white"
              style={{
                fontSize: fontSize,
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                transformOrigin: "center center",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <>
      {/* <HassConnect */}
      {/*   hassUrl="http://192.168.2.101:8123" */}
      {/*   hassToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIwZjJiMzgyMWQzYjA0M2M5OWI0ODI2NmFkZDk2MWEzNiIsImlhdCI6MTc1NTg3NjA2MiwiZXhwIjoyMDcxMjM2MDYyfQ.YaVKgKD5dhxWg4nSQSa-1mphzG2rXXj_yAXg1sQP9VU" */}
      {/*   loading={<SomeComponent />} */}
      {/*   options={{ */}
      {/*     renderError: (error) => <Error />, */}
      {/*     handleResumeOptions: { */}
      {/*       debug: true, */}
      {/*     }, */}
      {/*   }} */}
      {/* > */}
      <HomeProvider>
        <Routes>
          <Route path="/" element={<HomeView />} />
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/test" element={<TestView />} />
          <Route path="/rot" element={<RotationTest />} />
        </Routes>
      </HomeProvider>
      {/* </HassConnect> */}
    </>
  );
};

export default App;
