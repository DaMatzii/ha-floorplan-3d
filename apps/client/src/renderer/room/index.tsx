import type { Component, Card } from "@/view/handler/Components";
import Room from "./Room";
import _RoomCard from "./HassRoom";

export const RoomComponent: Component = {
  name: "LightComponent",
  component: (props: any) => <Room {...props} />,
};

export const RoomCard: Card = {
  name: "RoomCard",
  bottomSheetY: 0.85,
  card: (props: any) => <_RoomCard {...props} />,
};
