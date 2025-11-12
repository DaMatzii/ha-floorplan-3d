import React, { useEffect, useRef, useState } from "react";
import { Shape } from "three";
import * as THREE from "three";
import { useHass } from "@hakit/core";
import { useEvaluateAction } from "@/utils/EvaluateAction";

import { useBottomSheet } from "@/context/HomeContext";

import { useHome } from "@/context/HomeContext";
import { useRoom } from "@/hooks/";
import { BottomSheetType } from "@/types/";

export function RoomClickBox({ id, points }: any) {
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
  const [opacity, setOpacity] = useState(0);

  const { callService } = useHass();
  const { _evaluateAction } = useEvaluateAction();

  const { setFocusedItem, home } = useHome();
  const roomConfig = useRoom(id);
  const { openBottomSheet } = useBottomSheet();

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
    _evaluateAction(roomConfig[actionType]);
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
