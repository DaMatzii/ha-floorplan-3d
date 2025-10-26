import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  Dispatch,
} from "react";
import type { ReactNode } from "react";
import {
  Home,
  Building,
  BottomSheetNode,
  getBottomSheetNodeType,
} from "@/types";
import { renderComponent } from "@/view/handler/Components";

import { loadUI } from "@/hooks/useUI";

interface FocusedItem {
  type: string;
  id: string;
}

// interface BottomSheetState {
//   isOpen: boolean;
//   maxHeight: number;
// }
//
interface BottomSheetState {
  cardsNode: any;
  openBottomSheet: (node: BottomSheetNode) => void;
  isOpen: boolean;
  maxHeight: number;
  setMaxHeight: React.Dispatch<React.SetStateAction<any>>;
}

interface HomeContextType {
  home: Home;
  buildings: Building[];
  currentRoom: any;
  setCurrentRoom: React.Dispatch<React.SetStateAction<any>>;
  setFocusedItem: React.Dispatch<React.SetStateAction<FocusedItem>>;
  focusedItem: FocusedItem;
  bottomSheetState: BottomSheetState;
}
const HomeContext = createContext<HomeContextType | undefined>(undefined);

interface HomeProviderProps {
  children: ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const [currentRoom, setCurrentRoom] = useState<any>(undefined);
  const [focusedItem, setFocusedItem] = useState<FocusedItem>({
    type: "",
    id: "",
  });
  const [home, setHome] = useState();
  const [buildings, setBuildings] = useState();
  const [isLoading, setLoading] = useState(true);
  const bottomSheetState = useBottomSheet2();

  console.log("LOOOL");

  useEffect(() => {
    async function f() {
      const [home, buildings] = await Promise.all([
        fetch("/api/home").then((r) => r.json()),
        fetch("/api/buildings").then((r) => r.json()),
      ]);
      setHome(home);
      setBuildings(buildings);
      setLoading(false);
    }
    f();
  }, []);

  return (
    <HomeContext.Provider
      value={{
        home,
        buildings,
        currentRoom,
        setCurrentRoom,
        setFocusedItem,
        focusedItem,
        bottomSheetState,
      }}
    >
      {!isLoading ? children : "Loading"}
    </HomeContext.Provider>
  );
};

export const useHome = (): HomeContextType => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useRooms must be used within a RoomProvider");
  }
  return context;
};
export function useBottomSheet(): BottomSheetState {
  const context = useHome();
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }

  return context.bottomSheetState;
}
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

export function useBottomSheet2(): BottomSheetState {
  const [cardsNode, setCardsNode] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [maxHeight, setMaxHeight] = React.useState(75 * window.innerHeight);

  function openBottomSheet(node: BottomSheetNode) {
    //load node and how much should it be open?
    switch (getBottomSheetNodeType(node)) {
      case "card":
        const Comp = renderComponent(node);
        console.log(Comp);
        if (Comp) {
          setCardsNode([Comp]);
        }
        setIsOpen(true);

        break;
      case "ui":
        // loadUI(node).then((r) => {
        // renderUI(r?.cards, setCardsNode);
        // });
        console.log("ui");

        break;
    }
  }
  return {
    cardsNode,
    openBottomSheet,
    isOpen,
    maxHeight,
    setMaxHeight,
  } as BottomSheetState;
}
