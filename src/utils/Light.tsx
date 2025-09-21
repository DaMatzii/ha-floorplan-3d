import React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useHelper,
  MeshReflectorMaterial,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";

export default function Light({
  type = "directional",
  helper = false,
  size = 1,
  DebugColor,
  ...props
}) {
  const lightRef = React.useRef();

  if (helper) {
    useHelper(
      lightRef,
      {
        directional: THREE.DirectionalLightHelper,
        point: THREE.PointLightHelper,
        spot: THREE.SpotLightHelper,
        hemisphere: THREE.HemisphereLightHelper,
        rectArea: THREE.RectAreaLightHelper,
      }[type],
      size,
      DebugColor,
    );
  }

  const LightTag = `${type}Light`;

  return <LightTag ref={lightRef} {...props} />;
}
