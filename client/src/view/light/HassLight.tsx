import { useHome } from "@/context/HomeContext";
import { useEntity } from "@hakit/core";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

import type { EntityName } from "@hakit/core";

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

function ToggleSwitch({ isOn, onToggle }: ToggleSwitchProps) {
  return (
    <div className="flex items-center space-x-4">
      <div
        className="relative w-12 h-4 flex items-center cursor-pointer"
        onClick={() => onToggle()}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ backgroundColor: isOn ? "#FFDCA9" : "#e5e7eb" }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="relative w-6 h-6 bg-gray-500 rounded-full"
          layout
          animate={{ x: isOn ? 32 : 0 }}
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
        />
      </div>
    </div>
  );
}
function ColorPicker() {
  return (
    <>
      <div className="flex items-center space-x-4">
        <div className="rounded-full w-10 h-10 bg-green-200"></div>
        <div className="rounded-full w-10 h-10 bg-green-200"></div>
        <div className="rounded-full w-10 h-10 bg-green-200"></div>
      </div>
    </>
  );
}
export default function HassLight({ id }) {
  const { focusedItem } = useHome();
  const entity = useEntity(id);
  const divRef = useRef(null);

  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    console.log(entity);
    console.log("I got rendered!!");
    const rect = divRef.current.getBoundingClientRect();
    let moveTo = window.innerHeight - (rect.bottom - rect.top) / 2 - 80;
  }, [focusedItem]);
  useEffect(() => {
    setIsOn((entity as any).state === "on" ? true : false);
  }, [(entity as any).state]);

  return (
    <>
      <div ref={divRef} className="relative w-full h-32 ">
        <p className="pl-4">{(focusedItem as any).hassID}</p>
        <div className="flex justify-between w-full ">
          <div className="w-64 h-12 pl-4 pt-1">
            <ColorPicker />
          </div>
          <div className="w-32 h-12 p-4 flex justify-center pt-1">
            <ToggleSwitch
              isOn={isOn}
              onToggle={() => {
                if (isOn) {
                  (entity as any).service.turnOff();
                } else {
                  (entity as any).service.turnOn();
                }

                setIsOn(!isOn);
              }}
            />
          </div>
        </div>

        <div className="w-full justify-center mt-4 flex h-12 ">
          <div className="w-75 "></div>
        </div>
      </div>
    </>
  );
}
