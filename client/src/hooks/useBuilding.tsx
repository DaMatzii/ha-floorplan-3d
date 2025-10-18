import { useEffect, useState } from "react";
import type { Home } from "@/types/Home";

export function useBuilding(building_name: number) {
  const [building, setBuilding] = useState<Home>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/building/0/blueprint")
      .then((res) => res.json())
      .then((data) => setBuilding(data))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { building, loading };
}

export function useFloorplan(building_name: number) {
  const [floorplan, setFloorplan] = useState<Home>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/building/0/floorplan")
      .then((res) => res.json())
      .then((data) => setFloorplan(data.home))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { floorplan, loading };
}
