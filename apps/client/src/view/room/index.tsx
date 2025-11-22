import type { Component } from "@/view/handler/Components";
import Room from "./Room";
import RoomCard from "./HassRoom";

const RoomComponent: Component = {
  name: "LightComponent",
  bottomSheetY: 0.75,
  component: (props: any) => <Room {...props} />,
  card: (props: any) => <RoomCard {...props} />,
};

export default RoomComponent;
