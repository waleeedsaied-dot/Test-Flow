export default function AIRightPanel() {
  const activities = [
    { text: "Predicted risk in Auth Module ", link: "87%", linkColor: "var(--pink)", time: "2 min ago", color: "var(--purple)" },
    { text: "Generated test TC-Auto-003 from flow", time: "15 min ago", color: "var(--green)" },
    { text: "Clustered 5 new user flows", time: "1h ago", color: "var(--blue)" },
    { text: "Sentiment flagged urgency on BUG-1042", time: "2h ago", color: "#FFA500" },
    { text: "Auto-triaged 3 new bug reports", time: "3h ago", color: "var(--pink)" },
    { text: "Quality score updated: 74 / 100", time: "4h ago", color: "var(--green)" },
  ];

  const factors = [
    { name: "Test Coverage", val: 74 },
    { name: "Test Stability", val: 82 },
    { name: "Bug Rate", val: 58 },
    { name: "Fix Speed", val: 71 },
  ];

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (74 / 100) * circumference;

  return (
    <div className="right-panel" style={{ 
      background: 'rgba(13, 18, 33, 0.4)', 
      borderLeft: '1px solid var(--border)',
      padding: '1.5rem',
      overflowY: 'auto'
    }}>
      <div className="rp-section animate-slide-up">
        <div className="rp-title" style={{ 
          fontFamily: "'Syne', sans-serif",
          fontSize: '0.8rem', 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          color: 'var(--muted)', 
          marginBottom: '1rem' 
        }}>
          🏆 Quality Score
        </div>
        <div className="card glass-card" style={{ marginBottom: 0, padding: '1rem' }}>
          <div className="card-body" style={{ padding: ".8rem" }}>
            <div className="score-ring-wrap">
              <div className="score-ring">
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
                  <circle cx="55" cy="55" r="45" fill="none" stroke="url(#grad)" strokeWidth="10" strokeDasharray="283" strokeDashoffset="75" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{stopColor: "#9D4EDD"}}/>
                      <stop offset="100%" style={{stopColor: "#1E90FF"}}/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="score-ring-val">
                  <div className="score-num" style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: 'var(--purple)' }}>74</div>
                  <div className="score-lbl" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>/ 100</div>
                </div>
              </div>
            </div>
            {factors.map(f => (
              <div key={f.name} className="q-factor" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', fontSize: '0.76rem', borderBottom: '1px solid var(--border)' }}>
                <span className="q-name" style={{ flex: 1, color: 'var(--muted)' }}>{f.name}</span>
                <div className="q-bar" style={{ width: 60, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div className="q-fill" style={{ height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, var(--purple), var(--blue))', width: f.val + "%" }}></div>
                </div>
                <span className="q-val" style={{ fontWeight: 600, fontSize: '0.72rem', minWidth: 30, textAlign: 'right', color: 'var(--purple)' }}>{f.val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rp-section animate-slide-up stagger-1">
        <div className="rp-title" style={{ 
          fontFamily: "'Syne', sans-serif",
          fontSize: '0.8rem', 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          color: 'var(--muted)', 
          marginBottom: '1rem' 
        }}>
          <span className="live-dot"></span>AI Activity
        </div>
        <div className="card glass-card" style={{ marginBottom: 0, padding: '1rem' }}>
          <div className="card-body" style={{ padding: ".8rem" }}>
            {activities.map((a, i) => (
              <div key={i} className="timeline-item" style={{ display: 'flex', gap: '0.7rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.76rem' }}>
                <div className="timeline-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: '0.3rem' }}></div>
                <div>
                  <div className="timeline-action" style={{ color: 'var(--text)', fontWeight: 500, lineHeight: 1.4 }}>
                    {a.text}
                    {a.link && <span style={{ color: a.linkColor }}>{a.link}</span>}
                  </div>
                  <div className="timeline-time" style={{ color: 'var(--muted)', fontSize: '0.67rem', marginTop: '0.15rem' }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rp-section animate-slide-up stagger-2">
        <div className="rp-title" style={{ 
          fontFamily: "'Syne', sans-serif",
          fontSize: '0.8rem', 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          color: 'var(--muted)', 
          marginBottom: '1rem' 
        }}>
          ⚙️ AI Models
        </div>
        <div className="card glass-card" style={{ marginBottom: 0, padding: '1rem' }}>
          <div className="card-body" style={{ padding: ".8rem", fontSize: ".76rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--muted)" }}>Triage Model</span>
              <span style={{ color: "var(--text)", fontWeight: 600 }}>GPT-4 Turbo</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--muted)" }}>Embeddings</span>
              <span style={{ color: "var(--text)", fontWeight: 600 }}>text-embedding-3</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--muted)" }}>Vector DB</span>
              <span style={{ color: "var(--text)", fontWeight: 600 }}>Pinecone</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--muted)" }}>ML Model</span>
              <span style={{ color: "var(--text)", fontWeight: 600 }}>Custom XGBoost</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0" }}>
              <span style={{ color: "var(--muted)" }}>Status</span>
              <span style={{ color: "var(--green)", fontWeight: 600 }}>🟢 All Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
