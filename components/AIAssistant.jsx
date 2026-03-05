import { useState } from "react";

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { from: 'ai', text: "Hello! I'm your TestFlow AI assistant. I can analyze bugs, suggest tests, predict risks, and answer questions about your sprint. What would you like to know?" },
    { from: 'user', text: "Which component should we test first this sprint?" },
    { from: 'ai', html: true, text: "Based on my analysis, I recommend prioritizing the <strong style='color:var(--pink)'>Auth Module</strong> (87% risk score). Recent JWT changes combined with 3 open blockers make it the highest priority. I've already generated <strong style='color:var(--green)'>TC-Auto-001</strong> to cover the Safari login flow. Should I also generate a token expiry edge case test?" }
  ]);
  const [input, setInput] = useState("");

  const responses = [
    "Based on current data, the Auth Module has the highest risk this sprint. I recommend adding 3 more test cases covering edge cases around JWT expiry.",
    "I've analyzed 87 test runs this week. The Payment Flow shows a 72% risk — I've queued a preventive test for your review.",
    "Team sentiment is healthy at 62% satisfied. Only BUG-1042 comments show frustration — consider a status update to the team.",
    "Flow Discovery found 1,240 users following the Login → Dashboard → Create Task journey. This is your most critical flow to test.",
    "Quality score is 74/100. To improve: increase test coverage from 74% to 85% and reduce average bug fix time from 2.4 to 1.5 days.",
  ];
  let idx = 0;

  const send = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput("");
    setTimeout(() => {
      const resp = responses[idx % responses.length];
      idx++;
      setMessages([...newMessages, { from: 'ai', text: resp }]);
    }, 900);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">🤖 AI Assistant — Ask Anything</div>
        <span style={{fontSize: ".75rem", color: "var(--muted)"}}>Powered by GPT-4 Turbo</span>
      </div>
      <div className="card-body">
        <div className="ai-chat">
          {messages.map((msg, i) => (
            <div key={i} className="ai-msg" style={msg.from === 'user' ? {flexDirection: 'row-reverse'} : {}}>
              <div className={`ai-avatar ${msg.from === 'ai' ? 'av-ai' : 'av-user'}`}>
                {msg.from === 'ai' ? '🤖' : '👤'}
              </div>
              <div className={`ai-bubble ${msg.from === 'user' ? 'user-bubble' : ''}`}>
                {msg.html ? <span dangerouslySetInnerHTML={{__html: msg.text}}></span> : msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="ai-input-row">
          <input 
            className="ai-input" 
            type="text" 
            placeholder='Ask AI: "What bugs are most likely next sprint?"' 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && send()} 
          />
          <button className="btn btn-primary btn-sm" onClick={send}>Send ⚡</button>
        </div>
      </div>
    </div>
  );
}
