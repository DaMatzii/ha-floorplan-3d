import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stats } from "@react-three/drei";

import Scene from "@/view/Scene";

export default function FloorplanView({ activeCamera }) {
  return (
    <>
      <Canvas
        // frameloop="demand"
        // shadows
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [10, 15, 20],
        }}
      >
        {/* <Stats /> */}
        <Scene activeCamera={activeCamera} editorMode={false} />
      </Canvas>
    </>
  );
}
