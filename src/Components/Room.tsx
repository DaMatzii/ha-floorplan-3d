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
import { useHome } from "../HomeContext";
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
  const texture = useLoader(
    THREE.TextureLoader,
    "/models/tex/WoodenPlanks04_2K_BaseColor.png",
  );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const tileX = 3; // number of times to repeat horizontally
  const tileY = 1; // number of times to repeat vertically

  // Repeat more to make the planks appear smaller
  texture.repeat.set(1, 1); // 4 tiles horizontally and vertically

  const [color, setColor] = useState("orange");

  let x_vals = points.map((p: Point) => p.x / 100);
  let y_vals = points.map((p: Point) => p.y / 100);
  let min_x = Math.min(...x_vals);
  let max_x = Math.max(...x_vals);
  let min_y = Math.min(...y_vals);
  let max_y = Math.max(...y_vals);

  const shape = React.useMemo(() => {
    const s = new Shape();
    s.moveTo(points[0].x / 100, points[0].y / 100);
    for (let i = 1; i < points.length; i++) {
      s.lineTo((points[i].x as number) / 100, (points[i].y as number) / 100);
    }

    return s;
  }, [points]);

  const geometry = React.useMemo(() => {
    const g = new THREE.ShapeGeometry(shape);
    g.computeBoundingBox();

    const max = g.boundingBox.max;
    const min = g.boundingBox.min;
    const range = new THREE.Vector2().subVectors(max, min);

    const uv = g.attributes.position.clone();
    for (let i = 0; i < uv.count; i++) {
      const x = g.attributes.position.getX(i);
      const y = g.attributes.position.getY(i);
      uv.setXY(
        i,
        ((x - min.x) / range.x) * tileX,
        ((y - min.y) / range.y) * tileY,
      );
    }
    g.setAttribute("uv", uv);
    return g;
  }, [shape]);
  return (
    <>
      <mesh geometry={geometry} receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        {/* <shapeGeometry args={[shape]} /> */}
        {/* <meshStandardMaterial color={palette.floor} side={THREE.BackSide} /> */}
        {/* <meshStandardMaterial */}
        {/*   map={colorMap} */}
        {/*   normalMap={normalMap} */}
        {/*   roughnessMap={roughnessMap} */}
        {/*   aoMap={aoMap} */}
        {/*   side={THREE.BackSide} */}
        {/* /> */}
        {/* <meshBasicMaterial color="white" wireframe /> */}
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
    </>
  );
};
