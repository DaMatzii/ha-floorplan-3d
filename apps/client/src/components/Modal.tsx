import { FC, ReactNode, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape, false);
    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, [handleEscape]);

  return createPortal(
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="z-[100] bg-normal border-1 border-border rounded-lg shadow-2xl max-w-lg w-[70vh] h-[80vh] flex flex-col transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.getElementById("root"),
  );
};

export default Modal;
