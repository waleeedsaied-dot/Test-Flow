import { useState } from "react";
import Modal from "./Modal";

function GenerateTestsModal({ isOpen, onClose, onSubmit }) {
  const [flows, setFlows] = useState([
    { id: 1, name: "Checkout → Payment → Success", selected: true },
    { id: 2, name: "Login → Forgot Password → Reset", selected: false },
    { id: 3, name: "Search → Filter → Sort", selected: true },
  ]);

  const handleSubmit = () => {
    const selected = flows.filter((f) => f.selected).map((f) => f.name);
    onSubmit(selected);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚡ Generate Tests with AI">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>Select user flows to generate automated tests:</div>
        {flows.map((flow) => (
          <label key={flow.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "rgba(255,255,255,0.04)", borderRadius: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={flow.selected}
              onChange={(e) => setFlows(flows.map((f) => (f.id === flow.id ? { ...f, selected: e.target.checked } : f)))}
              style={{ width: 18, height: 18, accentColor: "var(--pink)" }}
            />
            <span>{flow.name}</span>
            {flow.selected && <span className="badge badge-minor" style={{ marginLeft: "auto" }}>Will generate</span>}
          </label>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "rgba(255,0,153,0.08)", borderRadius: 8, border: "1px solid rgba(255,0,153,0.2)" }}>
          <span style={{ fontSize: "1.2rem" }}>🤖</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: ".85rem" }}>AI will generate</div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>{flows.filter((f) => f.selected).length} test cases with Playwright</div>
          </div>
        </div>
        <button onClick={handleSubmit} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>
          ⚡ Generate {flows.filter((f) => f.selected).length} Tests
        </button>
      </div>
    </Modal>
  );
}

export default GenerateTestsModal;

