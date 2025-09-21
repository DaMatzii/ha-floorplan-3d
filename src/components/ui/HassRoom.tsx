import { useHome } from "@/context/HomeContext";
import { useEntity } from "@hakit/core";

export default function HassRoom() {
  const { focusedItem } = useHome();

  return (
    <>
      <p>Focused room</p>
      <p>{focusedItem.hassID}</p>
      <button onClick={() => {}}>CLICK ME</button>
    </>
  );
}
