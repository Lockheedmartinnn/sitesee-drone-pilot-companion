import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check,
  Battery,
  HardDrive,
  Camera,
  Shield,
  Cloud,
  Video,
  Settings,
  BarChart3,
  Thermometer,
  AlertTriangle,
  Satellite,
  Target,
  Mountain,
  Ruler,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ProgressBar';
import ChecklistItem from '@/components/ChecklistItem';
import Timer from '@/components/Timer';
import InfoCard from '@/components/InfoCard';
import MissionLogForm from '@/components/MissionLogForm';
import { cn } from '@/lib/utils';

const STEPS = [
  "Equipment & Pre-Flight",
  "Camera & Settings",
  "GPS Stabilisation",
  "Marking & MSA",
  "Battery Change",
  "On-Site QC"
];

const STEP_CONFIGS = {
  1: {
    title: "Equipment & Pre-Flight Checklist",
    subtitle: "Verify all equipment is ready before takeoff",
    items: [
      { id: 'batteries', label: 'Batteries fully charged', sublabel: 'All flight batteries at 100%', critical: true },
      { id: 'storage', label: 'Storage available', sublabel: 'SD cards formatted & ready' },
      { id: 'lens', label: 'Lens clean', sublabel: 'No dust, smudges, or debris' },
      { id: 'permissions', label: 'Permissions checked', sublabel: 'Airspace & site access confirmed' },
      { id: 'weather', label: 'Weather acceptable', sublabel: 'Wind <20km/h, no rain expected' },
      { id: 'recording', label: 'Screen recording enabled', sublabel: 'For mission logging', critical: true }
    ]
  },
  2: {
    title: "Camera & Screen Settings",
    subtitle: "Lock exposure settings before flight",
    items: [
      { id: 'manual', label: 'Manual exposure set', sublabel: 'ISO / Aperture / Shutter speed configured', critical: true },
      { id: 'histogram', label: 'Histogram checked', sublabel: 'No clipping, balanced exposure' },
      { id: 'whitebalance', label: 'White balance rules followed', sublabel: 'Daylight or fixed Kelvin value' }
    ],
    warning: {
      title: "Critical Rule",
      message: "Never change exposure mid-mission. If lighting changes significantly, complete the current component first."
    }
  },
  3: {
    title: "GPS Stabilisation",
    subtitle: "Wait for stable satellite lock",
    info: {
      title: "Why This Matters",
      message: "GPS drift causes misaligned images. Waiting for stabilisation prevents costly re-flights and data quality issues."
    }
  },
  4: {
    title: "Marking & MSA",
    subtitle: "Correct tower marking ensures data quality",
    items: [
      { id: 'gps_stable', label: 'GPS confirmed stable', sublabel: '~32 satellites locked', critical: true },
      { id: 'tower_marked', label: 'Tower marked correctly', sublabel: 'Centre point verified' },
      { id: 'obstacles_marked', label: 'Obstacles marked correctly', sublabel: 'Not oversized — match real obstacles' },
      { id: 'msa_set', label: 'Minimum Safe Altitude set', sublabel: 'Based on actual obstacles + buffer' }
    ],
    warning: {
      title: "Common Mistake",
      message: "Oversizing obstacles artificially raises MSA and wastes battery on higher flights."
    }
  },
  5: {
    title: "Battery Change Protocol",
    subtitle: "Treat every battery swap as a reset event",
    items: [
      { id: 'battery_swapped', label: 'New battery installed', sublabel: 'Verified charge level' },
      { id: 'gps_restabilised', label: 'GPS re-stabilised', sublabel: '2 minutes minimum after boot' },
      { id: 'camera_rechecked', label: 'Camera settings re-verified', sublabel: 'Exposure unchanged from before' },
      { id: 'tower_recentred', label: 'Tower re-centred', sublabel: 'Before resuming mission' }
    ],
    warning: {
      title: "Battery Swap = Full Reset",
      message: "Don't rush! The most common failures happen after battery changes when steps are skipped."
    }
  },
  6: {
    title: "On-Site QC",
    subtitle: "Quality check before leaving the site",
    items: [
      { id: 'exposure_consistent', label: 'Exposure consistent', sublabel: 'Spot check images across mission' },
      { id: 'tower_centred', label: 'Tower centred throughout', sublabel: 'No drift visible in captures' },
      { id: 'components_complete', label: 'All mission components done', sublabel: 'Nothing missing from plan' },
      { id: 'no_drift', label: 'No drift after battery changes', sublabel: 'Alignment maintained' }
    ]
  }
};

export default function StartCapture() {
  const [currentStep, setCurrentStep] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});
  const [gpsTimerComplete, setGpsTimerComplete] = useState(false);
  const [finalDecision, setFinalDecision] = useState(null);
  const [showPostMissionForm, setShowPostMissionForm] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });
  
  const config = STEP_CONFIGS[currentStep];
  
  const toggleItem = useCallback((id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);
  
  const allItemsChecked = config?.items?.every(item => checkedItems[item.id]) ?? true;
  const canProceed = currentStep === 3 ? gpsTimerComplete : allItemsChecked;
  
  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleDecision = (decision) => {
    setFinalDecision(decision);
    setShowPostMissionForm(true);
  };
  
  const handlePostMissionSubmit = async (data) => {
    try {
      await base44.entities.MissionLog.create({
        ...data,
        pilot_id: user?.email || 'Unknown',
      });
      setMissionComplete(true);
    } catch (error) {
      console.error('Failed to submit mission log:', error);
      setMissionComplete(true);
    }
  };
  
  const handleCancelForm = () => {
    setShowPostMissionForm(false);
    setFinalDecision(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-lg mx-auto px-5 py-6 pb-32">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6941e5b42ede03ae0cffdd74/bcd43d370_image.png"
              alt="SiteSee"
              className="h-6"
            />
          </div>
        </div>
        
        {/* Progress */}
        <div className="mb-8">
          <ProgressBar current={currentStep} total={6} labels={STEPS} />
        </div>
        
        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold">{config.title}</h2>
              <p className="text-slate-400 mt-1">{config.subtitle}</p>
            </div>
            
            {/* Step 3: GPS Timer */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <Timer 
                  targetMinutes={2} 
                  onComplete={() => setGpsTimerComplete(true)}
                  label="GPS Stabilisation Timer"
                />
                
                {config.info && (
                  <InfoCard variant="info" title={config.info.title}>
                    <p>{config.info.message}</p>
                  </InfoCard>
                )}
                
                <InfoCard variant="warning" title="Checklist">
                  <ul className="space-y-1">
                    <li>• Wait for ~32 satellites</li>
                    <li>• Do NOT mark tower until timer completes</li>
                    <li>• Position should stop drifting</li>
                  </ul>
                </InfoCard>
              </div>
            )}
            
            {/* Step 6: Final Decision */}
            {currentStep === 6 && finalDecision === null && !showPostMissionForm && allItemsChecked && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <InfoCard variant="info" title="Final Decision">
                  <p className="mb-4">Based on your QC checks, would you leave the site confident this capture will pass?</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleDecision('yes')}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Yes
                    </Button>
                    <Button
                      onClick={() => handleDecision('no')}
                      variant="outline"
                      className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      No
                    </Button>
                  </div>
                </InfoCard>
              </motion.div>
            )}
            
            {/* Post-Mission Form */}
            {currentStep === 6 && showPostMissionForm && !missionComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Mission Log</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {finalDecision === 'yes' 
                      ? 'Quick completion form — helps us improve training'
                      : 'Help us understand what happened'}
                  </p>
                </div>
                <MissionLogForm
                  onSubmit={handlePostMissionSubmit}
                  onCancel={handleCancelForm}
                />
              </motion.div>
            )}
            
            {missionComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 text-center py-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-emerald-400">Mission Complete!</h3>
                <p className="text-slate-400 mt-2">Great work. Pack up and head out.</p>
                <Link to={createPageUrl('Home')}>
                  <Button className="mt-6 bg-slate-700 hover:bg-slate-600">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </motion.div>
            )}
            
            {/* Warning Card */}
            {config.warning && (
              <InfoCard variant="warning" title={config.warning.title} className="mb-4">
                <p>{config.warning.message}</p>
              </InfoCard>
            )}
            
            {/* Checklist Items */}
            {config.items && currentStep !== 6 && (
              <div className="space-y-3">
                {config.items.map(item => (
                  <ChecklistItem
                    key={item.id}
                    label={item.label}
                    sublabel={item.sublabel}
                    checked={checkedItems[item.id]}
                    critical={item.critical}
                    onToggle={() => toggleItem(item.id)}
                  />
                ))}
              </div>
            )}
            
            {/* Step 6 Checklist */}
            {currentStep === 6 && !finalDecision && (
              <div className="space-y-3">
                {config.items.map(item => (
                  <ChecklistItem
                    key={item.id}
                    label={item.label}
                    sublabel={item.sublabel}
                    checked={checkedItems[item.id]}
                    critical={item.critical}
                    onToggle={() => toggleItem(item.id)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation Footer */}
      {!(currentStep === 6 && (missionComplete || showPostMissionForm)) && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-5 py-4">
          <div className="max-w-lg mx-auto flex gap-3">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex-1 border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={nextStep}
              disabled={!canProceed || currentStep === 6}
              className={cn(
                "flex-1 transition-all duration-300",
                canProceed 
                  ? "bg-blue-500 hover:bg-blue-600" 
                  : "bg-slate-700 cursor-not-allowed"
              )}
            >
              {currentStep === 6 ? 'Complete' : 'Next'}
              {currentStep < 6 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}