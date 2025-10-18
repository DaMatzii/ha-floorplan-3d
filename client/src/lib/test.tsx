import Wall from "@/components/scene/Wall";
import Room from "@/components/scene/Room";

const defaultComponents = {
  wall: (props) => <Wall {...props} />,
  room: (props) => <Room {...props} />,
  Date: () => <input type="date" />,
  Number: () => <input type="number" />,
};

export function renderComponent(component: string) {
  return defaultComponents[component.toLowerCase()];
}
