// Lightweight API wrapper for test environment
// Base URL defaults to JSON Server port 3002 in local dev, can be overridden via window.__TF_API_BASE__ for prod or different envs.
const API_BASE = (typeof window !== 'undefined' && (window.__TF_API_BASE__ || 'http://localhost:3002')) || 'http://localhost:3002';

async function updateBug(id, data) {
  const url = `${API_BASE}/bugs/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Failed to update bug');
  }
  return res.json();
}

export default {
  updateBug,
};
