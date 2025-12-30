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
    searchParams.set("id", id);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  }
  function setIsPreview(is: boolean) {
    searchParams.set("preview", is ? "true" : "false");
    navigate(`${location.pathname}?${searchParams.toString()}`);
  }

  return {
    currentRoom,
    setCurrentRoom,
    isPreview,
    setIsPreview,
  };
}
