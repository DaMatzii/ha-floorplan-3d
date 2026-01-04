import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export function useCurrentRoom() {
  const [searchParams, setSearchParams] = useSearchParams();

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
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("id", id);
      next.set("preview", "false");
      return next;
    });
  }
  function setIsPreview(preview: boolean) {
    setSearchParams((prev) => {
      console.log(prev);
      const next = new URLSearchParams(prev);
      next.set("preview", preview ? "true" : "false");
      return next;
    });
  }

  return {
    currentRoom,
    setCurrentRoom,
    isPreview,
    setIsPreview,
  };
}
