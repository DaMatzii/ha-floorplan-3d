import React, { useMemo, useState, useEffect } from "react";
import { useBuilding, useFloorplan } from "@/hooks/useBuilding";
import { useSearchParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { extend } from "@react-three/fiber";

import { renderComponent } from "@/renderer/Components";
import { useErrorStore } from "@/store";
import Camera from "./Camera";
interface R3FErrorBoundaryProps {
  children: React.ReactNode;
  addError: (error: any) => void;
}

interface R3FErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  addError: (error: any) => void;
}

class R3FErrorBoundary extends React.Component<
  R3FErrorBoundaryProps,
  R3FErrorBoundaryState
> {
  constructor(props: R3FErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false, error: null, addError: props.addError };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.state.addError(error);
  }

  render() {
    if (this.state.hasError) {
      return <></>;
    }

    return <>{this.props.children}</>;
  }
}

extend({ R3FErrorBoundary });

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

      return items.map((item, index) => (
        <>
          <R3FErrorBoundary addError={addError}>
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
