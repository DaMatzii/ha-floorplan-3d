import React from "react";
import * as THREE from "three";
import { CSG } from "three-csg-ts";
import type { ComponentProps } from "../Components.ts";
import { useHome } from "../HomeContext";

import { sub } from "three/src/nodes/TSL.js";
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
  const { home } = useHome();
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
  const geometry = React.useMemo(() => {
    if (home === undefined) {
      return undefined;
    }
    // Create base meshes
    const box1 = new THREE.Mesh(
      new THREE.BoxGeometry(real_lenght, real_height, real_thickness),
    );
    box1.rotation.set(0, angle, 0);
    box1.updateMatrixWorld(true);

    let sub = undefined;
    home.doorOrWindow.forEach((doorOrWindow: any) => {
      const box2 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1));

      // Convert door/window position into wall’s local space
      const worldPos = new THREE.Vector3(
        doorOrWindow.x / 100,
        0.5, // vertical center of cutout
        doorOrWindow.y / 100,
      );

      // Transform into box1 local space
      const localPos = box1.worldToLocal(worldPos.clone());
      box2.position.copy(localPos);

      // Ensure rotation matches wall orientation
      box2.rotation.set(0, angle, 0);

      box2.updateMatrixWorld(true);

      // Perform subtraction (not union if cutting hole)
      const result = CSG.union(box1, box2);
      sub = result;
    });

    // Perform subtraction

    // Return BufferGeometry for R3F
    // if (sub === undefined) {
    // return box1.geometry;
    // }
    // console.log(cutting_boxes);

    return sub.geometry;
  }, [home]);

  return (
    <>
      <mesh position={position} geometry={geometry} rotation={[0, angle, 0]}>
        {/* <boxGeometry args={[real_lenght, real_height, real_thickness]} /> */}
        <meshStandardMaterial color="gray" />
      </mesh>
    </>
  );
};
export default Wall;
