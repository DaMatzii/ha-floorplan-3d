import { motion } from "framer-motion";
export default function Test() {
  return (
    <>
      <div className="w-screen h-screen bg-[hsl(0,0%,0%)] flex justify-center items-center ">
        <div className="w-80  h-42 bg-[hsl(0,0%,5%)] rounded-xl border-1 border-[hsl(0,0%,30%)] shadow-md shadow-[hsl(0,0%,10%)]">
          <h1 className="text-[hsl(0,0%,95%)] pt-4 pl-4 w-max text-xl ">
            Sharp
          </h1>
          <h1 className="text-[hsl(0,0%,70%)] pl-4 text-sm">70% header</h1>
          <div className="w-32 h-10 bg-[hsl(0,0%,10%)] text-[hsl(0,0%,90%)] mt-13 ml-4 text-sm font-semibold flex items-center justify-center rounded-xl self-end border-1 border-[hsl(0,0%,30%)]">
            Some action
          </div>
        </div>
      </div>
    </>
  );
}
