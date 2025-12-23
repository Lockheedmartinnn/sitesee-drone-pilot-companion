import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  MapPin,
  Plane,
  ChevronDown,
  Filter,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const MissionCard = ({ mission, isOpen, onToggle }) => {
  const isSuccess = mission.outcome === 'success' || mission.outcome === 'Pass' || mission.outcome === 'SUCCESS';
  const isFail = mission.outcome === 'Fail' || mission.outcome === 'FAILURE';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl border overflow-hidden transition-all duration-200",
        isSuccess 
          ? "bg-emerald-500/5 border-emerald-500/30" 
          : isFail 
            ? "bg-red-500/5 border-red-500/30"
            : "bg-amber-500/5 border-amber-500/30"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-slate-800/30 transition-colors"
      >
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
          isSuccess ? "bg-emerald-500/20" : isFail ? "bg-red-500/20" : "bg-amber-500/20"
        )}>
          {isSuccess ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <AlertTriangle className={cn("w-6 h-6", isFail ? "text-red-400" : "text-amber-400")} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-semibold text-white">
              {mission.mission_id || 'Mission Log'}
            </h3>
            <span className={cn(
              "text-xs font-semibold px-2 py-1 rounded-full",
              isSuccess 
                ? "bg-emerald-500/20 text-emerald-400" 
                : isFail
                  ? "bg-red-500/20 text-red-400"
                  : "bg-amber-500/20 text-amber-400"
            )}>
              {isSuccess ? 'Success' : isFail ? 'Fail' : 'Issue Flagged'}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(new Date(mission.mission_date || mission.created_date), 'MMM d, yyyy • h:mm a')}</span>
            </div>
            
            {mission.notes && (
              <div className="text-sm text-slate-300 font-medium">
                {mission.notes}
              </div>
            )}
            
            {(mission.region || mission.country) && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{[mission.region, mission.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
            
            {mission.customer && (
              <div className="text-sm text-slate-400">
                Customer: {mission.customer}
              </div>
            )}
            
            {mission.pilot_group && (
              <div className="text-sm text-slate-400">
                Pilot Group: {mission.pilot_group}
              </div>
            )}
          </div>
        </div>
        
        <ChevronDown className={cn(
          "w-5 h-5 text-slate-400 transition-transform flex-shrink-0",
          isOpen && "rotate-180"
        )} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-slate-700/30">
              {/* Mission Details */}
              <div className="pt-4 grid grid-cols-2 gap-4">
                {mission.drone_model && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Drone Model</p>
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-slate-400" />
                      <p className="text-sm text-white">{mission.drone_model}</p>
                    </div>
                  </div>
                )}
                
                {mission.battery_changes !== undefined && mission.battery_changes !== null && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Battery Changes</p>
                    <p className="text-sm text-white">{mission.battery_changes}</p>
                  </div>
                )}
              </div>
              
              {/* Conditions */}
              {mission.conditions && mission.conditions.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {mission.conditions.map((condition, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs rounded-lg"
                      >
                        {condition.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Technical Notes */}
              {mission.technical_notes && mission.technical_notes.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Technical Notes</p>
                  <div className="flex flex-wrap gap-2">
                    {mission.technical_notes.map((note, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg"
                      >
                        {note.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Issue Categories */}
              {mission.issue_categories && mission.issue_categories.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Issues Reported</p>
                  <div className="flex flex-wrap gap-2">
                    {mission.issue_categories.map((issue, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg"
                      >
                        {issue.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Free Text Notes */}
              {mission.free_text_notes && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Notes</p>
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <p className="text-sm text-slate-300">{mission.free_text_notes}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function MissionHistory() {
  const [filter, setFilter] = useState('all'); // 'all', 'success', 'issues'
  const [expandedId, setExpandedId] = useState(null);
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });
  
  const { data: missions = [], isLoading } = useQuery({
    queryKey: ['missionHistory', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.MissionLog.filter(
        { created_by: user.email },
        '-created_date'
      );
    },
    enabled: !!user,
  });
  
  const filteredMissions = missions.filter(mission => {
    if (filter === 'all') return true;
    if (filter === 'success') return mission.outcome === 'success';
    if (filter === 'issues') return mission.outcome === 'issue_flagged';
    return true;
  });
  
  return (
    <div className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-5 py-8 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Mission History</h1>
          <p className="text-slate-400 mt-1">Your submitted mission logs</p>
        </motion.div>
        
        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-6"
        >
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={cn(
                filter === 'all' 
                  ? "bg-blue-500 hover:bg-blue-600" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              All ({missions.length})
            </Button>
            <Button
              variant={filter === 'success' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('success')}
              className={cn(
                filter === 'success' 
                  ? "bg-emerald-500 hover:bg-emerald-600" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              Success ({missions.filter(m => m.outcome === 'success').length})
            </Button>
            <Button
              variant={filter === 'issues' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('issues')}
              className={cn(
                filter === 'issues' 
                  ? "bg-amber-500 hover:bg-amber-600" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              Issues ({missions.filter(m => m.outcome === 'issue_flagged').length})
            </Button>
          </div>
        </motion.div>
        
        {/* Mission List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredMissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/50 mb-4">
              <Calendar className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No missions yet</h3>
            <p className="text-sm text-slate-500">
              {filter === 'all' 
                ? 'Complete your first capture to see your mission history here'
                : `No ${filter === 'success' ? 'successful' : 'issue-flagged'} missions found`}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredMissions.map((mission, index) => (
              <MissionCard
                key={mission.id || index}
                mission={mission}
                isOpen={expandedId === mission.id}
                onToggle={() => setExpandedId(expandedId === mission.id ? null : mission.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}