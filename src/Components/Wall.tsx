import React from "react";
import * as THREE from "three";
import { CSG } from "three-csg-ts";
import type { ComponentProps } from "../Components.ts";
import { useHome } from "../HomeContext";
import { palette } from "../Colorpalette.ts";

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
    const wallGeom = new THREE.BoxGeometry(
      real_lenght,
      real_height,
      real_thickness,
    );

    // Apply world rotation & position
    const wallMatrix = new THREE.Matrix4()
      .makeRotationY(angle) // rotate wall in world
      .setPosition(new THREE.Vector3(position[0], position[1], position[2])); // move wall in world
    wallGeom.applyMatrix4(wallMatrix);
    let wallMesh = new THREE.Mesh(wallGeom);

    let sub = wallMesh;

    home.doorOrWindow.forEach((doorOrWindow: any) => {
      if (doorOrWindow.elevation === undefined) {
        doorOrWindow.elevation = 0;
      }
      if (doorOrWindow.angle === undefined) {
        doorOrWindow.angle = 0;
      }
      // console.log(doorOrWindow);
      const box2 = new THREE.BoxGeometry(
        doorOrWindow.width / 100,
        doorOrWindow.height / 100,
        doorOrWindow.depth / 100 + 0.2,
      );
      const boxMatrix = new THREE.Matrix4()
        .makeRotationY(-doorOrWindow.angle)
        // .makeRotationX(doorOrWindow.)
        .setPosition(
          new THREE.Vector3(
            doorOrWindow.x / 100,
            doorOrWindow.height / 100 / 2 + 0.01 + doorOrWindow.elevation / 100,
            doorOrWindow.y / 100,
          ),
        ); // move wall in world
      box2.applyMatrix4(boxMatrix);

      const wallBox = new THREE.Box3().setFromBufferAttribute(
        wallGeom.attributes.position,
      );
      const cutBox = new THREE.Box3().setFromBufferAttribute(
        box2.attributes.position,
      );

      if (wallBox.intersectsBox(cutBox)) {
        let cutMesh = new THREE.Mesh(box2);
        sub = CSG.subtract(sub, cutMesh);
      }
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
      <mesh castShadow receiveShadow geometry={geometry}>
        {/* <boxGeometry args={[real_lenght, real_height, real_thickness]} /> */}
        {/* <meshStandardMaterial color={palette.wall} /> */}
        <meshStandardMaterial color={palette.wall} roughness={1} />
      </mesh>
    </>
  );
};
export default Wall;
