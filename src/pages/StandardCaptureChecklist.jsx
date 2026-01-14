import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function StandardCaptureChecklist() {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const Section = ({ id, title, children }) => {
    const isExpanded = expandedSections[id];
    
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden mb-4">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
        >
          <h3 className="font-bold text-white text-left">{title}</h3>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-700"
            >
              <div className="p-4 space-y-3 text-sm text-slate-300">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-5 py-8 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('ToolsLinks')}>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Standard Capture Process Checklist</h1>
            <p className="text-sm text-slate-400">v20 - Updated 13th Jan 2026</p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-200">
            <strong>Note:</strong> This checklist is a guide to support pilots in making correct decisions during the capture process. 
            It is the pilot's responsibility to ensure these are followed and all software and hardware is prepared ahead of time.
          </p>
        </div>

        {/* Sections */}
        <Section id="packing" title="Packing Checklist">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Circle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>5 GCPs (if required)</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>M3E / M2P Drone</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Batteries (Fully Charged)</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Controller (Fully Charged)</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Ensure SD card loaded with sufficient storage</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Required PPE</span>
            </li>
          </ul>
        </Section>

        <Section id="preflight" title="Pre-Flight">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-white mb-1">Site Checks:</p>
              <ul className="space-y-1 ml-4">
                <li>• Check restrictions at http://ok2fly.com.au or equivalent</li>
                <li>• Check in with Site Management/Roof Access</li>
                <li>• Preliminary inspection of site</li>
                <li>• Identify structure of tower/rooftop</li>
                <li>• Take-off/Landing area identified</li>
                <li>• Obstacles identified</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Communication:</p>
              <p>Communicate with SiteSee's point of contact with information and schedule of site visits if needed via Jira support (Also contactable by email: don.kaluarachchi@sitesee.com.au)</p>
            </div>
          </div>
        </Section>

        <Section id="gcp" title="GCP Usage (If Required)">
          <div className="space-y-3">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <p className="text-amber-200 text-xs">Only required for specific projects - check with SiteSee</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Pre-Site:</p>
              <ul className="space-y-1 ml-4">
                <li>• Check Propeller Coverage Map: https://web.propelleraero.com/aeropoints-coverage-map/</li>
                <li>• Use Google Street View for GCP placement planning</li>
                <li>• Confirm GCPs are charged (place in sunlight before mission)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Placement:</p>
              <ul className="space-y-1 ml-4">
                <li>✓ DO: Place on elevated surfaces, ensure unobstructed sky view, spread out on site</li>
                <li>✗ DO NOT: Place close to shelter/fence, in straight line, or in windy/slanted locations</li>
                <li>• Turn on GCP (press once - constant red light confirms on)</li>
                <li>• Keep GCPs on for at least 1 hour from turn-on</li>
                <li>• For Aeropoint v2s: use app to check signal strength</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="camera" title="Camera Settings">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
            <p className="text-red-200 font-semibold">CRITICAL: Set to Manual Mode</p>
          </div>
          <ul className="space-y-2">
            <li>• <strong>Mode:</strong> Manual (M)</li>
            <li>• <strong>F-Stop:</strong> f/4</li>
            <li>• <strong>ISO:</strong> 100</li>
            <li>• <strong>Shutter Speed:</strong> 1/1250 to 1/2000 (pilot discretion based on conditions)</li>
            <li>• <strong>White Balance:</strong> Auto (unchanged from default)</li>
            <li>• <strong>Focus:</strong> Manual Focus (MF) set to infinity</li>
            <li>• <strong>De-warping:</strong> ON (if available on drone)</li>
          </ul>
        </Section>

        <Section id="gps" title="GPS Stabilization">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-3">
            <p className="text-emerald-200 font-semibold">NEW: v9.7.0 Requirement</p>
          </div>
          <div className="space-y-2">
            <p><strong>M2P:</strong> Give drone minimum 2 minutes for GPS to stabilize if there have been GPS problems</p>
            <p><strong>M3E:</strong> Let drone stabilize after turn-on. Leave on takeoff spot for 2 mins in open area with line of sight to sky, no obstacles (trees/buildings)</p>
            <p><strong>Rooftop v9.7.0:</strong> GPS stabilization MUST be performed at ground level before takeoff due to 1-second capture interval</p>
          </div>
        </Section>

        <Section id="marking" title="Mission Marking - General">
          <ul className="space-y-2">
            <li>• Highly recommended: use one battery for marking, fresh battery for flying mission</li>
            <li>• Mark obstacles carefully, erring on side of caution</li>
            <li>• Watch for radius marking issues (default: 4m if no radius marked)</li>
            <li>• Keep camera settings consistent during supplementary manual captures</li>
            <li>• If panorama is part of deliverable, use Panorama mission</li>
          </ul>
        </Section>

        <Section id="tower-monopole" title="Monopole/Lattice Tower Capture">
          <ul className="space-y-2">
            <li>• Fly Scanlink mission - choose monopole/lattice option</li>
            <li>• Watch for radius marking issues (4m default if unmarked)</li>
            <li>• If panorama required, use Panorama mission to capture</li>
          </ul>
        </Section>

        <Section id="tower-guyed" title="Guyed Tower Capture">
          <ul className="space-y-2">
            <li>• Fly Scanlink mission - choose guyed wire option</li>
            <li>• Mark the wires as required</li>
            <li>• If instructed: fly additional manual vertical patterns while avoiding wires</li>
            <li>• Watch for radius marking issues (4m default if unmarked)</li>
            <li>• If panorama required, use Panorama mission to capture</li>
          </ul>
        </Section>

        <Section id="rooftop" title="Rooftop Capture (v9.7.0)">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-3">
            <p className="text-purple-200 font-semibold">✨ NEW: v9.7.0 Updates</p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• 2x faster flight speeds (reduced site time)</li>
              <li>• Simplified marking workflow</li>
              <li>• Single-layer planar overview at -45° gimbal</li>
              <li>• 1-second capture interval (vs 2-second previously)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-semibold text-white mb-2">Marking Workflow:</p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Boundary:</strong> Mark corners in order (clockwise or anti-clockwise), NOT zig-zag pattern</li>
                <li>• <strong>Equipment Radius:</strong> Mark radius of antenna only - offset added automatically</li>
                <li>• <strong>Planar Height:</strong> Auto-calculated (highest equipment/obstacle + 7m offset)</li>
                <li>• <strong>Multi-Level Sites:</strong> Mark equipment clusters at different elevations (high/low), with height/center/radius for each</li>
                <li>• <strong>Obstacles:</strong> Mark on-roof enveloped obstacles, non-enveloped obstacles, and neighboring buildings with proper boundaries and heights</li>
                <li>• <strong>Greenfields:</strong> CRITICAL - At least one obstacle or equipment MUST be marked to define rooftop geometry</li>
                <li>• <strong>Height Constraints:</strong> Maximum height difference between equipment = 25m (contact SiteSee Support if exceeded)</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-2">Flight Settings:</p>
              <ul className="space-y-1 ml-4">
                <li>• Enable "Heading and Gimbal Altitude", "Grid", and "Reticle" options for gimbal assist</li>
                <li>• <strong>Capture Interval:</strong> Keep at 1 second (change only after consulting SiteSee)</li>
                <li>• Monitor that antenna components stay in frame during planar (lower altitude than previous versions)</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-2">In-Flight:</p>
              <ul className="space-y-1 ml-4">
                <li>• Use in-flight controls to keep antenna/tower centered in frame</li>
                <li>• Use in-flight controls to avoid obstacles when necessary</li>
                <li>• <strong>WATCH OUT:</strong> Camera may glitch to "auto" mode during pano/orthomosaic - quickly switch back to "manual" WITHOUT pausing mission</li>
              </ul>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-200 text-sm">
                📚 <strong>Training Resources:</strong> See Training Videos page for v9.7.0 use case videos and PDF guides covering multi-level, complex obstacles, greenfields, and height constraints.
              </p>
            </div>
          </div>
        </Section>

        <Section id="postflight" title="Post-Flight Process">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-white mb-1">Additional Images:</p>
              <p>Ensure you take any additional images requested (closeups of antenna, stickers/labels, etc)</p>
            </div>

            <div>
              <p className="font-semibold text-white mb-1">GCP Upload (If Used):</p>
              <ul className="space-y-1 ml-4">
                <li>• Upload GCP via button press - light should start blinking</li>
                <li>• Ensure hotspot is on when button pressed</li>
                <li>• Username and password both set to 'propeller'</li>
                <li>• Verify with point of contact that all 5 GCPs uploaded</li>
                <li>• Process GCP data using Aeropoints portal</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-1">Data Validation:</p>
              <p>Perform data validation as per requirements</p>
            </div>

            <div>
              <p className="font-semibold text-white mb-1">Upload to SiteSee Portal:</p>
              <ul className="space-y-1 ml-4">
                <li>• Ensure correct files added to corresponding job</li>
                <li>• Remove any misc/unrelated images captured</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Training Resources Link */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6 text-center">
          <h3 className="font-bold text-white mb-2">Need More Guidance?</h3>
          <p className="text-sm text-slate-300 mb-4">
            Watch v9.7.0 training videos and download PDF guides for detailed use cases
          </p>
          <Link to={createPageUrl('TrainingVideos')}>
            <Button className="bg-blue-500 hover:bg-blue-600">
              View Training Videos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}