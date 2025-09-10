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
  width: number;
  height: number;
  depth: number;
  name: string;
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
  width,
  height,
  depth,
  name,
}) => {
  // console.log("NAME: ", name);
  if (elevation === undefined) {
    elevation = 1;
  }
  if (angle === undefined) {
    angle = 0;
  }
  fetch("/Catalog.json")
    .then((response) => response.json())
    .then((str) => {
      catalog = str;
      // console.log(catalog);
    });

  if (catalog === undefined) return;
  // console.log(catalog);
  // console.log(catalogId);
  const item = catalog.items.find((item) => item.id === catalogId);
  // console.log("ITEM", item);
  if (item === undefined) return;
  const split = item.model.split("/");
  const objName = split[6];
  // console.log(split);
  // console.log(objName);

  if (objName.toLowerCase().includes("texturable")) return;
  // console.log(objName);
  const path = "/models/" + objName.split(".")[0] + ".gltf";
  // console.log(path);
  const obj = useGLTF(path);
  // console.log(obj);

  const targetSize = {
    x: width / 100,
    y: height / 100,
    z: depth / 100,
  };
  if (obj === undefined) return;
  const modelCopy = obj.scene.clone();
  // console.log(modelCopy);

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
  //SET POSITION TO CENTER AFTER SCALING (IMPORTANT AS FUCK)
  const box = new THREE.Box3().setFromObject(modelCopy);

  const center = new THREE.Vector3();
  box.getCenter(center);

  modelCopy.position.x -= center.x;
  modelCopy.position.z -= center.z;
  modelCopy.position.y -= center.y;

  const el = height / 100 / 2 + elevation / 100;
  return (
    <>
      <mesh position={[x / 100, el, y / 100]} rotation={[0, -angle, 0]}>
        {/* <boxGeometry args={[currentSize.x, currentSize.y, currentSize.z]} /> */}
        <primitive object={modelCopy} />
      </mesh>
    </>
  );
};
export default Furniture;
