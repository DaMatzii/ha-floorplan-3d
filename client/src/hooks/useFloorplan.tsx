import { useEffect, useState } from "react";

export function useBuilding() {
  const [floorplan, setFloorplan] = useState<string>();
  const [entities, setEntities] = useState<string>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let load = 0;
    fetch("/house.xml")
      .then((res) => res.text())
      .then((data) => setFloorplan(data))
      .finally(() => (load = 1));
    fetch("/home.yaml")
      .then((res) => res.text())
      .then((data) => setEntities(data))
      .finally(() => {
        if (load === 1) {
          setLoading(false);
        }
      });
  });

  return { floorplan, entities, loading };
}
