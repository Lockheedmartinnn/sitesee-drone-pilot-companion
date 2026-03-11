import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SITES, C, getDifficultyScore } from '@/components/siteintel/siteData';
import SiteDetailPanel from '@/components/siteintel/SiteDetailPanel';
import GeoViewModal from '@/components/siteintel/GeoViewModal';
import IntelModal from '@/components/siteintel/IntelModal';

const DIFF_COLORS = { green: '#00ff88', yellow: '#ffcc00', orange: '#ff6b00' };

function MapFlyController({ site }) {
  const map = useMap();
  useEffect(() => {
    if (site) map.flyTo([site.lat, site.lng], 14, { animate: true, duration: 0.8 });
  }, [site?.id]);
  return null;
}

const FilterBtn = ({ label, active, color, onClick }) => (
  <button onClick={onClick} style={{
    padding:'5px 14px', borderRadius:3, border:`1px solid ${color}`,
    fontFamily:'Rajdhani, sans-serif', fontSize:12, fontWeight:600, letterSpacing:1, cursor:'pointer', transition:'all 0.2s',
    background: active ? color : 'transparent',
    color: active ? '#000' : color,
  }}>{label}</button>
);

export default function SiteIntelMap() {
  const [selectedSite, setSelectedSite] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapView, setMapView] = useState('street');
  const [geoViewOpen, setGeoViewOpen] = useState(false);
  const [geoViewData, setGeoViewData] = useState(null);
  const [intelOpen, setIntelOpen] = useState(false);
  const [intelSite, setIntelSite] = useState(null);
  const [sidebarTab, setSidebarTab] = useState('detail'); // 'detail' | 'list'

  const stats = useMemo(() => ({
    total: SITES.length,
    green: SITES.filter(s => s.diff === 'green').length,
    yellow: SITES.filter(s => s.diff === 'yellow').length,
    orange: SITES.filter(s => s.diff === 'orange').length,
    fails: SITES.filter(s => s.jobs.includes('FAILED')).length,
  }), []);

  const filteredSites = useMemo(() => SITES.filter(s => {
    const matchFilter = activeFilter === 'all' || s.diff === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.suburb.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.state.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  }), [activeFilter, searchQuery]);

  const handleSelectSite = useCallback((site) => {
    setSelectedSite(site);
    setSidebarTab('detail');
  }, []);

  const handleOpenGeoView = useCallback((lat, lng, name, suburb, diff) => {
    setGeoViewData({ lat, lng, name, suburb, diff });
    setGeoViewOpen(true);
  }, []);

  const handleOpenIntel = useCallback((siteId) => {
    const site = SITES.find(s => s.id === siteId);
    if (site) { setIntelSite(site); setIntelOpen(true); }
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') { setGeoViewOpen(false); setIntelOpen(false); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const StatPill = ({ val, label, col }) => (
    <div style={{ background:C.panel2, border:`1px solid ${C.border}`, borderRadius:4, padding:'5px 12px', display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div style={{ fontSize:16, fontWeight:700, lineHeight:1, color: col || C.accent }}>{val}</div>
      <div style={{ fontSize:8, letterSpacing:2, color:C.dim, marginTop:2, whiteSpace:'nowrap' }}>{label}</div>
    </div>
  );

  return (
    <div style={{ height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', background:C.bg, fontFamily:"'Rajdhani', sans-serif", color:C.text, position:'relative' }}>
      {/* Scanline overlay */}
      <div style={{ position:'fixed', inset:0, background:'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,200,255,0.008) 2px, rgba(0,200,255,0.008) 4px)', pointerEvents:'none', zIndex:9 }} />

      {/* Header */}
      <div style={{ background:C.panel, borderBottom:`1px solid ${C.border}`, padding:'8px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, zIndex:10, flexWrap:'wrap', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:30, height:30, background:'linear-gradient(135deg, #00c8ff, #0066ff)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, boxShadow:'0 0 20px rgba(0,200,255,0.3)' }}>🛸</div>
          <div>
            <div style={{ fontSize:16, fontWeight:700, letterSpacing:3, color:'#fff', lineHeight:1 }}>CUSTOMER 1</div>
            <div style={{ fontSize:9, letterSpacing:4, color:C.accent, fontFamily:'JetBrains Mono, monospace', fontWeight:300 }}>DRONE SITE INTELLIGENCE</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <StatPill val={stats.total} label="TOTAL SITES" col={C.accent} />
          <StatPill val={stats.green} label="🟢 LOW" col={C.green} />
          <StatPill val={stats.yellow} label="🟡 MEDIUM" col={C.yellow} />
          <StatPill val={stats.orange} label="🟠 HIGH" col={C.orange} />
          <StatPill val={stats.fails} label="⚠ FAILS" col={C.red} />
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ background:C.panel2, borderBottom:`1px solid ${C.border}`, padding:'7px 20px', display:'flex', alignItems:'center', gap:10, flexShrink:0, zIndex:10, flexWrap:'wrap' }}>
        <span style={{ fontSize:9, letterSpacing:3, color:C.dim, fontFamily:'JetBrains Mono, monospace' }}>FILTER:</span>
        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
          <FilterBtn label="ALL" active={activeFilter==='all'} color={C.accent} onClick={() => setActiveFilter('all')} />
          <FilterBtn label="🟢 LOW" active={activeFilter==='green'} color={C.green} onClick={() => setActiveFilter('green')} />
          <FilterBtn label="🟡 MEDIUM" active={activeFilter==='yellow'} color={C.yellow} onClick={() => setActiveFilter('yellow')} />
          <FilterBtn label="🟠 HIGH" active={activeFilter==='orange'} color={C.orange} onClick={() => setActiveFilter('orange')} />
        </div>
        <div style={{ display:'flex', gap:5, marginLeft:8, alignItems:'center' }}>
          <span style={{ fontSize:9, letterSpacing:3, color:C.dim, fontFamily:'JetBrains Mono, monospace' }}>MAP:</span>
          <FilterBtn label="🗺 STREET" active={mapView==='street'} color={C.accent} onClick={() => setMapView('street')} />
          <FilterBtn label="🛰 SAT" active={mapView==='satellite'} color="#88bbff" onClick={() => setMapView('satellite')} />
        </div>
        <div style={{ marginLeft:'auto', background:C.panel, border:`1px solid ${C.border}`, borderRadius:4, padding:'4px 10px', display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ color:C.dim, fontSize:14 }}>⌕</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search sites..."
            style={{ background:'none', border:'none', outline:'none', color:C.text, fontFamily:'JetBrains Mono, monospace', fontSize:12, width:160 }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* Map */}
        <div style={{ flex:1, position:'relative', minWidth:0 }}>
          <MapContainer
            center={[-30.5, 145]}
            zoom={5}
            style={{ height:'100%', width:'100%', background:C.bg }}
            zoomControl
          >
            <MapFlyController site={selectedSite} />
            {mapView === 'street' ? (
              <TileLayer key="street" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© OpenStreetMap contributors' />
            ) : (
              <>
                <TileLayer key="sat" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='© Esri, Maxar' />
                <TileLayer key="labels" url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" opacity={0.8} />
              </>
            )}
            {filteredSites.map(site => {
              const isSelected = selectedSite?.id === site.id;
              const color = DIFF_COLORS[site.diff];
              return (
                <CircleMarker
                  key={site.id}
                  center={[site.lat, site.lng]}
                  radius={isSelected ? 12 : 7}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 1,
                    color: isSelected ? '#fff' : 'rgba(255,255,255,0.4)',
                    weight: isSelected ? 3 : 1.5,
                  }}
                  eventHandlers={{ click: () => handleSelectSite(site) }}
                >
                  <Tooltip direction="top" offset={[0, -8]}>
                    <div style={{ fontFamily:"'Rajdhani', sans-serif", lineHeight:1.5 }}>
                      <div style={{ fontWeight:700, marginBottom:2 }}>{site.name}</div>
                      <div style={{ fontSize:11, color }}>{site.diff.toUpperCase()} RISK</div>
                      <div style={{ fontSize:10, opacity:0.7 }}>{site.suburb}, {site.state}</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Side Panel */}
        <div style={{ width:360, background:C.panel, borderLeft:`1px solid ${C.border}`, display:'flex', flexDirection:'column', overflow:'hidden', flexShrink:0 }}>
          {/* Panel Header with tabs */}
          <div style={{ borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
            <div style={{ padding:'10px 16px', fontSize:10, letterSpacing:3, color:C.dim, fontFamily:'JetBrains Mono, monospace' }}>
              {selectedSite ? `FLIGHT PLAN — ${selectedSite.state}` : 'SELECT A SITE'}
            </div>
            <div style={{ display:'flex', borderTop:`1px solid ${C.border}` }}>
              {['detail','list'].map(tab => (
                <button key={tab} onClick={() => setSidebarTab(tab)} style={{
                  flex:1, padding:'8px', fontSize:9, fontFamily:'JetBrains Mono, monospace', letterSpacing:2,
                  color: sidebarTab===tab ? C.accent : C.dim,
                  borderBottom: `2px solid ${sidebarTab===tab ? C.accent : 'transparent'}`,
                  background:'none', border:'none', borderBottom:`2px solid ${sidebarTab===tab ? C.accent : 'transparent'}`,
                  cursor:'pointer',
                }}>
                  {tab === 'detail' ? '📋 DETAILS' : `📍 LIST (${filteredSites.length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Panel Body */}
          <div style={{ flex:1, overflowY:'auto', minHeight:0 }}>
            {sidebarTab === 'detail' ? (
              <SiteDetailPanel site={selectedSite} onOpenGeoView={handleOpenGeoView} onOpenIntel={handleOpenIntel} />
            ) : (
              <div>
                {filteredSites.map(site => {
                  const isActive = selectedSite?.id === site.id;
                  return (
                    <div
                      key={site.id}
                      onClick={() => handleSelectSite(site)}
                      style={{
                        padding:'10px 16px', borderBottom:`1px solid rgba(26,58,92,0.5)`,
                        cursor:'pointer', display:'flex', alignItems:'center', gap:10,
                        background: isActive ? 'rgba(0,200,255,0.05)' : 'transparent',
                        borderLeft: isActive ? `2px solid ${C.accent}` : '2px solid transparent',
                        transition:'background 0.15s',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.panel2; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ width:10, height:10, borderRadius:'50%', flexShrink:0, background:DIFF_COLORS[site.diff], boxShadow:`0 0 6px ${DIFF_COLORS[site.diff]}` }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{site.name}</div>
                        <div style={{ fontSize:10, fontFamily:'JetBrains Mono, monospace', color:C.dim, marginTop:2 }}>{site.id} · {site.suburb}, {site.state}</div>
                        {site.jobs.includes('FAILED') && <div style={{ fontSize:9, color:C.red, marginTop:2 }}>⚠ HAS FAILED JOB</div>}
                      </div>
                    </div>
                  );
                })}
                {filteredSites.length === 0 && (
                  <div style={{ padding:40, textAlign:'center', color:C.dim, fontSize:13 }}>No sites match your filter</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <GeoViewModal
        isOpen={geoViewOpen}
        lat={geoViewData?.lat}
        lng={geoViewData?.lng}
        name={geoViewData?.name}
        suburb={geoViewData?.suburb}
        diff={geoViewData?.diff}
        onClose={() => setGeoViewOpen(false)}
      />
      <IntelModal
        isOpen={intelOpen}
        site={intelSite}
        onClose={() => setIntelOpen(false)}
      />
    </div>
  );
}