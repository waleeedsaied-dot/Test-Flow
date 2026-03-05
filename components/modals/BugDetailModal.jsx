import { useEffect, useState } from "react";
import Modal from "./Modal";
import apiService from "@/services/apiService";

function BugDetailModal({
  isOpen,
  onClose,
  bug,
  onUpdateBug,
  users = ["Alice", "Bob", "Charlie"],
  features = ["US-042: Checkout Flow", "US-041: Auth Module", "US-040: Payment"],
  automationRules,
  showToast,
}) {
  const [saving, setSaving] = useState(false);
  const [, setSaveError] = useState(null);
  const [localBug, setLocalBug] = useState(bug);
  const [newComment, setNewComment] = useState("");
  const [newLinkType, setNewLinkType] = useState("commit");
  const [newLinkValue, setNewLinkValue] = useState("");
  const [newPRLink, setNewPRLink] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [proposedStatus, setProposedStatus] = useState("");
  const [proposedReason, setProposedReason] = useState("");

  const handleSaveBug = async () => {
    setSaveError(null);
    try {
      setSaving(true);
      if (localBug && localBug.id) {
        await apiService.updateBug(localBug.id, localBug);
      }
      onUpdateBug(localBug);
      onClose();
    } catch (e) {
      setSaveError(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const mockBuilds = [
    { id: "Build 2024.03.15.1", date: "2024-03-15", status: "success" },
    { id: "Build 2024.03.14.3", date: "2024-03-14", status: "success" },
    { id: "Build 2024.03.14.2", date: "2024-03-14", status: "failed" },
    { id: "Build 2024.03.13.1", date: "2024-03-13", status: "success" },
    { id: "Build 2024.03.12.4", date: "2024-03-12", status: "success" },
  ];

  const mockPRs = [
    { id: "#234", title: "Fix Safari payment timeout", status: "open", author: "Alice" },
    { id: "#231", title: "Handle uppercase email auth", status: "merged", author: "Bob" },
    { id: "#228", title: "Mobile dashboard optimization", status: "open", author: "Charlie" },
  ];

  const mockCommits = [
    { hash: "abc123f", message: "Fix: payment timeout in Safari", author: "Alice", date: "2024-03-15" },
    { hash: "def456g", message: "Refactor: auth module", author: "Bob", date: "2024-03-14" },
    { hash: "ghi789h", message: "WIP: mobile performance", author: "Charlie", date: "2024-03-13" },
  ];

  const getReasonOptions = (to) => {
    if (to === "Resolved") return ["Fixed", "Duplicate", "Cannot Reproduce", "As Designed", "Deferred"];
    if (to === "Closed") return ["Verified", "Deferred", "Duplicate", "Rejected"];
    if (to === "Active") return ["Reopened", "New Info"];
    return [];
  };

  useEffect(() => {
    setLocalBug(bug);
    setShowStatusModal(false);
    setProposedStatus("");
    setProposedReason("");
  }, [bug]);

  if (!bug) return null;

  const handleStatusChange = (newStatus) => {
    const reasonText = proposedReason ? `Reason: ${proposedReason}` : "";
    const historyEntry = {
      from: localBug.status,
      to: newStatus,
      timestamp: new Date().toISOString(),
      user: "Waleed",
      comment: reasonText,
    };
    let updatedBug = {
      ...localBug,
      status: newStatus,
      history: [historyEntry, ...(localBug.history || [])],
    };
    if (automationRules?.reassignOnResolve && newStatus === "Resolved") {
      const creator = localBug.history?.find((h) => h.from === null)?.user || "Waleed";
      updatedBug.assignee = creator;
    }
    if (automationRules?.autoCloseOnPRMerge && localBug.pullRequests?.some((pr) => pr.autoClose && pr.status === "merged")) {
      updatedBug.status = "Closed";
    }
    if (automationRules?.notifyOnStatusChange && newStatus !== localBug.status) {
      showToast(`📧 Notification: Status changed to ${newStatus}`);
    }
    setLocalBug(updatedBug);
    onUpdateBug(updatedBug);
    setShowStatusModal(false);
    setProposedReason("");
    showToast(`Status changed to ${newStatus}`);
  };

  const confirmStatusChange = () => {
    if (!proposedStatus) return;
    handleStatusChange(proposedStatus);
  };

  const handleAddLink = () => {
    if (!newLinkValue.trim()) return;
    const link = { type: newLinkType, value: newLinkValue };
    const updatedBug = { ...localBug, links: [link, ...(localBug.links || [])] };
    setLocalBug(updatedBug);
    onUpdateBug(updatedBug);
    setNewLinkValue("");
  };

  const handleAddPR = () => {
    if (!newPRLink.trim()) return;
    const prLink = { type: "pr", value: newPRLink, autoClose: false, status: "open" };
    const updatedBug = { ...localBug, pullRequests: [prLink, ...(localBug.pullRequests || [])] };
    setLocalBug(updatedBug);
    onUpdateBug(updatedBug);
    setNewPRLink("");
    showToast(`PR ${prLink.value} linked to bug`);
  };

  const handleLinkMockPR = (pr) => {
    const prLink = { type: "pr", value: pr.id, title: pr.title, autoClose: true, status: pr.status, author: pr.author };
    const updatedBug = { ...localBug, pullRequests: [prLink, ...(localBug.pullRequests || [])] };
    setLocalBug(updatedBug);
    onUpdateBug(updatedBug);
    showToast(`PR ${pr.id} linked with auto-close enabled`);
  };

  const toggleAutoClose = (idx) => {
    const updatedPRs = [...(localBug.pullRequests || [])];
    updatedPRs[idx].autoClose = !updatedPRs[idx].autoClose;
    setLocalBug({ ...localBug, pullRequests: updatedPRs });
    onUpdateBug({ ...localBug, pullRequests: updatedPRs });
  };

  const simulatePRMerge = (idx) => {
    const updatedPRs = [...(localBug.pullRequests || [])];
    updatedPRs[idx].status = "merged";
    updatedPRs[idx].mergedAt = new Date().toISOString();
    setLocalBug({ ...localBug, pullRequests: updatedPRs });
    onUpdateBug({ ...localBug, pullRequests: updatedPRs });
    if (updatedPRs[idx].autoClose && localBug.status !== "Closed") {
      const historyEntry = {
        from: localBug.status,
        to: "Closed",
        timestamp: new Date().toISOString(),
        user: "System",
        comment: `Auto-closed: PR ${updatedPRs[idx].value} merged`,
      };
      const closedBug = { ...localBug, status: "Closed", pullRequests: updatedPRs, history: [historyEntry, ...(localBug.history || [])] };
      setLocalBug(closedBug);
      onUpdateBug(closedBug);
      showToast("PR merged! Bug auto-closed.");
    } else {
      showToast(`PR ${updatedPRs[idx].value} merged!`);
    }
  };

  const handleLinkBuild = (build) => {
    const link = { type: "build", value: build.id, date: build.date, status: build.status };
    const updatedBug = { ...localBug, links: [link, ...(localBug.links || [])], foundInBuild: localBug.foundInBuild || build.id };
    setLocalBug(updatedBug);
    onUpdateBug(updatedBug);
    showToast(`Build ${build.id} linked to bug`);
  };

  const handleAutoDetectCommits = () => {
    const detectedCommits = mockCommits.filter(
      (c) =>
        localBug.title.toLowerCase().includes(c.message.toLowerCase().split(" ")[2]) ||
        localBug.description?.toLowerCase().includes(c.message.toLowerCase().split(" ")[2])
    );
    if (detectedCommits.length === 0) {
      const commitLink = { type: "commit", value: mockCommits[0].hash, message: mockCommits[0].message, author: mockCommits[0].author };
      const updatedBug = { ...localBug, links: [commitLink, ...(localBug.links || [])] };
      setLocalBug(updatedBug);
      onUpdateBug(updatedBug);
      showToast(`Auto-detected commit ${mockCommits[0].hash}`);
    } else {
      detectedCommits.forEach((c) => {
        const commitLink = { type: "commit", value: c.hash, message: c.message, author: c.author };
        const updatedBug = { ...localBug, links: [commitLink, ...(localBug.links || [])] };
        setLocalBug(updatedBug);
        onUpdateBug(updatedBug);
      });
      showToast(`Auto-detected ${detectedCommits.length} commits`);
    }
  };

  const statuses = ["New", "Active", "Resolved", "Closed"];
  const reasons = getReasonOptions(proposedStatus);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`🐛 ${bug.id}: ${bug.title}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" }}>Status</div>
            <div style={{ display: "flex", gap: 6 }}>
              <select
                value={localBug?.status}
                onChange={(e) => setLocalBug({ ...localBug, status: e.target.value })}
                style={{ flex: 1, padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".85rem" }}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button className="btn btn-sm" onClick={() => setShowStatusModal(true)} style={{ background: "rgba(255,0,153,0.1)", border: "1px solid rgba(255,0,153,0.3)", color: "var(--pink)" }}>
                Change
              </button>
            </div>
          </div>
          <div>
            <div style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" }}>Priority</div>
            <select
              value={localBug?.priority}
              onChange={(e) => setLocalBug({ ...localBug, priority: e.target.value })}
              style={{ width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".85rem" }}
            >
              <option value="blocker">Blocker</option>
              <option value="major">Major</option>
              <option value="minor">Minor</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" }}>Severity</div>
            <select
              value={localBug?.severity || "Medium"}
              onChange={(e) => setLocalBug({ ...localBug, severity: e.target.value })}
              style={{ width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".85rem" }}
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" }}>Assignee</div>
            <select
              value={localBug?.assignee || ""}
              onChange={(e) => {
                const newAssignee = e.target.value;
                let updatedBug = { ...localBug, assignee: newAssignee };
                if (automationRules?.moveToActiveOnAssign && newAssignee && localBug.status === "New") {
                  updatedBug.status = "Active";
                  const historyEntry = {
                    from: "New",
                    to: "Active",
                    timestamp: new Date().toISOString(),
                    user: "System",
                    comment: "Auto-moved: Bug assigned to " + newAssignee,
                  };
                  updatedBug.history = [historyEntry, ...(localBug.history || [])];
                  showToast("Bug moved to Active (auto-rule)");
                }
                if (automationRules?.notifyOnStatusChange && newAssignee !== localBug.assignee) {
                  showToast(`Notification: Bug assigned to ${newAssignee}`);
                }
                setLocalBug(updatedBug);
                onUpdateBug(updatedBug);
              }}
              style={{ width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".85rem" }}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Parent Feature / User Story</div>
            <select
              value={localBug?.parent || ""}
              onChange={(e) => setLocalBug({ ...localBug, parent: e.target.value })}
              style={{ width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".85rem" }}
            >
              <option value="">None</option>
              {features.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Sprint / Iteration</div>
            <select
              value={localBug?.sprint || ""}
              onChange={(e) => setLocalBug({ ...localBug, sprint: e.target.value })}
              style={{ width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".85rem" }}
            >
              <option value="">Backlog</option>
              <option value="Sprint 1">Sprint 1</option>
              <option value="Sprint 2">Sprint 2</option>
              <option value="Sprint 3">Sprint 3</option>
              <option value="Sprint 4">Sprint 4</option>
              <option value="Sprint 5">Sprint 5</option>
            </select>
          </div>
        </div>
        <div>
          <div style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>System Info</div>
          <textarea
            value={localBug?.systemInfo || ""}
            onChange={(e) => setLocalBug({ ...localBug, systemInfo: e.target.value })}
            rows={2}
            placeholder={"OS: macOS Sonoma 14.0\nBrowser: Safari 17.0\nDevice: MacBook Pro"}
            style={{ width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".85rem", resize: "vertical" }}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" }}>Found in Build</div>
            <input
              value={localBug?.foundInBuild || ""}
              onChange={(e) => setLocalBug({ ...localBug, foundInBuild: e.target.value })}
              placeholder="e.g., Build 2024.03.04.1"
              style={{ width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".85rem" }}
            />
          </div>
          <div>
            <div style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" }}>Integrated in Build</div>
            <input
              value={localBug?.integratedInBuild || ""}
              onChange={(e) => setLocalBug({ ...localBug, integratedInBuild: e.target.value })}
              placeholder="e.g., Build 2024.03.05.2"
              style={{ width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".85rem" }}
            />
          </div>
        </div>
        <div>
          <div style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Acceptance Criteria</div>
          <textarea
            value={localBug?.acceptanceCriteria || ""}
            onChange={(e) => setLocalBug({ ...localBug, acceptanceCriteria: e.target.value })}
            rows={2}
            placeholder="Conditions to close this bug..."
            style={{ width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".85rem", resize: "vertical" }}
          />
        </div>
        <div>
          <div style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Description</div>
          <textarea
            value={localBug?.description || ""}
            onChange={(e) => setLocalBug({ ...localBug, description: e.target.value })}
            rows={3}
            style={{ width: "100%", padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".85rem", resize: "vertical" }}
          />
        </div>
        <div>
          <div style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Links & Builds</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <select value={newLinkType} onChange={(e) => setNewLinkType(e.target.value)} style={{ padding: "6px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".8rem" }}>
              <option value="commit">Commit</option>
              <option value="build">Build</option>
              <option value="test">Test Case</option>
            </select>
            <input
              value={newLinkValue}
              onChange={(e) => setNewLinkValue(e.target.value)}
              placeholder={newLinkType === "commit" ? "abc123f" : newLinkType === "build" ? "Build 2024.03.04.1" : "TC-101"}
              style={{ flex: 1, padding: "6px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".85rem" }}
            />
            <button className="btn btn-sm" onClick={handleAddLink}>
              Add
            </button>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: ".65rem", color: "var(--muted)", marginBottom: 4 }}>Link Recent Build:</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {mockBuilds.slice(0, 4).map((build) => (
                <button
                  key={build.id}
                  onClick={() => handleLinkBuild(build)}
                  style={{
                    padding: "4px 8px",
                    fontSize: ".7rem",
                    background: "rgba(30,144,255,0.1)",
                    border: "1px solid rgba(30,144,255,0.3)",
                    borderRadius: 4,
                    color: "var(--blue)",
                    cursor: "pointer",
                  }}
                >
                  {build.id}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <button className="btn btn-sm" onClick={handleAutoDetectCommits} style={{ background: "rgba(157,78,221,0.1)", border: "1px solid rgba(157,78,221,0.3)", color: "var(--purple)" }}>
              Auto-detect Commits
            </button>
          </div>
          {localBug?.links && localBug.links.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {localBug.links.map((link, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "rgba(255,255,255,0.04)", borderRadius: 4 }}>
                  <span>{link.type === "commit" ? "📝" : link.type === "build" ? "🏗️" : "🧪"}</span>
                  <span style={{ fontFamily: "monospace", fontSize: ".8rem" }}>{link.value}</span>
                  <span style={{ fontSize: ".65rem", color: "var(--muted)" }}>({link.type})</span>
                  {link.status && (
                    <span
                      style={{
                        fontSize: ".65rem",
                        padding: "2px 6px",
                        borderRadius: 3,
                        background: link.status === "success" ? "rgba(0,255,133,0.2)" : "rgba(255,0,85,0.2)",
                        color: link.status === "success" ? "var(--green)" : "var(--pink)",
                      }}
                    >
                      {link.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Pull Requests</div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: ".65rem", color: "var(--muted)", marginBottom: 4 }}>Suggested PRs:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {mockPRs.map((pr) => (
                <div key={pr.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "rgba(255,255,255,0.04)", borderRadius: 4 }}>
                  <span>🔀</span>
                  <span style={{ flex: 1, fontSize: ".75rem" }}>
                    {pr.id}: {pr.title}
                  </span>
                  <span style={{ fontSize: ".6rem", padding: "2px 4px", borderRadius: 3, background: pr.status === "merged" ? "rgba(0,255,133,0.2)" : "rgba(255,200,0,0.2)", color: pr.status === "merged" ? "var(--green)" : "var(--yellow)" }}>{pr.status}</span>
                  <button
                    onClick={() => handleLinkMockPR(pr)}
                    style={{ fontSize: ".65rem", padding: "2px 6px", background: "rgba(255,0,153,0.1)", border: "1px solid rgba(255,0,153,0.3)", borderRadius: 3, color: "var(--pink)", cursor: "pointer" }}
                  >
                    Link
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              value={newPRLink}
              onChange={(e) => setNewPRLink(e.target.value)}
              placeholder="PR #123 or URL"
              style={{ flex: 1, padding: "6px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".85rem" }}
            />
            <button className="btn btn-sm" onClick={handleAddPR}>
              Link PR
            </button>
          </div>
          {localBug?.pullRequests && localBug.pullRequests.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {localBug.pullRequests.map((pr, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "rgba(255,255,255,0.04)", borderRadius: 4 }}>
                  <span>🔀</span>
                  <span style={{ flex: 1, fontSize: ".8rem" }}>{pr.value}</span>
                  {pr.status && (
                    <span style={{ fontSize: ".6rem", padding: "2px 4px", borderRadius: 3, background: pr.status === "merged" ? "rgba(0,255,133,0.2)" : "rgba(255,200,0,0.2)", color: pr.status === "merged" ? "var(--green)" : "var(--yellow)" }}>
                      {pr.status}
                    </span>
                  )}
                  <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: ".7rem" }}>
                    <input type="checkbox" checked={pr.autoClose} onChange={() => toggleAutoClose(idx)} />
                    Auto‑close
                  </label>
                  {pr.status === "open" && (
                    <button onClick={() => simulatePRMerge(idx)} style={{ fontSize: ".65rem", padding: "2px 6px", background: "rgba(0,255,133,0.1)", border: "1px solid rgba(0,255,133,0.3)", borderRadius: 3, color: "var(--green)", cursor: "pointer" }}>
                      Simulate Merge
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" }}>Deployments</div>
            <button className="btn btn-sm" onClick={() => {}} style={{ background: "rgba(0,255,133,0.1)", border: "1px solid rgba(0,255,133,0.3)", color: "var(--green)" }}>
              Trigger Deployment
            </button>
          </div>
          {localBug?.deployments && localBug.deployments.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {localBug.deployments.map((dep, idx) => (
                <div key={idx} style={{ padding: "8px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: ".8rem" }}>🖥️ {dep.environment || dep.name}</span>
                    <span
                      style={{
                        fontSize: ".65rem",
                        padding: "2px 6px",
                        borderRadius: 3,
                        background: dep.status === "success" ? "rgba(0,255,133,0.2)" : dep.status === "in_progress" ? "rgba(255,200,0,0.2)" : "rgba(255,0,85,0.2)",
                        color: dep.status === "success" ? "var(--green)" : dep.status === "in_progress" ? "var(--yellow)" : "var(--pink)",
                      }}
                    >
                      {dep.status === "in_progress" ? "⏳ In Progress" : dep.status === "success" ? "✅ Success" : "❌ Failed"}
                    </span>
                  </div>
                  <div style={{ fontSize: ".65rem", color: "var(--muted)", marginTop: 4 }}>
                    {dep.date} • by {dep.triggeredBy}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: ".8rem", color: "var(--muted)", fontStyle: "italic", padding: "12px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 6 }}>
              No deployments yet. Click "Trigger Deployment" to start.
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-sm" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSaveBug} disabled={saving} style={{ marginLeft: 8 }}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
        {showStatusModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000,
            }}
            onClick={() => setShowStatusModal(false)}
          >
            <div
              style={{
                background: "#1a1a2e",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 24,
                width: 400,
                maxWidth: "90%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ marginBottom: 16, fontSize: "1.1rem", fontWeight: 600 }}>Change Status</h3>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6 }}>Current Status</div>
                <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.06)", borderRadius: 6 }}>{localBug?.status}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6 }}>New Status *</div>
                <select
                  value={proposedStatus}
                  onChange={(e) => {
                    setProposedStatus(e.target.value);
                    setProposedReason("");
                  }}
                  style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".9rem" }}
                >
                  <option value="">Select new status</option>
                  {statuses
                    .filter((s) => s !== localBug?.status)
                    .map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                </select>
              </div>
              {proposedStatus && reasons.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6 }}>Reason (optional)</div>
                  <select
                    value={proposedReason}
                    onChange={(e) => setProposedReason(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".9rem" }}
                  >
                    <option value="">Select reason</option>
                    {reasons.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button className="btn btn-sm" onClick={() => setShowStatusModal(false)} style={{ background: "rgba(255,255,255,0.06)" }}>
                  Cancel
                </button>
                <button className="btn btn-primary btn-sm" onClick={confirmStatusChange} disabled={!proposedStatus} style={{ opacity: proposedStatus ? 1 : 0.5 }}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default BugDetailModal;
