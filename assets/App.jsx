import { useState, useEffect, useRef } from "react";
import KanbanBoard from './KanbanBoard.jsx';
import PredictiveAnalytics from './components/PredictiveAnalytics.jsx';
import FlowDiscovery from './components/FlowDiscovery.jsx';
import AITestGeneration from './components/AITestGeneration.jsx';
import SentimentAnalysis from './components/SentimentAnalysis.jsx';
import BugPredictions from './components/BugPredictions.jsx';
import AIAssistant from './components/AIAssistant.jsx';
import AIRightPanel from './components/AIRightPanel.jsx';
import AISidebar from './components/AISidebar.jsx';

const PAGES_WITH_RIGHT_PANEL = ['ai', 'aitriage', 'dashboard', 'home'];

const NAV = [
  { id: "dashboard", icon: "🏠", label: "Home", href: "home.html" },
  { id: "allbugs", icon: "🐛", label: "Bugs", href: "bug-tracker.html" },
  { id: "alltests", icon: "🧪", label: "Tests", href: "test-cases.html" },
  { id: "aitriage", icon: "🧠", label: "AI Panel", href: "ai-panel.html" },
  { id: "automation", icon: "🤖", label: "Automation", href: "automation.html" },
  { id: "clickup", icon: "⚡", label: "ClickUp", href: "clickup.html" },
  { id: "settings", icon: "⚙️", label: "Settings", href: "settings.html" },
];

const sidebarNav = [
  { group: "Overview", items: [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "activity", icon: "⚡", label: "Activity Feed" },
    { id: "sprint", icon: "🗺️", label: "Sprint Board" },
  ]},
  { group: "Test Automation", items: [
    { id: "alltests", icon: "🧪", label: "All Tests", badge: "24", badgePurple: true },
    { id: "record", icon: "🎥", label: "Record Test" },
    { id: "runs", icon: "▶️", label: "Test Runs" },
    { id: "mobile", icon: "📱", label: "Mobile Tests" },
    { id: "api", icon: "🌐", label: "API Tests" },
    { id: "elements", icon: "📦", label: "Element Repo" },
    { id: "cloud", icon: "☁️", label: "Cloud Runner" },
  ]},
  { group: "Bug Tracking", items: [
    { id: "allbugs", icon: "🐛", label: "All Bugs", badge: "7" },
    { id: "kanban", icon: "📋", label: "Kanban Board" },
    { id: "stories", icon: "🗂️", label: "User Stories" },
    { id: "duplicates", icon: "🔍", label: "Duplicates" },
  ]},
  { group: "AI Intelligence", items: [
    { id: "aitriage", icon: "🤖", label: "AI Triage" },
    { id: "flows", icon: "🧠", label: "Flow Discovery" },
    { id: "predictions", icon: "🔮", label: "Predictions" },
    { id: "generate", icon: "⚡", label: "Generate Tests" },
  ]},
  { group: "Integrations", items: [
    { id: "clickup", icon: "🔗", label: "ClickUp Sync" },
    { id: "reports", icon: "📊", label: "Reports" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ]},
];

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999, minWidth: 260, marginTop: 10, padding: "14px 18px", borderRadius: 12, background: "rgba(4,4,10,0.95)", border: "1px solid #FF0099", color: "white", boxShadow: "0 0 20px rgba(255,0,153,0.4)", animation: "toastIn 0.4s ease forwards" }}>
      {msg}
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" }}></div>
      <div style={{ position: "relative", background: "#1a1a2e", border: "1px solid var(--border)", borderRadius: 16, width: 500, maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: "1rem", fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "1.2rem", cursor: "pointer" }}>×</button>
        </div>
        <div style={{ padding: "1.5rem" }}>{children}</div>
      </div>
    </div>
  );
}

function NewBugModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: "", priority: "medium", description: "", assignee: "", stepsToReproduce: "" });
  
  const handleSubmit = () => {
    onSubmit(form);
    setForm({ title: "", priority: "medium", description: "", assignee: "", stepsToReproduce: "" });
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🐛 Create New Bug">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Bug Title</div>
          <input 
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            placeholder="e.g., Payment fails on Safari"
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Priority</div>
            <select 
              value={form.priority}
              onChange={e => setForm({...form, priority: e.target.value})}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
            >
              <option value="blocker">Blocker</option>
              <option value="major">Major</option>
              <option value="minor">Minor</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Assignee</div>
            <select 
              value={form.assignee}
              onChange={e => setForm({...form, assignee: e.target.value})}
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
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Description</div>
          <textarea 
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            placeholder="Describe the bug in detail..."
            rows={4}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none", resize: "vertical" }}
          />
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Steps to Reproduce</div>
          <textarea 
            value={form.stepsToReproduce}
            onChange={e => setForm({...form, stepsToReproduce: e.target.value})}
            placeholder="1. Go to...
2. Click on...
3. See error..."
            rows={3}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none", resize: "vertical" }}
          />
        </div>
        <button onClick={handleSubmit} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>Create Bug</button>
      </div>
    </Modal>
  );
}

function NewTestModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", type: "web", description: "", priority: "high", testSteps: "" });
  
  const handleSubmit = () => {
    onSubmit(form);
    setForm({ name: "", type: "web", description: "", priority: "high", testSteps: "" });
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🧪 Create New Test">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Test Name</div>
          <input 
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            placeholder="e.g., Login Flow Test"
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Test Type</div>
            <select 
              value={form.type}
              onChange={e => setForm({...form, type: e.target.value})}
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
              onChange={e => setForm({...form, priority: e.target.value})}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}>
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
            onChange={e => setForm({...form, description: e.target.value})}
            placeholder="Describe what this test validates..."
            rows={3}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none", resize: "vertical" }}
          />
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Test Steps</div>
          <textarea 
            value={form.testSteps}
            onChange={e => setForm({...form, testSteps: e.target.value})}
            placeholder="1. Navigate to login page
2. Enter credentials
3. Click login button
4. Verify redirect to dashboard"
            rows={4}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none", resize: "vertical" }}
          />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>Create Test</button>
          <button className="btn btn-sm" style={{ background: "var(--glass)", border: "1px solid var(--border)" }}>Record Steps</button>
        </div>
      </div>
    </Modal>
  );
}

function GenerateTestsModal({ isOpen, onClose, onSubmit }) {
  const [flows, setFlows] = useState([
    { id: 1, name: "Checkout → Payment → Success", selected: true },
    { id: 2, name: "Login → Forgot Password → Reset", selected: false },
    { id: 3, name: "Search → Filter → Sort", selected: true },
  ]);
  
  const handleSubmit = () => {
    const selected = flows.filter(f => f.selected).map(f => f.name);
    onSubmit(selected);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚡ Generate Tests with AI">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>Select user flows to generate automated tests:</div>
        {flows.map(flow => (
          <label key={flow.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "rgba(255,255,255,0.04)", borderRadius: 8, cursor: "pointer" }}>
            <input 
              type="checkbox" 
              checked={flow.selected}
              onChange={e => setFlows(flows.map(f => f.id === flow.id ? {...f, selected: e.target.checked} : f))}
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
            <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>{flows.filter(f => f.selected).length} test cases with Playwright</div>
          </div>
        </div>
        <button onClick={handleSubmit} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>⚡ Generate {flows.filter(f => f.selected).length} Tests</button>
      </div>
    </Modal>
  );
}

function RunTestsModal({ isOpen, onClose, onSubmit }) {
  const [config, setConfig] = useState({ type: "all", browser: "chrome", parallel: true, retries: 0 });
  
  const handleSubmit = () => {
    onSubmit(config);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="▶️ Run Tests">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Test Suite</div>
          <select 
            value={config.type}
            onChange={e => setConfig({...config, type: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem" }}
          >
            <option value="all">All Tests (24)</option>
            <option value="web">Web Tests (18)</option>
            <option value="mobile">Mobile Tests (6)</option>
            <option value="api">API Tests (12)</option>
            <option value="failed">Failed Only (3)</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Browser</div>
          <select 
            value={config.browser}
            onChange={e => setConfig({...config, browser: e.target.value})}
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
              onChange={e => setConfig({...config, retries: parseInt(e.target.value)})}
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
            onChange={e => setConfig({...config, parallel: e.target.checked})}
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
        <button onClick={handleSubmit} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>▶️ Start Run</button>
      </div>
    </Modal>
  );
}

function SyncNowModal({ isOpen, onClose, onSubmit }) {
  const [sync, setSync] = useState({ bugs: true, tasks: true, comments: true, attachments: false });
  
  const handleSubmit = () => {
    onSubmit(sync);
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
          ].map(item => (
            <label key={item.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <input 
                type="checkbox" 
                checked={sync[item.key]}
                onChange={e => setSync({...sync, [item.key]: e.target.checked})}
                style={{ width: 18, height: 18, accentColor: "var(--pink)" }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: ".85rem" }}>{item.label}</div>
                <div style={{ fontSize: ".7rem", color: "var(--muted)" }}>{item.desc}</div>
              </div>
            </label>
          ))}
        </div>
        <button onClick={handleSubmit} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>🔄 Sync Now</button>
      </div>
    </Modal>
  );
}

function AddIntegrationModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", type: "" });
  
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
          {integrations.map(int => (
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
                transition: "all .2s"
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

function StartRecordingModal({ isOpen, onClose, onSubmit }) {
  const [recording, setRecording] = useState(false);
  
  const handleStart = () => {
    setRecording(true);
    onSubmit();
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎥 Record New Test">
      <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "center", padding: "1rem 0" }}>
        {recording ? (
          <>
            <div style={{ fontSize: "4rem", animation: "pulse 1s infinite" }}>🔴</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>Recording in progress...</div>
            <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>Click "Stop" when finished</div>
            <button onClick={() => setRecording(false)} className="btn btn-primary" style={{ width: "100%" }}>⏹️ Stop Recording</button>
          </>
        ) : (
          <>
            <div style={{ fontSize: "4rem" }}>🎥</div>
            <div style={{ fontSize: "1rem", fontWeight: 600 }}>Ready to record</div>
            <div style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: 8 }}>Your actions will be captured as an automated test</div>
            <div style={{ textAlign: "left", fontSize: ".75rem", color: "var(--muted)", background: "rgba(255,255,255,0.04)", padding: 12, borderRadius: 8 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Recording will capture:</div>
              <div>✓ Page navigation</div>
              <div>✓ Clicks and form inputs</div>
              <div>✓ Assertions on elements</div>
              <div>✓ Waits for dynamic content</div>
            </div>
            <button onClick={handleStart} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>▶️ Start Recording</button>
          </>
        )}
      </div>
    </Modal>
  );
}

function DashboardPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage, bugs = [], tests = [] }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card red">
          <div className="stat-label">Open Bugs</div>
          <div className="stat-value">{bugs.filter(b => b.status === "open").length}</div>
          <div className="stat-sub">{bugs.filter(b => b.priority === "blocker").length} critical need fix</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Total Tests</div>
          <div className="stat-value">{tests.length}</div>
          <div className="stat-sub">↑ 3 this sprint</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Pass Rate</div>
          <div className="stat-value">{tests.length ? Math.round((tests.filter(t => t.status === "passed").length / tests.length) * 100) : 0}%</div>
          <div className="stat-sub">↑ 2% vs last sprint</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Quality Score</div>
          <div className="stat-value">83</div>
          <div className="stat-sub">↑ 5 pts this sprint</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">🗺️ Sprint 4 Progress <span style={{ fontSize: ".7rem", color: "var(--muted)", fontWeight: 400 }}>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })} — Active Sprint</span></div>
        </div>
        <div className="card-body">
          <div className="sprint-info">
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--green)" }}>12</div><div className="sprint-stat-lbl">Done</div></div>
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--blue)" }}>5</div><div className="sprint-stat-lbl">In Progress</div></div>
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--pink)" }}>3</div><div className="sprint-stat-lbl">Blocked</div></div>
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--muted)" }}>4</div><div className="sprint-stat-lbl">To Do</div></div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "50%" }}></div>
          </div>
          <div className="progress-labels"><span>0</span><span style={{ color: "var(--green)", fontWeight: 600 }}>50% complete · Day 10</span><span>24 stories</span></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">🐛 Open Bugs</div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowNewBug(true)}>+ New Bug</button>
        </div>
        <div style={{ padding: "0 1.2rem" }}>
          <div className="tabs">
            <div className="tab active">All</div>
            <div className="tab">Critical</div>
            <div className="tab">Sprint 4</div>
            <div className="tab">My Bugs</div>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>ID</th><th>Title</th><th>Priority</th><th>Status</th></tr>
          </thead>
          <tbody>
            {bugs.slice(0, 5).map(bug => (
              <tr key={bug.id}>
                <td className="bug-id">{bug.id}</td>
                <td className="bug-title">{bug.title}</td>
                <td><span className={`badge badge-${bug.priority}`}>{bug.priority}</span></td>
                <td><span className={`badge badge-${bug.status}`}>{bug.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">🧪 Recent Test Runs</div>
          </div>
          <table>
            <thead><tr><th>Test</th><th>Status</th></tr></thead>
            <tbody>
              {tests.slice(0, 4).map((t, i) => (
                <tr key={i}><td>{t.name}</td><td><span className={`badge badge-${t.status}`}>{t.status}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">📊 Resolution Rate</div></div>
          <div className="card-body">
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--green)" }}>94%</div>
            <div className="resolution-bar"><div className="resolution-fill" style={{ width: "94%" }}></div></div>
            <div className="resolution-labels"><span>Last sprint: 91%</span><span>+3% improvement</span></div>
          </div>
        </div>
      </div>
    </>
  );
}

function BugsPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage, bugs = [], tests = [] }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card red">
          <div className="stat-label">Open Bugs</div>
          <div className="stat-value">{bugs.filter(b => b.status === "open").length}</div>
          <div className="stat-sub">{bugs.filter(b => b.priority === "blocker").length} critical</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">{bugs.filter(b => b.status === "progress").length}</div>
          <div className="stat-sub">Being fixed</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">In Review</div>
          <div className="stat-value">2</div>
          <div className="stat-sub">Awaiting review</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Resolved</div>
          <div className="stat-value">{bugs.filter(b => b.status === "fixed").length}</div>
          <div className="stat-sub">This sprint</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">🐛 All Bugs</div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowNewBug(true)}>+ New Bug</button>
        </div>
        <div style={{ padding: "0 1.2rem" }}>
          <div className="tabs">
            <div className="tab active">All</div>
            <div className="tab">Critical</div>
            <div className="tab">High</div>
            <div className="tab">Medium</div>
            <div className="tab">Low</div>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>ID</th><th>Title</th><th>Priority</th><th>Status</th></tr>
          </thead>
          <tbody>
            {bugs.map(bug => (
              <tr key={bug.id}>
                <td className="bug-id">{bug.id}</td>
                <td className="bug-title">{bug.title}</td>
                <td><span className={`badge badge-${bug.priority}`}>{bug.priority}</span></td>
                <td><span className={`badge badge-${bug.status}`}>{bug.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function TestsPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-label">Total Tests</div>
          <div className="stat-value">24</div>
          <div className="stat-sub">↑ 3 this sprint</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Pass Rate</div>
          <div className="stat-value">87%</div>
          <div className="stat-sub">↑ 2% vs last</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Failed</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">Needs attention</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Running</div>
          <div className="stat-value">1</div>
          <div className="stat-sub">In progress</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">🧪 Test Cases</div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowNewTest(true)}>+ New Test</button>
        </div>
        <div style={{ padding: "0 1.2rem" }}>
          <div className="tabs">
            <div className="tab active">All Tests</div>
            <div className="tab">Web</div>
            <div className="tab">Mobile</div>
            <div className="tab">API</div>
          </div>
        </div>
        <table>
          <thead><tr><th>Test</th><th>Type</th><th>Status</th></tr></thead>
          <tbody>
            {[
              { name: "Login Flow — US-01", type: "Web", status: "passed" },
              { name: "Checkout Test — US-02", type: "Web", status: "failed" },
              { name: "Search Feature — US-03", type: "Web", status: "passed" },
              { name: "POST /api/login", type: "API", status: "passed" },
              { name: "iOS Checkout", type: "Mobile", status: "failed" },
              { name: "Profile Update — US-04", type: "Web", status: "passed" },
            ].map((t, i) => (
              <tr key={i}><td>{t.name}</td><td>{t.type}</td><td><span className={`badge badge-${t.status}`}>{t.status}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AIPanelPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <div className="ai-layout">
      <AISidebar setPage={setPage} />
      <div className="main" style={{ padding: '1.5rem 2rem', overflowY: 'auto' }}>
        <div className="stats-row">
          <div className="stat-card purple">
            <div className="stat-label">AI Triaged</div>
            <div className="stat-value">12</div>
            <div className="stat-sub">This week</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-label">Tests Generated</div>
            <div className="stat-value">8</div>
            <div className="stat-sub">By AI</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Predictions</div>
            <div className="stat-value">3</div>
            <div className="stat-sub">Active</div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-label">Confidence</div>
            <div className="stat-value">84%</div>
            <div className="stat-sub">↑ 2%</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
          <PredictiveAnalytics />
          <BugPredictions />
        </div>
        
        <div style={{ marginTop: '1.5rem' }}>
          <FlowDiscovery />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
          <AITestGeneration setShowGenerateTests={setShowGenerateTests} />
          <SentimentAnalysis />
        </div>
        
        <div style={{ marginTop: '1.5rem' }}>
          <AIAssistant />
        </div>
      </div>
    </div>
  );
}

function AutomationPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Automation Scripts</div>
          <div className="stat-value">18</div>
          <div className="stat-sub">Active</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Time Saved</div>
          <div className="stat-value">42h</div>
          <div className="stat-sub">This month</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Cloud Runs</div>
          <div className="stat-value">156</div>
          <div className="stat-sub">↑ 23%</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Mobile Tests</div>
          <div className="stat-value">6</div>
          <div className="stat-sub">iOS + Android</div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">🎥 Record New Test</div>
          </div>
          <div className="card-body" style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎥</div>
            <div style={{ fontSize: ".9rem", fontWeight: 600, marginBottom: ".5rem" }}>Click to start recording</div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>Record your browser actions as a test</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">☁️ Cloud Runner</div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowRunTests && setShowRunTests(true)}>▶️ Run All</button>
          </div>
          <div className="card-body">
            {[
              { name: "Windows VM - Chrome", used: 7, total: 10 },
              { name: "Mac VM - Safari", used: 3, total: 5 },
              { name: "Android Emulator", used: 2, total: 7 },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ flex: 1, fontSize: ".8rem" }}>{r.name}</div>
                <div style={{ fontSize: ".7rem", color: "var(--muted)" }}>{r.used}/{r.total}</div>
                <div style={{ width: 80 }}><div className="progress-bar"><div className="progress-fill" style={{ width: (r.used/r.total*100) + "%", background: r.used/r.total > 0.7 ? "var(--pink)" : "var(--green)" }}></div></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ClickUpPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-label">Synced Tasks</div>
          <div className="stat-value">24</div>
          <div className="stat-sub">With ClickUp</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Completed</div>
          <div className="stat-value">18</div>
          <div className="stat-sub">This sprint</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">4</div>
          <div className="stat-sub">Syncing</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Conflicts</div>
          <div className="stat-value">0</div>
          <div className="stat-sub">All synced</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">🔗 ClickUp Integration</div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowSyncNow && setShowSyncNow(true)}>🔄 Sync Now</button>
        </div>
        <table>
          <thead><tr><th>Action</th><th>Time</th><th>Status</th></tr></thead>
          <tbody>
            {[
              { action: "Task BUG-234 linked to ClickUp task", time: "5 min ago", status: "success" },
              { action: "Status updated for US-02 Checkout", time: "15 min ago", status: "success" },
              { action: "New bug BUG-235 synced", time: "30 min ago", status: "success" },
              { action: "Comment added to BUG-229", time: "1 hr ago", status: "success" },
            ].map((s, i) => (
              <tr key={i}>
                <td style={{ fontSize: ".8rem" }}>{s.action}</td>
                <td style={{ fontSize: ".7rem", color: "var(--muted)" }}>{s.time}</td>
                <td><span className="badge badge-passed">{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SettingsPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Team Members</div>
          <div className="stat-value">5</div>
          <div className="stat-sub">Active</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Integrations</div>
          <div className="stat-value">4</div>
          <div className="stat-sub">Connected</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Notifications</div>
          <div className="stat-value">12</div>
          <div className="stat-sub">Rules active</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Schedules</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">Auto-runs</div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">⚙️ General Settings</div>
          </div>
          <div className="card-body">
            {[
              { label: "Project Name", value: "TestFlow QA" },
              { label: "Timezone", value: "UTC (GMT+0)" },
              { label: "Date Format", value: "MM/DD/YYYY" },
              { label: "Language", value: "English" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>{s.label}</div>
                <div style={{ fontSize: ".8rem", fontWeight: 600 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">🔌 Integrations</div>
            <button className="btn btn-sm" style={{ background: "var(--glass)", border: "1px solid var(--border)" }} onClick={() => setShowAddIntegration && setShowAddIntegration(true)}>+ Add</button>
          </div>
          <div className="card-body">
            {[
              { name: "ClickUp", status: "Connected", icon: "⚡" },
              { name: "GitHub", status: "Connected", icon: "🐙" },
              { name: "Slack", status: "Connected", icon: "💬" },
              { name: "Jira", status: "Not connected", icon: "📋" },
            ].map((int, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: "1.2rem" }}>{int.icon}</div>
                <div style={{ flex: 1, fontSize: ".8rem", fontWeight: 600 }}>{int.name}</div>
                <div style={{ fontSize: ".65rem", padding: "2px 8px", borderRadius: 4, background: int.status === "Connected" ? "rgba(0,255,133,0.1)" : "rgba(255,255,255,0.06)", color: int.status === "Connected" ? "var(--green)" : "var(--muted)" }}>{int.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const PAGE_TITLES = {
  home: "Home", dashboard: "Dashboard", activity: "Activity", sprint: "Sprint Board",
  bugs: "Bugs", allbugs: "All Bugs", kanban: "Kanban Board", stories: "User Stories", duplicates: "Duplicates",
  tests: "Tests", alltests: "All Tests", record: "Record Test", runs: "Test Runs", mobile: "Mobile Tests", api: "API Tests", elements: "Element Repo", cloud: "Cloud Runner",
  ai: "AI Panel", aitriage: "AI Triage", flows: "Flow Discovery", predictions: "Predictions", generate: "Generate Tests",
  automation: "Automation",
  clickup: "ClickUp",
  settings: "Settings", reports: "Reports",
};

function ActivityPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card green">
          <div className="stat-label">Events Today</div>
          <div className="stat-value">24</div>
          <div className="stat-sub">+5 from yesterday</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Test Runs</div>
          <div className="stat-value">12</div>
          <div className="stat-sub">Completed</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Bugs Created</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">Auto-detected</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">AI Actions</div>
          <div className="stat-value">8</div>
          <div className="stat-sub">This week</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">⚡ Live Activity</div></div>
        <table>
          <thead><tr><th>Time</th><th>Action</th><th>User</th></tr></thead>
          <tbody>
            {[
              { time: "2 min ago", action: "Login Flow self-healed + passed", user: "AI" },
              { time: "15 min ago", action: "Bug BUG-234 auto-created by AI", user: "AI" },
              { time: "1 hr ago", action: "BUG-226 closed in ClickUp", user: "System" },
              { time: "2 hr ago", action: "AI generated 3 tests from flows", user: "AI" },
              { time: "3 hr ago", action: "Parallel run: 10 tests in 43s", user: "Cloud" },
              { time: "4 hr ago", action: "iOS test suite failed — 2 bugs created", user: "System" },
            ].map((a, i) => (
              <tr key={i}>
                <td style={{ fontSize: ".75rem", color: "var(--muted)" }}>{a.time}</td>
                <td>{a.action}</td>
                <td><span className="badge badge-minor">{a.user}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SprintPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card green">
          <div className="stat-label">Sprint</div>
          <div className="stat-value">4</div>
          <div className="stat-sub">Current</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Days Left</div>
          <div className="stat-value">4</div>
          <div className="stat-sub">Of 14</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Stories</div>
          <div className="stat-value">24</div>
          <div className="stat-sub">Total</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Completion</div>
          <div className="stat-value">50%</div>
          <div className="stat-sub">On track</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">🗺️ Sprint 4 Board</div></div>
        <div className="card-body">
          <div className="sprint-info">
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--green)" }}>12</div><div className="sprint-stat-lbl">Done</div></div>
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--blue)" }}>5</div><div className="sprint-stat-lbl">In Progress</div></div>
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--pink)" }}>3</div><div className="sprint-stat-lbl">Blocked</div></div>
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--muted)" }}>4</div><div className="sprint-stat-lbl">To Do</div></div>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: "50%" }}></div></div>
          <div className="progress-labels"><span>0</span><span style={{ color: "var(--green)", fontWeight: 600 }}>50% complete</span><span>24</span></div>
        </div>
      </div>
    </>
  );
}

function AllTestsPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage, bugs = [], tests = [] }) {
  const passRate = tests.length ? Math.round((tests.filter(t => t.status === "passed").length / tests.length) * 100) : 0;
  const failed = tests.filter(t => t.status === "failed").length;
  return (
    <>
      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-label">Total Tests</div>
          <div className="stat-value">{tests.length}</div>
          <div className="stat-sub">Web + Mobile + API</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Pass Rate</div>
          <div className="stat-value">{passRate}%</div>
          <div className="stat-sub">+2% vs last sprint</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Failed</div>
          <div className="stat-value">{failed}</div>
          <div className="stat-sub">Needs attention</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Coverage</div>
          <div className="stat-value">78%</div>
          <div className="stat-sub">Code coverage</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">🧪 All Test Cases</div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowNewTest(true)}>+ New Test</button>
        </div>
        <table>
          <thead><tr><th>Test Name</th><th>Type</th><th>Status</th><th>Last Run</th></tr></thead>
          <tbody>
            {tests.map((t, i) => (
              <tr key={i}>
                <td>{t.name}</td>
                <td><span className="badge badge-minor">{t.type}</span></td>
                <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                <td style={{ fontSize: ".7rem", color: "var(--muted)" }}>{t.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function RecordTestPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Recorded Tests</div>
          <div className="stat-value">6</div>
          <div className="stat-sub">This month</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Steps Recorded</div>
          <div className="stat-value">48</div>
          <div className="stat-sub">Total steps</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Time Saved</div>
          <div className="stat-value">12h</div>
          <div className="stat-sub">Automation time</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">🎥 Record New Test</div></div>
        <div className="card-body" style={{ textAlign: "center", padding: "4rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎥</div>
          <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: ".5rem" }}>Click to start recording</div>
          <div style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: "1.5rem" }}>Record your browser actions as an automated test</div>
          <button className="btn btn-primary" onClick={() => setShowStartRecording && setShowStartRecording(true)}>Start Recording</button>
        </div>
      </div>
    </>
  );
}

function TestRunsPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card green">
          <div className="stat-label">Passed</div>
          <div className="stat-value">21</div>
          <div className="stat-sub">87% pass rate</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Failed</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">Needs fix</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Running</div>
          <div className="stat-value">1</div>
          <div className="stat-sub">In progress</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Avg Duration</div>
          <div className="stat-value">3.2s</div>
          <div className="stat-sub">Per test</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">▶️ Test Runs History</div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowRunTests && setShowRunTests(true)}>▶️ Run All</button>
        </div>
        <table>
          <thead><tr><th>Test</th><th>Status</th><th>Duration</th><th>Time</th></tr></thead>
          <tbody>
            {[
              { name: "Login Flow — US-01", status: "passed", dur: "2.3s", time: "2 min ago" },
              { name: "Checkout Test — US-02", status: "failed", dur: "5.1s", time: "5 min ago" },
              { name: "Search Feature — US-03", status: "passed", dur: "1.8s", time: "10 min ago" },
              { name: "POST /api/login", status: "passed", dur: "0.2s", time: "15 min ago" },
            ].map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                <td style={{ fontSize: ".75rem" }}>{r.dur}</td>
                <td style={{ fontSize: ".7rem", color: "var(--muted)" }}>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MobileTestsPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Mobile Tests</div>
          <div className="stat-value">6</div>
          <div className="stat-sub">iOS + Android</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Pass Rate</div>
          <div className="stat-value">67%</div>
          <div className="stat-sub">4 of 6 passing</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Failed</div>
          <div className="stat-value">2</div>
          <div className="stat-sub">iOS issues</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">📱 Mobile Test Cases</div></div>
        <table>
          <thead><tr><th>Test</th><th>Platform</th><th>Status</th></tr></thead>
          <tbody>
            {[
              { name: "iOS Checkout", platform: "iOS", status: "failed" },
              { name: "Android Login", platform: "Android", status: "passed" },
              { name: "iOS Profile", platform: "iOS", status: "passed" },
              { name: "Android Search", platform: "Android", status: "passed" },
            ].map((m, i) => (
              <tr key={i}>
                <td>{m.name}</td>
                <td><span className="badge badge-minor">{m.platform}</span></td>
                <td><span className={`badge badge-${m.status}`}>{m.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function APITestsPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-label">API Tests</div>
          <div className="stat-value">12</div>
          <div className="stat-sub">Endpoints</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Pass Rate</div>
          <div className="stat-value">100%</div>
          <div className="stat-sub">All passing</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Avg Response</div>
          <div className="stat-value">120ms</div>
          <div className="stat-sub">Response time</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">🌐 API Test Cases</div></div>
        <table>
          <thead><tr><th>Endpoint</th><th>Method</th><th>Status</th></tr></thead>
          <tbody>
            {[
              { endpoint: "/api/login", method: "POST", status: "passed" },
              { endpoint: "/api/users", method: "GET", status: "passed" },
              { endpoint: "/api/products", method: "GET", status: "passed" },
              { endpoint: "/api/orders", method: "POST", status: "passed" },
            ].map((a, i) => (
              <tr key={i}>
                <td style={{ fontFamily: "monospace" }}>{a.endpoint}</td>
                <td><span className="badge badge-minor">{a.method}</span></td>
                <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ElementRepoPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Elements</div>
          <div className="stat-value">156</div>
          <div className="stat-sub">In repository</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Pages</div>
          <div className="stat-value">8</div>
          <div className="stat-sub">Tracked</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Reusability</div>
          <div className="stat-value">73%</div>
          <div className="stat-sub">Shared elements</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">📦 Element Repository</div></div>
        <table>
          <thead><tr><th>Element</th><th>Page</th><th>Locator</th></tr></thead>
          <tbody>
            {[
              { element: "Login Button", page: "Login", locator: "#login-btn" },
              { element: "Search Input", page: "Home", locator: "#search" },
              { element: "Checkout Button", page: "Cart", locator: ".checkout" },
              { element: "Profile Menu", page: "Dashboard", locator: ".profile" },
            ].map((e, i) => (
              <tr key={i}>
                <td>{e.element}</td>
                <td>{e.page}</td>
                <td style={{ fontFamily: "monospace", fontSize: ".75rem" }}>{e.locator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function CloudRunnerPage({ showToast, setShowRunTests }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-label">Total Runs</div>
          <div className="stat-value">156</div>
          <div className="stat-sub">This month</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Time Saved</div>
          <div className="stat-value">42h</div>
          <div className="stat-sub">Automation</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Cost</div>
          <div className="stat-value">$24</div>
          <div className="stat-sub">This month</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">☁️ Cloud Runner</div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowRunTests && setShowRunTests(true)}>▶️ Run All Tests</button>
        </div>
        <div className="card-body">
          <div style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: "1rem" }}>Available Resources</div>
          {[
            { name: "Windows VM - Chrome", used: 7, total: 10 },
            { name: "Mac VM - Safari", used: 3, total: 5 },
            { name: "Android Emulator", used: 2, total: 7 },
            { name: "iOS Simulator", used: 1, total: 4 },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ flex: 1, fontSize: ".8rem" }}>{r.name}</div>
              <div style={{ fontSize: ".7rem", color: "var(--muted)" }}>{r.used}/{r.total}</div>
              <div style={{ width: 80 }}><div className="progress-bar"><div className="progress-fill" style={{ width: (r.used/r.total*100) + "%", background: r.used/r.total > 0.7 ? "var(--pink)" : "var(--green)" }}></div></div></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const KANBAN_INITIAL = {
  open: [
    { id: 201, title: "Payment fails on Safari",  priority: "Critical", tag: "payments" },
    { id: 202, title: "Checkout not visible iOS", priority: "High",     tag: "mobile"   },
    { id: 203, title: "Search order issue",        priority: "Medium",   tag: "search"   },
  ],
  inProgress: [
    { id: 204, title: "Login uppercase fix",       priority: "Medium",   tag: "auth"     },
    { id: 205, title: "Mobile nav scroll bug",     priority: "High",     tag: "mobile"   },
  ],
  inReview: [
    { id: 206, title: "Dashboard slow mobile",     priority: "Medium",   tag: "performance" },
  ],
  resolved: [
    { id: 207, title: "404 on profile page",       priority: "Low",      tag: "routing"  },
    { id: 208, title: "Token expiry crash",        priority: "High",     tag: "auth"     },
  ],
};

const KANBAN_COLS = [
  { id: "open",       label: "Open",        emoji: "🔴", accent: "#FF4466", glow: "rgba(255,68,102,0.18)"  },
  { id: "inProgress", label: "In Progress", emoji: "🔵", accent: "#1E90FF", glow: "rgba(30,144,255,0.18)"  },
  { id: "inReview",   label: "In Review",   emoji: "🟡", accent: "#FFD700", glow: "rgba(255,215,0,0.18)"   },
  { id: "resolved",   label: "Resolved",    emoji: "🟢", accent: "#00FF85", glow: "rgba(0,255,133,0.18)"   },
];

const KANBAN_PRIO = {
  Critical: { color: "#FF4466", bg: "rgba(255,68,102,0.12)", border: "rgba(255,68,102,0.35)" },
  High:     { color: "#FF9500", bg: "rgba(255,149,0,0.12)",  border: "rgba(255,149,0,0.35)"  },
  Medium:   { color: "#1E90FF", bg: "rgba(30,144,255,0.12)", border: "rgba(30,144,255,0.35)" },
  Low:      { color: "#00FF85", bg: "rgba(0,255,133,0.12)",  border: "rgba(0,255,133,0.35)"  },
};

const KANBAN_TAG_COLOR = {
  payments: "#FF4466", mobile: "#9D4EDD", search: "#1E90FF",
  auth: "#FFD700", performance: "#FF9500", routing: "#00FF85",
};

function KanbanPage({ showToast }) {
  const [bugs,      setBugs]      = useState(KANBAN_INITIAL);
  const [dragging,  setDragging]  = useState(null);
  const [overCol,   setOverCol]   = useState(null);
  const [overBugId, setOverBugId] = useState(null);
  const [dropped,   setDropped]   = useState(null);
  const dragNode                  = useRef(null);

  const onDragStart = (e, bugId, fromCol) => {
    setDragging({ bugId, fromCol });
    dragNode.current = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => dragNode.current && (dragNode.current.style.opacity = "0.35"), 0);
  };

  const onDragEnd = () => {
    if (dragNode.current) dragNode.current.style.opacity = "1";
    dragNode.current = null;
    setDragging(null);
    setOverCol(null);
    setOverBugId(null);
  };

  const onDragOverCol  = (e, colId) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setOverCol(colId); };
  const onDragOverCard = (e, bugId) => { e.preventDefault(); e.stopPropagation(); setOverBugId(bugId); };

  const onDrop = (e, toCol) => {
    e.preventDefault();
    if (!dragging) return;
    const { bugId, fromCol } = dragging;
    if (fromCol === toCol && overBugId === null) { onDragEnd(); return; }
    setBugs(prev => {
      const next = { ...prev };
      const bug  = next[fromCol].find(b => b.id === bugId);
      next[fromCol] = next[fromCol].filter(b => b.id !== bugId);
      if (overBugId !== null) {
        const idx = next[toCol].findIndex(b => b.id === overBugId);
        const arr = [...next[toCol]];
        arr.splice(idx, 0, bug);
        next[toCol] = arr;
      } else {
        next[toCol] = [...next[toCol], bug];
      }
      return next;
    });
    setDropped(bugId);
    setTimeout(() => setDropped(null), 700);
    onDragEnd();
  };

  const total = Object.values(bugs).reduce((s, arr) => s + arr.length, 0);

  return (
    <>
      <style>{`
        @keyframes kanban-flash { 0%{box-shadow:0 0 0 0 rgba(0,255,133,0)} 40%{box-shadow:0 0 0 6px rgba(0,255,133,0.45)} 100%{box-shadow:0 0 0 0 rgba(0,255,133,0)} }
        @keyframes kanban-fadeup { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .k-card { background:rgba(255,255,255,0.035); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px 13px; cursor:grab; transition:transform .18s,box-shadow .18s,border-color .18s,background .18s; animation:kanban-fadeup .3s ease both; user-select:none; }
        .k-card:active { cursor:grabbing; }
        .k-card:hover  { transform:translateY(-2px); background:rgba(255,255,255,0.055); border-color:rgba(255,255,255,0.15); box-shadow:0 8px 24px rgba(0,0,0,.5); }
        .k-card.k-over  { border-top:2px solid #FF0099 !important; }
        .k-card.k-dropped { animation:kanban-flash .7s ease forwards; }
        .k-col { border-radius:12px; transition:background .2s,box-shadow .2s; min-height:100px; }
        .k-col.k-col-over { background:rgba(255,255,255,0.025) !important; }
        .k-badge { display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700; }
        .k-tag   { display:inline-flex;align-items:center;padding:1px 7px;border-radius:999px;font-size:10px;font-weight:600;opacity:.8; }
      `}</style>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, marginBottom:4 }}>📋 Kanban Board</h1>
          <p style={{ color:"#4a5568", fontSize:13 }}>{total} bugs · drag cards to move between columns</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {KANBAN_COLS.map(col => (
            <div key={col.id} style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:8, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", fontSize:11, color:col.accent, fontWeight:600 }}>
              <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background:col.accent }} />
              {bugs[col.id].length} {col.label}
            </div>
          ))}
        </div>
      </div>

      {/* Board */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, alignItems:"start" }}>
        {KANBAN_COLS.map(col => {
          const isOver = overCol === col.id;
          return (
            <div key={col.id}
              className={`k-col${isOver ? " k-col-over" : ""}`}
              onDragOver={e => onDragOverCol(e, col.id)}
              onDrop={e => onDrop(e, col.id)}
              onDragLeave={() => { setOverCol(null); setOverBugId(null); }}
              style={{ background:"rgba(255,255,255,0.015)", border:`1px solid ${isOver ? col.accent : "rgba(255,255,255,0.06)"}`, boxShadow:isOver ? `0 0 20px ${col.glow}` : "none", padding:"13px 11px" }}>

              {/* Column header */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span>{col.emoji}</span>
                  <span style={{ fontFamily:"Syne,sans-serif", fontSize:13, fontWeight:700, color:col.accent }}>{col.label}</span>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:col.accent, background:col.glow, border:`1px solid ${col.accent}33`, borderRadius:99, padding:"1px 8px" }}>
                  {bugs[col.id].length}
                </span>
              </div>
              <div style={{ height:2, background:`linear-gradient(90deg,${col.accent}55,transparent)`, borderRadius:2, marginBottom:10 }} />

              {/* Cards */}
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {bugs[col.id].map((bug, idx) => {
                  const p = KANBAN_PRIO[bug.priority];
                  const isOverThis = overBugId === bug.id && dragging?.bugId !== bug.id;
                  const isDropped  = dropped === bug.id;
                  return (
                    <div key={bug.id} draggable
                      onDragStart={e => onDragStart(e, bug.id, col.id)}
                      onDragEnd={onDragEnd}
                      onDragOver={e => onDragOverCard(e, bug.id)}
                      className={`k-card${isOverThis ? " k-over" : ""}${isDropped ? " k-dropped" : ""}`}
                      style={{ animationDelay:`${idx * 0.05}s` }}>
                      <div style={{ fontSize:12, fontWeight:600, color:"#E8EDF5", lineHeight:1.4, marginBottom:9 }}>{bug.title}</div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <span className="k-badge" style={{ background:p.bg, color:p.color, border:`1px solid ${p.border}` }}>{bug.priority}</span>
                        <span className="k-tag"   style={{ background:`${KANBAN_TAG_COLOR[bug.tag]}18`, color:KANBAN_TAG_COLOR[bug.tag], border:`1px solid ${KANBAN_TAG_COLOR[bug.tag]}30` }}>#{bug.tag}</span>
                      </div>
                      <div style={{ marginTop:7, display:"flex", gap:3, opacity:.2 }}>
                        {[0,1,2].map(i => <div key={i} style={{ width:16, height:2, background:"#fff", borderRadius:2 }} />)}
                      </div>
                    </div>
                  );
                })}
                {bugs[col.id].length === 0 && (
                  <div style={{ padding:"18px 10px", textAlign:"center", color:"#2a3040", fontSize:12, border:`2px dashed ${isOver ? col.accent : "rgba(255,255,255,0.06)"}`, borderRadius:8, transition:"border-color .2s" }}>
                    {isOver ? "Drop here" : "No bugs"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Drag tooltip */}
      {dragging && (
        <div style={{ position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)", padding:"8px 18px", background:"rgba(13,18,33,0.97)", border:"1px solid rgba(255,0,153,0.4)", borderRadius:99, fontSize:12, color:"#FF0099", fontWeight:600, boxShadow:"0 0 20px rgba(255,0,153,0.2)", pointerEvents:"none", zIndex:999 }}>
          Drop into any column ↑
        </div>
      )}
    </>
  );
}

function UserStoriesPage({ showToast }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-label">Total Stories</div>
          <div className="stat-value">24</div>
          <div className="stat-sub">Sprint 4</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Completed</div>
          <div className="stat-value">12</div>
          <div className="stat-sub">50%</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">5</div>
          <div className="stat-sub">21%</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">🗂️ User Stories</div></div>
        <table>
          <thead><tr><th>Story</th><th>Progress</th><th>Bugs</th></tr></thead>
          <tbody>
            {[
              { story: "US-01: User Authentication Flow", progress: 100, bugs: 0 },
              { story: "US-02: Checkout & Payment", progress: 65, bugs: 2 },
              { story: "US-03: Search & Filtering", progress: 40, bugs: 3 },
              { story: "US-04: User Profile Settings", progress: 80, bugs: 1 },
            ].map((s, i) => (
              <tr key={i}>
                <td>{s.story}</td>
                <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}><div style={{ width: s.progress + "%", height: "100%", background: "var(--blue)", borderRadius: 3 }}></div></div><span style={{ fontSize: ".7rem" }}>{s.progress}%</span></div></td>
                <td>{s.bugs === 0 ? <span style={{ color: "var(--green)" }}>✓ Clean</span> : <span style={{ color: "var(--pink)" }}>{s.bugs} bugs</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function DuplicatesPage({ showToast }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card yellow">
          <div className="stat-label">Potential Duplicates</div>
          <div className="stat-value">4</div>
          <div className="stat-sub">Need review</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Merged</div>
          <div className="stat-value">12</div>
          <div className="stat-sub">This month</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">🔍 Duplicate Bugs</div></div>
        <table>
          <thead><tr><th>Original</th><th>Duplicate</th><th>Similarity</th></tr></thead>
          <tbody>
            {[
              { original: "BUG-234", duplicate: "BUG-229", similarity: "87%" },
              { original: "BUG-231", duplicate: "BUG-225", similarity: "72%" },
            ].map((d, i) => (
              <tr key={i}>
                <td className="bug-id">{d.original}</td>
                <td className="bug-id">{d.duplicate}</td>
                <td><span className="badge badge-minor">{d.similarity}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AITriagePage({ showToast }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Triaged</div>
          <div className="stat-value">12</div>
          <div className="stat-sub">This week</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Accuracy</div>
          <div className="stat-value">92%</div>
          <div className="stat-sub">AI confidence</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Time Saved</div>
          <div className="stat-value">4h</div>
          <div className="stat-sub">Manual work</div>
        </div>
      </div>
      <div className="ai-panel">
        <div className="ai-header"><span>🤖</span><div style={{ fontWeight: 700, flex: 1 }}>AI Triage Results</div></div>
        {[
          { bug: "BUG-234", root: "Stripe SDK timeout on Safari", conf: "92%" },
          { bug: "BUG-233", root: "Case sensitivity in auth validation", conf: "88%" },
        ].map((t, i) => (
          <div key={i} className="ai-item">
            <div className="ai-item-title">🧠 {t.bug}</div>
            <div className="ai-item-desc"><strong>Root cause:</strong> {t.root}</div>
            <div className="ai-confidence"><span style={{ fontSize: ".65rem" }}>AI confidence</span><div className="ai-conf-bar"><div className="ai-conf-fill" style={{ width: t.conf }}></div></div><div className="ai-conf-val">{t.conf}</div></div>
          </div>
        ))}
      </div>
    </>
  );
}

function FlowDiscoveryPage({ showToast }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Discovered Flows</div>
          <div className="stat-value">8</div>
          <div className="stat-sub">New this week</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Coverage Gap</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">High priority</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">🧠 Flow Discovery</div></div>
        <div className="card-body">
          {[
            { flow: "Checkout → Payment → Success", priority: "High", uncovered: true },
            { flow: "Login → Forgot Password → Reset", priority: "Medium", uncovered: false },
            { flow: "Search → Filter → Sort", priority: "High", uncovered: true },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ flex: 1 }}>{f.flow}</div>
              <span className={`badge badge-${f.priority.toLowerCase()}`}>{f.priority}</span>
              {f.uncovered && <span className="badge badge-blocker" style={{ fontSize: ".6rem" }}>No test</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PredictionsPage({ showToast }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Active Predictions</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">Risk alerts</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Accuracy</div>
          <div className="stat-value">84%</div>
          <div className="stat-sub">Historical</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">🔮 AI Predictions</div></div>
        <div className="card-body">
          {[
            { title: "Payment module regression likely", risk: "High", conf: 78 },
            { title: "Login edge case not covered", risk: "Medium", conf: 65 },
            { title: "Search performance issue", risk: "Low", conf: 45 },
          ].map((p, i) => (
            <div key={i} className="ai-item" style={{ marginBottom: 8 }}>
              <div className="ai-item-title">{p.title}</div>
              <div className="ai-confidence">
                <span style={{ fontSize: 10, color: p.risk === "High" ? "var(--pink)" : p.risk === "Medium" ? "var(--yellow)" : "var(--green)" }}>{p.risk} Risk</span>
                <div className="ai-conf-bar"><div className="ai-conf-fill" style={{ width: p.conf + "%" }}></div></div>
                <div className="ai-conf-val">{p.conf}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function GenerateTestsPage({ showToast, setShowGenerateTests }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Generated</div>
          <div className="stat-value">8</div>
          <div className="stat-sub">This week</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Pass Rate</div>
          <div className="stat-value">75%</div>
          <div className="stat-sub">Of generated</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Ready to Generate</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">New flows</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">⚡ Generate Tests</div></div>
        <div className="card-body" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚡</div>
          <div style={{ fontSize: "1rem", fontWeight: 600, marginBottom: ".5rem" }}>AI is ready to generate 3 new tests</div>
          <div style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: "1.5rem" }}>Based on discovered user flows without test coverage</div>
          <button className="btn btn-primary" onClick={() => setShowGenerateTests && setShowGenerateTests(true)}>Generate Tests</button>
        </div>
      </div>
    </>
  );
}

function ReportsPage({ showToast }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-label">Reports</div>
          <div className="stat-value">12</div>
          <div className="stat-sub">Available</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Scheduled</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">Weekly</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">📊 Available Reports</div></div>
        <table>
          <thead><tr><th>Report</th><th>Type</th><th>Last Generated</th></tr></thead>
          <tbody>
            {[
              { name: "Sprint Summary", type: "PDF", last: "Today" },
              { name: "Bug Trend Analysis", type: "Excel", last: "Yesterday" },
              { name: "Test Coverage", type: "Dashboard", last: "Today" },
            ].map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td><span className="badge badge-minor">{r.type}</span></td>
                <td style={{ fontSize: ".7rem", color: "var(--muted)" }}>{r.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function InviteModal({ isOpen, onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  
  const handleSubmit = () => {
    if (email) {
      onSubmit(email);
      setEmail("");
      onClose();
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="✉️ Invite Team Member">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Email Address</div>
          <input 
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
          />
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Role</div>
          <select style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem" }}>
            <option>QA Engineer</option>
            <option>Developer</option>
            <option>Product Manager</option>
            <option>Viewer</option>
          </select>
        </div>
        <button onClick={handleSubmit} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>✉️ Send Invitation</button>
      </div>
    </Modal>
  );
}

function ExportModal({ isOpen, onClose, onSubmit }) {
  const [format, setFormat] = useState("csv");
  const [data, setData] = useState({ bugs: true, tests: true, results: false, coverage: false });
  
  const handleSubmit = () => {
    onSubmit(format);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📊 Export Data">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase" }}>Export Format</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {["CSV", "Excel", "JSON", "PDF"].map(f => (
              <div 
                key={f}
                onClick={() => setFormat(f.toLowerCase())}
                style={{ 
                  padding: 12, 
                  background: format === f.toLowerCase() ? "rgba(255,0,153,0.15)" : "rgba(255,255,255,0.04)", 
                  border: format === f.toLowerCase() ? "1px solid var(--pink)" : "1px solid var(--border)",
                  borderRadius: 8, 
                  textAlign: "center", 
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: ".85rem"
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleSubmit} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>📥 Export {format.toUpperCase()}</button>
      </div>
    </Modal>
  );
}

function SearchModal({ isOpen, onClose, onSubmit }) {
  const [query, setQuery] = useState("");
  
  const handleSubmit = () => {
    if (query) {
      onSubmit(query);
      onClose();
    }
  };
  
  const recentSearches = ["BUG-234", "Login Flow", "Checkout", "Safari", "Payment"];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🔍 Search">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input 
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="Search bugs, tests, stories..."
          autoFocus
          style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: "1rem", outline: "none" }}
        />
        <div>
          <div style={{ fontSize: ".7rem", color: "var(--muted)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase" }}>Recent Searches</div>
          {recentSearches.map(s => (
            <div 
              key={s}
              onClick={() => { setQuery(s); onSubmit(s); onClose(); }}
              style={{ padding: "8px 0", cursor: "pointer", fontSize: ".85rem", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              🔍 {s}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function ProfileModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "Waleed Said", email: "waleed@company.com", role: "QA Lead" });
  
  const handleSubmit = () => {
    onSubmit("Profile");
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="👤 Profile Settings">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,var(--pink),var(--purple))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 700 }}>W</div>
          <div>
            <div style={{ fontWeight: 600 }}>{form.name}</div>
            <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>{form.role}</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Full Name</div>
          <input 
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
          />
        </div>
        <button onClick={handleSubmit} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>💾 Save Changes</button>
      </div>
    </Modal>
  );
}

function UserStoryModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", assignee: "", acceptanceCriteria: "" });
  
  const handleSubmit = () => {
    if (form.title) {
      onSubmit(form);
      setForm({ title: "", description: "", priority: "medium", assignee: "", acceptanceCriteria: "" });
      onClose();
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🗂️ Create User Story">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Story Title</div>
          <input 
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            placeholder="e.g., User Authentication Flow"
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Priority</div>
            <select 
              value={form.priority}
              onChange={e => setForm({...form, priority: e.target.value})}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem" }}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Assignee</div>
            <select 
              value={form.assignee}
              onChange={e => setForm({...form, assignee: e.target.value})}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem" }}
            >
              <option value="">Unassigned</option>
              <option value="Alice">Alice</option>
              <option value="Bob">Bob</option>
              <option value="Charlie">Charlie</option>
            </select>
          </div>
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Description</div>
          <textarea 
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            placeholder="Describe the user story..."
            rows={4}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none", resize: "vertical" }}
          />
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Acceptance Criteria</div>
          <textarea 
            value={form.acceptanceCriteria}
            onChange={e => setForm({...form, acceptanceCriteria: e.target.value})}
            placeholder="1. User can log in with email&#10;2. User receives confirmation email&#10;3. Session persists across refresh"
            rows={3}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none", resize: "vertical" }}
          />
        </div>
        <button onClick={handleSubmit} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>🗂️ Create User Story</button>
      </div>
    </Modal>
  );
}

function Pagination({ current, total, onPageChange }) {
  const pages = [];
  for (let i = 1; i <= Math.min(total, 5); i++) pages.push(i);
  
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24 }}>
      <button 
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: current === 1 ? "var(--muted)" : "var(--text)", cursor: current === 1 ? "not-allowed" : "pointer" }}
      >
        ← Prev
      </button>
      {pages.map(p => (
        <button 
          key={p}
          onClick={() => onPageChange(p)}
          style={{ 
            padding: "6px 12px", 
            background: current === p ? "var(--pink)" : "rgba(255,255,255,0.06)", 
            border: "1px solid var(--border)", 
            borderRadius: 6, 
            color: current === p ? "#fff" : "var(--text)", 
            cursor: "pointer" 
          }}
        >
          {p}
        </button>
      ))}
      <button 
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: current === total ? "var(--muted)" : "var(--text)", cursor: current === total ? "not-allowed" : "pointer" }}
      >
        Next →
      </button>
    </div>
  );
}

function getPageContent(page, showToast, modals = {}) {
  const props = { showToast, ...modals };
  switch (page) {
    case "home":
    case "dashboard":
      return <DashboardPage {...props} />;
    case "activity":
      return <ActivityPage {...props} />;
    case "sprint":
      return <SprintPage {...props} />;
    case "bugs":
      return <BugsPage {...props} />;
    case "alltests":
      return <AllTestsPage {...props} />;
    case "record":
      return <RecordTestPage {...props} />;
    case "runs":
      return <TestRunsPage {...props} />;
    case "mobile":
      return <MobileTestsPage {...props} />;
    case "api":
      return <APITestsPage {...props} />;
    case "elements":
      return <ElementRepoPage {...props} />;
    case "cloud":
      return <CloudRunnerPage {...props} />;
    case "tests":
      return <TestsPage {...props} />;
    case "allbugs":
      return <BugsPage {...props} />;
    case "kanban":
      return <KanbanPage {...props} />;
    case "stories":
      return <UserStoriesPage {...props} />;
    case "duplicates":
      return <DuplicatesPage {...props} />;
    case "ai":
      return <AIPanelPage {...props} />;
    case "aitriage":
      return <AITriagePage {...props} />;
    case "flows":
      return <FlowDiscoveryPage {...props} />;
    case "predictions":
      return <PredictionsPage {...props} />;
    case "generate":
      return <GenerateTestsPage {...props} />;
    case "automation":
      return <AutomationPage {...props} />;
    case "clickup":
      return <ClickUpPage {...props} />;
    case "reports":
      return <ReportsPage {...props} />;
    case "settings":
      return <SettingsPage {...props} />;
    default:
      return <DashboardPage {...props} />;
  }
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState("");
  const [theme, setTheme] = useState("dark");
  const [showNewBug, setShowNewBug] = useState(false);
  const [showNewTest, setShowNewTest] = useState(false);
  const [showGenerateTests, setShowGenerateTests] = useState(false);
  const [showRunTests, setShowRunTests] = useState(false);
  const [showSyncNow, setShowSyncNow] = useState(false);
  const [showAddIntegration, setShowAddIntegration] = useState(false);
  const [showStartRecording, setShowStartRecording] = useState(false);

  useEffect(() => {
    document.body.classList.add("loaded");
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.body.classList.add(`theme-${savedTheme}`);
    setTimeout(() => showToast("System Ready 🚀"), 1000);
  }, []);

  const setThemeHandler = (newTheme) => {
    document.body.classList.remove("theme-dark", "theme-neon", "theme-cyberpunk");
    document.body.classList.add(`theme-${newTheme}`);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    const canvas = document.getElementById("particles-bg");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.y > canvas.height) this.y = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#FF0099';
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 120; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  // Shared live data — passed down to pages so forms actually update the tables
  const [bugs, setBugs] = useState([
    { id: "BUG-234", title: "Payment fails on Safari — Stripe timeout", priority: "blocker", status: "open" },
    { id: "BUG-233", title: "Login with uppercase email breaks auth", priority: "major", status: "progress" },
    { id: "BUG-231", title: "Checkout button not visible on iOS Safari", priority: "blocker", status: "open" },
    { id: "BUG-229", title: "Dashboard slow load on mobile networks", priority: "minor", status: "progress" },
    { id: "BUG-226", title: "Search results order inconsistent", priority: "minor", status: "fixed" },
  ]);
  const [tests, setTests] = useState([
    { name: "Login Flow — US-01", type: "Web", status: "passed", last: "2 min ago" },
    { name: "Checkout Test — US-02", type: "Web", status: "failed", last: "5 min ago" },
    { name: "Search Feature — US-03", type: "Web", status: "passed", last: "10 min ago" },
    { name: "POST /api/login", type: "API", status: "passed", last: "15 min ago" },
    { name: "iOS Checkout", type: "Mobile", status: "failed", last: "1 hr ago" },
    { name: "Profile Update — US-04", type: "Web", status: "passed", last: "2 hr ago" },
  ]);

  const showToast = (msg) => setToast(msg);

  const handleNewBug = (form) => {
    if (!form.title) return;
    const newId = "BUG-" + (235 + bugs.length);
    setBugs(prev => [{ id: newId, title: form.title, priority: form.priority || "minor", status: "open" }, ...prev]);
    showToast(`Bug "${form.title}" created — ${newId}`);
  };

  const handleNewTest = (form) => {
    if (!form.name) return;
    setTests(prev => [{ name: form.name, type: form.type || "Web", status: "passed", last: "Just now" }, ...prev]);
    showToast(`Test "${form.name}" created successfully!`);
  };

  const handleGenerateTests = (flows) => {
    showToast(`Generating ${flows.length} tests with AI...`);
  };

  const handleRunTests = (config) => {
    showToast(`Starting test run: ${config.type} on ${config.browser}...`);
  };

  const handleSyncNow = (sync) => {
    showToast("Syncing with ClickUp...");
  };

  const handleAddIntegration = (name) => {
    showToast(`Connecting to ${name}...`);
  };

  const handleStartRecording = () => {
    showToast("Recording started! Click Stop when done.");
  };

  const [showInvite, setShowInvite] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNewUserStory, setShowNewUserStory] = useState(false);

  const handleInvite = (email) => {
    showToast(`Invitation sent to ${email}!`);
  };

  const handleExport = (format) => {
    showToast(`Exporting data as ${format}...`);
  };

  const handleSearch = (query) => {
    showToast(`Searching for "${query}"...`);
  };

  const handleProfile = (action) => {
    showToast(`${action} saved!`);
  };

  const handleNewUserStory = (form) => {
    showToast(`User Story "${form.title}" created successfully!`);
  };

  return (
    <div style={{ background: "#121212", color: "#E0E0E0", fontFamily: "'Inter', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        :root{--bg:#121212;--surface:#1a1a2e;--pink:#FF0099;--green:#00FF85;--blue:#1E90FF;--yellow:#FFD700;--purple:#9D4EDD;--text:#E0E0E0;--muted:#666;--border:rgba(255,255,255,0.08);--glass:rgba(255,255,255,0.05);}
        *{margin:0;padding:0;box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:#1a1a1a;}
        ::-webkit-scrollbar-thumb{background:#333;border-radius:3px;}
        @keyframes pulse{0%{transform:scale(.95);box-shadow:0 0 0 0 rgba(255,0,153,.7)}70%{transform:scale(1);box-shadow:0 0 0 6px rgba(255,0,153,0)}100%{transform:scale(.95);box-shadow:0 0 0 0 rgba(255,0,153,0)}}
        @keyframes toastIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 50% at 20% 0%,rgba(255,0,153,0.06) 0%,transparent 60%),radial-gradient(ellipse 60% 40% at 80% 100%,rgba(30,144,255,0.06) 0%,transparent 60%);pointer-events:none;z-index:0;}
        nav{position:sticky;top:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:.9rem 2rem;background:rgba(18,18,18,0.9);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);}
        .nav-logo{font-size:1.2rem;font-weight:700;background:linear-gradient(90deg,var(--pink),var(--blue));-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.5px;}
        .nav-logo span{-webkit-text-fill-color:rgba(255,255,255,0.4);font-weight:300;}
        .nav-right{display:flex;align-items:center;gap:1rem;}
        .nav-badge{padding:.3rem .8rem;border-radius:999px;font-size:.72rem;font-weight:600;background:rgba(255,0,153,0.1);border:1px solid rgba(255,0,153,0.3);color:var(--pink);}
        .nav-link{padding:.32rem .65rem;border-radius:6px;font-size:.75rem;color:rgba(255,255,255,0.35);text-decoration:none;white-space:nowrap;transition:all .25s;background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;}
        .nav-link:hover{color:#fff;background:rgba(255,255,255,0.04);}
        .nav-link.active{color:#FF0099;background:rgba(255,0,153,0.15);border:1px solid rgba(255,0,153,0.2);}
        .nav-search{background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:8px;padding:.4rem .8rem;font-size:.82rem;outline:none;color:var(--text);width:180px;}
        .nav-search::placeholder{color:var(--muted);}
        .btn{padding:.5rem 1.2rem;border-radius:8px;font-size:.82rem;font-weight:600;cursor:pointer;border:none;transition:all .2s;}
        .btn-primary{background:linear-gradient(135deg,var(--pink),var(--purple));color:#fff;box-shadow:0 0 20px rgba(255,0,153,0.3);}
        .btn-primary:hover{box-shadow:0 0 30px rgba(255,0,153,0.5);transform:translateY(-1px);}
        .btn-sm{padding:.35rem .8rem;font-size:.75rem;}
        .layout{display:grid;grid-template-columns:220px 1fr;gap:0;min-height:calc(100vh - 57px);position:relative;z-index:1;}
        .layout-with-right{display:grid;grid-template-columns:220px 1fr 270px;gap:0;min-height:calc(100vh - 57px);position:relative;z-index:1;}
        .layout.layout-with-right{grid-template-columns:220px 1fr 260px;}
        .sidebar{background:rgba(26,26,46,0.5);border-right:1px solid var(--border);padding:1.5rem 1rem;}
        .sidebar-section{margin-bottom:2rem;}
        .sidebar-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin-bottom:.8rem;padding-left:.5rem;}
        .sidebar-item{display:flex;align-items:center;gap:.7rem;padding:.55rem .8rem;border-radius:8px;font-size:.83rem;cursor:pointer;transition:all .15s;color:var(--muted);margin-bottom:.2rem;}
        .sidebar-item:hover{background:var(--glass);color:var(--text);}
        .sidebar-item.active{background:rgba(255,0,153,0.1);color:var(--pink);border:1px solid rgba(255,0,153,0.2);}
        .sidebar-count{margin-left:auto;font-size:.7rem;font-weight:600;padding:.1rem .45rem;border-radius:999px;background:rgba(255,255,255,0.08);}
        .main{padding:1.5rem 2rem;overflow-y:auto;}
        .card{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:12px;backdrop-filter:blur(10px);overflow:hidden;margin-bottom:1.5rem;}
        .card-header{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.2rem;border-bottom:1px solid var(--border);}
        .card-title{font-size:.88rem;font-weight:600;display:flex;align-items:center;gap:.5rem;}
        .card-body{padding:1.2rem;}
        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem;}
        .stat-card{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:12px;padding:1rem 1.2rem;position:relative;overflow:hidden;transition:all .2s;}
        .stat-card:hover{transform:translateY(-2px);border-color:rgba(255,255,255,0.15);}
        .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
        .stat-card.red::before{background:linear-gradient(90deg,var(--pink),transparent);}
        .stat-card.blue::before{background:linear-gradient(90deg,var(--blue),transparent);}
        .stat-card.green::before{background:linear-gradient(90deg,var(--green),transparent);}
        .stat-card.yellow::before{background:linear-gradient(90deg,var(--yellow),transparent);}
        .stat-card.purple::before{background:linear-gradient(90deg,var(--purple),transparent);}
        .stat-label{font-size:.7rem;color:var(--muted);font-weight:500;text-transform:uppercase;letter-spacing:.5px;}
        .stat-value{font-size:2rem;font-weight:700;line-height:1.2;margin:.3rem 0 .2rem;}
        .stat-card.red .stat-value{color:var(--pink);}
        .stat-card.blue .stat-value{color:var(--blue);}
        .stat-card.green .stat-value{color:var(--green);}
        .stat-card.yellow .stat-value{color:var(--yellow);}
        .stat-card.purple .stat-value{color:var(--purple);}
        .stat-sub{font-size:.72rem;color:var(--muted);}
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;}
        table{width:100%;border-collapse:collapse;font-size:.82rem;}
        thead tr{border-bottom:1px solid var(--border);}
        th{padding:.7rem 1rem;text-align:left;font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);}
        td{padding:.8rem 1rem;border-bottom:1px solid rgba(255,255,255,0.04);}
        tr:hover td{background:rgba(255,255,255,0.02);}
        tr:last-child td{border-bottom:none;}
        .bug-id{font-size:.72rem;color:var(--muted);font-family:monospace;}
        .bug-title{font-weight:500;}
        .badge{display:inline-flex;align-items:center;gap:.3rem;padding:.2rem .6rem;border-radius:999px;font-size:.7rem;font-weight:600;}
        .badge-blocker{background:rgba(255,0,153,0.15);color:var(--pink);border:1px solid rgba(255,0,153,0.3);}
        .badge-major{background:rgba(255,165,0,0.15);color:#FFA500;border:1px solid rgba(255,165,0,0.3);}
        .badge-minor{background:rgba(30,144,255,0.15);color:var(--blue);border:1px solid rgba(30,144,255,0.3);}
        .badge-open{background:rgba(255,165,0,0.1);color:#FFA500;border:1px solid rgba(255,165,0,0.2);}
        .badge-progress{background:rgba(30,144,255,0.1);color:var(--blue);border:1px solid rgba(30,144,255,0.2);}
        .badge-fixed{background:rgba(0,255,133,0.1);color:var(--green);border:1px solid rgba(0,255,133,0.2);}
        .badge-passed{background:rgba(0,255,133,0.1);color:var(--green);border:1px solid rgba(0,255,133,0.2);}
        .badge-failed{background:rgba(255,0,153,0.1);color:var(--pink);border:1px solid rgba(255,0,153,0.2);}
        .resolution-bar{height:12px;border-radius:999px;background:rgba(255,255,255,0.08);overflow:hidden;margin:.5rem 0;}
        .resolution-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--green),#00cc6a);box-shadow:0 0 10px rgba(0,255,133,0.4);}
        .resolution-labels{display:flex;justify-content:space-between;font-size:.72rem;color:var(--muted);}
        .ai-panel{background:linear-gradient(135deg,rgba(255,0,153,0.08),rgba(30,144,255,0.05));border:1px solid rgba(255,0,153,0.2);border-radius:12px;padding:1.2rem;margin-bottom:1.5rem;}
        .ai-header{display:flex;align-items:center;gap:8px;margin-bottom:14px;}
        .ai-badge{font-size:.65rem;font-weight:700;background:linear-gradient(135deg,var(--pink),var(--blue));color:#fff;padding:2px 7px;border-radius:4px;}
        .ai-item{background:rgba(255,255,255,0.04);border:1px solid rgba(255,0,153,0.15);border-radius:10px;padding:12px;margin-bottom:8px;}
        .ai-item:last-child{margin-bottom:0;}
        .ai-item-title{font-size:.8rem;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:6px;}
        .ai-item-desc{font-size:.75rem;color:rgba(255,255,255,0.5);line-height:1.5;}
        .ai-confidence{display:flex;align-items:center;gap:6px;margin-top:8px;}
        .ai-conf-bar{flex:1;height:4px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden;}
        .ai-conf-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--pink),var(--blue));}
        .ai-conf-val{font-size:.7rem;color:var(--pink);font-weight:600;}
        .sprint-info{display:flex;justify-content:space-between;margin-bottom:12px;}
        .sprint-stat{text-align:center;}
        .sprint-stat-val{font-size:1.3rem;font-weight:700;}
        .sprint-stat-lbl{font-size:.65rem;color:var(--muted);}
        .progress-bar{height:8px;background:rgba(255,255,255,0.07);border-radius:4px;overflow:hidden;margin-bottom:6px;}
        .progress-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--green),var(--blue));}
        .progress-labels{display:flex;justify-content:space-between;font-size:.65rem;color:var(--muted);}
        .tabs{display:flex;gap:6px;margin-bottom:14px;}
        .tab{padding:5px 12px;border-radius:7px;font-size:.7rem;font-weight:600;cursor:pointer;border:1px solid transparent;transition:all .15s;}
        .tab.active{background:rgba(255,0,153,0.15);border-color:rgba(255,0,153,0.25);color:var(--pink);}
        .tab:not(.active){color:var(--muted);}
        .tab:not(.active):hover{color:var(--text);background:rgba(255,255,255,0.04);}
       `}</style>

      {/* Particle Canvas Background */}
      <canvas id="particles-bg" style={{ position: 'fixed', inset: 0, zIndex: -1, opacity: 0.6 }} />

      {/* Toast Container */}
      <div id="toast-container" />

      {/* NAV */}
      <nav>
        <div className="logo">TestFlow</div>
        <div style={{ display: "flex", gap: "0.3rem", marginLeft: "2rem" }}>
          {NAV.map(n => (
            <button key={n.id} className={`nav-link ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>
        <div className="nav-right">
          <input className="nav-search" placeholder="Search bugs, tests..." onClick={() => setShowSearch(true)} readOnly />
          <button className="btn btn-sm" style={{ background: "var(--glass)", border: "1px solid var(--border)" }} onClick={() => setShowExport(true)}>📥</button>
          <button className="btn btn-sm" style={{ background: "var(--glass)", border: "1px solid var(--border)" }} onClick={() => setShowInvite(true)}>✉️</button>
          <span className="nav-badge">Sprint 4</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowNewTest(true)}>+ New Test</button>
          <div onClick={() => setShowProfile(true)} style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,var(--pink),var(--purple))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".8rem", fontWeight: 700, cursor: "pointer" }}>W</div>
        </div>
      </nav>

      {/* LAYOUT */}
      <div className={`layout ${PAGES_WITH_RIGHT_PANEL.includes(page) ? 'layout-with-right' : ''}`}>
        {/* SIDEBAR */}
        <aside className="sidebar">
          {sidebarNav.map(group => (
            <div key={group.group} className="sidebar-section">
              <div className="sidebar-label">{group.group}</div>
              {group.items.map(item => (
                <div key={item.id} className={`sidebar-item ${page === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && <span className="sidebar-count">{item.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem" }}>{PAGE_TITLES[page] || "Dashboard"}</h2>
          {getPageContent(page, showToast, { setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowNewBug, setShowNewTest, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage, bugs, tests })}
        </main>

        {/* RIGHT PANEL for AI, Dashboard, Home */}
        {PAGES_WITH_RIGHT_PANEL.includes(page) && <AIRightPanel />}
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      
      <NewBugModal 
        isOpen={showNewBug} 
        onClose={() => setShowNewBug(false)} 
        onSubmit={handleNewBug} 
      />
      <NewTestModal 
        isOpen={showNewTest} 
        onClose={() => setShowNewTest(false)} 
        onSubmit={handleNewTest} 
      />
      <GenerateTestsModal 
        isOpen={showGenerateTests} 
        onClose={() => setShowGenerateTests(false)} 
        onSubmit={handleGenerateTests} 
      />
      <RunTestsModal 
        isOpen={showRunTests} 
        onClose={() => setShowRunTests(false)} 
        onSubmit={handleRunTests} 
      />
      <SyncNowModal 
        isOpen={showSyncNow} 
        onClose={() => setShowSyncNow(false)} 
        onSubmit={handleSyncNow} 
      />
      <AddIntegrationModal 
        isOpen={showAddIntegration} 
        onClose={() => setShowAddIntegration(false)} 
        onSubmit={handleAddIntegration} 
      />
      <StartRecordingModal 
        isOpen={showStartRecording} 
        onClose={() => setShowStartRecording(false)} 
        onSubmit={handleStartRecording} 
      />
      <InviteModal 
        isOpen={showInvite} 
        onClose={() => setShowInvite(false)} 
        onSubmit={handleInvite} 
      />
      <ExportModal 
        isOpen={showExport} 
        onClose={() => setShowExport(false)} 
        onSubmit={handleExport} 
      />
      <SearchModal 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)} 
        onSubmit={handleSearch} 
      />
      <ProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
        onSubmit={handleProfile} 
      />
      <UserStoryModal 
        isOpen={showNewUserStory} 
        onClose={() => setShowNewUserStory(false)} 
        onSubmit={handleNewUserStory} 
      />
    </div>
  );
}
