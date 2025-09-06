import type { ComponentProps } from "../Components.ts";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";
import React, { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

import { tan } from "three/src/nodes/TSL.js";
interface FurnitureProps extends ComponentProps {
  catalogId: string;
  x: number;
  y: number;
  angle: number;
  elevation: number;
}
const objCache = {};
let catalog = {};
fetch("/Catalog.json")
  .then((response) => response.json())
  .then((str) => {
    catalog = str;
    console.log(catalog);
  });

const Furniture: React.FC<FurnitureProps> = ({
  catalogId,
  x,
  y,
  angle,
  elevation,
}) => {
  if (elevation === undefined) {
    elevation = 1;
  }
  if (angle === undefined) {
    angle = 0;
  }

  if (catalog === undefined) return;
  // console.log(catalog);
  const item = catalog.items.find((item) => item.id === catalogId);
  // console.log("ITEM", item);
  const split = item.model.split("/");
  const objName = split[6];
  // console.log(split);
  // console.log(objName);

  if (objName.toLowerCase().includes("texturable")) return;
  // console.log(objName);
  const path = "/models/" + objName.split(".")[0] + ".gltf";
  // console.log(path);
  const obj = useGLTF(path);

  const targetSize = {
    x: item.width / 100,
    y: item.height / 100,
    z: item.depth / 100,
  };
  if (obj === undefined) return;
  const modelCopy = obj.scene.clone();

  const bbox = new THREE.Box3().setFromObject(modelCopy);
  const currentSize = new THREE.Vector3();
  bbox.getSize(currentSize);
  if (currentSize === undefined) return;

  const scale = new THREE.Vector3(
    targetSize.x / currentSize.x,
    targetSize.y / currentSize.y,
    targetSize.z / currentSize.z,
  );

  modelCopy.scale.copy(scale);
  modelCopy.rotation.set(0, -angle, 0);
  const el = item.height / 100 / 2 + elevation / 100;
  return (
    <>
      <primitive object={modelCopy} position={[x / 100, el, y / 100]} />
    </>
  );
};
export default Furniture;
