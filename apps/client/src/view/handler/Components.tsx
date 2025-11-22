import Wall from "@/view/wall/Wall";
import Room from "@/view/room";
import Furniture from "@/view/furniture/Furniture";
import TempDisplay from "@/view/temperature-display/TempDisplay";
import Light from "@/view/light/Light";
import MultiCard from "@/view/MultiCard";
import DoorOrWindow from "@/view/furniture/DoorOrWindow";

// import HassRoom from "@/view/room/HassRoom";
// import HassLight from "@/view/light/HassLight";
//

export interface Component {
  name: string;
  component?: any;
}
export type Components = {
  [key: string]: Component;
};

export interface Card {
  name: string;
  bottomSheetY?: number;
  card?: any;
}
export type Cards = {
  [key: string]: Card;
};

const defaultComponents: Components = {
  pieceoffurniture: Furniture,
  light: Light,
  room: Room,
  wall: Wall,
  temperaturedisplay: TempDisplay,
  doororwindow: DoorOrWindow,
};

const defaultCards: Cards = {
  multicard: MultiCard,
};

export function renderComponent(component: string) {
  return defaultComponents[component.toLowerCase()]?.component;
}

export function renderCard(card: string) {
  return defaultCards[card.toLowerCase()]?.card ?? <></>;
}
export function getComponent(component: string) {
  return defaultComponents[component.toLowerCase()];
}
export function getCard(component: string) {
  return defaultCards[component.toLowerCase()];
}
