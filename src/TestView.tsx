import SliderTest from "./SliderTest";

export default function TestView() {
  return (
    <>
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Top area */}
        <div className="flex-1 flex items-center justify-center  z-0">
          <div
            className="canvas-container w-screen h-screen"
            style={{
              backgroundColor: "#000000",
            }}
          ></div>
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg p-4 z-30"
          style={{ height: `${0.4 * 100}vh` }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Bottom Sheet</h2>
          </div>
          <SliderTest />
        </div>
      </div>
      ;
    </>
  );
}
