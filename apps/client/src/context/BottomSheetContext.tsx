import { BottomSheetState } from "./types";
import { useHome } from "./HomeContext";
import React from "react";
import { renderCard, getComponent } from "@/view/handler/Components";

export function useBottomSheet(): BottomSheetState {
  const context = useHome();
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }

  return context.bottomSheetState;
}

export function useBottomSheet2(): BottomSheetState {
  const [cardsNode, setCardsNode] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [maxHeight, setMaxHeight] = React.useState(0.75 * window.innerHeight);

  function openBottomSheet(node: any, max: number, data: any) {
    console.log(node);

    const CompNode = renderCard(node);
    const Comp = getComponent(node);
    if (CompNode) {
      setCardsNode([<CompNode key={node} {...data} />]);
    }

    setIsOpen(true);
    setMaxHeight(Comp.bottomSheetY * window.innerHeight);
  }
  return {
    cardsNode,
    openBottomSheet,
    isOpen,
    setIsOpen,
    maxHeight,
    setMaxHeight,
  } as BottomSheetState;
}
