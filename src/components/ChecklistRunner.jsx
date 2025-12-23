import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function ChecklistRunner({ missionId, category, onClose }) {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState([]);
  
  const { data: template, isLoading } = useQuery({
    queryKey: ['checklistTemplate', category],
    queryFn: async () => {
      const templates = await base44.entities.ChecklistTemplate.filter({ category });
      return templates[0];
    }
  });
  
  const createRunMutation = useMutation({
    mutationFn: (data) => base44.entities.ChecklistRun.create(data),
    onSuccess: (run) => {
      // Create mission event
      const failedSteps = responses.filter(r => !r.pass_fail);
      const overallResult = failedSteps.length === 0 ? 'PASS' : 'FAIL';
      
      base44.entities.MissionEvent.create({
        mission_id: missionId,
        event_time: new Date().toISOString(),
        event_type: category === 'GPS' ? 'GPS_STABILISATION' : 'SCALEPOINT_CHECK',
        event_label: `${template.name} checklist: ${overallResult}`,
        details: failedSteps.length > 0 
          ? `Failed steps: ${failedSteps.map((r, idx) => template.steps[r.step_index].step_title).join(', ')}\n\nNotes:\n${responses.map((r, idx) => `${template.steps[idx].step_title}: ${r.notes || 'No notes'}`).join('\n')}`
          : `All steps passed.\n\nNotes:\n${responses.map((r, idx) => `${template.steps[idx].step_title}: ${r.notes || 'No notes'}`).join('\n')}`,
        source: 'PILOT_INPUT'
      });
      
      queryClient.invalidateQueries({ queryKey: ['missionEvents', missionId] });
      onClose();
    }
  });
  
  const handleStepResponse = (passOrFail, notes = '') => {
    const newResponses = [...responses];
    newResponses[currentStep] = {
      step_index: currentStep,
      pass_fail: passOrFail,
      notes
    };
    setResponses(newResponses);
    
    if (currentStep < template.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleComplete = () => {
    const failedSteps = responses.filter(r => !r.pass_fail);
    const overallResult = failedSteps.length === 0 ? 'PASS' : 'FAIL';
    
    createRunMutation.mutate({
      mission_id: missionId,
      template_id: template.id,
      completed: true,
      completed_at: new Date().toISOString(),
      overall_result: overallResult,
      responses
    });
  };
  
  if (isLoading) {
    return (
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-8">
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );
  }
  
  if (!template) {
    return (
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-8">
        <p className="text-slate-400">Checklist template not found</p>
      </div>
    );
  }
  
  const isComplete = responses.length === template.steps.length;
  const currentStepData = template.steps[currentStep];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-8"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">{template.name}</h3>
          <p className="text-sm text-slate-400">
            Step {currentStep + 1} of {template.steps.length}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-700/30 rounded-full h-2 mb-6">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / template.steps.length) * 100}%` }}
        />
      </div>
      
      {!isComplete ? (
        <div>
          <div className="bg-slate-700/30 rounded-xl p-6 mb-6">
            <h4 className="font-semibold text-lg mb-3">{currentStepData.step_title}</h4>
            <p className="text-slate-300 mb-4">{currentStepData.step_instruction}</p>
            
            <Label className="text-slate-400 mb-2">Notes (optional)</Label>
            <Textarea
              placeholder="Add any observations or notes..."
              className="bg-slate-900/50 border-slate-700 mb-4"
              rows={3}
              id="step-notes"
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => {
                const notes = document.getElementById('step-notes').value;
                handleStepResponse(true, notes);
              }}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Pass
            </Button>
            <Button
              onClick={() => {
                const notes = document.getElementById('step-notes').value;
                handleStepResponse(false, notes);
              }}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Fail
            </Button>
          </div>
          
          {currentStep > 0 && (
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="w-full mt-3"
            >
              Back
            </Button>
          )}
        </div>
      ) : (
        <div>
          <div className="bg-slate-700/30 rounded-xl p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">Checklist Summary</h4>
            <div className="space-y-3">
              {responses.map((response, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  {response.pass_fail ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{template.steps[idx].step_title}</p>
                    {response.notes && (
                      <p className="text-sm text-slate-400 mt-1">{response.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => setCurrentStep(template.steps.length - 1)}
              variant="outline"
              className="flex-1"
            >
              Review
            </Button>
            <Button
              onClick={handleComplete}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
              disabled={createRunMutation.isPending}
            >
              {createRunMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete & Log'
              )}
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}