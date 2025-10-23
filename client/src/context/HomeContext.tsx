import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  Dispatch,
} from "react";
import type { ReactNode } from "react";
import type { Home, Building } from "@/types";

interface FocusedItem {
  type: string;
  id: string;
}

interface BottomSheetState {
  isOpen: boolean;
  maxHeight: number;
  activeUI: string;
}

interface HomeContextType {
  home: Home;
  buildings: Building[];
  currentRoom: any;
  setCurrentRoom: React.Dispatch<React.SetStateAction<any>>;
  setFocusedItem: React.Dispatch<React.SetStateAction<FocusedItem>>;
  focusedItem: FocusedItem;
  dispatch: Dispatch<BottomSheetAction>;
  bottomSheetState: BottomSheetState;
}
const HomeContext = createContext<HomeContextType | undefined>(undefined);

interface HomeProviderProps {
  children: ReactNode;
}
const initialState: BottomSheetState = {
  isOpen: false,
  maxHeight: 10,
  activeUI: "",
};
type BottomSheetAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "OPEN_UI"; payload: string }
  | { type: "SET_STATE"; payload: boolean }
  | { type: "SET_MAX_HEIGHT"; payload: number }
  | { type: "SET_MAX_HEIGHT_AND_OPEN"; payload: number };

function bottomSheetReducer(
  state: BottomSheetState,
  action: BottomSheetAction,
): BottomSheetState {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "OPEN_UI":
      return { ...state, isOpen: true, activeUI: action.payload };
    case "SET_MAX_HEIGHT":
      return { ...state, maxHeight: action.payload };
    case "SET_MAX_HEIGHT_AND_OPEN":
      return { ...state, isOpen: true, maxHeight: action.payload };
    case "SET_STATE":
      return { ...state, isOpen: action.payload };

    default:
      return state;
  }
}
interface BottomSheetValue {
  state: BottomSheetState;
  dispatch: Dispatch<BottomSheetAction>;
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
  const [bottomSheetState, dispatch] = useReducer(
    bottomSheetReducer,
    initialState,
  );

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
        dispatch,
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
export function useBottomSheet(): BottomSheetValue {
  const context = useHome();
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }

  return {
    dispatch: context.dispatch,
    state: context.bottomSheetState,
  };
}
