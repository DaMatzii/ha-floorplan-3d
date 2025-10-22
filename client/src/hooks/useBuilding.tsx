import { useEffect, useState } from "react";
import type { Home } from "@/types/Home";
import { useHome } from "@/context/HomeContext";

export function useBuilding(building_name: number) {
  const { buildings } = useHome();
  return buildings[building_name];
}

export function useFloorplan(building_name: number) {
  const { buildings } = useHome();
  return buildings[building_name].floorplan_building;
}
export function useRooms() {
  const { buildings } = useHome();
  let rooms = [];
  for (let i = 0; i < buildings.length; i++) {
    rooms.push(...buildings[i].rooms);
  }
  return rooms;
}
export function useRoomConfig(id: string) {
  const rooms = useRooms();
  const room = rooms.find((r) => r.id === id);

  if (room) (room as any).floorplan = useFloorplanRoom(id);
  return room;
}
export function useFloorplanRoom(id: string) {
  const { buildings } = useHome();

  for (let i = 0; i < buildings.length; i++) {
    const room = buildings[i].floorplan_building.room.find(
      (room) => room.id === id,
    );
    if (room) {
      return room;
    }
  }
  return undefined;
}
