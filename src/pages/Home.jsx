import React, { useState } from 'react';
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
        <div className="space-y-3">
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

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link to={createPageUrl('FieldOperationsHub')}>
              <ActionButton
                icon={Rocket}
                label="Field Operations Hub"
                sublabel="Quick reference, scenarios & tools"
              />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
          >
            <Link to={createPageUrl('TrainingHub')}>
              <ActionButton
                icon={BookOpen}
                label="Training & Onboarding"
                sublabel="Videos, quizzes & documentation"
              />
            </Link>
          </motion.div>
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