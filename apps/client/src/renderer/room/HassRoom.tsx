import SceneSelect from "./SceneSelect";
import EntityCardComp from "./EntityCard";
import { Action, RoomCard, EntityCard } from "@/types";

const default_action = (entity) => {
  return {
    action: "call-service",
    service: "light.toggle",
    target: {
      entity_id: entity.entity_id,
    },
  };
};

const _RoomCard = ({ title, entities, scenes }: RoomCard) => {
  return (
    <>
      <div className="h-screen">
        <h1 className=" ml-4 text-xl font-semibold text-[hsl(0,0%,90%)]">
          {title}
        </h1>
        <SceneSelect scenes={scenes} />
        <div className="h-full w-full grid-cols-2 overflow-y-auto grid auto-rows-[4rem] gap-3 pl-4 pr-4">
          {entities.map((entity, idx) => {
            return (
              <EntityCardComp
                entity={entity.entity_id}
                action={entity.tap_action ?? default_action(entity)}
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
export default _RoomCard;
