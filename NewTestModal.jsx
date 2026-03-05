import { useState } from "react";
import Modal from "./Modal";

function NewTestModal({ isOpen, onClose, onSubmit, onRecordSteps }) {
  const [form, setForm] = useState({ name: "", type: "web", description: "", priority: "high", testSteps: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Test name is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    onSubmit(form);
    setForm({ name: "", type: "web", description: "", priority: "high", testSteps: "" });
    setErrors({});
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🧪 Create New Test">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Test Name *</div>
          <input
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              setErrors({ ...errors, name: "" });
            }}
            placeholder="e.g., Login Flow Test"
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${errors.name ? "var(--pink)" : "var(--border)"}`,
              borderRadius: 8,
              color: "var(--text)",
              fontSize: ".9rem",
              outline: "none",
            }}
          />
          {errors.name && <div style={{ fontSize: ".72rem", color: "var(--pink)", marginTop: 4 }}>{errors.name}</div>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Test Type</div>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
            >
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
              <option value="api">API</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Priority</div>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Description</div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what this test validates..."
            rows={3}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: ".9rem",
              outline: "none",
              resize: "vertical",
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Test Steps</div>
          <textarea
            value={form.testSteps}
            onChange={(e) => setForm({ ...form, testSteps: e.target.value })}
            placeholder={"1. Navigate to login page\n2. Enter credentials\n3. Click login button\n4. Verify redirect to dashboard"}
            rows={4}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: ".9rem",
              outline: "none",
              resize: "vertical",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button className="btn btn-primary" style={{ flex: 1, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Test"}
          </button>
          <button
            className="btn btn-sm"
            style={{ background: "var(--glass)", border: "1px solid var(--border)" }}
            onClick={() => {
              onClose();
              onRecordSteps && onRecordSteps();
            }}
          >
            🎥 Record Steps
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default NewTestModal;

