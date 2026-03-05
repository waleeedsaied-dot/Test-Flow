import { useState } from "react";
import Modal from "./Modal";

function StartRecordingModal({ isOpen, onClose, onSubmit }) {
  const [recording, setRecording] = useState(false);
  const [steps, setSteps] = useState([]);

  const handleStart = () => {
    setRecording(true);
    setSteps(["Page loaded: /dashboard"]);
    const interval = setInterval(() => {
      setSteps((prev) => (prev.length < 5 ? [...prev, ["Clicked element #login-btn", "Typed in input#email", "Clicked button.submit", "Navigated to /home"][prev.length - 1]] : prev));
    }, 1200);
    setTimeout(() => clearInterval(interval), 6000);
  };

  const handleStop = () => {
    setRecording(false);
    onSubmit(steps);
    setSteps([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={recording ? undefined : onClose} title="🎥 Record New Test">
      <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "center", padding: "1rem 0" }}>
        {recording ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--pink)", animation: "pulse 1s infinite" }} />
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--pink)" }}>Recording in progress...</div>
            </div>
            <div style={{ textAlign: "left", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 12, maxHeight: 140, overflowY: "auto" }}>
              <div style={{ fontSize: ".7rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600 }}>CAPTURED STEPS</div>
              {steps.map((s, i) => (
                <div key={i} style={{ fontSize: ".78rem", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "var(--green)" }}>
                  ✓ {s}
                </div>
              ))}
            </div>
            <button onClick={handleStop} className="btn btn-primary" style={{ width: "100%", background: "rgba(255,0,153,0.2)", border: "1px solid var(--pink)", color: "var(--pink)" }}>
              ⏹️ Stop Recording ({steps.length} steps)
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: "4rem" }}>🎥</div>
            <div style={{ fontSize: "1rem", fontWeight: 600 }}>Ready to record</div>
            <div style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: 8 }}>Your actions will be captured as an automated test</div>
            <div style={{ textAlign: "left", fontSize: ".75rem", color: "var(--muted)", background: "rgba(255,255,255,0.04)", padding: 12, borderRadius: 8 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Recording will capture:</div>
              <div>✓ Page navigation</div>
              <div>✓ Clicks and form inputs</div>
              <div>✓ Assertions on elements</div>
              <div>✓ Waits for dynamic content</div>
            </div>
            <button onClick={handleStart} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>
              ▶️ Start Recording
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}

export default StartRecordingModal;

