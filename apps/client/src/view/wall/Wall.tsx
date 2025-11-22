import React from "react";
import * as THREE from "three";
import { CSG } from "three-csg-ts";
import { useHome } from "@/context/HomeContext";
import { palette } from "@/Colorpalette";
import { useFloorplan } from "@/hooks/useBuilding";

import type { Component } from "@/view/handler/Components";
import { sub } from "three/src/nodes/TSL.js";
interface WallProps {
  xEnd: number;
  xStart: number;
  yEnd: number;
  yStart: number;
  height: number;
  thickness: number;
  building: any;
}

const WallComponent: Component = {
  name: "LightComponent",
  bottomSheetY: 0.75,
  component: (props: WallProps) => <Wall {...props} />,
};
const Wall: React.FC<WallProps> = ({
  xEnd,
  xStart,
  yEnd,
  yStart,
  height,
  thickness,
  building,
}) => {
  const { home } = useHome();
  const floorplan = useFloorplan(building);

  const real_xEnd = xEnd / 100;
  const real_xStart = xStart / 100;
  const real_yEnd = yEnd / 100;
  const real_yStart = yStart / 100;

  const real_height = height / 100;
  const real_thickness = thickness / 100;

  const dx = real_xEnd - real_xStart;
  const dy = real_yEnd - real_yStart;
  const length = Math.sqrt(dx ** 2 + dy ** 2) + 0.1;
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
    const wallGeom = new THREE.BoxGeometry(
      real_lenght,
      real_height,
      real_thickness,
    );

    const wallMatrix = new THREE.Matrix4()
      .makeRotationY(angle)
      .setPosition(new THREE.Vector3(position[0], position[1], position[2]));
    wallGeom.applyMatrix4(wallMatrix);
    let wallMesh = new THREE.Mesh(wallGeom);

    let sub = wallMesh;
    let end_result;

    floorplan.doorOrWindow.forEach((doorOrWindow: any) => {
      if (doorOrWindow.elevation === undefined) {
        doorOrWindow.elevation = 0;
      }
      if (doorOrWindow.angle === undefined) {
        doorOrWindow.angle = 0;
      }
      const box2 = new THREE.BoxGeometry(
        doorOrWindow.width / 100,
        doorOrWindow.height / 100,
        doorOrWindow.depth / 100 + 0.2,
      );
      const boxMatrix = new THREE.Matrix4()
        .makeRotationY(-doorOrWindow.angle)
        .setPosition(
          new THREE.Vector3(
            doorOrWindow.x / 100,
            doorOrWindow.height / 100 / 2 + 0.01 + doorOrWindow.elevation / 100,
            doorOrWindow.y / 100,
          ),
        ); // move wall in world
      box2.applyMatrix4(boxMatrix);

      const wallBox = new THREE.Box3().setFromBufferAttribute(
        wallGeom.attributes.position as THREE.BufferAttribute,
      );
      const cutBox = new THREE.Box3().setFromBufferAttribute(
        box2.attributes.position as THREE.BufferAttribute,
      );

      if (wallBox.intersectsBox(cutBox)) {
        let cutMesh = new THREE.Mesh(box2);
        end_result = CSG.subtract(sub, cutMesh);
      }
    });

    return end_result?.geometry ?? sub.geometry;
  }, [home]);

  return (
    <>
      <mesh geometry={geometry}>
        {/* <boxGeometry args={[real_lenght, real_height, real_thickness]} /> */}
        {/* <meshStandardMaterial color={palette.wall} /> */}
        <meshStandardMaterial color={palette.wall} roughness={1} />
      </mesh>
    </>
  );
};
export default WallComponent;
