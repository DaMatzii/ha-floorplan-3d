import { useMemo } from "react";
import { useBuilding, useFloorplan } from "@/hooks/useBuilding";

import { useHome } from "@/context/HomeContext";
import { ViewContextProvider } from "@/context/ViewContext";
import { renderComponent } from "@/view/handler/Components";
import Camera from "./Camera";

function Building({ building_id }) {
  console.log(building_id);
  const building = useBuilding(building_id);
  const floorplan = useFloorplan(building);
  const comps = useMemo(() => {
    if (!floorplan) return null;

    return Object.entries(floorplan).flatMap(([key, items]) => {
      if (!Array.isArray(items)) return [];

      const Comp = renderComponent("floorplan_" + key);
      if (!Comp) return [];

      return items.map((item, index) => (
        <Comp key={`${key}-${index}`} {...item} building={building} />
      ));
    });
  }, [floorplan, building]);

  return <>{comps}</>;
}

function Scene({ activeCamera, editorMode }) {
  const { currentRoom } = useHome();

  return (
    <>
      <ViewContextProvider initial={{ editorMode: editorMode }}>
        <Camera activeCamera={activeCamera} currentRoom={currentRoom} />

        <ambientLight intensity={0.1} color="#f4fffa" />
        {/* <Environment preset="apartment" /> */}
        <Building building_id={0} />
      </ViewContextProvider>
    </>
  );
}
export default Scene;
