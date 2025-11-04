import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  Dispatch,
} from "react";
import type { ReactNode } from "react";
import { Home, Building, BottomSheetType } from "@/types/";
import { renderComponent } from "@/view/handler/Components";

import { loadUI } from "@/hooks/useUI";
import { parse, stringify } from "yaml";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";

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
  openBottomSheet: (
    node: BottomSheetType,
    maxHeight: number,
    data: any,
  ) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
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
  reloadConfig: (building: string) => void;
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
  const [buildings, setBuildings] = useState<Building[]>();
  const [isLoading, setLoading] = useState(true);
  const bottomSheetState = useBottomSheet2();

  console.log("LOOOL");

  useEffect(() => {
    async function f() {
      const [home, buildings] = await Promise.all([
        fetch("/api/home").then((r) => r.json()),
        fetch("/api/building/0/").then((r) => r.json()),
      ]);
      //TODO

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
      });
      const building = parser.parse(buildings.floorplan_building)?.home;

      const buil = {
        title: "",
        floorplan_building: building,
        rooms: parse(buildings.raw_rooms),
      } as Building;

      console.log(buil);

      setHome(home);
      setBuildings([buil]);
      setLoading(false);
    }
    f();
  }, []);
  function reloadConfig(conf: string) {
    // console.log(parse(conf).building1);
    const buil = {
      title: "",
      floorplan_building: buildings[0].floorplan_building,
      rooms: parse(conf).building1.rooms,
    } as Building;
    // console.log(buil);

    setBuildings([buil]);
  }

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
        reloadConfig,
      }}
    >
      {!isLoading ? children : "Loading"}
    </HomeContext.Provider>
  );
};

export const useHome = (): HomeContextType => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useRooms must be used within a HomeProvider");
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
  const [cardsNode, setCardsNode] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [maxHeight, setMaxHeight] = React.useState(0.75 * window.innerHeight);

  function openBottomSheet(node: any, max: number, data: any) {
    //load node and how much should it be open?
    switch ((node as string).split("_")[0]) {
      case "card":
        const Comp = renderComponent(node);
        console.log(Comp);
        if (Comp) {
          setCardsNode([<Comp key={node} {...data} />]);
        }

        break;
      case "ui":
        loadUI((node as string).split("_")[1]).then((r) => {
          renderUI(r?.cards, setCardsNode);
        });
        break;
    }
    setIsOpen(true);
    setMaxHeight(max);
  }
  return {
    cardsNode,
    openBottomSheet,
    isOpen,
    setIsOpen,
    maxHeight,
    setMaxHeight,
  } as BottomSheetState;
}
