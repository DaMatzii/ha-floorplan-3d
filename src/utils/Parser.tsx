import { XMLParser } from "fast-xml-parser";
import registry from "./Components.ts";
import type Home from "./Home.ts";
import type { JSX } from "react/jsx-runtime";
import YAML from "yaml";

export function renderHome(root: any): any {
  console.log("RENDERHOME RUN");
  const renderList: JSX.Element[] = [];
  let runningNumber = 0;
  for (const type in root) {
    if (typeof root[type] === "object") {
      if (Array.isArray(root[type])) {
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
        continue;
      }
      // console.log(type);
      // console.log("Data", root[type]);
      let Comp = registry.getParser(type);
      if (Comp) {
        renderList.push(
          <Comp key={type + "-" + runningNumber} {...(root[type] as any)} />,
        );
        runningNumber += 1;
      }
    }
  }
  return renderList;
}
export function parseHome(
  xmlText: string,
  entitiesText: string,
): [home: Home, entities: any] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  const jsonObj = parser.parse(xmlText);
  const entities = YAML.parse(entitiesText);
  const home: Home = {
    entities: entities,
    buildings: [jsonObj],
  };

  return home;
}
