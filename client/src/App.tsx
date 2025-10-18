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
import { RoomView } from "./RoomTestView";
import { RoomCard } from "./RoomCardTest";
import { renderComponent } from "@/lib/test";
import TestLoader from "@/NewLoader";

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
function Test() {
  const Comp = renderComponent();
  return <Comp text="LOOOL" />;
}
//Config
//Load buildings
//Add buildings to things to render
const App: React.FC = () => {
  const { floorplan, entities, loading } = useBuilding();
  const config = useAppConfigs();

  // const [parsed_entities, setEntities] = useState<Home>();

  return (
    <>
      {config === undefined ? (
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
          <HomeProvider home={config}>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/light" element={<HassLight />} />
              <Route path="/editor" element={<EditorView />} />
              <Route path="/test" element={<TestLoader />} />
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
