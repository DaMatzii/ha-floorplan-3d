import { useState } from "react";
import { useBottomSheet } from "@/context/HomeContext";

import FloorplanView from "@/view/FloorplanView";
import { BottomSheet } from "@/components/ui/Bottomsheet";

const DEBUG_CAMERA = 1;
const NORMAL_CAMERA = 0;

const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      style={{
        zIndex: 10,
        top: 20,
        left: 20,
        padding: "0.5rem 1rem",
        fontSize: "1rem",
        color: "white",
      }}
    >
      {children}
    </button>
  );
};

export default function HomeView() {
  const [activeCamera, setActiveCamera] = useState(1);
  const { cardsNode } = useBottomSheet();

  return (
    <>
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 20,
          left: 20,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {false ? (
          <Button
            onClick={() => {
              setActiveCamera((prev) =>
                prev === DEBUG_CAMERA ? NORMAL_CAMERA : DEBUG_CAMERA,
              );
            }}
          >
            Switch Camera ({activeCamera})
          </Button>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center  z-0">
          <div className="canvas-container bg-normal w-screen h-screen">
            <FloorplanView activeCamera={activeCamera} />
          </div>
        </div>
        <BottomSheet>{cardsNode}</BottomSheet>
      </div>
    </>
  );
}
