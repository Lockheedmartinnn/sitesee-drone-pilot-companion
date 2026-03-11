import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { SITES } from '@/components/siteintel/siteData';
import { Search } from 'lucide-react';

const DIFF_DOT = { green: 'bg-emerald-400', yellow: 'bg-amber-400', orange: 'bg-orange-400' };

export default function SitePicker() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = SITES.filter(s => {
    const matchFilter = filter === 'all' || s.diff === filter;
    const q = search.toLowerCase();
    return matchFilter && (!q || s.name.toLowerCase().includes(q) || s.suburb.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
  }).slice(0, 80);

  return (
    <div className="w-56 bg-slate-800 border-r border-slate-700 flex flex-col flex-shrink-0 overflow-hidden">
      <div className="p-3 border-b border-slate-700 flex-shrink-0">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Drag to Calendar</div>
        <div className="relative mb-2">
          <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-7 pr-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-blue-500" />
        </div>
        <div className="flex gap-1">
          {[{k:'all',l:'All'},{k:'green',l:'🟢'},{k:'yellow',l:'🟡'},{k:'orange',l:'🟠'}].map(f => (
            <button key={f.k} onClick={() => setFilter(f.k)} className={`flex-1 py-1 rounded text-xs font-bold transition-colors ${filter===f.k ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'}`}>{f.l}</button>
          ))}
        </div>
      </div>
      <Droppable droppableId="site-picker" isDropDisabled>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-y-auto p-2 space-y-1">
            {filtered.map((site, index) => (
              <Draggable key={site.id} draggableId={`site-${site.id}`} index={index}>
                {(prov, snap) => (
                  <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded border cursor-grab active:cursor-grabbing bg-slate-900 select-none transition-all border-slate-700/50 ${snap.isDragging ? 'shadow-lg ring-1 ring-blue-400 bg-slate-700' : 'hover:bg-slate-750 hover:border-slate-600'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DIFF_DOT[site.diff]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-200 truncate leading-tight">{site.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{site.suburb}</div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {filtered.length === 0 && <div className="text-xs text-slate-600 text-center py-6">No sites found</div>}
          </div>
        )}
      </Droppable>
    </div>
  );
}