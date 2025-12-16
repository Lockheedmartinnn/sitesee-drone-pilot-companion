import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  ChevronDown,
  Cloud,
  Battery,
  Satellite,
  AlertTriangle,
  Camera,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import InfoCard from '@/components/InfoCard';

const SCENARIOS = [
  {
    id: 1,
    icon: Cloud,
    title: "Weather Changes Mid-Mission",
    situation: "You're halfway through a capture when clouds roll in and lighting conditions change significantly.",
    solution: "Complete the current mission component without changing exposure. If the change is dramatic (bright sun to overcast), you may need to complete the mission with current settings and potentially re-fly affected sections another day. Never change exposure mid-component.",
    key_points: [
      "Finish current component first",
      "Don't touch exposure settings",
      "Note affected components for possible re-flight"
    ]
  },
  {
    id: 2,
    icon: Battery,
    title: "Forgot to Re-stabilise After Battery Swap",
    situation: "You changed batteries and rushed to continue. Halfway through the next component, you realise you didn't wait for GPS stabilisation.",
    solution: "Stop the current component. Land safely. Wait for full GPS stabilisation (2-5 minutes, ~32 satellites). You'll likely need to re-fly the affected component from the beginning.",
    key_points: [
      "Stop immediately when realised",
      "Full re-stabilisation required",
      "Re-fly affected component from start"
    ]
  },
  {
    id: 3,
    icon: Satellite,
    title: "GPS Count Drops Mid-Flight",
    situation: "During a mission, you notice the satellite count drops from 32 to 18 satellites.",
    solution: "Complete the current orbit/pass if close to finishing. If just starting, return to home point and wait for satellite count to recover. Check for interference sources (nearby structures, vehicles with radio equipment). If count doesn't recover, abort mission.",
    key_points: [
      "Complete current pass if almost done",
      "Return home if just starting",
      "Check for interference sources"
    ]
  },
  {
    id: 4,
    icon: AlertTriangle,
    title: "Drone Shows Low Battery Warning Early",
    situation: "Battery shows 30% but drone is warning about low battery much earlier than expected.",
    solution: "Trust the drone's warning over the percentage. Initiate RTH immediately. After landing, check battery health in app. Mark this battery for inspection. Use a different battery for remaining mission.",
    key_points: [
      "Trust warnings, not percentages",
      "RTH immediately",
      "Mark battery for inspection"
    ]
  },
  {
    id: 5,
    icon: Camera,
    title: "Images Look Overexposed on Controller",
    situation: "Reviewing images on the controller screen, they appear brighter than expected.",
    solution: "First, check if screen brightness is set correctly. Check histogram — if highlights aren't clipped, the exposure may be fine. Controller screens aren't colour-accurate. Only adjust exposure if histogram shows clipping, and only between components.",
    key_points: [
      "Check controller screen brightness",
      "Trust histogram over screen appearance",
      "Only adjust between components if truly needed"
    ]
  },
  {
    id: 6,
    icon: MapPin,
    title: "Tower Marker Seems Off-Centre",
    situation: "After marking the tower, the mission paths don't look centred correctly.",
    solution: "Do not start the mission. Delete the tower marker. Wait for GPS re-stabilisation (2 min minimum). Re-mark tower carefully, ensuring you're marking the true centre point. Verify mission paths look correct before starting.",
    key_points: [
      "Never fly with incorrect marking",
      "Delete and re-mark",
      "Full re-stabilisation required"
    ]
  }
];

const ScenarioCard = ({ scenario, isOpen, onToggle }) => {
  const Icon = scenario.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-700/20 transition-colors"
      >
        <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-slate-300" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white">{scenario.title}</h3>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 text-slate-400 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Situation */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Situation</p>
                <p className="text-sm text-slate-300">{scenario.situation}</p>
              </div>
              
              {/* Solution */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">What To Do</p>
                <p className="text-sm text-slate-300">{scenario.solution}</p>
              </div>
              
              {/* Key Points */}
              <div className="bg-slate-700/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Points</p>
                <ul className="space-y-2">
                  {scenario.key_points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Scenarios() {
  const [openId, setOpenId] = useState(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-lg mx-auto px-5 py-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Scenarios</h1>
            <p className="text-sm text-slate-400">What-if field situations</p>
          </div>
        </div>
        
        <InfoCard variant="info" className="mb-6">
          <p>Tap any scenario to see the recommended response. These are real situations pilots encounter.</p>
        </InfoCard>
        
        {/* Scenarios List */}
        <div className="space-y-3">
          {SCENARIOS.map(scenario => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              isOpen={openId === scenario.id}
              onToggle={() => setOpenId(openId === scenario.id ? null : scenario.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}