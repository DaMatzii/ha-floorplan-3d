import React from "react";
import type { ComponentProps } from "../Components.ts";
interface WallProps extends ComponentProps {
  xEnd: number;
  xStart: number;
  yEnd: number;
  yStart: number;
  height: number;
  thickness: number;
}
const Wall: React.FC<WallProps> = ({
  xEnd,
  xStart,
  yEnd,
  yStart,
  height,
  thickness,
}) => {
  const real_xEnd = xEnd / 100;
  const real_xStart = xStart / 100;
  const real_yEnd = yEnd / 100;
  const real_yStart = yStart / 100;

  // Height and thickness remain real-world size
  const real_height = height / 100;
  const real_thickness = thickness / 100;

  const dx = real_xEnd - real_xStart;
  const dy = real_yEnd - real_yStart;
  const length = Math.sqrt(dx ** 2 + dy ** 2);
  const real_lenght = length;
  const angle = Math.atan2(dy, dx);

  const position: [number, number, number] = [
    (real_xStart + real_xEnd) / 2,
    real_height / 2,
    (real_yStart + real_yEnd) / 2,
  ];

  return (
    <mesh position={position} rotation={[0, -angle, 0]}>
      <boxGeometry args={[real_lenght, real_height, real_thickness]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};
export default Wall;
