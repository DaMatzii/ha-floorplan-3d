import { useHome } from "@/context/HomeContext";
import { useEntity } from "@hakit/core";

import { useBottomSheet } from "@/context/BottomSheetContext";

import { useEffect, useState, useRef } from "react";

export default function HassRoom() {
  const { focusedItem } = useHome();

  const { setIsOpen, setOpenY } = useBottomSheet();

  useEffect(() => {
    let moveTo = window.innerHeight * 0.25;

    setOpenY(moveTo);
    setIsOpen(true);
  }, [focusedItem]);

  return (
    <>
      <p>Focused room</p>
      <p>{focusedItem.hassID}</p>
      <button onClick={() => {}}>CLICK ME</button>
    </>
  );
}
