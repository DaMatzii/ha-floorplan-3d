import { a, useSpring } from "@react-spring/three";
import { useEffect, useState, useRef } from "react";
import Light from "@/utils/Light";
import { parseHome, renderHome } from "@/utils/Parser";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei";
import DebugCamera from "@/utils/DebugCamera";
import * as THREE from "three";

import { MeshReflectorMaterial } from "@react-three/drei";
import { useHome } from "@/context/HomeContext";

const DEBUG_CAMERA = 1;
const NORMAL_CAMERA = 0;
function Building({ building }) {
  const [floorplanElems, setFloorplanElems] = useState();
  const [entityElems, setEntityElems] = useState();
  // const [target, setTarget] = useState([0, 0, 10]);

  // const camera = useRef<THREE.PerspectiveCamera>(null);

  useEffect(() => {
    const [floorplan, entities] = renderHome(building);
    setFloorplanElems(floorplan);
    setEntityElems(entities);
  }, [building]);

  return (
    <>
      {floorplanElems}
      {entityElems}
    </>
  );
}

function Scene({ activeCamera }) {
  const { home, currentRoom } = useHome();
  const [target, setTarget] = useState([0, 0, 10]);

  const camera = useRef<THREE.PerspectiveCamera>(null);

  const { position } = useSpring({
    position: target,
    config: { mass: 100, tension: 10, friction: 0, duration: 100 },
  });

  useFrame(() => {
    if (camera.current) {
      const [x, y, z] = position.get();
      camera.current.position.set(x, y, z);
    }
  });
  const focus = (room: Room) => {
    const x_vals = room.point.map((p) => p.x / 100);
    const y_vals = room.point.map((p) => p.y / 100);
    const points = x_vals.map((x, i) => new THREE.Vector3(x, y_vals[i], 0)); // z = 0

    const box = new THREE.Box3();
    points.forEach((point) => box.expandByPoint(point));

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);

    const fov = camera.current.fov * (Math.PI / 180);

    const offset = 1.25;
    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * offset;
    // console.log(cameraZ);

    setTarget([center.x, cameraZ + 5, center.y]);
    camera.current.rotation.set(-Math.PI / 2, 0, 0);
  };

  useEffect(() => {
    if (home === undefined) {
      return;
    }
    //move to useMemo or out of useEffect
    let rooms = [];
    for (let i = 0; i < home.buildings.length; i++) {
      const building = home.buildings[i];
      rooms.push(...building.floorplan?.room);
    }

    focus(rooms[currentRoom]);
  }, [currentRoom]);

  return (
    <>
      <PerspectiveCamera position={[0, 0, 10]} makeDefault />
      <DebugCamera ref={camera} makeDefault={activeCamera === DEBUG_CAMERA} />

      {activeCamera === NORMAL_CAMERA ? <OrbitControls /> : <></>}
      {/* <RoomButtons rooms={home?.room} mainCameraRef={mainCamera} /> */}

      {/* <Environment preset="apartment" /> */}
      <ambientLight intensity={0.3} color="0xffffff" />
      <Building building={home.buildings[0]} />

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
