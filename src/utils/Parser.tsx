import { XMLParser } from "fast-xml-parser";
import registry from "./Components.ts";
import type Home from "./Home.ts";
import type { JSX } from "react/jsx-runtime";
import YAML from "yaml";

function renderFloorplan(root) {
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
                building={root}
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
          <Comp
            key={type + "-" + runningNumber}
            building={root}
            {...(root[type] as any)}
          />,
        );
        runningNumber += 1;
      }
    }
  }
  return renderList;
}
function renderEntities(root, building) {
  console.log("RENDERHOME2 RUN");
  const renderList: JSX.Element[] = [];
  let runningNumber = 0;
  for (const i in root) {
    // console.log(type);
    console.log("renderEntieis", root[i]["type"]);
    let Comp = registry.getParser("entity-" + root[i]?.type);
    if (Comp) {
      renderList.push(
        <Comp
          key={root[i]?.type + "-" + runningNumber}
          building={building}
          {...(root[i] as any)}
        />,
      );
      runningNumber += 1;
    }
  }
  console.log(renderList);
  return renderList;
}

export function renderHome(building: any): any {
  const root = building?.floorplan;
  const renderList = renderFloorplan(root);
  const entitiesList = renderEntities(building?.objects, building.floorplan);
  return [renderList, entitiesList];
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
