import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAccessControl, filterMissionsByAccess } from '@/components/useAccessControl';
import { Loader2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PilotGroupTrends() {
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
  
  const groupStats = useMemo(() => {
    const byGroup = {};
    
    missions.forEach(m => {
      const group = m.pilot_group || 'Unknown';
      if (!byGroup[group]) {
        byGroup[group] = { group, total: 0, pass: 0, rework: 0, fail: 0 };
      }
      byGroup[group].total++;
      if (m.outcome === 'Pass') byGroup[group].pass++;
      if (m.outcome === 'Rework') byGroup[group].rework++;
      if (m.outcome === 'Fail') byGroup[group].fail++;
    });
    
    return Object.values(byGroup).map(g => ({
      ...g,
      failureRate: g.total ? ((g.fail / g.total) * 100).toFixed(1) : 0,
      reworkRate: g.total ? ((g.rework / g.total) * 100).toFixed(1) : 0,
      passRate: g.total ? ((g.pass / g.total) * 100).toFixed(1) : 0
    })).sort((a, b) => b.total - a.total);
  }, [missions]);
  
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
          <h1 className="text-3xl font-bold">Pilot Group Trends</h1>
          <p className="text-slate-400 mt-1">Aggregated performance by pilot group (no individual ranking)</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 text-sm text-blue-300">
          <p className="font-semibold mb-1">Training Insight Tool</p>
          <p className="text-xs text-blue-400">
            This tool provides training reinforcement and quality insight only. 
            Enforcement and operational responsibility remain with the customer.
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/30 border-b border-slate-700/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Pilot Group</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Missions</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Pass %</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Rework %</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Failure %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {groupStats.map((stat, idx) => (
                  <motion.tr
                    key={stat.group}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="font-medium">{stat.group}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-slate-300">{stat.total}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-emerald-400">{stat.passRate}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-amber-400">{stat.reworkRate}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "font-semibold",
                        parseFloat(stat.failureRate) > 10 ? "text-red-400" :
                        parseFloat(stat.failureRate) > 5 ? "text-amber-400" : "text-emerald-400"
                      )}>
                        {stat.failureRate}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {groupStats.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No pilot group data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}