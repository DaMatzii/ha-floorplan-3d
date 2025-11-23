import React from "react";
import { HassConnect, useStore } from "@hakit/core";
import { Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";

import Home from "@/store/Home";

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
function Testing() {
  return <div className="w-screen h-screen bg-dark">Testing loading</div>;
}

const HomeView = React.lazy(() => import("@/renderer/HomeView"));

const basePath = (window as any).__BASE_PATH__;
console.log("BASEPATH: ", basePath);

function LoadingCircleSpinner() {
  return (
    <div className="w-screen h-screen bg-dark flex items-center justify-center flex-col">
      <motion.div
        className="spinner  w-20 h-20 rounded-full border-b-text border-2 border-light"
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.9,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

const App: React.FC = () => {
  // const { config } = useAppConfiguration();

  // if (!config?.configured) {
  //   return <SetupWizard />;
  // }

  return (
    <>
      <Home>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/spinner" element={<LoadingCircleSpinner />} />
        </Routes>
      </Home>
    </>
  );
};

export default App;
