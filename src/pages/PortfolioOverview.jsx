import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle2, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function PortfolioOverview() {
  const [filters, setFilters] = useState({
    country: 'all',
    region: 'all',
    customer: 'all',
    pilot_group: 'all',
    drone_model: 'all'
  });
  
  const { data: missions = [], isLoading } = useQuery({
    queryKey: ['allMissions'],
    queryFn: () => base44.entities.MissionLog.list('-created_date', 1000),
  });
  
  const filteredMissions = useMemo(() => {
    return missions.filter(m => {
      if (filters.country !== 'all' && m.country !== filters.country) return false;
      if (filters.region !== 'all' && m.region !== filters.region) return false;
      if (filters.customer !== 'all' && m.customer !== filters.customer) return false;
      if (filters.pilot_group !== 'all' && m.pilot_group !== filters.pilot_group) return false;
      if (filters.drone_model !== 'all' && m.drone_model !== filters.drone_model) return false;
      return true;
    });
  }, [missions, filters]);
  
  const uniqueValues = useMemo(() => ({
    countries: [...new Set(missions.map(m => m.country).filter(Boolean))],
    regions: [...new Set(missions.map(m => m.region).filter(Boolean))],
    customers: [...new Set(missions.map(m => m.customer).filter(Boolean))],
    pilot_groups: [...new Set(missions.map(m => m.pilot_group).filter(Boolean))],
    drone_models: [...new Set(missions.map(m => m.drone_model).filter(Boolean))]
  }), [missions]);
  
  const stats = useMemo(() => {
    const total = filteredMissions.length;
    const pass = filteredMissions.filter(m => m.outcome === 'Pass').length;
    const rework = filteredMissions.filter(m => m.outcome === 'Rework').length;
    const fail = filteredMissions.filter(m => m.outcome === 'Fail').length;
    
    return {
      total,
      pass: total ? ((pass / total) * 100).toFixed(1) : 0,
      rework: total ? ((rework / total) * 100).toFixed(1) : 0,
      fail: total ? ((fail / total) * 100).toFixed(1) : 0
    };
  }, [filteredMissions]);
  
  const pieData = [
    { name: 'Pass', value: parseFloat(stats.pass), color: '#10b981' },
    { name: 'Rework', value: parseFloat(stats.rework), color: '#f59e0b' },
    { name: 'Fail', value: parseFloat(stats.fail), color: '#ef4444' }
  ];
  
  const topFlagReasons = useMemo(() => {
    const flagged = filteredMissions.filter(m => m.flagged && m.primary_flag_reason);
    const counts = {};
    flagged.forEach(m => {
      counts[m.primary_flag_reason] = (counts[m.primary_flag_reason] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([reason, count]) => ({ reason, count }));
  }, [filteredMissions]);
  
  const timelineData = useMemo(() => {
    const byDate = {};
    filteredMissions.forEach(m => {
      const date = new Date(m.mission_date || m.created_date).toISOString().split('T')[0];
      if (!byDate[date]) byDate[date] = { date, total: 0, failed: 0 };
      byDate[date].total++;
      if (m.outcome === 'Fail') byDate[date].failed++;
    });
    return Object.values(byDate)
      .map(d => ({ date: d.date, rate: d.total ? ((d.failed / d.total) * 100).toFixed(1) : 0 }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);
  }, [filteredMissions]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-5 py-8 pb-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold">Portfolio Overview</h1>
          <p className="text-slate-400 mt-1">Quality metrics across all missions</p>
        </motion.div>
        
        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-slate-400" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs">Country</Label>
              <Select value={filters.country} onValueChange={(v) => setFilters({...filters, country: v})}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueValues.countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs">Region</Label>
              <Select value={filters.region} onValueChange={(v) => setFilters({...filters, region: v})}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueValues.regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs">Customer</Label>
              <Select value={filters.customer} onValueChange={(v) => setFilters({...filters, customer: v})}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueValues.customers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs">Pilot Group</Label>
              <Select value={filters.pilot_group} onValueChange={(v) => setFilters({...filters, pilot_group: v})}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueValues.pilot_groups.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs">Drone Model</Label>
              <Select value={filters.drone_model} onValueChange={(v) => setFilters({...filters, drone_model: v})}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueValues.drone_models.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500/10 rounded-2xl border border-emerald-500/30 p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-sm text-slate-400">Pass Rate</p>
                <p className="text-3xl font-bold text-emerald-400">{stats.pass}%</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-amber-500/10 rounded-2xl border border-amber-500/30 p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-sm text-slate-400">Rework Rate</p>
                <p className="text-3xl font-bold text-amber-400">{stats.rework}%</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-red-500/10 rounded-2xl border border-red-500/30 p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-sm text-slate-400">Fail Rate</p>
                <p className="text-3xl font-bold text-red-400">{stats.fail}%</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <h3 className="font-semibold mb-4">Outcome Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={(entry) => `${entry.name}: ${entry.value}%`}>
                  {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <h3 className="font-semibold mb-4">Top 5 Flag Reasons</h3>
            <div className="space-y-3">
              {topFlagReasons.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-700/50 rounded-lg p-3">
                    <p className="text-sm text-slate-300">{item.reason}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-red-400">{item.count}</span>
                  </div>
                </div>
              ))}
              {topFlagReasons.length === 0 && (
                <p className="text-center text-slate-500 py-8">No flagged missions</p>
              )}
            </div>
          </motion.div>
        </div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mt-6">
          <h3 className="font-semibold mb-4">Failure Rate Over Time (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}