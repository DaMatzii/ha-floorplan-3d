import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import ErrorBoundary from "@/utils/3DErrorBoundary";

import SetupWizard from "@/pages/SetupView";
import Editor from "@/pages/EditorView";
import HomeView from "@/pages/HomeView";

import { motion } from "framer-motion";

function calculateBaseIngress() {
  const parts = window.location.pathname.split("/");
  if (parts.length <= 4) return "";
  return "/api/hassio_ingress/" + parts[3] + "/";
}

function Lol(fontSize) {
  return (
    <>
      <div className="bg-dark flex flex-col items-center justify-center z-0">
        <motion.div
          style={{
            color: "white",
            userSelect: "none",
            cursor: "default",
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          transition={{
            duration: 0.2,
            scale: { type: "spring", visualDuration: 0.2, bounce: 0.5 },
          }}
        >
          <div
            className="text-white flex flex-col"
            style={{ fontSize: "150px" }}
          >
            <div>
              <span className={"font-bold"}>20.34</span>
              <span className="align-text-top" style={{ fontSize: "75px" }}>
                °C
              </span>
            </div>

            <div className="text-white  -mt-30 text-center ">
              <span style={{ fontSize: "100px" }}>57.97</span>
              <span className="font-bold" style={{ fontSize: "40px" }}>
                %
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

const App: React.FC = () => {
  const basename = calculateBaseIngress();
  console.log(basename);
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
          <Routes>
            <Route path="/*" element={<HomeView />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/setup" element={<SetupWizard />} />
            <Route path="/test" element={<Lol fontSize={200} />} />
          </Routes>
        </Home>
      </ErrorBoundary>
    </>
  );
};

export default App;
