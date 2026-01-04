import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import ErrorBoundary from "@/utils/3DErrorBoundary";

import SetupWizard from "@/pages/SetupView";
import Editor from "@/pages/EditorView";
import HomeView from "@/pages/HomeView";
import { HassConnect } from "@hakit/core";
import { LoadingCircleSpinner } from "@/components/LoadingSpinner";

function calculateBaseIngress() {
  const parts = window.location.pathname.split("/");
  if (parts.length <= 4) return "";
  return "/api/hassio_ingress/" + parts[3] + "/";
}

function resolveWebsocketParams() {
  let websocket = "";
  let auth_token = "";
  if (import.meta.env.DEV) {
    websocket = import.meta.env.VITE_HA_API;
    auth_token = import.meta.env.VITE_HA_TOKEN;
  }

  if (import.meta.env.PROD) {
    websocket =
      (location.protocol === "https:" ? "wss://" : "ws://") +
      location.host +
      "/api/websocket";
  }

  return { websocket, auth_token };
}

const App: React.FC = () => {
  const basename = calculateBaseIngress();
  console.log(basename);

  const { websocket, auth_token } = resolveWebsocketParams();
  return (
    <>
      <ErrorBoundary
        onError={() => {}}
        fallback={
          <p>
            A fatal and unkown error has occured. Please check your
            configuration. There is also a good chance that the fault is not
            yours.
          </p>
        }
      >
        <Home>
          <HassConnect
            hassUrl={websocket}
            hassToken={auth_token}
            loading={<LoadingCircleSpinner />}
          >
            <Routes>
              <Route path="/*" element={<HomeView />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/setup" element={<SetupWizard />} />
            </Routes>
          </HassConnect>
        </Home>
      </ErrorBoundary>
    </>
  );
};

export default App;
