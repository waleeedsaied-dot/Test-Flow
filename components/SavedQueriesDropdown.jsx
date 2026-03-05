import { useState } from "react";

const PRESET_QUERIES = [
  { id: "blockers", label: "🔴 All Blockers", filters: { priority: "blocker" } },
  { id: "active", label: "⚡ Active Bugs", filters: { status: "Active" } },
  { id: "mine", label: "👤 Assigned to Me", filters: { assignee: "Waleed" } },
  { id: "critical", label: "🚨 Critical Severity", filters: { severity: "Critical" } },
];

export default function SavedQueriesDropdown({ currentFilters, onApply }) {
  const [open, setOpen] = useState(false);
  const hasActive = currentFilters && Object.values(currentFilters).some(v => v);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 8,
          background: hasActive ? "rgba(255,0,153,0.1)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${hasActive ? "rgba(255,0,153,0.3)" : "rgba(255,255,255,0.08)"}`,
          color: hasActive ? "var(--pink,#f72585)" : "var(--muted,#4b5563)",
          fontSize: ".76rem", fontWeight: 600, cursor: "pointer",
        }}
      >
        🔖 Saved Queries {hasActive && "●"}
      </button>
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 500,
          background: "#0f0f22", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, padding: 8, minWidth: 210,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}>
          <div style={{ fontSize: ".65rem", color: "var(--muted,#4b5563)", fontWeight: 700, textTransform: "uppercase", padding: "4px 8px 8px", letterSpacing: 1 }}>Quick Filters</div>
          {PRESET_QUERIES.map(q => (
            <button key={q.id} onClick={() => { onApply(q.filters); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "8px 10px", borderRadius: 7, border: "none",
                background: "none", color: "var(--text,#e2e8f0)",
                fontSize: ".78rem", cursor: "pointer", transition: "background .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              {q.label}
            </button>
          ))}
          {hasActive && (
            <>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "6px 0" }} />
              <button onClick={() => { onApply({}); setOpen(false); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 7, border: "none", background: "none", color: "var(--pink,#f72585)", fontSize: ".78rem", cursor: "pointer" }}>
                ✕ Clear filters
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
