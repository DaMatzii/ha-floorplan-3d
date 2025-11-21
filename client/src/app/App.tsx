import React from "react";
import { Routes, Route, Link } from "react-router-dom";
// import HomeView from "@/view/HomeView";
import { HassConnect, useStore } from "@hakit/core";
// import Test from "@/Test";

import { HomeProvider } from "@/context/HomeContext";
import EditorView from "@/editor/EditorView";
import HassRoom from "@/view/room/HassRoom";
import useAppConfiguration from "@/hooks/useAppConfiguration";
import SetupWizard from "./SetupWizard";

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
  const { config } = useAppConfiguration();

  if (!config?.configured) {
    return <SetupWizard />;
  }

  return (
    <>
      {/* <React.Suspense fallback={<Testing />}> */}
      <HassConnect
        hassUrl="http://192.168.2.101:8123"
        hassToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIwZjJiMzgyMWQzYjA0M2M5OWI0ODI2NmFkZDk2MWEzNiIsImlhdCI6MTc1NTg3NjA2MiwiZXhwIjoyMDcxMjM2MDYyfQ.YaVKgKD5dhxWg4nSQSa-1mphzG2rXXj_yAXg1sQP9VU"
        loading={<Testing />}
        options={{
          renderError: (error) => <Error />,
          handleResumeOptions: {
            debug: true,
          },
        }}
      >
        <HomeProvider>
          <HomeView />
          {/* <Routes> */}
          {/* <Route path="/" element={<HomeView />} /> */}
          {/* <Route path="/editor" element={<EditorView />} /> */}
          {/* <Route path="/testing" element={<Testing />} /> */}
          {/* </Routes> */}
        </HomeProvider>
      </HassConnect>
      {/* </React.Suspense> */}
    </>
  );
};

export default App;
