/**
 * TestFlow Shared Primitives
 * All components consume CSS design tokens from tokens.css
 *
 * Usage:
 *   import { Pill, StatusBadge, PrioIcon, TFCard } from './components/primitives';
 */

// ── Pill ────────────────────────────────────────────────────────────────────
// Generic pill badge. Pass `color` as a CSS variable name (e.g. "var(--tf-pink)")
export function Pill({ children, color, bg, icon, style = {} }) {
  return (
    <span
      className="tf-pill"
      style={{
        color: color || 'var(--tf-text)',
        background: bg || 'rgba(255,255,255,0.07)',
        borderColor: color ? `${color}44` : 'var(--tf-border)',
        ...style,
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}

// ── StatusBadge ──────────────────────────────────────────────────────────────
// Renders a badge for bug/test status values
const STATUS_MAP = {
  new:      { label: 'New',      cls: 'tf-status--new',      icon: '○' },
  active:   { label: 'Active',   cls: 'tf-status--active',   icon: '◉' },
  open:     { label: 'Open',     cls: 'tf-status--active',   icon: '◉' },
  resolved: { label: 'Resolved', cls: 'tf-status--resolved', icon: '✓' },
  fixed:    { label: 'Fixed',    cls: 'tf-status--resolved', icon: '✓' },
  passed:   { label: 'Passed',   cls: 'tf-status--resolved', icon: '✓' },
  closed:   { label: 'Closed',   cls: 'tf-status--closed',   icon: '×' },
  failed:   { label: 'Failed',   cls: 'tf-status--new',      icon: '✕' },
};

export function StatusBadge({ status }) {
  const key = (status || '').toLowerCase();
  const cfg = STATUS_MAP[key] || { label: status, cls: 'tf-status--new', icon: '·' };
  return (
    <span className={`tf-pill ${cfg.cls}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ── PrioIcon ────────────────────────────────────────────────────────────────
// Small icon + text for bug priority
const PRIO_MAP = {
  blocker: { icon: '🔴', label: 'Blocker', cls: 'tf-prio--blocker' },
  major:   { icon: '🟡', label: 'Major',   cls: 'tf-prio--major' },
  minor:   { icon: '🔵', label: 'Minor',   cls: 'tf-prio--minor' },
};

export function PrioIcon({ priority, showLabel = false }) {
  const key = (priority || 'minor').toLowerCase();
  const cfg = PRIO_MAP[key] || PRIO_MAP.minor;
  return (
    <span className={`tf-pill ${cfg.cls}`} style={{ background: 'transparent', border: 'none', padding: showLabel ? '2px 8px' : '0', gap: 4 }}>
      <span>{cfg.icon}</span>
      {showLabel && <span style={{ fontSize: 'var(--tf-font-size-xs)', fontWeight: 600 }}>{cfg.label}</span>}
    </span>
  );
}

// ── SevBadge ─────────────────────────────────────────────────────────────────
const SEV_MAP = {
  critical: { color: 'var(--tf-sev-critical)', bg: 'rgba(247,37,133,0.1)',  border: 'rgba(247,37,133,0.25)' },
  high:     { color: 'var(--tf-sev-high)',     bg: 'rgba(255,109,0,0.1)',   border: 'rgba(255,109,0,0.25)' },
  medium:   { color: 'var(--tf-sev-medium)',   bg: 'rgba(255,214,10,0.1)',  border: 'rgba(255,214,10,0.25)' },
  low:      { color: 'var(--tf-sev-low)',      bg: 'rgba(0,255,163,0.1)',   border: 'rgba(0,255,163,0.25)' },
};

export function SevBadge({ severity }) {
  const key = (severity || 'medium').toLowerCase();
  const cfg = SEV_MAP[key] || SEV_MAP.medium;
  return (
    <span className="tf-pill" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
      {severity}
    </span>
  );
}

// ── TFCard ───────────────────────────────────────────────────────────────────
// Card variants: default | glass | glow-pink | glow-blue | glow-green
export function TFCard({ children, variant = 'default', style = {}, onClick }) {
  const variantClass = variant === 'default' ? 'tf-card'
    : variant === 'glass'      ? 'tf-card--glass'
    : variant === 'glow-pink'  ? 'tf-card tf-card--glow-pink'
    : variant === 'glow-blue'  ? 'tf-card tf-card--glow-blue'
    : variant === 'glow-green' ? 'tf-card tf-card--glow-green'
    : 'tf-card';

  return (
    <div className={variantClass} style={style} onClick={onClick}>
      {children}
    </div>
  );
}

// ── TFCardHeader ─────────────────────────────────────────────────────────────
export function TFCardHeader({ title, subtitle, actions, icon }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: 'var(--tf-space-3) var(--tf-space-4)',
      borderBottom: '1px solid var(--tf-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tf-space-2)' }}>
        {icon && <span style={{ fontSize: '1rem' }}>{icon}</span>}
        <div>
          <div style={{ fontWeight: 600, fontSize: 'var(--tf-font-size-md)', color: 'var(--tf-text)' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 'var(--tf-font-size-xs)', color: 'var(--tf-muted)', marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      {actions && <div style={{ display: 'flex', gap: 'var(--tf-space-2)', alignItems: 'center' }}>{actions}</div>}
    </div>
  );
}

// ── LiveDot ───────────────────────────────────────────────────────────────────
export function LiveDot({ color = 'var(--tf-green)' }) {
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
      background: color, animation: 'pulse 2s infinite', flexShrink: 0,
    }} />
  );
}

// ── RiskBar ───────────────────────────────────────────────────────────────────
// Horizontal risk bar used in analytics components
export function RiskBar({ label, pct, color = 'var(--tf-pink)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 'var(--tf-font-size-sm)' }}>
      <span style={{ flex: '0 0 130px', color: 'var(--tf-text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--tf-radius-pill)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 'var(--tf-radius-pill)', transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ color, fontWeight: 700, fontSize: 'var(--tf-font-size-xs)', minWidth: 36, textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}
