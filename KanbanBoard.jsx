import React, { useState, useEffect, useRef } from 'react';

// Kanban Seed Data and Taxonomy
export const KANBAN_INITIAL = {
  open: [
    { id: 1, title: "Payment fails on Safari", priority: "Critical", tag: "payments" },
    { id: 2, title: "Checkout not visible iOS", priority: "High", tag: "mobile" },
  { id: 3, title: "Search order issue", priority: "Medium", tag: "search" },
  ],
  inProgress: [
    { id: 4, title: "Login uppercase fix", priority: "Medium", tag: "auth" },
    { id: 5, title: "Mobile nav scroll bug", priority: "High", tag: "mobile" },
  ],
  inReview: [
    { id: 6, title: "Dashboard slow mobile", priority: "Medium", tag: "performance" },
  ],
  resolved: [
    { id: 7, title: "404 on profile page", priority: "Low", tag: "routing" },
    { id: 8, title: "Token expiry crash", priority: "High", tag: "auth" },
  ],
};

export const KANBAN_COLS = [
  { id: 'open', label: 'Open', emoji: '🔴', accent: '#FF4466', glow: 'rgba(255,68,102,0.18)' },
  { id: 'inProgress', label: 'In Progress', emoji: '🔵', accent: '#1E90FF', glow: 'rgba(30,144,255,0.18)' },
  { id: 'inReview', label: 'In Review', emoji: '🟡', accent: '#FFD700', glow: 'rgba(255,215,0,0.18)' },
  { id: 'resolved', label: 'Resolved', emoji: '🟢', accent: '#00FF85', glow: 'rgba(0,255,133,0.18)' },
];

export const KANBAN_PRIO = {
  Critical: { color: '#FF4466', bg: 'rgba(255,68,102,0.12)', border: 'rgba(255,68,102,0.35)' },
  High: { color: '#FF9500', bg: 'rgba(255,149,0,0.12)', border: 'rgba(255,149,0,0.35)' },
  Medium: { color: '#1E90FF', bg: 'rgba(30,144,255,0.12)', border: 'rgba(30,144,255,0.35)' },
  Low: { color: '#00FF85', bg: 'rgba(0,255,133,0.12)', border: 'rgba(0,255,133,0.35)' },
};

export const TAG_COLOR = {
  payments: '#FF4466',
  mobile: '#9D4EDD',
  search: '#1E90FF',
  auth: '#FFD700',
  performance: '#FF9500',
  routing: '#00FF85',
};

const BadgePill = ({ label, style }) => (
  <span className="k-badge" style={{ padding: '4px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, border: `1px solid ${style.border}`, background: style.bg, color: style.color }}>{label}</span>
);

export default function KanbanBoard() {
  const [bugs, setBugs] = useState(KANBAN_INITIAL);
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);
  const [overBug, setOverBug] = useState(null);
  const [dropped, setDropped] = useState(null);
  const dragNode = useRef(null);

  const onDragStart = (e, bugId, fromCol) => {
    setDrag({ bugId, fromCol });
    dragNode.current = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => dragNode.current && (dragNode.current.style.opacity = '0.35'), 0);
  };
  const onDragEnd = () => {
    if (dragNode.current) dragNode.current.style.opacity = '1';
    dragNode.current = null;
    setDrag(null); setOver(null); setOverBug(null);
  };
  const onDragOverCol = (e, colId) => {
    e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setOver(colId);
  };
  const onDragOverCard = (e, bugId) => {
    e.preventDefault(); e.stopPropagation(); setOverBug(bugId);
  };
  const onDrop = (e, toCol) => {
    e.preventDefault(); if (!drag) return;
    const { bugId, fromCol } = drag;
    setBugs(prev => {
      const next = { ...prev };
      const bug = next[fromCol].find(b => b.id === bugId);
      next[fromCol] = next[fromCol].filter(b => b.id !== bugId);
      if (fromCol === toCol && overBug !== null) {
        const idx = next[toCol].findIndex(b => b.id === overBug);
        const arr = [...next[toCol]]; arr.splice(idx, 0, bug); next[toCol] = arr;
      } else if (overBug !== null && toCol !== fromCol) {
        const idx = next[toCol].findIndex(b => b.id === overBug); const arr = [...next[toCol]]; arr.splice(idx, 0, bug); next[toCol] = arr;
      } else {
        next[toCol] = [...next[toCol], bug];
      }
      return next;
    });
    setDropped(bugId);
    setTimeout(() => setDropped(null), 700);
    onDragEnd();
  };

  return (
    <div className="kanban-root" style={{ padding: '24px' }}>
      <style>{`
        .board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .col { min-height: 140px; padding: 8px; border-radius: 12px; border:1px solid var(--border); background: rgba(255,255,255,0.04); }
        .col-header { display:flex; align-items:center; justify-content: space-between; padding: 6px 8px; font-weight:700; font-size: 12px; }
        .col-drop { padding: 8px; border-radius: 8px; min-height: 100px; }
        .k-badge { display:inline-flex; align-items:center; padding: 2px 6px; border-radius: 999px; font-size: 10px; font-weight: 700; }
        .tag-pill { display:inline-flex; align-items:center; padding: 2px 8px; border-radius:999px; font-size: 10px; font-weight:700; margin-left: 6px; }
        @keyframes flashIn { from{box-shadow:0 0 0 rgba(0,0,0,0)} to{box-shadow:0 0 24px rgba(0,255,133,.8);} }
        @keyframes fadeUp2 { from{opacity:0; transform: translateY(6px)} to{opacity:1; transform: translateY(0)} }
      `}</style>

      <div className="board">
        {KANBAN_COLS.map(col => (
          <div key={col.id} className="col" onDragOver={(e)=>onDragOverCol(e, col.id)} onDrop={(e)=>onDrop(e, col.id)}>
            <div className="col-header">
              <span>{col.emoji} {col.label}</span>
              <span className="k-badge" style={{ background: col.accent, color:'#fff', border: '1px solid '+col.accent }}>
                {bugs[col.id]?.length || 0}
              </span>
            </div>
            <div className="col-drop" style={{ outline: 'none' }}>
              {bugs[col.id]?.map((b, idx) => {
                const p = KANBAN_PRIO[b.priority] || { color: '#fff', bg: 'rgba(255,255,255,0.12)', border: '#333' };
                return (
                  <div key={b.id}
                       draggable
                       onDragStart={(e)=>onDragStart(e, b.id, col.id)}
                       onDragEnd={onDragEnd}
                       onDragOver={(e)=>onDragOverCard(e, b.id)}
                       className={`bug-card${dropped===b.id?' dropped':''}`}
                       style={{ marginBottom: 8, boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontWeight:700, color:'#fff' }}>{b.title}</span>
                      <span className="k-badge" style={{ background: p.bg, color: p.color, border: '1px solid '+p.border }}>
                        {b.priority}
                      </span>
                    </div>
                    <div style={{ marginTop:6, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span className="tag-pill" style={{ background: (b.tag && TAG_COLOR[b.tag]) ? TAG_COLOR[b.tag]+'22' : '#fff22', border: '1px solid '+(b.tag ? TAG_COLOR[b.tag] : '#fff') , color: '#fff' }}>{b.tag}</span>
                    </div>
                  </div>
                );
              })}
              {(!bugs[col.id] || bugs[col.id].length === 0) && (
                <div style={{ padding: 12, textAlign: 'center', color: '#4a5568' }}>Drop items here</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// End of KanbanBoard.jsx
