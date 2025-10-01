import { Canvas, useFrame, useThree } from "@react-three/fiber";

import Scene from "@/components/Scene";

export default function FloorplanView({ activeCamera }) {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000000,
          position: [10, 15, 20],
        }}
      >
        <Scene activeCamera={activeCamera} />
      </Canvas>
    </>
  );
}
