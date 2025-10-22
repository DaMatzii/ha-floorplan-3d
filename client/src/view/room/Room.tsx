import React, { useEffect, useRef, useState } from "react";
import { Shape } from "three";
import * as THREE from "three";
import type { Room } from "@/types/Room";
import { useView } from "@/context/ViewContext";
import { useHome } from "@/context/HomeContext";
import { useRoomConfig } from "@/hooks/";
import { RoomClickBox } from "./RoomClickBox";
import { renderComponent } from "@/view/handler/Components";

//TODO: MOVE TYPES
type Point = { x: number; y: number };
interface RoomMeshProps {
  points: Point[];
  color: string;
}

interface RoomProps {
  id: any;
  point: any;
  building: any;
}

const Room: React.FC<RoomProps> = ({ id, point, building }) => {
  const { home, currentRoom } = useHome();
  const [isSelected, setIsSelected] = React.useState(true);
  const room = useRoomConfig(id);
  const [entityElems, setEntityElems] = useState([]);

  const { editorMode } = useView();

  function render() {
    if (!room?.entities) return;

    let componentsToRender = [];
    room?.entities.map((entity, index) => {
      console.log(entity);
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
    if (room?.id === (currentRoom?.id ?? 0) || editorMode) {
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
  }, []);
  return (
    <>
      <RoomClickBox id={id} points={point} />

      <RoomMesh points={point} />

      {isSelected ? <>{entityElems}</> : 0}
    </>
  );
};
export default Room;

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
