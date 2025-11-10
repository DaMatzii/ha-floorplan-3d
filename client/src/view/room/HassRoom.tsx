import React from "react";
import { useHome } from "@/context/HomeContext";
import { useEntity, useHass } from "@hakit/core";

import { useBottomSheet } from "@/context/HomeContext";
import { evaluateAction } from "@/utils/EvaluateAction";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import type { EntityName } from "@hakit/core";
import SceneSelect from "./SceneSelect";
import EntityCard from "./EntityCard";

import { useEffect, useState, useRef } from "react";

export default function HassRoom({ entities, scenes }) {
  return (
    <>
      <div className="h-screen bg-[hsl(0,0%,0%)] ">
        <h1 className=" ml-4 text-xl font-semibold text-[hsl(0,0%,90%)]">
          Matiaksen huone
        </h1>
        <SceneSelect scenes={scenes} />
        <div className="h-full w-full grid-cols-2 overflow-y-auto grid auto-rows-[4rem] gap-3 pl-4 pr-4">
          {entities.map((entity, index) => {
            const entity_name = Object.keys(entity)[0];
            const size = entity[entity_name]?.size ?? "sm";
            const tap_action = entity[Object.keys(entity)[0]]?.tap_action ?? {
              action: "call-service",
              service: "light.toggle",
              target: {
                entity_id: Object.keys(entity)[0],
              },
            };

            return (
              <EntityCard
                entity={entity_name}
                size={size}
                action={tap_action}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
