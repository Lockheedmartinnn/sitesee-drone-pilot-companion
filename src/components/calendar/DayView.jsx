import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { format, isToday } from 'date-fns';
import MissionChip from './MissionChip';

export default function DayView({ currentDate, missions, onDeleteMission, onUpdateMission, weatherWarnings = {} }) {
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const dayMissions = missions
    .filter(m => m.scheduled_date === dateStr)
    .sort((a, b) => (a.scheduled_time||'').localeCompare(b.scheduled_time||''));
  const today = isToday(currentDate);

  return (
    <div className="p-6 h-full flex flex-col max-w-xl mx-auto w-full">
      <div className={`text-center py-4 rounded-xl mb-4 border ${today ? 'bg-blue-600/20 border-blue-500/50' : 'bg-slate-800 border-slate-700'}`}>
        <div className={`text-xs font-bold uppercase tracking-widest ${today ? 'text-blue-300' : 'text-slate-500'}`}>{format(currentDate, 'EEEE')}</div>
        <div className={`text-4xl font-bold ${today ? 'text-blue-100' : 'text-white'}`}>{format(currentDate, 'd')}</div>
        <div className={`text-sm ${today ? 'text-blue-300' : 'text-slate-400'}`}>{format(currentDate, 'MMMM yyyy')}</div>
      </div>
      <Droppable droppableId={`day-${dateStr}`}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}
            className={`flex-1 rounded-xl p-4 border transition-colors space-y-2 ${
              snapshot.isDraggingOver ? 'border-blue-400/60 bg-blue-500/10'
              : 'border-slate-700 bg-slate-800/40'}`}>
            {dayMissions.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2 py-16">
                <div className="text-4xl">📋</div>
                <div className="text-sm">No missions scheduled</div>
                <div className="text-xs">Drag a site here to add</div>
              </div>
            )}
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
          </div>
        )}
      </Droppable>
    </div>
  );
}