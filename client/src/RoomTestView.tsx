import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useTexture,
  MeshReflectorMaterial,
} from "@react-three/drei";
import Light from "@/utils/Light";
import * as THREE from "three";
import { BoxGeometry, MeshStandardMaterial } from "three";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";

function Couch({ model, color, ...props }) {
  const { scene } = useGLTF(model as string); // put your file path here
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = child.material.clone(); // keep material properties
      child.material.color.set(color as string); // just change color
      child.material.flatShading = true;
      // child.castShadow = true;
      // child.receiveShadow = true;
    }
  });
  return (
    <mesh {...props}>
      <primitive object={scene} receiveShadow />
    </mesh>
  );
}
function Floor(props) {
  const texture = useTexture("/models/textures/woodenFloor.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4); // tile 4 times in X and Y

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <planeGeometry args={[10, 10]} />
        {/* <meshStandardMaterial color="#ababab" /> */}
        <meshStandardMaterial map={texture} />
      </mesh>
    </>
  );
}
function Wall({ position, rotation, lenght }) {
  return (
    <>
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[lenght, 5, 0.5]} />

        <meshStandardMaterial color="#cdd0d8" />
      </mesh>
    </>
  );
}
export function RoomView() {
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
        className="w-screen h-screen bg-[#31353f]"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={3} castShadow />

        <OrbitControls />

        <Couch
          model="/models/sofa2.gltf"
          color="orange"
          position={[-1, 0, 1]}
          scale={2}
        />
        <Couch
          model="/models/floorUplight.gltf"
          color="black"
          position={[-3, 0.3, 1]}
          scale={1.3}
        />
        <Couch
          model="/models/coffeeTable.gltf"
          color="#544437"
          position={[1, 0.3, 3.5]}
          scale={3}
        />

        <Light
          type="point"
          helper
          size={0.5}
          DebugColor="red"
          position={[-3, 1.7, 1]}
          intensity={20}
          decay={2}
          color="orange"
          castShadow
        />
        <Light
          type="point"
          helper
          size={0.5}
          DebugColor="red"
          position={[1, 3.3, 4]}
          intensity={10}
          color="#f4fffa"
          castShadow
        />

        <Floor />
        <Wall position={[-0.2, 1.4, -0.4]} rotation={[0, 0, 0]} lenght={10} />
        <Wall
          position={[-4, 1.4, 0]}
          rotation={[0, Math.PI / 2, 0]}
          lenght={10}
        />
      </Canvas>
    </>
  );
}
