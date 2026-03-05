import Modal from "./Modal";

function AddIntegrationModal({ isOpen, onClose, onSubmit }) {
  const integrations = [
    { name: "GitHub", icon: "🐙", color: "#fff" },
    { name: "Slack", icon: "💬", color: "#4A154B" },
    { name: "Jira", icon: "📋", color: "#0052CC" },
    { name: "Azure DevOps", icon: "🔷", color: "#0078D4" },
    { name: "GitLab", icon: "🦊", color: "#FC6D26" },
    { name: "PagerDuty", icon: "📟", color: "#06AC38" },
  ];

  const handleSubmit = (name) => {
    onSubmit(name);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🔌 Add Integration">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>Select an integration to connect:</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {integrations.map((int) => (
            <div
              key={int.name}
              onClick={() => handleSubmit(int.name)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: 16,
                background: "rgba(255,255,255,0.04)",
                borderRadius: 12,
                cursor: "pointer",
                border: "1px solid var(--border)",
                transition: "all .2s",
              }}
            >
              <span style={{ fontSize: "1.8rem" }}>{int.icon}</span>
              <span style={{ fontSize: ".8rem", fontWeight: 600 }}>{int.name}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase" }}>Or connect via API</div>
          <input
            placeholder="Enter API URL..."
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddIntegrationModal;
