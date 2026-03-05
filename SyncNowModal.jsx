import { useState } from "react";
import Modal from "./Modal";

function SyncNowModal({ isOpen, onClose, onSubmit }) {
  const [sync, setSync] = useState({ bugs: true, tasks: true, comments: true, attachments: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(sync);
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🔄 Sync with ClickUp">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: "rgba(30,144,255,0.1)", borderRadius: 8, border: "1px solid rgba(30,144,255,0.2)" }}>
          <span style={{ fontSize: "2rem" }}>⚡</span>
          <div>
            <div style={{ fontWeight: 700 }}>ClickUp Integration</div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>Last synced: 5 minutes ago</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 12, fontWeight: 600, textTransform: "uppercase" }}>Sync Options</div>
          {[
            { key: "bugs", label: "Bugs", desc: "Sync bug status and assignments" },
            { key: "tasks", label: "Tasks", desc: "Sync user stories and tasks" },
            { key: "comments", label: "Comments", desc: "Sync comments and activity" },
            { key: "attachments", label: "Attachments", desc: "Sync screenshots and files" },
          ].map((item) => (
            <label key={item.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <input
                type="checkbox"
                checked={sync[item.key]}
                onChange={(e) => setSync({ ...sync, [item.key]: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: "var(--pink)" }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: ".85rem" }}>{item.label}</div>
                <div style={{ fontSize: ".7rem", color: "var(--muted)" }}>{item.desc}</div>
              </div>
            </label>
          ))}
        </div>
        <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: 8, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Syncing..." : "🔄 Sync Now"}
        </button>
      </div>
    </Modal>
  );
}

export default SyncNowModal;

