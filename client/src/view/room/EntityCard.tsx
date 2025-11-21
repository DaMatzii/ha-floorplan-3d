import { tv } from "tailwind-variants";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { useEntity } from "@hakit/core";
import type { EntityName } from "@hakit/core";
import { useEvaluateAction } from "@/utils/EvaluateAction";

const card = tv({
  base: "flex pl-2 flex-start bg-[hsl(0,0%,5%)] rounded-xl border-1 border-[hsl(0,0%,30%)] shadow-md shadow-[hsl(0,0%,10%)]",
  variants: {
    size: {
      sm: "row-span-1 items-center",
      md: "flex-col row-span-2",
    },
  },
});
const text = tv({
  base: "flex-1 min-w-0 pl-2",
  variants: {
    size: {
      sm: "",
      md: "mt-8",
    },
  },
});

function Icon({ entity }: any) {
  return (
    <motion.div
      className=" bg-[hsl(0,0%,10%)] rounded-full w-12 h-12 items-center flex justify-center flex-shrink-0 mt-2"
      animate={{
        rotate: 0,
        color:
          (entity as any).state.toLowerCase() === "on" ? "#fbbf24" : "#9ca3af",
        scale: 1,
        opacity: 1,
      }}
      initial={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.4,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
      }}
    >
      <Lightbulb className={`stroke-1`} size={24} />
    </motion.div>
  );
}
interface TextProps {
  size?: "sm" | "md";
  entity: any;
}

function Text({ size, entity }: TextProps) {
  return (
    <div className={text({ size })}>
      <p className="truncate overflow-hidden font-medium text-sm text-[hsl(0,0%,95%)]  whitespace-nowrap">
        {(entity as any).attributes.friendly_name}
      </p>
      <p className="text-xs font-normal text-[hsl(0,0%,70%)] ">
        {entity.attributes.brightness !== null
          ? Math.floor((entity.attributes.brightness / 255) * 100) + "%"
          : "Off"}
      </p>
    </div>
  );
}
interface EntityCardProps {
  size?: "sm" | "md";
  entity: string;
  action: any;
}

export default function EntityCard({ size, entity, action }: EntityCardProps) {
  const HaEntity = useEntity(entity as EntityName);

  const { _evaluateAction } = useEvaluateAction();

  return (
    <>
      <motion.div
        className={card({ size: size })}
        onClick={() => _evaluateAction(action, {}, {})}
      >
        <Icon entity={HaEntity} />
        <Text size={size} entity={HaEntity} />
      </motion.div>
    </>
  );
}
