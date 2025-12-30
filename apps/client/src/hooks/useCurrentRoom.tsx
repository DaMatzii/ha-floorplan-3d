import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export function useCurrentRoom() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentRoom, setView] = useState(searchParams.get("id") || "");
  const [isPreview, setPreview] = useState<boolean>(
    searchParams.get("preview") === "true" || false,
  );

  useEffect(() => {
    setView(searchParams.get("id") || "");
  }, [searchParams]);

  useEffect(() => {
    setPreview(searchParams.get("preview") === "true" || false);
  }, [searchParams]);

  function setCurrentRoom(id) {
    navigate("?id=" + id);
  }
  function setIsPreview(is: boolean) {
    navigate("?preview=" + is);
  }

  return {
    currentRoom,
    setCurrentRoom,
    isPreview,
    setIsPreview,
  };
}
