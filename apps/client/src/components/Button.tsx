import React, { useState } from "react";
import { motion } from "framer-motion";

function Spinner() {
  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col">
      <motion.div
        className="spinner  w-10 h-10 rounded-full border-b-text border-2 border-light"
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.9,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

export const ProgressButton = ({
  onClick,
  children = "click",
  loading,
  containerVariants,
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      variants={containerVariants}
      animate={loading ? "loading" : "button"}
      initial="button"
      className="bg-normal items-center flex justify-center overflow-hidden border-1 border-border"
    >
      <motion.span
        animate={loading ? "loading" : "button"}
        style={{ position: "relative", zIndex: 10 }}
      >
        {loading ? <Spinner /> : children}
      </motion.span>
    </motion.button>
  );
};

// // --- Example Usage ---
//
// export const Button = () => (
//   <div
//     style={{ padding: "50px", display: "flex", justifyContent: "center" }}
//     className="bg-black w-screen h-screen"
//   >
//     <ProgressButton onClick={() => console.log("Task started!")}>
//       Deploy Application
//     </ProgressButton>
//   </div>
// );
