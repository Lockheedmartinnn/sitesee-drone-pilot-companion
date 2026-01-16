import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Camera, Compass, Mountain, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function PanoramaGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-5 py-8 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('QuickReference')}>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Panorama Capture Guide</h1>
            <p className="text-sm text-slate-400">Complete guide for tower and rooftop panoramas</p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Camera className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-200 font-semibold mb-1">When to Capture Panoramas</p>
              <p className="text-sm text-blue-200/80">
                Panoramas are captured when specifically requested as part of the deliverable or site requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Tower Panorama Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Mountain className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Tower Panorama</h2>
              <p className="text-sm text-slate-400">Cell tower panoramic capture</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-2">Using Dronelink Panorama Mission</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Select <strong>Panorama</strong> mission type in Dronelink</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Position drone at appropriate height (typically mid-tower or above equipment)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Set panorama type: <strong>360° Spherical</strong> (recommended) or <strong>360° Horizontal</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Camera settings remain consistent with main capture (Manual, f/4, ISO 100)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Execute mission - drone will automatically rotate and capture images</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-200">
                  <p className="font-semibold mb-1">Keep Settings Consistent</p>
                  <p>Ensure camera remains in Manual mode with same exposure settings as your main capture mission.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rooftop Panorama Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Compass className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Rooftop Panorama</h2>
              <p className="text-sm text-slate-400">Panorama as optional component</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-2">During Mission Markup (v9.7.0)</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Panorama Height:</strong> Mark highest point of interest with gimbal at 0° (recommended ~20m above roof)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Panorama Center:</strong> Mark center point with gimbal at -90° (directly above desired panorama location)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>During mission execution, panorama will be automatically captured at marked location</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-sm text-blue-200">
                <strong>Note:</strong> Panorama is an optional component in rooftop missions. Only mark if specifically requested or required for the deliverable.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Best Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
        >
          <h2 className="text-lg font-bold text-white mb-4">Best Practices</h2>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Timing:</strong> Capture panoramas during optimal lighting conditions (avoid harsh midday sun)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Stability:</strong> Ensure GPS is stable before panorama capture (especially after battery swaps)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Height Selection:</strong> Choose appropriate altitude to capture both equipment and surrounding context</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Camera Mode:</strong> Monitor camera mode during panorama - may glitch to "auto", switch back to "manual" without pausing</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Wind Conditions:</strong> Avoid panorama capture in high winds to prevent motion blur</span>
            </div>
          </div>
        </motion.div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link to={createPageUrl('TrainingVideos')}>
            <Button variant="outline" className="border-slate-600">
              <Camera className="w-4 h-4 mr-2" />
              View Panorama Training Videos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}