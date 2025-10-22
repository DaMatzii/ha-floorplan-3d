import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import YAML from "yaml";

export async function loadUI(ui_file: string) {
  async function f() {
    const resp = await fetch("/api/ui/" + ui_file);
    const ui = await resp.json();
    return ui;
  }

  return f();
}

export function useUI(ui_file: string) {
  const [appConfig, setAppConfig] = useState(null);

  useEffect(() => {
    async function f() {
      const resp = await fetch("/api/ui/" + ui_file);
      const ui = await resp.json();
      setAppConfig(ui);
    }
    f();
  }, []);

  return appConfig;
}
