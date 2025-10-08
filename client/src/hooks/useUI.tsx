import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import YAML from "yaml";
import { Floorlan } from "@/types/Home";

type UiConfig = {
  name: string;
  cards: any[];
};

export function useUI(ui_file: string) {
  const [appConfig, setAppConfig] = useState<UiConfig | null>(null);

  useEffect(() => {
    async function load() {
      const yamlText = await fetch("/" + ui_file).then((r) => r.text());
      const parsedConfig = YAML.parse(yamlText);

      setAppConfig(parsedConfig);
    }

    load();
  }, []);

  return appConfig;
}
