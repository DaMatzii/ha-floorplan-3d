import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import html2canvas from "html2canvas";

export default function TempTest() {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const htmlElement = document.getElementById("textContent");
    html2canvas(htmlElement).then((canvas) => {
      const tex = new THREE.CanvasTexture(canvas);
      setTexture(tex);
    });
  }, []);

  if (!texture) return null;

  return (
    <>
      <div
        id="textContent"
        style={{
          width: "400px",
          padding: "20px",
          background: "lightyellow",
          color: "black",
          fontFamily: "Arial, sans-serif",
          position: "absolute",
          top: "-1000px",
        }}
      >
        <h1>Terve!</h1>
        <p>Tämä on teksti plane-meshin pinnalla.</p>
      </div>

      <mesh ref={meshRef}>
        <planeGeometry args={[4, 3]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}
