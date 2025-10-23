import { useMemo } from "react";
import { useHome } from "@/context/HomeContext";
import type { Building, Room, Floorplan } from "@/types";

export function useBuilding(building_name: number): Building | undefined {
  const { buildings } = useHome();
  return buildings?.[building_name];
}

export function useFloorplan(building_name: number): Floorplan | undefined {
  const building = useBuilding(building_name);
  return building?.floorplan_building;
}
export function useRooms(): Room[] {
  const { buildings } = useHome();
  return useMemo(() => {
    if (!buildings) return [];
    return buildings.flatMap((b) => {
      for (const room of b.rooms) {
        room.floorplan = b.floorplan_building?.room?.find(
          (r) => r.id === room.id,
        );
      }
      return b.rooms ?? [];
    });
  }, [buildings]);
}

export function useRoom(id: string): Room | undefined {
  const rooms = useRooms();
  const { buildings } = useHome();

  const room = useMemo(() => rooms.find((r) => r.id === id), [rooms, id]);
  if (!room) return undefined;

  const floorplanRoom = useMemo(() => {
    for (const building of buildings ?? []) {
      const match = building.floorplan_building?.room?.find((r) => r.id === id);
      if (match) return match;
    }
    return undefined;
  }, [buildings, id]);

  return { ...room, floorplan: floorplanRoom };
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
