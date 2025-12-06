import { createPortal } from "react-dom";

export function useModal() {
  function openModal() {
    // createPortal(
    //   <>
    //     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white h-[75vw] w-[60vw] z-100" />
    //     <div className="fixed inset-0 bg-black/50 z-40"></div>
    //   </>,
    //   document.body,
    // );
  }

  return { openModal };
}
