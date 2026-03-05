export default function BugPredictions() {
  const predictions = [
    { icon: "⚠️", title: "Auth Module — JWT Expiry Edge Case", desc: "Recent code changes to token refresh logic may cause issues with sessions > 24hrs.", risk: "High", riskPct: 87, cls: "pr-high" },
    { icon: "⚡", title: "Payment Flow — Currency Rounding", desc: "New multi-currency feature lacks rounding validation for JPY and KWD.", risk: "Medium", riskPct: 72, cls: "pr-med" },
    { icon: "📊", title: "Dashboard — Chart Render on Mobile", desc: "Responsive breakpoint changes may affect chart rendering on small screens.", risk: "Medium", riskPct: 65, cls: "pr-med" },
  ];

  return (
    <div className="card glass-card animate-slide-up stagger-1" style={{ marginBottom: 0, padding: '1.5rem' }}>
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="card-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.1rem', fontWeight: 700 }}>
          🎯 Upcoming Bug Predictions
        </div>
        <span style={{ 
          background: 'rgba(255, 215, 0, 0.15)', 
          color: 'var(--yellow)', 
          padding: '4px 10px', 
          borderRadius: '99px',
          fontSize: '0.7rem',
          fontWeight: 700,
          border: '1px solid rgba(255, 215, 0, 0.3)'
        }}>
          3 Warnings
        </span>
      </div>
      <div className="card-body" style={{ padding: ".8rem 1.2rem" }}>
        {predictions.map((p, i) => (
          <div key={i} className="prediction-item" style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '0.8rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
            transition: 'all .2s ease',
          }}>
            <div className="pred-icon" style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(255, 0, 153, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0
            }}>{p.icon}</div>
            <div>
              <div className="pred-title" style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>{p.title}</div>
              <div className="pred-desc" style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '0.5rem' }}>{p.desc}</div>
              <span className={`pred-risk ${p.cls}`} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                background: p.risk === 'High' ? 'rgba(255, 0, 153, 0.15)' : 'rgba(255, 215, 0, 0.15)',
                color: p.risk === 'High' ? 'var(--pink)' : 'var(--yellow)'
              }}>
                {p.risk === "High" ? "🔴" : "🟡"} {p.risk} Risk {p.riskPct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
