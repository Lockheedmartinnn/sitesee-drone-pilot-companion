import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAccessControl, filterMissionsByAccess } from '@/components/useAccessControl';
import { Loader2, Plane, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EquipmentCorrelation() {
  const { data: missions = [], isLoading } = useQuery({
    queryKey: ['allMissions'],
    queryFn: () => base44.entities.MissionLog.list('-created_date', 1000),
  });
  
  const droneStats = useMemo(() => {
    const byDrone = {};
    missions.forEach(m => {
      const drone = m.drone_model || 'Unknown';
      if (!byDrone[drone]) byDrone[drone] = { model: drone, total: 0, failed: 0, flagReasons: {} };
      byDrone[drone].total++;
      if (m.outcome === 'Fail') byDrone[drone].failed++;
      if (m.flagged && m.primary_flag_reason) {
        byDrone[drone].flagReasons[m.primary_flag_reason] = 
          (byDrone[drone].flagReasons[m.primary_flag_reason] || 0) + 1;
      }
    });
    return Object.values(byDrone).map(d => ({
      ...d,
      failureRate: d.total ? ((d.failed / d.total) * 100).toFixed(1) : 0,
      topFlagReason: Object.entries(d.flagReasons).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
    })).sort((a, b) => b.total - a.total);
  }, [missions]);
  
  const cameraStats = useMemo(() => {
    const byCamera = {};
    missions.forEach(m => {
      const camera = m.camera_model || 'Unknown';
      if (!byCamera[camera]) byCamera[camera] = { model: camera, total: 0, failed: 0, flagReasons: {} };
      byCamera[camera].total++;
      if (m.outcome === 'Fail') byCamera[camera].failed++;
      if (m.flagged && m.primary_flag_reason) {
        byCamera[camera].flagReasons[m.primary_flag_reason] = 
          (byCamera[camera].flagReasons[m.primary_flag_reason] || 0) + 1;
      }
    });
    return Object.values(byCamera).map(c => ({
      ...c,
      failureRate: c.total ? ((c.failed / c.total) * 100).toFixed(1) : 0,
      topFlagReason: Object.entries(c.flagReasons).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
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
          <h1 className="text-3xl font-bold">Equipment Correlation</h1>
          <p className="text-slate-400 mt-1">Performance metrics by drone and camera models</p>
        </motion.div>
        
        {/* Drone Models */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Drone Models</h2>
          </div>
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700/30 border-b border-slate-700/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Model</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Missions</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Failure %</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Most Common Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {droneStats.map((stat, idx) => (
                  <motion.tr
                    key={stat.model}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-700/20"
                  >
                    <td className="px-6 py-4 font-medium">{stat.model}</td>
                    <td className="px-6 py-4 text-center text-slate-300">{stat.total}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "font-semibold",
                        parseFloat(stat.failureRate) > 10 ? "text-red-400" :
                        parseFloat(stat.failureRate) > 5 ? "text-amber-400" : "text-emerald-400"
                      )}>
                        {stat.failureRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{stat.topFlagReason}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* Camera Models */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-4">
            <Camera className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold">Camera Models</h2>
          </div>
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700/30 border-b border-slate-700/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Model</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Missions</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">Failure %</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Most Common Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {cameraStats.map((stat, idx) => (
                  <motion.tr
                    key={stat.model}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-700/20"
                  >
                    <td className="px-6 py-4 font-medium">{stat.model}</td>
                    <td className="px-6 py-4 text-center text-slate-300">{stat.total}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "font-semibold",
                        parseFloat(stat.failureRate) > 10 ? "text-red-400" :
                        parseFloat(stat.failureRate) > 5 ? "text-amber-400" : "text-emerald-400"
                      )}>
                        {stat.failureRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{stat.topFlagReason}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}