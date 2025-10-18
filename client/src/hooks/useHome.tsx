import { useEffect, useState } from "react";
import type { Home } from "@/types/Home";

export function useHome() {
  const [home, setHome] = useState<Home>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/home")
      .then((res) => res.json())
      .then((data) => setHome(data))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { home, loading };
}
