import { a, useSpring } from "@react-spring/three";
import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  useHelper,
} from "@react-three/drei";
import DebugCamera from "@/utils/DebugCamera";
import * as THREE from "three";
// import { useHome } from "@/hooks/useHome";
import {
  useBuilding,
  useFloorplan,
  useFloorplanRoom,
} from "@/hooks/useBuilding";

import { useHome } from "@/context/HomeContext";
import { ViewContextProvider } from "@/context/ViewContext";
import { renderComponent } from "@/view/handler/Components";

const DEBUG_CAMERA = 1;
const NORMAL_CAMERA = 0;

function renderBuilding(building, buil, setComponents) {
  let componentsToRender = [];
  Object.keys(building).forEach((key) => {
    if (Array.isArray(building[key])) {
      building[key].map((item, index) => {
        const Comp = renderComponent(key);
        if (Comp) {
          componentsToRender.push(
            <Comp key={key + "-" + index} {...item} building={buil} />,
          );
        }
      });
    }
  });
  setComponents(componentsToRender);
}
function Building({ building_id }) {
  const floorplan = useFloorplan(0);
  const building = useBuilding(0);
  const [components, setComponents] = useState();

  useEffect(() => {
    if (floorplan === undefined) return;
    console.log("rerendering");
    renderBuilding(floorplan, building, setComponents);
  }, [floorplan, building]);

  return <>{components}</>;
}

function Scene({ activeCamera, editorMode }) {
  const { home, currentRoom } = useHome();
  const [target, setTarget] = useState([0, 0, 10]);

  const camera = useRef<THREE.PerspectiveCamera>(null);

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
  const focus = (room: any) => {
    if (!room) return;
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

    setTarget([center.x, cameraZ + 5, center.y]);
    camera.current.rotation.set(-Math.PI / 2, 0, 0);
  };

  useEffect(() => {
    if (home === undefined) {
      return;
    }
    focus(currentRoom?.floorplan);
    console.log(currentRoom);
  }, [currentRoom]);

  return (
    <>
      <ViewContextProvider initial={{ editorMode: editorMode }}>
        <PerspectiveCamera position={[0, 0, 10]} makeDefault />
        <DebugCamera ref={camera} makeDefault={activeCamera === DEBUG_CAMERA} />

        {activeCamera === NORMAL_CAMERA ? <OrbitControls /> : <></>}

        <ambientLight intensity={0.1} color="#f4fffa" />
        {/* <Environment preset="apartment" /> */}
        <Building building_id={0} />

        {/* <Light */}
        {/*   type="directional" */}
        {/*   helper */}
        {/*   size={0.5} */}
        {/*   DebugColor="red" */}
        {/*   position={[14, 15, 10]} */}
        {/*   intensity={3} */}
        {/*   decay={2} */}
        {/*   distance={3} */}
        {/*   castShadow */}
        {/*   target-position={[14, 0, 10]} */}
        {/* /> */}
      </ViewContextProvider>
    </>
  );
}
export default Scene;
