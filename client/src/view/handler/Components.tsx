import Wall from "@/view/wall/Wall";
import Room from "@/view/room/Room";
import Furniture from "@/view/furniture/Furniture";
import BoxWithLabel from "@/view/Light/BoxWithLabel";
import TempDisplay from "@/view/temperature-display/TempDisplay";
import HassRoom from "@/view/room/HassRoom";

const defaultComponents = {
  wall: (props) => <Wall {...props} />,
  room: (props) => <Room {...props} />,
  pieceoffurniture: (props) => <Furniture {...props} />,
  light: (props) => <BoxWithLabel {...props} />,
  temperaturedisplay: (props) => <TempDisplay {...props} />,
  ui_room: (props) => <HassRoom {...props} />,
  Number: () => <input type="number" />,
};

export function renderComponent(component: string) {
  return defaultComponents[component.toLowerCase()];
}
