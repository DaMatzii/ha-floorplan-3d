import Wall from "@/view/wall/Wall";
import Room from "@/view/room/Room";
import Furniture from "@/view/furniture/Furniture";
import TempDisplay from "@/view/temperature-display/TempDisplay";
import Light from "@/view/light/Light";
import MultiCard from "@/view/MultiCard";
import HassRoom from "@/view/room/HassRoom";
import HassLight from "@/view/light/HassLight";

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
  pieceoffurniture: Furniture,
  light: Light,
  room: Room,
  wall: Wall,
  temperaturedisplay: TempDisplay,
  multicard: MultiCard,
  // ui_room: (props) => <HassRoom {...props} />,
  // card_light: (props) => <HassLight {...props} />,
  // Number: () => <input type="number" />,
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
