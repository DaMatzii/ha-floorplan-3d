import { XMLParser } from "fast-xml-parser";
import registry from "./Components.ts";
import type Home from "./Home.ts";
import type { JSX } from "react/jsx-runtime";

export function renderHome(root: any): any {
  const renderList: JSX.Element[] = [];
  console.log(root);
  let runningNumber = 0;
  for (const type in root) {
    if (typeof root[type] === "object") {
      for (const value in root[type]) {
        let Comp = registry.getParser(type);
        if (Comp) {
          renderList.push(
            <Comp
              key={type + "-" + runningNumber}
              {...(root[type][value] as any)}
            />,
          );
          runningNumber += 1;
        }
      }
    }
  }
  return renderList;
}
export function parseHome(xmlText: string): Home {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  const jsonObj = parser.parse(xmlText);

  return jsonObj.home as Home;
}
