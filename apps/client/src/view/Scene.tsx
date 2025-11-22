import { useMemo, useState, useEffect } from "react";
import { useBuilding, useFloorplan } from "@/hooks/useBuilding";
import { useSearchParams } from "react-router-dom";

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

      const Comp = renderComponent(key);
      if (!Comp) return [];

      return items.map((item, index) => (
        <Comp key={`${key}-${index}`} {...item} building={building} />
      ));
    });
  }, [floorplan, building]);

  return <>{comps}</>;
}

function Scene({ activeCamera, editorMode }) {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState(searchParams.get("id") || "");

  useEffect(() => {
    setView(searchParams.get("id") || "");
  }, [searchParams]);

  return (
    <>
      <Camera
        activeCamera={activeCamera}
        currentRoom={{
          id: view,
        }}
      />

      <ambientLight intensity={0.1} color="#f4fffa" />
      {/* <Environment preset="apartment" /> */}
      <Building building_id={0} />
    </>
  );
}
export default Scene;
