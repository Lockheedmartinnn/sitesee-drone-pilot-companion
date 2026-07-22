import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink,
  Camera,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CONFIG_ITEMS = [
  { id: 'manual_focus_on', label: 'Manual Focus Controls', required: 'ON' },
  { id: 'tap_to_focus_off', label: 'Tap-to-Focus', required: 'OFF' },
];

const FOCUS_STEPS = [
  { id: 'step1', label: 'Set focus mode to Manual' },
  { id: 'step2', label: 'Fly the drone up to the tower' },
  { id: 'step3', label: 'Observe the tower (foreground) and the ground/horizon (background)' },
  { id: 'step4', label: "Hold down 'M' or 'MF' to bring up the focus slider" },
  { id: 'step5', label: 'Adjust the slider toward the infinity side (not macro). Start at infinity and work backwards until both foreground and background are sharp.' },
];

export default function PreMissionFocusCheck({ onProceed }) {
  const [configChecks, setConfigChecks] = useState({});
  const [stepChecks, setStepChecks] = useState({});
  const [showWarning, setShowWarning] = useState(false);

  const allConfigDone = CONFIG_ITEMS.every(i => configChecks[i.id]);
  const allStepsDone = FOCUS_STEPS.every(s => stepChecks[s.id]);
  const allDone = allConfigDone && allStepsDone;

  // Sequential unlock: step N is unlocked only if all previous steps are checked
  const isStepUnlocked = (index) => {
    if (index === 0) return true;
    return FOCUS_STEPS.slice(0, index).every(s => stepChecks[s.id]);
  };

  const toggleConfig = (id) => {
    setConfigChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStep = (id, index) => {
    if (!isStepUnlocked(index)) return;
    setStepChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleProceed = () => {
    if (!allDone) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    onProceed();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex items-start justify-center p-5 pb-32">
      <div className="max-w-lg w-full space-y-6 pt-4">

        {/* Header */}
        <div className="text-center">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6941e5b42ede03ae0cffdd74/bcd43d370_image.png"
            alt="SiteSee"
            className="h-7 mx-auto mb-4"
          />
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs text-amber-400 mb-3">
            <Camera className="w-3.5 h-3.5" />
            Pre-Mission Check
          </div>
          <h1 className="text-2xl font-bold">Pre-Mission Focus Verification</h1>
        </div>

        {/* Intro Warning Banner */}
        <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-300 leading-relaxed">
            Before starting any mission, you must verify that the camera is correctly focused.
            Poor focus will cause the job to fail. Both the tower (foreground) and ground/horizon
            (background) must be sharp.
          </p>
        </div>

        {/* Section 1: Camera Configuration */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 px-1">
            Section 1 — Camera Configuration
          </h2>
          {CONFIG_ITEMS.map((item) => {
            const checked = configChecks[item.id];
            return (
              <button
                key={item.id}
                onClick={() => toggleConfig(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left",
                  checked
                    ? "bg-emerald-500/10 border-emerald-500/40"
                    : "bg-slate-800/60 border-slate-700 hover:border-slate-600"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                  checked ? "bg-emerald-500 border-emerald-500" : "border-slate-600"
                )}>
                  {checked && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <span className={cn("font-medium", checked ? "text-emerald-300" : "text-white")}>
                    {item.label}
                  </span>
                </div>
                <span className={cn(
                  "text-xs font-bold px-2 py-1 rounded-md",
                  item.required === 'ON'
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                )}>
                  {item.required}
                </span>
              </button>
            );
          })}
        </div>

        {/* Section 2: Focus Steps */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 px-1">
            Section 2 — Setting the Focus
          </h2>
          {FOCUS_STEPS.map((step, index) => {
            const checked = stepChecks[step.id];
            const unlocked = isStepUnlocked(index);

            return (
              <motion.button
                key={step.id}
                onClick={() => toggleStep(step.id, index)}
                disabled={!unlocked}
                layout
                className={cn(
                  "w-full flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 text-left",
                  checked
                    ? "bg-emerald-500/10 border-emerald-500/40"
                    : unlocked
                      ? "bg-slate-800/60 border-slate-700 hover:border-slate-600"
                      : "bg-slate-800/30 border-slate-800 opacity-60 cursor-not-allowed"
                )}
              >
                {/* Step number / lock / check */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5">
                  {checked ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  ) : !unlocked ? (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-slate-500" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500/60 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-400">{index + 1}</span>
                    </div>
                  )}
                </div>
                <p className={cn(
                  "text-sm leading-relaxed flex-1 pt-1",
                  checked ? "text-emerald-300" : unlocked ? "text-white" : "text-slate-500"
                )}>
                  {step.label}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Section 3: Image Validation Reminder (static info card) */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <h2 className="text-sm font-bold text-blue-300">Section 3 — Image Validation Reminder</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            After capture, manually review images before uploading. Check that both the tower and
            background are sharp. Blurry images will result in a failed job.
          </p>
          <a
            href="https://sitesee.atlassian.net/wiki/spaces/CSE/pages/3132686379/SiteSee+Web+Portal+Legacy+-+Upload+images"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 underline"
          >
            See also: Uploading Images – SiteSee
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              animate={{
                width: `${((Object.values(configChecks).filter(Boolean).length + Object.values(stepChecks).filter(Boolean).length) / (CONFIG_ITEMS.length + FOCUS_STEPS.length)) * 100}%`
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {Object.values(configChecks).filter(Boolean).length + Object.values(stepChecks).filter(Boolean).length} / {CONFIG_ITEMS.length + FOCUS_STEPS.length} complete
          </span>
        </div>

        {/* Warning */}
        <AnimatePresence>
          {showWarning && !allDone && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">
                Please complete all focus verification steps before proceeding.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Proceed Button */}
        <Button
          onClick={handleProceed}
          className={cn(
            "w-full h-12 text-base font-semibold transition-all duration-300",
            allDone
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-slate-700 hover:bg-slate-600"
          )}
        >
          {allDone ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Focus Verified — Begin Mission
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Complete Checklist to Proceed
            </>
          )}
        </Button>
      </div>
    </div>
  );
}