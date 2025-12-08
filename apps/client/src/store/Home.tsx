import { HassConnect, useStore, useHass } from "@hakit/core";
import React, { createContext, useContext, useState, useEffect } from "react";
import { HomeConfig, Building } from "@/types";
import { useHomeStore } from "@/store/HomeStore";
import { useErrorStore, ErrorType } from "@/store/ErrorStore";
import { XMLParser } from "fast-xml-parser";
import { motion } from "framer-motion";
import ErrorList from "@/components/ErrorList";
import SetupWizard from "@/app/SetupWizard";

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

function LoadingCircleSpinner() {
  return (
    <div className="w-screen h-screen bg-dark flex items-center justify-center flex-col">
      <motion.div
        className="spinner  w-20 h-20 rounded-full border-b-text border-2 border-light"
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.9,
          repeat: Infinity,
          ease: "linear",
        }}
      />
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
        "./resources/" + parsed_building.floorplan_name,
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

  if (error) {
    return <ErrorList isOpen={true} closeModal={undefined} />;
  }

  console.log(config?.configured);

  if (config?.configured) {
    // return <SetupWizard />;
  }

  return (
    <>
      <HassConnect
        hassUrl="http://192.168.2.101:8123"
        hassToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIwZjJiMzgyMWQzYjA0M2M5OWI0ODI2NmFkZDk2MWEzNiIsImlhdCI6MTc1NTg3NjA2MiwiZXhwIjoyMDcxMjM2MDYyfQ.YaVKgKD5dhxWg4nSQSa-1mphzG2rXXj_yAXg1sQP9VU"
        loading={<LoadingCircleSpinner />}
      >
        {children}
      </HassConnect>
    </>
  );
}
