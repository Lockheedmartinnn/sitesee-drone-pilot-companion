import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  CheckCircle2,
  Calendar,
  User,
  Briefcase,
  Clock,
  StickyNote,
  Shield,
  Mail,
  MapPin,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAccessControl, filterMissionsByAccess } from '@/components/useAccessControl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ChecklistReport from '@/components/ChecklistReport';

function LocalMissionCard({ mission, onViewReport }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl border-2 border-green-500/30 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Checklist Completed</p>
              <p className="font-medium text-white">
                {format(new Date(mission.completion_timestamp), 'MMM d, yyyy • h:mm a')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          {mission.created_by && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm text-white">{mission.created_by}</p>
              </div>
            </div>
          )}

          {mission.pilot_identifier && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Pilot Identifier</p>
                <p className="text-sm text-white">{mission.pilot_identifier}</p>
              </div>
            </div>
          )}
          
          {mission.job_id && (
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Job Reference</p>
                <p className="text-sm text-white">{mission.job_id}</p>
              </div>
            </div>
          )}

          {(mission.latitude && mission.longitude) && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="text-sm text-white font-mono">{mission.latitude.toFixed(6)}, {mission.longitude.toFixed(6)}</p>
              </div>
            </div>
          )}
          
          {mission.notes && (
            <div className="flex items-start gap-2">
              <StickyNote className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-1">Notes</p>
                <p className="text-sm text-slate-300">{mission.notes}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
          <p className="text-xs text-slate-600 italic">
            For your personal reference only • Stored locally on this device
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewReport(mission)}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Report
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function MissionHistory() {
  const [viewReportSession, setViewReportSession] = useState(null);
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const permissions = useAccessControl(user);

  const { data: allMissions = [], isLoading } = useQuery({
    queryKey: ['localMissionLogs'],
    queryFn: () => base44.entities.LocalMissionLog.list('-created_date'),
    initialData: [],
  });

  const { data: allActivities = [] } = useQuery({
    queryKey: ['checklistActivities'],
    queryFn: () => base44.entities.ChecklistActivity.list('-created_date', 1000),
  });

  const localMissions = useMemo(() => {
    if (!user) return [];
    
    // Admin sees all, regular users only see their own
    if (user.role === 'admin') {
      return allMissions;
    }
    
    return allMissions.filter(mission => mission.created_by === user.email);
  }, [allMissions, user]);

  const getSessionActivities = (mission) => {
    // Find activities around the mission completion time
    const missionTime = new Date(mission.completion_timestamp);
    const windowStart = new Date(missionTime.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
    const windowEnd = new Date(missionTime.getTime() + 30 * 60 * 1000); // 30 min after
    
    return allActivities.filter(activity => {
      const activityTime = new Date(activity.created_date);
      return activityTime >= windowStart && activityTime <= windowEnd &&
             activity.pilot_email === mission.created_by;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-5 py-8 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-white">My Captures</h1>
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300 capitalize">{user.access_level || 'pilot'}</span>
              </div>
            )}
          </div>
          <p className="text-slate-400 mb-3">
            {user?.role === 'admin' ? 'All captures from all users' : 'Your completed capture checklists'}
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300">
              📱 {user?.role === 'admin' ? 'Admin view: Showing all capture records globally' : 'Personal training companion • Showing only your captures'}
            </p>
          </div>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 mb-6"
        >
          <p className="text-2xl font-bold text-white">{localMissions.length}</p>
          <p className="text-sm text-slate-400">Completed Checklists</p>
        </motion.div>

        {/* Missions List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : localMissions.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
              <p className="text-slate-400 mb-2">No captures recorded yet</p>
              <p className="text-xs text-slate-600">Complete a capture checklist to see it here</p>
            </div>
          ) : (
            localMissions.map((mission) => (
              <LocalMissionCard 
                key={mission.id} 
                mission={mission} 
                onViewReport={setViewReportSession}
              />
            ))
          )}
        </div>

        {/* Report Dialog */}
        <Dialog open={!!viewReportSession} onOpenChange={() => setViewReportSession(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Mission Checklist Report</DialogTitle>
            </DialogHeader>
            {viewReportSession && (
              <ChecklistReport
                activities={getSessionActivities(viewReportSession)}
                missionLog={viewReportSession}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}