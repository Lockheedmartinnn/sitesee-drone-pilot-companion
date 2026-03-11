import React, { useState } from 'react';
import { X, Clock, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const DIFF_STYLES = {
  green: 'bg-emerald-800/80 border-emerald-500/50 text-emerald-100',
  yellow: 'bg-amber-800/80 border-amber-500/50 text-amber-100',
  orange: 'bg-orange-800/80 border-orange-500/50 text-orange-100',
};
const STATUS_DOT = {
  planned: 'bg-slate-400', confirmed: 'bg-blue-400',
  completed: 'bg-green-400', cancelled: 'bg-red-400',
};

export default function MissionChip({ mission, compact, onDelete, onUpdate, isDragging }) {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(mission.scheduled_time || '07:00');
  const [notes, setNotes] = useState(mission.notes || '');
  const [status, setStatus] = useState(mission.status || 'planned');

  const handleSave = () => {
    onUpdate(mission.id, { scheduled_time: time, notes, status });
    setOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`rounded border cursor-pointer select-none group flex items-center gap-1 transition-all
          ${DIFF_STYLES[mission.diff] || DIFF_STYLES.green}
          ${compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1.5 text-xs'}
          ${isDragging ? 'shadow-xl ring-2 ring-blue-400 opacity-90 rotate-1' : 'hover:brightness-110'}
          ${mission.ai_generated ? 'ring-1 ring-purple-400/40' : ''}`}
      >
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[mission.status] || 'bg-slate-400'}`} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate leading-tight">{mission.site_name}</div>
          {!compact && (
            <div className="flex items-center gap-1 opacity-70 mt-0.5">
              <Clock className="w-2.5 h-2.5" /><span>{mission.scheduled_time || '07:00'}</span>
              {mission.suburb && <span className="truncate">· {mission.suburb}</span>}
            </div>
          )}
        </div>
        <button onClick={e => { e.stopPropagation(); onDelete(mission.id); }} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <X className="w-3 h-3" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-sm">
          <DialogHeader><DialogTitle className="text-white">Edit Mission</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className={`px-3 py-2 rounded border text-sm font-medium ${DIFF_STYLES[mission.diff]}`}>
              {mission.site_name} · {mission.suburb}, {mission.state}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Time</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white">
                  {['planned','confirmed','completed','cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Add notes..." className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white resize-none placeholder-slate-600" />
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="destructive" size="sm" onClick={() => { onDelete(mission.id); setOpen(false); }}>Delete</Button>
              <Button size="sm" className="ml-auto bg-blue-600 hover:bg-blue-700" onClick={handleSave}><Check className="w-3 h-3 mr-1" />Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}