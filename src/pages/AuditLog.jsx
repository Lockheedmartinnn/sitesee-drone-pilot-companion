import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAccessControl } from '@/components/useAccessControl';
import { Loader2, Shield, FileText, User as UserIcon, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditLog() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const permissions = useAccessControl(user);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.AuditLog.list('-created_date', 100),
  });

  const { data: chatSessions = [] } = useQuery({
    queryKey: ['chatbotSessions'],
    queryFn: () => base44.entities.ChatbotSession.list('-created_date', 50),
  });

  const { data: chatMessages = [] } = useQuery({
    queryKey: ['chatbotMessages'],
    queryFn: () => base44.entities.ChatbotMessage.list('-created_date', 100),
  });

  // Redirect non-managers away from this page
  useEffect(() => {
    if (!isLoading && !permissions.canManageCompany) {
      window.location.href = '/';
    }
  }, [isLoading, permissions.canManageCompany]);

  if (!permissions.canManageCompany) {
    return null;
  }

  const actionLabels = {
    mission_log_create: 'Created Mission Log',
    mission_log_update: 'Updated Mission Log',
    mission_log_delete: 'Deleted Mission Log',
    mission_event_create: 'Added Mission Event',
    checklist_complete: 'Completed Checklist',
    user_invited: 'Invited User',
    export_data: 'Exported Data',
    settings_changed: 'Changed Settings',
    chatbot_session_start: 'Started Chat Session',
    chatbot_session_end: 'Ended Chat Session',
    chatbot_message_sent: 'Sent Chat Message'
  };

  const actionColors = {
    mission_log_create: 'text-green-400',
    mission_log_update: 'text-blue-400',
    mission_log_delete: 'text-red-400',
    mission_event_create: 'text-purple-400',
    checklist_complete: 'text-emerald-400',
    user_invited: 'text-amber-400',
    export_data: 'text-orange-400',
    settings_changed: 'text-yellow-400',
    chatbot_session_start: 'text-cyan-400',
    chatbot_session_end: 'text-indigo-400',
    chatbot_message_sent: 'text-pink-400'
  };

  // Combine all data into a unified activity feed
  const allActivities = useMemo(() => {
    const activities = [];

    // Add audit logs
    logs.forEach(log => {
      activities.push({
        id: `log-${log.id}`,
        timestamp: log.created_date,
        user_email: log.user_email,
        action: log.action,
        details: log.details,
        type: 'audit_log'
      });
    });

    // Add chat sessions
    chatSessions.forEach(session => {
      activities.push({
        id: `session-start-${session.id}`,
        timestamp: session.session_started_at,
        user_email: session.user_email,
        action: 'chatbot_session_start',
        details: `${session.total_messages} messages`,
        type: 'chat_session'
      });

      if (session.session_ended_at) {
        activities.push({
          id: `session-end-${session.id}`,
          timestamp: session.session_ended_at,
          user_email: session.user_email,
          action: 'chatbot_session_end',
          details: `${session.total_messages} messages`,
          type: 'chat_session'
        });
      }
    });

    // Add chat messages
    chatMessages.forEach(msg => {
      if (msg.message_type === 'user') {
        activities.push({
          id: `msg-${msg.id}`,
          timestamp: msg.message_timestamp,
          user_email: msg.user_email,
          action: 'chatbot_message_sent',
          details: msg.message_content.substring(0, 100) + (msg.message_content.length > 100 ? '...' : ''),
          type: 'chat_message'
        });
      }
    });

    // Sort by timestamp descending
    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [logs, chatSessions, chatMessages]);

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
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Audit Log</h1>
          </div>
          <p className="text-slate-400">System activity and user actions</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/30 border-b border-slate-700/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Timestamp</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">User</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Action</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {allActivities.map((activity, idx) => (
                  <motion.tr
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-slate-700/20"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(activity.timestamp), 'MMM d, yyyy HH:mm')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-white">{activity.user_email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className={`text-sm font-medium ${actionColors[activity.action] || 'text-slate-300'}`}>
                          {actionLabels[activity.action] || activity.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">
                        {activity.details || '-'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {allActivities.length === 0 && (
          <div className="text-center py-20">
            <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No activity yet</p>
          </div>
        )}
      </div>
    </div>
  );
}