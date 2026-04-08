import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, TreePine, Building2, Zap, Layers, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MODULES = [
  {
    id: 'env-guide-1',
    number: 1,
    title: 'Low Interference',
    subtitle: 'Open Environments',
    emoji: '🟢',
    icon: TreePine,
    color: 'emerald',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/30',
    textClass: 'text-emerald-400',
    description: 'Parks, reserves, industrial estates. The most forgiving sites you will fly — understand why they work and where they can still bite you.',
    estimatedTime: '8 min',
    page: 'EnvGuide1',
  },
  {
    id: 'env-guide-2',
    number: 2,
    title: 'Moderate Interference',
    subtitle: 'Suburban & Light Commercial',
    emoji: '🟡',
    icon: Building2,
    color: 'yellow',
    bgClass: 'bg-yellow-500/10',
    borderClass: 'border-yellow-500/30',
    textClass: 'text-yellow-400',
    description: 'Shopping centres, station precincts, medium-density residential. The most common site type — and the one that trips up overconfident pilots.',
    estimatedTime: '9 min',
    page: 'EnvGuide2',
  },
  {
    id: 'env-guide-3',
    number: 3,
    title: 'High Interference',
    subtitle: 'Dense Commercial & Infrastructure',
    emoji: '🟠',
    icon: Zap,
    color: 'orange',
    bgClass: 'bg-orange-500/10',
    borderClass: 'border-orange-500/30',
    textClass: 'text-orange-400',
    description: 'Hospitals, universities, rail corridors. GPS looks fine — but the data tells a different story. The failure is invisible until post-processing.',
    estimatedTime: '10 min',
    page: 'EnvGuide3',
  },
  {
    id: 'env-guide-4',
    number: 4,
    title: 'Urban Canyon',
    subtitle: 'CBD High-Rise Corridors',
    emoji: '🔴',
    icon: Layers,
    color: 'red',
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/30',
    textClass: 'text-red-400',
    description: 'The most technically demanding environment you will fly in regularly. Everything you\'ve learned across all other types converges here.',
    estimatedTime: '11 min',
    page: 'EnvGuide4',
  },
  {
    id: 'env-guide-5',
    number: 5,
    title: 'Harbour & Airport',
    subtitle: 'Specialist Environments',
    emoji: '🔵',
    icon: Waves,
    color: 'blue',
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/30',
    textClass: 'text-blue-400',
    description: 'Water surface multipath and controlled airspace proximity. Two environments with failure modes found nowhere else.',
    estimatedTime: '12 min',
    page: 'EnvGuide5',
  },
];

export default function EnvGuideModules() {
  const navigate = useNavigate();

  const completedModules = MODULES.map(m => {
    try {
      return localStorage.getItem(`env_guide_complete_${m.id}`) === 'true';
    } catch { return false; }
  });

  const completedCount = completedModules.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-5 py-8 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl('TrainingHub'))}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Site Environment Guide</p>
        </div>

        <div className="mb-8 pl-1">
          <h1 className="text-3xl font-bold text-white mb-2">Understanding GPS Environments</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Five environment types. Five distinct failure modes. Master all of them and you'll produce clean data on every site you fly.
          </p>
          {completedCount > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / MODULES.length) * 100}%` }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">{completedCount}/{MODULES.length} complete</span>
            </div>
          )}
        </div>

        {/* Module Cards */}
        <div className="space-y-4">
          {MODULES.map((mod, index) => {
            const isComplete = completedModules[index];
            const Icon = mod.icon;
            return (
              <motion.button
                key={mod.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                onClick={() => navigate(createPageUrl(mod.page))}
                className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${mod.bgClass} ${mod.borderClass}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-900/60`}>
                    <span className="text-2xl">{mod.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold uppercase tracking-wider ${mod.textClass}`}>
                        Guide {mod.number} of 5 · {mod.estimatedTime}
                      </span>
                      {isComplete && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                    </div>
                    <h3 className="font-bold text-white text-lg leading-tight">{mod.title}</h3>
                    <p className={`text-sm font-medium mb-2 ${mod.textClass}`}>{mod.subtitle}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{mod.description}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {completedCount === MODULES.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center"
          >
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="text-lg font-bold text-emerald-400 mb-1">All Guides Complete</h3>
            <p className="text-slate-400 text-sm">You now have the full picture of GPS environment classification. Apply it every time you pull up on a new site.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}