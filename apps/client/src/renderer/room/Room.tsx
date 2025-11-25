import React, { useEffect, useRef, useState } from "react";
import { Shape } from "three";
import * as THREE from "three";
import { useRoom } from "@/hooks/";
import { RoomClickBox } from "./RoomClickBox";
import { renderComponent } from "@/renderer/Components";
// import type { Component } from "@/renderer/Components";
import { useCurrentRoom } from "@/hooks";
import { Html } from "@react-three/drei";

//TODO: MOVE TYPES
type Point = { x: number; y: number };
interface RoomMeshProps {
  points: Point[];
}

interface RoomProps {
  id: any;
  point: any;
  building: any;
  alias: string;
}

const Room: React.FC<RoomProps> = ({ id, point, building }) => {
  const [isSelected, setIsSelected] = React.useState(true);
  const room = useRoom(id);
  const [entityElems, setEntityElems] = useState([]);
  const { currentRoom } = useCurrentRoom();
  const [copied, setCopied] = useState(false);

  function render() {
    if (!room?.entities) return;

    let componentsToRender = [];
    room?.entities.map((entity, index) => {
      const Comp = renderComponent(entity?.type);
      if (Comp) {
        componentsToRender.push(
          <Comp key={entity?.type + "-" + index} {...entity} />,
        );
      }
    });
    return componentsToRender;
  }

  useEffect(() => {
    if (room?.id === (currentRoom ?? 0)) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [currentRoom]);

  useEffect(() => {
    if (room === undefined) {
      return;
    }
    setEntityElems(render());
    console.log("re render triggered");
  }, [building]);

  const center = React.useMemo(() => {
    const x_vals = point.map((p) => p.x / 100);
    const y_vals = point.map((p) => p.y / 100);
    const points_for = x_vals.map((x, i) => new THREE.Vector3(x, y_vals[i], 0));

    const box = new THREE.Box3();
    points_for.forEach((point) => box.expandByPoint(point));

    const center = box.getCenter(new THREE.Vector3());
    return center;
  }, [point]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <>
      <Html
        position={[center.x, 0, center.y]}
        rotation={[-Math.PI / 2, 0, 0]}
        distanceFactor={1}
        transform
      >
        <button
          onClick={handleCopy}
          className="w-300 h-60 text-white text-[80px]  group"
        >
          <p>
            <span className="text-[80px] font-bold">{room.alias}</span>
            <span className="text-[60px] text-red-600 ml-5">
              Errors: {Math.round(Math.random() * 100)}
            </span>
          </p>

          <h1 className="text-[60px]">{id}</h1>

          <span
            className={`flex absolute -top-20 left-1/2 -translate-x-1/2 px-4 py-8 rounded-xl w-90 h-20
          bg-light text-text transition-opacity text-[50px] items-center justify-center border-border border-4
          ${copied ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          >
            {copied ? "Copied!" : "Click to copy"}
          </span>
        </button>
      </Html>
      <RoomClickBox id={id} points={point} />
      <RoomMesh points={point} />
      {isSelected ? <>{entityElems}</> : 0}
    </>
  );
};

const RoomMesh: React.FC<RoomMeshProps> = ({ points }) => {
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

    return [geometry, undefined];
  }, [points]);

  return (
    <>
      <mesh geometry={g} rotation={[Math.PI / 2, 0, 0]}>
        {/* <meshBasicMaterial map={tex} side={THREE.BackSide} /> */}
        <meshStandardMaterial color="#000000" side={THREE.BackSide} />
      </mesh>
    </>
  );
};
export default Room;
