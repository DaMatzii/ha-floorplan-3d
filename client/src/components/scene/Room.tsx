import React, { useEffect, useRef, useState } from "react";
import { Shape } from "three";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import type { Room } from "@/types/Room";

import { useHass } from "@hakit/core";
import { evaluateAction } from "@/utils/EvaluateAction";

import type { ComponentProps } from "@/utils/Components";

import { useHome } from "@/context/HomeContext";

type Point = { x: number; y: number };
interface RoomMeshProps {
  points: Point[];
  color: string;
}

function RoomClickBox({ id, points, building }: any) {
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

  const { callService } = useHass();

  const { setFocusedItem, home } = useHome();
  const randomColor = React.useMemo(() => {
    const idx = Math.floor(Math.random() * colors.length);
    return colors[idx];
  }, []);

  const geometry = React.useMemo(() => {
    const shape = new Shape();
    shape.moveTo(points[0].x / 100, points[0].y / 100);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(
        (points[i].x as number) / 100,
        (points[i].y as number) / 100,
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

  const clickTimeout = React.useRef(null);

  function handleTapAction(actionType) {
    let room = building.rooms.find((room) => room.id === id) || { hassId: id };

    evaluateAction(room[actionType], callService, {
      "more-info": () => {
        setFocusedItem({
          type: "room",
          hassID: room.hassId,
        });
      },
    });
  }

  const handleClick = (e) => {
    e.stopPropagation();
    if (e.detail === 1) {
      clickTimeout.current = setTimeout(() => {
        handleTapAction("tap_action");
      }, 150);
    } else if (e.detail === 2) {
      clearTimeout(clickTimeout.current);

      handleTapAction("double_tap_action");
    }
  };

  return (
    <>
      <mesh
        geometry={geometry}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(e) => handleClick(e)}
      >
        <meshBasicMaterial
          color={randomColor}
          transparent={true}
          opacity={opacity}
          alphaTest={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}
interface RoomProps extends ComponentProps {
  id: any;
  points: any;
  building: any;
}

const Room: React.FC<RoomProps> = ({ id, point, building }) => {
  // console.log(room);
  // if (!room) {
  // return <></>;
  // }
  // console.log(room);

  return (
    <>
      <RoomClickBox id={id} points={point} building={building} />
      {/* {room.name === "" ? 0 : <RoomMesh room={room} points={room.point} />} */}
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
