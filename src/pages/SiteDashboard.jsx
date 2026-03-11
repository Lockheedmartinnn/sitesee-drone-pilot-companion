import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { SITES } from '@/components/siteintel/siteData';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MapPin, CalendarDays, CheckCircle2, AlertTriangle, Clock, Sparkles, TrendingUp, Activity } from 'lucide-react';

const RISK_COLORS = { green: '#00ff88', yellow: '#ffcc00', orange: '#ff6b00' };
const STATUS_COLORS = { planned: '#60a5fa', confirmed: '#34d399', completed: '#a78bfa', cancelled: '#f87171' };

function StatCard({ icon: Icon, label, value, sub, color = '#00c8ff' }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
      <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}22` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-bold text-white leading-tight">{value}</div>
        <div className="text-xs text-slate-400 font-medium">{label}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color }}>{sub}</div>}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{children}</h2>;
}

export default function SiteDashboard() {
  const { data: missions = [] } = useQuery({
    queryKey: ['scheduledMissions'],
    queryFn: () => base44.entities.ScheduledMission.list('-scheduled_date', 500),
  });

  // ── SITE ANALYTICS ────────────────────────────────────────────
  const siteStats = useMemo(() => {
    const byRisk = { green: 0, yellow: 0, orange: 0 };
    const byState = {};
    const failedSites = SITES.filter(s => s.jobs.includes('FAILED')).length;
    const completedSites = SITES.filter(s => s.jobs.includes('COMPLETE')).length;

    SITES.forEach(s => {
      byRisk[s.diff]++;
      byState[s.state] = (byState[s.state] || 0) + 1;
    });

    const stateData = Object.entries(byState)
      .sort((a, b) => b[1] - a[1])
      .map(([state, count]) => ({ state, count }));

    const riskData = [
      { name: 'Low Risk', value: byRisk.green, color: RISK_COLORS.green },
      { name: 'Medium Risk', value: byRisk.yellow, color: RISK_COLORS.yellow },
      { name: 'High Risk', value: byRisk.orange, color: RISK_COLORS.orange },
    ];

    return { byRisk, stateData, riskData, failedSites, completedSites, total: SITES.length };
  }, []);

  // ── SCHEDULE ANALYTICS ────────────────────────────────────────
  const schedStats = useMemo(() => {
    const byStatus = { planned: 0, confirmed: 0, completed: 0, cancelled: 0 };
    const byRisk = { green: 0, yellow: 0, orange: 0 };
    const byState = {};
    let aiGenerated = 0;

    missions.forEach(m => {
      if (byStatus[m.status] !== undefined) byStatus[m.status]++;
      if (m.diff && byRisk[m.diff] !== undefined) byRisk[m.diff]++;
      if (m.state) byState[m.state] = (byState[m.state] || 0) + 1;
      if (m.ai_generated) aiGenerated++;
    });

    const statusData = Object.entries(byStatus).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      color: STATUS_COLORS[status],
    }));

    const schedByState = Object.entries(byState)
      .sort((a, b) => b[1] - a[1])
      .map(([state, count]) => ({ state, count }));

    const schedRiskData = [
      { name: 'Low', value: byRisk.green, color: RISK_COLORS.green },
      { name: 'Medium', value: byRisk.yellow, color: RISK_COLORS.yellow },
      { name: 'High', value: byRisk.orange, color: RISK_COLORS.orange },
    ];

    // Coverage: how many unique sites have been scheduled
    const scheduledSiteIds = new Set(missions.map(m => m.site_id).filter(Boolean));
    const coverage = SITES.length > 0 ? Math.round((scheduledSiteIds.size / SITES.length) * 100) : 0;

    return { byStatus, statusData, schedByState, schedRiskData, aiGenerated, coverage, scheduledSiteIds, total: missions.length };
  }, [missions]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white shadow-xl">
        {payload.map((p, i) => <div key={i}>{p.name || p.dataKey}: <b>{p.value}</b></div>)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-y-auto">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Site & Schedule Analytics</h1>
            <p className="text-xs text-slate-400">Portfolio overview · {siteStats.total} sites · {schedStats.total} scheduled missions</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 max-w-7xl mx-auto">

        {/* ── SITE INTEL SECTION ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Site Portfolio</h2>
          </div>

          {/* Site KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard icon={MapPin} label="Total Sites" value={siteStats.total} color="#00c8ff" />
            <StatCard icon={CheckCircle2} label="Sites Completed" value={siteStats.completedSites} sub={`${Math.round(siteStats.completedSites/siteStats.total*100)}% of portfolio`} color="#00ff88" />
            <StatCard icon={AlertTriangle} label="Sites with Failures" value={siteStats.failedSites} sub="have job failures" color="#ff6b00" />
            <StatCard icon={TrendingUp} label="High Risk Sites" value={siteStats.byRisk.orange} sub="require RPAOC" color="#ff6b00" />
          </div>

          {/* Site charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risk distribution pie */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <SectionTitle>Risk Distribution</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={siteStats.riskData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {siteStats.riskData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sites by state */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <SectionTitle>Sites by State</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={siteStats.stateData} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
                  <XAxis dataKey="state" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Sites" radius={[3, 3, 0, 0]}>
                    {siteStats.stateData.map((_, i) => (
                      <Cell key={i} fill={['#00c8ff', '#00ff88', '#ffcc00', '#ff6b00', '#a78bfa', '#f472b6', '#34d399'][i % 7]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ── SCHEDULE SECTION ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Mission Schedule</h2>
          </div>

          {/* Schedule KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard icon={CalendarDays} label="Scheduled Missions" value={schedStats.total} color="#60a5fa" />
            <StatCard icon={CheckCircle2} label="Completed" value={schedStats.byStatus.completed} sub={schedStats.total > 0 ? `${Math.round(schedStats.byStatus.completed/schedStats.total*100)}% done` : '0%'} color="#34d399" />
            <StatCard icon={Clock} label="Planned / Confirmed" value={`${schedStats.byStatus.planned} / ${schedStats.byStatus.confirmed}`} sub="awaiting execution" color="#60a5fa" />
            <StatCard icon={Sparkles} label="AI Generated" value={schedStats.aiGenerated} sub={`${schedStats.total > 0 ? Math.round(schedStats.aiGenerated/schedStats.total*100) : 0}% of schedule`} color="#a78bfa" />
          </div>

          {/* Coverage progress */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-4">
            <SectionTitle>Portfolio Coverage</SectionTitle>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{schedStats.scheduledSiteIds.size} sites scheduled</span>
                  <span>{siteStats.total} total sites</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${schedStats.coverage}%`, background: 'linear-gradient(90deg, #00c8ff, #a78bfa)' }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-1">{schedStats.coverage}% of sites have at least one scheduled mission</div>
              </div>
              <div className="text-3xl font-bold text-white">{schedStats.coverage}%</div>
            </div>
          </div>

          {/* Schedule charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status breakdown */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <SectionTitle>Missions by Status</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={schedStats.statusData} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
                  <XAxis dataKey="status" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Missions" radius={[3, 3, 0, 0]}>
                    {schedStats.statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Scheduled risk mix */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <SectionTitle>Scheduled Missions by Risk Level</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={schedStats.schedRiskData.filter(d => d.value > 0)} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                    {schedStats.schedRiskData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Scheduled by state */}
            {schedStats.schedByState.length > 0 && (
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:col-span-2">
                <SectionTitle>Scheduled Missions by State</SectionTitle>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={schedStats.schedByState} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
                    <XAxis dataKey="state" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Missions" fill="#60a5fa" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>

        {/* ── SCHEDULED SITE DETAIL TABLE ── */}
        {missions.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Scheduled Sites Breakdown</h2>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs text-slate-500 uppercase tracking-wider">
                      <th className="text-left px-4 py-3">Site</th>
                      <th className="text-left px-4 py-3">State</th>
                      <th className="text-left px-4 py-3">Risk</th>
                      <th className="text-left px-4 py-3">Date</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {missions.slice(0, 30).map(m => (
                      <tr key={m.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-white">{m.site_name}</td>
                        <td className="px-4 py-2.5 text-slate-400">{m.state || '—'}</td>
                        <td className="px-4 py-2.5">
                          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: `${RISK_COLORS[m.diff] || '#666'}22`, color: RISK_COLORS[m.diff] || '#aaa' }}>
                            {m.diff ? m.diff.toUpperCase() : '—'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-400 font-mono text-xs">{m.scheduled_date}</td>
                        <td className="px-4 py-2.5">
                          <span className="px-2 py-0.5 rounded text-xs font-semibold capitalize" style={{ background: `${STATUS_COLORS[m.status] || '#666'}22`, color: STATUS_COLORS[m.status] || '#aaa' }}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 text-xs">{m.ai_generated ? '✦ AI' : 'Manual'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {missions.length > 30 && (
                  <div className="px-4 py-3 text-xs text-slate-500 border-t border-slate-700">Showing 30 of {missions.length} missions</div>
                )}
              </div>
            </div>
          </section>
        )}

        {schedStats.total === 0 && (
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-12 text-center text-slate-500">
            <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <div className="text-sm">No scheduled missions yet. Use the Mission Planner to start scheduling.</div>
          </div>
        )}
      </div>
    </div>
  );
}