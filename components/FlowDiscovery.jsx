export default function FlowDiscovery() {
  return (
    <div className="card" style={{marginBottom: 0}}>
      <div className="card-header">
        <div className="card-title">🌊 Flow Discovery</div>
        <span className="badge badge-blue"><span className="live-dot"></span>Tracking</span>
      </div>
      <div className="card-body">
        <p style={{fontSize: ".75rem", color: "var(--muted)", marginBottom: "1rem"}}>Top user journeys discovered by ML clustering this week</p>
        <div className="flow-nodes">
          <div className="flow-node fn-login">
            <span>🔐</span> Login → Dashboard → Create Task
            <span className="flow-users">1,240 users</span>
          </div>
          <div style={{height: 3, background: "linear-gradient(90deg,rgba(255,0,153,0.3),transparent)", margin: ".2rem 1.5rem", borderRadius: 2}}></div>
          <div className="flow-node fn-dashboard">
            <span>📊</span> Dashboard → Reports → Export
            <span className="flow-users">892 users</span>
          </div>
          <div style={{height: 3, background: "linear-gradient(90deg,rgba(30,144,255,0.3),transparent)", margin: ".2rem 1.5rem", borderRadius: 2}}></div>
          <div className="flow-node fn-task">
            <span>✅</span> Create Task → Assign → Comment
            <span className="flow-users">756 users</span>
          </div>
          <div style={{height: 3, background: "linear-gradient(90deg,rgba(157,78,221,0.3),transparent)", margin: ".2rem 1.5rem", borderRadius: 2}}></div>
          <div className="flow-node fn-settings">
            <span>⚙️</span> Settings → Integrations → Save
            <span className="flow-users">431 users</span>
          </div>
          <div style={{height: 3, background: "linear-gradient(90deg,rgba(255,215,0,0.3),transparent)", margin: ".2rem 1.5rem", borderRadius: 2}}></div>
          <div className="flow-node fn-report">
            <span>📋</span> Bug Report → Triage → Assign
            <span className="flow-users">318 users</span>
          </div>
        </div>
      </div>
    </div>
  );
}
