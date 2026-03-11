import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { SITES } from '@/components/siteintel/siteData';
import { format, parseISO } from 'date-fns';
import { Sparkles, Check, Search, X, Wand2, ChevronDown } from 'lucide-react';

// Build unique city/area options from site data
const AREA_OPTIONS = [
  'All Areas',
  ...Array.from(new Set(SITES.map(s => s.state))).sort().map(state => ({
    label: `All ${state}`, value: `state:${state}`
  })),
  ...Array.from(new Set(SITES.map(s => {
    if (s.suburb.includes('CBD') || s.name.includes('CBD')) return `${s.state} CBD`;
    if (['Sydney CBD','Melbourne CBD','Brisbane CBD','Perth CBD'].includes(s.suburb)) return s.suburb;
    return null;
  }).filter(Boolean))).sort().map(area => ({ label: area, value: `area:${area}` })),
  ...Array.from(new Set(SITES.map(s => s.suburb))).sort().map(suburb => ({ label: suburb, value: `suburb:${suburb}` })),
].filter(Boolean);

const DIFF_BG = {
  green: 'bg-emerald-700/20 border-emerald-500/30 text-emerald-200',
  yellow: 'bg-amber-700/20 border-amber-500/30 text-amber-200',
  orange: 'bg-orange-700/20 border-orange-500/30 text-orange-200',
};

export default function AIScheduleModal({ open, onClose, onSchedule }) {
  const [step, setStep] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [numDays, setNumDays] = useState(5);
  const [maxPerDay, setMaxPerDay] = useState(2);
  const [skipWeekends, setSkipWeekends] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [summary, setSummary] = useState('');
  const [removed, setRemoved] = useState(new Set());
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('all');

  // AI Pick mode
  const [pickMode, setPickMode] = useState(false);
  const [pickCount, setPickCount] = useState(10);
  const [pickArea, setPickArea] = useState('');
  const [pickAreaCustom, setPickAreaCustom] = useState('');
  const [pickRisk, setPickRisk] = useState('all');
  const [pickLoading, setPickLoading] = useState(false);

  const filteredSites = useMemo(() => SITES.filter(s => {
    const matchDiff = diffFilter === 'all' || s.diff === diffFilter;
    const q = search.toLowerCase();
    return matchDiff && (!q || s.name.toLowerCase().includes(q) || s.suburb.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
  }), [search, diffFilter]);

  const selectedSites = useMemo(() => SITES.filter(s => selectedIds.includes(s.id)), [selectedIds]);

  const toggle = id => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleVisible = () => {
    const ids = filteredSites.map(s => s.id);
    const allOn = ids.every(id => selectedIds.includes(id));
    setSelectedIds(p => allOn ? p.filter(id => !ids.includes(id)) : [...new Set([...p, ...ids])]);
  };

  const generate = async () => {
    setLoading(true);
    setStep(3);
    const siteList = selectedSites.map(s =>
      `- ${s.id} | "${s.name}" | ${s.suburb}, ${s.state} | Risk: ${s.diff.toUpperCase()}`
    ).join('\n');

    const prompt = `You are an expert drone mission planner. Generate an optimal flight schedule.

RULES:
- HIGH RISK (orange) → 07:00 start (avoid 10am–3pm)
- MEDIUM RISK (yellow) → 07:30 start
- LOW RISK (green) → 08:00 start
- Group nearby suburbs on same day to minimise travel
- Max ${maxPerDay} missions/day over ${numDays} days starting ${startDate}
- Prioritise HIGH RISK sites earlier in the week
${skipWeekends ? '- Skip Saturday and Sunday' : ''}

SITES (${selectedSites.length}):
${siteList}

${instructions ? `SPECIAL INSTRUCTIONS: ${instructions}` : ''}

Return ONLY valid JSON:
{
  "schedule": [{"site_id":"X","site_name":"X","suburb":"X","state":"X","diff":"orange","scheduled_date":"YYYY-MM-DD","scheduled_time":"07:00","reasoning":"short note"}],
  "summary": "2-3 sentence overview"
}`;

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            schedule: { type: 'array', items: { type: 'object', properties: {
              site_id: {type:'string'}, site_name: {type:'string'}, suburb: {type:'string'},
              state: {type:'string'}, diff: {type:'string'}, scheduled_date: {type:'string'},
              scheduled_time: {type:'string'}, reasoning: {type:'string'}
            }}},
            summary: { type: 'string' }
          }
        }
      });
      if (result?.schedule) {
        setSchedule(result.schedule);
        setSummary(result.summary || '');
        setRemoved(new Set());
        setStep(4);
      } else {
        setStep(2);
      }
    } catch(e) {
      console.error(e);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const previewByDate = useMemo(() => {
    if (!schedule) return {};
    return schedule.reduce((acc, item, idx) => {
      if (!removed.has(idx)) {
        acc[item.scheduled_date] = acc[item.scheduled_date] || [];
        acc[item.scheduled_date].push({ ...item, idx });
      }
      return acc;
    }, {});
  }, [schedule, removed]);

  const apply = () => {
    const items = schedule
      .filter((_, i) => !removed.has(i))
      .map(item => ({
        site_id: item.site_id, site_name: item.site_name, suburb: item.suburb,
        state: item.state, diff: item.diff, scheduled_date: item.scheduled_date,
        scheduled_time: item.scheduled_time, status: 'planned', ai_generated: true,
      }));
    onSchedule(items);
    handleClose();
  };

  const handleClose = () => {
    setStep(1); setSelectedIds([]); setSchedule(null);
    setRemoved(new Set()); setLoading(false); setSearch('');
    setDiffFilter('all'); setInstructions('');
    onClose();
  };

  const stepCount = (schedule?.length || 0) - removed.size;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-5 pb-4 border-b border-slate-700 flex-shrink-0">
          <DialogTitle className="text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            AI Mission Scheduler
          </DialogTitle>
          <p className="text-sm text-slate-400 mt-1">Select sites → AI generates an optimised flight schedule.</p>
          <div className="flex gap-2 mt-3">
            {[{n:1,l:'1. Sites'},{n:2,l:'2. Settings'},{n:4,l:'3. Review'}].map(s => {
              const active = step===s.n || (step===3 && s.n===2);
              const done = step>s.n && !(step===3 && s.n===2);
              return (
                <div key={s.n} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${active?'bg-blue-600 text-white':done?'bg-slate-600 text-slate-300':'bg-slate-700/50 text-slate-600'}`}>
                  {done && <Check className="w-3 h-3" />}{s.l}
                </div>
              );
            })}
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 min-h-0">

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sites..." className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500" />
                </div>
                <div className="flex gap-1">
                  {[{k:'all',l:'All'},{k:'green',l:'🟢'},{k:'yellow',l:'🟡'},{k:'orange',l:'🟠'}].map(f => (
                    <button key={f.k} onClick={() => setDiffFilter(f.k)} className={`px-2.5 py-2 rounded text-xs font-bold ${diffFilter===f.k?'bg-blue-600 text-white':'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>{f.l}</button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400">{selectedIds.length} selected</span>
                <button onClick={toggleVisible} className="text-xs text-blue-400 hover:text-blue-300">
                  {filteredSites.every(s => selectedIds.includes(s.id)) ? 'Deselect visible' : 'Select all visible'}
                </button>
              </div>
              <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                {filteredSites.map(site => {
                  const on = selectedIds.includes(site.id);
                  return (
                    <div key={site.id} onClick={() => toggle(site.id)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer border transition-colors ${on?'bg-blue-600/15 border-blue-500/30':'border-transparent hover:bg-slate-700/50'}`}>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${on?'bg-blue-500 border-blue-500':'border-slate-600'}`}>
                        {on && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${site.diff==='green'?'bg-emerald-400':site.diff==='yellow'?'bg-amber-400':'bg-orange-400'}`} />
                      <span className="text-sm text-slate-200 font-medium truncate flex-1">{site.name}</span>
                      <span className="text-xs text-slate-500 flex-shrink-0">{site.suburb}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
                <Sparkles className="w-4 h-4 flex-shrink-0" />{selectedSites.length} sites selected
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">Start Date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">Number of Days</label>
                  <select value={numDays} onChange={e => setNumDays(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white">
                    {[1,2,3,4,5,7,10,14].map(n => <option key={n} value={n}>{n} {n===1?'day':'days'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">Max Missions / Day</label>
                  <select value={maxPerDay} onChange={e => setMaxPerDay(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white">
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setSkipWeekends(!skipWeekends)}>
                    <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${skipWeekends?'bg-blue-500':'bg-slate-600'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${skipWeekends?'translate-x-5':''}`} />
                    </div>
                    <span className="text-sm text-slate-300">Skip Weekends</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Special Instructions <span className="text-slate-600">(optional)</span></label>
                <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={3}
                  placeholder="e.g. 'Prioritise CBD sites first, keep high-risk sites to Tuesday–Thursday'..."
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white placeholder-slate-600 resize-none focus:border-blue-500 outline-none" />
              </div>
            </div>
          )}

          {/* STEP 3 — Generating */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-20 gap-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/40 animate-ping" />
              </div>
              <div className="text-center">
                <div className="font-bold text-white mb-1">Generating your schedule...</div>
                <div className="text-sm text-slate-400">Optimising {selectedSites.length} sites across {numDays} days</div>
                <div className="text-xs text-slate-600 mt-2">Grouping by location · Timing by risk · Checking windows</div>
              </div>
            </div>
          )}

          {/* STEP 4 — Preview */}
          {step === 4 && schedule && (
            <div>
              {summary && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">AI Summary</span>
                  </div>
                  <p className="text-sm text-purple-200/80">{summary}</p>
                </div>
              )}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-slate-300">{stepCount} missions ready</span>
                <span className="text-xs text-slate-600">Click × to remove any</span>
              </div>
              <div className="space-y-4">
                {Object.entries(previewByDate).sort().map(([date, items]) => (
                  <div key={date}>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <div className="h-px bg-slate-700 flex-1" />
                      {format(parseISO(date), 'EEEE, MMM d')}
                      <div className="h-px bg-slate-700 flex-1" />
                    </div>
                    <div className="space-y-1">
                      {items.map(item => (
                        <div key={item.idx} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm ${DIFF_BG[item.diff]}`}>
                          <span className="font-mono font-bold text-xs w-12 flex-shrink-0">{item.scheduled_time}</span>
                          <span className="font-semibold flex-1 truncate">{item.site_name}</span>
                          <span className="text-xs opacity-60 flex-shrink-0">{item.suburb}</span>
                          <button onClick={() => setRemoved(p => new Set([...p, item.idx]))} className="opacity-40 hover:opacity-100 hover:text-red-400 transition-all flex-shrink-0 ml-1">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {Object.keys(previewByDate).length === 0 && (
                  <div className="text-center text-slate-500 py-8">All missions removed</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex items-center gap-2 flex-shrink-0">
          {step === 1 && <>
            <Button variant="ghost" onClick={handleClose} className="text-slate-400">Cancel</Button>
            <Button onClick={() => setStep(2)} disabled={selectedIds.length===0} className="ml-auto bg-blue-600 hover:bg-blue-700">Next →</Button>
          </>}
          {step === 2 && <>
            <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-400">← Back</Button>
            <Button onClick={generate} className="ml-auto gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Sparkles className="w-4 h-4" />Generate Schedule
            </Button>
          </>}
          {step === 4 && <>
            <Button variant="ghost" onClick={() => { setStep(2); setSchedule(null); }} className="text-slate-400">← Redo</Button>
            <Button onClick={apply} disabled={stepCount===0} className="ml-auto gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Check className="w-4 h-4" />Apply {stepCount} to Calendar
            </Button>
          </>}
        </div>
      </DialogContent>
    </Dialog>
  );
}