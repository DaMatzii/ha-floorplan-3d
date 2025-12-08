import React from "react";

export function useColor(_color: string) {
  const [hexValue, setHexValue] = React.useState("");

  React.useMemo(() => {
    const rootStyles = getComputedStyle(document.documentElement);

    const color = rootStyles.getPropertyValue("--color-" + _color).trim();

    setHexValue(color || "Variable Not Found");
  }, [_color]);
  return hexValue;
}
