import { useState } from "react";
import Modal from "./Modal";

function NewBugModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    priority: "minor",
    severity: "Medium",
    description: "",
    assignee: "",
    stepsToReproduce: "",
    status: "New",
    foundInBuild: "",
    acceptanceCriteria: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Bug title is required";
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
    setForm({
      title: "",
      priority: "minor",
      severity: "Medium",
      description: "",
      assignee: "",
      stepsToReproduce: "",
      status: "New",
      foundInBuild: "",
      acceptanceCriteria: "",
    });
    setErrors({});
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🐛 Create New Bug">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Bug Title *</div>
          <input
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              setErrors({ ...errors, title: "" });
            }}
            placeholder="e.g., Payment fails on Safari"
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${errors.title ? "var(--pink)" : "var(--border)"}`,
              borderRadius: 8,
              color: "var(--text)",
              fontSize: ".9rem",
              outline: "none",
            }}
          />
          {errors.title && <div style={{ fontSize: ".72rem", color: "var(--pink)", marginTop: 4 }}>{errors.title}</div>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Priority</div>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
            >
              <option value="blocker">Blocker</option>
              <option value="major">Major</option>
              <option value="minor">Minor</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Severity</div>
            <select
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Status</div>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
            >
              <option value="New">New</option>
              <option value="Active">Active</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Assignee</div>
            <select
              value={form.assignee}
              onChange={(e) => setForm({ ...form, assignee: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
            >
              <option value="">Unassigned</option>
              <option value="Alice">Alice</option>
              <option value="Bob">Bob</option>
              <option value="Charlie">Charlie</option>
            </select>
          </div>
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Found in Build</div>
          <input
            value={form.foundInBuild}
            onChange={(e) => setForm({ ...form, foundInBuild: e.target.value })}
            placeholder="e.g., Build 2024.03.04.1"
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
          />
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Description</div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the bug in detail..."
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
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Steps to Reproduce</div>
          <textarea
            value={form.stepsToReproduce}
            onChange={(e) => setForm({ ...form, stepsToReproduce: e.target.value })}
            placeholder={"1. Go to...\n2. Click on...\n3. See error..."}
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
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Acceptance Criteria</div>
          <textarea
            value={form.acceptanceCriteria}
            onChange={(e) => setForm({ ...form, acceptanceCriteria: e.target.value })}
            placeholder="Conditions to close this bug..."
            rows={2}
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
        <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: 8, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Creating..." : "Create Bug"}
        </button>
      </div>
    </Modal>
  );
}

export default NewBugModal;

