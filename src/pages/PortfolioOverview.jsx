import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAccessControl, filterMissionsByAccess } from '@/components/useAccessControl';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle2, Filter, ChevronDown, ChevronUp, MapPin, Users, Wrench } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { format, startOfYear, endOfYear, startOfMonth, endOfMonth } from 'date-fns';

export default function PortfolioOverview() {
  const [filters, setFilters] = useState({
    country: 'all',
    region: 'all',
    customer: 'all',
    pilot_group: 'all',
    drone_model: 'all',
    dateRange: 'all',
    year: 'all'
  });
  
  const [expandedSection, setExpandedSection] = useState(null);
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const permissions = useAccessControl(user);

  const { data: allMissions = [], isLoading } = useQuery({
    queryKey: ['allMissions'],
    queryFn: () => base44.entities.MissionLog.list('-created_date', 1000),
  });

  const missions = useMemo(() => {
    if (!user) return [];
    return filterMissionsByAccess(allMissions, permissions, user.email, user);
  }, [allMissions, permissions, user]);
  
  const filteredMissions = useMemo(() => {
    return missions.filter(m => {
      if (filters.country !== 'all' && m.country !== filters.country) return false;
      if (filters.region !== 'all' && m.region !== filters.region) return false;
      if (filters.customer !== 'all' && m.customer !== filters.customer) return false;
      if (filters.pilot_group !== 'all' && m.pilot_group !== filters.pilot_group) return false;
      if (filters.drone_model !== 'all' && m.drone_model !== filters.drone_model) return false;
      
      // Date filters
      const missionDate = new Date(m.mission_date || m.created_date);
      if (filters.year !== 'all') {
        const year = parseInt(filters.year);
        if (missionDate.getFullYear() !== year) return false;
      }
      if (filters.dateRange !== 'all') {
        const now = new Date();
        let startDate;
        if (filters.dateRange === 'thisMonth') {
          startDate = startOfMonth(now);
        } else if (filters.dateRange === 'lastMonth') {
          startDate = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1));
        } else if (filters.dateRange === 'last3Months') {
          startDate = new Date(now.getFullYear(), now.getMonth() - 3);
        } else if (filters.dateRange === 'last6Months') {
          startDate = new Date(now.getFullYear(), now.getMonth() - 6);
        }
        if (startDate && missionDate < startDate) return false;
      }
      
      return true;
    });
  }, [missions, filters]);
  
  const uniqueValues = useMemo(() => ({
    countries: [...new Set(missions.map(m => m.country).filter(Boolean))],
    regions: [...new Set(missions.map(m => m.region).filter(Boolean))],
    customers: [...new Set(missions.map(m => m.customer).filter(Boolean))],
    pilot_groups: [...new Set(missions.map(m => m.pilot_group).filter(Boolean))],
    drone_models: [...new Set(missions.map(m => m.drone_model).filter(Boolean))],
    years: [...new Set(missions.map(m => {
      const date = new Date(m.mission_date || m.created_date);
      return date.getFullYear();
    }))].sort((a, b) => b - a)
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
  
  const failuresByReason = useMemo(() => {
    const failures = filteredMissions.filter(m => m.outcome === 'Fail' || m.outcome === 'Rework');
    const byReason = {};
    failures.forEach(m => {
      if (m.primary_flag_reason) {
        if (!byReason[m.primary_flag_reason]) {
          byReason[m.primary_flag_reason] = { reason: m.primary_flag_reason, count: 0, missions: [] };
        }
        byReason[m.primary_flag_reason].count++;
        byReason[m.primary_flag_reason].missions.push(m);
      }
    });
    return Object.values(byReason).sort((a, b) => b.count - a.count);
  }, [filteredMissions]);
  
  const locationFailures = useMemo(() => {
    const byRegion = {};
    filteredMissions.forEach(m => {
      const region = m.region || 'Unknown';
      if (!byRegion[region]) byRegion[region] = { region, total: 0, failed: 0, missions: [] };
      byRegion[region].total++;
      if (m.outcome === 'Fail' || m.outcome === 'Rework') {
        byRegion[region].failed++;
        byRegion[region].missions.push(m);
      }
    });
    return Object.values(byRegion)
      .map(d => ({ 
        region: d.region, 
        rate: d.total ? ((d.failed / d.total) * 100).toFixed(1) : 0, 
        failed: d.failed,
        total: d.total,
        missions: d.missions
      }))
      .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));
  }, [filteredMissions]);
  
  const mapMarkers = useMemo(() => {
    return filteredMissions
      .filter(m => m.latitude && m.longitude)
      .map(m => ({
        lat: m.latitude,
        lng: m.longitude,
        outcome: m.outcome,
        site: m.notes || 'Unknown Site',
        region: m.region
      }));
  }, [filteredMissions]);
  
  const siteTypePerformance = useMemo(() => {
    const bySite = {};
    filteredMissions.forEach(m => {
      const site = m.site_type || 'Unknown';
      if (!bySite[site]) bySite[site] = { site, total: 0, pass: 0 };
      bySite[site].total++;
      if (m.outcome === 'Pass') bySite[site].pass++;
    });
    return Object.values(bySite)
      .map(d => ({ site: d.site, rate: d.total ? ((d.pass / d.total) * 100).toFixed(1) : 0, total: d.total }))
      .sort((a, b) => b.total - a.total);
  }, [filteredMissions]);
  
  const failureReasonCorrelation = useMemo(() => {
    const byReason = {};
    filteredMissions.forEach(m => {
      const reason = m.primary_flag_reason || 'No reason specified';
      if (!byReason[reason]) byReason[reason] = { reason, total: 0, failed: 0 };
      byReason[reason].total++;
      if (m.outcome === 'Fail' || m.outcome === 'Rework') byReason[reason].failed++;
    });
    return Object.values(byReason)
      .map(d => ({ 
        reason: d.reason.length > 20 ? d.reason.substring(0, 20) + '...' : d.reason,
        fullReason: d.reason,
        rate: d.total ? ((d.failed / d.total) * 100).toFixed(1) : 0,
        failed: d.failed,
        total: d.total 
      }))
      .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate))
      .slice(0, 10);
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
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
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs">Year</Label>
              <Select value={filters.year} onValueChange={(v) => setFilters({...filters, year: v})}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {uniqueValues.years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs">Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(v) => setFilters({...filters, dateRange: v})}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="last3Months">Last 3 Months</SelectItem>
                  <SelectItem value="last6Months">Last 6 Months</SelectItem>
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
            <h3 className="font-semibold mb-4">Location-Based Failure Analysis</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {locationFailures.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="bg-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-400" />
                        <span className="font-semibold text-slate-200">{item.region}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{item.failed}/{item.total} failed</span>
                        <div className={`px-3 py-1 rounded-lg ${parseFloat(item.rate) > 10 ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
                          <span className={`font-bold ${parseFloat(item.rate) > 10 ? 'text-red-400' : 'text-amber-400'}`}>
                            {item.rate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-4 mt-6">
          {/* Failure Reasons Breakdown */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'failures' ? null : 'failures')}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div className="text-left">
                  <h3 className="font-semibold">Failure Reasons Breakdown</h3>
                  <p className="text-sm text-slate-400">Top {Math.min(5, failuresByReason.length)} issues impacting quality</p>
                </div>
              </div>
              {expandedSection === 'failures' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            <AnimatePresence>
              {expandedSection === 'failures' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-slate-700/50"
                >
                  <div className="p-6 space-y-4">
                    {failuresByReason.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="bg-slate-700/30 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-slate-200">{item.reason}</h4>
                          <div className="px-3 py-1 bg-red-500/20 rounded-lg">
                            <span className="text-red-400 font-bold">{item.count} missions</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {item.missions.slice(0, 3).map((mission, midx) => (
                            <div key={midx} className="text-xs text-slate-400 flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              <span>{mission.country || 'Unknown'} - {mission.region || 'Unknown'}</span>
                              <span className="text-slate-600">•</span>
                              <span>{mission.pilot_group || 'Unknown Group'}</span>
                            </div>
                          ))}
                          {item.missions.length > 3 && (
                            <p className="text-xs text-slate-500 italic">+ {item.missions.length - 3} more...</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Site Type Performance */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'sites' ? null : 'sites')}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-blue-400" />
                <div className="text-left">
                  <h3 className="font-semibold">Site Type Performance</h3>
                  <p className="text-sm text-slate-400">Success rates by site type</p>
                </div>
              </div>
              {expandedSection === 'sites' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            <AnimatePresence>
              {expandedSection === 'sites' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-slate-700/50"
                >
                  <div className="p-6">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={siteTypePerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="site" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                        <Bar dataKey="rate" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Failure Rate vs Reason Correlation */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === 'correlation' ? null : 'correlation')}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <div className="text-left">
                  <h3 className="font-semibold">Failure Rate vs Reason Correlation</h3>
                  <p className="text-sm text-slate-400">Analyze which reasons lead to highest failure rates</p>
                </div>
              </div>
              {expandedSection === 'correlation' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            <AnimatePresence>
              {expandedSection === 'correlation' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-slate-700/50"
                >
                  <div className="p-6 space-y-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={failureReasonCorrelation} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis type="number" stroke="#94a3b8" label={{ value: 'Failure Rate (%)', position: 'insideBottom', offset: -5 }} />
                        <YAxis type="category" dataKey="reason" stroke="#94a3b8" width={150} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                          formatter={(value, name, props) => {
                            if (name === 'rate') return [`${value}%`, 'Failure Rate'];
                            return [value, name];
                          }}
                          labelFormatter={(label, payload) => {
                            if (payload && payload[0]) {
                              return payload[0].payload.fullReason;
                            }
                            return label;
                          }}
                        />
                        <Bar dataKey="rate" fill="#a855f7" />
                      </BarChart>
                    </ResponsiveContainer>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {failureReasonCorrelation.slice(0, 6).map((item, idx) => (
                        <div key={idx} className="bg-slate-700/30 rounded-xl p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm text-slate-200 flex-1">{item.fullReason}</h4>
                            <div className="ml-2 px-2 py-1 bg-purple-500/20 rounded text-xs font-bold text-purple-400">
                              {item.rate}%
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>{item.failed} failed</span>
                            <span className="text-slate-600">•</span>
                            <span>{item.total} total</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          </div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mt-6">
          <h3 className="font-semibold mb-4">Mission Sites Map</h3>
          <div className="h-[500px] rounded-lg overflow-hidden">
            <MapContainer center={[12.8797, 121.7740]} zoom={6} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mapMarkers.map((marker, idx) => (
                <CircleMarker
                  key={idx}
                  center={[marker.lat, marker.lng]}
                  radius={6}
                  pathOptions={{
                    fillColor: marker.outcome === 'Pass' ? '#10b981' : marker.outcome === 'Rework' ? '#f59e0b' : '#ef4444',
                    fillOpacity: 0.8,
                    color: '#fff',
                    weight: 1
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">{marker.site}</p>
                      <p className="text-xs text-gray-600">{marker.region}</p>
                      <p className={`text-xs font-bold ${
                        marker.outcome === 'Pass' ? 'text-green-600' : 
                        marker.outcome === 'Rework' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {marker.outcome}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-slate-400">Pass</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-slate-400">Rework</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-slate-400">Fail</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mt-6">
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