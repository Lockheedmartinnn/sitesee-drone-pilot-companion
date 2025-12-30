import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, StickyNote } from 'lucide-react';

export default function MissionLogForm({ onSubmit, onCancel }) {
  const [jobId, setJobId] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ job_id: jobId, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Briefcase className="w-4 h-4" />
              Job ID (Optional)
            </label>
            <Input
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              placeholder="e.g., JOB-12345"
              className="bg-slate-900 border-slate-700 text-white"
            />
            <p className="text-xs text-slate-500 mt-1">For your personal tracking</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <StickyNote className="w-4 h-4" />
              Notes (Optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this capture..."
              className="bg-slate-900 border-slate-700 text-white h-20"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <p className="text-xs text-blue-300">
          ✓ Date/time captured automatically<br />
          ✓ Pilot ID from your profile<br />
          ✓ Stored locally on this device
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-blue-500 hover:bg-blue-600"
        >
          Complete
        </Button>
      </div>
    </form>
  );
}