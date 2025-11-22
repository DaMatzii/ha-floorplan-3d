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
  bottomSheetY?: number;
  component?: any;
  card?: any;
}
export type Components = {
  [key: string]: Component;
};

const defaultComponents: Components = {
  floorplan_pieceoffurniture: Furniture,
  light: Light,
  floorplan_room: Room,
  floorplan_wall: Wall,
  temperaturedisplay: TempDisplay,
  multicard: MultiCard,
  doororwindow: DoorOrWindow,
};

export function renderComponent(component: string) {
  return defaultComponents[component.toLowerCase()]?.component;
}

export function renderCard(card: string) {
  return defaultComponents[card.toLowerCase()]?.card ?? <></>;
}
export function getComponent(component: string) {
  return defaultComponents[component.toLowerCase()];
}
