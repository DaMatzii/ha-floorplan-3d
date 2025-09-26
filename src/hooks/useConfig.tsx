import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import YAML from "yaml";
import { Floorlan } from "@/types/Home";

type AppConfig = {
  buildings: any[];
};

export function useAppConfigs() {
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    async function load() {
      const yamlText = await fetch("/home.yaml").then((r) => r.text());
      const parsedConfig = YAML.parse(yamlText);
      const buildings = Object.entries(parsedConfig).map(([key, value]) => ({
        id: key,
        ...(value as any),
        floorplan: "test",
      }));

      for (let i = 0; i < buildings.length; i++) {
        const xmlText = await fetch(buildings[i].floorplan_name).then((r) =>
          r.text(),
        );

        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        const floorplan = parser.parse(xmlText) as Floorlan;
        buildings[i].floorplan = floorplan?.home;
      }
      setAppConfig({
        buildings: buildings,
      });
    }

    load();
  }, []);

  return appConfig;
}
