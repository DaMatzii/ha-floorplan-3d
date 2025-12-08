import { AlertTriangle, Settings, ChevronUp, RefreshCcw } from "lucide-react";
import React, { useState } from "react";
import { useErrorStore } from "@/store";
import ErrorList from "@/components/ErrorList";

const ErrorCounter = ({ count, onClick }) => {
  const badgeColor = count > 0 ? "bg-red-600" : "bg-gray-500";
  const iconColor = count > 0 ? "text-red-500" : "text-gray-400";

  return (
    <div
      onClick={onClick}
      className="flex items-center space-x-2 px-3 py-1 rounded-full cursor-default bg-normal"
    >
      <AlertTriangle className={`w-5 h-5 ${iconColor}`} />
      <span
        className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold text-white ${badgeColor}`}
      >
        {count}
      </span>
    </div>
  );
};

const RefreshTime = ({ elapsed }) => {
  return (
    <div className="flex items-center space-x-2  py-1 rounded-full cursor-default bg-normal">
      <RefreshCcw className="w-5 h-5 text-text font-regular" />
      <span
        className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-regular text-text`}
      >
        {elapsed > 10 ? "<10s ago" : elapsed + "s ago"}
      </span>
    </div>
  );
};

const SettingsButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full text-text bg-light ml-5  hover:bg-light hover:text-indigo-600 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label="Settings"
    >
      <Settings className="w-5 h-5" />
    </button>
  );
};

const Toolbar = ({ date }) => {
  const errors = useErrorStore((state) => state.errors);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSettingsClick = () => {
    alert("Settings panel coming soon...");
  };

  return (
    <>
      <ErrorList
        closeModal={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
      />

      <div className="fixed top-5 transform ml-10 z-50">
        <header className="flex items-center space-x-4 p-2 bg-normal backdrop-blur-md rounded-xl shadow-xl border-1 border-border">
          <div className="flex items-center px-2">
            <h1 className="text-lg font-bold text-text tracking-tight ml-1">
              Ha Floorplan 3D
            </h1>
          </div>

          <div className="flex items-center space-x-2 ml-5">
            <ErrorCounter
              count={errors.length}
              onClick={() => setIsModalOpen(!isModalOpen)}
            />
            <RefreshTime elapsed={date} />
            <SettingsButton onClick={handleSettingsClick} />
          </div>
        </header>
      </div>
    </>
  );
};

export default Toolbar;
