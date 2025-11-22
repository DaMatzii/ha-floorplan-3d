import React from "react";
import { HassConnect, useStore } from "@hakit/core";
import { Routes, Route, Link } from "react-router-dom";

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

const HomeView = React.lazy(() => import("@/view/HomeView"));

const basePath = (window as any).__BASE_PATH__;
console.log("BASEPATH: ", basePath);

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
        </Routes>
      </Home>
    </>
  );
};

export default App;
