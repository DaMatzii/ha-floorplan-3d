import { OBJLoader } from "three-stdlib";
import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { Component } from "@/renderer/Components";
import { useColor } from "@/utils/useColor";

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
const FurnitureComponent: Component = {
  name: "LightComponent",
  component: (props: FurnitureProps) => <Furniture {...props} />,
  visibleOnPreview: true,
};

function useFurnitureInfo(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setData(null);

      const cleanId = id.replace("#", "-");
      const url = `./api/furniture/${cleanId}`;

      try {
        const response = await fetch(url);
        const json = await response.json();

        setData(json);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return { data, loading };
}

export const Furniture: React.FC<FurnitureProps> = ({
  catalogId,
  x,
  y,
  angle = 0,
  elevation = 1,
  width,
  height,
  depth,
}) => {
  const color = useColor("furniture");
  const { data, loading } = useFurnitureInfo(catalogId);

  if (loading) return <></>;

  const split = data.model.split("/");

  if (split > 6) {
    return <></>;
  }

  const objName = split[6];

  if (objName.toLowerCase().includes("texturable")) return;
  const path = "./resources/models/" + objName.split(".")[0] + ".gltf";
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
      child.material = child.material.clone();
      child.material.color.set(color);
      child.material.castShadow = false;
      child.material.recieveShadow = false;
    }
  });
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
