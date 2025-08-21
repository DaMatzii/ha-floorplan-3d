import React from "react";
import type { ComponentProps } from "../Components.ts";
import Light from "../Light.tsx";
interface LightProps extends ComponentProps {
  x: number;
  y: number;
  height: number;
  elevation: number;
}
const LightComp: React.FC<LightProps> = ({ x, y, height, elevation }) => {
  let real_x = x / 100;
  let real_y = y / 100;
  return (
    <>
      <Light
        type="point"
        helper
        size={0.5}
        DebugColor="red"
        position={[real_x, height / 100, real_y]}
        color="pink"
        intensity={2.5}
        // castShadow
      />
    </>
  );
};
export default LightComp;
