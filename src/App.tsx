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
  const radius = 120; // distance from center
  const chars = text.split("");
  const angleStep = 180 / chars.length;

  return (
    <div
      className="relative left-0 h-screen w-screen flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      {chars.map((char, i) => {
        const angle = i * angleStep;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              transform: `
		translateX(${i * 20 - 75}px)
		 rotateY(${(i + 5) * 3.5}deg)
		translateZ(${(i ^ 0.01) * -10}px)
              `,
            }}
          >
            {char}
          </span>
        );
      })}
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
