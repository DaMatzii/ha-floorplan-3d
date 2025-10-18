import { XMLParser } from "fast-xml-parser";
import registry from "./Components.ts";
import type Home from "./Home.ts";
import type { JSX } from "react/jsx-runtime";
import YAML from "yaml";

function renderFloorplan(root, building) {
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
                building={building}
                {...(root[type][value] as any)}
              />,
            );
            runningNumber += 1;
          }
        }
        continue;
      }
      let Comp = registry.getParser(type);
      if (Comp) {
        renderList.push(
          <Comp
            key={type + "-" + runningNumber}
            building={building}
            {...(root[type] as any)}
          />,
        );
        runningNumber += 1;
      }
    }
  }
  return renderList;
}
export function renderEntities(entities, building) {
  const renderList: JSX.Element[] = [];
  let runningNumber = 0;
  console.log(entities);
  for (const i in entities) {
    const entity = entities[i];
    console.log(entity);
    let Comp = registry.getParser("entity-" + entity?.type);
    if (Comp) {
      renderList.push(
        <Comp
          key={entity?.type + "-" + runningNumber}
          building={building}
          {...(entity as any)}
        />,
      );
      runningNumber += 1;
    }
  }
  return renderList;
}

export function renderHome(building): any {
  // const renderList = renderFloorplan(root, building);

  // const entitiesList = renderEntities(building?.objects, building);
  return [undefined, undefined];
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
