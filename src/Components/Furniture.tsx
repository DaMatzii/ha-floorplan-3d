import type { ComponentProps } from "../Components.ts";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";
import React, { useMemo } from "react";
import * as THREE from "three";

interface FurnitureProps extends ComponentProps {
  catalogId: string;
  x: number;
  y: number;
}
const objCache = {};
let catalog = {};
fetch("/Catalog.json")
  .then((response) => response.json())
  .then((str) => {
    catalog = str;
    console.log(catalog);
  });

const Furniture: React.FC<FurnitureProps> = ({ catalogId, x, y }) => {
  // const response = await fh("http://localhost:5173/house.xml");

  if (catalog === undefined) return;
  // console.log(catalog);
  const item = catalog.items.find((item) => item.id === catalogId);
  // console.log("ITEM", item);
  const split = item.model.split("/");
  const objName = split[6];
  // console.log(split);
  // console.log(objName);

  const path = "/models/" + objName;
  const obj = useLoader(OBJLoader, path);

  // clone cached object for this instance

  const targetSize = {
    x: item.width / 100,
    y: item.height / 100,
    z: item.depth / 100,
  };
  // ensure meshes retain geometry and materials
  if (obj === undefined) return;

  const bbox = new THREE.Box3().setFromObject(obj);
  const currentSize = new THREE.Vector3();
  bbox.getSize(currentSize);
  if (currentSize === undefined) return;

  // compute per-axis scale
  const scale = new THREE.Vector3(
    targetSize.x / currentSize.x,
    targetSize.y / currentSize.y,
    targetSize.z / currentSize.z,
  );

  // apply scale to all child geometries
  // apply non-uniform scale
  // obj.scale.copy(1 / 100);
  return (
    <>
      <primitive
        object={obj}
        position={[x / 100, 0.5, y / 100]}
        scale={scale}
      />
    </>
  );
};
export default Furniture;
