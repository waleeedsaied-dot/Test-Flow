import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
};

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20, rotateX: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", stiffness: 350, damping: 30, mass: 0.7, delay: 0.05 },
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15, ease: "easeIn" } },
};

function Modal({ isOpen, onClose, title, children, size = "default" }) {
  const modalWidth = size === "large" ? 700 : size === "small" ? 400 : 500;

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(3px)",
          }}
          onClick={onClose}
        >
          <motion.div
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "relative",
              background: "#1a1a2e",
              border: "1px solid var(--border)",
              borderRadius: 16,
              width: modalWidth,
              maxWidth: "90vw",
              maxHeight: "85vh",
              overflow: "auto",
              boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
              zIndex: 10000,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.2rem 1.5rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div style={{ fontSize: "1rem", fontWeight: 700 }}>{title}</div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  padding: "0 4px",
                  lineHeight: 1,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "white")}
                onMouseLeave={(e) => (e.target.style.color = "var(--muted)")}
              >
                ×
              </button>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.2 }} style={{ padding: "1.5rem" }}>
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;

