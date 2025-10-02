import { useRef, useState, useEffect, createRef, forwardRef } from "react";
import * as THREE from "three";
import React from "react";
import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei";

type DebugCameraProps = {
  makeDefault?: boolean;
};
const DebugCamera = forwardRef<THREE.PerspectiveCamera, DebugCameraProps>(
  ({ makeDefault }, ref) => {
    const internalRef = useRef<THREE.PerspectiveCamera>(null);

    // Expose internal ref to parent if provided
    React.useImperativeHandle(ref, () => internalRef.current!, []);

    // Attach a CameraHelper
    // useHelper(internalRef, THREE.CameraHelper, "cyan");

    return (
      <PerspectiveCamera
        ref={internalRef}
        makeDefault={makeDefault}
        position={[0, 0, 0]}
      />
    );
  },
);
const DEBUG_CAMERA = 1;
const NORMAL_CAMERA = 0;

export default DebugCamera;
