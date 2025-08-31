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
import { motion, useMotionValue, useTransform } from "framer-motion";

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
  const sliderRef = useRef<HTMLDivElement>(null);

  // Track the slider's horizontal position
  const x = useMotionValue(0);

  // Optional: transform x into a 0-100% value
  const sliderValue = useTransform(x, [0, 300], [0, 100]);

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      {/* Bottom Sheet */}
      <motion.div
        drag="y"
        dragConstraints={{ top: -400, bottom: 600 }}
        className="absolute bottom-0 w-full h-96 bg-white rounded-t-3xl shadow-lg"
      >
        <div className="p-4 text-center font-bold">Bottom Sheet</div>
        {/* Bottom sheet content */}
      </motion.div>

      {/* Horizontal Slider */}
      <div className="absolute bottom-4 left-4 right-4 h-12 flex items-center">
        {/* Slider track */}
        <div className="flex-1 h-2 bg-gray-300 rounded mx-2 relative">
          <motion.div
            ref={sliderRef}
            drag="x"
            style={{ x }}
            dragConstraints={{ left: 0, right: 300 }} // track length
            className="absolute w-16 h-8 bg-blue-500 rounded cursor-grab -top-3"
          />
        </div>

        {/* Display slider value */}
        <div className="w-12 text-right text-sm">
          {sliderValue.get().toFixed(0)}%
        </div>
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <>
      <HassConnect
        hassUrl="http://192.168.2.101:8123"
        hassToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIwZjJiMzgyMWQzYjA0M2M5OWI0ODI2NmFkZDk2MWEzNiIsImlhdCI6MTc1NTg3NjA2MiwiZXhwIjoyMDcxMjM2MDYyfQ.YaVKgKD5dhxWg4nSQSa-1mphzG2rXXj_yAXg1sQP9VU"
        loading={<SomeComponent />}
        options={{
          renderError: (error) => <Error />,
          handleResumeOptions: {
            debug: true,
          },
        }}
      >
        <HomeProvider>
          <Routes>
            <Route path="/" element={<HomeView />} />
            {/* <Route path="/about" element={<About />} /> */}
            <Route path="/test" element={<TestView />} />
            <Route path="/rot" element={<RotationTest />} />
          </Routes>
        </HomeProvider>
      </HassConnect>
    </>
  );
};

export default App;
