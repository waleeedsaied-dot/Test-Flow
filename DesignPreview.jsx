import React, { useState } from 'react';

const SAMPLE_BUGS = [
  { id: "BUG-234", title: "Payment fails on Safari — Stripe timeout", priority: "blocker", severity: "Critical", status: "New", assignee: "Alice" },
  { id: "BUG-233", title: "Login with uppercase email breaks auth", priority: "major", severity: "High", status: "Active", assignee: "Bob" },
  { id: "BUG-231", title: "Checkout button not visible on iOS Safari", priority: "blocker", severity: "Critical", status: "New", assignee: "" },
  { id: "BUG-229", title: "Dashboard slow load on mobile networks", priority: "minor", severity: "Medium", status: "Active", assignee: "Charlie" },
];

const PRIO_COLOR = { blocker: "var(--pink)", major: "#ffd60a", minor: "var(--cyan,#00f5ff)" };
const STATUS_COLOR = { New: "#94a3b8", Active: "var(--blue,#3b82f6)", Resolved: "var(--green,#00ffa3)", Closed: "#4b5563" };

function BugCard({ bug, onOpen }) {
  return (
    <div
      onClick={() => onOpen(bug)}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        padding: "14px 16px",
        margin: "0 12px 12px 0",
        width: 280,
        cursor: "pointer",
        transition: "all .18s ease",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,0,153,0.3)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
    >
      <div style={{ fontSize: ".68rem", color: "var(--purple,#7209b7)", fontFamily: "monospace", marginBottom: 6 }}>{bug.id}</div>
      <div style={{ fontWeight: 600, fontSize: ".85rem", marginBottom: 10, lineHeight: 1.4 }}>{bug.title}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: ".68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: `${PRIO_COLOR[bug.priority]}22`, color: PRIO_COLOR[bug.priority], border: `1px solid ${PRIO_COLOR[bug.priority]}44` }}>{bug.priority}</span>
        <span style={{ fontSize: ".68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: `${STATUS_COLOR[bug.status]}22`, color: STATUS_COLOR[bug.status], border: `1px solid ${STATUS_COLOR[bug.status]}44` }}>{bug.status}</span>
        {bug.assignee && <span style={{ fontSize: ".68rem", color: "var(--muted,#4b5563)", marginLeft: "auto" }}>→ {bug.assignee}</span>}
      </div>
    </div>
  );
}

function BugDetailModal({ bug, onClose, onUpdate }) {
  const [local, setLocal] = useState({ ...bug });
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#0f0f22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, width: 460, maxWidth: "90vw" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: "1rem" }}>{local.id}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "1.3rem", cursor: "pointer" }}>×</button>
        </div>
        <div style={{ fontSize: ".72rem", color: "var(--muted,#4b5563)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Title</div>
        <input value={local.title} onChange={e => setLocal(p => ({ ...p, title: e.target.value }))}
          style={{ width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: ".85rem", marginBottom: 12 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[["Priority", "priority", ["blocker","major","minor"]], ["Status", "status", ["New","Active","Resolved","Closed"]]].map(([label, key, opts]) => (
            <div key={key}>
              <div style={{ fontSize: ".68rem", color: "var(--muted,#4b5563)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
              <select value={local[key]} onChange={e => setLocal(p => ({ ...p, [key]: e.target.value }))}
                style={{ width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: ".85rem" }}>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <button onClick={() => onUpdate(local)} style={{ width: "100%", padding: "10px", background: "linear-gradient(135deg,#f72585,#7209b7)", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, cursor: "pointer" }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

const DesignPreview = ({ compact }) => {
  const [bugs, setBugs] = useState(SAMPLE_BUGS);
  const [selected, setSelected] = useState(null);

  const onUpdate = (updatedBug) => {
    setBugs(prev => prev.map(b => b.id === updatedBug.id ? updatedBug : b));
    setSelected(null);
  };

  if (compact) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {bugs.slice(0, 2).map(b => <BugCard key={b.id} bug={b} onOpen={setSelected} />)}
        {selected && <BugDetailModal bug={selected} onClose={() => setSelected(null)} onUpdate={onUpdate} />}
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontWeight: 800, marginBottom: 20, fontSize: "1.2rem" }}>🎨 TestFlow Design Preview</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {bugs.map(b => <BugCard key={b.id} bug={b} onOpen={setSelected} />)}
      </div>
      {selected && <BugDetailModal bug={selected} onClose={() => setSelected(null)} onUpdate={onUpdate} />}
    </div>
  );
};

export default DesignPreview;
