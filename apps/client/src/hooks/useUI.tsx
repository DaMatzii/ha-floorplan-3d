import { useEffect, useState } from "react";

export async function loadUI(ui_file: string) {
  console.log(ui_file);
  async function f() {
    const resp = await fetch("./api/ui/" + ui_file);
    const ui = await resp.json();
    return ui;
  }

  return f();
}
