import { create } from "zustand";
import { HomeConfig, Building, Floorplan, MoreInfoAction } from "@/types/";
import { renderCard, getCard } from "@/renderer/Components";
import { loadUI } from "@/hooks/useUI";

export interface HomeState {
  home: HomeConfig | null;
  buildings: Building[];
  floorplans: any[];
  setHome: (
    _home: HomeConfig,
    _buildings: Building[],
    _floorplans: any,
  ) => void;
  reload: () => void;
  setReloadFunction: (_func: () => void) => void;
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
  reload: null,
  setReloadFunction: (_func) => {
    set({
      reload: _func,
    });
  },
}));

interface BottomSheetState {
  cardsNode: React.ReactNode | undefined;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  maxHeight: number;
  setMaxHeight: (height: number) => void;
  openBottomSheet: (data: MoreInfoAction) => void;
}

function renderUI(ui) {
  let componentsToRender: React.ReactNode[] = [];
  Object.keys(ui).map((key, index) => {
    const Comp = renderCard(ui[key]?.type);
    if (Comp) {
      componentsToRender.push(<Comp key={key + "-" + index} {...ui[key]} />);
    }
  });
  return componentsToRender;
}

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  cardsNode: undefined,
  isOpen: false,
  maxHeight: 0.85 * window.innerHeight,
  openBottomSheet: (data) => {
    let cards: any | undefined;

    if ("path" in data.target) {
      loadUI(data.target.path).then((r) => {
        if (r != undefined) {
          cards = renderUI(r?.cards);
          set({
            cardsNode: cards,
            isOpen: true,
            maxHeight: r?.bottomSheetY
              ? r?.bottomSheetY * window.innerHeight
              : 0.85 * window.innerHeight,
          });
        }
      });
    } else if ("cards" in data.target) {
      cards = renderUI(data.target.cards);
    }

    if (cards) {
      set({
        cardsNode: cards,
        isOpen: true,
        maxHeight:
          // data.* window.innerHeight ?? 0.85 * window.innerHeight,
          0.85 * window.innerHeight,
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
