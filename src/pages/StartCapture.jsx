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
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ProgressBar';
import ChecklistItem from '@/components/ChecklistItem';
import Timer from '@/components/Timer';
import InfoCard from '@/components/InfoCard';

import { cn } from '@/lib/utils';

const TOWER_STEPS = [
  "Equipment & Pre-Flight",
  "Camera Setup",
  "ScalePoint Placement",
  "GCP Placement",
  "GPS Stabilisation",
  "Mission Setup & Camera",
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
      { id: 'takeoff_clear', label: 'Takeoff area clear', sublabel: 'At least 5m from crowd/obstacles' },
      { id: 'dji_status', label: 'DJI app status check', sublabel: 'Firmware, sensors, compass, GPS, HD transmission', critical: true },
      { id: 'recording', label: 'Screen recording ON', sublabel: 'From hover start to mission end', critical: true }
    ]
  },
  2: {
    title: "Camera Setup",
    subtitle: "Configure camera settings before flight",
    info: {
      title: "Required Camera Settings",
      message: "Please ensure you use the following camera settings:\n\n• Dewarping → On\n• Mechanical Shutter → On\n• Camera in Wide Mode\n• Zoom set to 1x\n• ISO - 100\n• F-stop - 4.0\n• Camera - Manual Mode\n\nThe histogram is currently not available, please select an appropriate shutter speed."
    },
    items: [
      { id: 'camera_dewarping', label: 'Dewarping ON', critical: true },
      { id: 'camera_mechanical_shutter', label: 'Mechanical Shutter ON', critical: true },
      { id: 'camera_wide_mode', label: 'Camera in Wide Mode', critical: true },
      { id: 'camera_zoom', label: 'Zoom set to 1x', critical: true },
      { id: 'camera_iso', label: 'ISO - 100', critical: true },
      { id: 'camera_fstop', label: 'F-stop - 4.0', critical: true },
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
      { id: 'scalepoint_distance', label: 'Proper distance from tower', sublabel: 'Close enough to capture, far from obstacles' },
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
      { id: 'gcp_visible', label: 'GCPs visible from multiple angles', sublabel: 'No shadows or obstructions', critical: true },
      { id: 'gcp_photos', label: 'Close-up photos of each GCP taken', sublabel: 'For back office reference' }
    ]
  },
  5: {
    title: "GPS Stabilisation (5 min)",
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
    ],
    panoramaItems: [
      { id: 'pano_mission_loaded', label: 'Panorama mission loaded in Dronelink', critical: true },
      { id: 'pano_position', label: 'Positioned 10m above Tower Height', sublabel: 'Centered above tower', critical: true },
      { id: 'pano_point_marked', label: 'Panorama point(s) marked', critical: true },
      { id: 'pano_spherical_360', label: 'Pattern set to "Spherical 360"', sublabel: 'Standard deliverable', critical: true },
      { id: 'pano_mission_named', label: 'Mission named with "Pano" suffix', sublabel: 'e.g., "Brisbane Site 001 Pano"' }
    ]
  },
  7: {
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
  8: {
    title: "Post-Flight QC",
    subtitle: "Quality check before leaving site",
    items: [
      { id: 'land_safe', label: 'Landed at safe location', sublabel: 'Preferably same as takeoff point' },
      { id: 'gps_variance_check', label: 'GPS variance verified', sublabel: 'Use GPS Altitude Verifier to check stability', critical: true },
      { id: 'drone_condition', label: 'Drone & battery condition checked', sublabel: 'No damage or issues' },
      { id: 'mission_complete', label: 'Mission completeness verified', sublabel: 'All planned captures done' },
      { id: 'photo_quality', label: 'Photo quality pre-checked', sublabel: 'Spot check exposure and alignment' },
      { id: 'data_transfer', label: 'Data transfer to back office', sublabel: 'All photos uploaded/transferred' }
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
      { id: 'roof_access', label: 'Rooftop access confirmed', sublabel: 'Pilot/spotter MUST be on roof', critical: true },
      { id: 'dji_status', label: 'DJI app status check', sublabel: 'Firmware, sensors, compass, GPS, HD transmission', critical: true },
      { id: 'obstacle_avoidance', label: 'Obstacle Avoidance ON', sublabel: 'Verify in DJI Go/Pilot app', critical: true },
      { id: 'recording', label: 'Screen recording ON', sublabel: 'From hover start to mission end', critical: true }
    ],
    warning: {
      title: "Rooftop Safety",
      message: "Pilot or spotter MUST be present on roof during marking and capture. DO NOT attempt without rooftop access."
    }
  },
  2: {
    title: "Camera Setup",
    subtitle: "Configure camera settings before flight",
    info: {
      title: "Required Camera Settings",
      message: "Please ensure you use the following camera settings:\n\n• Dewarping → On\n• Mechanical Shutter → On\n• Camera in Wide Mode\n• Zoom set to 1x\n• ISO - 100\n• F-stop - 4.0\n• Camera - Manual Mode\n\nThe histogram is currently not available, please select an appropriate shutter speed."
    },
    items: [
      { id: 'camera_dewarping', label: 'Dewarping ON', critical: true },
      { id: 'camera_mechanical_shutter', label: 'Mechanical Shutter ON', critical: true },
      { id: 'camera_wide_mode', label: 'Camera in Wide Mode', critical: true },
      { id: 'camera_zoom', label: 'Zoom set to 1x', critical: true },
      { id: 'camera_iso', label: 'ISO - 100', critical: true },
      { id: 'camera_fstop', label: 'F-stop - 4.0', critical: true },
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
      { id: 'scalepoint_distance', label: 'Proper distance from tower', sublabel: 'Close enough to capture, far from obstacles' },
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
      { id: 'gcp_visible', label: 'GCPs visible from multiple angles', sublabel: 'No shadows or obstructions', critical: true },
      { id: 'gcp_photos', label: 'Close-up photos of each GCP taken', sublabel: 'For back office reference' }
    ]
  },
  5: {
    title: "GPS Stabilisation (5 min)",
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
    title: "Rooftop Mission Setup & Camera",
    subtitle: "Configure mission parameters and camera settings",
    items: [
      { id: 'shutter_adjusted', label: 'Shutter speed adjusted for roof', sublabel: 'e.g., 1/2000 → 1/1500 for reflection', critical: true },
      { id: 'mission_name', label: 'Mission name entered', sublabel: 'Using Site ID + date' },
      { id: 'msa_roof', label: 'MSA set to roof height', sublabel: 'NOT equipment height - roof level', critical: true },
      { id: 'facade_boundary', label: 'Facade boundary marked CLOCKWISE', sublabel: 'External points only, no concave points', critical: true },
      { id: 'equipment_marked', label: 'Equipment/tower locations marked', sublabel: 'Center and radius for each cluster' },
      { id: 'equipment_height', label: 'Equipment heights set', sublabel: 'Above MSA for orbits' },
      { id: 'obstacles_marked', label: 'Obstacles marked', sublabel: 'Buildings, trees with buffer' },
      { id: 'pano_ortho_selected', label: 'Panorama/Orthomosaic selected (if needed)', sublabel: 'Optional components' },
      { id: 'same_takeoff', label: 'Takeoff location noted', sublabel: 'Must use SAME spot for battery swaps', critical: true }
    ],
    panoramaItems: [
      { id: 'pano_height_marked', label: 'Panorama Height marked', sublabel: 'Gimbal 0° (~20m above roof)', critical: true },
      { id: 'pano_center_marked', label: 'Panorama Center marked', sublabel: 'Gimbal -90° (directly above location)', critical: true },
      { id: 'pano_auto_capture', label: 'Auto-capture confirmed', sublabel: 'Will execute during mission' }
    ],
    facadeOrbits: [
      { name: "First Facade (Overview)", altitude: "30m above MSA", distance: "11m away", gimbal: "-65°" },
      { name: "Second Facade (Top)", altitude: "25m above MSA", distance: "11m away", gimbal: "-55°" },
      { name: "Third Facade (Mid)", altitude: "22m above MSA", distance: "11m away", gimbal: "-45°" },
      { name: "Fourth Facade (Lowest)", altitude: "19m above MSA", distance: "10m away", gimbal: "-45°" }
    ],
    warning: {
      title: "Critical",
      message: "MSA = roof height. Mark boundary CLOCKWISE. Adjust shutter for reflections. Same takeoff spot for battery swaps."
    }
  },
  7: {
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
  8: {
    title: "Post-Flight QC",
    subtitle: "Quality check before leaving site",
    items: [
      { id: 'land_safe', label: 'Landed at safe location', sublabel: 'Same as takeoff point' },
      { id: 'gps_variance_check', label: 'GPS variance verified', sublabel: 'Use GPS Altitude Verifier to check stability', critical: true },
      { id: 'drone_condition', label: 'Drone & battery condition checked', sublabel: 'No damage or issues' },
      { id: 'mission_complete', label: 'Mission completeness verified', sublabel: 'All components: Roof, Equipment, Pano, Ortho' },
      { id: 'photo_quality', label: 'Photo quality pre-checked', sublabel: 'Spot check exposure and alignment' },
      { id: 'data_transfer', label: 'Data transfer to back office', sublabel: 'All photos uploaded/transferred' }
    ]
  }
};

export default function StartCapture() {
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
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });
  
  useEffect(() => {
    if (user?.email && !pilotId) {
      setPilotId(user.email);
    }
  }, [user, pilotId]);

  // Request location permission on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError(error.message);
          console.error('Location error:', error);
        }
      );
    } else {
      setLocationError('Geolocation not supported');
    }
  }, []);
  
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
  const totalSteps = 8;
  const isAdmin = user?.role === 'admin';
  
  // Step 3 can proceed if: no scale point selected OR all items checked
  const step3CanProceed = isAdmin || usingScalePoint === false || (usingScalePoint === true && allItemsChecked);
  // Step 4 can proceed if: no GCP selected OR all items checked
  const step4CanProceed = isAdmin || usingGCP === false || (usingGCP === true && allItemsChecked);
  // Step 6 can proceed if: all main items checked AND (no panorama OR panorama items checked)
  const panoramaItemsChecked = config?.panoramaItems?.every(item => checkedItems[item.id]) ?? true;
  const step6CanProceed = isAdmin || (allItemsChecked && (needsPanorama === false || (needsPanorama === true && panoramaItemsChecked)));
  // Step 7 can proceed if: battery change answered NO and all items checked
  const step7CanProceed = isAdmin || (needsBatteryChange === false && allItemsChecked);
  // Step 5 can proceed if: timer complete AND satellite check passed
  const step5CanProceed = isAdmin || (gpsTimerComplete && satelliteCheckPassed === true);
  const canProceed = isAdmin || (currentStep === 3 ? step3CanProceed : (currentStep === 4 ? step4CanProceed : (currentStep === 5 ? step5CanProceed : (currentStep === 6 ? step6CanProceed : (currentStep === 7 ? step7CanProceed : allItemsChecked)))));
  
  const nextStep = () => {
    // Log step navigation
    logActivity('step_navigation', `step_${currentStep}_to_${currentStep + 1}`, `Navigated from ${STEPS[currentStep - 1]} to ${STEPS[currentStep]}`, 'next');
    
    // Mark initial setup complete after step 6 (before flight execution)
    if (currentStep === 6) {
      setInitialSetupComplete(true);
    }
    
    // If on step 5 (GPS) and initial setup is complete, skip to step 7 (flight execution)
    if (currentStep === 5 && initialSetupComplete && satelliteCheckPassed === true) {
      setCurrentStep(7);
      setNeedsBatteryChange(null);
    } else if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const goToHome = () => {
    window.location.href = createPageUrl('Home');
  };
  
  const handleDecision = (decision) => {
    setFinalDecision(decision);
    setShowPostMissionForm(true);
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

  const startBatterySwap = () => {
    setBatterySwapMode(true);
    setBatterySwapChecks({});
    setBatterySwapGpsComplete(false);
  };

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

  // Site Type Selection
  if (!siteType) {
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
              onClick={() => setSiteType('tower')}
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
              onClick={() => setSiteType('rooftop')}
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
            {batterySwapMode && currentStep === 7 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <InfoCard variant="warning" title="Battery Swap In Progress">
                  <p>Complete all checks before resuming flight</p>
                </InfoCard>

                <Timer 
                  targetMinutes={5} 
                  onComplete={() => setBatterySwapGpsComplete(true)}
                  label="GPS Stabilisation (5 min)"
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
                  onComplete={() => {
                    setGpsTimerComplete(true);
                    logActivity('timer_complete', 'gps_stabilisation', 'GPS Stabilisation Timer', 'completed');
                  }}
                  label={`GPS Stabilisation Timer (${gpsTimerMinutes} min)`}
                  isAdmin={user?.role === 'admin'}
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
                            setGpsTimerMinutes(2);
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
                      ✓ Pilot ID from your profile<br />
                      ✓ Stored locally on this device
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
            {config.info && currentStep !== 5 && currentStep !== 3 && currentStep !== 4 && !batterySwapMode && (
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
            
            {/* Facade Orbits Info (Rooftop Step 4) */}
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

            {/* Step 7: Battery Change and Flight Execution */}
            {currentStep === 7 && !batterySwapMode && (
              <div className="space-y-4">
                {/* Battery Change Question */}
                <InfoCard variant="info" title="Battery Change">
                  <p className="mb-4">Do you need to change the battery?</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        logActivity('yes_no_decision', 'battery_change', 'Do you need to change the battery?', 'yes');
                        // If initial setup complete, skip to GPS step and then back to flight execution
                        if (initialSetupComplete) {
                          setCurrentStep(5);
                          setGpsTimerComplete(false);
                          setSatelliteCheckPassed(null);
                          setGpsTimerMinutes(5);
                          setTimerKey(prev => prev + 1);
                          setNeedsBatteryChange(null);
                        } else {
                          // First time, go through full flow
                          setCurrentStep(5);
                          setGpsTimerComplete(false);
                          setCheckedItems({});
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

            {/* Step 6: Mission Setup with Panorama */}
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

                {/* Panorama Yes/No (after main items are checked) */}
                {allItemsChecked && needsPanorama === null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <InfoCard variant="info" title="Panorama Capture">
                      <p className="mb-4">Is a panorama required for this capture?</p>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            setNeedsPanorama(true);
                            logActivity('yes_no_decision', 'panorama_required', 'Is panorama required?', 'yes');
                          }}
                          className="flex-1 bg-blue-500 hover:bg-blue-600"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Yes
                        </Button>
                        <Button
                          onClick={() => {
                            setNeedsPanorama(false);
                            logActivity('yes_no_decision', 'panorama_required', 'Is panorama required?', 'no');
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

                {/* Panorama Checklist (if yes) */}
                {needsPanorama === true && config.panoramaItems && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-blue-300">Panorama Setup</p>
                        <Link to={createPageUrl('PanoramaGuide')}>
                          <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300">
                            View Guide
                          </Button>
                        </Link>
                      </div>
                    </div>
                    {config.panoramaItems.map(item => (
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

                {/* No Panorama Confirmation */}
                {needsPanorama === false && (
                  <InfoCard variant="info" title="Skipping Panorama">
                    <p>No panorama will be captured for this mission. You can proceed to flight execution.</p>
                  </InfoCard>
                )}
              </div>
            )}

            {/* Checklist Items (other steps) */}
            {config.items && currentStep !== totalSteps && currentStep !== 3 && currentStep !== 4 && currentStep !== 6 && currentStep !== 7 && !batterySwapMode && (
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
      {!(currentStep === totalSteps && (missionComplete || showPostMissionForm)) && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-5 py-4">
          <div className="max-w-lg mx-auto flex gap-3">
            <Button
              variant="outline"
              onClick={goToHome}
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