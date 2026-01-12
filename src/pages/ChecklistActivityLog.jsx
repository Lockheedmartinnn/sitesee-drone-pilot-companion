import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Loader2, 
  CheckSquare, 
  Calendar, 
  User as UserIcon, 
  Filter,
  ArrowLeft,
  Mountain,
  Home as HomeIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function ChecklistActivityLog() {
  const [filterSiteType, setFilterSiteType] = useState('all');
  const [filterActionType, setFilterActionType] = useState('all');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['checklistActivities'],
    queryFn: () => base44.entities.ChecklistActivity.list('-created_date', 500),
  });

  const actionLabels = {
    checkbox_toggle: 'Checkbox',
    yes_no_decision: 'Decision',
    timer_complete: 'Timer',
    step_navigation: 'Navigation'
  };

  const actionColors = {
    checkbox_toggle: 'text-blue-400',
    yes_no_decision: 'text-purple-400',
    timer_complete: 'text-emerald-400',
    step_navigation: 'text-slate-400'
  };

  const stateColors = {
    checked: 'text-emerald-400',
    unchecked: 'text-slate-500',
    yes: 'text-green-400',
    no: 'text-red-400',
    completed: 'text-emerald-400'
  };

  const filteredActivities = activities.filter(activity => {
    const siteMatch = filterSiteType === 'all' || activity.site_type === filterSiteType;
    const actionMatch = filterActionType === 'all' || activity.action_type === filterActionType;
    return siteMatch && actionMatch;
  });

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
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold">Checklist Activity Log</h1>
            </div>
            <p className="text-slate-400 mt-1">Detailed audit trail of all checklist interactions</p>
          </div>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Site Type</label>
              <select
                value={filterSiteType}
                onChange={(e) => setFilterSiteType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="all">All Sites</option>
                <option value="tower">Tower</option>
                <option value="rooftop">Rooftop</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Action Type</label>
              <select
                value={filterActionType}
                onChange={(e) => setFilterActionType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="all">All Actions</option>
                <option value="checkbox_toggle">Checkboxes</option>
                <option value="yes_no_decision">Decisions</option>
                <option value="timer_complete">Timers</option>
                <option value="step_navigation">Navigation</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Activity Table */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/30 border-b border-slate-700/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Timestamp</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Pilot</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Site</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Step</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Action</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Item</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filteredActivities.map((activity, idx) => (
                  <motion.tr
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.01 }}
                    className="hover:bg-slate-700/20"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(activity.created_date), 'MMM d, HH:mm:ss')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-white">{activity.pilot_email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {activity.site_type === 'tower' ? (
                          <Mountain className="w-4 h-4 text-blue-400" />
                        ) : (
                          <HomeIcon className="w-4 h-4 text-amber-400" />
                        )}
                        <span className="text-sm text-slate-300 capitalize">{activity.site_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">
                        {activity.step_number}. {activity.step_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${actionColors[activity.action_type] || 'text-slate-300'}`}>
                        {actionLabels[activity.action_type] || activity.action_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">{activity.item_label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${stateColors[activity.new_state] || 'text-slate-300'}`}>
                        {activity.new_state}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-20">
            <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No checklist activities yet</p>
          </div>
        )}
      </div>
    </div>
  );
}