import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService.js';

// Lightweight Bug Detail Modal - skeleton with editable fields
export const BugDetailModal = ({ bug, onUpdate, onClose }) => {
  const [title, setTitle] = useState(bug?.title ?? '');
  const [description, setDescription] = useState(bug?.description ?? '');
  const [priority, setPriority] = useState(bug?.priority ?? 'minor');
  const [status, setStatus] = useState(bug?.status ?? 'open');

  useEffect(() => {
    if (bug) {
      setTitle(bug.title ?? '');
      setDescription(bug.description ?? '');
      setPriority(bug.priority ?? 'minor');
      setStatus(bug.status ?? 'open');
    }
  }, [bug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = { ...bug, title, description, priority, status };
    // Persist via API if available
    try {
      if (bug?.id && apiService?.updateBug) {
        await apiService.updateBug(bug.id, updated);
      }
    } catch (err) {
      console.error('Failed to save bug via API:', err);
    }
    if (onUpdate) {
      onUpdate(updated);
    }
  };

  return (
    <div className="modal" role="dialog" aria-label="Bug detail modal">
      <div className="modal-content card" style={{ width: 'min(720px, 90vw)', margin: '5vh auto' }}>
        <div className="card-header" style={{ padding: '1rem 1.25rem' }}>
          <div className="card-title">Bug Detail</div>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="card-body" style={{ padding: '0 1rem 1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label>Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="blocker">Blocker</option>
                  <option value="major">Major</option>
                  <option value="minor">Minor</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: 12 }}>
              <div>
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label>Environment</label>
                <input value={bug?.environment ?? ''} readOnly />
              </div>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', padding: '0 1rem 1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ marginLeft: 8 }}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BugDetailModal;
