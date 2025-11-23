import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export function useCurrentRoom() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentRoom, setView] = useState(searchParams.get("id") || "");

  useEffect(() => {
    setView(searchParams.get("id") || "");
  }, [searchParams]);

  function setCurrentRoom(id) {
    navigate("?id=" + id);
  }

  return {
    currentRoom,
    setCurrentRoom,
  };
}
