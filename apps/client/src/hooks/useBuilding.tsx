import { useMemo } from "react";
import { useHome } from "@/context/HomeContext";
import type { Building, Room, Floorplan } from "@/types";

export function useBuilding(building: number): Building | undefined {
  const { buildings } = useHome();
  return buildings[building];
}

export function useFloorplan({
  floorplan_name,
}: Building): Floorplan | undefined {
  const { floorplans } = useHome();
  return floorplans[floorplan_name];
}
export function useRooms(): Room[] {
  const { buildings } = useHome();
  return useMemo(() => {
    if (!buildings) return [];
    return buildings.flatMap((b) => {
      //   // for (const room of b.rooms) {
      //   //   room.floorplan = b.floorplan_building?.room?.find(
      //   //     (r) => r.id === room.id,
      //   //   );
      //   // }
      return b.rooms ?? [];
    });
    // return [];
  }, [buildings]);
}

export function useRoom(id: string): Room | undefined {
  const rooms = useRooms();
  // const { buildings } = useHome();

  const room = useMemo(() => rooms.find((r) => r.id === id), [rooms, id]);
  if (!room) return undefined;

  // const floorplanRoom = useMemo(() => {
  //   for (const building of buildings ?? []) {
  //     const floorplan = useFloorplan(building.title);
  //     const match = floorplan.room?.find((r) => r.id === id);
  //     if (match) return match;
  //   }
  //   return undefined;
  // }, [buildings, id]);

  return { ...room };
}
