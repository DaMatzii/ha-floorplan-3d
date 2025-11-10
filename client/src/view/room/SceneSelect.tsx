import { Lightbulb } from "lucide-react";
import {tv} from "tailwind-variants"

const icon = tv({
	base: 'w-12  h-12 rounded-full flex justify-center items-center bg-[hsl(0,0%,10%)] text-[hsl(0,0%,90%)] border-[hsl(0,0%,30%)] border-1'
})

function Icon() {
  return (
    <>
      <div className={icon()}>
        <Lightbulb className={`font-bold`} size={24} strokeWidth={2.5} />
      </div>
    </>
  ;
}
export default function SceneSelect() {
  return (
    <>
      <div className=" h-18 w-[90vw] bg-[hsl(0,0%,5%)]  flex justify-evenly mt-4 rounded-xl shadow-md gap-10 items-center border-1 border-[hsl(0,0%,30%)] shadow-[hsl(0,0%,10%)] ">
        {scenes.map((scene) => {
          console.log(scene);
          return <SceneIcon />;
        })}
      </div>
    </>
  );
}
