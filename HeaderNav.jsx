import React from 'react';

// A simple header navigation bar that consumes tokens/styles via CSS classes
// Props:
// - items: array of { id, icon, label, tooltip? }
// - current: currently active id
// - onNavigate: function(id) => void
export default function HeaderNav({ items = [], current, onNavigate }) {
  return (
    <header className="nav-bar" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <nav aria-label="Main navigation" style={{ display: 'flex', gap: '8px', padding: '8px 12px' }}>
        {items.map((it) => {
          const active = current === it.id;
          return (
            <button
              key={it.id}
              className={`nav-link ${active ? 'active' : ''}`}
              onClick={() => onNavigate?.(it.id)}
              aria-label={it.label}
              title={it.tooltip ?? it.label}
            >
              <span style={{ marginRight: 6 }}>{it.icon}</span>
              <span>{it.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
