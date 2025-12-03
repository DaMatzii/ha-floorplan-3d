import React, { useEffect, useMemo, useState } from "react";
import { Shape } from "three";
import * as THREE from "three";
import { useRoom } from "@/hooks/";
import { useConfigStore } from "@/store/";
import { RoomClickBox } from "./RoomClickBox";
import { renderComponent } from "@/renderer/Components";
import { useCurrentRoom } from "@/hooks";
import { Html } from "@react-three/drei";
import { Point } from "@/types";

interface RoomMeshProps {
  points: Point[];
}

interface RoomProps {
  id: any;
  point: any;
  building: any;
  alias: string;
}

interface EditorDisplayProps {
  center: Point;
  room: any;
  id: string;
}

function EditorDisplay({ center, room, id }: EditorDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
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
  );
}

const Room: React.FC<RoomProps> = ({ id, point, building }) => {
  const room = useRoom(id);
  const { currentRoom } = useCurrentRoom();
  const editorMode = useConfigStore((state) => state.editorMode);

  const comps = useMemo(() => {
    if (!room?.entities) return null;

    return room?.entities.map((entity, index) => {
      const Comp = renderComponent(entity?.type);

      return <Comp key={entity?.type + "-" + index} {...entity} />;
    });
  }, [id, room]);

  return (
    <>
      {/* {editorMode && <EditorDisplay id={id} center={center} room={room} />} */}
      {!editorMode && <RoomClickBox id={id} points={point} />}
      <RoomMesh points={point} />
      {(editorMode || room?.id === (currentRoom ?? 0)) && <>{comps}</>}
    </>
  );
};

const RoomMesh: React.FC<RoomMeshProps> = ({ points }) => {
  const [g] = React.useMemo(() => {
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
        <meshStandardMaterial color="#000000" side={THREE.BackSide} />
      </mesh>
    </>
  );
};
export default Room;
