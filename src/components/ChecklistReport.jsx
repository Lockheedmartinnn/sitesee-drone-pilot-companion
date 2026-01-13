import React from 'react';
import { motion } from 'framer-motion';
import { Download, Clock, CheckCircle2, XCircle, Timer as TimerIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function ChecklistReport({ activities, missionLog }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center text-slate-400 py-8">
        No checklist data available for this mission.
      </div>
    );
  }

  // Group activities by step
  const stepGroups = {};
  activities.forEach(activity => {
    const stepNum = activity.step_number;
    if (!stepGroups[stepNum]) {
      stepGroups[stepNum] = {
        step_name: activity.step_name,
        activities: []
      };
    }
    stepGroups[stepNum].activities.push(activity);
  });

  // Calculate time spent per step
  const stepTimings = {};
  Object.keys(stepGroups).forEach(stepNum => {
    const stepActivities = stepGroups[stepNum].activities;
    if (stepActivities.length > 0) {
      const firstActivity = new Date(stepActivities[0].created_date);
      const lastActivity = new Date(stepActivities[stepActivities.length - 1].created_date);
      const durationMs = lastActivity - firstActivity;
      const durationSec = Math.floor(durationMs / 1000);
      stepTimings[stepNum] = {
        start: firstActivity,
        end: lastActivity,
        durationSec
      };
    }
  });

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const downloadReport = () => {
    const csvRows = [];
    
    // CSV Header
    csvRows.push(['Step Number', 'Step Name', 'Time Spent (seconds)', 'Start Time', 'End Time', 'Action Time', 'Action Type', 'Item', 'Result']);
    
    // Add data rows
    Object.keys(stepGroups).sort((a, b) => a - b).forEach(stepNum => {
      const step = stepGroups[stepNum];
      const timing = stepTimings[stepNum];
      
      step.activities.forEach(activity => {
        const time = format(new Date(activity.created_date), 'HH:mm:ss');
        csvRows.push([
          stepNum,
          step.step_name,
          timing ? timing.durationSec : '',
          timing ? format(timing.start, 'HH:mm:ss') : '',
          timing ? format(timing.end, 'HH:mm:ss') : '',
          time,
          activity.action_type,
          activity.item_label || '',
          activity.new_state || ''
        ]);
      });
    });

    // Convert to CSV string
    const csvContent = csvRows.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checklist-report-${missionLog?.job_id || 'mission'}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Checklist Report</h3>
        <Button
          onClick={downloadReport}
          variant="outline"
          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      <div className="space-y-6">
        {Object.keys(stepGroups).sort((a, b) => a - b).map(stepNum => {
          const step = stepGroups[stepNum];
          const timing = stepTimings[stepNum];
          const isRushed = timing && timing.durationSec < 30;

          return (
            <div key={stepNum} className="border-l-2 border-blue-500/30 pl-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">
                    Step {stepNum}: {step.step_name}
                  </h4>
                  {timing && (
                    <div className={`flex items-center gap-2 text-sm mt-1 ${isRushed ? 'text-amber-400' : 'text-slate-400'}`}>
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(timing.durationSec)}</span>
                      {isRushed && <span className="text-xs">(possibly rushed)</span>}
                    </div>
                  )}
                </div>
                {timing && (
                  <div className="text-xs text-slate-500">
                    {format(timing.start, 'HH:mm')} - {format(timing.end, 'HH:mm')}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {step.activities.map((activity, idx) => (
                  <div key={idx} className="text-sm flex items-center gap-2 text-slate-300">
                    <span className="text-slate-500 text-xs">
                      {format(new Date(activity.created_date), 'HH:mm:ss')}
                    </span>
                    {activity.action_type === 'checkbox_toggle' && (
                      <>
                        {activity.new_state === 'checked' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-500" />
                        )}
                        <span>{activity.item_label}</span>
                      </>
                    )}
                    {activity.action_type === 'yes_no_decision' && (
                      <>
                        {activity.new_state === 'yes' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span>{activity.item_label}: {activity.new_state}</span>
                      </>
                    )}
                    {activity.action_type === 'timer_complete' && (
                      <>
                        <TimerIcon className="w-4 h-4 text-blue-400" />
                        <span>{activity.item_label}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}