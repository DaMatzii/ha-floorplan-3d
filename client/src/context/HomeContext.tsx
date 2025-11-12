import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Home, Building } from "@/types/";

import { parse } from "yaml";
import { BottomSheetState } from "./types";
import { useBottomSheet2 } from "./BottomSheetContext";
import { loadHome } from "@/utils/loadHome";

interface FocusedItem {
  type: string;
  id: string;
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
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setLoading] = useState(true);
  const bottomSheetState = useBottomSheet2();

  useEffect(() => {
    async function f() {
      const { home, buildings } = await loadHome();

      setHome(home);
      setBuildings(buildings);
      setLoading(false);
    }
    f();
  }, []);

  function reloadConfig(conf: string) {
    const buil = {
      title: "",
      floorplan_building: buildings[0].floorplan_building,
      rooms: parse(conf).building1.rooms,
    } as Building;

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
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
};

export { useBottomSheet } from "./BottomSheetContext";
