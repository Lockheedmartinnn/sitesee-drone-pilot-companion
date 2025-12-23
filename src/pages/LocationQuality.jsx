import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAccessControl, filterMissionsByAccess } from '@/components/useAccessControl';
import { Loader2, MapPin, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LocationQuality() {
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
  
  const regionStats = useMemo(() => {
    const byRegion = {};
    
    missions.forEach(m => {
      const region = m.region || 'Unknown';
      if (!byRegion[region]) {
        byRegion[region] = { region, total: 0, failed: 0, flagReasons: {} };
      }
      byRegion[region].total++;
      if (m.outcome === 'Fail') byRegion[region].failed++;
      if (m.flagged && m.primary_flag_reason) {
        byRegion[region].flagReasons[m.primary_flag_reason] = 
          (byRegion[region].flagReasons[m.primary_flag_reason] || 0) + 1;
      }
    });
    
    return Object.values(byRegion).map(r => ({
      ...r,
      failureRate: r.total ? ((r.failed / r.total) * 100).toFixed(1) : 0,
      topFlagReason: Object.entries(r.flagReasons).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
    })).sort((a, b) => b.failureRate - a.failureRate);
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
          <h1 className="text-3xl font-bold">Location Quality Breakdown</h1>
          <p className="text-slate-400 mt-1">Performance metrics by region</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/30 border-b border-slate-700/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Region</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Missions</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Failure %</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Top Flag Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {regionStats.map((stat, idx) => (
                  <motion.tr
                    key={stat.region}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span className="font-medium">{stat.region}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-slate-300">{stat.total}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={cn(
                          "font-semibold",
                          parseFloat(stat.failureRate) > 10 ? "text-red-400" :
                          parseFloat(stat.failureRate) > 5 ? "text-amber-400" : "text-emerald-400"
                        )}>
                          {stat.failureRate}%
                        </span>
                        {parseFloat(stat.failureRate) > 10 && <TrendingDown className="w-4 h-4 text-red-400" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">{stat.topFlagReason}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {regionStats.length === 0 && (
          <div className="text-center py-20">
            <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No regional data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}