import React from "react";
import { renderCard } from "@/view/handler/Components";
import { loadUI } from "@/hooks/useUI";
import type { Component } from "@/view/handler/Components";
import { useBottomSheet } from "@/context/HomeContext";

const MultiCard: Component = {
  name: "LightComponent",
  bottomSheetY: 0.25,
  card: (props: any) => <MultiUi {...props} />,
};

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

function MultiUi({ path, maxHeight }) {
  const { setMaxHeight } = useBottomSheet();
  const [cardsNode, setCardsNode] = React.useState([]);

  React.useEffect(() => {
    loadUI(path.split(".")[0]).then((r) => {
      setCardsNode(renderUI(r?.cards));
    });

    setMaxHeight(maxHeight * window.innerHeight);
  }, [path, maxHeight]);
  return <>{cardsNode}</>;
}
export default MultiCard;
