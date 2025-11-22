import { create } from "zustand";
import { HomeConfig, Building } from "@/types/";
import { renderCard, getCard } from "@/view/handler/Components";

export interface HomeState {
  home: HomeConfig | null;
  buildings: Building[];
  floorplans: any[];
  setHome: (
    _home: HomeConfig,
    _buildings: Building[],
    _floorplans: any,
  ) => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  home: null,
  buildings: [],
  floorplans: [],
  setHome: (_home, _buildings, _floorplans) => {
    set({
      home: _home,
      buildings: _buildings,
      floorplans: _floorplans,
    });
  },
}));

interface BottomSheetState {
  cardsNode: any | undefined;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  maxHeight: number;
  setMaxHeight: (height: number) => void;
  openBottomSheet: (node: any, data: any) => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  cardsNode: undefined,
  isOpen: false,
  maxHeight: 0.25 * window.innerHeight,
  openBottomSheet: (node, data) => {
    const CompNode = renderCard(node);
    const Comp = getCard(node);
    if (CompNode && Comp) {
      set({
        cardsNode: <CompNode key={node} {...data} />,
        isOpen: true,
        maxHeight: Comp?.bottomSheetY * window.innerHeight,
      });
    }
  },
  setMaxHeight: (height) => {
    set({
      maxHeight: height * window.innerHeight,
    });
  },
  setIsOpen: (open) => {
    set({
      isOpen: open,
    });
  },
}));
