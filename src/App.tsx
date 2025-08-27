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

import { HomeProvider } from "./HomeContext";
import { parseHome, renderHome } from "./Parser";
import type Home from "./Home.ts";

const App: React.FC = () => {
  return (
    <>
      <HassConnect
        hassUrl="http://192.168.2.101:8123"
        hassToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIwZjJiMzgyMWQzYjA0M2M5OWI0ODI2NmFkZDk2MWEzNiIsImlhdCI6MTc1NTg3NjA2MiwiZXhwIjoyMDcxMjM2MDYyfQ.YaVKgKD5dhxWg4nSQSa-1mphzG2rXXj_yAXg1sQP9VU"
      >
        <HomeProvider>
          <Routes>
            <Route path="/" element={<HomeView />} />
            {/* <Route path="/about" element={<About />} /> */}
            <Route path="/test" element={<TestView />} />
          </Routes>
        </HomeProvider>
      </HassConnect>
    </>
  );
};

export default App;
