import React, { useMemo, useState, useEffect } from "react";
import { useBuilding, useFloorplan } from "@/hooks/useBuilding";
import { useSearchParams } from "react-router-dom";
import ErrorBoundary from "@/utils/3DErrorBoundary";
import { renderComponent } from "@/renderer/Components";
import { useErrorStore, ErrorType } from "@/store/ErrorStore";

function Building({ building_id }) {
  const building = useBuilding(building_id);
  const floorplan = useFloorplan(building);
  const { errors, addError } = useErrorStore();

  const comps = useMemo(() => {
    if (!floorplan) return null;

    return Object.entries(floorplan).flatMap(([key, items]) => {
      if (!Array.isArray(items)) return [];

      const Comp = renderComponent(key);
      if (!Comp) return [];

      return items.map((item, index) => {
        function onError(error: any) {
          addError({
            type: ErrorType.FATAL,
            title: error,
            description: key,
          });
        }

        return (
          <>
            <ErrorBoundary key={index} onError={onError}>
              <Comp key={`${key}-${index}`} {...item} building={building} />
            </ErrorBoundary>
          </>
        );
      });
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
      <ambientLight intensity={1.5} color="#f4fffa" />
      <Building building_id={0} />
    </>
  );
}
export default Scene;
