import { useEffect, useState } from "react";
import Modal from "@/components/modals/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TestDetailModal({ isOpen, onClose, test = {}, onRun, onSave }) {
  const [local, setLocal] = useState(test || {});
  useEffect(() => setLocal(test || {}), [test]);

  const handleSave = () => {
    if (onSave) onSave(local);
    onClose();
  };

  const isAPI = (local?.type || "").toLowerCase() === "api";
  const isMobile = (local?.type || "").toLowerCase() === "mobile";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`🧪 ${local?.name || "Test Details"}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Name</div>
            <input
              value={local?.name || ""}
              onChange={e => setLocal({ ...local, name: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }}
            />
          </div>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Type</div>
            <select
              value={local?.type || "Web"}
              onChange={e => setLocal({ ...local, type: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }}
            >
              <option>Web</option>
              <option>Mobile</option>
              <option>API</option>
            </select>
          </div>
        </div>

        {isAPI && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Endpoint</div>
              <input
                value={local?.endpoint || local?.name || ""}
                onChange={e => setLocal({ ...local, endpoint: e.target.value, name: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontFamily: "monospace" }}
              />
            </div>
            <div>
              <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Method</div>
              <input
                value={local?.method || "GET"}
                onChange={e => setLocal({ ...local, method: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }}
              />
            </div>
          </div>
        )}

        {isMobile && (
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Platform</div>
            <input
              value={local?.platform || "Mobile"}
              onChange={e => setLocal({ ...local, platform: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }}
            />
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Status</div>
            <select
              value={local?.status || "passed"}
              onChange={e => setLocal({ ...local, status: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }}
            >
              <option>passed</option>
              <option>failed</option>
              <option>flaky</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Last Run</div>
            <input
              value={local?.last || ""}
              onChange={e => setLocal({ ...local, last: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Button size="sm" onClick={onClose} variant="outline">Close</Button>
          <Button size="sm" onClick={() => onRun && onRun(local)} variant="outline">▶️ Run</Button>
          <Button size="sm" onClick={handleSave}>💾 Save</Button>
        </div>
      </div>
    </Modal>
  );
}
