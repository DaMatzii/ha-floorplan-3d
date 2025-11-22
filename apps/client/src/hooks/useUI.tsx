import { useEffect, useState } from "react";

export async function loadUI(ui_file: string) {
  async function f() {
    const resp = await fetch("./api/ui/" + ui_file);
    if (resp.status === 200) {
      const ui = await resp.json();
      return ui;
    }
  }

  return f();
}

export function useUI(ui_file: string) {
  const [appConfig, setAppConfig] = useState(null);

  useEffect(() => {
    async function f() {
      const resp = await fetch("./api/ui/" + ui_file);
      if (resp.status === 200) {
        const ui = await resp.json();
        setAppConfig(ui);
      }
    }
    f();
  });

  return appConfig;
}
