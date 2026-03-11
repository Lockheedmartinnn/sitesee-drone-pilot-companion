import React, { useState } from 'react';
import { C } from './siteData';

const SOURCES = [
  { n:1, title:'MDPI Sensors — GPS Urban Canyon Study', meta:'Peer Reviewed · July 2025', url:'https://www.mdpi.com/1424-8220/25/15/4678' },
  { n:2, title:'NASA NTRS — Urban GNSS Multipath Algorithm', meta:'NASA Technical Report · 2025', url:'https://ntrs.nasa.gov/api/citations/20250000589' },
  { n:3, title:'u-blox — Multipath Mitigation Technology', meta:'u-blox Documentation · 2024', url:'https://www.u-blox.com/en/technologies/multipath-mitigation' },
  { n:4, title:'GIS Geography — GPS Accuracy: HDOP, PDOP, GDOP', meta:'Educational Reference', url:'https://gisgeography.com/gps-accuracy-hdop-pdop-gdop-multipath/' },
  { n:5, title:'DroneDeploy — GCP Best Practices', meta:'Industry Standard', url:'https://help.dronedeploy.com/hc/en-us/articles/11138616177047' },
  { n:6, title:'Wingtra — Ground Control Points Guide', meta:'Surveying Reference', url:'https://wingtra.com/surveying-gis/ground-control-points/' },
  { n:7, title:'Expert Photography — Drone Photography Tips', meta:'October 2024', url:'https://expertphotography.com/10-tips-awesome-drone-photography/' },
  { n:8, title:'DroneDeploy — RTK vs PPK vs GCP', meta:'Industry Blog · 2025', url:'https://www.dronedeploy.com/blog/what-is-the-difference-between-rtk-ppk-and-gcp-and-why-does-it-matter' },
  { n:9, title:'Emlid — Why You Need GCPs', meta:'December 2025', url:'https://blog.emlid.com/why-you-need-to-use-ground-control-points-gcp-for-drone-mapping/' },
  { n:10, title:'Penn State — Dilution of Precision', meta:'Academic Course Material', url:'https://www.e-education.psu.edu/natureofgeoinfo/c5_p21.html' },
];

const IRow = ({ label, value, col }) => {
  const colorMap = { g: C.green, y: C.yellow, o: C.orange, r: C.red, a: C.accent };
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:`1px solid rgba(255,255,255,0.05)`, gap:16, fontSize:13 }}>
      <span style={{ color: C.dim, fontSize: 12 }}>{label}</span>
      <span style={{ color: col ? colorMap[col] : C.text, textAlign:'right', fontWeight: 600 }}>{value}</span>
    </div>
  );
};

const ICard = ({ title, icon, badge, badgeCol, variant, children }) => {
  const borderColors = { warn: 'rgba(255,107,0,0.5)', ok: 'rgba(0,255,136,0.3)', caution: 'rgba(255,204,0,0.4)', default: C.border };
  const bc = { warn: C.orange, ok: C.green, caution: C.yellow, green: C.green, yellow: C.yellow, orange: C.orange, red: C.red }[badgeCol] || C.accent;
  return (
    <div style={{ background: C.panel, border: `1px solid ${borderColors[variant] || C.border}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:10, borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', flex: 1 }}>{title}</span>
        {badge && (
          <span style={{ fontSize:10, fontFamily:'JetBrains Mono, monospace', padding:'3px 10px', borderRadius:3,
            background:`${bc}1a`, color:bc, border:`1px solid ${bc}4d` }}>{badge}</span>
        )}
      </div>
      <div style={{ padding:'14px 16px' }}>{children}</div>
    </div>
  );
};

const StepItem = ({ emoji, title, action, critical }) => (
  <div style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'10px 12px', borderRadius:6, background:C.panel2, borderLeft:`3px solid ${critical ? C.orange : C.accent}` }}>
    <div style={{ width:26, height:26, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, background: critical ? 'rgba(255,107,0,0.15)' : 'rgba(0,200,255,0.15)', color: critical ? C.orange : C.accent }}>
      {emoji}
    </div>
    <div style={{ flex:1 }}>
      <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:3 }}>{critical ? '⚠ ' : ''}{title}</div>
      <div style={{ fontSize:13, color:C.text, lineHeight:1.5 }}>{action}</div>
    </div>
  </div>
);

function TimingTab({ s }) {
  const isUrban = s.factors.gps.includes('URBAN') || s.factors.gps.includes('HIGH');
  const bestWindow = isUrban ? '06:00 – 08:30' : '06:30 – 09:00';
  const winStyle = (type) => {
    const configs = {
      fly: { bg:'rgba(0,255,136,0.08)', border:'rgba(0,255,136,0.5)', color:C.green },
      ok: { bg:'rgba(0,200,255,0.08)', border:'rgba(0,200,255,0.4)', color:C.accent },
      no: { bg:'rgba(255,34,68,0.08)', border:'rgba(255,34,68,0.4)', color:C.red },
    };
    return configs[type];
  };
  const WinBlock = ({ type, emoji, label, time, sub }) => {
    const s = winStyle(type);
    return (
      <div style={{ flex:1, borderRadius:6, padding:'14px 12px', border:`1px solid ${s.border}`, background:s.bg, color:s.color, textAlign:'center' }}>
        <div style={{ fontSize:22, marginBottom:4 }}>{emoji}</div>
        <div style={{ fontSize:10, letterSpacing:2, marginBottom:6, opacity:0.7 }}>{label}</div>
        <div style={{ fontSize:22, fontWeight:700, lineHeight:1.1 }}>{time}</div>
        <div style={{ fontSize:11, marginTop:5, opacity:0.8 }}>{sub}</div>
      </div>
    );
  };
  const pdopSegs = [
    { range:'1–2', status:'✅ FLY', action:'Survey', bg:'rgba(0,255,136,0.15)', color:C.green, border:'rgba(0,255,136,0.4)' },
    { range:'2–3', status:'✅ FLY', action:'Mapping', bg:'rgba(0,200,255,0.12)', color:C.accent, border:'rgba(0,200,255,0.3)' },
    { range:'3–5', status:'⚠️ OK', action:'Inspect', bg:'rgba(255,204,0,0.12)', color:C.yellow, border:'rgba(255,204,0,0.3)' },
    { range:'5–8', status:'⏸ WAIT', action:'Try later', bg:'rgba(255,107,0,0.12)', color:C.orange, border:'rgba(255,107,0,0.3)' },
    { range:'8+', status:'🚫 ABORT', action:'Reschedule', bg:'rgba(255,34,68,0.12)', color:C.red, border:'rgba(255,34,68,0.3)' },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <ICard icon="✅" title="BEST TIME TO FLY" variant="ok">
        <div style={{ display:'flex', gap:10, marginBottom:4 }}>
          <WinBlock type="fly" emoji="🌅" label="BEST WINDOW" time={bestWindow} sub="GPS stable + good light" />
          <WinBlock type="ok" emoji="🌇" label="ALSO GOOD" time="15:30 – 17:30" sub="Afternoon golden hour" />
          <WinBlock type="no" emoji="🚫" label="AVOID" time="11:00 – 13:30" sub="Poor GPS + harsh light" />
        </div>
      </ICard>
      <ICard icon="📡" title="PDOP — GO / NO-GO">
        <div style={{ display:'flex', gap:4, margin:'10px 0' }}>
          {pdopSegs.map(seg => (
            <div key={seg.range} style={{ flex:1, padding:'8px 4px', borderRadius:4, textAlign:'center', background:seg.bg, color:seg.color, border:`1px solid ${seg.border}`, fontSize:12, fontWeight:700, lineHeight:1.4 }}>
              <div style={{ fontSize:11, opacity:0.8 }}>{seg.range}</div>
              <div style={{ fontSize:13, fontWeight:700 }}>{seg.status}</div>
              <div style={{ fontSize:10, marginTop:2, opacity:0.7 }}>{seg.action}</div>
            </div>
          ))}
        </div>
        <IRow label="Where to check PDOP" value="DJI GO4 · Litchi · Mission Planner" col="a" />
        <IRow label="Arm when PDOP is" value="≤ 2.5" col="g" />
        <IRow label="Don't fly surveys above" value="PDOP 5.0 — wait or reschedule" col="r" />
      </ICard>
      <ICard icon="🌤" title="WEATHER — QUICK CHECK">
        <IRow label="✅ Fly" value="Clear or cloudy · Wind < 15 km/h" col="g" />
        <IRow label="⚠️ OK" value="Overcast · Wind 15–25 km/h" col="y" />
        <IRow label="🚫 Don't fly" value="Rain · Wind > 25 km/h · Harsh midday sun" col="r" />
        <IRow label="Site wind note" value={s.factors.wind} />
      </ICard>
    </div>
  );
}

function GPSTab({ s }) {
  const gpsClass = s.factors.gps;
  const isUrbanCanyon = gpsClass.includes('URBAN CANYON') || gpsClass.includes('HIGH URBAN');
  const isHigh = gpsClass.includes('HIGH INTERFERENCE') || gpsClass.includes('HIGH');
  const isModerate = gpsClass.includes('MODERATE');
  const isHarbour = gpsClass.includes('HARBOUR');
  const isAirport = gpsClass.includes('AIRPORT');
  const riskColor = (isHigh||isUrbanCanyon) ? 'orange' : (isModerate||isHarbour) ? 'yellow' : 'green';
  const pdopTarget = (isHigh||isUrbanCanyon) ? '≤ 2.0' : isModerate ? '≤ 2.5' : '≤ 3.0';
  const waitTime = isUrbanCanyon ? '5–10 min' : isHigh ? '3–5 min' : '2–3 min';
  const steps = isUrbanCanyon||isHigh ? [
    { critical:true, emoji:'📡', t:'Turn on all constellations', d:'Enable GPS + GLONASS + Galileo + BeiDou in your drone app settings.' },
    { critical:true, emoji:'📐', t:'Set elevation mask to 15°', d:'Raise elevation mask to 15° to block weak signals bouncing off buildings.' },
    { critical:true, emoji:'🔁', t:'Use PPK not RTK', d:'PPK fixes GPS accuracy after your flight. RTK often drops signal in urban environments.' },
    { critical:false, emoji:'⏱', t:`Wait ${waitTime} before arming`, d:`Wait for PDOP to reach ${pdopTarget}. Don't rush this step.` },
    { critical:false, emoji:'🚁', t:'Take off vertically to 20m first', d:'Hover at 20m for 30 seconds after takeoff — GPS improves above building-level obstructions.' },
  ] : isHarbour ? [
    { critical:true, emoji:'🧭', t:'Launch away from the water', d:'Position takeoff point as far from open water as possible — water reflects GPS signals.' },
    { critical:false, emoji:'📡', t:'Turn on GPS + GLONASS', d:'Enable at minimum GPS and GLONASS constellations in your drone app.' },
    { critical:false, emoji:'⏱', t:`Wait ${waitTime} before arming`, d:`Wait for PDOP ${pdopTarget}. Wind-driven water creates signal drift.` },
  ] : [
    { critical:false, emoji:'📡', t:'Standard GPS check', d:'Allow 2–3 min for satellite lock. Multi-constellation recommended.' },
    { critical:false, emoji:'✅', t:`Confirm PDOP ${pdopTarget}`, d:'Check in your ground station app. 6+ satellites recommended.' },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <ICard icon="📡" title="THIS SITE GPS TYPE" badge={gpsClass} badgeCol={riskColor} variant={(isHigh||isUrbanCanyon) ? 'warn' : (isModerate||isHarbour) ? 'caution' : 'ok'}>
        <IRow label="Wait before arming" value={waitTime} col="y" />
        <IRow label="PDOP target" value={pdopTarget} col="g" />
        <IRow label="Correction method" value={(isHigh||isUrbanCanyon) ? 'PPK preferred' : isModerate ? 'RTK or PPK' : 'Standard GPS / RTK'} col="a" />
      </ICard>
      <ICard icon="📋" title="PRE-LAUNCH STEPS">
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {steps.map((step,i) => <StepItem key={i} emoji={step.emoji} title={step.t} action={step.d} critical={step.critical} />)}
        </div>
      </ICard>
      <ICard icon="🛸" title="SITE CONDITIONS">
        <IRow label="Airspace" value={s.factors.airspace} />
        <IRow label="Obstacles" value={s.factors.obstacles} />
        <IRow label="Restrictions" value={s.factors.restricted} col={s.factors.restricted !== 'NO' ? 'o' : 'g'} />
      </ICard>
    </div>
  );
}

function GCPTab({ s }) {
  const gcpNonRTK = s.diff==='orange' ? '8–12' : s.diff==='yellow' ? '5–8' : '4–5';
  const gcpRTK = s.diff==='orange' ? '5–7' : s.diff==='yellow' ? '3–5' : '3–4';
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <ICard icon="📍" title="HOW MANY GCPs?" badge={s.diff.toUpperCase()+' RISK'} badgeCol={s.diff} variant="caution">
        <IRow label="No RTK drone" value={`${gcpNonRTK} GCPs · 1 per 60 images`} col="o" />
        <IRow label="RTK or PPK drone" value={`${gcpRTK} GCPs · 1 per 200 images`} col="y" />
        <IRow label="Checkpoints" value="+2 extra points for accuracy check" col="a" />
        <IRow label="Best result" value="RTK drone + GCPs combined" col="g" />
      </ICard>
      <ICard icon="📐" title="WHERE TO PLACE THEM">
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <StepItem emoji="1" title="Corners + centre" action="Place at every corner of the survey area, plus at least one in the middle." />
          <StepItem emoji="!" title="Never in a straight line" action="Linear GCPs cause tilt errors. Minimum shape is a triangle." critical />
          <StepItem emoji="3" title="Max 300m apart" action="On large sites, fill the perimeter first then add interior points every 300m." />
          <StepItem emoji="4" title="Place at high AND low points" action="Put GCPs at both the highest and lowest elevations on the site." />
          <StepItem emoji="5" title="Use high-contrast markers" action="Pink/green tiles or black-and-white checkerboard. Clear centre point. No ambiguity." />
        </div>
      </ICard>
      <ICard icon="⚡" title="ACCURACY QUICK GUIDE" variant="ok">
        <IRow label="GPS only" value="±1–5m error" col="r" />
        <IRow label="RTK drone only" value="Sub 400mm" col="y" />
        <IRow label="PPK drone only" value="Sub 400mm · more reliable in urban" col="a" />
        <IRow label="RTK + GCPs" value="2–3cm · best achievable result" col="g" />
      </ICard>
    </div>
  );
}

function CaptureTab({ s }) {
  const isCoastal = s.factors.wind.includes('SEA') || ['Bondi','Coogee','Bronte','Manly','Cronulla'].some(x=>s.suburb.includes(x));
  const iso = isCoastal ? '100–200' : '100';
  const shut = isCoastal ? '1/1000s+' : '1/500–1/1000s';
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <ICard icon="📷" title="CAMERA SETTINGS">
        <IRow label="ISO" value={`${iso} — keep low`} col="g" />
        <IRow label="Shutter speed" value={shut} col="a" />
        <IRow label="Format" value="RAW — always" col="o" />
        <IRow label="White balance" value="Daylight or Auto" />
      </ICard>
      <ICard icon="🎯" title="FLIGHT SETTINGS" variant="ok">
        <IRow label="Altitude" value={s.diff==='orange' ? '50–80m' : s.diff==='yellow' ? '60–100m' : '80–120m'} />
        <IRow label="Speed" value="5–8 m/s · slower in wind" />
        <IRow label="Frontal overlap" value="75–80%" col="g" />
        <IRow label="Side overlap" value="60–70%" col="g" />
        <IRow label="Gimbal" value="-90° mapping · -45° inspection · 0° facade" />
      </ICard>
      <ICard icon="🌅" title="LIGHTING TIPS">
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <StepItem emoji="✅" title="Best: 30–60 min after sunrise" action="Soft directional light, long shadows. Not right at sunrise — lights only the edges." />
          <StepItem emoji="✅" title="OK: Overcast" action="Even light with no harsh shadows. Great for construction docs and detail shots." />
          <StepItem emoji="🚫" title="Avoid: 10am – 3pm" action="Overhead sun, flat shadows, blown-out highlights. Bad for photogrammetry." critical />
          <StepItem emoji="💡" title="Tip: Shoot from all 4 headings" action="Shadows and reflections change direction. Covering all angles gives the best set." />
        </div>
      </ICard>
      <ICard icon="⚙️" title="BEFORE YOU HIT GO">
        <IRow label="Screen record" value="ON — start before takeoff, stop after land" col="o" />
        <IRow label="Site wind" value={s.factors.wind} />
        <IRow label="Obstacles" value={s.factors.obstacles} />
      </ICard>
    </div>
  );
}

function SourcesTab() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <ICard icon="📚" title="SOURCES" badge={`${SOURCES.length} refs`} badgeCol="green">
        {SOURCES.map(src => (
          <div key={src.n} style={{ padding:'8px 0', borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
            <div style={{ fontSize:12, color:C.text, marginBottom:3 }}>[{src.n}] {src.title}</div>
            <div style={{ fontSize:11, color:C.dim, fontFamily:'JetBrains Mono, monospace' }}>{src.meta}</div>
            <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:C.accent, textDecoration:'none', fontFamily:'JetBrains Mono, monospace' }}>
              ↗ {src.url.replace('https://','').split('/')[0]}
            </a>
          </div>
        ))}
      </ICard>
    </div>
  );
}

const TABS = [
  { id:'timing', label:'⏰ TIMING' },
  { id:'gps', label:'📡 GPS FIX' },
  { id:'gcp', label:'📍 GCP' },
  { id:'capture', label:'📷 CAPTURE' },
  { id:'sources', label:'📚 SOURCES' },
];

export default function IntelModal({ isOpen, site, onClose }) {
  const [activeTab, setActiveTab] = useState('timing');
  if (!isOpen || !site) return null;

  const renderTab = () => {
    if (activeTab === 'timing') return <TimingTab s={site} />;
    if (activeTab === 'gps') return <GPSTab s={site} />;
    if (activeTab === 'gcp') return <GCPTab s={site} />;
    if (activeTab === 'capture') return <CaptureTab s={site} />;
    return <SourcesTab />;
  };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:10001,
      background:'rgba(0,0,0,0.97)', display:'flex', flexDirection:'column',
    }}>
      {/* Toolbar */}
      <div style={{ background:C.panel, borderBottom:`2px solid ${C.yellow}`, padding:'12px 20px', display:'flex', alignItems:'center', gap:16, flexShrink:0 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.yellow, letterSpacing:3 }}>⚡ MISSION INTELLIGENCE</div>
          <div style={{ fontSize:10, fontFamily:'JetBrains Mono, monospace', color:C.dim, letterSpacing:2, marginTop:2 }}>
            {site.name.toUpperCase()} · {site.id} · {site.suburb}
          </div>
        </div>
        <button onClick={onClose} style={{
          padding:'7px 16px', borderRadius:4, border:'1px solid rgba(255,34,68,0.4)',
          background:'rgba(255,34,68,0.08)', color:'#ff6680', fontSize:12, fontWeight:700,
          letterSpacing:1, cursor:'pointer', flexShrink:0,
        }}>✕ CLOSE</button>
      </div>

      {/* Tabs */}
      <div style={{ background:C.panel2, borderBottom:`1px solid ${C.border}`, display:'flex', flexShrink:0, overflowX:'auto' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding:'12px 20px', fontSize:11, fontFamily:'JetBrains Mono, monospace', letterSpacing:2,
            color: activeTab === tab.id ? C.yellow : C.dim,
            cursor:'pointer', borderBottom: `2px solid ${activeTab === tab.id ? C.yellow : 'transparent'}`,
            background:'none', border:'none', borderBottom: `2px solid ${activeTab === tab.id ? C.yellow : 'transparent'}`,
            whiteSpace:'nowrap', flexShrink:0, transition:'all 0.15s',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex:1, minHeight:0, overflowY:'scroll', padding:'16px 20px', display:'flex', flexDirection:'column', gap:12 }}>
        {renderTab()}
      </div>
    </div>
  );
}