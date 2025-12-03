import { OBJLoader } from "three-stdlib";
import React, { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { Component } from "@/view/handler/Components";

interface FurnitureProps {
  catalogId: string;
  x: number;
  y: number;
  angle: number;
  elevation: number;
  width: number;
  height: number;
  depth: number;
}
const objCache = {};
let catalog = {} as { items: any };
fetch("./Catalog.json")
  .then((response) => response.json())
  .then((str) => {
    catalog = str;
  });

const FurnitureComponent: Component = {
  name: "LightComponent",
  bottomSheetY: 0.75,
  component: (props: FurnitureProps) => <Furniture {...props} />,
};

export const Furniture: React.FC<FurnitureProps> = ({
  catalogId,
  x,
  y,
  angle,
  elevation,
  width,
  height,
  depth,
}) => {
  // console.log("NAME: ", name);
  if (elevation === undefined) {
    elevation = 1;
  }
  if (angle === undefined) {
    angle = 0;
  }

  if (catalog === undefined) return;
  const item = catalog.items.find((item) => item.id === catalogId);
  if (item === undefined) return;
  const split = item.model.split("/");
  const objName = split[6];

  if (objName.toLowerCase().includes("texturable")) return;
  const path = "./models/" + objName.split(".")[0] + ".gltf";
  const obj = useGLTF(path);

  const targetSize = {
    x: width / 100,
    y: height / 100,
    z: depth / 100,
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
  //SET POSITION TO CENTER AFTER SCALING (IMPORTANT AS FUCK)
  const box = new THREE.Box3().setFromObject(modelCopy);

  const center = new THREE.Vector3();
  box.getCenter(center);

  modelCopy.position.x -= center.x;
  modelCopy.position.z -= center.z;
  modelCopy.position.y -= center.y;

  modelCopy.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (!child.isMesh) return;
      child.material = child.material.clone(); // keep material properties
      child.material.color.set("#777777"); // just change color
      child.material.castShadow = false;
      child.material.recieveShadow = false;
    }
  });
  // }
  const el = height / 100 / 2 + elevation / 100;
  return (
    <>
      <mesh position={[x / 100, el, y / 100]} rotation={[0, -angle, 0]}>
        <primitive object={modelCopy}></primitive>
      </mesh>
    </>
  );
};
export default FurnitureComponent;
