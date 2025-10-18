import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type Home from "@/types/Home";

interface FocusedItem {
  type: string;
  id: string;
}

interface HomeContextType {
  currentRoom: number;
  home: Home;
  setCurrentRoom: React.Dispatch<React.SetStateAction<number>>;
  setFocusedItem: React.Dispatch<React.SetStateAction<FocusedItem>>;
  focusedItem: FocusedItem;
  openedUI: string;
  setOpenedUI: React.Dispatch<React.SetStateAction<string>>;
  // setHome: React.Dispatch<React.SetStateAction<Home>>;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

interface HomeProviderProps {
  home: any;
  children: ReactNode;
  editor: boolean;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({
  home,
  editor,
  children,
}) => {
  const [currentRoom, setCurrentRoom] = useState<number>(0);
  const [openedUI, setOpenedUI] = useState<string>(undefined);
  const [focusedItem, setFocusedItem] = useState<FocusedItem>({
    type: "",
    id: "",
  });
  console.log("HOMEPROIVER");

  React.useEffect(() => {
    (async () => {
      const [home, buildings] = await Promise.all([
        fetch("/api/home").then((r) => r.json()),
        fetch("/api/buildings").then((r) => r.json()),
      ]);
      console.log("HOMEPROVIDER");
      console.log(home);
      console.log(buildings);
    })();
  }, []);

  return (
    <HomeContext.Provider
      value={{
        currentRoom,
        home,
        setCurrentRoom,
        setFocusedItem,
        focusedItem,
        openedUI,
        setOpenedUI,
      }}
    >
      {children}
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
