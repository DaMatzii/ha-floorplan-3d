import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Home from "@/store/Home";
import Editor from "@/editor/Editor";

const HomeView = React.lazy(() => import("@/renderer/HomeView"));

const basePath = (window as any).__BASE_PATH__;
console.log("BASEPATH: ", basePath);

const App: React.FC = () => {
  return (
    <>
      <Home>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/editor" element={<Editor />} />
          {/* <Route path="/test" element={<Test />} /> */}
        </Routes>
      </Home>
    </>
  );
};

export default App;
