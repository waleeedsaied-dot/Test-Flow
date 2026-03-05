import React from 'react';

// Skeleton for a Test modal. Will be wired to API in a follow-up.
export const TestModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal" role="dialog" aria-label="Test modal">
      <div className="modal-content card" style={{ width: 'min(720px, 90vw)', margin: '5vh auto' }}>
        <div className="card-header" style={{ padding: '1rem 1.25rem' }}>
          <div className="card-title">Test Modal</div>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
        <div className="card-body" style={{ padding: '0 1rem 1rem' }}>
          <p>Test modal placeholder. This will collect and manage test definitions, runs, and results.</p>
        </div>
      </div>
    </div>
  );
};

export default TestModal;
