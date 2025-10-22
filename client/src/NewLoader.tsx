import { useBuilding, useFloorplan, useRooms } from "@/hooks/useBuilding";
import { useHome } from "@/context/HomeContext";

function Building() {
  const building = useFloorplan(0);
  return <>lol</>;
}

export default function TestLoader() {
  const { buildings } = useHome();
  const rooms = useRooms();
  return (
    <>
      <Building />
    </>
  );
}
