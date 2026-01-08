import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Rocket, 
  BookOpen, 
  PlayCircle, 
  Map, 
  ExternalLink,
  Satellite
} from 'lucide-react';
import ActionButton from '@/components/ActionButton';

export default function Home() {
  return (
    <div className="min-h-screen text-white">
      <div className="max-w-lg mx-auto px-5 py-8 pb-20 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6941e5b42ede03ae0cffdd74/bcd43d370_image.png"
            alt="SiteSee Logo"
            className="h-12 mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold tracking-tight">Pilot Companion</h1>
          <p className="text-slate-400 mt-2">Training & Reference Tool</p>
          <p className="text-xs text-slate-600 mt-3 max-w-sm mx-auto">
            Optional training aid • Works offline • All data stored locally on your device
          </p>
        </motion.div>

        {/* Primary Actions */}
        <div className="space-y-3 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Link to={createPageUrl('StartCapture')}>
              <ActionButton
                icon={Rocket}
                label="Start a Capture"
                sublabel="Guided step-by-step workflow"
                variant="primary"
              />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Link to={createPageUrl('GPSVerifier')}>
              <ActionButton
                icon={Satellite}
                label="GPS Altitude Verifier"
                sublabel="Verify battery swap GPS stability"
                variant="success"
              />
            </Link>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-slate-700/50" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Onboarding & Training</span>
          <div className="flex-1 h-px bg-slate-700/50" />
        </div>

        {/* Onboarding & Training Section */}
        <div className="space-y-3">
          <Link to={createPageUrl('TrainingVideos')}>
            <ActionButton
              icon={PlayCircle}
              label="Training Videos"
              sublabel="Mission markup & tutorials"
              index={0}
            />
          </Link>

          <Link to={createPageUrl('ToolsLinks')}>
            <ActionButton
              icon={BookOpen}
              label="Resources & Guides"
              sublabel="Complete onboarding materials"
              index={1}
            />
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-700/50" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Field Operations</span>
          <div className="flex-1 h-px bg-slate-700/50" />
        </div>

        {/* Field Operations Section */}
        <div className="space-y-3">
          <Link to={createPageUrl('QuickReference')}>
            <ActionButton
              icon={BookOpen}
              label="Quick Reference"
              sublabel="Field bible & checklists"
              index={0}
            />
          </Link>

          <Link to={createPageUrl('Scenarios')}>
            <ActionButton
              icon={Map}
              label="Scenarios"
              sublabel="What-if field situations"
              index={1}
            />
          </Link>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-slate-600 mt-12"
        >
          v1.0 • Built for field operations
        </motion.p>
      </div>
    </div>
  );
}