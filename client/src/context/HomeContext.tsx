import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type Home from "@/types/Home";

interface FocusedItem {
  type: string;
  hassID: string;
}

interface HomeContextType {
  currentRoom: number;
  home: Home;
  setCurrentRoom: React.Dispatch<React.SetStateAction<number>>;
  setFocusedItem: React.Dispatch<React.SetStateAction<FocusedItem>>;
  focusedItem: FocusedItem;
  // setHome: React.Dispatch<React.SetStateAction<Home>>;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

interface HomeProviderProps {
  children: ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({
  home,
  children,
}) => {
  const [currentRoom, setCurrentRoom] = useState<number>(0);
  const [focusedItem, setFocusedItem] = useState<FocusedItem>({
    type: "",
    hassID: "",
  });

  return (
    <HomeContext.Provider
      value={{ currentRoom, home, setCurrentRoom, setFocusedItem, focusedItem }}
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
