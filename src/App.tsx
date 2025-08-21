import React, {
  useRef,
  useState,
  useEffect,
  createRef,
  forwardRef,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei";
import * as THREE from "three";
import House from "./House";

import { backgroundBlurriness } from "three/src/nodes/TSL.js";
type DebugCameraProps = {
  makeDefault?: boolean;
};
const DebugCamera = forwardRef<THREE.PerspectiveCamera, DebugCameraProps>(
  ({ makeDefault }, ref) => {
    const internalRef = useRef<THREE.PerspectiveCamera>(null);

    // Expose internal ref to parent if provided
    React.useImperativeHandle(ref, () => internalRef.current!, []);

    // Attach a CameraHelper
    useHelper(internalRef, THREE.CameraHelper, "cyan");

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
const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      style={{
        zIndex: 10,
        top: 20,
        left: 20,
        padding: "0.5rem 1rem",
        fontSize: "1rem",
        color: "white",
      }}
    >
      {children}
    </button>
  );
};

const App: React.FC = () => {
  const [activeCamera, setActiveCamera] = useState(0); // default to debug view
  const camera = useRef<THREE.PerspectiveCamera>(null);
  return (
    <>
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 20,
          left: 20,
          display: "flex",
          flexDirection: "column",
          gap: "10px", // space between buttons
        }}
      >
        <Button
          onClick={() => {
            setActiveCamera((prev) =>
              prev === DEBUG_CAMERA ? NORMAL_CAMERA : DEBUG_CAMERA,
            );
          }}
        >
          Switch Camera ({activeCamera})
        </Button>
        <Button
          onClick={() => {
            if (camera.current !== null) {
              camera.current.position.set(0, 5, 0);
              camera.current.rotation.set(-Math.PI / 2, 0, 0);
            }
          }}
        >
          Pro
        </Button>
        <Button
          onClick={() => {
            if (camera.current !== null) {
              camera.current.position.set(0, 0, 0);
              camera.current.rotation.set(Math.PI, 0, 0);
            }
          }}
        >
          Pro
        </Button>
      </div>

      <div
        className="canvas-container"
        style={{
          backgroundColor: "#000000",
        }}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ fov: 45, near: 0.1, far: 1000000, position: [10, 15, 20] }}
        >
          <PerspectiveCamera position={[0, 0, 10]} makeDefault />
          <DebugCamera
            ref={camera}
            makeDefault={activeCamera === DEBUG_CAMERA}
          />

          {/* <ambientLight intensity={0.5} /> */}
          {/* <directionalLight position={[0, 500, 500]} /> */}
          {/* <OrbitControls enableRotate={true} /> */}
          <House mainCamera={camera} />
          {/* <gridHelper args={[2000, 20]} /> */}
          {activeCamera === NORMAL_CAMERA ? <OrbitControls /> : <></>}
        </Canvas>
      </div>
    </>
  );
};

export default App;
