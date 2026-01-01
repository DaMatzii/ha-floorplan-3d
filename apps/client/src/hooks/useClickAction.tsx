import { useRef, useCallback } from "react";
import { IAction } from "@/types";

export const DefaultAction = (entity_id: string) => {
  return {
    action: "call-service",
    service: "light.toggle",
    target: {
      entity_id: entity_id,
    },
  } as IAction;
};

//fix holding plesae
export const useClickAction = ({
  onSingleClick,
  onDoubleClick,
  onHold,
  ms = 300,
  holdMs = 600,
}) => {
  const clickTimer = useRef(null);
  const holdTimer = useRef(null);
  const isHoldAction = useRef(false);

  const handleMouseDown = useCallback(() => {
    isHoldAction.current = false;
    holdTimer.current = setTimeout(() => {
      isHoldAction.current = true;
      if (onHold) onHold();
    }, holdMs);
  }, [onHold, holdMs]);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (isHoldAction.current) {
        clearTimeout(holdTimer.current);
        return;
      }

      clearTimeout(holdTimer.current);

      if (e.detail === 1) {
        clickTimer.current = setTimeout(() => {
          if (onSingleClick) onSingleClick();
        }, ms);
      } else if (e.detail === 2) {
        clearTimeout(clickTimer.current);
        if (onDoubleClick) onDoubleClick();
      }
    },
    [onSingleClick, onDoubleClick, ms],
  );

  return {
    onMouseDown: handleMouseDown,
    onClick: handleClick,
    onTouchStart: handleMouseDown,
  };
};
