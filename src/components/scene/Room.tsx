import React, { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "../Components.ts";
import ReactDOM from "react-dom/client";
import Light from "../Light.tsx";
import { Shape } from "three";
import * as THREE from "three";
import { useBounds } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import registry from "../Components.ts";
import type { JSX } from "react/jsx-runtime";
import { useHome } from "../HomeContext.ts";
import { palette } from "../Colorpalette.ts";

type Point = { x: number; y: number };
interface RoomMeshProps {
  points: Point[];
  color: string;
}
interface RoomProps extends ComponentProps {
  point: any;
}

function renderRoomItems(root: any) {
  const renderList: JSX.Element[] = [];
  console.log("RENDER RUN!!");
  let runningNumber = 0;
  for (const type in root) {
    if (typeof root[type] === "object") {
      if (Array.isArray(root[type])) {
        for (const value in root[type]) {
          let Comp = registry.getParser("room-" + type);
          if (Comp) {
            renderList.push(
              <Comp
                key={type + "-" + runningNumber}
                room={root}
                {...(root[type][value] as any)}
              />,
            );
            runningNumber += 1;
          }
        }
        continue;
      }
      let Comp = registry.getParser("room-" + type);
      if (Comp) {
        renderList.push(
          <Comp
            key={type + "-" + runningNumber}
            room={root}
            {...(root[type] as any)}
          />,
        );
        runningNumber += 1;
      }
    }
  }
  return renderList;
}

const Room: React.FC<RoomProps> = (room) => {
  const [elems, setElems] = useState();
  const ref = useRef(0);

  useEffect(() => {
    setElems(renderRoomItems(room));
  }, [room]);
  return (
    <>
      {elems}
      {room.name === "" ? 0 : <RoomMesh room={room} points={room.point} />}
    </>
  );
};
export default Room;

const RoomMesh: React.FC<RoomMeshProps> = ({ room, points }) => {
  // const [colorMap, normalMap, roughnessMap, aoMap] = useLoader(
  //   THREE.TextureLoader,
  //   [
  //     "models/tex/WoodenPlanks04_2K_BaseColor.png",
  //     "models/tex/WoodenPlanks04_2K_Normal.png",
  //     "models/tex/WoodenPlanks04_2K_Roughness.png",
  //     "models/tex/WoodenPlanks04_2K_AO.png",
  //   ],
  // );
  if (room.name !== "Makuuhuone") {
    // return;
  }
  const texture = useLoader(
    THREE.TextureLoader,
    "/models/tex/WoodenPlanks04_2K_BaseColor.png",
  );

  let x_vals = points.map((p: Point) => p.x / 100);
  let y_vals = points.map((p: Point) => p.y / 100);
  let min_x = Math.min(...x_vals);
  let max_x = Math.max(...x_vals);
  let min_y = Math.min(...y_vals);
  let max_y = Math.max(...y_vals);
  const [g, tex] = React.useMemo(() => {
    const shape = new Shape();
    shape.moveTo(points[0].x / 100, points[0].y / 100);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(
        (points[i].x as number) / 100,
        (points[i].y as number) / 100,
      );
    }
    const geometry = new THREE.ShapeGeometry(shape);
    const mesh = new THREE.Mesh(geometry);
    console.log(geometry);
    var box = new THREE.Box3().setFromObject(mesh);
    var size = new THREE.Vector3();
    box.getSize(size);
    var vec3 = new THREE.Vector3(); // temp vector
    var attPos = mesh.geometry.attributes.position;
    var attUv = mesh.geometry.attributes.uv;
    const tex1 = texture.clone();
    tex1.wrapS = THREE.RepeatWrapping;
    tex1.wrapT = THREE.RepeatWrapping;

    tex1.needsUpdate = true;
    tex1.repeat.set(size.x / 1, size.y / 1);

    for (let i = 0; i < attPos.count; i++) {
      vec3.fromBufferAttribute(attPos, i);
      attUv.setXY(
        i,
        (vec3.x - box.min.x) / size.x,
        (vec3.y - box.min.y) / size.y,
      );
    }

    return [mesh.geometry, tex1];
  }, [points]);

  return (
    <>
      <mesh geometry={g} rotation={[Math.PI / 2, 0, 0]}>
        {/* <meshBasicMaterial map={tex} side={THREE.BackSide} /> */}
        <meshStandardMaterial color="#3d3d3d" side={THREE.BackSide} />
      </mesh>
    </>
  );
};
