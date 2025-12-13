import { HassConnect, useStore, useHass } from "@hakit/core";
import React, { createContext, useContext, useState, useEffect } from "react";
import { HomeConfig, Building } from "@/types";
import { useHomeStore } from "@/store/HomeStore";
import { useErrorStore, ErrorType } from "@/store/ErrorStore";
import { XMLParser } from "fast-xml-parser";
import ErrorList from "@/components/ErrorList";
import SetupWizard from "@/app/SetupWizard";
import { LoadingCircleSpinner } from "@/components/LoadingSpinner";

import { parse } from "yaml";

function SomeComponent() {
  const connection = useHass();

  return (
    <div>
      <h1>HassConnect Status</h1>
      <p>Status: {connection ? "Connected" : "Disconnected"}</p>
    </div>
  );
}

export default function Home({ children }) {
  //Load home.yaml --> load buildings --> parse --> save to zustand store

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { setHome, setReloadFunction } = useHomeStore();
  const { addError, reset } = useErrorStore();
  const [config, setConfig] = useState(null);

  const fetchHome = async () => {
    reset();
    try {
      const appPromise = await fetch("./api/configuration", {
        cache: "reload",
      });
      const appConfig = await appPromise.json();
      setConfig(appConfig);

      const homePromise = await fetch("./config/home.yml", { cache: "reload" });
      const homeConfig = await homePromise.text();
      let parsed: HomeConfig | undefined;

      try {
        parsed = await parse(homeConfig);
      } catch (err) {
        addError({
          type: ErrorType.FATAL,
          title: "Error parsing home.yaml",
          description: String(err),
        });
        setError(true);
        return;
      }
      console.log(parsed.buildings);

      const buildingPromise = await fetch("./config/" + parsed.buildings[0], {
        cache: "reload",
      });
      const buildingConfig = await buildingPromise.text();

      let parsed_building: any | undefined;

      try {
        parsed_building = await parse(buildingConfig);
      } catch (err) {
        addError({
          type: ErrorType.FATAL,
          title: "Error parsing " + parsed.buildings[0],
          description: String(err),
        });
        setError(true);
        return;
      }
      console.log(buildingConfig);

      const floorplanPromise = await fetch(
        "./config/" + parsed_building.floorplan_name,
      );
      const floorplanText = await floorplanPromise.text();

      console.log(parsed_building.floorplan_name);

      let floorplan: any | undefined;

      try {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        floorplan = await parser.parse(floorplanText)?.home;
      } catch (err) {
        addError({
          type: ErrorType.FATAL,
          title: "Error parsing " + parsed_building.floorplan_name,
          description: String(err),
        });
        setError(true);
        return;
      }

      await Promise.all([appConfig, homeConfig, buildingConfig, floorplanText]);

      const building: Building = {
        title: parsed_building.title,
        floorplan_name: parsed_building.floorplan_name,
        rooms: parsed_building.rooms,
      };

      setHome(parsed, [building], {
        [parsed_building.floorplan_name]: floorplan,
      });
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setReloadFunction(fetchHome);
    fetchHome();
  }, []);

  if (isLoading) {
    return <LoadingCircleSpinner />;
  }

  if (!config?.configured) {
    return <SetupWizard />;
  }

  if (error) {
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
