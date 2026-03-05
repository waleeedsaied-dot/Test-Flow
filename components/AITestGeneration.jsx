import { useState } from "react";

export default function AITestGeneration({ showToast }) {
  const [suggestions, setSuggestions] = useState([
    { id: 1, title: "TC-Auto-001: Login Safari JWT Flow", from: "Bug #1042", desc: "Tests the full login flow on Safari browsers, specifically checking JWT token parsing. Includes assertions for token validity, session creation, and redirect behavior.", accepted: false },
    { id: 2, title: "TC-Auto-002: Parallel Worker Stress Test", from: "Flow", desc: "Validates parallel test execution with 8+ concurrent workers. Checks for worker isolation, no cross-contamination, and proper cleanup after completion.", accepted: false },
    { id: 3, title: "TC-Auto-003: Payment Flow End-to-End", from: "Preventive", desc: "AI detected high risk (72%) in Payment Flow. Generated a full E2E test covering card input, validation, processing, and confirmation steps.", accepted: false }
  ]);

  const acceptTest = (id) => {
    setSuggestions(suggestions.map(t => t.id === id ? { ...t, accepted: true } : t));
    showToast?.("Test added to ClickUp!");
  };

  const generateTest = () => {
    const newTest = {
      id: Date.now(),
      title: `TC-Auto-00${Math.floor(Math.random()*90)+10}: AI Generated Test`,
      from: "New",
      desc: "AI detected a potential regression in the Settings → Integrations flow. Generated a test that validates OAuth token refresh and webhook delivery confirmation.",
      accepted: false
    };
    setSuggestions([newTest, ...suggestions]);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">🧪 AI Test Generation</div>
        <div style={{display: "flex", gap: ".5rem"}}>
          <button className="btn btn-ghost btn-sm">From Flows</button>
          <button className="btn btn-ghost btn-sm">From Bugs</button>
          <button className="btn btn-primary btn-sm" onClick={generateTest}>⚡ Generate New</button>
        </div>
      </div>
      <div className="card-body">
        {suggestions.map(test => (
          <div 
            key={test.id} 
            className="suggestion-item" 
            style={{
              background: test.accepted ? "rgba(0,255,133,0.05)" : undefined, 
              borderColor: test.accepted ? "rgba(0,255,133,0.2)" : undefined
            }}
          >
            <div className="sug-title">
              🧪 {test.title} 
              <span className={`badge ${
                test.from === "Bug #1042" ? "badge-pink" : 
                test.from === "Flow" ? "badge-blue" : "badge-purple"
              }`}>
                From {test.from}
              </span>
            </div>
            <div className="sug-desc">{test.desc}</div>
            <div className="sug-actions">
              <button 
                className="sug-btn sug-accept" 
                onClick={() => acceptTest(test.id)} 
                disabled={test.accepted}
              >
                {test.accepted ? "✅ Added to ClickUp!" : "✅ Accept & Add"}
              </button>
              <button className="sug-btn sug-skip">Skip</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
