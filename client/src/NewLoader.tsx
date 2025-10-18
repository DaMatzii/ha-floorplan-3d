import { useHome } from "@/hooks/useHome";
import { useBuilding, useFloorplan } from "@/hooks/useBuilding";

function Building() {
  const { building } = useBuilding(0);
  const { floorplan } = useFloorplan(0);
  console.log(building);
  console.log(floorplan);
  return <>lol</>;
}

export default function TestLoader() {
  // console.log("rerender");
  const { home } = useHome();
  console.log(home);
  return (
    <>
      <Building />
    </>
  );
}
