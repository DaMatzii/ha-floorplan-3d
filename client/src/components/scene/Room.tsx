import React, { useEffect, useRef, useState } from "react";
import { Shape } from "three";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import type { Room } from "@/types/Room";
import Light from "@/utils/Light";

import { useHass } from "@hakit/core";
import { evaluateAction } from "@/utils/EvaluateAction";

import { useView } from "@/context/ViewContext";

import type { ComponentProps } from "@/utils/Components";

import { useHome } from "@/context/HomeContext";
import { renderEntities } from "@/utils/Parser";

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
    let room = building.rooms.find((room) => room.id === id);
    evaluateAction(room[actionType], callService, {
      "more-info": () => {
        setFocusedItem({
          type: "room",
          id: id,
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
  const { home, currentRoom } = useHome();
  const [isSelected, setIsSelected] = React.useState(false);
  const roomConfig = building.rooms.find((b) => b.id === id);
  const [entityElems, setEntityElems] = useState([]);

  const { editorMode } = useView();

  let rooms = [];
  for (let i = 0; i < home.buildings.length; i++) {
    const building = home.buildings[i];
    rooms.push(...building.floorplan?.room);
  }

  useEffect(() => {
    let room = rooms.findIndex(
      (room) => room.id === id || room.id === (roomConfig?.hassId ?? -1),
    );

    console.log("EDITORMODE: ", editorMode);
    if (room === currentRoom || editorMode) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [currentRoom]);

  const middlePoint: Point = React.useMemo(() => {
    // console.log(room);
    let x_vals = point.map((p: Point) => p.x / 100);
    let y_vals = point.map((p: Point) => p.y / 100);
    let min_x = Math.min(...x_vals);
    let max_x = Math.max(...x_vals);
    let min_y = Math.min(...y_vals);
    let max_y = Math.max(...y_vals);
    let width = max_x - min_x;
    let height = max_y - min_y;
    let center_x = min_x + width / 2;
    let center_y = min_y + height / 2;
    return {
      x: center_x,
      y: center_y,
    };
  }, []);
  useEffect(() => {
    if (roomConfig === undefined) {
      return;
    }
    setEntityElems(renderEntities(roomConfig.entities, building));
  }, []);
  return (
    <>
      <RoomClickBox id={id} points={point} building={building} />

      <RoomMesh points={point} />

      {isSelected ? (
        <>
          {/* <Light */}
          {/*   type="point" */}
          {/*   helper */}
          {/*   size={0.5} */}
          {/*   DebugColor="red" */}
          {/*   position={[middlePoint.x, 1, middlePoint.y]} */}
          {/*   intensity={10} */}
          {/*   distance={3} */}
          {/*   color="#f4fffa" */}
          {/*   // decay={10} */}
          {/* /> */}

          {/* {entityElems.map((Elem, index) => { */}
          {/* <Elem />; */}
          {/* })} */}
          {entityElems}
        </>
      ) : (
        0
      )}
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
        <meshStandardMaterial color="#3d3d3d" side={THREE.BackSide} />
      </mesh>
    </>
  );
};
