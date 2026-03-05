import React from 'react';
// Lightweight Bug Card using design tokens/colors from TestFlow design
const BugCard = ({ bug, onOpen }) => {
  // map priority to simple color token; fallback to blue
  const color = {
    blocker: '#f72585', major: '#ffd60a', minor: '#00f5ff', Critical: '#f72585'
  }[String(bug?.priority || 'minor')] || '#00f5ff';
  return (
    <div className="bug-card" style={{ width: 320, margin: '0 12px 16px' }}>
      <div className="bug-card-accent" style={{}} />
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, color: '#e2e8f0' }}>{bug?.id ?? 'BUG-0'}</div>
          <span className="priority" style={{ padding: '4px 8px', borderRadius: 999, background: color, color: '#fff', fontWeight: 700, fontSize: '0.75rem' }}>{String(bug?.priority || 'minor').toUpperCase()}</span>
        </div>
        <div style={{ marginTop: 6, fontWeight: 700, color: '#e9eefc' }}>
          {bug?.title ?? 'Untitled Bug'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 8, gap: 8 }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Status: {bug?.status ?? 'open'}</span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Priority: {bug?.priority ?? 'minor'}</span>
        </div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{bug?.assignee ?? 'Unassigned'}</span>
          <button className="btn btn-primary" onClick={() => onOpen?.(bug)} style={{ padding: '6px 12px' }}>
            View details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BugCard;
