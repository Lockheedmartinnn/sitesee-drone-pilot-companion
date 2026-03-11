import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';
import MissionChip from './MissionChip';

export default function WeekView({ currentDate, missions, onDeleteMission, onUpdateMission, weatherWarnings = {} }) {
  const days = eachDayOfInterval({ start: startOfWeek(currentDate), end: endOfWeek(currentDate) });

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="grid grid-cols-7 gap-2 flex-1">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayMissions = missions
            .filter(m => m.scheduled_date === dateStr)
            .sort((a, b) => (a.scheduled_time||'').localeCompare(b.scheduled_time||''));
          const today = isToday(day);

          return (
            <div key={dateStr} className="flex flex-col gap-2">
              <div className={`text-center py-2 rounded-lg flex-shrink-0 border ${today ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-700'}`}>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${today ? 'text-blue-200' : 'text-slate-500'}`}>{format(day, 'EEE')}</div>
                <div className={`text-xl font-bold leading-tight ${today ? 'text-white' : 'text-slate-200'}`}>{format(day, 'd')}</div>
                <div className={`text-[10px] ${today ? 'text-blue-300' : 'text-slate-600'}`}>{format(day, 'MMM')}</div>
              </div>
              <Droppable droppableId={`day-${dateStr}`}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}
                    className={`flex-1 rounded-lg p-1.5 border transition-colors space-y-1 min-h-[200px] ${
                      snapshot.isDraggingOver ? 'border-blue-400/60 bg-blue-500/10'
                      : today ? 'border-blue-500/30 bg-blue-500/5'
                      : 'border-slate-700 bg-slate-800/40'}`}>
                    {dayMissions.map((mission, index) => (
                      <Draggable key={mission.id} draggableId={`mission-${mission.id}`} index={index}>
                        {(prov, snap) => (
                          <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                            <MissionChip mission={mission} onDelete={onDeleteMission} onUpdate={onUpdateMission} isDragging={snap.isDragging} weatherWarning={weatherWarnings[mission.id]} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {dayMissions.length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-[10px] text-slate-700 text-center pt-4">Drop here</div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </div>
  );
}