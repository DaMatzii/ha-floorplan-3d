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

import { useFloorplan } from "./hooks/useFloorplan.tsx";

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

const App: React.FC = () => {
  const { floorplan, loading } = useFloorplan();
  const [home, setHome] = useState<Home>();

  useEffect(() => {
    if (floorplan !== undefined) {
      setHome(parseHome(floorplan));
    }
  }, [loading]);

  return (
    <>
      {home === undefined ? (
        "No home no page"
      ) : (
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
          <HomeProvider home={home}>
            <Routes>
              <Route path="/" element={<HomeView />} />
              {/* <Route path="/about" element={<About />} /> */}
              <Route path="/test" element={<TestView />} />
            </Routes>
          </HomeProvider>
        </HassConnect>
      )}
    </>
  );
};

export default App;
