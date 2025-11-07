import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomeView from "@/view/HomeView";
import { HassConnect, useStore } from "@hakit/core";

import { HomeProvider } from "@/context/HomeContext";
import EditorView from "@/editor/EditorView";

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

const App: React.FC = () => {
  console.log("APP RUUNS!!");
  return (
    <>
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
        <HomeProvider>
          <Routes>
            {/* <HomeView /> */}
            <Route path="/" element={<HomeView />} />
            <Route path="/editor" element={<EditorView />} />
            {/* <Route path="/test" element={<TestLoader />} /> */}
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/test" element={<TestView />} /> */}
          </Routes>
        </HomeProvider>
      </HassConnect>
    </>
  );
};

export default App;
