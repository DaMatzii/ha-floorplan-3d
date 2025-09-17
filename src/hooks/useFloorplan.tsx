import { useEffect, useState } from "react";

export function useFloorplan() {
  const [floorplan, setFloorplan] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/house.xml")
      .then((res) => res.text())
      .then((data) => setFloorplan(data))
      .finally(() => setLoading(false));
  });

  return { floorplan, loading };
}
