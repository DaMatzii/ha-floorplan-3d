import React, { useMemo } from "react";
import { Shape } from "three";
import * as THREE from "three";
import { useRoom } from "@/hooks/";
import { useConfigStore } from "@/store/";
import { RoomClickBox } from "./RoomClickBox";
import { renderComponent, getComponent } from "@/renderer/Components";
import { useCurrentRoom } from "@/hooks";
import { Point } from "@/types";
import ErrorBoundary from "@/utils/3DErrorBoundary";
import { useErrorStore, ErrorType } from "@/store/ErrorStore";
import { useColor } from "@/utils/useColor";

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
  const { currentRoom, isPreview } = useCurrentRoom();
  const editorMode = useConfigStore((state) => state.editorMode);
  const { errors, addError } = useErrorStore();

  const comps = useMemo(() => {
    if (!room?.entities) return null;

    const isRoomFocused = editorMode || room?.id === (currentRoom ?? 0);
    const toRender = isRoomFocused
      ? room.entities
      : room.entities.filter((entity) => {
          if (getComponent(entity?.type).visibleOnPreview && isPreview)
            return entity;
        });

    return toRender.map((entity, index) => {
      const Comp = renderComponent(entity?.type);

      function onError(error) {
        addError({
          type: ErrorType.RECOVERABLE,
          title: String(error),
          description: 'On room "' + (room.alias ?? id) + '"',
        });
      }

      return (
        <ErrorBoundary key={index} onError={onError}>
          <Comp
            key={entity?.type + "-" + index}
            {...entity}
            room={room}
            isRoomFocused={isRoomFocused}
          />
          ;
        </ErrorBoundary>
      );
    });
  }, [id, room]);

  return (
    <>
      {!editorMode && <RoomClickBox id={id} points={point} />}
      <RoomMesh points={point} />
      <>{comps}</>
    </>
  );
};

const RoomMesh: React.FC<RoomMeshProps> = ({ points }) => {
  const color = useColor("floor");
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
        <meshStandardMaterial color={color} side={THREE.BackSide} />
      </mesh>
    </>
  );
};
export default Room;
