import React, { useState, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Sparkles, Trash2, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITES } from '@/components/siteintel/siteData';
import SitePicker from '@/components/calendar/SitePicker';
import MonthView from '@/components/calendar/MonthView';
import WeekView from '@/components/calendar/WeekView';
import DayView from '@/components/calendar/DayView';
import AIScheduleModal from '@/components/calendar/AIScheduleModal';
import { useWeatherWarnings } from '@/components/calendar/useWeatherWarnings';

const VIEW_LABELS = { month: 'Month', week: 'Week', day: 'Day' };

function getTitle(view, date) {
  if (view === 'month') return format(date, 'MMMM yyyy');
  if (view === 'week') return `Week of ${format(date, 'MMM d, yyyy')}`;
  return format(date, 'EEEE, MMMM d, yyyy');
}

function navigate(view, date, dir) {
  if (view === 'month') return dir > 0 ? addMonths(date, 1) : subMonths(date, 1);
  if (view === 'week') return dir > 0 ? addWeeks(date, 1) : subWeeks(date, 1);
  return dir > 0 ? addDays(date, 1) : subDays(date, 1);
}

export default function MissionPlanner() {
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [aiOpen, setAiOpen] = useState(false);
  const qc = useQueryClient();

  const { data: missions = [] } = useQuery({
    queryKey: ['scheduledMissions'],
    queryFn: () => base44.entities.ScheduledMission.list('-scheduled_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: data => base44.entities.ScheduledMission.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scheduledMissions'] }),
  });

  const bulkCreateMutation = useMutation({
    mutationFn: async (items) => {
      await Promise.all(items.map(item => base44.entities.ScheduledMission.create(item)));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scheduledMissions'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ScheduledMission.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scheduledMissions'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: id => base44.entities.ScheduledMission.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scheduledMissions'] }),
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(missions.map(m => base44.entities.ScheduledMission.delete(m.id)));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scheduledMissions'] }),
  });

  const handleDragEnd = useCallback(async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    if (destination.droppableId === 'site-picker') return;

    // Parse the target date from droppableId (format: "day-YYYY-MM-DD")
    const targetDate = destination.droppableId.replace('day-', '');
    if (!targetDate.match(/^\d{4}-\d{2}-\d{2}$/)) return;

    if (draggableId.startsWith('site-')) {
      // New site being dragged from picker to calendar
      const siteId = draggableId.replace('site-', '');
      const site = SITES.find(s => s.id === siteId);
      if (!site) return;
      const defaultTime = site.diff === 'orange' ? '07:00' : site.diff === 'yellow' ? '07:30' : '08:00';
      createMutation.mutate({
        site_id: site.id, site_name: site.name, suburb: site.suburb,
        state: site.state, diff: site.diff, scheduled_date: targetDate,
        scheduled_time: defaultTime, status: 'planned', ai_generated: false,
      });
    } else if (draggableId.startsWith('mission-')) {
      // Existing mission being moved to a new day
      const missionId = draggableId.replace('mission-', '');
      updateMutation.mutate({ id: missionId, data: { scheduled_date: targetDate } });
    }
  }, [missions, createMutation, updateMutation]);

  const handleDeleteMission = useCallback(id => deleteMutation.mutate(id), [deleteMutation]);
  const handleUpdateMission = useCallback((id, data) => updateMutation.mutate({ id, data }), [updateMutation]);
  const handleAISchedule = useCallback(items => bulkCreateMutation.mutate(items), [bulkCreateMutation]);

  const statsPlanned = missions.filter(m => m.status === 'planned').length;
  const statsConfirmed = missions.filter(m => m.status === 'confirmed').length;
  const statsAI = missions.filter(m => m.ai_generated).length;

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 border-b border-slate-700 flex-shrink-0 flex-wrap">
        {/* Title */}
        <div className="flex items-center gap-2 mr-2">
          <CalendarDays className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-base text-white">Mission Planner</span>
        </div>

        {/* Nav */}
        <button onClick={() => setCurrentDate(navigate(view, currentDate, -1))} className="p-1.5 rounded hover:bg-slate-700 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 rounded text-xs font-semibold text-slate-400 hover:bg-slate-700 transition-colors">Today</button>
        <button onClick={() => setCurrentDate(navigate(view, currentDate, 1))} className="p-1.5 rounded hover:bg-slate-700 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="font-semibold text-slate-200 text-sm min-w-[180px]">{getTitle(view, currentDate)}</span>

        {/* View switcher */}
        <div className="flex gap-1 bg-slate-900/60 rounded-lg p-1 ml-2">
          {Object.keys(VIEW_LABELS).map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${view===v?'bg-blue-600 text-white':'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
              {VIEW_LABELS[v]}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-3 ml-2 text-xs text-slate-500">
          <span>{statsPlanned} planned</span>
          <span>{statsConfirmed} confirmed</span>
          {statsAI > 0 && <span className="text-purple-400">✦ {statsAI} AI</span>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 ml-auto">
          {missions.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => { if(confirm('Clear all scheduled missions?')) clearAllMutation.mutate(); }} className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 gap-1.5 text-xs">
              <Trash2 className="w-3.5 h-3.5" />Clear All
            </Button>
          )}
          <Button onClick={() => setAiOpen(true)} size="sm" className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs">
            <Sparkles className="w-3.5 h-3.5" />AI Schedule
          </Button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Site Picker Sidebar */}
          <SitePicker />

          {/* Calendar View */}
          <div className="flex-1 overflow-hidden">
            {view === 'month' && (
              <MonthView currentDate={currentDate} missions={missions} onDeleteMission={handleDeleteMission} onUpdateMission={handleUpdateMission} />
            )}
            {view === 'week' && (
              <WeekView currentDate={currentDate} missions={missions} onDeleteMission={handleDeleteMission} onUpdateMission={handleUpdateMission} />
            )}
            {view === 'day' && (
              <DayView currentDate={currentDate} missions={missions} onDeleteMission={handleDeleteMission} onUpdateMission={handleUpdateMission} />
            )}
          </div>
        </DragDropContext>
      </div>

      <AIScheduleModal open={aiOpen} onClose={() => setAiOpen(false)} onSchedule={handleAISchedule} />
    </div>
  );
}