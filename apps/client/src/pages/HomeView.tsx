import { useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { useBottomSheetStore } from "@/store";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import Scene from "@/renderer/Scene";
import ErrorBoundary from "@/utils/3DErrorBoundary";
import { useErrorStore, ErrorType } from "@/store/ErrorStore";
import { ErrorList } from "@/components/ErrorList";
import useIsMobile from "@/hooks/useIsMobile";
import { NoMobile } from "@/components/NoMobile";
import { useCurrentRoom } from "@/hooks";

const DEBUG_CAMERA = 1;
const NORMAL_CAMERA = 0;

function Comp() {
  throw Error("LOL");
  return <></>;
}

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
  const { cardsNode } = useBottomSheetStore();
  const { addError } = useErrorStore();
  const isMobile = useIsMobile();
  const { setIsPreview, isPreview } = useCurrentRoom();
  console.log(cardsNode);

  if (!isMobile && !import.meta.env.DEV) {
    return <NoMobile />;
  }

  function onError(err) {
    addError({
      type: ErrorType.FATAL,
      title: "Error rendering card",
      description: String(err),
    });
  }

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
        {true ? (
          <Button
            onClick={() => {
              setIsPreview(!isPreview);
            }}
          >
            Switch Camera ({activeCamera})
          </Button>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col h-screen bg-gray-100 overscroll-none">
        <div className="flex-1 flex items-center justify-center  z-0">
          <div className="canvas-container bg-normal w-screen h-screen touch-none">
            <Canvas
              gl={{ antialias: false }}
              dpr={[1, 1.5]}
              camera={{
                fov: 45,
                near: 0.1,
                far: 100,
                position: [10, 15, 20],
              }}
            >
              <Stats />
              <Scene activeCamera={activeCamera} editorMode={false} />
            </Canvas>
          </div>
        </div>
        <BottomSheet>
          <ErrorBoundary
            onError={onError}
            fallback={
              <div className="pl-5 mr-5">
                <ErrorList />
              </div>
            }
          >
            {cardsNode}
          </ErrorBoundary>
        </BottomSheet>
      </div>
    </>
  );
}
