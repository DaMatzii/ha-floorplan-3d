import { HassConnect, useStore, useHass } from "@hakit/core";
import React, { useState, useEffect, useCallback } from "react";
import { HomeConfig, Building } from "@/types";
import { useHomeStore } from "@/store/HomeStore";
import { useErrorStore, ErrorType } from "@/store/ErrorStore";
import { XMLParser } from "fast-xml-parser";
import ErrorList from "@/components/ErrorList";
import SetupWizard from "@/app/SetupWizard";
import { LoadingCircleSpinner } from "@/components/LoadingSpinner";

import { parse } from "yaml";

export default function Home({ children }) {
  //Load home.yaml --> load buildings --> parse --> save to zustand store

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setHome, setReloadFunction } = useHomeStore();
  const { addError, reset, errors } = useErrorStore();
  const [config, setConfig] = useState(null);

  const fetchResource = async (url: string, parser?: (text: string) => any) => {
    try {
      const response = await fetch(url, { cache: "reload" });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const text = await response.text();
      return parser ? await parser(text) : JSON.parse(text);
    } catch (err) {
      throw { url, originalError: err };
    }
  };

  const fetchHomeData = useCallback(async () => {
    const controller = new AbortController();
    reset();
    setIsLoading(true);

    try {
      const [appConfig, parsedHome] = await Promise.all([
        fetchResource("./api/configuration"),
        fetchResource("./config/home.yml", parse),
      ]);

      setConfig(appConfig);

      if (!parsedHome.buildings || parsedHome.buildings.length === 0) {
        throw new Error("No buildings defined in home.yml");
      }

      const buildingFileName = parsedHome.buildings[0];
      const parsedBuilding = await fetchResource(
        `./config/${buildingFileName}`,
        parse,
      );

      const floorplanName = parsedBuilding.floorplan_name;
      const parsedFloorplanXML = await fetchResource(
        `./config/${floorplanName}`,
        (text) => {
          const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
          });
          return parser.parse(text)?.home;
        },
      );

      const building: Building = {
        title: parsedBuilding.title,
        floorplan_name: parsedBuilding.floorplan_name,
        rooms: parsedBuilding.rooms,
      };

      setHome(parsedHome, [building], {
        [floorplanName]: parsedFloorplanXML,
      });
    } catch (err) {
      const description = err.originalError
        ? String(err.originalError)
        : String(err);
      const title = err.url
        ? `Error loading ${err.url}`
        : "Configuration Error";

      addError({
        type: ErrorType.FATAL,
        title: title,
        description: description,
      });
    } finally {
      setIsLoading(false);
    }

    return () => controller.abort();
  }, [addError, reset, setHome]);

  useEffect(() => {
    setReloadFunction(fetchHomeData);
    fetchHomeData();
  }, []);

  if (isLoading) {
    return <LoadingCircleSpinner />;
  }

  if (!config?.configured) {
    return <SetupWizard />;
  }

  if (errors.filter((e) => e.type === ErrorType.FATAL).length != 0) {
    return <ErrorList isOpen={true} closeModal={undefined} />;
  }

  let websocket = "";
  let auth_token = "";
  if (import.meta.env.DEV) {
    websocket = import.meta.env.VITE_HA_API;
    auth_token = import.meta.env.VITE_HA_TOKEN;
  }

  if (import.meta.env.PROD) {
    websocket =
      (location.protocol === "https:" ? "wss://" : "ws://") +
      location.host +
      "/api/websocket";
  }

  return (
    <>
      <HassConnect
        hassUrl={websocket}
        hassToken={auth_token}
        loading={<LoadingCircleSpinner />}
      >
        {children}
      </HassConnect>
    </>
  );
}
