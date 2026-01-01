import { useRef, forwardRef } from "react";
import * as THREE from "three";
import React from "react";
import { PerspectiveCamera } from "@react-three/drei";

type DebugCameraProps = {
  makeDefault?: boolean;
};
const DebugCamera = forwardRef<THREE.PerspectiveCamera, DebugCameraProps>(
  ({ makeDefault }, ref) => {
    const internalRef = useRef<THREE.PerspectiveCamera>(null);

    React.useImperativeHandle(ref, () => internalRef.current!, []);

    return (
      <PerspectiveCamera
        ref={internalRef}
        makeDefault={makeDefault}
        position={[0, 0, 0]}
      />
    );
  },
);

export default DebugCamera;
