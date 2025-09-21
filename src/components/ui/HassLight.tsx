import { useHome } from "@/context/HomeContext";
import { useEntity } from "@hakit/core";

export default function HassLight() {
  const { focusedItem } = useHome();
  const entity = useEntity(focusedItem.hassID);

  return (
    <>
      <p>focusedEntity</p>
      <p>{focusedItem.hassID}</p>
      <button
        onClick={() => {
          entity.service.toggle();
        }}
      >
        CLICK ME
      </button>
    </>
  );
}
