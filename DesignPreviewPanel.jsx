import React from 'react';
import DesignPreview from '../pages/DesignPreview.jsx';

const DesignPreviewPanel = () => {
  return (
    <div className="card design-preview-panel" style={{ marginTop: 12 }}>
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="card-title">🎨 Design Preview</div>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>(embedded)</span>
      </div>
      <div className="card-body" style={{ padding: 12 }}>
        <DesignPreview compact />
      </div>
    </div>
  );
};

export default DesignPreviewPanel;
