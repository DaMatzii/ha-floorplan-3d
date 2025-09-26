import React, {
  useRef,
  useState,
  useEffect,
  createRef,
  forwardRef,
} from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomeView from "./HomeView";
import { HassConnect, useStore } from "@hakit/core";
import { motion, useMotionValue, useTransform } from "framer-motion";

import { HomeProvider } from "@/context/HomeContext";
import { parseHome, renderHome } from "@/utils/Parser";
import type Home from "@/types/Home.ts";
import HassLight from "@/components/ui/HassLight_test";

import { useBuilding } from "./hooks/useFloorplan";

import EditorView from "@/EditorView";
import { useAppConfigs } from "./hooks/useConfig";

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
//Config
//Load buildings
//Add buildings to things to render
const App: React.FC = () => {
  const { floorplan, entities, loading } = useBuilding();
  const [parsedFloorplan, setFloorplan] = useState<Home>();
  const config = useAppConfigs();
  // const [parsed_entities, setEntities] = useState<Home>();

  useEffect(() => {
    if (floorplan !== undefined) {
      // const [building, floorplan_entities] = parseHome(floorplan, entities);
      // setFloorplan(building);
      // console.log(floorplan_entities);
      // setEntities(building.entities);
    }
    console.log(config);
  }, [config]);

  return (
    <>
      {parsedFloorplan === undefined ? (
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
          <HomeProvider home={parsedFloorplan}>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/light" element={<HassLight />} />
              <Route path="/editor" element={<EditorView />} />
              {/* <Route path="/about" element={<About />} /> */}
              {/* <Route path="/test" element={<TestView />} /> */}
            </Routes>
          </HomeProvider>
        </HassConnect>
      )}
    </>
  );
};

export default App;
