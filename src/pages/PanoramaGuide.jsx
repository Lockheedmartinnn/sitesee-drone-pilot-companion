import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Camera, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InfoCard from '@/components/InfoCard';

export default function PanoramaGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-5 py-8 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Panorama Capture Guide</h1>
            <p className="text-sm text-slate-400">Supplementary mission for tower captures</p>
          </div>
        </div>

        {/* Purpose */}
        <div className="mb-6">
          <InfoCard variant="info" title="Purpose">
            <p>This guide explains how to use the Panorama mission as a separate mission to be captured as part of the automatic capture of cell towers.</p>
          </InfoCard>
        </div>

        {/* Capture Instructions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Capture Instructions</h2>

          {/* Step 1 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Load Panorama Mission</h3>
                <p className="text-sm text-slate-400 mt-1">Open the panorama mission in Dronelink</p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Position & Mark Point</h3>
                <p className="text-sm text-slate-400 mt-2">
                  • Fly to 10m above Tower Height<br />
                  • Position drone at centre of tower<br />
                  • Mark the panorama point(s)
                </p>
              </div>
            </div>
            <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-blue-300">
                <MapPin className="w-4 h-4" />
                <span>Center the drone directly above the tower center at +10m above Tower Height</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Select Panorama Pattern</h3>
                <p className="text-sm text-slate-400 mt-2">Choose "Spherical 360" as the standard panorama deliverable</p>
              </div>
            </div>
            <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-emerald-300">
                <Camera className="w-4 h-4" />
                <span><strong>Pattern:</strong> Spherical 360 (standard)</span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Name Your Mission</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Add "Pano" suffix to match your tower mission name for easy identification
                </p>
              </div>
            </div>
            <div className="mt-4 bg-slate-700/50 border border-slate-600 rounded-lg p-3">
              <p className="text-xs text-slate-300">
                <strong>Example:</strong><br />
                Tower Mission: "Brisbane Site 001"<br />
                Panorama Mission: "Brisbane Site 001 Pano"
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">5</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Fly Mission</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Monitor the capture process and obstacles as you would during Tower missions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Instructions */}
        <div className="mt-8">
          <InfoCard variant="warning" title="Upload Instructions">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p>Include panorama images in the upload <strong>along with</strong> the Tower Mission images in the same job</p>
            </div>
          </InfoCard>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link to={createPageUrl('Home')}>
            <Button className="w-full bg-slate-700 hover:bg-slate-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}