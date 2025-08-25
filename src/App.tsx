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

const About = () => {
  const [sheetHeight, setSheetHeight] = useState(0.4); // fraction of viewport height

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center p-6">
          <h1 className="text-2xl font-bold text-gray-800">Top Area Content</h1>
        </div>

        {/* Constantly open bottom sheet with variable height */}
        <div
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg p-4"
          style={{ height: `${sheetHeight * 100}vh` }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Bottom Sheet</h2>
          </div>
          <p className="mt-2 text-gray-600">
            This is some content inside the bottom sheet. You can put anything
            here.
          </p>
        </div>
      </div>
    </>
  );
};
const App: React.FC = () => {
  return (
    <>
      {/* <HassConnect */}
      {/* hassUrl="http://192.168.2.101:8123" */}
      {/* hassToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIwZjJiMzgyMWQzYjA0M2M5OWI0ODI2NmFkZDk2MWEzNiIsImlhdCI6MTc1NTg3NjA2MiwiZXhwIjoyMDcxMjM2MDYyfQ.YaVKgKD5dhxWg4nSQSa-1mphzG2rXXj_yAXg1sQP9VU" */}
      {/* > */}
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/about" element={<About />} />
        <Route path="/test" element={<TestView />} />
      </Routes>
      {/* </HassConnect> */}
    </>
  );
};

export default App;
