export default function PredictiveAnalytics() {
  return (
    <div className="card glass-card animate-slide-up" style={{ marginBottom: 0, padding: '1.5rem' }}>
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="card-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.1rem', fontWeight: 700 }}>
          🔮 Predictive Bug Analytics
        </div>
        <span className="badge badge-purple" style={{ 
          background: 'rgba(157, 78, 221, 0.15)', 
          color: 'var(--purple)', 
          padding: '4px 10px', 
          borderRadius: '99px',
          fontSize: '0.7rem',
          fontWeight: 700,
          border: '1px solid rgba(157, 78, 221, 0.3)'
        }}>
          <span className="live-dot" style={{ width: 6, height: 6, marginRight: 6 }}></span>
          ML Active
        </span>
      </div>
      <div className="card-body">
        <p style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.5 }}>
          Risk score per component — higher = more likely to have bugs
        </p>
        <div className="risk-item">
          <span className="risk-name">Auth Module</span>
          <div className="risk-bar-wrap"><div className="risk-bar" style={{width: "87%", background: "linear-gradient(90deg,var(--pink),#ff5599)"}}></div></div>
          <span className="risk-pct" style={{color: "var(--pink)"}}>87%</span>
        </div>
        <div className="risk-item">
          <span className="risk-name">Payment Flow</span>
          <div className="risk-bar-wrap"><div className="risk-bar" style={{width: "72%", background: "linear-gradient(90deg,#FFA500,#ffcc44)"}}></div></div>
          <span className="risk-pct" style={{color: "#FFA500"}}>72%</span>
        </div>
        <div className="risk-item">
          <span className="risk-name">Dashboard Charts</span>
          <div className="risk-bar-wrap"><div className="risk-bar" style={{width: "65%", background: "linear-gradient(90deg,#FFA500,#ffcc44)"}}></div></div>
          <span className="risk-pct" style={{color: "#FFA500"}}>65%</span>
        </div>
        <div className="risk-item">
          <span className="risk-name">User Settings</span>
          <div className="risk-bar-wrap"><div className="risk-bar" style={{width: "41%", background: "linear-gradient(90deg,var(--blue),#44aaff)"}}></div></div>
          <span className="risk-pct" style={{color: "var(--blue)"}}>41%</span>
        </div>
        <div className="risk-item">
          <span className="risk-name">Notifications</span>
          <div className="risk-bar-wrap"><div className="risk-bar" style={{width: "23%", background: "linear-gradient(90deg,var(--green),#44ffaa)"}}></div></div>
          <span className="risk-pct" style={{color: "var(--green)"}}>23%</span>
        </div>
        <div className="risk-item">
          <span className="risk-name">File Export</span>
          <div className="risk-bar-wrap"><div className="risk-bar" style={{width: "17%", background: "linear-gradient(90deg,var(--green),#44ffaa)"}}></div></div>
          <span className="risk-pct" style={{color: "var(--green)"}}>17%</span>
        </div>
      </div>
    </div>
  );
}
