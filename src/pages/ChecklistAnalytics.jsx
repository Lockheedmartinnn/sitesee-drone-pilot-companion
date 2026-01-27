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
  Building2
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

    return { totalSessions, uniquePilots, avgDuration, completedSessions };
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
    
    // Header
    csvRows.push([
      'Session ID',
      'Pilot Email',
      'Pilot ID',
      'Company',
      'Site Type',
      'Start Time',
      'End Time',
      'Duration (seconds)',
      'Steps Completed',
      'Steps Completed List',
      'Final Pass Decision',
      'Location (Lat, Lon)',
      'Job ID'
    ]);

    // Data rows
    filteredSessions.forEach(session => {
      const stepsCompletedList = [...session.steps].sort((a, b) => a - b).join(', ');
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
        session.stepsCompleted,
        stepsCompletedList,
        finalDecision?.new_state || '',
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
    a.download = `checklist-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
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
            variant="outline"
            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <p className="text-sm text-slate-400">Total Sessions</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalSessions}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <p className="text-sm text-slate-400">Unique Pilots</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.uniquePilots}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <p className="text-sm text-slate-400">Avg Duration</p>
            </div>
            <p className="text-3xl font-bold text-white">{formatDuration(stats.avgDuration)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <p className="text-sm text-slate-400">Completed</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.completedSessions}</p>
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
                  companyFilter === 'all' ? 'bg-blue-500 hover:bg-blue-600' : 'border-slate-600'
                )}
              >
                All Companies
              </Button>
              <Button
                variant={companyFilter === 'QNSI' ? 'default' : 'outline'}
                onClick={() => setCompanyFilter('QNSI')}
                size="sm"
                className={cn(
                  companyFilter === 'QNSI' ? 'bg-blue-500 hover:bg-blue-600' : 'border-slate-600'
                )}
              >
                QNSI
              </Button>
              <Button
                variant={companyFilter === 'waveconn' ? 'default' : 'outline'}
                onClick={() => setCompanyFilter('waveconn')}
                size="sm"
                className={cn(
                  companyFilter === 'waveconn' ? 'bg-blue-500 hover:bg-blue-600' : 'border-slate-600'
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
                siteFilter === 'all' ? 'bg-blue-500 hover:bg-blue-600' : 'border-slate-600'
              )}
            >
              All Sites
            </Button>
            <Button
              variant={siteFilter === 'tower' ? 'default' : 'outline'}
              onClick={() => setSiteFilter('tower')}
              className={cn(
                siteFilter === 'tower' ? 'bg-blue-500 hover:bg-blue-600' : 'border-slate-600'
              )}
            >
              Tower
            </Button>
            <Button
              variant={siteFilter === 'rooftop' ? 'default' : 'outline'}
              onClick={() => setSiteFilter('rooftop')}
              className={cn(
                siteFilter === 'rooftop' ? 'bg-blue-500 hover:bg-blue-600' : 'border-slate-600'
              )}
            >
              Rooftop
            </Button>
          </div>
        </div>

        {/* Sessions List */}
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
                className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
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
      </div>
    </div>
  );
}