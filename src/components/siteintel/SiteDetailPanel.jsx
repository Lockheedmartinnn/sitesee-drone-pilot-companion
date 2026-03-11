import React, { useMemo } from 'react';
import { C, getFlightPlan, getDifficultyScore, getScoreColor } from './siteData';

const DIFF_LABELS = { orange:'🟠 HIGH RISK', yellow:'🟡 MEDIUM RISK', green:'🟢 LOW RISK' };

const Sec = ({ title }) => (
  <div style={{ fontSize:9, letterSpacing:3, color:C.accent, fontFamily:'JetBrains Mono, monospace', marginBottom:10, paddingBottom:6, borderBottom:`1px solid ${C.border}` }}>
    {title}
  </div>
);

const FPRow = ({ label, value, highlight }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'6px 0', borderBottom:`1px solid rgba(255,255,255,0.05)`, fontSize:12 }}>
    <span style={{ color:C.dim, fontFamily:'JetBrains Mono, monospace', fontSize:10, paddingTop:1 }}>{label}</span>
    <span style={{ color: highlight ? C.accent : C.text, textAlign:'right', maxWidth:200, lineHeight:1.4, fontWeight: highlight ? 600 : 400 }}>{value}</span>
  </div>
);

const FPBox = ({ children }) => (
  <div style={{ background:C.panel2, border:`1px solid ${C.border}`, borderRadius:6, padding:14, marginBottom:16 }}>
    {children}
  </div>
);

export default function SiteDetailPanel({ site, onOpenGeoView, onOpenIntel }) {
  const plan = useMemo(() => site ? getFlightPlan(site) : null, [site]);
  const score = useMemo(() => site ? getDifficultyScore(site) : 0, [site?.id]);
  const scoreColor = site ? getScoreColor(site.diff) : '';

  if (!site) {
    return (
      <div style={{ padding:'60px 20px', textAlign:'center', color:C.dim, fontSize:13, lineHeight:1.6 }}>
        <div style={{ fontSize:48, marginBottom:16, opacity:0.3 }}>🛸</div>
        <div>Click any marker on the map<br />or a site in the list below<br />to view its drone flight plan.</div>
      </div>
    );
  }

  const failCount = site.jobs.filter(j => j === 'FAILED').length;
  const completeCount = site.jobs.filter(j => j === 'COMPLETE').length;
  const queuedCount = site.jobs.filter(j => j === 'CREATED').length;

  const factorClass = (val, highKw, cautionKw) => {
    if (highKw.some(k => val.includes(k))) return C.orange;
    if (cautionKw.some(k => val.includes(k))) return C.yellow;
    return C.green;
  };

  const chipColors = { COMPLETE: { border:C.green, color:C.green, bg:'rgba(0,255,136,0.08)' }, FAILED: { border:C.red, color:C.red, bg:'rgba(255,34,68,0.08)' }, STARTED: { border:C.accent, color:C.accent, bg:'rgba(0,200,255,0.08)' }, CREATED: { border:C.dim, color:C.dim, bg:'rgba(90,138,170,0.08)' } };

  return (
    <div style={{ padding:20, overflowY:'auto', height:'100%' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:'#fff', lineHeight:1.2 }}>{site.name}</div>
          <div style={{ fontSize:10, fontFamily:'JetBrains Mono, monospace', color:C.dim, marginTop:4 }}>{site.id} · {site.suburb}, {site.state}</div>
          <div style={{ fontSize:10, fontFamily:'JetBrains Mono, monospace', color:C.dim, marginTop:2 }}>📍 {site.lat.toFixed(4)}, {site.lng.toFixed(4)}</div>
        </div>
        <div style={{
          padding:'4px 12px', borderRadius:3, fontSize:11, fontWeight:700, letterSpacing:2, flexShrink:0, marginLeft:12,
          background: `rgba(${site.diff==='orange'?'255,107,0':site.diff==='yellow'?'255,204,0':'0,255,136'},0.15)`,
          color: site.diff==='orange'?C.orange:site.diff==='yellow'?C.yellow:C.green,
          border: `1px solid ${site.diff==='orange'?C.orange:site.diff==='yellow'?C.yellow:C.green}`,
        }}>{DIFF_LABELS[site.diff]}</div>
      </div>

      {/* Action Buttons */}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <button onClick={() => onOpenGeoView(site.lat, site.lng, site.name, site.suburb, site.diff)} style={{
          flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          padding:'9px 8px', borderRadius:5, fontFamily:'Rajdhani, sans-serif',
          fontSize:11, fontWeight:700, letterSpacing:1.5, cursor:'pointer', transition:'all 0.2s',
          background:'rgba(0,200,255,0.07)', border:`1px solid rgba(0,200,255,0.35)`, color:C.accent,
        }}>🌍 VIEW SITE</button>
        <button onClick={() => onOpenIntel(site.id)} style={{
          flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          padding:'9px 8px', borderRadius:5, fontFamily:'Rajdhani, sans-serif',
          fontSize:11, fontWeight:700, letterSpacing:1.5, cursor:'pointer', transition:'all 0.2s',
          background:'rgba(255,204,0,0.07)', border:`1px solid rgba(255,204,0,0.35)`, color:C.yellow,
        }}>⚡ MISSION INTEL</button>
      </div>

      {/* Difficulty Score */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:9, letterSpacing:2, color:C.dim, fontFamily:'JetBrains Mono, monospace', marginBottom:6 }}>DIFFICULTY SCORE</div>
        <div style={{ height:6, background:'rgba(255,255,255,0.1)', borderRadius:3, overflow:'hidden' }}>
          <div style={{ height:'100%', borderRadius:3, background:scoreColor, width:`${Math.round(score)}%`, transition:'width 0.5s ease' }} />
        </div>
        <div style={{ fontSize:10, fontFamily:'JetBrains Mono, monospace', color:C.dim, marginTop:4 }}>
          {Math.round(score)}/100 — {site.diff==='orange'?'Challenging — full planning required':site.diff==='yellow'?'Moderate — take precautions':'Straightforward — standard procedures'}
        </div>
      </div>

      {/* Failed warning */}
      {failCount > 0 && (
        <div style={{ background:'rgba(255,34,68,0.1)', border:`1px solid ${C.red}`, borderRadius:4, padding:'8px 12px', marginBottom:12, fontSize:12, color:'#ff8899' }}>
          ⚠ {failCount} PREVIOUS FAILED ATTEMPT{failCount>1?'S':''} — Review failure cause before rescheduling
        </div>
      )}

      {/* Site Factors */}
      <div style={{ marginBottom:16 }}>
        <Sec title="SITE FACTORS" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
          {[
            { label:'GPS ENVIRONMENT', val:site.factors.gps, hi:['HIGH','URBAN CANYON'], caution:['MODERATE','HARBOUR','MULTIPATH','TROPICAL'] },
            { label:'AIRSPACE CLASS', val:site.factors.airspace, hi:['CLASS C'], caution:['CLASS D'] },
            { label:'OBSTACLES', val:site.factors.obstacles, hi:['VERY','SKYSCRAPER'], caution:['HIGH-RISE','HOSPITAL','HELIPAD','AIRPORT'] },
            { label:'WIND PATTERN', val:site.factors.wind, hi:['STRONG','JET','MONSOON'], caution:['MODERATE','HARBOUR'] },
          ].map(f => (
            <div key={f.label} style={{ background:C.panel2, border:`1px solid ${C.border}`, borderRadius:4, padding:'8px 10px' }}>
              <div style={{ fontSize:9, letterSpacing:1.5, color:C.dim, fontFamily:'JetBrains Mono, monospace' }}>{f.label}</div>
              <div style={{ fontSize:12, fontWeight:600, marginTop:3, color:factorClass(f.val, f.hi, f.caution) }}>{f.val}</div>
            </div>
          ))}
        </div>
        <div style={{
          background: site.factors.restricted !== 'NO' ? 'rgba(255,107,0,0.1)' : 'rgba(0,255,136,0.05)',
          border: `1px solid ${site.factors.restricted !== 'NO' ? 'rgba(255,107,0,0.4)' : 'rgba(0,255,136,0.2)'}`,
          borderRadius:4, padding:'6px 10px', fontSize:11,
          color: site.factors.restricted !== 'NO' ? '#ff9944' : '#00cc66',
        }}>
          {site.factors.restricted !== 'NO' ? `⛔ RESTRICTIONS: ${site.factors.restricted}` : '✓ NO AIRSPACE RESTRICTIONS'}
        </div>
      </div>

      {/* Flight Plan */}
      <div style={{ marginBottom:16 }}>
        <Sec title="FLIGHT PLAN" />
        <FPBox>
          <FPRow label="⏰ BEST TIME" value={plan.bestTime} highlight />
          <FPRow label="🌤 WEATHER" value={plan.weather} />
          <FPRow label="🛸 APPROACH" value={plan.approach} />
          <FPRow label="✈️ ALTITUDE" value={plan.altitude} />
          <FPRow label="👥 CREW" value={plan.crew} />
          <FPRow label="📋 PERMITS" value={plan.permits} />
          <FPRow label="⏱ TOTAL TIME" value={plan.flightTime} highlight />
          <FPRow label="🔧 EQUIPMENT" value={plan.equipment} />
        </FPBox>
      </div>

      {/* Camera */}
      <div style={{ marginBottom:16 }}>
        <Sec title="CAMERA SETTINGS" />
        <FPBox>
          <FPRow label="📷 REQUIRED" value={plan.camera} />
          <FPRow label="🎥 SCREEN REC" value="ON — hover start to mission end. Do not turn off mid-flight." highlight />
        </FPBox>
      </div>

      {/* GPS */}
      <div style={{ marginBottom:16 }}>
        <Sec title="GPS STABILISATION — CRITICAL" />
        <FPBox>
          <FPRow label="📡 PROCEDURE" value={plan.gpsAction} highlight={site.diff==='orange'} />
        </FPBox>
      </div>

      {/* Battery */}
      <div style={{ marginBottom:16 }}>
        <Sec title="BATTERY PROTOCOL" />
        <FPBox>
          <FPRow label="🔋 PROTOCOL" value={plan.batteryNote} highlight={plan.batteryNote.startsWith('⚠')} />
        </FPBox>
      </div>

      {/* GCP */}
      <div style={{ marginBottom:16 }}>
        <Sec title="GCP PLACEMENT" />
        <FPBox>
          <FPRow label="📍 REQUIREMENTS" value={plan.gcpNote} highlight={plan.gcpNote.startsWith('⚠')} />
        </FPBox>
      </div>

      {/* Mission Setup */}
      <div style={{ marginBottom:16 }}>
        <Sec title="MISSION SETUP — V9.8.0" />
        <FPBox>
          <FPRow label="⚙️ NOTES" value={plan.missionSetup} />
        </FPBox>
      </div>

      {/* Job History */}
      <div>
        <Sec title="JOB HISTORY" />
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
          {site.jobs.length ? site.jobs.map((j,i) => {
            const cc = chipColors[j] || chipColors.CREATED;
            return (
              <span key={i} style={{ padding:'3px 8px', borderRadius:3, fontSize:10, fontFamily:'JetBrains Mono, monospace', border:`1px solid ${cc.border}`, color:cc.color, background:cc.bg }}>
                {j}
              </span>
            );
          }) : <span style={{ fontSize:11, color:C.dim, fontFamily:'JetBrains Mono, monospace' }}>No jobs recorded</span>}
        </div>
        <div style={{ fontSize:11, fontFamily:'JetBrains Mono, monospace', color:C.dim }}>
          ✅ {completeCount} complete · ❌ {failCount} failed · 📋 {queuedCount} queued
        </div>
      </div>
    </div>
  );
}