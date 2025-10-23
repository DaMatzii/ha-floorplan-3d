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
  const { callService } = useHass();

  console.log(entity.attributes.friendly_name);
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
        <div className="pl-2 text-[12px]  flex-1 min-w-0">
          <p className="truncate overflow-hidden whitespace-nowrap">
            {entity.attributes.friendly_name}
          </p>
          <p className="">37%</p>
        </div>
      </>
    );
  }
  function Icon() {
    return (
      <motion.div
        className="bg-white p-2 rounded-full"
        animate={{
          rotate: 0,
          color: entity.state.toLowerCase() === "on" ? "#fbbf24" : "#9ca3af",
          scale: 1,
          opacity: 1,
        }}
        initial={{ scale: 1, opacity: 1 }}
        // whileHover={{ scale: 1.1 }}
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
    handleTapAction(tap_action);
  }

  function BigCard() {
    return (
      <>
        <div
          className={`flex pt-2 flex-col flex-start justify-between ${spanClass} col-span-${colSpan} bg-yellow-500  rounded-xl`}
          onClick={handleClick}
        >
          <div className="w-12 h-12 ml-2 rounded-full flex-shrink-0 items-center flex">
            <Icon />
          </div>
          <div className="ml-2 pb-3  text-[12px]">
            <Text />
          </div>
        </div>
      </>
    );
  }
  function SmallCard() {
    return (
      <>
        <div
          className={`flex flex-start ${spanClass}  col-span-${colSpan} bg-yellow-500  rounded-xl items-center justify-between`}
          onClick={handleClick}
        >
          <div className="w-9 h-9 ml-2 bg-black flex-shrink-0 rounded-full"></div>
          <Text />
        </div>
      </>
    );
  }
  return <>{rowSpan !== 1 ? <BigCard /> : <SmallCard />}</>;
}
export default function HassRoom({ entities }) {
  const { focusedItem, home } = useHome();
  const { dispatch } = useBottomSheet();

  useEffect(() => {
    let moveTo = window.innerHeight * 0.25;

    dispatch({ type: "SET_MAX_HEIGHT_AND_OPEN", payload: moveTo });
    console.log("opening");
  }, [focusedItem]);

  return (
    <>
      <div className="h-screen">
        <div className="h-full w-full grid-cols-2 overflow-y-auto grid auto-rows-[4rem] gap-3  p-4 ">
          {entities.map((entity, index) => {
            console.log(entity);

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
