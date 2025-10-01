import { createContext, useContext } from "react";

interface BottomSheetContextType {
  isOpen: boolean;
  openY: number;
  setIsOpen: (value: boolean) => void;
  setOpenY: (value: number) => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context)
    throw new Error(
      "useBottomSheet must be used within a BottomSheet component",
    );
  return context;
};

export default BottomSheetContext;
