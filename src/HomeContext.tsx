import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type Home from "./Home";

interface HomeContextType {
  currentRoom: number;
  home: Home;
  setCurrentRoom: React.Dispatch<React.SetStateAction<number>>;
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

  return (
    <HomeContext.Provider value={{ currentRoom, home, setCurrentRoom }}>
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
