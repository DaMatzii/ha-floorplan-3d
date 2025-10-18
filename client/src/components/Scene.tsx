import { a, useSpring } from "@react-spring/three";
import { useEffect, useState, useRef } from "react";
import Light from "@/utils/Light";
import { parseHome, renderHome } from "@/utils/Parser";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei";
import DebugCamera from "@/utils/DebugCamera";
import * as THREE from "three";
// import { useHome } from "@/hooks/useHome";
import { useBuilding, useFloorplan } from "@/hooks/useBuilding";

import { MeshReflectorMaterial, Environment } from "@react-three/drei";
import { useHome } from "@/context/HomeContext";
import { ViewContextProvider } from "@/context/ViewContext";
import { renderComponent } from "@/lib/test";

const DEBUG_CAMERA = 1;
const NORMAL_CAMERA = 0;

function renderBuilding(building, setComponents) {
  let componentsToRender = [];
  Object.keys(building).forEach((key) => {
    if (Array.isArray(building[key])) {
      building[key].map((item, index) => {
        const Comp = renderComponent(key);
        if (Comp) {
          componentsToRender.push(<Comp key={key + "-" + index} {...item} />);
        }
      });
    }
  });
  console.log(componentsToRender);
  setComponents(componentsToRender);
}
function Building({ building_id }) {
  const { building } = useBuilding(0);
  const { floorplan } = useFloorplan(0);
  const [components, setComponents] = useState();

  useEffect(() => {
    if (floorplan === undefined) return;
    console.log("Building struct or what ever");
    console.log(building);
    console.log(floorplan);
    renderBuilding(floorplan, setComponents);
  }, [floorplan]);

  return <>{components}</>;
}
function Room() {
  useEffect(() => {
    console.log("ROOOOOM");
  }, []);

  return <></>;
}

function Scene({ activeCamera, editorMode }) {
  const { home, currentRoom } = useHome();
  const [target, setTarget] = useState([0, 0, 10]);
  const idleTimeout = useRef(null);

  const camera = useRef<THREE.PerspectiveCamera>(null);
  const lastPos = useRef({
    x: 0,
    y: 0,
    z: 0,
  });

  const { invalidate } = useThree();

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

  const { gl: renderer } = useThree();
  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed > 4000) {
        clearInterval(interval);
        return;
      }

      invalidate();
    }, 16);
    return () => clearInterval(interval);
  }, [target]);
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
      <ViewContextProvider initial={{ editorMode: editorMode }}>
        <PerspectiveCamera position={[0, 0, 10]} makeDefault />
        <DebugCamera ref={camera} makeDefault={activeCamera === DEBUG_CAMERA} />

        {activeCamera === NORMAL_CAMERA ? <OrbitControls /> : <></>}

        <ambientLight intensity={1.3} color="#f4fffa" />
        <Building building_id={0} />

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
      </ViewContextProvider>
    </>
  );
}
export default Scene;
