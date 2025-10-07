import { useHome } from "@/context/HomeContext";
import { useEntity } from "@hakit/core";

import { useBottomSheet } from "@/context/BottomSheetContext";
import { useUIConfig } from "@/hooks/useConfig";

import { useEffect, useState, useRef } from "react";
interface LightCardProps {
  rowSpan: number;
  haEntity: string;
}
function LightCard({ rowSpan, haEntity }: LightCardProps) {
  const entity = useEntity(haEntity);
  console.log(entity);
  return (
    <>
      <div className={` col-span-1 row-span-${rowSpan}`}>
        <div
          className={`w-full h-full bg-yellow-500 flex p-2  rounded-xl
${rowSpan === 1 ? "" : "flex-col justify-between"}
		`}
        >
          <div className="w-12 h-12 rounded-full bg-black"></div>
          <div className="ml-2">
            <p>Matias-zone</p>
            <p className="">37%</p>
          </div>
        </div>
      </div>
    </>
  );
}
export default function HassRoom() {
  const { focusedItem, home } = useHome();
  const [uiEntities, setUiEntities] = useState([]);

  useEffect(() => {
    const room = home.buildings[0]?.rooms.find(
      (room) => room.id === focusedItem.id,
    );
    setUiEntities(room.ui_entities);
  }, []);

  const { setIsOpen, setOpenY } = useBottomSheet();

  useEffect(() => {
    let moveTo = window.innerHeight * 0.25;

    setOpenY(moveTo);
    setIsOpen(true);
  }, [focusedItem]);

  return (
    <>
      <div className=" p-4 absolute w-screen h-screen">
        <div className="flex justify-between items-center bg-green-500">
          <p>Matiaksen huone</p>
          <div className="flex gap-4">
            <p>lol</p>
            <p>lol2</p>
          </div>
        </div>
        <div className="mt-10 overflow-y-auto h-[100vh] ">
          <div className="grid grid-cols-2  gap-4 auto-rows-[4rem]">
            {uiEntities.map((entity, index) => {
              return (
                <LightCard
                  key={index}
                  haEntity={entity.entity_id}
                  rowSpan={entity.span}
                />
              );
            })}
            <div className=" bg-yellow-400 col-span-2 row-span-4 flex items-center justify-center">
              4
            </div>
            <div className=" bg-purple-400 col-span-2 row-span-10 justify-center">
              5
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
