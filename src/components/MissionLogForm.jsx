import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CheckboxItem = ({ label, checked, onCheckedChange }) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id={label}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="border-slate-600"
    />
    <label
      htmlFor={label}
      className="text-sm text-slate-300 cursor-pointer"
    >
      {label}
    </label>
  </div>
);

export default function MissionLogForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    country: '',
    region: '',
    latitude: '',
    longitude: '',
    customer: '',
    pilot_group: '',
    site_type: '',
    drone_model: '',
    camera_model: '',
    outcome: '',
    flagged: false,
    primary_flag_reason: '',
    secondary_factors: [],
    notes: '',
    weather_condition: '',
    time_of_day: '',
    satellite_count_band: '',
    mission_date: new Date().toISOString()
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const secondaryFactorsList = [
    'Wind',
    'Sun glare / sun angle',
    'Low satellite count',
    'Battery swaps',
    'Rooftop complexity',
    'Obstructions'
  ];
  
  const toggleSecondaryFactor = (factor) => {
    setFormData(prev => ({
      ...prev,
      secondary_factors: prev.secondary_factors.includes(factor)
        ? prev.secondary_factors.filter(f => f !== factor)
        : [...prev.secondary_factors, factor]
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await onSubmit({ ...formData, data_source: 'manual', is_locked: false });
      
      // Log audit trail
      try {
        await base44.entities.AuditLog.create({
          user_email: (await base44.auth.me()).email,
          action: 'mission_log_create',
          entity_type: 'MissionLog',
          entity_id: result?.id || 'unknown',
          details: `Created mission log for ${formData.region || 'unknown location'}`
        });
      } catch (auditError) {
        console.error('Failed to create audit log:', auditError);
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting mission log:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-bold text-emerald-400">Mission Logged</h3>
        <p className="text-slate-400 text-sm mt-2">Thank you for your submission</p>
      </motion.div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Governance Statement */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-300">
        <p className="font-semibold mb-1">Quality Insight Tool</p>
        <p className="text-xs text-blue-400">
          This tool provides training reinforcement and quality insight only. 
          Enforcement and operational responsibility remain with the customer.
        </p>
      </div>
      
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-400">Country</Label>
          <Input
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="bg-slate-900/50 border-slate-700"
            placeholder="e.g. Kenya"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-400">Region</Label>
          <Input
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="bg-slate-900/50 border-slate-700"
            placeholder="e.g. Nairobi"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-400">Latitude</Label>
          <Input
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            className="bg-slate-900/50 border-slate-700"
            placeholder="e.g. -1.2921"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-400">Longitude</Label>
          <Input
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            className="bg-slate-900/50 border-slate-700"
            placeholder="e.g. 36.8219"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-slate-400">Customer (Towerco)</Label>
        <Input
          value={formData.customer}
          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
          className="bg-slate-900/50 border-slate-700"
          placeholder="Customer name"
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-slate-400">Pilot Group / Vendor</Label>
        <Input
          value={formData.pilot_group}
          onChange={(e) => setFormData({ ...formData, pilot_group: e.target.value })}
          className="bg-slate-900/50 border-slate-700"
          placeholder="Organization name"
        />
      </div>
      
      {/* Site & Equipment */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-400">Site Type *</Label>
          <Select value={formData.site_type} onValueChange={(value) => setFormData({ ...formData, site_type: value })}>
            <SelectTrigger className="bg-slate-900/50 border-slate-700">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tower">Tower</SelectItem>
              <SelectItem value="Rooftop">Rooftop</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-400">Outcome *</Label>
          <Select value={formData.outcome} onValueChange={(value) => setFormData({ ...formData, outcome: value })}>
            <SelectTrigger className="bg-slate-900/50 border-slate-700">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pass">Pass</SelectItem>
              <SelectItem value="Rework">Rework</SelectItem>
              <SelectItem value="Fail">Fail</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-400">Drone Model</Label>
          <Input
            value={formData.drone_model}
            onChange={(e) => setFormData({ ...formData, drone_model: e.target.value })}
            className="bg-slate-900/50 border-slate-700"
            placeholder="e.g. DJI Mavic 3"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-400">Camera Model</Label>
          <Input
            value={formData.camera_model}
            onChange={(e) => setFormData({ ...formData, camera_model: e.target.value })}
            className="bg-slate-900/50 border-slate-700"
            placeholder="e.g. Hasselblad L2D"
          />
        </div>
      </div>
      
      {/* Environment */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-400">Weather</Label>
          <Select value={formData.weather_condition} onValueChange={(value) => setFormData({ ...formData, weather_condition: value })}>
            <SelectTrigger className="bg-slate-900/50 border-slate-700">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Clear">Clear</SelectItem>
              <SelectItem value="Cloudy">Cloudy</SelectItem>
              <SelectItem value="Windy">Windy</SelectItem>
              <SelectItem value="Rain">Rain</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-400">Time of Day</Label>
          <Select value={formData.time_of_day} onValueChange={(value) => setFormData({ ...formData, time_of_day: value })}>
            <SelectTrigger className="bg-slate-900/50 border-slate-700">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Midday">Midday</SelectItem>
              <SelectItem value="Afternoon">Afternoon</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-400">Satellites</Label>
          <Select value={formData.satellite_count_band} onValueChange={(value) => setFormData({ ...formData, satellite_count_band: value })}>
            <SelectTrigger className="bg-slate-900/50 border-slate-700">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<28">&lt;28</SelectItem>
              <SelectItem value="28-31">28-31</SelectItem>
              <SelectItem value="32+">32+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Flagging */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="flagged"
            checked={formData.flagged}
            onCheckedChange={(checked) => setFormData({ ...formData, flagged: checked })}
            className="border-slate-600"
          />
          <label htmlFor="flagged" className="text-slate-300 font-medium cursor-pointer">
            Flag this mission for issues
          </label>
        </div>
        
        {formData.flagged && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 pl-6 border-l-2 border-amber-500/30"
          >
            <div className="space-y-2">
              <Label className="text-slate-400">Primary Flag Reason</Label>
              <Select value={formData.primary_flag_reason} onValueChange={(value) => setFormData({ ...formData, primary_flag_reason: value })}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GPS instability">GPS instability</SelectItem>
                  <SelectItem value="Exposure inconsistency">Exposure inconsistency</SelectItem>
                  <SelectItem value="Focus issue">Focus issue</SelectItem>
                  <SelectItem value="Missing coverage">Missing coverage</SelectItem>
                  <SelectItem value="Upload / processing issue">Upload / processing issue</SelectItem>
                  <SelectItem value="Weather interruption">Weather interruption</SelectItem>
                  <SelectItem value="Equipment fault">Equipment fault</SelectItem>
                  <SelectItem value="Time pressure / rushing">Time pressure / rushing</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-400">Secondary Factors (optional)</Label>
              <div className="space-y-2">
                {secondaryFactorsList.map(factor => (
                  <CheckboxItem
                    key={factor}
                    label={factor}
                    checked={formData.secondary_factors.includes(factor)}
                    onCheckedChange={() => toggleSecondaryFactor(factor)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Notes */}
      <div className="space-y-2">
        <Label className="text-slate-400">Notes (optional)</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="bg-slate-900/50 border-slate-700 min-h-[80px]"
          placeholder="Any additional observations..."
        />
      </div>
      
      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-slate-700 bg-slate-800 hover:bg-slate-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.outcome || !formData.site_type}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Mission Log'
          )}
        </Button>
      </div>
    </form>
  );
}