import { useHome } from "@/context/HomeContext";
export default function HassLight() {
  const { focusedEntity } = useHome();
  return (
    <>
      <p>focusedEntity</p>
    </>
  );
}
