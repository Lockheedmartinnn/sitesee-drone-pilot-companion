import React, { useState, useCallback, useEffect } from 'react';
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
  Home,
  MapPin,
  Navigation,
  Wind,
  Clock,
  Info,
  Zap,
  Waves,
  Plane,
  Building2,
  TreePine
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ProgressBar';
import ChecklistItem from '@/components/ChecklistItem';
import Timer from '@/components/Timer';
import InfoCard from '@/components/InfoCard';
import PreMissionFocusCheck from '@/components/PreMissionFocusCheck';

import { cn } from '@/lib/utils';

// ─── Location Briefing helpers ───────────────────────────────────────────────

const AIRPORT_ZONES = [
  { name: 'Sydney Airport (Mascot)', lat: -33.9461, lon: 151.1772, radiusKm: 5.5 },
  { name: 'Bankstown Airport', lat: -33.9244, lon: 150.9883, radiusKm: 5.5 },
  { name: 'Camden Airport', lat: -34.0403, lon: 150.6872, radiusKm: 5.5 },
  { name: 'Richmond RAAF', lat: -33.6006, lon: 150.7811, radiusKm: 5.5 },
];
const WATER_ZONES = [
  { name: 'Sydney Harbour', lat: -33.8568, lon: 151.2153, radiusKm: 2.5 },
  { name: 'Parramatta River', lat: -33.8150, lon: 151.0200, radiusKm: 1.5 },
  { name: 'Botany Bay', lat: -33.9800, lon: 151.1900, radiusKm: 3.0 },
  { name: 'Pittwater', lat: -33.6300, lon: 151.3100, radiusKm: 2.0 },
  { name: 'Port Hacking', lat: -34.0700, lon: 151.1000, radiusKm: 2.0 },
];
const URBAN_CANYON_ZONES = [
  { name: 'Sydney CBD', lat: -33.8688, lon: 151.2093, radiusKm: 1.2 },
  { name: 'Parramatta CBD', lat: -33.8150, lon: 151.0050, radiusKm: 0.7 },
  { name: 'North Sydney CBD', lat: -33.8401, lon: 151.2092, radiusKm: 0.6 },
];
const HIGH_INTERFERENCE_ZONES = [
  { name: 'Westmead Hospital', lat: -33.8028, lon: 150.9872, radiusKm: 1.0 },
  { name: 'Royal Prince Alfred Hospital', lat: -33.8889, lon: 151.1869, radiusKm: 0.8 },
  { name: 'Central Station', lat: -33.8833, lon: 151.2063, radiusKm: 0.7 },
  { name: 'Macquarie Park', lat: -33.7757, lon: 151.1211, radiusKm: 1.2 },
  { name: 'UNSW Campus', lat: -33.9173, lon: 151.2313, radiusKm: 0.8 },
  { name: 'University of Sydney', lat: -33.8882, lon: 151.1873, radiusKm: 0.8 },
];

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function classifyEnvironment(lat, lon) {
  for (const z of AIRPORT_ZONES) if (haversineKm(lat, lon, z.lat, z.lon) <= z.radiusKm) return { type: 'AIRPORT', zone: z.name };
  for (const z of URBAN_CANYON_ZONES) if (haversineKm(lat, lon, z.lat, z.lon) <= z.radiusKm) return { type: 'URBAN_CANYON', zone: z.name };
  for (const z of HIGH_INTERFERENCE_ZONES) if (haversineKm(lat, lon, z.lat, z.lon) <= z.radiusKm) return { type: 'HIGH_INTERFERENCE', zone: z.name };
  for (const z of WATER_ZONES) if (haversineKm(lat, lon, z.lat, z.lon) <= z.radiusKm) return { type: 'HARBOUR', zone: z.name };
  return null;
}

const ENV_CONFIG = {
  AIRPORT:          { emoji: '✈️', label: 'Airport Proximity',           color: 'text-red-400',    bg: 'bg-red-500/10',     border: 'border-red-500/30',    keyRule: 'Confirm CASA authorisation FIRST. Do not assess weather or set up equipment until authorisation is confirmed.' },
  URBAN_CANYON:     { emoji: '🔴', label: 'Urban Canyon — CBD High-Rise',color: 'text-red-400',    bg: 'bg-red-500/10',     border: 'border-red-500/30',    keyRule: 'Higher launch point = better GPS. Rooftop or elevated carpark strongly preferred over street level.' },
  HIGH_INTERFERENCE:{ emoji: '🟠', label: 'High Interference Zone',      color: 'text-orange-400', bg: 'bg-orange-500/10',  border: 'border-orange-500/30', keyRule: 'If aircraft position drifts while stationary, wait 10 min. Return next morning before 08:00 if it does not settle.' },
  HARBOUR:          { emoji: '🔵', label: 'Harbour / Water Multipath',   color: 'text-blue-400',   bg: 'bg-blue-500/10',    border: 'border-blue-500/30',   keyRule: 'Position launch so open water is BEHIND the antenna. Direction at launch matters more here than anywhere else.' },
  MODERATE:         { emoji: '🟡', label: 'Moderate — Suburban/Light Commercial', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', keyRule: 'GPS works but can drift in the afternoon as satellite geometry degrades.' },
  LOW:              { emoji: '🟢', label: 'Low — Open Environment',      color: 'text-emerald-400',bg: 'bg-emerald-500/10', border: 'border-emerald-500/30',keyRule: 'Most straightforward site type. Focus on wind and light conditions rather than GPS.' },
};

const STATUS_STYLE = {
  optimal: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
  good:    'bg-blue-500/20 border-blue-500/30 text-blue-300',
  marginal:'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
  avoid:   'bg-red-500/20 border-red-500/30 text-red-300',
  dark:    'bg-slate-600/20 border-slate-500/30 text-slate-300',
};

const TOWER_STEPS = [
  "Equipment & Pre-Flight",
  "Camera Setup",
  "ScalePoint Placement",
  "GCP Placement",
  "GPS Stabilisation",
  "Mission Setup & Camera",
  "Panorama Setup",
  "Flight Execution",
  "Post-Flight QC"
];

const ROOFTOP_STEPS = [
  "Equipment & Pre-Flight",
  "Camera Setup",
  "ScalePoint Placement",
  "GCP Placement",
  "GPS Stabilisation",
  "Rooftop Mission Setup",
  "Panorama Setup",
  "Flight Execution",
  "Post-Flight QC"
];

const TOWER_CONFIGS = {
  1: {
    title: "Equipment & Pre-Flight Checklist",
    subtitle: "Complete before any flight activity",
    items: [
      { id: 'batteries', label: '3+ batteries fully charged', sublabel: '95-100% each + remote 95-100%', critical: true },
      { id: 'drone_inspection', label: 'Visual/physical inspection', sublabel: 'Drone, propeller, battery, motor' },
      { id: 'dji_status', label: 'DJI app status check', sublabel: 'Firmware, sensors, compass, GPS, HD transmission', critical: true },
      { id: 'recording', label: 'Screen recording ON', sublabel: 'From hover start to mission end', critical: true }
    ]
  },
  2: {
    title: "Camera Setup",
    subtitle: "Configure camera settings before flight",
    info: {
      title: "Required Camera Settings",
      message: "Please ensure you use the following camera settings:\n\n• Dewarping → On\n• Mechanical Shutter → On\n• Camera in Wide Mode\n• Zoom set to 1x\n• ISO - 100\n• F-stop - 4.0\n• Shutter Speed - Select appropriate speed (e.g., 1/1000 - 1/2000)\n• Exposure - Manual Mode\n• Camera - Manual Mode"
    },
    items: [
      { id: 'camera_dewarping', label: 'Dewarping ON', critical: true },
      { id: 'camera_mechanical_shutter', label: 'Mechanical Shutter ON', critical: true },
      { id: 'camera_wide_mode', label: 'Camera in Wide Mode', critical: true },
      { id: 'camera_zoom', label: 'Zoom set to 1x', critical: true },
      { id: 'camera_iso', label: 'ISO - 100', critical: true },
      { id: 'camera_fstop', label: 'F-stop - 4.0', critical: true },
      { id: 'camera_shutter_speed', label: 'Shutter Speed adjusted to suit', sublabel: 'e.g., 1/1000 - 1/2000', critical: true },
      { id: 'camera_exposure_manual', label: 'Exposure - Manual Mode', critical: true },
      { id: 'camera_manual_mode', label: 'Camera - Manual Mode', critical: true }
    ]
  },
  3: {
    title: "ScalePoint Placement",
    subtitle: "Critical for accurate measurements",
    info: {
      title: "Good Placement Requirements",
      message: "✓ Clearly in line of sight during mission\n✓ Not obstructed by fences, buildings, trees\n✓ On flat, even surface\n✓ Both April Tags fully visible (no grass/leaves covering)"
    },
    warning: {
      title: "Bad Placement to AVOID",
      message: "✗ Under trees or near tall structures\n✗ On elevated/angled surfaces\n✗ Too close to fences or shelters\n✗ April Tags partially covered by vegetation"
    },
    items: [
      { id: 'scalepoint_clear_view', label: 'ScalePoint in clear line of sight', sublabel: 'Visible from drone at all mission angles', critical: true },
      { id: 'scalepoint_flat', label: 'Placed on flat, even surface', sublabel: 'No angles, slopes, or obstructions' },
      { id: 'scalepoint_distance', label: 'ScalePoint positioned appropriately', sublabel: 'Typical range: 10-20m from tower base' },
      { id: 'april_tags_visible', label: 'Both April Tags fully visible', sublabel: 'No grass, leaves, or debris covering tags', critical: true }
    ]
  },
  4: {
    title: "GCP Placement",
    subtitle: "Ground Control Points for enhanced accuracy",
    info: {
      title: "What are GCPs?",
      message: "Ground Control Points (GCPs) are physical markers with known coordinates used to improve the accuracy of your 3D model and measurements.\n\nGCPs provide:\n• Improved positional accuracy\n• Better scale verification\n• Enhanced model georeferencing\n\nFor detailed guidance, see SiteSee's GCP User Guide."
    },
    warning: {
      title: "CRITICAL",
      message: "⚠️ DO NOT place GCPs in a straight line - they MUST be staggered\n\nMinimum 5 GCPs required • Distribute evenly around site • Place on flat surfaces • Record coordinates"
    },
    items: [
      { id: 'gcp_count', label: 'Minimum 5 GCPs placed', sublabel: 'Distributed around site perimeter', critical: true },
      { id: 'gcp_staggered', label: 'GCPs staggered (NOT in straight line)', sublabel: 'Required for triangulation', critical: true },
      { id: 'gcp_coordinates', label: 'GCP coordinates recorded', sublabel: 'Using GPS or survey equipment', critical: true },
      { id: 'gcp_flat', label: 'GCPs on flat, stable surfaces', sublabel: 'No uneven ground or vegetation' },
      { id: 'gcp_visible', label: 'GCPs visible from multiple angles', sublabel: 'No shadows or obstructions', critical: true }
    ]
  },
  5: {
    title: "GPS Stabilisation",
    subtitle: "Wait for stable satellite lock",
    info: {
      title: "Model-Specific Instructions",
      message: "GPS drift causes misaligned images and failures. Follow procedure for your drone model:\n\n• M3E (Mavic 3 Enterprise): Power on drone and stabilize on ground with propellers OFF for 5 min before takeoff\n• M2E (Mavic 2 Enterprise): Stabilize at hover for 5 min after takeoff"
    },
    warning: {
      title: "CRITICAL: Battery Change Protocol",
      message: "⚠️ SUBSEQUENT BATTERY CHANGES MUST BE DONE AT THE SAME TAKEOFF SPOT WHERE YOU COMPLETED YOUR INITIAL STABILISATION\n\nGPS Signal Requirements:\n• Must reach 26-32 satellites\n• If not reached after 5 minutes, do NOT fly - troubleshoot GPS issue first"
    }
  },
  6: {
    title: "Mission Setup & Camera",
    subtitle: "Configure mission parameters",
    items: [
      { id: 'tower_type', label: 'Tower type selected', sublabel: 'Correct type for this site' },
      { id: 'mission_name', label: 'Mission name entered', sublabel: 'Using Site ID' },
      { id: 'msa_set', label: 'MSA set (10-15m)', sublabel: 'Minimum Safe Altitude', critical: true },
      { id: 'rad_height', label: 'RAD height marked', sublabel: '0° gimbal - equipment level' },
      { id: 'tower_height', label: 'Tower height marked', sublabel: '0° gimbal' },
      { id: 'tower_center', label: 'Tower center marked', sublabel: '-90° gimbal', critical: true },
      { id: 'tower_edge', label: 'Tower edge marked', sublabel: '-90° gimbal (radius ~4.5m for SST)' },
      { id: 'obstacles_checked', label: 'Obstacles checked & marked', sublabel: 'All boundaries marked' },
      { id: 'obstacle_altitude', label: 'Obstacle altitudes set', sublabel: '+4m buffer from actual height' }
    ]
  },
  7: {
    title: "Panorama Setup",
    subtitle: "Configure panorama capture (if required)",
    info: {
      title: "Panorama Capture Guide",
      message: "This is a supplementary mission to the main tower capture.\n\nFollow these steps to set up a panorama capture at the tower location."
    },
    items: [
      { id: 'pano_mission_loaded', label: 'Panorama mission loaded in Dronelink', critical: true },
      { id: 'pano_position', label: 'Fly to 10m above Tower Height', sublabel: 'Position drone at center of tower', critical: true },
      { id: 'pano_point_marked', label: 'Panorama point(s) marked', sublabel: 'Mark location for panorama', critical: true },
      { id: 'pano_spherical_360', label: 'Pattern set to "Spherical 360"', sublabel: 'Standard panorama deliverable', critical: true },
      { id: 'pano_mission_named', label: 'Mission named with "Pano" suffix', sublabel: 'e.g., "Brisbane Site 001 Pano"' },
      { id: 'pano_monitor', label: 'Ready to fly panorama mission', sublabel: 'Monitor capture and obstacles' }
    ]
  },
  8: {
    title: "Flight Execution",
    subtitle: "Monitor during active mission",
    items: [
      { id: 'screen_recording_active', label: 'Screen recording confirmed', sublabel: 'Active throughout mission', critical: true },
      { id: 'no_exposure_changes', label: 'No camera changes mid-flight', sublabel: 'Settings locked as validated', critical: true }
    ],
    batterySwap: true,
    info: {
      title: "Battery Swap Protocol",
      message: "If battery swap needed:\n1. Land safely\n2. Install new battery\n3. Wait 5 min GPS stabilisation\n4. Verify GPS stability with Altitude Verifier\n5. Re-verify camera settings\n6. Re-center tower before resuming"
    }
  },
  9: {
    title: "Post-Flight QC",
    subtitle: "Quality check before leaving site",
    uploadGuideUrl: "https://learn.sitesee.io/hc/en-us/articles/360052096411-Uploading-Images",
    info: {
      title: "Image Quality Check (Before Uploading)",
      message: "✓ All images are JPEG with correct aspect ratio (largest pixels)\n✓ Consistent exposure across entire set (ISO, aperture, shutter speed must not vary)\n✓ Randomly check sharpness at 100% zoom for each mission component\n✓ Tower centred in frame — not cut off at edges\n✓ Shadow side not too dark; bright side not overexposed\n✓ If GCPs used: verify they are clearly visible in multiple images\n\n⚠ Do NOT skip this step — complete it BEFORE uploading files"
    },
    warning: {
      title: "Upload Rules",
      message: "• Use the SiteSee Uploader (web app on PC) — capture apps cannot upload\n• Add ALL images from panorama/ortho together — mixing order causes incorrect categorisation\n• Do NOT close browser, sleep PC, or disconnect internet during upload"
    },
    items: [
      { id: 'land_safe', label: 'Landed at safe location', sublabel: 'Preferably same as takeoff point' },
      { id: 'gps_variance_check', label: 'GPS variance verified', sublabel: 'Use GPS Altitude Verifier to check stability', critical: true },
      { id: 'drone_condition', label: 'Drone & battery condition checked', sublabel: 'No damage or issues' },
      { id: 'mission_complete', label: 'Mission completeness verified', sublabel: 'All planned captures done' },
      { id: 'image_quality_check', label: 'Image quality check completed', sublabel: 'Sharpness, exposure consistency & aspect ratio verified', critical: true },
      { id: 'data_transfer', label: 'Data transferred via SiteSee Uploader', sublabel: 'All photos uploaded — do not interrupt upload', critical: true }
    ]
  }
};

const ROOFTOP_CONFIGS = {
  1: {
    title: "Equipment & Pre-Flight Checklist",
    subtitle: "Complete before any flight activity",
    items: [
      { id: 'batteries', label: '3+ batteries fully charged', sublabel: '95-100% each + remote 95-100%', critical: true },
      { id: 'drone_inspection', label: 'Visual/physical inspection', sublabel: 'Drone, propeller, battery, motor' },
      { id: 'roof_access', label: 'Rooftop access confirmed', sublabel: 'Verify safe access', critical: true },
      { id: 'dji_status', label: 'DJI app status check', sublabel: 'Firmware, sensors, compass, GPS, HD transmission', critical: true },
      { id: 'obstacle_avoidance', label: 'Obstacle Avoidance ON', sublabel: 'Verify in DJI Go/Pilot app', critical: true },
      { id: 'recording', label: 'Screen recording ON', sublabel: 'From hover start to mission end', critical: true },
      { id: 'gimbal_assist', label: 'Gimbal assist settings enabled', sublabel: 'Turn on Heading/Gimbal Altitude, Grid, Reticle' }
    ]
  },
  2: {
    title: "Camera Setup",
    subtitle: "Configure camera settings before flight",
    info: {
      title: "Required Camera Settings",
      message: "Please ensure you use the following camera settings:\n\n• Dewarping → On\n• Mechanical Shutter → On\n• Camera in Wide Mode\n• Zoom set to 1x\n• ISO - 100\n• F-stop - 4.0\n• Shutter Speed - Select appropriate speed (e.g., 1/1000 - 1/2000)\n• Exposure - Manual Mode\n• Camera - Manual Mode"
    },
    items: [
      { id: 'camera_dewarping', label: 'Dewarping ON', critical: true },
      { id: 'camera_mechanical_shutter', label: 'Mechanical Shutter ON', critical: true },
      { id: 'camera_wide_mode', label: 'Camera in Wide Mode', critical: true },
      { id: 'camera_zoom', label: 'Zoom set to 1x', critical: true },
      { id: 'camera_iso', label: 'ISO - 100', critical: true },
      { id: 'camera_fstop', label: 'F-stop - 4.0', critical: true },
      { id: 'camera_shutter_speed', label: 'Shutter Speed adjusted to suit', sublabel: 'e.g., 1/1000 - 1/2000', critical: true },
      { id: 'camera_exposure_manual', label: 'Exposure - Manual Mode', critical: true },
      { id: 'camera_manual_mode', label: 'Camera - Manual Mode', critical: true }
    ]
  },
  3: {
    title: "ScalePoint Placement",
    subtitle: "Critical for accurate measurements",
    info: {
      title: "Good Placement Requirements",
      message: "✓ Clearly in line of sight during mission\n✓ Not obstructed by fences, buildings, trees\n✓ On flat, even surface\n✓ Both April Tags fully visible (no grass/leaves covering)"
    },
    warning: {
      title: "Bad Placement to AVOID",
      message: "✗ Under trees or near tall structures\n✗ On elevated/angled surfaces\n✗ Too close to fences or shelters\n✗ April Tags partially covered by vegetation"
    },
    items: [
      { id: 'scalepoint_clear_view', label: 'ScalePoint in clear line of sight', sublabel: 'Visible from drone at all mission angles', critical: true },
      { id: 'scalepoint_flat', label: 'Placed on flat, even surface', sublabel: 'No angles, slopes, or obstructions' },
      { id: 'scalepoint_distance', label: 'ScalePoint positioned appropriately', sublabel: 'Typical range: 10-20m from tower base' },
      { id: 'april_tags_visible', label: 'Both April Tags fully visible', sublabel: 'No grass, leaves, or debris covering tags', critical: true }
    ]
  },
  4: {
    title: "GCP Placement",
    subtitle: "Ground Control Points for enhanced accuracy",
    info: {
      title: "What are GCPs?",
      message: "Ground Control Points (GCPs) are physical markers with known coordinates used to improve the accuracy of your 3D model and measurements.\n\nGCPs provide:\n• Improved positional accuracy\n• Better scale verification\n• Enhanced model georeferencing\n\nFor detailed guidance, see SiteSee's GCP User Guide."
    },
    warning: {
      title: "CRITICAL",
      message: "⚠️ DO NOT place GCPs in a straight line - they MUST be staggered\n\nMinimum 5 GCPs required • Distribute evenly around site • Place on flat surfaces • Record coordinates"
    },
    items: [
      { id: 'gcp_count', label: 'Minimum 5 GCPs placed', sublabel: 'Distributed around site perimeter', critical: true },
      { id: 'gcp_staggered', label: 'GCPs staggered (NOT in straight line)', sublabel: 'Required for triangulation', critical: true },
      { id: 'gcp_coordinates', label: 'GCP coordinates recorded', sublabel: 'Using GPS or survey equipment', critical: true },
      { id: 'gcp_flat', label: 'GCPs on flat, stable surfaces', sublabel: 'No uneven ground or vegetation' },
      { id: 'gcp_visible', label: 'GCPs visible from multiple angles', sublabel: 'No shadows or obstructions', critical: true }
    ]
  },
  5: {
    title: "GPS Stabilisation",
    subtitle: "Wait for stable satellite lock",
    info: {
      title: "Model-Specific Instructions",
      message: "GPS drift causes misaligned images and failures. Follow procedure for your drone model:\n\n• M3E (Mavic 3 Enterprise): Power on drone and stabilize on ground with propellers OFF before takeoff\n• M2E (Mavic 2 Enterprise): Stabilize at hover after takeoff"
    },
    warning: {
      title: "CRITICAL: Battery Change Protocol",
      message: "⚠️ SUBSEQUENT BATTERY CHANGES MUST BE DONE AT THE SAME TAKEOFF SPOT WHERE YOU COMPLETED YOUR INITIAL STABILISATION\n\nGPS Signal Requirements:\n• Must reach 26-32 satellites\n• If not reached after stabilization, do NOT fly - troubleshoot GPS issue first"
    }
  },
  6: {
    title: "Rooftop Mission Setup & Camera",
    subtitle: "Configure mission parameters (V9.8.0 mission)",
    info: {
      title: "V9.8.0 Mission Changes",
      message: "✓ Planar height is AUTO-CALCULATED (highest equipment/obstacle + 11m)\n✓ No need to manually set MSA\n✓ Mark boundary clockwise OR anti-clockwise\n✓ Planar boundary now extends uniformly across all shapes\n✓ Orthomosaic marking has built-in validation — an error will be thrown if marked too low"
    },
    items: [
      { id: 'shutter_adjusted', label: 'Shutter speed adjusted for roof', sublabel: 'e.g., 1/2000 → 1/1500 for reflection', critical: true },
      { id: 'mission_name', label: 'Mission name entered', sublabel: 'Using Site ID + date' },
      { id: 'boundary_marked', label: 'Planar boundary marked in order', sublabel: 'Clockwise OR anti-clockwise, corners in sequence (not zig-zag)', critical: true },
      { id: 'antenna_components_monitored', label: 'Monitor antenna components in frame', sublabel: 'Planar is lower - ensure equipment visible' },
      { id: 'equipment_marked', label: 'Equipment/antenna locations marked', sublabel: 'Mark radius of antenna (no offset needed)', critical: true },
      { id: 'obstacles_marked', label: 'Obstacles marked if present', sublabel: 'Buildings, obstructions with buffer' },
      { id: 'antenna_interval', label: 'Antenna component interval: 1 second', sublabel: 'Keep interval mode at 1s', critical: true },
      { id: 'same_takeoff', label: 'Takeoff location noted', sublabel: 'Must use SAME spot for battery swaps', critical: true }
    ],
    warning: {
      title: "IMPORTANT: V9.8.0 Updates",
      message: "⚠ Planar height AUTO-CALCULATED\n⚠ Planar boundary extends uniformly (all shapes)\n⚠ Mark boundary in order (clockwise OR anti-clockwise)\n⚠ Antenna radius: NO manual offset needed\n⚠ Ortho component: Set ~30m above rooftop height — mark too low and the app will throw an error\n⚠ Monitor camera settings during pano/ortho (may switch to auto)"
    }
  },
  7: { // This is the new Panorama Setup for Rooftop
    title: "Panorama Setup",
    subtitle: "Configure panorama capture (if required)",
    info: {
      title: "Rooftop Panorama Guide",
      message: "For rooftop panoramas:\n• Mark Panorama Height with gimbal at 0° (~20m above roof)\n• Mark Panorama Center with gimbal at -90° (directly above location)\n• Auto-capture will execute during mission"
    },
    items: [
      { id: 'pano_height_marked', label: 'Panorama Height marked', sublabel: 'Gimbal 0° (~20m above roof)', critical: true },
      { id: 'pano_center_marked', label: 'Panorama Center marked', sublabel: 'Gimbal -90° (directly above location)', critical: true },
      { id: 'pano_auto_capture', label: 'Auto-capture confirmed', sublabel: 'Will execute during mission' }
    ]
  },
  8: { // This is the re-indexed Flight Execution for Rooftop
    title: "Flight Execution",
    subtitle: "Monitor during active mission",
    items: [
      { id: 'screen_recording_active', label: 'Screen recording confirmed', sublabel: 'Active throughout mission', critical: true },
      { id: 'no_exposure_changes', label: 'No camera changes mid-flight', sublabel: 'Settings locked as validated', critical: true }
    ],
    batterySwap: true,
    info: {
      title: "Battery Swap Protocol - CRITICAL",
      message: "1. Land at EXACT SAME LOCATION as initial takeoff\n2. Install new battery\n3. Wait 5 min GPS stabilization\n4. Verify GPS stability with Altitude Verifier\n5. Re-verify camera settings\n6. Takeoff from same spot - cannot recenter mission"
    }
  },
  9: { // This is the re-indexed Post-Flight QC for Rooftop
    title: "Post-Flight QC",
    subtitle: "Quality check before leaving site",
    uploadGuideUrl: "https://learn.sitesee.io/hc/en-us/articles/360052096411-Uploading-Images",
    info: {
      title: "Image Quality Check (Before Uploading)",
      message: "✓ All images are JPEG with correct aspect ratio (largest pixels)\n✓ Consistent exposure across entire set (ISO, aperture, shutter speed must not vary)\n✓ Randomly check sharpness at 100% zoom for each mission component\n✓ Equipment/antennas adequately in frame\n✓ Shadow side not too dark; bright side not overexposed\n✓ If GCPs used: verify they are clearly visible in multiple images\n\n⚠ Do NOT skip this step — complete it BEFORE uploading files"
    },
    warning: {
      title: "Upload Rules",
      message: "• Use the SiteSee Uploader (web app on PC) — capture apps cannot upload\n• Add ALL images from panorama/ortho together — mixing order causes incorrect categorisation\n• Do NOT close browser, sleep PC, or disconnect internet during upload"
    },
    items: [
      { id: 'land_safe', label: 'Landed at safe location', sublabel: 'Same as takeoff point' },
      { id: 'gps_variance_check', label: 'GPS variance verified', sublabel: 'Use GPS Altitude Verifier to check stability', critical: true },
      { id: 'drone_condition', label: 'Drone & battery condition checked', sublabel: 'No damage or issues' },
      { id: 'mission_complete', label: 'Mission completeness verified', sublabel: 'All components: Roof, Equipment, Pano, Ortho' },
      { id: 'image_quality_check', label: 'Image quality check completed', sublabel: 'Sharpness, exposure consistency & aspect ratio verified', critical: true },
      { id: 'data_transfer', label: 'Data transferred via SiteSee Uploader', sublabel: 'All photos uploaded — do not interrupt upload', critical: true }
    ]
  }
};

export default function StartCapture() {
  // Phase: 'siteType' → 'briefing' → checklist steps
  const [phase, setPhase] = useState('siteType');

  // --- Briefing state ---
  const [briefingLocation, setBriefingLocation] = useState(null);
  const [briefingLocationError, setBriefingLocationError] = useState(null);
  const [briefingWeather, setBriefingWeather] = useState(null);
  const [briefingWeatherLoading, setBriefingWeatherLoading] = useState(false);
  const [briefingGenerated, setBriefingGenerated] = useState(false);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingResult, setBriefingResult] = useState(null);

  // Auto-fetch location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setBriefingLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => setBriefingLocationError(err.message)
      );
    } else {
      setBriefingLocationError('Geolocation not supported');
    }
  }, []);

  // Auto-fetch weather once we have location
  useEffect(() => {
    if (!briefingLocation) return;
    setBriefingWeatherLoading(true);
    const { lat, lon } = briefingLocation;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_gusts_10m,weather_code&hourly=wind_speed_10m&forecast_days=1`)
      .then(r => r.json())
      .then(data => {
        setBriefingWeather({
          temp: data.current?.temperature_2m,
          wind: data.current?.wind_speed_10m,
          gusts: data.current?.wind_gusts_10m,
          code: data.current?.weather_code,
        });
      })
      .catch(() => {})
      .finally(() => setBriefingWeatherLoading(false));
  }, [briefingLocation]);

  const generateBriefing = () => {
    if (!briefingLocation) return;
    setBriefingLoading(true);
    const now = new Date();
    const hour = now.getHours();
    const envMatch = classifyEnvironment(briefingLocation.lat, briefingLocation.lon);
    const envType = envMatch?.type || (hour >= 5 && hour < 10 ? 'LOW' : hour >= 10 && hour < 14 ? 'MODERATE' : hour >= 14 && hour < 19 ? 'MODERATE' : 'LOW');
    const env = ENV_CONFIG[envType] || ENV_CONFIG.LOW;
    const wind = briefingWeather?.wind ?? null;
    const gusts = briefingWeather?.gusts ?? null;

    // Time windows
    const timeWindows = [
      { label: '05:00 – 09:00', status: 'optimal', note: 'Low wind, high satellite density, optimal light' },
      { label: '09:00 – 11:00', status: 'good', note: 'Good conditions, slight wind increase' },
      { label: '11:00 – 15:00', status: 'marginal', note: 'Increasing thermals, potential GPS drift' },
      { label: '15:00 – 18:00', status: 'marginal', note: 'Afternoon wind, satellite geometry degrades' },
      { label: '18:00+', status: 'dark', note: 'Low light, not recommended' },
    ];

    // GPS risk
    const gpsRisk = envType === 'AIRPORT' ? 'HIGH' : envType === 'URBAN_CANYON' ? 'HIGH' : envType === 'HIGH_INTERFERENCE' ? 'MEDIUM-HIGH' : envType === 'HARBOUR' ? 'MEDIUM' : 'LOW';
    const windWarning = gusts != null && gusts > 40 ? '⛔ Gusts exceed safe limit (40 km/h). DO NOT FLY.' : wind != null && wind > 30 ? '⚠️ Wind approaching limit. Monitor closely.' : wind != null && wind > 20 ? '✅ Wind acceptable. Watch for gusts.' : '✅ Wind conditions favourable.';
    const currentWindow = timeWindows.find((_, i) => {
      const starts = [5, 9, 11, 15, 18];
      return hour >= starts[i] && hour < (starts[i + 1] ?? 24);
    }) || timeWindows[timeWindows.length - 1];

    setBriefingResult({ env, envType, envZone: envMatch?.zone, gpsRisk, windWarning, timeWindows, currentWindow, wind, gusts, hour });
    setBriefingLoading(false);
    setBriefingGenerated(true);
  };

  const siteTypeSelectionPhase = phase === 'siteType';

  const [siteType, setSiteType] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});
  const [gpsTimerComplete, setGpsTimerComplete] = useState(false);
  const [satelliteCheckPassed, setSatelliteCheckPassed] = useState(null);
  const [gpsTimerMinutes, setGpsTimerMinutes] = useState(5);
  const [timerKey, setTimerKey] = useState(0);
  const [finalDecision, setFinalDecision] = useState(null);
  const [showPostMissionForm, setShowPostMissionForm] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);
  const [pilotId, setPilotId] = useState('');
  const [jobId, setJobId] = useState('');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [batterySwapMode, setBatterySwapMode] = useState(false);
  const [batterySwapChecks, setBatterySwapChecks] = useState({});
  const [batterySwapGpsComplete, setBatterySwapGpsComplete] = useState(false);
  const [usingScalePoint, setUsingScalePoint] = useState(null);
  const [usingGCP, setUsingGCP] = useState(null);
  const [needsBatteryChange, setNeedsBatteryChange] = useState(null);
  const [initialSetupComplete, setInitialSetupComplete] = useState(false);
  const [needsPanorama, setNeedsPanorama] = useState(null);
  const [needsOrtho, setNeedsOrtho] = useState(null);
  const [showFocusCheck, setShowFocusCheck] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });
  
  // Set GPS timer duration based on company
  // Pilot Group 1 = 5 min, everyone else (including no company) = 2 min
  useEffect(() => {
    const companyName = user?.company?.trim();
    console.log('Setting GPS timer - User company:', user?.company, 'Normalized:', companyName, 'Timer will be:', companyName === 'Pilot Group 1' ? 5 : 2, 'minutes');
    if (companyName === 'Pilot Group 1') {
      setGpsTimerMinutes(5);
    } else {
      setGpsTimerMinutes(2);
    }
  }, [user]);
  
  useEffect(() => {
    if (user?.email && !pilotId) {
      setPilotId(user.email);
    }
  }, [user, pilotId]);

  // Reuse briefing location for checklist location tracking
  useEffect(() => {
    if (briefingLocation) {
      setLocation({ latitude: briefingLocation.lat, longitude: briefingLocation.lon });
    }
  }, [briefingLocation]);
  
  const STEPS = siteType === 'rooftop' ? ROOFTOP_STEPS : TOWER_STEPS;
  const STEP_CONFIGS = siteType === 'rooftop' ? ROOFTOP_CONFIGS : TOWER_CONFIGS;
  const config = STEP_CONFIGS[currentStep];
  
  const logActivity = useCallback(async (actionType, itemId, itemLabel, newState) => {
    try {
      await base44.entities.ChecklistActivity.create({
        pilot_id: user?.pilot_id || pilotId,
        pilot_email: user?.email || pilotId,
        company: user?.company || null,
        site_type: siteType,
        step_number: currentStep,
        step_name: STEPS[currentStep - 1],
        action_type: actionType,
        item_id: itemId,
        item_label: itemLabel,
        new_state: newState,
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
        session_id: sessionId
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }, [user, pilotId, siteType, currentStep, location, sessionId, STEPS]);

  const toggleItem = useCallback((id) => {
    setCheckedItems(prev => {
      const newState = !prev[id];
      const item = config?.items?.find(i => i.id === id);
      logActivity('checkbox_toggle', id, item?.label || id, newState ? 'checked' : 'unchecked');
      return {
        ...prev,
        [id]: newState
      };
    });
  }, [config, logActivity]);
  
  const allItemsChecked = config?.items?.every(item => checkedItems[item.id]) ?? true;
  const totalSteps = 9;
  const isAdmin = user?.role === 'admin' || user?.email === 'Steve.ryan@sitesee.com.au';
  
  // Step 3 can proceed if: no scale point selected OR all items checked
  const step3CanProceed = isAdmin || usingScalePoint === false || (usingScalePoint === true && allItemsChecked);
  // Step 4 can proceed if: no GCP selected OR all items checked
  const step4CanProceed = isAdmin || usingGCP === false || (usingGCP === true && allItemsChecked);
  // Step 6 can proceed if: both ortho and panorama answered, and ortho height checked if ortho=yes
  const step6CanProceed = isAdmin || (allItemsChecked && needsOrtho !== null && needsPanorama !== null && (needsOrtho === false || checkedItems['ortho_height_check']));
  // Step 7 (panorama) can proceed if: no panorama OR all items checked
  const step7CanProceed = isAdmin || needsPanorama === false || (needsPanorama === true && allItemsChecked);
  // Step 8 can proceed if: battery change answered NO and all items checked
  const step8CanProceed = isAdmin || (needsBatteryChange === false && allItemsChecked);
  // Step 5 can proceed if: timer complete AND satellite check passed
  const step5CanProceed = isAdmin || (gpsTimerComplete && satelliteCheckPassed === true);
  const canProceed = isAdmin || (currentStep === 3 ? step3CanProceed : (currentStep === 4 ? step4CanProceed : (currentStep === 5 ? step5CanProceed : (currentStep === 6 && siteType === 'rooftop' ? step6CanProceed : (currentStep === 7 ? step7CanProceed : (currentStep === 8 ? step8CanProceed : allItemsChecked))))));
  
  const nextStep = () => {
    // Intercept after step 2 (Camera Setup) to show focus check
    if (currentStep === 2 && !showFocusCheck) {
      setShowFocusCheck(true);
      return;
    }

    // Log step navigation and step completion time
    const nextStepNum = currentStep === 6 && needsPanorama === false ? 8 : (currentStep === 5 && initialSetupComplete && satelliteCheckPassed === true ? 8 : currentStep + 1);
    logActivity('step_navigation', `step_${currentStep}_to_${nextStepNum}`, `Navigated from ${STEPS[currentStep - 1]} to ${STEPS[nextStepNum - 1]}`, 'next');
    
    // Mark initial setup complete after step 7 (before flight execution)
    if (currentStep === 7) {
      setInitialSetupComplete(true);
    }
    
    // Special navigation logic
    if (currentStep === 6) {
      // After mission setup, ask about panorama or skip to step 7
      if (needsPanorama === null) {
        // Ask the question first
        return;
      } else if (needsPanorama === false) {
        // Skip panorama step, go to flight execution (step 8)
        setCurrentStep(8);
      } else {
        // Go to panorama step (step 7)
        setCurrentStep(7);
      }
    } else if (currentStep === 5 && initialSetupComplete && satelliteCheckPassed === true) {
      // Battery swap GPS - skip to flight execution (step 8)
      setCurrentStep(8);
      setNeedsBatteryChange(null);
    } else if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const previousStep = () => {
    if (currentStep > 1) {
      logActivity('step_navigation', `step_${currentStep}_to_${currentStep - 1}`, `Navigated back from ${STEPS[currentStep - 1]} to ${STEPS[currentStep - 2]}`, 'back');
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const goToHome = () => {
    window.location.href = createPageUrl('Home');
  };
  
  const handleDecision = (decision) => {
    setFinalDecision(decision);
    setShowPostMissionForm(true);
    // Log the final decision
    logActivity('yes_no_decision', 'final_pass_decision', 'Based on your QC checks, would you leave the site confident this capture will pass?', decision);
  };
  
  const handlePostMissionSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use stored location or get fresh one
      let coords = location;
      if (!coords) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      }

      await base44.entities.LocalMissionLog.create({
        pilot_id: user?.pilot_id || pilotId,
        company: user?.company || null,
        completion_timestamp: new Date().toISOString(),
        job_id: jobId || null,
        checklist_completed: true,
        notes: `${siteType === 'rooftop' ? 'Rooftop' : 'Tower'} capture - ${finalDecision === 'yes' ? 'Pass' : 'Rework'}`,
        latitude: coords?.latitude || null,
        longitude: coords?.longitude || null
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

  // const startBatterySwap = () => { // This function is not used
  //   setBatterySwapMode(true);
  //   setBatterySwapChecks({});
  //   setBatterySwapGpsComplete(false);
  // };

  const completeBatterySwap = () => {
    setBatterySwapMode(false);
    setBatterySwapChecks({});
    setBatterySwapGpsComplete(false);
  };

  const batterySwapItems = [
    { id: 'landed_safe', label: 'Landed at safe location', critical: true },
    { id: 'new_battery', label: 'New battery installed', critical: true },
    { id: 'gps_verified', label: 'GPS Altitude Verifier used', sublabel: 'Altitude shift verified OK', critical: true },
    { id: 'camera_settings', label: 'Camera settings re-verified', critical: true },
    ...(siteType === 'tower' 
      ? [{ id: 'tower_recentered', label: 'Tower re-centered', critical: true }]
      : [{ id: 'same_takeoff', label: 'Ready at SAME takeoff location', critical: true }]
    )
  ];

  const allBatterySwapChecked = batterySwapItems.every(item => batterySwapChecks[item.id]) && batterySwapGpsComplete;

  // ── Phase: Location Briefing ──────────────────────────────────────────────
  if (phase === 'briefing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex items-center justify-center p-5">
        <div className="max-w-lg w-full space-y-5">
          {/* Header */}
          <div className="text-center">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6941e5b42ede03ae0cffdd74/bcd43d370_image.png" alt="SiteSee" className="h-8 mx-auto mb-4" />
            <div className="inline-flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-400 mb-3">
              {siteType === 'rooftop' ? '🏠 Rooftop Capture' : '📡 Tower Capture'}
            </div>
            <h1 className="text-2xl font-bold mb-1">Location Briefing</h1>
            <p className="text-slate-400 text-sm">Pre-flight environment assessment</p>
          </div>

          {/* Location status */}
          {!briefingLocation && !briefingLocationError && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 text-center">
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-blue-300 font-medium">Getting your location…</p>
            </div>
          )}
          {briefingLocationError && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-sm text-amber-300 font-medium">Location unavailable</p>
              <p className="text-xs text-amber-300/70 mb-3">Enable location in browser settings for a full briefing</p>
              <Button onClick={() => setPhase('checklist')} className="bg-slate-700 hover:bg-slate-600 text-sm">
                Skip Briefing & Continue
              </Button>
            </div>
          )}

          {briefingLocation && !briefingGenerated && (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-emerald-300 font-medium">Location acquired</p>
                  <p className="text-xs text-emerald-300/70">{briefingLocation.lat.toFixed(4)}, {briefingLocation.lon.toFixed(4)}</p>
                </div>
                {briefingWeatherLoading && <div className="ml-auto w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />}
                {briefingWeather && !briefingWeatherLoading && (
                  <div className="ml-auto text-right">
                    <p className="text-xs text-slate-300">{briefingWeather.wind != null ? `${briefingWeather.wind} km/h` : '—'}</p>
                    <p className="text-xs text-slate-500">wind</p>
                  </div>
                )}
              </div>
              <Button onClick={generateBriefing} disabled={briefingLoading} className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-base font-semibold">
                <Navigation className="w-4 h-4 mr-2" />
                Generate Location Briefing
              </Button>
              <button onClick={() => setPhase('checklist')} className="w-full text-center text-sm text-slate-500 hover:text-slate-400 py-1">
                Skip and proceed to capture →
              </button>
            </div>
          )}

          {/* Briefing Card */}
          {briefingGenerated && briefingResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Environment type */}
              <div className={`border rounded-2xl p-4 ${briefingResult.env.bg} ${briefingResult.env.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{briefingResult.env.emoji}</span>
                  <span className={`font-bold text-base ${briefingResult.env.color}`}>{briefingResult.env.label}</span>
                </div>
                {briefingResult.envZone && <p className="text-xs text-slate-400 mb-2">Detected zone: {briefingResult.envZone}</p>}
                <p className="text-sm text-slate-300">{briefingResult.env.keyRule}</p>
              </div>

              {/* Weather + GPS risk row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Wind className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400 font-medium">Wind</span>
                  </div>
                  <p className="text-lg font-bold text-white">{briefingResult.wind != null ? `${briefingResult.wind}` : '—'}<span className="text-xs font-normal text-slate-400 ml-1">km/h</span></p>
                  {briefingResult.gusts != null && <p className="text-xs text-slate-500">Gusts {briefingResult.gusts} km/h</p>}
                </div>
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Satellite className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400 font-medium">GPS Risk</span>
                  </div>
                  <p className={`text-base font-bold ${briefingResult.gpsRisk === 'LOW' ? 'text-emerald-400' : briefingResult.gpsRisk === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'}`}>{briefingResult.gpsRisk}</p>
                </div>
              </div>

              {/* Wind warning */}
              <div className={`rounded-xl p-3 border text-sm ${briefingResult.windWarning.startsWith('⛔') ? 'bg-red-500/10 border-red-500/30 text-red-300' : briefingResult.windWarning.startsWith('⚠️') ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'}`}>
                {briefingResult.windWarning}
              </div>

              {/* Time windows */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-300">Recommended Flight Windows</span>
                </div>
                <div className="space-y-2">
                  {briefingResult.timeWindows.map((w, i) => (
                    <div key={i} className={`flex items-center justify-between rounded-lg px-3 py-2 border text-xs ${w === briefingResult.currentWindow ? STATUS_STYLE[w.status] + ' ring-1 ring-current' : STATUS_STYLE[w.status]}`}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{w.label}</span>
                        {w === briefingResult.currentWindow && <span className="text-[10px] font-bold uppercase opacity-80">NOW</span>}
                      </div>
                      <span className="opacity-80 ml-2 text-right max-w-[140px]">{w.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Button onClick={() => setPhase('checklist')} className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-base font-semibold">
                Briefing Acknowledged — Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }



  // Site Type Selection
  if (phase === 'siteType') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex items-center justify-center p-5">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6941e5b42ede03ae0cffdd74/bcd43d370_image.png"
              alt="SiteSee"
              className="h-8 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold mb-2">Select Site Type</h1>
            <p className="text-slate-400">Choose the type of capture you'll be performing</p>
          </div>
          
          {/* Location Permission Alert */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            {!location && !locationError && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 text-center">
                <MapPin className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-blue-300 font-medium mb-1">Location Access Required</p>
                <p className="text-xs text-blue-300/70">Please enable location when prompted</p>
              </div>
            )}
            {location && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-emerald-300 font-medium">Location Enabled</p>
                <p className="text-xs text-emerald-300/70">Ready to start capture</p>
              </div>
            )}
            {locationError && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center">
                <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-sm text-amber-300 font-medium">Location Unavailable</p>
                <p className="text-xs text-amber-300/70">Enable in browser settings to continue</p>
              </div>
            )}
          </motion.div>
          
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSiteType('tower'); setPhase('briefing'); }}
               className="w-full bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 rounded-2xl p-6 text-left transition-colors"
            >
              <div className="flex items-start gap-4">
                <Mountain className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Tower Capture</h3>
                  <p className="text-sm text-slate-400">Standard cell tower with ground-level operations. ScalePoint placement on ground.</p>
                </div>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSiteType('rooftop'); setPhase('briefing'); }}
               className="w-full bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 rounded-2xl p-6 text-left transition-colors"
            >
              <div className="flex items-start gap-4">
                <Home className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Rooftop Capture</h3>
                  <p className="text-sm text-slate-400">Rooftop antenna installations. Requires pilot/spotter on roof during capture.</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Rooftop access required</span>
                  </div>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  if (showFocusCheck) {
    return <PreMissionFocusCheck onProceed={() => { setShowFocusCheck(false); setCurrentStep(3); }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-lg mx-auto px-5 py-6 pb-32">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToHome}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6941e5b42ede03ae0cffdd74/bcd43d370_image.png"
              alt="SiteSee"
              className="h-6"
            />
          </div>
          <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            {siteType === 'rooftop' ? 'Rooftop' : 'Tower'}
          </div>
        </div>
        
        {/* Progress */}
        <div className="mb-8">
          <ProgressBar current={currentStep} total={totalSteps} labels={STEPS} />
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
            
            {/* Battery Swap Mode */}
            {batterySwapMode && currentStep === 8 && ( /* Changed currentStep from 7 to 8 */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <InfoCard variant="warning" title="Battery Swap In Progress">
                  <p>Complete all checks before resuming flight</p>
                </InfoCard>

                <Timer 
                  targetMinutes={user?.company?.trim() === 'Pilot Group 1' ? 5 : 2}
                  onStart={() => {
                    logActivity('timer_start', 'gps_stabilisation_battery_swap', 'GPS Stabilisation Timer (Battery Swap)', 'started');
                  }}
                  onComplete={() => {
                    setBatterySwapGpsComplete(true);
                    logActivity('timer_complete', 'gps_stabilisation_battery_swap', 'GPS Stabilisation Timer (Battery Swap)', 'completed');
                  }}
                  label={`GPS Stabilisation (${user?.company?.trim() === 'Pilot Group 1' ? 5 : 2} min)`}
                />

                <Link to={createPageUrl('GPSVerifier')} target="_blank">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    <Satellite className="w-4 h-4 mr-2" />
                    Open GPS Altitude Verifier
                  </Button>
                </Link>

                <div className="space-y-3 mt-4">
                  {batterySwapItems.map(item => (
                    <ChecklistItem
                      key={item.id}
                      label={item.label}
                      sublabel={item.sublabel}
                      checked={batterySwapChecks[item.id]}
                      critical={item.critical}
                      onToggle={() => setBatterySwapChecks(prev => ({
                        ...prev,
                        [item.id]: !prev[item.id]
                      }))}
                    />
                  ))}
                </div>

                {allBatterySwapChecked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex gap-3"
                  >
                    <Button
                      onClick={completeBatterySwap}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Resume Flight
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 5: GPS Timer */}
            {currentStep === 5 && !batterySwapMode && (
              <div className="space-y-4">
                {config.warning && (
                  <InfoCard variant="warning" title={config.warning.title}>
                    <p className="whitespace-pre-line">{config.warning.message}</p>
                  </InfoCard>
                )}

                <Timer 
                  key={timerKey}
                  targetMinutes={gpsTimerMinutes}
                  onStart={() => {
                    logActivity('timer_start', 'gps_stabilisation', 'GPS Stabilisation Timer', 'started');
                  }}
                  onComplete={() => {
                    setGpsTimerComplete(true);
                    logActivity('timer_complete', 'gps_stabilisation', 'GPS Stabilisation Timer', 'completed');
                  }}
                  onSkip={() => {
                    logActivity('timer_complete', 'gps_stabilisation', 'GPS Stabilisation Timer', 'skipped_by_admin');
                  }}
                  label={`GPS Stabilisation Timer (${gpsTimerMinutes} min)${user?.company?.trim() === 'Pilot Group 1' ? ' [Pilot Group 1]' : ''}`}
                  isAdmin={user?.email === 'Steve.ryan@sitesee.io' || user?.email === 'Yatesh.pawar@sitesee.com.au'}
                />
                
                {/* Satellite Check Question (after timer completes) */}
                {gpsTimerComplete && satelliteCheckPassed === null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <InfoCard variant="info" title="Satellite Count Check">
                      <p className="mb-4">Did you reach 26-32 satellites?</p>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            setSatelliteCheckPassed(true);
                            logActivity('yes_no_decision', 'satellite_count', 'Did you reach 26-32 satellites?', 'yes');
                          }}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Yes
                        </Button>
                        <Button
                          onClick={() => {
                            setGpsTimerComplete(false);
                            setSatelliteCheckPassed(null);
                            setGpsTimerMinutes(user?.company?.trim() === 'Pilot Group 1' ? 5 : 2);
                            setTimerKey(prev => prev + 1);
                            logActivity('yes_no_decision', 'satellite_count', 'Did you reach 26-32 satellites?', 'no');
                          }}
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
                
                {satelliteCheckPassed === true && (
                  <InfoCard variant="success" title="GPS Ready">
                    <p>Satellite count confirmed. GPS is stable. Proceed to next step.</p>
                  </InfoCard>
                )}
                
                {config.info && (
                  <InfoCard variant="info" title={config.info.title}>
                    <p className="whitespace-pre-line">{config.info.message}</p>
                    {config.batterySwap && (
                      <Link to={createPageUrl('GPSVerifier')}>
                        <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600">
                          <Satellite className="w-4 h-4 mr-2" />
                          Open GPS Altitude Verifier
                        </Button>
                      </Link>
                    )}
                  </InfoCard>
                )}
              </div>
            )}
            
            {/* Final Step: Final Decision */}
            {currentStep === totalSteps && finalDecision === null && !showPostMissionForm && allItemsChecked && (
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
            {currentStep === totalSteps && showPostMissionForm && !missionComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <form onSubmit={handlePostMissionSubmit} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Job ID</label>
                    <input
                      type="text"
                      value={jobId}
                      onChange={(e) => setJobId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500"
                      placeholder="Enter job ID (optional)"
                    />
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-xs text-blue-300">
                      ✓ Date/time captured automatically<br />
                      ✓ Pilot ID from your profile
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelForm}
                      className="flex-1 border-slate-600 bg-slate-800 hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                    >
                      Complete
                    </Button>
                  </div>
                </form>
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
            {config.warning && currentStep !== 5 && 
             !((currentStep === 3 && usingScalePoint === null) || (currentStep === 4 && usingGCP === null)) && (
              <InfoCard variant="warning" title={config.warning.title} className="mb-4">
                <p className="whitespace-pre-line">{config.warning.message}</p>
              </InfoCard>
            )}
            
            {/* Info Card for Steps with or without items */}
            {config.info && currentStep !== 5 && currentStep !== 3 && currentStep !== 4 && currentStep !== 7 && currentStep !== totalSteps && !batterySwapMode && (
              <InfoCard variant="info" title={config.info.title} className="mb-4">
                <p className="whitespace-pre-line">{config.info.message}</p>
              </InfoCard>
            )}
            
            {/* Capture Phases Info (Tower Step 4) */}
            {config.capturePhases && (
              <InfoCard variant="info" title="Capture Phases" className="mb-4">
                <div className="text-xs space-y-2">
                  {config.capturePhases.map((phase, idx) => (
                    <div key={idx} className="border-l-2 border-blue-400/30 pl-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-slate-300 font-medium">{phase.name}</span>
                      </div>
                      <div className="text-slate-400">
                        <span>{phase.altitude}</span>
                        <span className="mx-2">•</span>
                        <span>Gimbal: {phase.gimbal}</span>
                      </div>
                      {phase.notes && (
                        <div className="text-slate-500 text-[10px] mt-1">{phase.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              </InfoCard>
            )}
            
            {/* Facade Orbits Info (Rooftop Step 6) */}
            {config.facadeOrbits && (
              <InfoCard variant="info" title="4 Facade Orbits (Auto-Set)" className="mb-4">
                <div className="text-xs space-y-2">
                  {config.facadeOrbits.map((orbit, idx) => (
                    <div key={idx} className="border-l-2 border-amber-400/30 pl-3">
                      <div className="text-slate-300 font-medium mb-1">{orbit.name}</div>
                      <div className="text-slate-400">
                        <span>{orbit.altitude}</span>
                        <span className="mx-2">•</span>
                        <span>{orbit.distance}</span>
                        <span className="mx-2">•</span>
                        <span>Gimbal: {orbit.gimbal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </InfoCard>
            )}
            
            {/* Step 3: ScalePoint Yes/No */}
            {currentStep === 3 && usingScalePoint === null && !batterySwapMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <InfoCard variant="info" title="ScalePoint Usage">
                  <p className="mb-4">Are you using a ScalePoint for this capture?</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setUsingScalePoint(true);
                        logActivity('yes_no_decision', 'scalepoint_usage', 'Are you using a ScalePoint?', 'yes');
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Yes
                    </Button>
                    <Button
                      onClick={() => {
                        setUsingScalePoint(false);
                        logActivity('yes_no_decision', 'scalepoint_usage', 'Are you using a ScalePoint?', 'no');
                      }}
                      variant="outline"
                      className="flex-1 border-slate-600"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      No
                    </Button>
                  </div>
                </InfoCard>
              </motion.div>
            )}

            {/* Step 3: ScalePoint Checklist (if yes) */}
            {currentStep === 3 && usingScalePoint === true && !batterySwapMode && (
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

            {/* Step 3: No ScalePoint Confirmation */}
            {currentStep === 3 && usingScalePoint === false && !batterySwapMode && (
              <InfoCard variant="warning" title="Skipping ScalePoint">
                <p>You've indicated no ScalePoint is being used. You can proceed to GCP Placement.</p>
              </InfoCard>
            )}

            {/* Step 4: GCP Yes/No */}
            {currentStep === 4 && usingGCP === null && !batterySwapMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <InfoCard variant="info" title="GCP Usage">
                  <p className="mb-4">Are you using Ground Control Points (GCPs) for this capture?</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setUsingGCP(true);
                        logActivity('yes_no_decision', 'gcp_usage', 'Are you using Ground Control Points (GCPs)?', 'yes');
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Yes
                    </Button>
                    <Button
                      onClick={() => {
                        setUsingGCP(false);
                        logActivity('yes_no_decision', 'gcp_usage', 'Are you using Ground Control Points (GCPs)?', 'no');
                      }}
                      variant="outline"
                      className="flex-1 border-slate-600"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      No
                    </Button>
                  </div>
                </InfoCard>
              </motion.div>
            )}

            {/* Step 4: GCP Checklist (if yes) */}
            {currentStep === 4 && usingGCP === true && !batterySwapMode && (
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

            {/* Step 4: No GCP Confirmation */}
            {currentStep === 4 && usingGCP === false && !batterySwapMode && (
              <InfoCard variant="info" title="Skipping GCP Placement">
                <p>You've indicated no GCPs are being used. You can proceed to GPS Stabilisation.</p>
              </InfoCard>
            )}

            {/* Step 6: Mission Setup - Ask about Panorama */}
            {currentStep === 6 && !batterySwapMode && (
              <div className="space-y-4">
                {/* Main mission setup items */}
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

                {/* Optional Components (after main items are checked) */}
                {(allItemsChecked || isAdmin) && (needsOrtho === null || needsPanorama === null) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <InfoCard variant="info" title="Optional Components">
                      <div className="space-y-4">
                        {/* Ortho Question */}
                        <div>
                          <p className="mb-3 font-medium">Is an orthomosaic required for this capture?</p>
                          <div className="flex gap-3">
                            <Button
                              onClick={() => {
                                setNeedsOrtho(true);
                                logActivity('yes_no_decision', 'ortho_required', 'Is orthomosaic required?', 'yes');
                              }}
                              className={needsOrtho === true ? "flex-1 bg-blue-600" : "flex-1 bg-blue-500 hover:bg-blue-600"}
                              disabled={needsOrtho !== null}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              {needsOrtho === true ? '✓ Yes' : 'Yes'}
                            </Button>
                            <Button
                              onClick={() => {
                                setNeedsOrtho(false);
                                logActivity('yes_no_decision', 'ortho_required', 'Is orthomosaic required?', 'no');
                              }}
                              variant="outline"
                              className={needsOrtho === false ? "flex-1 bg-slate-700" : "flex-1 border-slate-600"}
                              disabled={needsOrtho !== null}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              {needsOrtho === false ? '✓ No' : 'No'}
                            </Button>
                          </div>
                        </div>

                        {/* Panorama Question */}
                        <div>
                          <p className="mb-3 font-medium">Is a panorama required for this capture?</p>
                          <div className="flex gap-3">
                            <Button
                              onClick={() => {
                                setNeedsPanorama(true);
                                logActivity('yes_no_decision', 'panorama_required', 'Is panorama required?', 'yes');
                              }}
                              className={needsPanorama === true ? "flex-1 bg-blue-600" : "flex-1 bg-blue-500 hover:bg-blue-600"}
                              disabled={needsPanorama !== null}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              {needsPanorama === true ? '✓ Yes' : 'Yes'}
                            </Button>
                            <Button
                              onClick={() => {
                                setNeedsPanorama(false);
                                logActivity('yes_no_decision', 'panorama_required', 'Is panorama required?', 'no');
                              }}
                              variant="outline"
                              className={needsPanorama === false ? "flex-1 bg-slate-700" : "flex-1 border-slate-600"}
                              disabled={needsPanorama !== null}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              {needsPanorama === false ? '✓ No' : 'No'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </InfoCard>
                  </motion.div>
                )}

                {/* Ortho Height Check (if ortho selected) */}
                {needsOrtho === true && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <ChecklistItem
                      id="ortho_height_check"
                      label="Orthomosaic height verified (~30m above roof)"
                      sublabel="Set ortho component ~30m above rooftop height — v9.8.0 will throw an error if marked too low"
                      checked={checkedItems['ortho_height_check']}
                      critical={true}
                      onToggle={() => toggleItem('ortho_height_check')}
                    />
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 7: Panorama Setup (dedicated page) */}
            {currentStep === 7 && !batterySwapMode && (
              <div className="space-y-4">
                {config.info && (
                  <InfoCard variant="info" title={config.info.title}>
                    <p className="whitespace-pre-line">{config.info.message}</p>
                  </InfoCard>
                )}

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-blue-300">Panorama Checklist</p>
                    <Link to={createPageUrl('PanoramaGuide')}>
                      <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300">
                        View Full Guide
                      </Button>
                    </Link>
                  </div>
                </div>

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

                <InfoCard variant="warning" title="Upload Instructions">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p>Include panorama images in the upload <strong>along with</strong> the main mission images in the same job</p>
                  </div>
                </InfoCard>
              </div>
            )}

            {/* Step 8: Battery Change and Flight Execution */}
            {currentStep === 8 && !batterySwapMode && (
              <div className="space-y-4">
                {/* Battery Change Question */}
                <InfoCard variant="info" title="Battery Change">
                  <p className="mb-4">Do you need to change the battery?</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        logActivity('yes_no_decision', 'battery_change', 'Do you need to change the battery?', 'yes');
                        // If initial setup complete, skip to GPS step and then back to flight execution (Step 8)
                        if (initialSetupComplete) {
                          setCurrentStep(5);
                          setGpsTimerComplete(false);
                          setSatelliteCheckPassed(null);
                          setGpsTimerMinutes(user?.company?.trim() === 'Pilot Group 1' ? 5 : 2);
                          setTimerKey(prev => prev + 1);
                          setNeedsBatteryChange(null);
                        } else {
                          // First time, go through full flow
                          setCurrentStep(5);
                          setGpsTimerComplete(false);
                          setSatelliteCheckPassed(null);
                          setGpsTimerMinutes(user?.company?.trim() === 'Pilot Group 1' ? 5 : 2);
                          setTimerKey(prev => prev + 1);
                          setCheckedItems({}); // Reset checked items for step 5
                          setNeedsBatteryChange(null);
                        }
                      }}
                      className="flex-1 bg-amber-500 hover:bg-amber-600"
                    >
                      <Battery className="w-4 h-4 mr-2" />
                      Yes - Change Battery
                    </Button>
                    <Button
                      onClick={() => {
                        setNeedsBatteryChange(false);
                        logActivity('yes_no_decision', 'battery_change', 'Do you need to change the battery?', 'no');
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                      disabled={needsBatteryChange === false}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {needsBatteryChange === false ? '✓ No Battery Change' : 'No - Continue'}
                    </Button>
                  </div>
                </InfoCard>

                {/* Flight Execution Checklist (shown after No is selected) */}
                {needsBatteryChange === false && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
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
                  </motion.div>
                )}
              </div>
            )}

            {/* Checklist Items (other steps - 1, 2) */}
            {config.items && currentStep !== totalSteps && currentStep !== 3 && currentStep !== 4 && currentStep !== 6 && currentStep !== 7 && currentStep !== 8 && !batterySwapMode && (
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
            
            {/* Final Step Checklist */}
            {currentStep === totalSteps && !finalDecision && (
              <div className="space-y-4">
                {config.info && (
                  <InfoCard variant="info" title={config.info.title}>
                    <p className="whitespace-pre-line text-sm">{config.info.message}</p>
                    {config.uploadGuideUrl && (
                      <a href={config.uploadGuideUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs text-blue-400 underline hover:text-blue-300">
                        View full upload guide →
                      </a>
                    )}
                  </InfoCard>
                )}
                {config.warning && (
                  <InfoCard variant="warning" title={config.warning.title}>
                    <p className="whitespace-pre-line text-sm">{config.warning.message}</p>
                  </InfoCard>
                )}
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
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation Footer */}
      {!(currentStep === totalSteps && (missionComplete || showPostMissionForm)) && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-5 py-4">
          <div className="max-w-lg mx-auto flex gap-3">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? goToHome : previousStep}
              className="flex-1 border-slate-700 bg-slate-800 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={nextStep}
              disabled={!canProceed || currentStep === totalSteps}
              className={cn(
                "flex-1 transition-all duration-300",
                canProceed 
                  ? "bg-blue-500 hover:bg-blue-600" 
                  : "bg-slate-700 cursor-not-allowed"
              )}
            >
              {currentStep === totalSteps ? 'Complete' : 'Next'}
              {currentStep < totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}