import SliderTest from "./SliderTest";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useHome } from "./HomeContext";
import { useState, useEffect } from "react";
import { parseHome } from "./Parser";

export default function TestView() {
  // const [currentIndex, setCurrentIndex] = useState(0);
  const { home, setHome } = useHome();
  const [currentIndex, setCurrentIndex] = useState(0);

  const y = useMotionValue(300);

  // console.log(mainCamera);

  useEffect(() => {
    const fetchXML = async () => {
      try {
        // const response = await fetch("http://localhost:5173/house.xml");
        fetch("/house.xml")
          .then((response) => response.text())
          .then((str) => {
            setHome(parseHome(str));
          });
      } catch (error) {
        console.error("Error fetching XML:", error);
      }
    };
    fetchXML();
  }, []);

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-100 z-1">
        {/* Top area */}
        <div className="flex-1 flex items-center justify-center  z-0">
          <div
            className="canvas-container w-screen h-screen"
            style={{
              backgroundColor: "#000000",
            }}
          ></div>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Bottom Sheet</h2>
        </div>
        <motion.div
          drag="y"
          dragDirectionLock
          onDragEnd={() => {}}
          onDrag={(drag) => {}}
          dragConstraints={{
            top: 400,
            bottom: 600,
          }}
          dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
          dragElastic={0.2}
          style={{ y }}
          whileDrag={{ cursor: "grabbing" }}
          className="
            fixed
            bottom-0
            left-0
            right-0
            bg-white
            rounded-t-2xl shadow-lg p-4 z-5
            h-screen
	    "
        >
          {y.get() === 750 ? (
            ""
          ) : (
            <div className="bottom">
              <h1>slider</h1>
            </div>
          )}
        </motion.div>
        <div className="bottom-0 h-12 left-0 w-screen absolute z-10">
          {/* <p>Pro</p> */}
          {home !== undefined ? (
            <SliderTest setCurrentIndex={setCurrentIndex} rooms={home.room} />
          ) : (
            0
          )}
        </div>
      </div>
      ;
    </>
  );
}
