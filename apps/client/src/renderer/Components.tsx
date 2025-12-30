import Wall from "./wall/Wall";
import { RoomComponent, RoomCard } from "./room";
import Furniture from "./furniture/Furniture";
import TempDisplay from "./temperature-display/TempDisplay";
import Light from "./light/Light";
import DoorOrWindow from "./furniture/DoorOrWindow";

export interface Component {
  name: string;
  component?: any;
  visibleOnPreview: boolean;
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
  icon: Light,
  room: RoomComponent,
  wall: Wall,
  temperaturedisplay: TempDisplay,
  doororwindow: DoorOrWindow,
};

const defaultCards: Cards = {
  room: RoomCard,
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
