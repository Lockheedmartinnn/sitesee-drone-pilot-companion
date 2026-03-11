import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday } from 'date-fns';
import MissionChip from './MissionChip';

const DAY_HEADERS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function MonthView({ currentDate, missions, onDeleteMission, onUpdateMission }) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="grid grid-cols-7 mb-1 flex-shrink-0">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 flex-1">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayMissions = missions
            .filter(m => m.scheduled_date === dateStr)
            .sort((a, b) => (a.scheduled_time||'').localeCompare(b.scheduled_time||''));
          const inMonth = isSameMonth(day, currentDate);
          const today = isToday(day);

          return (
            <Droppable key={dateStr} droppableId={`day-${dateStr}`}>
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps}
                  className={`rounded-lg p-1.5 border flex flex-col transition-colors min-h-[90px] ${
                    snapshot.isDraggingOver ? 'border-blue-400/60 bg-blue-500/10'
                    : today ? 'border-blue-500/50 bg-blue-500/5'
                    : inMonth ? 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                    : 'border-slate-800/40 bg-slate-900/20'}`}>
                  <div className={`text-xs font-bold mb-1 w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 text-[11px] ${today ? 'bg-blue-500 text-white' : inMonth ? 'text-slate-300' : 'text-slate-700'}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-0.5 flex-1">
                    {dayMissions.map((mission, index) => (
                      <Draggable key={mission.id} draggableId={`mission-${mission.id}`} index={index}>
                        {(prov, snap) => (
                          <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                            <MissionChip mission={mission} compact onDelete={onDeleteMission} onUpdate={onUpdateMission} isDragging={snap.isDragging} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </div>
  );
}