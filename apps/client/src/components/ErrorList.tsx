import React from "react";
import Modal from "@/components/Modal";
import { useErrorStore } from "@/store/ErrorStore";
import type { Error } from "@/store/ErrorStore";

interface ErrorDisplay {
  error: Error;
}

function ErrorDisplay({ error }: ErrorDisplay) {
  return (
    <>
      <div className="w-full h-auto text-text">
        <h1 className="font-bold text-sm">{error?.title}</h1>
        <p className="font-light text-xs">{error?.description ?? ""}</p>
      </div>
    </>
  );
}

function Divider() {
  return <div className="w-auto border-border rounded-sm border-1 mt-2"></div>;
}

export default function ErrorList({ isOpen, closeModal }) {
  const { errors } = useErrorStore();

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div className="w-auto h-auto flex flex-col">
        <h1 className="text-2xl text-red-500">{errors.length} Error(s)</h1>
        <Divider />
        <div className="flex mt-2 flex-col gap-1 pl-1">
          {errors.map((item, index) => {
            console.log(item);
            return <ErrorDisplay key={index} error={item} />;
          })}
        </div>
      </div>
    </Modal>
  );
}
