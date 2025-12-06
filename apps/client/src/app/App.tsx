import React from "react";
import { HassConnect, useStore } from "@hakit/core";
import { Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Modal from "@/components/Modal";

import Home from "@/store/Home";
import Editor from "@/editor/Editor";

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
  const [message, setMessage] = React.useState("Awaiting server connection...");
  const url = "./api/events";

  React.useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      console.log("New message:", event.data);
      setMessage(event.data);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      setMessage("Connection failed. Retrying...");
      eventSource.close();
    };

    return () => {
      console.log("Closing EventSource connection.");
      eventSource.close();
    };
  }, [url]);

  return (
    <div>
      <h2>Server-Sent Event Status</h2>
      <p>
        Last Message: <strong>{message}</strong>
      </p>
    </div>
  );
}

function Test() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">My Tailwind App</h1>
      <button
        onClick={openModal}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Open Tailwind Modal
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="h-[75vw] w-[60vw] ">
          <p>Nice to meet you</p>
        </div>
      </Modal>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <>
      <Home>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/spinner" element={<LoadingCircleSpinner />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Home>
    </>
  );
};

export default App;
