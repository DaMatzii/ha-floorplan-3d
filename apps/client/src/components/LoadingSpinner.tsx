import { motion } from "framer-motion";

export function LoadingCircleSpinner() {
  return (
    <div className="w-screen h-screen bg-dark flex items-center justify-center flex-col">
      <motion.div
        className="spinner  w-20 h-20 rounded-full border-b-text border-2 border-light"
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
