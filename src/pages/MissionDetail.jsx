import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Calendar, AlertCircle, CheckCircle2, Clock, Plus, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import ChecklistRunner from '@/components/ChecklistRunner';

export default function MissionDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const missionId = new URLSearchParams(location.search).get('id');
  
  const [isEditingRegion, setIsEditingRegion] = useState(false);
  const [editedRegion, setEditedRegion] = useState('');
  const [editedProvince, setEditedProvince] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteDetails, setNoteDetails] = useState('');
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  
  const { data: mission, isLoading } = useQuery({
    queryKey: ['mission', missionId],
    queryFn: async () => {
      const missions = await base44.entities.Mission.filter({ mission_id: missionId });
      return missions[0];
    },
    enabled: !!missionId
  });
  
  const { data: events = [] } = useQuery({
    queryKey: ['missionEvents', missionId],
    queryFn: () => base44.entities.MissionEvent.filter({ mission_id: missionId }, '-event_time'),
    enabled: !!missionId
  });
  
  const updateMissionMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Mission.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mission', missionId] });
      setIsEditingRegion(false);
    }
  });
  
  const addEventMutation = useMutation({
    mutationFn: (eventData) => base44.entities.MissionEvent.create(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missionEvents', missionId] });
      setShowAddNote(false);
      setNoteDetails('');
    }
  });
  
  const handleSaveRegion = () => {
    if (mission) {
      updateMissionMutation.mutate({
        id: mission.id,
        data: {
          region: editedRegion,
          province: editedProvince
        }
      });
    }
  };
  
  const handleAddNote = () => {
    if (!noteDetails.trim()) return;
    
    addEventMutation.mutate({
      mission_id: missionId,
      event_time: new Date().toISOString(),
      event_type: 'NOTE',
      event_label: 'Pilot note added',
      details: noteDetails,
      source: 'PILOT_INPUT'
    });
  };
  
  const outcomeColors = {
    SUCCESS: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    FAILURE: 'bg-red-500/20 text-red-400 border-red-500/30',
    PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  };
  
  const eventTypeIcons = {
    STATUS_CHANGE: Clock,
    FAILURE_LABEL: AlertCircle,
    SUCCESS_LABEL: CheckCircle2,
    GPS_STABILISATION: MapPin,
    SCALEPOINT_CHECK: CheckCircle2,
    NOTE: Edit2,
    OTHER: Clock
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-xl">Mission not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-5 py-8 pb-20">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{mission.site_name}</h1>
              <p className="text-slate-400">Mission ID: {mission.mission_id}</p>
            </div>
            <div className={cn('px-4 py-2 rounded-xl border font-semibold', outcomeColors[mission.outcome])}>
              {mission.outcome}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-400">Location</span>
              </div>
              {isEditingRegion ? (
                <div className="space-y-2">
                  <Input
                    value={editedRegion}
                    onChange={(e) => setEditedRegion(e.target.value)}
                    placeholder="Region"
                    className="bg-slate-900/50 border-slate-700"
                  />
                  <Input
                    value={editedProvince}
                    onChange={(e) => setEditedProvince(e.target.value)}
                    placeholder="Province"
                    className="bg-slate-900/50 border-slate-700"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveRegion}>
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingRegion(false)}>
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-semibold">{mission.region || 'Not set'}</p>
                  <p className="text-sm text-slate-400">{mission.province || 'Not set'}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditedRegion(mission.region || '');
                      setEditedProvince(mission.province || '');
                      setIsEditingRegion(true);
                    }}
                    className="mt-2 text-xs"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
            
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-slate-400">Status Changed</span>
              </div>
              <p className="font-semibold">
                {mission.status_changed_at ? format(new Date(mission.status_changed_at), 'PPp') : 'Unknown'}
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-slate-400">Status</span>
              </div>
              <p className="font-semibold">{mission.raw_status}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Checklist Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Operations Checklists</h2>
          <div className="flex gap-3">
            <Button onClick={() => setSelectedChecklist('GPS')}>
              Run GPS Stabilisation
            </Button>
            <Button onClick={() => setSelectedChecklist('SCALEPOINT')}>
              Run ScalePoint Placement
            </Button>
          </div>
        </motion.div>
        
        {selectedChecklist && (
          <ChecklistRunner
            missionId={missionId}
            category={selectedChecklist}
            onClose={() => setSelectedChecklist(null)}
          />
        )}
        
        {/* Mission Log Timeline */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Mission Log</h2>
            <Button
              size="sm"
              onClick={() => setShowAddNote(!showAddNote)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Note
            </Button>
          </div>
          
          {showAddNote && (
            <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
              <Label className="text-slate-300 mb-2">Event Details</Label>
              <Textarea
                value={noteDetails}
                onChange={(e) => setNoteDetails(e.target.value)}
                placeholder="Describe what happened, conditions, actions taken..."
                className="bg-slate-900/50 border-slate-700 mb-3"
                rows={4}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddNote}>Save Note</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddNote(false)}>Cancel</Button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No events logged yet</p>
            ) : (
              events.map((event, idx) => {
                const Icon = eventTypeIcons[event.event_type] || Clock;
                return (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      {idx < events.length - 1 && (
                        <div className="w-px h-full bg-slate-700/50 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-semibold">{event.event_label}</p>
                        <span className="text-xs text-slate-500">
                          {format(new Date(event.event_time), 'PPp')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-1">{event.event_type}</p>
                      {event.details && (
                        <div className="bg-slate-900/50 rounded-lg p-3 mt-2">
                          <p className="text-sm text-slate-300 whitespace-pre-wrap">{event.details}</p>
                        </div>
                      )}
                      <span className="text-xs text-slate-600">{event.source}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}