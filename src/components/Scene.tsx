import { a, useSpring } from "@react-spring/three";
import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import Light from "@/utils/Light";
import type Home from "@/types/Home.ts";
import { parseHome, renderHome } from "@/utils/Parser";

import {
  Html,
  OrbitControls,
  MeshReflectorMaterial,
  Environment,
  Bounds,
} from "@react-three/drei";
import { useHome } from "@/context/HomeContext";

import * as THREE from "three";

function Scene({ mainCamera }) {
  const [xml, setXml] = useState<XMLDocument>();
  // const [home, setHome] = useState<Home>();
  const [elems, setElems] = useState();
  const { home, setHome, currentRoom } = useHome();
  const [target, setTarget] = useState([0, 0, 10]);

  // Spring for camera position
  const { position } = useSpring({
    position: target,
    config: { mass: 100, tension: 10, friction: 0, duration: 100 },
  });

  // Update camera position every frame
  useFrame(() => {
    if (mainCamera.current) {
      const [x, y, z] = position.get();
      mainCamera.current.position.set(x, y, z);
    }
  });
  // console.log(mainCamera);
  const focus = (room: Room) => {
    const x_vals = room.point.map((p) => p.x / 100);
    const y_vals = room.point.map((p) => p.y / 100);
    const points = x_vals.map((x, i) => new THREE.Vector3(x, y_vals[i], 0)); // z = 0

    const box = new THREE.Box3();
    points.forEach((point) => box.expandByPoint(point));

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);

    const fov = mainCamera.current.fov * (Math.PI / 180);

    const offset = 1.25;
    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * offset;
    console.log(cameraZ);

    setTarget([center.x, cameraZ + 5, center.y]);
    mainCamera.current.rotation.set(-Math.PI / 2, 0, 0);
  };

  useEffect(() => {
    setElems(renderHome(home));
    console.log(home);
  }, [home]);

  useEffect(() => {
    console.log("xml updated:", xml);
    if (xml !== undefined) {
      console.log((xml as XMLDocument).getElementsByName("room"));
    }
  }, [xml]);
  const targetRef = useRef();

  useEffect(() => {
    if (home === undefined) {
      return;
    }
    focus(home.room[currentRoom]);
  }, [currentRoom]);

  return (
    <>
      {/* <RoomButtons rooms={home?.room} mainCameraRef={mainCamera} /> */}
      {elems}

      {/* <Environment preset="apartment" /> */}
      <ambientLight intensity={0.3} color="0xffffff" />

      {/* <directionalLight position={[6, 25, -4]} intensity={2} castShadow /> */}
      {/* <TexturedBox /> */}
      {/* <TempTest /> */}
      <Light
        type="directional"
        helper
        size={0.5}
        DebugColor="red"
        position={[14, 15, 10]}
        intensity={3}
        decay={2}
        distance={3}
        castShadow
        target-position={[14, 0, 10]}
      />

      <Light
        type="directional"
        helper
        size={0.5}
        DebugColor="red"
        position={[5.5, 7, 15]}
        intensity={2}
        decay={2}
        distance={3}
        castShadow
        target-position={[7, 0, 12]}
      />
      {/* <Light */}
      {/*   type="point" */}
      {/*   helper */}
      {/*   size={0.5} */}
      {/*   DebugColor="red" */}
      {/*   position={[7, 1, 12]} */}
      {/*   color="orange" */}
      {/*   intensity={4} */}
      {/*   decay={2} */}
      {/*   distance={3} */}
      {/*   castShadow */}
      {/* /> */}

      {/* <pointLight */}
      {/* position={[5.8, 3, 11.8]} */}
      {/* intensity={2} */}
      {/* color="pink" */}
      {/* distance={50} // how far the light reaches */}
      {/* decay={2} // how fast intensity drops */}
      {/* /> */}

      <object3D ref={targetRef} position={[5, 4, 2]} />

      <fog attach="fog" args={["#17171b", 30, 100000]} />
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[200, 200]}
          resolution={1024}
          mixBlur={1}
          mixStrength={15}
          depthScale={0.5}
          minDepthThreshold={0.85}
          color="#17171b"
          metalness={0.6}
          roughness={1}
        />
      </mesh>
    </>
  );
}
export default Scene;
