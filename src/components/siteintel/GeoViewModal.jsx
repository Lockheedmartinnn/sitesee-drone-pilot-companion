import React, { useState } from 'react';
import { C } from './siteData';

const DIFF_LABELS = { orange: '🟠 HIGH RISK', yellow: '🟡 MEDIUM RISK', green: '🟢 LOW RISK' };

export default function GeoViewModal({ isOpen, lat, lng, name, suburb, diff, onClose }) {
  const [mode, setMode] = useState('satellite');

  if (!isOpen) return null;

  const getFrameSrc = (m) => {
    if (m === 'satellite') return `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=19&output=embed`;
    if (m === 'streetview') return `https://www.google.com/maps?layer=c&cbll=${lat},${lng}&cbp=12,0,,0,0&output=svembed&z=18`;
    return `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=16&output=embed`;
  };

  const tabBtn = (m, label) => (
    <button
      key={m}
      onClick={() => setMode(m)}
      style={{
        padding: '6px 16px', borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: 1,
        cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Rajdhani, sans-serif',
        background: mode === m ? 'rgba(0,200,255,0.12)' : 'transparent',
        border: `1px solid ${mode === m ? C.accent : C.border}`,
        color: mode === m ? C.accent : C.dim,
      }}
    >{label}</button>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.92)', display: 'flex', flexDirection: 'column',
    }}>
      {/* Toolbar */}
      <div style={{
        background: C.panel, borderBottom: `1px solid ${C.border}`,
        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
            🌍 {name?.toUpperCase()}
          </div>
          <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: C.dim, letterSpacing: 1 }}>
            {suburb} · {lat?.toFixed(5)}, {lng?.toFixed(5)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
          {tabBtn('satellite', '🛰 SATELLITE')}
          {tabBtn('streetview', '📷 STREET VIEW')}
          {tabBtn('earth', '🌍 WIDE VIEW')}
        </div>
        <button onClick={onClose} style={{
          padding: '6px 14px', borderRadius: 4, border: '1px solid rgba(255,34,68,0.4)',
          background: 'rgba(255,34,68,0.08)', color: '#ff6680', fontSize: 12, fontWeight: 700,
          letterSpacing: 1, cursor: 'pointer', marginLeft: 8,
        }}>✕ CLOSE</button>
      </div>

      {/* Iframe */}
      <iframe
        key={mode}
        src={getFrameSrc(mode)}
        allowFullScreen
        style={{ flex: 1, border: 'none', width: '100%' }}
        title="Geo View"
      />

      {/* Info bar */}
      <div style={{
        background: C.panel2, borderTop: `1px solid ${C.border}`,
        padding: '8px 16px', display: 'flex', gap: 24, alignItems: 'center', flexShrink: 0,
        fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: C.dim,
      }}>
        <div>📍 <span style={{ color: C.accent }}>{lat?.toFixed(5)}, {lng?.toFixed(5)}</span></div>
        <div>🏙 <span style={{ color: C.accent }}>{suburb}</span></div>
        <div>⚠ <span style={{ color: C.accent }}>{DIFF_LABELS[diff] || diff}</span></div>
        <div style={{ marginLeft: 'auto', opacity: 0.4, fontSize: 10 }}>Drag to pan · Scroll to zoom</div>
      </div>
    </div>
  );
}