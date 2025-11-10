import React from "react";
import { useHome } from "@/context/HomeContext";
import { useEntity, useHass } from "@hakit/core";

import { useBottomSheet } from "@/context/HomeContext";
import { evaluateAction } from "@/utils/EvaluateAction";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import type { EntityName } from "@hakit/core";

import { useEffect, useState, useRef } from "react";
interface LightCardProps {
  tap_action: any;
  rowSpan: number;
  colSpan: number;
  haEntity: string;
}
function LightCard({
  tap_action,
  rowSpan,
  colSpan = 2,
  haEntity,
}: LightCardProps) {
  const entity = useEntity(haEntity as EntityName);
  console.log(entity);
  const { callService } = useHass();

  const [clicked, setClicked] = useState(false);
  const spanClass =
    rowSpan === 1
      ? "row-span-1"
      : rowSpan === 2
        ? "row-span-2"
        : rowSpan === 3
          ? "row-span-3"
          : "row-span-1";

  function Text() {
    return (
      <>
        <div className=" flex-1 min-w-0">
          <p className="truncate overflow-hidden font-medium text-sm text-[hsl(0,0%,95%)]  whitespace-nowrap">
            {(entity as any).attributes.friendly_name}
          </p>
          <p className="text-xs font-normal text-[hsl(0,0%,70%)] ">
            {entity.attributes.brightness !== null
              ? Math.floor((entity.attributes.brightness / 255) * 100) + "%"
              : "Off"}
          </p>
        </div>
      </>
    );
  }

  function Icon() {
    return (
      <motion.div
        className=" bg-[hsl(0,0%,10%)] p-2 rounded-full"
        animate={{
          rotate: 0,
          color:
            (entity as any).state.toLowerCase() === "on"
              ? "#fbbf24"
              : "#9ca3af",
          scale: 1,
          opacity: 1,
        }}
        initial={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.4,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
        }}
        onClick={handleClick}
      >
        <Lightbulb className={`font-bold`} size={24} strokeWidth={3} />
      </motion.div>
    );
  }

  const handleTapAction = (action) => {
    evaluateAction(action, callService, {});
  };

  function handleClick() {
    setClicked(!clicked);
    handleTapAction(tap_action);
  }

  function BigCard() {
    return (
      <>
        {/* //   className={`flex pt-2 flex-col flex-start justify-between ${spanClass} col-span-${colSpan} bg-white shadow-md rounded-xl`} */}
        {/* //   onClick={handleClick} */}
        {/* // > */}
        <motion.div
          className={`flex flex-col pt-2 flex-start ${spanClass} bg-[hsl(0,0%,5%)] rounded-xl border-1 border-[hsl(0,0%,30%)] shadow-md shadow-[hsl(0,0%,10%)] justify-between`}
          onClick={handleClick}
        >
          <div className="w-12 h-12 ml-2 rounded-full flex-shrink-0 items-center flex">
            <Icon />
          </div>
          <div className="ml-2 pb-3  text-[12px] pl-2">
            <Text />
          </div>
        </motion.div>
      </>
    );
  }

  function SmallCard() {
    return (
      <>
        <motion.div
          className={`flex flex-start ${spanClass}  col-span-${colSpan} bg-[hsl(0,0%,5%)] rounded-xl border-1 border-[hsl(0,0%,30%)] shadow-md shadow-[hsl(0,0%,10%)]  items-center justify-between`}
          onClick={handleClick}
        >
          <div className="w-12 h-12 ml-2 rounded-full flex-shrink-0 items-center flex">
            <Icon />
          </div>

          <Text />
        </motion.div>
      </>
    );
  }
  return <>{rowSpan !== 1 ? <BigCard /> : <SmallCard />}</>;
}
function Scenes() {
  return (
    <>
      <motion.div className="w-full h-32 flex justify-center">
        <div className=" h-18 w-[90vw] bg-[hsl(0,0%,5%)]  flex justify-evenly mt-4 rounded-xl shadow-md gap-10 items-center border-1 border-[hsl(0,0%,30%)] shadow-[hsl(0,0%,10%)] ">
          <div className="w-12  h-12 rounded-full flex justify-center items-center bg-[hsl(0,0%,10%)] text-[hsl(0,0%,90%)] border-[hsl(0,0%,30%)] border-1">
            <Lightbulb className={`font-bold`} size={24} strokeWidth={2.5} />
          </div>
          <div className="w-12  h-12 rounded-full flex justify-center items-center bg-[hsl(0,0%,10%)] text-[hsl(0,0%,90%)] border-[hsl(0,0%,30%)] border-1">
            <Lightbulb className={`font-bold`} size={24} strokeWidth={2.5} />
          </div>
          <div className="w-12  h-12 rounded-full flex justify-center items-center bg-[hsl(0,0%,10%)] text-[hsl(0,0%,90%)] border-[hsl(0,0%,30%)] border-1">
            <Lightbulb className={`font-bold`} size={24} strokeWidth={2.5} />
          </div>
          <div className="w-12  h-12 rounded-full flex justify-center items-center bg-[hsl(0,0%,10%)] text-[hsl(0,0%,90%)] border-[hsl(0,0%,30%)] border-1">
            <Lightbulb className={`font-bold`} size={24} strokeWidth={2.5} />
          </div>
        </div>
      </motion.div>
    </>
  );
}

function SceneIcon() {
  return (
    <>
      <div className="w-12  h-12 rounded-full flex justify-center items-center bg-[hsl(0,0%,10%)] text-[hsl(0,0%,90%)] border-[hsl(0,0%,30%)] border-1">
        <Lightbulb className={`font-bold`} size={24} strokeWidth={2.5} />
      </div>
    </>
  );
}

export default function HassRoom({ entities, scenes }) {
  return (
    <>
      <div className="h-screen bg-[hsl(0,0%,0%)] ">
        <h1 className=" ml-4 text-xl font-semibold text-[hsl(0,0%,90%)]">
          Matiaksen huone
        </h1>
        <motion.div className="w-full h-32 flex justify-center">
          <div className=" h-18 w-[90vw] bg-[hsl(0,0%,5%)]  flex justify-evenly mt-4 rounded-xl shadow-md gap-10 items-center border-1 border-[hsl(0,0%,30%)] shadow-[hsl(0,0%,10%)] ">
            {scenes.map((scene) => {
              console.log(scene);
              return <SceneIcon />;
            })}
          </div>
        </motion.div>

        <div className="h-full w-full grid-cols-2 overflow-y-auto grid auto-rows-[4rem] gap-3 pl-4 pr-4">
          {entities.map((entity, index) => {
            const entity_name = Object.keys(entity)[0];
            const size = entity[entity_name]?.size ?? [1, 1];
            const tap_action = entity[Object.keys(entity)[0]]?.tap_action ?? {
              action: "call-service",
              service: "light.toggle",
              target: {
                entity_id: Object.keys(entity)[0],
              },
            };

            return (
              <LightCard
                key={index}
                tap_action={tap_action}
                haEntity={Object.keys(entity)[0]}
                rowSpan={size[0]}
                colSpan={size[1]}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
