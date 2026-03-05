import { useState } from "react";
import Modal from "./Modal";

function RunTestsModal({ isOpen, onClose, onSubmit, tests = [] }) {
  const [config, setConfig] = useState({ type: "all", browser: "chrome", parallel: true, retries: 0 });
  const [loading, setLoading] = useState(false);

  const webCount = tests.filter((t) => t.type === "Web" || t.type === "web").length;
  const mobileCount = tests.filter((t) => t.type === "Mobile" || t.type === "mobile").length;
  const apiCount = tests.filter((t) => t.type === "API" || t.type === "api").length;
  const failedCount = tests.filter((t) => t.status === "failed").length;

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    onSubmit(config);
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="▶️ Run Tests">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Test Suite</div>
          <select
            value={config.type}
            onChange={(e) => setConfig({ ...config, type: e.target.value })}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem" }}
          >
            <option value="all">All Tests ({tests.length})</option>
            <option value="web">Web Tests ({webCount})</option>
            <option value="mobile">Mobile Tests ({mobileCount})</option>
            <option value="api">API Tests ({apiCount})</option>
            <option value="failed">Failed Only ({failedCount})</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Browser</div>
          <select
            value={config.browser}
            onChange={(e) => setConfig({ ...config, browser: e.target.value })}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem" }}
          >
            <option value="chrome">Chrome</option>
            <option value="firefox">Firefox</option>
            <option value="safari">Safari</option>
            <option value="all">All Browsers</option>
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Retries</div>
            <select
              value={config.retries}
              onChange={(e) => setConfig({ ...config, retries: parseInt(e.target.value) })}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem" }}
            >
              <option value={0}>No retries</option>
              <option value={1}>1 retry</option>
              <option value={2}>2 retries</option>
              <option value={3}>3 retries</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Environment</div>
            <select style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem" }}>
              <option>Production</option>
              <option>Staging</option>
              <option>Development</option>
            </select>
          </div>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={config.parallel}
            onChange={(e) => setConfig({ ...config, parallel: e.target.checked })}
            style={{ width: 18, height: 18, accentColor: "var(--pink)" }}
          />
          <span>Run tests in parallel</span>
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "rgba(0,255,133,0.08)", borderRadius: 8, border: "1px solid rgba(0,255,133,0.2)" }}>
          <span style={{ fontSize: "1.2rem" }}>☁️</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: ".85rem" }}>Run on Cloud</div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>10 parallel workers available</div>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: 8, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Starting..." : "▶️ Start Run"}
        </button>
      </div>
    </Modal>
  );
}

export default RunTestsModal;

