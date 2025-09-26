import { Canvas, useFrame, useThree } from "@react-three/fiber";

import {
  OrbitControls,
  PerspectiveCamera,
  useHelper,
  DragControls,
  TransformControls,
} from "@react-three/drei";
import { ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

const items = ["Item 1", "Item 2", "Item 3", "Item 4"];

function Test({ children, title }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <div className=" h-auto">
        <div
          className="bg-gray-800 flex"
          onClick={() => {
            console.log("CLICKED");
            setOpen(!isOpen);
          }}
        >
          <ChevronRight />
          <p>{title}</p>
        </div>
        <div className="pl-4 pt-2 flex flex-col h-auto gap-2">
          {isOpen ? (
            items.map((item, index) => (
              <p key={index} className="bg-gray-800 ">
                {item}
              </p>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default function EditorView() {
  const meshRef = useRef();
  const transformRef = useRef();
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  return (
    <>
      <div className="bg-yellow-500 h-12 w-screen" />
      <div className="grid grid-cols-6 h-screen">
        <div className="col-span-5 ">
          <div className="w-auto h-screen bg-black">
            <Canvas camera={{ position: [10, 10, 10], fov: 60 }}>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />

              {/* Draggable box */}
              <mesh ref={meshRef} position={[0, 0.5, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="orange" />
              </mesh>
              <gridHelper args={[10, 10, "red", "gray"]} />

              {/* Transform Controls */}
              <TransformControls
                ref={transformRef}
                object={meshRef.current}
                mode="translate" // can be "translate", "rotate", "scale"
                showX={true}
                showY={true}
                showZ={true}
                onMouseDown={() => setOrbitEnabled(false)} // disable orbit while dragging
                onMouseUp={() => setOrbitEnabled(true)} // re-enable orbit after drag
              />

              {/* Orbit Controls */}
              <OrbitControls enabled={orbitEnabled} />
            </Canvas>
          </div>

          <div className="w-120 h-120  text-white absolute z-4 top-12 m-4">
            <div className="flex flex-col gap-4">
              <Test title={"lol"}>
                <p>lol</p>
              </Test>
              <Test title={"Lol2"}>
                <p>lol</p>
                <p>lol</p>
              </Test>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
