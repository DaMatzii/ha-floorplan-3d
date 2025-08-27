import SliderTest from "./SliderTest";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function TestView() {
  // const [currentIndex, setCurrentIndex] = useState(0);

  const y = useMotionValue(300);

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
            bottom: 750,
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
        <div className="bottom-0 absolute z-10">
          <div className="w-screen h-16 bg-yellow-800 z-5" />
        </div>
      </div>
      ;
    </>
  );
}
