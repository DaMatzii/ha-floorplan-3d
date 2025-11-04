import Wall from "@/view/wall/Wall";
import Room from "@/view/room/Room";
import Furniture from "@/view/furniture/Furniture";
import TempDisplay from "@/view/temperature-display/TempDisplay";
import Light from "@/view/light/Light";
import HassRoom from "@/view/room/HassRoom";
import HassLight from "@/view/light/HassLight";

const defaultComponents = {
  wall: (props) => <Wall {...props} />,
  room: (props) => <Room {...props} />,
  pieceoffurniture: (props) => <Furniture {...props} />,
  light: (props) => <Light {...props} />,
  temperaturedisplay: (props) => <TempDisplay {...props} />,
  ui_room: (props) => <HassRoom {...props} />,
  card_light: (props) => <HassLight {...props} />,
  Number: () => <input type="number" />,
};

export function renderComponent(component: string) {
  return defaultComponents[component.toLowerCase()];
}
