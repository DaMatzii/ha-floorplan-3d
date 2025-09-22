import { useHome } from "@/context/HomeContext";
import { useEntity } from "@hakit/core";
import { motion } from "framer-motion";
import { useState } from "react";

function ToggleSwitch() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="flex items-center space-x-4">
      <div
        className="relative w-12 h-4 flex items-center cursor-pointer"
        onClick={() => setIsOn(!isOn)}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ backgroundColor: isOn ? "#FFDCA9" : "#e5e7eb" }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="relative w-6 h-6 bg-white rounded-full"
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
export default function HassLight() {
  const entity = useEntity("light.hue_lightstrip_plus_1");

  return (
    <>
      <div className="w-full bottom-0 absolute">
        <div className="w-full bg-gray-500 h-32 ">
          <div className="flex justify-between w-full ">
            <div className="w-64 h-12 pl-4 pt-1">
              <ColorPicker />
            </div>
            <div className="w-32 h-12 p-4 flex justify-center pt-1">
              <ToggleSwitch />
            </div>
          </div>

          <div className="w-full justify-center mt-4 flex h-12 ">
            <div className="w-75 "></div>
          </div>
        </div>
      </div>
    </>
  );
}
