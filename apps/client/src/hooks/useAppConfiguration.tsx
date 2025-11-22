import { useState, useEffect } from "react";

export default function useAppConfiguration() {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchConfig() {
      setConfig(null);
      setError(null);

      try {
        const response = await fetch("./api/configuration");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const fetchedConfig = await response.json();

        if (isMounted) {
          setConfig(fetchedConfig);
        }
      } catch (e: any) {
        if (isMounted) {
          const errorMessage =
            e instanceof Error
              ? e.message
              : "An unknown error occurred during configuration fetch.";
          setError(errorMessage);
        }
      }
    }

    fetchConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  return { config, error };
}
