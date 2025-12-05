import React, { useEffect, useMemo, useState } from "react";
import { Shape } from "three";
import * as THREE from "three";
import { useRoom } from "@/hooks/";
import { useConfigStore } from "@/store/";
import { RoomClickBox } from "./RoomClickBox";
import { renderComponent } from "@/renderer/Components";
import { useCurrentRoom } from "@/hooks";
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
