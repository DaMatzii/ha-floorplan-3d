import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type Home from "./Home";

// Define context shape
interface HomeContextType {
  currentRoom: number;
  home: Home;
  setCurrentRoom: React.Dispatch<React.SetStateAction<number>>;
  setHome: React.Dispatch<React.SetStateAction<Home>>;
}

// Create context
const HomeContext = createContext<HomeContextType | undefined>(undefined);

// Provider props
interface HomeProviderProps {
  children: ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const [currentRoom, setCurrentRoom] = useState<number>(0);
  const [home, setHome] = useState<Home>();

  return (
    <HomeContext.Provider
      value={{ currentRoom, home, setCurrentRoom, setHome }}
    >
      {children}
    </HomeContext.Provider>
  );
};

// Custom hook for consuming context
export const useHome = (): HomeContextType => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useRooms must be used within a RoomProvider");
  }
  return context;
};
