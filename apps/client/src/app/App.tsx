import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/store/Home";
import Editor from "@/editor/Editor";
import { BrowserRouter } from "react-router-dom";

const HomeView = React.lazy(() => import("@/renderer/HomeView"));

const basePath = (window as any).__BASE_PATH__;
console.log("BASEPATH: ", basePath);

function baseAfterFourthSlash() {
  const parts = window.location.pathname.split("/");
  console.log(parts);

  if (parts.length <= 4) return "";

  return "/api/hassio_ingress/" + parts[3] + "/";
}

const App: React.FC = () => {
  const basename = baseAfterFourthSlash();
  console.log(basename);

  return (
    <>
      <BrowserRouter basename={basename}>
        <Home>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/editor" element={<Editor />} />
          </Routes>
          {/* <Route path="/test" element={<Test />} /> */}
        </Home>
      </BrowserRouter>
    </>
  );
};

export default App;
