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
  const lastTap = useRef(0);
  const singleTimer = useRef(null);
  const holdTimer = useRef(null);
  const didHold = useRef(false);

  const onPointerDown = useCallback(() => {
    didHold.current = false;

    holdTimer.current = setTimeout(() => {
      didHold.current = true;
      onHold?.();
    }, holdMs);
  }, [onHold, holdMs]);

  const onPointerUp = useCallback(() => {
    clearTimeout(holdTimer.current);

    if (didHold.current) return;

    const now = Date.now();
    const delta = now - lastTap.current;

    if (delta > 0 && delta < ms) {
      clearTimeout(singleTimer.current);
      lastTap.current = 0;
      onDoubleClick?.();
    } else {
      lastTap.current = now;
      singleTimer.current = setTimeout(() => {
        onSingleClick?.();
      }, ms);
    }
  }, [onSingleClick, onDoubleClick, ms]);

  const onPointerLeave = useCallback(() => {
    clearTimeout(holdTimer.current);
  }, []);

  return {
    onPointerDown,
    onPointerUp,
    onPointerCancel: onPointerLeave,
    onPointerLeave,
  };
};
