import React, { useMemo, useState, useEffect } from "react";
import { useBuilding, useFloorplan } from "@/hooks/useBuilding";
import { useSearchParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { extend } from "@react-three/fiber";

import { renderComponent } from "@/renderer/Components";
import Camera from "./Camera";
interface R3FErrorBoundaryProps {
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface R3FErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class R3FErrorBoundary extends React.Component<
  R3FErrorBoundaryProps,
  R3FErrorBoundaryState
> {
  constructor(props: R3FErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error in R3F canvas:", error);
    // this.props.onError?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <></>;
    }

    return this.props.children;
  }
}

extend({ R3FErrorBoundary });

function Building({ building_id }) {
  const building = useBuilding(building_id);
  const floorplan = useFloorplan(building);
  const comps = useMemo(() => {
    if (!floorplan) return null;

    return Object.entries(floorplan).flatMap(([key, items]) => {
      if (!Array.isArray(items)) return [];

      const Comp = renderComponent(key);
      if (!Comp) return [];

      return items.map((item, index) => (
        <>
          <R3FErrorBoundary key={index}>
            <Comp key={`${key}-${index}`} {...item} building={building} />
          </R3FErrorBoundary>
        </>
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
