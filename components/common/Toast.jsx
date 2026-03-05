import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const toastVariants = {
  hidden: { opacity: 0, x: 100, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 25, mass: 0.8 },
  },
  exit: { opacity: 0, x: 100, scale: 0.9, transition: { duration: 0.2, ease: "easeIn" } },
};

function Toast({ msg, onDone, type = "info" }) {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isPaused) return;
    const duration = 3000;
    const interval = 50;
    const decrement = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onDone();
          return 0;
        }
        return prev - decrement;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [onDone, isPaused]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return { border: "1px solid #00FF85", glow: "0 0 30px rgba(0,255,133,0.4)", icon: "✅", progressColor: "#00FF85" };
      case "error":
        return { border: "1px solid #FF0055", glow: "0 0 30px rgba(255,0,85,0.4)", icon: "❌", progressColor: "#FF0055" };
      case "warning":
        return { border: "1px solid #FFC800", glow: "0 0 30px rgba(255,200,0,0.4)", icon: "⚠️", progressColor: "#FFC800" };
      default:
        return { border: "1px solid #FF0099", glow: "0 0 30px rgba(255,0,153,0.4)", icon: "ℹ️", progressColor: "#FF0099" };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <motion.div
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        minWidth: 300,
        padding: "14px 18px",
        borderRadius: 12,
        background: "rgba(4,4,10,0.95)",
        border: typeStyles.border,
        color: "white",
        boxShadow: typeStyles.glow,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ fontSize: "1.2rem" }}>{typeStyles.icon}</span>
        <div style={{ flex: 1 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
            {msg}
          </motion.div>
        </div>
        <button
          onClick={onDone}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "1.1rem", padding: 0, lineHeight: 1 }}
        >
          ×
        </button>
      </div>
      <motion.div
        style={{ position: "absolute", bottom: 0, left: 0, height: 3, background: typeStyles.progressColor, borderRadius: "0 0 0 12px" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.05, ease: "linear" }}
      />
    </motion.div>
  );
}

export default Toast;

