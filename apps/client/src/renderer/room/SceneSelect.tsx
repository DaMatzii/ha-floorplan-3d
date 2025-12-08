import { DynamicIcon } from "lucide-react/dynamic";
import { tv } from "tailwind-variants";

import { motion } from "framer-motion";
import { useEvaluateAction } from "@/utils/EvaluateAction";

const card = tv({
  slots: {
    iconc:
      "w-10  h-10 rounded-full flex justify-center items-center text-text border-[hsl(0,0%,30%)] border-0",
    island:
      "h-18 w-[90vw] bg-[hsl(0,0%,5%)]  flex justify-evenly mt-4 rounded-xl shadow-md gap-10 \
      items-center border-1 border-[hsl(0,0%,30%)] shadow-[hsl(0,0%,10%)] text-",
    full_icon: "flex text-text flex-col items-center text-xs",
  },
});

const { iconc, island, full_icon } = card();

interface Icon {
  icon: string;
  tap_action: any;
  title: string;
}
interface SceneSelectProps {
  scenes: any[];
}

function Icon({ icon, tap_action, title }: Icon) {
  // const { _evaluateAction } = useEvaluateAction();

  function handle_click() {
    // _evaluateAction(tap_action, {}, {});
  }
  return (
    <>
      <div className={full_icon()}>
        <div className={iconc()} onClick={handle_click}>
          <DynamicIcon name={icon as any} size={26} className="stroke-1 " />
        </div>

        <p className="mt-[-4px]">{title}</p>
      </div>
    </>
  );
}

export default function SceneSelect({ scenes }: SceneSelectProps) {
  return (
    <>
      <motion.div className="w-full h-32 flex justify-center">
        <div className={island()}>
          {scenes.map((scene, index) => {
            return <Icon key={index} {...scene} />;
          })}
        </div>
      </motion.div>
    </>
  );
}
