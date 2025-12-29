import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAccessControl } from '@/components/useAccessControl';
import { Loader2, Database, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MissionImporter from '@/components/MissionImporter';

export default function MissionDataManagement() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const permissions = useAccessControl(user);

  const { data: missions = [], isLoading, refetch } = useQuery({
    queryKey: ['missions'],
    queryFn: () => base44.entities.Mission.list('-created_date', 500),
  });

  // Redirect non-admins away
  if (!isLoading && !permissions.canManageSystem) {
    window.location.href = '/';
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const importedCount = missions.filter(m => m.data_source === 'imported').length;
  const manualCount = missions.filter(m => m.data_source === 'manual').length;
  const successCount = missions.filter(m => m.outcome === 'SUCCESS').length;
  const failureCount = missions.filter(m => m.outcome === 'FAILURE').length;

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-5 py-8 pb-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Mission Data Management</h1>
          </div>
          <p className="text-slate-400">Import and manage mission records</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4"
          >
            <p className="text-sm text-slate-400">Total Missions</p>
            <p className="text-3xl font-bold text-white">{missions.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-emerald-500/10 rounded-xl border border-emerald-500/30 p-4"
          >
            <p className="text-sm text-slate-400">Success</p>
            <p className="text-3xl font-bold text-emerald-400">{successCount}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-red-500/10 rounded-xl border border-red-500/30 p-4"
          >
            <p className="text-sm text-slate-400">Failures</p>
            <p className="text-3xl font-bold text-red-400">{failureCount}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-500/10 rounded-xl border border-blue-500/30 p-4"
          >
            <p className="text-sm text-slate-400">Imported</p>
            <p className="text-3xl font-bold text-blue-400">{importedCount}</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Tabs defaultValue="import" className="w-full">
            <TabsList className="bg-slate-800/50 border border-slate-700/50">
              <TabsTrigger value="import">Import Data</TabsTrigger>
              <TabsTrigger value="missions">View Missions</TabsTrigger>
            </TabsList>

            <TabsContent value="import" className="mt-6">
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                <MissionImporter onComplete={refetch} />
              </div>
            </TabsContent>

            <TabsContent value="missions" className="mt-6">
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/30 border-b border-slate-700/50">
                      <tr>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Mission ID</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Site Name</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Outcome</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Captured</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {missions.slice(0, 50).map((mission, idx) => (
                        <motion.tr
                          key={mission.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.01 }}
                          className="hover:bg-slate-700/20"
                        >
                          <td className="px-6 py-4">
                            <span className="text-sm text-white font-mono">{mission.mission_id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-300">{mission.site_name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-semibold ${
                              mission.outcome === 'SUCCESS' ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              {mission.outcome}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-400">
                              {mission.capture_timestamp ? new Date(mission.capture_timestamp).toLocaleDateString() : '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-300">
                              {mission.data_source}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}