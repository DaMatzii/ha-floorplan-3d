import { create } from "zustand";
import { HomeConfig, Building } from "@/types/";
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
  cardsNode: any | undefined;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  maxHeight: number;
  setMaxHeight: (height: number) => void;
  openBottomSheet: (node: any, max: any, data: any) => void;
}

// React.useEffect(() => {
//   if (path === undefined) return;
//   loadUI(path).then((r) => {
//     if (r != undefined) {
//       setCardsNode(renderUI(r?.cards));
//     }
//   });
//
//   setMaxHeight(maxHeight);
// }, [path, maxHeight]);
//
// return <>{cardsNode}</>;

function renderUI(ui) {
  let componentsToRender = [];
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
  openBottomSheet: (max, data) => {
    // let CompNode: any | undefined;
    // const Comp = getCard(node);
    console.log(data);
    let cards: any | undefined;

    if (data.path) {
      console.log("loading path");
      loadUI(data.path).then((r) => {
        if (r != undefined) {
          cards = renderUI(r?.cards);
          console.log(cards);
          set({
            cardsNode: cards,
            isOpen: true,
            maxHeight:
              max ??
              data.BottomSheet * window.innerHeight ??
              0.85 * window.innerHeight,
          });
        }
      });
    } else if (data.cards) {
      cards = renderUI(data.cards);
    }

    console.log(cards);

    if (cards) {
      set({
        cardsNode: cards,
        isOpen: true,
        maxHeight:
          max ??
          data.BottomSheet * window.innerHeight ??
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
