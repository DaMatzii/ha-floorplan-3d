import SceneSelect from "./SceneSelect";
import EntityCard from "./EntityCard";
import { Action } from "@/utils";

const default_action = (entity) => {
  return {
    action: "call-service",
    service: "light.toggle",
    target: {
      entity_id: entity.entity_id,
    },
  };
};

interface scene {
  icon: string;
  tap_action: Action;
}

interface entityCard {
  size: "md" | "sm";
  tap_action: Action;
}

interface roomCard {
  title: string;
  scenes: scene[];
  entities: entityCard[];
}

const RoomCard = ({ title, entities, scenes }: roomCard) => {
  const entity_list = entities.map((entity) => {
    return {
      entity_id: Object.keys(entity)[0],
      ...entity[Object.keys(entity)[0]],
    };
  });
  return (
    <>
      <div className="h-screen">
        <h1 className=" ml-4 text-xl font-semibold text-[hsl(0,0%,90%)]">
          {title}
        </h1>
        <SceneSelect scenes={scenes} />
        <div className="h-full w-full grid-cols-2 overflow-y-auto grid auto-rows-[4rem] gap-3 pl-4 pr-4">
          {entity_list.map((entity, idx) => {
            return (
              <EntityCard
                entity={entity.entity_id}
                action={entity.action ?? default_action(entity)}
                size={entity.size ?? "sm"}
                key={idx}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
export default RoomCard;
