import SceneSelect from "./SceneSelect";
import { DeviceCard } from "./EntityCard";
import { IRoomCard, IDeviceCard } from "@/types";

const _RoomCard = ({ title, entities, scenes }: IRoomCard) => {
  return (
    <div className="flex flex-col overflow-y-auto mt-2">
      <h1 className=" text-xl font-semibold text-[hsl(0,0%,90%)]">{title}</h1>
      <SceneSelect scenes={scenes} />
      <div className="min-h-screen h-auto grid-cols-2 grid overflow-y-auto auto-rows-[4rem] gap-3  ">
        {entities.map((entity: IDeviceCard, idx) => {
          return <DeviceCard key={idx} {...entity} />;
        })}
      </div>
    </div>
  );
};
export default _RoomCard;
