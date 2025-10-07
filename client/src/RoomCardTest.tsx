function LightCard({ rowSpan }) {
  return (
    <>
      <div
        className={`w-full h-full bg-yellow-500 flex p-2  rounded-xl
${rowSpan === 1 ? "" : "flex-col justify-between"}
		`}
      >
        <div className="w-12 h-12 rounded-full bg-black"></div>
        <div className="ml-2">
          <p>Matias-zone</p>
          <p className="">37%</p>
        </div>
      </div>
    </>
  );
}
export function RoomCard() {
  return (
    <>
      <div className="top-65 p-4 absolute w-screen h-screen">
        <div className="flex justify-between items-center bg-green-500">
          <p>Matiaksen huone</p>
          <div className="flex gap-4">
            <p>lol</p>
            <p>lol2</p>
          </div>
        </div>
        <div className="mt-10 overflow-y-auto h-[100vh] ">
          <div className="grid grid-cols-2  gap-4 auto-rows-[4rem]">
            <div className=" col-span-1 row-span-2">
              <LightCard rowSpan={2} />
            </div>
            <div className=" row-span-1 flex items-center justify-center">
              <LightCard rowSpan={1} />
            </div>
            <div className=" row-span-1 flex items-center justify-center">
              <LightCard rowSpan={1} />
            </div>
            <div className=" bg-yellow-400 col-span-2 row-span-4 flex items-center justify-center">
              4
            </div>
            <div className=" bg-purple-400 col-span-2 row-span-10 justify-center">
              5
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
