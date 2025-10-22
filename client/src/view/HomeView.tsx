import React, {
  useRef,
  useState,
  useEffect,
  createRef,
  forwardRef,
} from "react";
import { useHome } from "@/context/HomeContext";
import { useBottomSheet } from "@/context/HomeContext";

import FloorplanView from "@/view/FloorplanView";
import { BottomSheet } from "@/components/ui/Bottomsheet";
import { useUI, loadUI } from "@/hooks/useUI";
import { renderComponent } from "@/view/handler/Components";

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
function renderUI(ui, setUI) {
  let componentsToRender = [];
  console.log(ui);
  Object.keys(ui).map((key, index) => {
    const Comp = renderComponent("ui_" + ui[key]?.type);
    console.log(Comp);
    console.log(ui[key]?.type);
    if (Comp) {
      componentsToRender.push(<Comp key={key + "-" + index} {...ui[key]} />);
    }
  });
  setUI(componentsToRender);
}
export default function HomeView() {
  const [activeCamera, setActiveCamera] = useState(1);
  const [cards, setCards] = useState([]);
  const { state } = useBottomSheet();

  useEffect(() => {
    loadUI(state.activeUI).then((r) => {
      if (!r) return;
      renderUI(r?.cards, setCards);
    });
  }, [state.activeUI]);

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
        <Button
          onClick={() => {
            setActiveCamera((prev) =>
              prev === DEBUG_CAMERA ? NORMAL_CAMERA : DEBUG_CAMERA,
            );
          }}
        >
          Switch Camera ({activeCamera})
        </Button>
      </div>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center  z-0">
          <div
            className="canvas-container w-screen h-screen"
            style={{
              backgroundColor: "#000000",
            }}
          >
            <FloorplanView activeCamera={activeCamera} />
          </div>
        </div>
        <BottomSheet>{cards}</BottomSheet>
      </div>
    </>
  );
}
