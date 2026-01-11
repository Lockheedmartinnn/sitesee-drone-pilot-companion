import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import InfoCard from './InfoCard';

const CheckboxItem = ({ label, checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={cn(
      "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left",
      checked 
        ? "bg-blue-500/20 border-2 border-blue-500/50" 
        : "bg-slate-800/50 border-2 border-slate-700/30 hover:border-slate-600/50"
    )}
  >
    {checked ? (
      <CheckSquare className="w-5 h-5 text-blue-400 flex-shrink-0" />
    ) : (
      <Square className="w-5 h-5 text-slate-500 flex-shrink-0" />
    )}
    <span className={cn(
      "text-sm",
      checked ? "text-white font-medium" : "text-slate-300"
    )}>
      {label}
    </span>
  </button>
);

export default function PostMissionForm({ 
  outcome, // 'success' or 'issue_flagged'
  onSubmit,
  onCancel 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Form state
  const [missionId, setMissionId] = useState('');
  const [customer, setCustomer] = useState('');
  const [location, setLocation] = useState('');
  const [droneModel, setDroneModel] = useState('');
  const [batteryChanges, setBatteryChanges] = useState('');
  const [deviceLocation, setDeviceLocation] = useState(null);

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDeviceLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  }, []);
  
  // Success form
  const [conditions, setConditions] = useState({
    normal: false,
    wind: false,
    cloud: false,
    sun_angle: false,
    rooftop: false,
    urban: false
  });
  
  const [technicalNotes, setTechnicalNotes] = useState({
    battery_change: false,
    gps_delay: false,
    camera_recheck: false,
    no_issues: false
  });
  
  const [optionalNotes, setOptionalNotes] = useState('');
  
  // Issue form
  const [technicalIssues, setTechnicalIssues] = useState({
    gps_drift: false,
    battery_issues: false,
    camera_exposure: false,
    mission_pause: false,
    marking_msa: false
  });
  
  const [environmentalIssues, setEnvironmentalIssues] = useState({
    wind: false,
    cloud_light: false,
    sun_angle: false,
    obstructions: false
  });
  
  const [equipmentIssues, setEquipmentIssues] = useState({
    battery_health: false,
    storage: false,
    controller: false,
    drone: false
  });
  
  const [requiredNotes, setRequiredNotes] = useState('');
  
  const toggleCondition = (key) => {
    setConditions(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const toggleTechnicalNote = (key) => {
    setTechnicalNotes(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const toggleTechnicalIssue = (key) => {
    setTechnicalIssues(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const toggleEnvironmentalIssue = (key) => {
    setEnvironmentalIssues(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const toggleEquipmentIssue = (key) => {
    setEquipmentIssues(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (outcome === 'issue_flagged' && !requiredNotes.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const selectedConditions = Object.entries(conditions)
      .filter(([_, checked]) => checked)
      .map(([key]) => key);
    
    const selectedTechnicalNotes = Object.entries(technicalNotes)
      .filter(([_, checked]) => checked)
      .map(([key]) => key);
    
    const selectedIssues = [
      ...Object.entries(technicalIssues).filter(([_, checked]) => checked).map(([key]) => `technical_${key}`),
      ...Object.entries(environmentalIssues).filter(([_, checked]) => checked).map(([key]) => `environmental_${key}`),
      ...Object.entries(equipmentIssues).filter(([_, checked]) => checked).map(([key]) => `equipment_${key}`)
    ];
    
    const data = {
      outcome,
      mission_id: missionId || undefined,
      customer: customer || undefined,
      country_location: location || undefined,
      drone_model: droneModel || undefined,
      battery_changes: batteryChanges ? parseInt(batteryChanges) : undefined,
      mission_date: new Date().toISOString(),
      latitude: deviceLocation?.latitude,
      longitude: deviceLocation?.longitude,
      ...(outcome === 'success' ? {
        conditions: selectedConditions,
        technical_notes: selectedTechnicalNotes,
        free_text_notes: optionalNotes || undefined
      } : {
        issue_categories: selectedIssues,
        free_text_notes: requiredNotes
      })
    };
    
    await onSubmit(data);
    setSubmitted(true);
    setIsSubmitting(false);
  };
  
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold mb-3">Thank You</h3>
        <p className="text-slate-400 mb-2">Mission log submitted successfully.</p>
        <p className="text-sm text-slate-500">This helps us improve support and training.</p>
      </motion.div>
    );
  }
  
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Mission Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Mission Details (Optional)</h3>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Mission ID"
            value={missionId}
            onChange={(e) => setMissionId(e.target.value)}
            className="bg-slate-800/50 border-slate-700"
          />
          <Input
            placeholder="Customer"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="bg-slate-800/50 border-slate-700"
          />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-slate-800/50 border-slate-700"
          />
          <Input
            placeholder="Drone Model"
            value={droneModel}
            onChange={(e) => setDroneModel(e.target.value)}
            className="bg-slate-800/50 border-slate-700"
          />
          <Input
            type="number"
            placeholder="Battery Changes"
            value={batteryChanges}
            onChange={(e) => setBatteryChanges(e.target.value)}
            className="bg-slate-800/50 border-slate-700"
          />
        </div>
      </div>
      
      {outcome === 'success' ? (
        <>
          {/* Conditions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Conditions (select all that apply)
            </h3>
            <div className="space-y-2">
              <CheckboxItem label="Normal conditions" checked={conditions.normal} onChange={() => toggleCondition('normal')} />
              <CheckboxItem label="Wind" checked={conditions.wind} onChange={() => toggleCondition('wind')} />
              <CheckboxItem label="Cloud / changing light" checked={conditions.cloud} onChange={() => toggleCondition('cloud')} />
              <CheckboxItem label="Sun angle issues" checked={conditions.sun_angle} onChange={() => toggleCondition('sun_angle')} />
              <CheckboxItem label="Rooftop / limited horizon" checked={conditions.rooftop} onChange={() => toggleCondition('rooftop')} />
              <CheckboxItem label="Urban interference" checked={conditions.urban} onChange={() => toggleCondition('urban')} />
            </div>
          </div>
          
          {/* Technical Notes */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Technical notes (optional)
            </h3>
            <div className="space-y-2">
              <CheckboxItem label="Battery change occurred" checked={technicalNotes.battery_change} onChange={() => toggleTechnicalNote('battery_change')} />
              <CheckboxItem label="GPS took longer than expected to stabilise" checked={technicalNotes.gps_delay} onChange={() => toggleTechnicalNote('gps_delay')} />
              <CheckboxItem label="Camera settings had to be re-checked" checked={technicalNotes.camera_recheck} onChange={() => toggleTechnicalNote('camera_recheck')} />
              <CheckboxItem label="No issues" checked={technicalNotes.no_issues} onChange={() => toggleTechnicalNote('no_issues')} />
            </div>
          </div>
          
          {/* Optional Free Text */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Anything unusual worth noting?
            </h3>
            <Textarea
              placeholder="Optional notes..."
              value={optionalNotes}
              onChange={(e) => setOptionalNotes(e.target.value)}
              className="bg-slate-800/50 border-slate-700 min-h-[100px]"
            />
          </div>
        </>
      ) : (
        <>
          {/* Technical Issues */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Technical Issues
            </h3>
            <div className="space-y-2">
              <CheckboxItem label="GPS drift / instability" checked={technicalIssues.gps_drift} onChange={() => toggleTechnicalIssue('gps_drift')} />
              <CheckboxItem label="Battery change issues" checked={technicalIssues.battery_issues} onChange={() => toggleTechnicalIssue('battery_issues')} />
              <CheckboxItem label="Camera / exposure inconsistency" checked={technicalIssues.camera_exposure} onChange={() => toggleTechnicalIssue('camera_exposure')} />
              <CheckboxItem label="Mission pause / resume problem" checked={technicalIssues.mission_pause} onChange={() => toggleTechnicalIssue('mission_pause')} />
              <CheckboxItem label="Marking / MSA issue" checked={technicalIssues.marking_msa} onChange={() => toggleTechnicalIssue('marking_msa')} />
            </div>
          </div>
          
          {/* Environmental Issues */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Environmental Issues
            </h3>
            <div className="space-y-2">
              <CheckboxItem label="Wind" checked={environmentalIssues.wind} onChange={() => toggleEnvironmentalIssue('wind')} />
              <CheckboxItem label="Cloud / light changes" checked={environmentalIssues.cloud_light} onChange={() => toggleEnvironmentalIssue('cloud_light')} />
              <CheckboxItem label="Sun angle" checked={environmentalIssues.sun_angle} onChange={() => toggleEnvironmentalIssue('sun_angle')} />
              <CheckboxItem label="Obstructions / access" checked={environmentalIssues.obstructions} onChange={() => toggleEnvironmentalIssue('obstructions')} />
            </div>
          </div>
          
          {/* Equipment Issues */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Equipment Issues
            </h3>
            <div className="space-y-2">
              <CheckboxItem label="Battery health" checked={equipmentIssues.battery_health} onChange={() => toggleEquipmentIssue('battery_health')} />
              <CheckboxItem label="Storage issue" checked={equipmentIssues.storage} onChange={() => toggleEquipmentIssue('storage')} />
              <CheckboxItem label="Controller / device issue" checked={equipmentIssues.controller} onChange={() => toggleEquipmentIssue('controller')} />
              <CheckboxItem label="Drone issue" checked={equipmentIssues.drone} onChange={() => toggleEquipmentIssue('drone')} />
            </div>
          </div>
          
          {/* Required Free Text */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              What happened? <span className="text-red-400">*</span>
            </h3>
            <Textarea
              placeholder="Briefly describe what went wrong or what you fixed..."
              value={requiredNotes}
              onChange={(e) => setRequiredNotes(e.target.value)}
              className="bg-slate-800/50 border-slate-700 min-h-[120px]"
              required
            />
            {requiredNotes.trim().length === 0 && (
              <p className="text-xs text-slate-500">Required field</p>
            )}
          </div>
        </>
      )}
      
      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 border-slate-700 bg-slate-800 hover:bg-slate-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || (outcome === 'issue_flagged' && !requiredNotes.trim())}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit & Finish'
          )}
        </Button>
      </div>
    </motion.form>
  );
}