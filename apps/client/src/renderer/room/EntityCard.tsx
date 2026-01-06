import { tv } from "tailwind-variants";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { useEntity } from "@hakit/core";
import type { EntityName } from "@hakit/core";
import { useEvaluateAction } from "@/utils/EvaluateAction";
import { useClickAction } from "@/hooks/useClickAction";
import { IDeviceCard, IAction } from "@/types";

const default_action = (entity_id) => {
  return {
    action: "call-service",
    service: "light.toggle",
    target: {
      entity_id: entity_id,
    },
  } as IAction;
};

const card = tv({
  base: "flex pl-2 flex-start bg-normal rounded-xl border-1 border-border shadow-md shadow-[hsl(0,0%,10%)]",
  variants: {
    size: {
      sm: "row-span-1 items-center",
      md: "flex-col row-span-2 pt-2",
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

function Icon({ entity, ...clickHandlers }: any) {
  const isOn = entity.state.toLowerCase() === "on";
  const iconVariants = {
    on: { color: "#fbbf24", scale: 1, opacity: 1 },
    off: { color: "#9ca3af", scale: 1, opacity: 0.8 },
  };

  return (
    <motion.div
      className="  w-12 h-12 items-center flex justify-center flex-shrink-0"
      initial="off"
      animate={isOn ? "on" : "off"}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      variants={iconVariants}
      transition={{
        duration: 0.4,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
      }}
      {...clickHandlers}
    >
      <Lightbulb className={`stroke-1`} size={24} />
    </motion.div>
  );
}

interface EntityCardProps
  extends React.HTMLAttributes<HTMLDivElement>, IDeviceCard {}

interface WideDeviceCardProps {
  entity: any;
  brightness: number;
  brightnessPercent: string;
}

const WideDeviceCard: React.FC<WideDeviceCardProps> = ({
  entity,
  brightness,
  brightnessPercent,
  ...clickHandlers
}) => {
  const totalDots = 18;
  const activeDots = Math.ceil((brightness / 100) * totalDots);

  return (
    <div className="col-span-2 mt-2 flex h-12 min-h-0 w-auto items-center text-text dark:text-gray-100">
      <div className="bg-normal border-border border rounded-xl">
        <Icon entity={entity} {...clickHandlers} />
      </div>

      <div className="ml-3 flex h-12 flex-1 flex-col justify-center">
        <div className="flex w-full items-center justify-between">
          <h1 className="truncate text-sm font-medium">
            {entity.attributes.friendly_name || "Unknown Light"}
          </h1>
          <p className="text-sm font-light text-gray-500">
            {brightnessPercent}
          </p>
        </div>

        <div className="mt-2 flex gap-1">
          {Array.from({ length: totalDots }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                index < activeDots
                  ? "bg-[#fbbf24] opacity-100"
                  : "bg-gray-600 opacity-30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

//TODO: implement alias for this, and then for switches on off
export function DeviceCard({
  size,
  entity_id,
  tap_action,
  double_tap_action,
  hold_action,
}: EntityCardProps) {
  const { evaluateAction } = useEvaluateAction();

  const clickHandlers = useClickAction({
    onSingleClick: () => console.log("single"),
    // evaluateAction(tap_action ?? default_action(entity_id)),
    onDoubleClick: () => {
      evaluateAction(double_tap_action);
    },
    onHold: () => console.log("lol"),
    // evaluateAction(hold_action),
  });

  const entity = useEntity(entity_id as EntityName);

  const isOn = entity.state.toLowerCase() === "on";
  const brightness = entity.attributes.brightness || 0;
  const brightnessPercent = isOn
    ? Math.round((brightness / 255) * 100) + "%"
    : "Off";
  const friendly_name = (entity as any).attributes.friendly_name;

  if (size == "wide") {
    return (
      <WideDeviceCard
        entity={entity}
        brightness={brightness}
        brightnessPercent={brightnessPercent}
        {...clickHandlers}
      />
    );
  }

  return (
    <motion.div className={card({ size })} {...clickHandlers}>
      <div className="bg-[hsl(0,0%,10%)] rounded-full w-12 h-12 ">
        <Icon entity={entity} />
      </div>

      <div className={text({ size })}>
        <p className="truncate overflow-hidden font-medium text-sm text-[hsl(0,0%,95%)]  whitespace-nowrap">
          {friendly_name}
        </p>
        <p className="text-xs font-normal text-[hsl(0,0%,70%)] ">
          {brightnessPercent}
        </p>
      </div>
    </motion.div>
  );
}
