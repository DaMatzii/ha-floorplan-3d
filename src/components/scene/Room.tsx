import React, { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "../Components.ts";
import { Shape } from "three";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import registry from "@/utils/Components.js";
import type { JSX } from "react/jsx-runtime";
import type { Room } from "@/types/Room";

import { useHome } from "@/context/HomeContext";
// import { palette } from "../Colorpalette.ts";

type Point = { x: number; y: number };
interface RoomMeshProps {
  points: Point[];
  color: string;
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

function RoomClickBox({ room }: any) {
  const colors = [
    "#e74c3c",
    "#3498db",
    "#2ecc71",
    "#9b59b6",
    "#f1c40f",
    "#1abc9c",
    "#e67e22",
    "#ecf0f1",
  ];
  const [color, setColor] = useState("orange");
  const [opacity, setOpacity] = useState(0);

  const { setFocusedItem } = useHome();
  const randomColor = React.useMemo(() => {
    const idx = Math.floor(Math.random() * colors.length);
    return colors[idx];
  }, []);
  // if (!room.point) {
  // return;
  // }

  // console.log("ROOMBLICKBOX: ", room);
  // console.log(room.point[0]);
  const geometry = React.useMemo(() => {
    const shape = new Shape();
    shape.moveTo(room.point[0].x / 100, room.point[0].y / 100);
    for (let i = 1; i < room.point.length; i++) {
      shape.lineTo(
        (room.point[i].x as number) / 100,
        (room.point[i].y as number) / 100,
      );
    }
    const extrudeSettings = {
      steps: 2,
      depth: -2.3,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 1,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.computeBoundingBox();
    geom.computeBoundingSphere();
    geom.computeVertexNormals();

    return geom;
  }, []);

  return (
    <>
      <mesh
        geometry={geometry}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          let id = room.hassAreaId ? room.hassAreaId : room.id;
          console.log(room.name);
          console.log(e);

          // setOpacity(1);
          // setTimeout(() => {
          // setOpacity(0);
          // }, 500);
          setFocusedItem({
            hassID: id,
            type: "room",
          });
        }}
      >
        {/* <meshStandardMaterial color="orange" side={THREE.DoubleSide} /> */}
        <meshBasicMaterial
          color={randomColor}
          transparent={true}
          opacity={opacity} // fully invisible
          alphaTest={0} // allows raycasting
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

const Room: React.FC<Room> = (room) => {
  if (!room) {
    return <></>;
  }
  const [elems, setElems] = useState();
  const ref = useRef(0);

  useEffect(() => {
    setElems(renderRoomItems(room));
  }, [room]);
  return (
    <>
      <RoomClickBox room={room} />
      {/* {room.name === "" ? 0 : <RoomMesh room={room} points={room.point} />} */}

      {elems}
    </>
  );
};
export default Room;

const RoomMesh: React.FC<RoomMeshProps> = ({ room, points }) => {
  const texture = useLoader(
    THREE.TextureLoader,
    "/models/tex/WoodenPlanks04_2K_BaseColor.png",
  );

  let x_vals = points.map((p: Point) => p.x / 100);
  let y_vals = points.map((p: Point) => p.y / 100);
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
