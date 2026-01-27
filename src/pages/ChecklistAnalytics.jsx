import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft,
  Clock,
  Users,
  CheckCircle2,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Download,
  Building2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Award,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAccessControl } from '@/components/useAccessControl';

export default function ChecklistAnalytics() {
  const [expandedSession, setExpandedSession] = useState(null);
  const [siteFilter, setSiteFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [startDate] = useState(new Date('2026-01-12'));
  const [expandedPilot, setExpandedPilot] = useState(null);
  const [viewMode, setViewMode] = useState('overview');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const permissions = useAccessControl(user);

  const { data: allActivities = [], isLoading } = useQuery({
    queryKey: ['checklistActivities'],
    queryFn: () => base44.entities.ChecklistActivity.list('-created_date'),
  });

  // Filter out current user's activities to avoid skewing data
  const activities = useMemo(() => {
    return allActivities.filter(a => a.pilot_email !== user?.email);
  }, [allActivities, user]);

  const { data: localMissions = [] } = useQuery({
    queryKey: ['localMissionLogs'],
    queryFn: () => base44.entities.LocalMissionLog.list('-created_date'),
  });

  // Group activities by session
  const sessions = useMemo(() => {
    const sessionMap = {};
    
    activities.forEach(activity => {
      const sessionId = activity.session_id;
      if (!sessionId) return;

      if (!sessionMap[sessionId]) {
        sessionMap[sessionId] = {
          session_id: sessionId,
          pilot_email: activity.pilot_email,
          pilot_id: activity.pilot_id,
          company: activity.company,
          site_type: activity.site_type,
          activities: [],
          steps: new Set()
        };
      }

      sessionMap[sessionId].activities.push(activity);
      sessionMap[sessionId].steps.add(activity.step_number);
    });

    // Calculate timing for each session
    return Object.values(sessionMap).map(session => {
      const sortedActivities = session.activities.sort((a, b) => 
        new Date(a.created_date) - new Date(b.created_date)
      );
      
      const startTime = new Date(sortedActivities[0].created_date);
      const endTime = new Date(sortedActivities[sortedActivities.length - 1].created_date);
      const durationMs = endTime - startTime;
      const durationSec = Math.floor(durationMs / 1000);

      // Find matching mission log
      const missionLog = localMissions.find(m => {
        const missionTime = new Date(m.completion_timestamp);
        return Math.abs(missionTime - endTime) < 30 * 60 * 1000; // Within 30 min
      });

      return {
        ...session,
        activities: sortedActivities,
        startTime,
        endTime,
        durationSec,
        stepsCompleted: session.steps.size,
        missionLog
      };
    }).filter(session => session.durationSec >= 300).sort((a, b) => b.startTime - a.startTime);
  }, [activities, localMissions]);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    let filtered = sessions;

    // Only include completed sessions (8 steps completed)
    filtered = filtered.filter(s => s.stepsCompleted >= 8);

    // Date filter (since Jan 12, 2026)
    filtered = filtered.filter(s => s.startTime >= startDate);

    // Access control
    if (!permissions.canViewAllMissions) {
      if (permissions.canViewTeamMissions) {
        filtered = filtered.filter(s => s.company === user?.company);
      } else {
        filtered = filtered.filter(s => s.pilot_email === user?.email);
      }
    }

    // Site type filter
    if (siteFilter !== 'all') {
      filtered = filtered.filter(s => s.site_type === siteFilter);
    }

    // Company filter
    if (companyFilter !== 'all') {
      filtered = filtered.filter(s => s.company === companyFilter);
    }

    return filtered;
  }, [sessions, siteFilter, companyFilter, permissions, user, startDate]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalSessions = filteredSessions.length;
    const uniquePilots = new Set(filteredSessions.map(s => s.pilot_email)).size;
    const avgDuration = filteredSessions.length > 0
      ? Math.floor(filteredSessions.reduce((sum, s) => sum + s.durationSec, 0) / filteredSessions.length)
      : 0;
    const completedSessions = filteredSessions.filter(s => s.stepsCompleted >= 8).length;
    const shortCaptures = filteredSessions.filter(s => s.durationSec < 1500).length; // Under 25 min
    const passDecisions = filteredSessions.filter(s => {
      const finalDecision = s.activities.find(a => a.action_type === 'yes_no_decision' && a.item_id === 'final_pass_decision');
      return finalDecision?.new_state === 'yes';
    }).length;
    const reworkDecisions = filteredSessions.filter(s => {
      const finalDecision = s.activities.find(a => a.action_type === 'yes_no_decision' && a.item_id === 'final_pass_decision');
      return finalDecision?.new_state === 'no';
    }).length;

    return { totalSessions, uniquePilots, avgDuration, completedSessions, shortCaptures, passDecisions, reworkDecisions };
  }, [filteredSessions]);

  // Pilot performance data
  const pilotStats = useMemo(() => {
    const pilotMap = {};

    filteredSessions.forEach(session => {
      const email = session.pilot_email;
      if (!pilotMap[email]) {
        pilotMap[email] = {
          email,
          pilot_id: session.pilot_id,
          company: session.company,
          totalCaptures: 0,
          towerCaptures: 0,
          rooftopCaptures: 0,
          totalDuration: 0,
          shortCaptures: 0,
          passDecisions: 0,
          reworkDecisions: 0,
          completedSessions: 0
        };
      }

      pilotMap[email].totalCaptures++;
      if (session.site_type === 'tower') pilotMap[email].towerCaptures++;
      if (session.site_type === 'rooftop') pilotMap[email].rooftopCaptures++;
      pilotMap[email].totalDuration += session.durationSec;
      if (session.durationSec < 1500) pilotMap[email].shortCaptures++;
      if (session.stepsCompleted >= 8) pilotMap[email].completedSessions++;

      const finalDecision = session.activities.find(a => a.action_type === 'yes_no_decision' && a.item_id === 'final_pass_decision');
      if (finalDecision?.new_state === 'yes') pilotMap[email].passDecisions++;
      if (finalDecision?.new_state === 'no') pilotMap[email].reworkDecisions++;
    });

    return Object.values(pilotMap).map(pilot => ({
      ...pilot,
      avgDuration: Math.floor(pilot.totalDuration / pilot.totalCaptures),
      passRate: pilot.passDecisions + pilot.reworkDecisions > 0 
        ? Math.round((pilot.passDecisions / (pilot.passDecisions + pilot.reworkDecisions)) * 100)
        : 0
    })).sort((a, b) => b.totalCaptures - a.totalCaptures);
  }, [filteredSessions]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const downloadCSV = () => {
    const csvRows = [];
    
    // Summary Statistics
    csvRows.push(['SUMMARY STATISTICS']);
    csvRows.push(['Metric', 'Value']);
    csvRows.push(['Total Completed Sessions', stats.totalSessions]);
    csvRows.push(['Unique Pilots', stats.uniquePilots]);
    csvRows.push(['Average Duration', formatDuration(stats.avgDuration)]);
    csvRows.push(['Short Captures (Under 25 min)', stats.shortCaptures]);
    csvRows.push(['Pass Decisions', stats.passDecisions]);
    csvRows.push(['Rework Decisions', stats.reworkDecisions]);
    csvRows.push(['Pass Rate', `${Math.round((stats.passDecisions / (stats.passDecisions + stats.reworkDecisions || 1)) * 100)}%`]);
    csvRows.push([]);

    // Company Breakdown
    csvRows.push(['COMPANY BREAKDOWN']);
    csvRows.push(['Company', 'Total Captures']);
    Object.entries(
      filteredSessions.reduce((acc, s) => {
        const company = s.company || 'Unknown';
        acc[company] = (acc[company] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]).forEach(([company, count]) => {
      csvRows.push([company, count]);
    });
    csvRows.push([]);

    // Site Type Breakdown
    csvRows.push(['SITE TYPE BREAKDOWN']);
    csvRows.push(['Site Type', 'Total Captures']);
    Object.entries(
      filteredSessions.reduce((acc, s) => {
        acc[s.site_type] = (acc[s.site_type] || 0) + 1;
        return acc;
      }, {})
    ).forEach(([type, count]) => {
      csvRows.push([type, count]);
    });
    csvRows.push([]);

    // Pilot Performance Data
    csvRows.push(['PILOT PERFORMANCE DATA']);
    csvRows.push([
      'Pilot Email',
      'Pilot ID',
      'Company',
      'Total Captures',
      'Tower Captures',
      'Rooftop Captures',
      'Total Duration (seconds)',
      'Avg Duration',
      'Short Captures (<25min)',
      'Completed Sessions',
      'Pass Decisions',
      'Rework Decisions',
      'Pass Rate %',
      'Step 1 Completion %',
      'Step 2 Completion %',
      'Step 3 Completion %',
      'Step 4 Completion %',
      'Step 5 Completion %',
      'Step 6 Completion %',
      'Step 7 Completion %',
      'Step 8 Completion %',
      'Fastest Capture',
      'Slowest Capture'
    ]);

    pilotStats.forEach(pilot => {
      const pilotSessions = filteredSessions.filter(s => s.pilot_email === pilot.email);
      const stepCompletion = [1, 2, 3, 4, 5, 6, 7, 8].map(stepNum => {
        const count = pilotSessions.filter(s => s.steps.has(stepNum)).length;
        return Math.round((count / pilot.totalCaptures) * 100);
      });
      const fastest = Math.min(...pilotSessions.map(s => s.durationSec));
      const slowest = Math.max(...pilotSessions.map(s => s.durationSec));

      csvRows.push([
        pilot.email,
        pilot.pilot_id || '',
        pilot.company || '',
        pilot.totalCaptures,
        pilot.towerCaptures,
        pilot.rooftopCaptures,
        pilot.totalDuration,
        formatDuration(pilot.avgDuration),
        pilot.shortCaptures,
        pilot.completedSessions,
        pilot.passDecisions,
        pilot.reworkDecisions,
        pilot.passRate,
        ...stepCompletion,
        formatDuration(fastest),
        formatDuration(slowest)
      ]);
    });
    csvRows.push([]);

    // Short Captures Detail
    csvRows.push(['SHORT CAPTURES DETAIL (Under 25 minutes)']);
    csvRows.push([
      'Pilot Email',
      'Company',
      'Site Type',
      'Start Time',
      'Duration',
      'Steps Completed',
      'Final Decision'
    ]);
    filteredSessions
      .filter(s => s.durationSec < 1500)
      .forEach(session => {
        const finalDecision = session.activities.find(a => a.action_type === 'yes_no_decision' && a.item_id === 'final_pass_decision');
        csvRows.push([
          session.pilot_email,
          session.company || '',
          session.site_type,
          format(session.startTime, 'yyyy-MM-dd HH:mm:ss'),
          formatDuration(session.durationSec),
          session.stepsCompleted,
          finalDecision?.new_state || 'N/A'
        ]);
      });
    csvRows.push([]);

    // All Sessions Detail
    csvRows.push(['ALL SESSIONS DETAIL']);
    csvRows.push([
      'Session ID',
      'Pilot Email',
      'Pilot ID',
      'Company',
      'Site Type',
      'Start Time',
      'End Time',
      'Duration (seconds)',
      'Duration (formatted)',
      'Steps Completed',
      'Steps Completed List',
      'Final Pass Decision',
      'Is Short Capture',
      'Location (Lat, Lon)',
      'Job ID'
    ]);

    filteredSessions.forEach(session => {
      const stepsCompletedList = [...session.steps].sort((a, b) => a - b).join('; ');
      const finalDecision = session.activities.find(a => a.action_type === 'yes_no_decision' && a.item_id === 'final_pass_decision');
      const location = session.activities[0]?.latitude && session.activities[0]?.longitude 
        ? `${session.activities[0].latitude}, ${session.activities[0].longitude}`
        : '';
      
      csvRows.push([
        session.session_id,
        session.pilot_email,
        session.pilot_id || '',
        session.company || '',
        session.site_type,
        format(session.startTime, 'yyyy-MM-dd HH:mm:ss'),
        format(session.endTime, 'yyyy-MM-dd HH:mm:ss'),
        session.durationSec,
        formatDuration(session.durationSec),
        session.stepsCompleted,
        stepsCompletedList,
        finalDecision?.new_state || '',
        session.durationSec < 1500 ? 'YES' : 'NO',
        location,
        session.missionLog?.job_id || ''
      ]);
    });

    // Convert to CSV
    const csvContent = csvRows.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checklist-analytics-complete-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-slate-400">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Checklist Analytics</h1>
              <p className="text-sm text-slate-400">Session tracking and performance metrics</p>
            </div>
          </div>
          <Button
            onClick={downloadCSV}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Complete Analytics Report
          </Button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={viewMode === 'overview' ? 'default' : 'outline'}
            onClick={() => setViewMode('overview')}
            className={cn(
              viewMode === 'overview' ? 'bg-blue-500 hover:bg-blue-600' : 'border-slate-600'
            )}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={viewMode === 'pilots' ? 'default' : 'outline'}
            onClick={() => setViewMode('pilots')}
            className={cn(
              viewMode === 'pilots' ? 'bg-blue-500 hover:bg-blue-600' : 'border-slate-600'
            )}
          >
            <Users className="w-4 h-4 mr-2" />
            Pilot Performance
          </Button>
          <Button
            variant={viewMode === 'sessions' ? 'default' : 'outline'}
            onClick={() => setViewMode('sessions')}
            className={cn(
              viewMode === 'sessions' ? 'bg-blue-500 hover:bg-blue-600' : 'border-slate-600'
            )}
          >
            <Clock className="w-4 h-4 mr-2" />
            All Sessions
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/80 border-2 border-slate-600 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <p className="text-xs text-slate-400">Total</p>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalSessions}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-slate-400">Pilots</p>
            </div>
            <p className="text-2xl font-bold text-white">{stats.uniquePilots}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <p className="text-xs text-slate-400">Avg Time</p>
            </div>
            <p className="text-2xl font-bold text-white">{formatDuration(stats.avgDuration)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-400" />
              <p className="text-xs text-slate-400">Completed</p>
            </div>
            <p className="text-2xl font-bold text-white">{stats.completedSessions}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-xs text-slate-400">Short (&lt;25m)</p>
            </div>
            <p className="text-2xl font-bold text-red-400">{stats.shortCaptures}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <p className="text-xs text-slate-400">Pass</p>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{stats.passDecisions}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-amber-400" />
              <p className="text-xs text-slate-400">Rework</p>
            </div>
            <p className="text-2xl font-bold text-amber-400">{stats.reworkDecisions}</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Company:</span>
            <div className="flex gap-2">
              <Button
                variant={companyFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setCompanyFilter('all')}
                size="sm"
                className={cn(
                  companyFilter === 'all' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30'
                )}
              >
                All Companies
              </Button>
              <Button
                variant={companyFilter === 'QNSI' ? 'default' : 'outline'}
                onClick={() => setCompanyFilter('QNSI')}
                size="sm"
                className={cn(
                  companyFilter === 'QNSI' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30'
                )}
              >
                QNSI
              </Button>
              <Button
                variant={companyFilter === 'waveconn' ? 'default' : 'outline'}
                onClick={() => setCompanyFilter('waveconn')}
                size="sm"
                className={cn(
                  companyFilter === 'waveconn' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30'
                )}
              >
                Waveconn
              </Button>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant={siteFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setSiteFilter('all')}
              className={cn(
                siteFilter === 'all' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30'
              )}
            >
              All Sites
            </Button>
            <Button
              variant={siteFilter === 'tower' ? 'default' : 'outline'}
              onClick={() => setSiteFilter('tower')}
              className={cn(
                siteFilter === 'tower' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30'
              )}
            >
              Tower
            </Button>
            <Button
              variant={siteFilter === 'rooftop' ? 'default' : 'outline'}
              onClick={() => setSiteFilter('rooftop')}
              className={cn(
                siteFilter === 'rooftop' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30'
              )}
            >
              Rooftop
            </Button>
          </div>
        </div>

        {/* OVERVIEW MODE */}
        {viewMode === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/80 border-2 border-slate-600 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  Company Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(
                    filteredSessions.reduce((acc, s) => {
                      const company = s.company || 'Unknown';
                      acc[company] = (acc[company] || 0) + 1;
                      return acc;
                    }, {})
                  ).sort((a, b) => b[1] - a[1]).map(([company, count]) => (
                    <div key={company} className="flex items-center justify-between">
                      <span className="text-slate-300">{company}</span>
                      <span className="text-white font-semibold">{count} captures</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Site Type Distribution
                </h3>
                <div className="space-y-3">
                  {Object.entries(
                    filteredSessions.reduce((acc, s) => {
                      acc[s.site_type] = (acc[s.site_type] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-slate-300 capitalize">{type}</span>
                      <span className="text-white font-semibold">{count} captures</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-slate-800/80 border-2 border-slate-600 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Top Performers
              </h3>
              <div className="space-y-2">
                {pilotStats.slice(0, 5).map((pilot, idx) => (
                  <div key={pilot.email} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-600">#{idx + 1}</span>
                      <div>
                        <p className="text-white font-medium">{pilot.email}</p>
                        <p className="text-xs text-slate-400">{pilot.company || 'No company'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{pilot.totalCaptures} captures</p>
                      <p className="text-xs text-slate-400">Avg: {formatDuration(pilot.avgDuration)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PILOT PERFORMANCE MODE */}
        {viewMode === 'pilots' && (
          <div className="space-y-4">
            {pilotStats.map((pilot, idx) => (
              <motion.div
                key={pilot.email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-slate-800/80 border-2 border-slate-600 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedPilot(expandedPilot === pilot.email ? null : pilot.email)}
                  className="w-full p-5 text-left hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-semibold text-white">{pilot.email}</span>
                        {pilot.company && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                            {pilot.company}
                          </span>
                        )}
                        {pilot.shortCaptures > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                            {pilot.shortCaptures} short
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Total Captures</p>
                          <p className="text-white font-semibold text-lg">{pilot.totalCaptures}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Avg Duration</p>
                          <p className="text-white font-semibold">{formatDuration(pilot.avgDuration)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Tower / Rooftop</p>
                          <p className="text-white font-semibold">{pilot.towerCaptures} / {pilot.rooftopCaptures}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Pass Rate</p>
                          <p className={cn(
                            "font-semibold",
                            pilot.passRate >= 80 ? "text-emerald-400" : pilot.passRate >= 60 ? "text-amber-400" : "text-red-400"
                          )}>{pilot.passRate}%</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Pass / Rework</p>
                          <p className="text-white font-semibold">{pilot.passDecisions} / {pilot.reworkDecisions}</p>
                        </div>
                      </div>
                    </div>
                    {expandedPilot === pilot.email ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {expandedPilot === pilot.email && (
                  <div className="border-t border-slate-700 p-5 space-y-6">
                    {/* Performance Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Completion Rate</p>
                        <p className="text-xl font-bold text-white">
                          {Math.round((pilot.completedSessions / pilot.totalCaptures) * 100)}%
                        </p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Short Captures</p>
                        <p className={cn(
                          "text-xl font-bold",
                          pilot.shortCaptures > 0 ? "text-red-400" : "text-emerald-400"
                        )}>
                          {pilot.shortCaptures}
                        </p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Total Time</p>
                        <p className="text-xl font-bold text-white">
                          {formatDuration(pilot.totalDuration)}
                        </p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-xs text-slate-400 mb-1">Pass Rate</p>
                        <p className={cn(
                          "text-xl font-bold",
                          pilot.passRate >= 80 ? "text-emerald-400" : pilot.passRate >= 60 ? "text-amber-400" : "text-red-400"
                        )}>
                          {pilot.passRate}%
                        </p>
                      </div>
                    </div>

                    {/* Short Captures Alert */}
                    {pilot.shortCaptures > 0 && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-red-400 mb-2">⚠ {pilot.shortCaptures} Short Captures (Under 25 min)</p>
                            <div className="space-y-1">
                              {filteredSessions
                                .filter(s => s.pilot_email === pilot.email && s.durationSec < 1500)
                                .map(session => (
                                  <div key={session.session_id} className="text-sm text-slate-300">
                                    {format(session.startTime, 'MMM d, HH:mm')} - {session.site_type} - {formatDuration(session.durationSec)}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* All Sessions */}
                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        All Sessions ({pilot.totalCaptures})
                      </h4>
                      <div className="space-y-2">
                        {filteredSessions
                          .filter(s => s.pilot_email === pilot.email)
                          .map(session => {
                            const finalDecision = session.activities.find(a => a.action_type === 'yes_no_decision' && a.item_id === 'final_pass_decision');
                            return (
                              <div key={session.session_id} className={cn(
                                "rounded-lg p-3 text-sm",
                                session.durationSec < 1500 ? "bg-red-500/10 border border-red-500/30" : "bg-slate-900/50"
                              )}>
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-slate-300">{format(session.startTime, 'MMM d, HH:mm')}</span>
                                    <span className="text-slate-600">•</span>
                                    <span className={cn(
                                      "px-2 py-0.5 rounded text-xs",
                                      session.site_type === 'tower' ? "bg-blue-500/20 text-blue-300" : "bg-amber-500/20 text-amber-300"
                                    )}>{session.site_type}</span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-slate-400">{formatDuration(session.durationSec)}</span>
                                    {session.durationSec < 1500 && (
                                      <>
                                        <span className="text-slate-600">•</span>
                                        <span className="text-red-400 text-xs font-medium">⚠ SHORT</span>
                                      </>
                                    )}
                                    <span className="text-slate-600">•</span>
                                    <span className="text-slate-400">Steps: {session.stepsCompleted}/8</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {finalDecision && (
                                      <span className={cn(
                                        "text-xs font-medium px-2 py-1 rounded",
                                        finalDecision.new_state === 'yes' 
                                          ? "bg-emerald-500/20 text-emerald-400" 
                                          : "bg-red-500/20 text-red-400"
                                      )}>
                                        {finalDecision.new_state === 'yes' ? '✓ Pass' : '✗ Rework'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Step Completion Analysis */}
                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-400" />
                        Step Completion Analysis
                      </h4>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(stepNum => {
                          const sessionsWithStep = filteredSessions.filter(s => 
                            s.pilot_email === pilot.email && s.steps.has(stepNum)
                          ).length;
                          const completionRate = Math.round((sessionsWithStep / pilot.totalCaptures) * 100);
                          
                          return (
                            <div key={stepNum} className="bg-slate-900/50 rounded-lg p-3 text-center">
                              <p className="text-xs text-slate-400 mb-1">Step {stepNum}</p>
                              <p className={cn(
                                "text-lg font-bold",
                                completionRate >= 90 ? "text-emerald-400" : completionRate >= 70 ? "text-amber-400" : "text-red-400"
                              )}>
                                {completionRate}%
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Analysis */}
                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        Time Analysis
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 rounded-lg p-4">
                          <p className="text-xs text-slate-400 mb-1">Fastest Capture</p>
                          <p className="text-lg font-bold text-emerald-400">
                            {formatDuration(Math.min(...filteredSessions.filter(s => s.pilot_email === pilot.email).map(s => s.durationSec)))}
                          </p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4">
                          <p className="text-xs text-slate-400 mb-1">Slowest Capture</p>
                          <p className="text-lg font-bold text-amber-400">
                            {formatDuration(Math.max(...filteredSessions.filter(s => s.pilot_email === pilot.email).map(s => s.durationSec)))}
                          </p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4">
                          <p className="text-xs text-slate-400 mb-1">Average Time</p>
                          <p className="text-lg font-bold text-white">
                            {formatDuration(pilot.avgDuration)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pass/Rework Breakdown */}
                    {(pilot.passDecisions > 0 || pilot.reworkDecisions > 0) && (
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          Quality Decisions
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                            <p className="text-xs text-emerald-400 mb-1">Pass Decisions</p>
                            <p className="text-2xl font-bold text-emerald-400">{pilot.passDecisions}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {Math.round((pilot.passDecisions / (pilot.passDecisions + pilot.reworkDecisions)) * 100)}% of decisions
                            </p>
                          </div>
                          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                            <p className="text-xs text-amber-400 mb-1">Rework Decisions</p>
                            <p className="text-2xl font-bold text-amber-400">{pilot.reworkDecisions}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {Math.round((pilot.reworkDecisions / (pilot.passDecisions + pilot.reworkDecisions)) * 100)}% of decisions
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* SESSIONS LIST MODE */}
        {viewMode === 'sessions' && (
          <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              No checklist sessions found.
            </div>
          ) : (
            filteredSessions.map((session, idx) => (
              <motion.div
                key={session.session_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-800/80 border-2 border-slate-600 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSession(expandedSession === session.session_id ? null : session.session_id)}
                  className="w-full p-5 text-left hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-semibold text-white">
                          {session.pilot_email}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          session.site_type === 'tower' 
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-amber-500/20 text-amber-300"
                        )}>
                          {session.site_type}
                        </span>
                        {session.missionLog?.job_id && (
                          <span className="text-xs text-slate-500">
                            Job: {session.missionLog.job_id}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
                        <span>{format(session.startTime, 'MMM d, yyyy HH:mm')}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(session.durationSec)}
                        </span>
                        <span>•</span>
                        <span>Steps: {[...session.steps].sort((a, b) => a - b).join(', ')}</span>
                        {session.company && (
                          <>
                            <span>•</span>
                            <span>{session.company}</span>
                          </>
                        )}
                        {(() => {
                          const finalDecision = session.activities.find(
                            a => a.action_type === 'yes_no_decision' && a.item_id === 'final_pass_decision'
                          );
                          if (finalDecision) {
                            return (
                              <>
                                <span>•</span>
                                <span className={cn(
                                  "font-medium",
                                  finalDecision.new_state === 'yes' ? "text-emerald-400" : "text-red-400"
                                )}>
                                  {finalDecision.new_state === 'yes' ? 'Pass ✓' : 'Rework ✗'}
                                </span>
                              </>
                            );
                          }
                        })()}
                      </div>
                    </div>
                    {expandedSession === session.session_id ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {expandedSession === session.session_id && (
                  <div className="border-t border-slate-700 p-5 space-y-4">
                    {/* Final Decision */}
                    {(() => {
                      const finalDecision = session.activities.find(
                        a => a.action_type === 'yes_no_decision' && a.item_id === 'final_pass_decision'
                      );
                      if (finalDecision) {
                        return (
                          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className={cn(
                                "w-5 h-5",
                                finalDecision.new_state === 'yes' ? "text-emerald-400" : "text-red-400"
                              )} />
                              <div>
                                <p className="font-semibold text-white">Final Decision</p>
                                <p className="text-sm text-slate-400">
                                  {finalDecision.item_label}: <span className={cn(
                                    "font-medium",
                                    finalDecision.new_state === 'yes' ? "text-emerald-400" : "text-red-400"
                                  )}>{finalDecision.new_state === 'yes' ? 'Pass' : 'Rework'}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })()}

                    {/* Location */}
                    {session.activities[0]?.latitude && session.activities[0]?.longitude && (
                      <div className="text-sm text-slate-400">
                        <span className="font-medium text-slate-300">Location:</span> {session.activities[0].latitude.toFixed(6)}, {session.activities[0].longitude.toFixed(6)}
                      </div>
                    )}

                    {/* Step-by-step activities */}
                    {[...session.steps].sort((a, b) => a - b).map(stepNum => {
                      const stepActivities = session.activities.filter(a => a.step_number === stepNum);
                      const stepStart = new Date(stepActivities[0].created_date);
                      const stepEnd = new Date(stepActivities[stepActivities.length - 1].created_date);
                      const stepDuration = Math.floor((stepEnd - stepStart) / 1000);

                      return (
                        <div key={stepNum} className="border-l-2 border-blue-500/30 pl-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">
                              Step {stepNum}: {stepActivities[0].step_name}
                            </h4>
                            <span className="text-sm text-slate-400">
                              {formatDuration(stepDuration)}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {stepActivities.map((activity, idx) => (
                              <div key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-xs text-slate-500 min-w-[60px]">
                                  {format(new Date(activity.created_date), 'HH:mm:ss')}
                                </span>
                                <span className="text-slate-400">{activity.action_type}:</span>
                                <span>{activity.item_label || 'N/A'}</span>
                                {activity.new_state && (
                                  <span className="text-emerald-400">→ {activity.new_state}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ))
          )}
          </div>
        )}
      </div>
    </div>
  );
}