export default function SentimentAnalysis() {
  return (
    <div className="card" style={{marginBottom: 0}}>
      <div className="card-header">
        <div className="card-title">💬 Sentiment Analysis</div>
        <span className="badge badge-green">Team Healthy</span>
      </div>
      <div className="card-body">
        <p style={{fontSize: ".75rem", color: "var(--muted)", marginBottom: "1rem"}}>Emotion analysis from bug comments this sprint</p>
        <div className="sentiment-row">
          <span className="sentiment-label">😊 Satisfied</span>
          <div className="sentiment-bar-wrap"><div className="sentiment-fill" style={{width: "62%", background: "linear-gradient(90deg,var(--green),#44ffaa)"}}></div></div>
          <span style={{fontSize: ".75rem", fontWeight: 600, color: "var(--green)"}}>62%</span>
        </div>
        <div className="sentiment-row">
          <span className="sentiment-label">😐 Neutral</span>
          <div className="sentiment-bar-wrap"><div className="sentiment-fill" style={{width: "24%", background: "linear-gradient(90deg,var(--blue),#44aaff)"}}></div></div>
          <span style={{fontSize: ".75rem", fontWeight: 600, color: "var(--blue)"}}>24%</span>
        </div>
        <div className="sentiment-row">
          <span className="sentiment-label">😤 Frustrated</span>
          <div className="sentiment-bar-wrap"><div className="sentiment-fill" style={{width: "10%", background: "linear-gradient(90deg,#FFA500,#ffcc44)"}}></div></div>
          <span style={{fontSize: ".75rem", fontWeight: 600, color: "#FFA500"}}>10%</span>
        </div>
        <div className="sentiment-row">
          <span className="sentiment-label">🚨 Urgent</span>
          <div className="sentiment-bar-wrap"><div className="sentiment-fill" style={{width: "4%", background: "linear-gradient(90deg,var(--pink),#ff5599)"}}></div></div>
          <span style={{fontSize: ".75rem", fontWeight: 600, color: "var(--pink)"}}>4%</span>
        </div>
        <div style={{marginTop: "1rem", padding: ".8rem", background: "rgba(0,255,133,0.05)", border: "1px solid rgba(0,255,133,0.15)", borderRadius: 8, fontSize: ".75rem"}}>
          <div style={{color: "var(--green)", fontWeight: 600, marginBottom: ".3rem"}}>🤖 AI Insight</div>
          <div style={{color: "var(--muted)"}}>Team sentiment is healthy. BUG-1042 comments show mild urgency — consider expediting Alice's assignment.</div>
        </div>
      </div>
    </div>
  );
}
