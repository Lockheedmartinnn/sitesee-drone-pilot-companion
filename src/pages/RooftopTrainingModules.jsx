import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  ChevronDown,
  ChevronRight,
  PlayCircle,
  BookOpen,
  Clock,
  Target,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

const MODULES = [
  {
    id: 'module1',
    number: 1,
    title: 'Module 1: Overview & Key Improvements',
    estimatedTime: '12 minutes',
    prerequisite: null,
    videoId: 'uZwFc9uqKts',
    description: 'Introduction to v9.7.0 updates: 2x faster flight speeds, simplified marking, single-layer planar overview at -45°, enhanced detail reconstruction, and reduced site time.',
    goals: [
      'Understand what changed in Rooftop Mission v9.7.0 and why these changes matter',
      'Configure flight settings correctly for the new mission architecture',
      'Execute rooftop captures faster, safer, and with higher reconstruction accuracy',
      'Avoid common failure modes (ghosting, poor overlap, battery-related GPS drift)',
      'Recognize when to use single vs multi-battery strategies',
      'Understand the relationship between flight speed and capture interval'
    ],
    sections: [
      {
        title: 'What Changed in Rooftop Mission v9.7.0',
        content: 'Rooftop Mission v9.7.0 represents a fundamental redesign of the capture architecture. The changes were driven by analysis of thousands of rooftop missions and pilot feedback about time pressure, battery management, and reconstruction quality.',
        keyPoints: [
          'Enhanced detail reconstruction - High-resolution textures for component-level inspection',
          'Reduced site time by ~50% - Faster flight speed, fewer images, lower battery swap likelihood',
          'Simplified flight path - Single-layer planar overview at −45° instead of multi-layer approach',
          'Auto-calculated planar height - System determines optimal altitude based on equipment marking',
          'Faster processing times - Fewer images = faster upload and reconstruction pipeline',
          'Lower risk of GPS drift - Shorter missions reduce exposure to battery swap altitude shifts'
        ]
      },
      {
        title: 'Technical Flight Settings (Must-Know)',
        content: 'This section is non-negotiable. Incorrect settings will result in failed captures due to insufficient image overlap. These settings work together as a system - changing one without adjusting others breaks the reconstruction pipeline.',
        keyPoints: [
          'Drone speed increased 2× for planar and equipment orbit capture (from ~3 m/s to ~6 m/s)',
          'Capture interval MUST be set to 1 second (not 2 seconds) - this is critical',
          'At 6 m/s with 2-second interval = 12m gaps between images = reconstruction failure',
          'At 6 m/s with 1-second interval = 6m gaps = sufficient 80% overlap maintained',
          'Camera settings remain unchanged: Auto exposure, Auto white balance, Auto focus',
          'DO NOT manually adjust shutter speed or ISO unless explicitly instructed by support'
        ]
      },
      {
        title: 'Mission Marking - What\'s Now Simpler',
        content: 'The marking process has been intentionally simplified to reduce pilot cognitive load and mission setup time. The system now handles calculations that were previously manual.',
        keyPoints: [
          'Planar height → auto-calculated based on highest marked equipment cluster',
          'No need to mark mid-equipment heights or MSA (Maximum Safe Altitude)',
          'Rooftop boundaries can be marked clockwise OR anti-clockwise (system adapts)',
          'Equipment clusters still require height marking at actual elevation',
          'Obstacle marking process unchanged - height and boundary still required',
          'Fewer total marking steps = faster mission prep = more time for GPS stabilization'
        ]
      },
      {
        title: 'GPS Stabilization & Battery Strategy',
        content: 'Even with faster missions, GPS discipline remains the #1 failure prevention factor. The shorter mission duration actually makes single-battery flights viable for most rooftops, which eliminates the most common source of altitude drift.',
        keyPoints: [
          'Typical rooftop missions: ~20 minutes (previously ~40 minutes)',
          'Single battery strategy now preferred for most sites - prevents altitude jumps',
          'Initial manual GPS stabilization still required: Hover at takeoff height for 90-120 seconds',
          'If battery swap required: Land, swap, hover at exact same altitude for 90 seconds before resuming',
          'Monitor GPS satellite count throughout - maintain 28+ satellites for stable reference',
          'Battery swap protocol: Check Y-axis altitude stability before and after swap (use GPS Verifier tool)'
        ]
      },
      {
        title: 'Common Mistakes to Avoid',
        content: 'These mistakes account for 80% of rooftop mission failures in v9.7.0.',
        keyPoints: [
          'Setting capture interval to 2 seconds (causes ghosting and reconstruction failure)',
          'Skipping initial GPS stabilization (causes altitude drift throughout mission)',
          'Not checking battery percentage before takeoff (forced emergency landing mid-mission)',
          'Marking equipment at wrong heights (causes orbit collision risk)',
          'Flying in high winds without checking wind speed limits (DJI M3E max: 12 m/s)',
          'Not validating 3D mission plan before takeoff (missing obstacles or incorrect boundaries)'
        ]
      },
      {
        title: 'Quality Assurance Checklist',
        content: 'Use this checklist before every rooftop mission to ensure settings are correct.',
        keyPoints: [
          '✓ Capture interval = 1 second',
          '✓ Battery > 85% before takeoff',
          '✓ GPS satellites ≥ 28',
          '✓ Wind speed < 10 m/s',
          '✓ All equipment clusters marked at correct heights',
          '✓ Obstacles and neighboring buildings marked if present',
          '✓ 3D mission plan reviewed and validated',
          '✓ Initial GPS stabilization completed (90-120 seconds hover)'
        ]
      }
    ],
    quiz: [
      {
        question: 'What is the correct capture interval for Rooftop Mission v9.7.0?',
        options: ['2 seconds', '1 second', 'Auto', 'Pilot preference'],
        correct: 1
      },
      {
        question: 'Which marking requirements were removed in v9.7.0?',
        options: [
          'Mid-equipment heights and MSA calculations',
          'Equipment cluster marking',
          'Rooftop boundary marking',
          'Obstacle height marking'
        ],
        correct: 0
      },
      {
        question: 'Why is a single battery strategy preferred in v9.7.0?',
        options: [
          'Faster uploads',
          'Better video quality',
          'Prevents GPS altitude drift at battery swap',
          'Less pilot fatigue'
        ],
        correct: 2
      },
      {
        question: 'What happens if you use 2-second capture interval at 6 m/s flight speed?',
        options: [
          'Better image quality',
          'Insufficient overlap causing reconstruction failure',
          'Faster mission completion',
          'No difference from 1-second interval'
        ],
        correct: 1
      },
      {
        question: 'How long should initial GPS stabilization hover be?',
        options: [
          '30 seconds',
          '60 seconds',
          '90-120 seconds',
          'No stabilization needed in v9.7.0'
        ],
        correct: 2
      },
      {
        question: 'What is the approximate time reduction for typical rooftop missions in v9.7.0?',
        options: [
          '10% faster',
          '25% faster',
          '50% faster (40 min → 20 min)',
          'Same duration as previous version'
        ],
        correct: 2
      },
      {
        question: 'Which setting change is the most critical to avoid reconstruction failure?',
        options: [
          'Camera ISO setting',
          'Capture interval must be 1 second',
          'White balance mode',
          'Maximum flight altitude'
        ],
        correct: 1
      }
    ]
  },
  {
    id: 'module2',
    number: 2,
    title: 'Module 2: Multi-Level Rooftop Capture',
    estimatedTime: '3 minutes',
    prerequisite: 'module1',
    videoId: 'jRtZF30265Y',
    description: 'Learn how to mark equipment clusters at two different elevations (high and low). Covers marking equipment height, center, and radius for each cluster, plus panorama/orthomosaic configuration.',
    goals: [
      'Correctly plan and execute a multi-level rooftop capture with equipment at different heights',
      'Mark multiple equipment clusters at different elevations accurately',
      'Understand why orbit count differs between high and low clusters and why this is correct',
      'Validate the generated 3D mission plan before takeoff to catch marking errors',
      'Recognize when equipment height differences exceed system limitations',
      'Properly configure panorama and orthomosaic deliverables for multi-level sites'
    ],
    sections: [
      {
        title: 'Scenario Overview',
        content: 'Multi-level rooftops are common in telecom infrastructure where equipment has been added over time at different elevations. Each cluster must be treated as its own independent vertical system - the mission planner cannot average or interpolate heights between clusters.',
        keyPoints: [
          'Each equipment cluster exists in its own vertical plane and requires independent marking',
          'Each cluster must be marked at its actual physical height above the rooftop surface',
          'Heights cannot be assumed, averaged, or extrapolated from other clusters',
          'The system generates orbits around each cluster based on its specific height marking',
          'Planar overview altitude is auto-calculated based on the highest cluster',
          'Common scenario: Lower cluster at 8-10m, higher cluster at 12-15m above rooftop'
        ]
      },
      {
        title: 'Step-by-Step Marking Process',
        content: 'The marking sequence is critical. Equipment must be marked before obstacles, and each cluster must be marked at its actual elevation.',
        keyPoints: [
          'Step 1: Identify all distinct equipment clusters and their approximate heights',
          'Step 2: Start with LOWER cluster - Fly drone to equipment height (e.g., 8m)',
          'Step 3: Mark equipment height, center point, and radius for lower cluster',
          'Step 4: Move to HIGHER cluster - Fly drone to its height (e.g., 13m)',
          'Step 5: Mark height, center, radius for higher cluster (do NOT reuse values from Cluster 1)',
          'Step 6: Review 3D mission plan to validate both clusters are correctly represented',
          'Critical: Each cluster marking is independent - never assume heights or copy values'
        ]
      },
      {
        title: 'Understanding Orbit Logic',
        content: 'The system automatically calculates orbit requirements based on cluster height and its relationship to the planar overview. Lower clusters often require more orbits because they need stronger tie-in to the main model.',
        keyPoints: [
          'Lower clusters: Typically 3-4 orbits for stronger geometric tie-in to planar model',
          'Higher clusters: Typically 2 orbits as they\'re partially covered by planar passes',
          'This is intentional system logic designed to optimize reconstruction quality',
          'More orbits = more images = stronger feature matching = better reconstruction',
          'The orbit count difference is NOT an error - do not try to "fix" it',
          'Review the 3D flight path to see how orbits relate to planar coverage'
        ]
      },
      {
        title: 'Common Multi-Level Mistakes',
        content: 'These mistakes lead to orbit collision risks, reconstruction failure, or incomplete coverage.',
        keyPoints: [
          'Mistake #1: Marking both clusters at the same height (causes orbit collision risk)',
          'Mistake #2: Not flying drone to actual cluster height before marking (incorrect orbit reference)',
          'Mistake #3: Copying radius from one cluster to another (equipment sizes differ)',
          'Mistake #4: Marking equipment center incorrectly (causes off-center orbits)',
          'Mistake #5: Not validating 3D plan before takeoff (missed errors become expensive)',
          'Mistake #6: Assuming system will "figure out" heights automatically (it will not)'
        ]
      },
      {
        title: 'Height Difference Limitations',
        content: 'The system has a maximum height difference constraint between lowest and highest marked points. Understanding this limit prevents wasted field time.',
        keyPoints: [
          'Maximum height difference: 25 meters between lowest and highest points',
          'This includes equipment clusters AND obstacles',
          'Example violation: Lower cluster at 8m, higher cluster at 40m = 32m delta (EXCEEDS)',
          'If you encounter this error, contact SiteSee Support immediately',
          'Do NOT attempt to work around this by under-marking equipment heights',
          'Support can sometimes split the mission into two separate captures'
        ]
      },
      {
        title: 'Panorama and Orthomosaic Configuration',
        content: 'Deliverable selection impacts mission duration and output types. Understanding what you need before marking saves time.',
        keyPoints: [
          'Panorama: Single 360° image from rooftop center - adds ~3-5 minutes',
          'Orthomosaic: Top-down 2D map of entire rooftop - adds ~5-7 minutes to flight time',
          'Both can be enabled simultaneously without conflicts',
          'Panorama altitude auto-calculated based on rooftop size and equipment height',
          'Orthomosaic requires sufficient rooftop boundary marking for proper coverage',
          'If time-constrained, prioritize 3D reconstruction over optional deliverables'
        ]
      }
    ],
    quiz: [
      {
        question: 'Why must the drone be physically flown to the cluster height before marking?',
        options: [
          'For GPS accuracy improvements',
          'To correctly define the vertical orbit reference plane',
          'To speed up the marking process',
          'To reduce total image count'
        ],
        correct: 1
      },
      {
        question: 'What is the biggest mistake pilots make on multi-level rooftops?',
        options: [
          'Flying too high during initial GPS stabilization',
          'Treating multiple clusters as one height',
          'Marking too many boundary points',
          'Choosing wrong panorama deliverables'
        ],
        correct: 1
      },
      {
        question: 'Why do lower equipment clusters typically get more orbits than higher clusters?',
        options: [
          'System error that should be reported',
          'Lower clusters need stronger tie-in to the planar model',
          'To increase image count for billing purposes',
          'Random system behavior'
        ],
        correct: 1
      },
      {
        question: 'What is the maximum allowed height difference between equipment clusters?',
        options: [
          '15 meters',
          '20 meters',
          '25 meters',
          'No limit exists'
        ],
        correct: 2
      },
      {
        question: 'What should you do if both clusters appear at the same height in the 3D plan?',
        options: [
          'Proceed with flight - system will correct it',
          'Delete and re-mark both clusters at their actual heights',
          'Only re-mark the higher cluster',
          'Contact support and proceed with flight'
        ],
        correct: 1
      },
      {
        question: 'When marking Cluster 2, should you reuse the radius value from Cluster 1?',
        options: [
          'Yes, to maintain consistency',
          'No, each cluster needs its own accurate radius measurement',
          'Only if clusters are similar size',
          'Yes, if they are on the same rooftop'
        ],
        correct: 1
      }
    ]
  },
  {
    id: 'module3',
    number: 3,
    title: 'Module 3: Complex Obstacle Environment',
    estimatedTime: '3.5 minutes',
    prerequisite: 'module2',
    videoId: 'M4t7QHfmgOA',
    description: 'Master marking on-roof enveloped obstacles, non-enveloped obstacles, and neighboring high-rise buildings. Learn proper boundary marking, height settings, and flight path optimization around multiple obstacle types.',
    goals: [
      'Safely plan missions in obstacle-dense rooftop environments without collision risk',
      'Correctly classify and mark enveloped vs non-enveloped obstacles',
      'Identify and mitigate neighbouring high-rise building collision risks',
      'Interpret the 3D flight plan colour logic to validate safe trajectories',
      'Understand the critical relationship between equipment marking and obstacle avoidance',
      'Know when obstacle complexity requires mission modification or support escalation'
    ],
    sections: [
      {
        title: 'Obstacle Classification System',
        content: 'The NexDT system uses two obstacle types with fundamentally different flight behaviors. Understanding this classification is critical for safe mission planning.',
        keyPoints: [
          'Enveloped Obstacles: Drone flies AROUND and ABOVE with safe clearance buffer',
          'Non-Enveloped Obstacles: Drone maintains horizontal distance but does NOT fly over',
          'Equipment MUST be marked first - obstacles are calculated relative to equipment height',
          'The system does not auto-detect obstacles - if not marked, drone does not respect them',
          'Obstacle marking sequence: Equipment first → On-roof obstacles → Neighboring structures',
          'Each obstacle requires both height AND boundary polygon marking'
        ]
      },
      {
        title: 'Marking On-Roof Enveloped Obstacles',
        content: 'Enveloped obstacles are on-roof structures that the drone can safely fly over and around. These are the most common obstacle type on telecom rooftops.',
        keyPoints: [
          'Examples: HVAC units, lift overruns, small equipment shelters, vent stacks',
          'Marking process: Fly to obstacle height → Mark height → Mark boundary polygon',
          'Boundary must fully contain the obstacle with small buffer (~0.5m)',
          'System adds automatic clearance buffer above and around the obstacle',
          'Drone will orbit equipment while respecting obstacle clearance zones',
          'If obstacle is taller than equipment, it may affect planar altitude calculation'
        ]
      },
      {
        title: 'Marking Non-Enveloped Obstacles',
        content: 'Non-enveloped obstacles are structures the drone should NOT fly over under any circumstances. These create horizontal no-fly zones.',
        keyPoints: [
          'Examples: Occupied buildings, active transmission equipment, dangerous areas',
          'The drone maintains horizontal separation but does NOT avoid flying over',
          'Use this classification when flying over is unsafe or prohibited',
          'Boundary marking creates a horizontal exclusion zone for all flight altitudes',
          'Critical for safety: If in doubt, mark as non-enveloped',
          'This classification reduces available flight paths more than enveloped obstacles'
        ]
      },
      {
        title: 'Neighbouring High-Rise Buildings (Critical)',
        content: 'Neighbouring high-rise buildings are the most dangerous obstacle type and the #1 cause of near-miss incidents. These MUST be marked even if they appear outside the rooftop boundary.',
        keyPoints: [
          'ANY building taller than target rooftop within 50m must be marked',
          'Mark height accurately - use Google Earth, building data, or visual estimate',
          'Mark boundary polygon even if most of building is outside rooftop area',
          'Creates a 3D no-fly constraint that affects trajectory planning',
          'Failure to mark can result in collision trajectory during equipment orbits',
          'When in doubt, mark it - false positive better than collision risk',
          'If multiple high-rises surround site, mission may not be viable - escalate to support'
        ]
      },
      {
        title: 'Sequential Marking Workflow',
        content: 'The order of marking is critical because each element affects subsequent calculations. Following this sequence prevents errors and rework.',
        keyPoints: [
          'Step 1: Mark rooftop boundary polygon',
          'Step 2: Mark all equipment clusters at correct heights',
          'Step 3: Mark on-roof enveloped obstacles',
          'Step 4: Mark on-roof non-enveloped obstacles (if any)',
          'Step 5: Mark neighboring high-rise buildings',
          'Step 6: Review 3D plan for clearance conflicts',
          'Step 7: Validate drone trajectory does not intersect any marked obstacles'
        ]
      },
      {
        title: '3D Mission Plan Colour Key',
        content: 'The 3D visualization uses colour coding to represent different elements. Learning this visual language allows rapid validation of mission plans.',
        keyPoints: [
          'Dark Blue → Building structure (rooftop surface and target building)',
          'Green → Equipment clusters (capture targets)',
          'Pink → Enveloped obstacles (drone avoids by flying around/over)',
          'Grey → Non-enveloped obstacles (horizontal exclusion zones)',
          'Light Blue → Drone trajectory (flight path through 3D space)',
          'Red highlights → Collision warnings or clearance violations (if present)'
        ]
      },
      {
        title: 'Validation Checklist',
        content: 'Use this checklist to validate obstacle marking before committing to flight.',
        keyPoints: [
          '✓ All equipment marked before obstacles',
          '✓ All visible on-roof obstacles marked with correct classification',
          '✓ All neighboring high-rises within 50m marked',
          '✓ Obstacle boundaries fully contain physical structures',
          '✓ 3D plan reviewed - no trajectory intersections with obstacles',
          '✓ Light blue trajectory maintains clearance from pink/grey obstacles',
          '✓ If multiple high-rises create enclosed space, mission feasibility confirmed'
        ]
      },
      {
        title: 'When to Escalate to Support',
        content: 'Some obstacle configurations make autonomous flight unsafe or impossible. Recognize these scenarios early to avoid wasted field time.',
        keyPoints: [
          'Scenario 1: Multiple high-rises create fully enclosed space with no safe trajectory',
          'Scenario 2: Neighboring building exceeds maximum height difference (>25m above equipment)',
          'Scenario 3: Obstacle complexity prevents mission plan generation',
          'Scenario 4: Mission plan shows red collision warnings that cannot be resolved',
          'Protocol: Capture site photos, document obstacle locations, contact support with details',
          'Do NOT attempt manual flight workarounds - escalate for alternative capture strategy'
        ]
      }
    ],
    quiz: [
      {
        question: 'Why must equipment be marked before obstacles?',
        options: [
          'It speeds up the marking process',
          'Equipment height defines the reference for all obstacle clearance calculations',
          'It reduces the number of required orbits',
          'It improves panorama image quality'
        ],
        correct: 1
      },
      {
        question: 'What happens if a neighbouring high-rise building is not marked?',
        options: [
          'The drone automatically avoids it using sensors',
          'The flight plan may generate collision trajectory',
          'Image processing fails during reconstruction',
          'Panorama capture is automatically skipped'
        ],
        correct: 1
      },
      {
        question: 'What is the difference between enveloped and non-enveloped obstacles?',
        options: [
          'Enveloped obstacles are taller than non-enveloped',
          'Enveloped obstacles are avoided by flying around/over; non-enveloped create horizontal exclusion zones',
          'Non-enveloped obstacles require height marking; enveloped do not',
          'There is no functional difference'
        ],
        correct: 1
      },
      {
        question: 'What colour represents the drone trajectory in the 3D mission plan?',
        options: [
          'Green',
          'Pink',
          'Light Blue',
          'Grey'
        ],
        correct: 2
      },
      {
        question: 'Within what distance must neighboring high-rise buildings be marked?',
        options: [
          '25 meters',
          '50 meters',
          '100 meters',
          'Only if they are on the same property'
        ],
        correct: 1
      },
      {
        question: 'What should you do if marking obstacles causes red collision warnings in the 3D plan?',
        options: [
          'Delete obstacle marking and proceed with flight',
          'Reduce equipment orbit count',
          'Review trajectory and if unresolvable, contact support',
          'Proceed with flight - warnings are advisory only'
        ],
        correct: 2
      },
      {
        question: 'What is the correct marking sequence for complex rooftop sites?',
        options: [
          'Obstacles → Equipment → Boundary',
          'Equipment → Boundary → Obstacles',
          'Boundary → Equipment → Obstacles → Neighboring buildings',
          'Any order is acceptable'
        ],
        correct: 2
      }
    ]
  },
  {
    id: 'module4',
    number: 4,
    title: 'Module 4: Greenfields (No Equipment/Obstacles)',
    estimatedTime: '2.5 minutes',
    prerequisite: 'module1',
    videoId: 'GQoFmwoT06c',
    description: 'Handle rooftops with no visible equipment or obstacles. Learn the critical system requirement: at least one obstacle or equipment must be marked to define rooftop geometry.',
    goals: [
      'Correctly plan a Greenfields rooftop mission with no equipment present',
      'Understand why the system requires at least one vertical reference object',
      'Resolve the "Missing marking for equipment or obstacles" error message',
      'Select an appropriate proxy obstacle when no equipment exists',
      'Recognize Greenfields sites in advance to plan appropriate workarounds',
      'Understand when a site truly has zero reference points and requires support escalation'
    ],
    sections: [
      {
        title: 'The Greenfields System Constraint',
        content: 'NexDT mission planner requires at least one vertical reference object to calculate relative rooftop geometry and establish the 3D coordinate system. This is a fundamental architectural requirement, not a software bug.',
        keyPoints: [
          'System MUST have Equipment OR Obstacle marked - no exceptions',
          'This requirement defines the relative rooftop geometry and coordinate reference',
          'Without a reference object, the system cannot calculate planar altitude or orbit paths',
          'Error message: "Missing marking for equipment or obstacles" indicates zero reference objects',
          'This limitation applies to all rooftop mission types, not just v9.7.0',
          'The reference object anchors the photogrammetry coordinate system during reconstruction'
        ]
      },
      {
        title: 'Identifying Greenfields Sites',
        content: 'Greenfields sites are rooftops with no telecom equipment installed - typically new buildings or sites prepared for future equipment installation.',
        keyPoints: [
          'Visual indicators: Completely flat rooftop with no equipment clusters',
          'May have cable trays, conduit boxes, or equipment pads prepared for future installation',
          'Might have building infrastructure: lift overruns, HVAC, vents, but no telecom equipment',
          'Check site brief or customer communications for "greenfield" or "pre-installation" language',
          'Rare scenario: True greenfield with absolutely nothing vertical on rooftop',
          'If site brief indicates greenfield, plan extra time for reference object selection'
        ]
      },
      {
        title: 'The Reference Obstacle Workaround',
        content: 'When no equipment exists, any vertical rooftop feature can be marked as a reference obstacle. This is a geometry anchor, not a hazard to be avoided.',
        keyPoints: [
          'Suitable reference objects: Lift overrun, HVAC unit, vent stack, small shelter, chimney',
          'The object does NOT need to be related to telecom infrastructure',
          'Size requirements: Any object >0.5m height and >0.5m diameter works',
          'Location: Preferably near rooftop center for optimal coverage geometry',
          'Classification: Mark as Obstacle (enveloped) not Equipment',
          'This creates the geometric reference needed for mission generation'
        ]
      },
      {
        title: 'Step-by-Step Reference Marking',
        content: 'Detailed workflow for marking a reference obstacle on greenfield sites.',
        keyPoints: [
          'Step 1: Visually scan rooftop for ANY vertical feature (lift overrun ideal)',
          'Step 2: Fly drone to approximate height of chosen feature',
          'Step 3: Mark feature as Obstacle (enveloped)',
          'Step 4: Fly drone to exact top height of obstacle and mark height',
          'Step 5: Mark boundary polygon around obstacle base',
          'Step 6: System now has reference point - mission generation should succeed',
          'Step 7: Validate 3D plan shows obstacle marked and trajectory generated'
        ]
      },
      {
        title: 'Special Case: Completely Flat Rooftop',
        content: 'In rare cases, a rooftop may have absolutely no vertical features. This requires creative problem solving or mission modification.',
        keyPoints: [
          'Check rooftop edges: Parapet walls, access ladders, guardrails may serve as reference',
          'Check for future equipment: Cable entry boxes, equipment pads, conduit stubs',
          'Last resort: Small temporary marker could be placed (coordinate with customer first)',
          'If truly zero features exist: Contact SiteSee Support for alternative workflow',
          'Support may recommend panorama-only capture or manual flight plan',
          'Document site condition with photos before contacting support'
        ]
      },
      {
        title: 'Common Greenfields Mistakes',
        content: 'Avoid these mistakes that waste field time and create unnecessary support escalations.',
        keyPoints: [
          'Mistake #1: Not reading site brief to identify greenfield in advance',
          'Mistake #2: Attempting mission without marking any reference object',
          'Mistake #3: Marking boundary only without equipment/obstacle reference',
          'Mistake #4: Contacting support before attempting reference obstacle workaround',
          'Mistake #5: Using inappropriate reference objects (e.g., loose debris, temporary items)',
          'Mistake #6: Not validating mission generation after marking reference obstacle'
        ]
      }
    ],
    quiz: [
      {
        question: 'Why does the system require at least one marked vertical object?',
        options: [
          'To increase image overlap for reconstruction',
          'To define relative rooftop geometry and coordinate reference system',
          'To improve battery efficiency during flight',
          'To enable panorama capture functionality'
        ],
        correct: 1
      },
      {
        question: 'What should you do if no telecom equipment exists on a rooftop?',
        options: [
          'Skip the mission and report site as impossible',
          'Mark any vertical rooftop feature (lift overrun, HVAC) as reference obstacle',
          'Only capture panorama without 3D reconstruction',
          'Contact support immediately before attempting any workaround'
        ],
        correct: 1
      },
      {
        question: 'What is the minimum height requirement for a reference obstacle on greenfield sites?',
        options: [
          'Must be taller than 5 meters',
          'Must be taller than equipment would be (even if not present)',
          'Any object >0.5m height works as geometric reference',
          'No minimum height required'
        ],
        correct: 2
      },
      {
        question: 'How should the reference obstacle be classified in the marking system?',
        options: [
          'As Equipment',
          'As Obstacle (enveloped)',
          'As Non-enveloped obstacle',
          'As Boundary marker'
        ],
        correct: 1
      },
      {
        question: 'What error message indicates a greenfield marking issue?',
        options: [
          '"Maximum height difference exceeded"',
          '"Missing marking for equipment or obstacles"',
          '"GPS stabilization required"',
          '"Boundary polygon incomplete"'
        ],
        correct: 1
      },
      {
        question: 'If a rooftop has absolutely no vertical features, what should you do?',
        options: [
          'Mark boundary only and hope mission generates',
          'Document with photos and contact SiteSee Support for alternative workflow',
          'Fly manual orbit pattern instead',
          'Abandon the mission'
        ],
        correct: 1
      }
    ]
  },
  {
    id: 'module5',
    number: 5,
    title: 'Module 5: Large Height Differences (>25m)',
    estimatedTime: '2 minutes',
    prerequisite: 'module2',
    videoId: '97JINuxawVo',
    description: 'Understand the Maximum Height Difference constraint (25m limit) when marking equipment at significantly different elevations. Learn when missions require manual adjustment and how to contact SiteSee Support.',
    goals: [
      'Understand the Maximum Height Difference constraint and why it exists',
      'Correctly identify when a mission cannot be generated due to height delta',
      'Know exactly when to stop field work and escalate to support',
      'Communicate issues clearly to SiteSee Support with proper documentation',
      'Recognize height difference violations during planning phase before field deployment',
      'Understand alternative capture strategies for extreme height difference sites'
    ],
    sections: [
      {
        title: 'The 25m Maximum Height Difference Constraint',
        content: 'NexDT enforces a hard 25-meter limit on the vertical spread between the lowest and highest marked points. This constraint exists due to photogrammetry reconstruction limitations and flight safety margins.',
        keyPoints: [
          'Maximum delta: 25 meters between lowest marked point and highest marked point',
          'Calculation: Highest point elevation - Lowest point elevation = Delta',
          'Example violation: Equipment at 8m + Equipment at 40m = 32m delta (EXCEEDS LIMIT)',
          'This includes ALL marked elements: equipment clusters, obstacles, neighboring buildings',
          'The limit cannot be overridden in the field or through mission settings',
          'Technical reason: Photogrammetry reconstruction quality degrades beyond 25m vertical spread'
        ]
      },
      {
        title: 'Why This Limit Exists',
        content: 'Understanding the technical rationale helps pilots recognize when they are approaching the constraint before committing to field work.',
        keyPoints: [
          'Photogrammetry works best with consistent imaging distance and angle',
          'Large height spreads cause extreme perspective differences between images',
          'Features at 8m are close-up; features at 40m appear much smaller in same image',
          'This scale variation reduces feature matching accuracy during reconstruction',
          'Flight safety: Extreme altitude changes increase collision risk and GPS drift exposure',
          'Battery management: Large vertical movements consume more power per image'
        ]
      },
      {
        title: 'Recognizing Height Violations Early',
        content: 'Identify potential violations during mission planning phase, before arriving on site.',
        keyPoints: [
          'Review site brief: Look for "tower-on-building" or "multi-story" language',
          'Check building data: Google Earth can reveal approximate height differences',
          'Historical site data: Previous captures may indicate equipment elevation spread',
          'Site photos: Customer-provided photos may show extreme height differences',
          'If violation suspected pre-deployment: Contact support for mission strategy BEFORE field visit',
          'Early identification saves wasted field time and travel costs'
        ]
      },
      {
        title: 'This Is a STOP Condition',
        content: 'When you encounter the maximum height difference error, it is NOT a pilot mistake and CANNOT be fixed through field adjustments.',
        keyPoints: [
          'The mission cannot be generated with current marking configuration',
          'Retrying the marking process will not resolve the issue',
          'Adjusting boundary polygon size will not change the height delta',
          'Reducing orbit count will not bypass the constraint',
          'Disabling panorama/orthomosaic will not remove the height limitation',
          'This is a fundamental system constraint, not a software bug or pilot error'
        ]
      },
      {
        title: 'Field Response Protocol',
        content: 'Immediate steps to take when you encounter maximum height difference error on-site.',
        keyPoints: [
          'Step 1: STOP all marking and mission generation attempts immediately',
          'Step 2: Capture clear photos of all equipment clusters showing height differences',
          'Step 3: Screenshot the error message from mission planner',
          'Step 4: Note exact height values for lowest and highest marked points',
          'Step 5: Calculate and document the delta: "32m height difference (40m - 8m)"',
          'Step 6: Do NOT attempt workarounds like under-marking equipment heights'
        ]
      },
      {
        title: 'Support Escalation Requirements',
        content: 'What information SiteSee Support needs to provide alternative solutions.',
        keyPoints: [
          'Required info #1: Site name and customer/job reference',
          'Required info #2: Exact height values and calculated delta',
          'Required info #3: Photos showing equipment distribution and heights',
          'Required info #4: Screenshot of height difference error message',
          'Required info #5: Confirmation you have NOT attempted workarounds',
          'Support response time: Typically within 1-2 hours during business hours'
        ]
      },
      {
        title: 'Alternative Capture Strategies',
        content: 'Potential solutions that SiteSee Support may recommend for extreme height difference sites.',
        keyPoints: [
          'Option 1: Split into two separate missions (Low-level and High-level captures)',
          'Option 2: Manual mission plan with adjusted parameters (requires support approval)',
          'Option 3: Focus on single critical equipment cluster, treat others as obstacles',
          'Option 4: Panorama-only capture with manual orbit of extreme-height equipment',
          'Option 5: Hybrid approach using both autonomous and manual flight segments',
          'Decision authority: Only SiteSee Support can authorize these alternative strategies'
        ]
      },
      {
        title: 'Prevention and Planning',
        content: 'Strategies to minimize height difference violations through better planning.',
        keyPoints: [
          'Pre-site reconnaissance: Review all available site data before deployment',
          'Customer communication: Ask if site has tower-on-building configuration',
          'Historical data review: Check if previous captures exist and their approach',
          'Flagging system: Mark sites as "potential height violation" in planning system',
          'Buffer time: Schedule extra time for complex sites requiring support consultation',
          'Alternative workflows: Have panorama-only workflow ready as backup plan'
        ]
      }
    ],
    quiz: [
      {
        question: 'What is the maximum allowed height difference in a single rooftop mission?',
        options: ['15 meters', '20 meters', '25 meters', '30 meters'],
        correct: 2
      },
      {
        question: 'A rooftop has equipment clusters at 10m and 38m AGL. What should the pilot do?',
        options: [
          'Retry marking with more precise measurements',
          'Reduce boundary polygon size to fit within limit',
          'Disable panorama and orthomosaic deliverables',
          'Stop marking and contact SiteSee Support immediately'
        ],
        correct: 3
      },
      {
        question: 'Why does the 25m height difference limit exist?',
        options: [
          'Battery capacity limitations',
          'Photogrammetry reconstruction quality degrades with extreme height spreads',
          'Drone flight speed restrictions',
          'GPS accuracy limitations'
        ],
        correct: 1
      },
      {
        question: 'What information does SiteSee Support require when escalating a height difference violation?',
        options: [
          'Only site name',
          'Site name, height values, photos, error screenshot, and calculated delta',
          'Just the error message screenshot',
          'Site name and customer contact info'
        ],
        correct: 1
      },
      {
        question: 'Can the height difference limit be overridden by adjusting mission settings?',
        options: [
          'Yes, by disabling safety constraints',
          'Yes, by reducing orbit count',
          'No, it is a hard system constraint that cannot be overridden in field',
          'Yes, by using manual flight mode'
        ],
        correct: 2
      },
      {
        question: 'What should you do if you suspect a site might violate height limits BEFORE arriving on site?',
        options: [
          'Proceed to site and deal with it if it happens',
          'Contact SiteSee Support during planning phase for mission strategy',
          'Bring extra batteries to compensate',
          'Plan to fly manual orbits instead'
        ],
        correct: 1
      },
      {
        question: 'Which marking elements count toward the 25m height difference calculation?',
        options: [
          'Only equipment clusters',
          'Only equipment and obstacles',
          'All marked elements: equipment, obstacles, and neighboring buildings',
          'Only the primary equipment cluster'
        ],
        correct: 2
      },
      {
        question: 'What is a potential alternative solution for extreme height difference sites?',
        options: [
          'Pilot decides to under-mark equipment heights',
          'Skip marking highest equipment',
          'SiteSee Support may authorize splitting into two separate missions',
          'Proceed with flight despite error message'
        ],
        correct: 2
      }
    ]
  }
];

export default function RooftopTrainingModules() {
  const navigate = useNavigate();
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  // Get completed modules from localStorage
  const getCompletedModules = () => {
    try {
      const stored = localStorage.getItem('rooftop_completed_modules');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  };

  const completedModules = getCompletedModules();

  const canAccessModule = (module) => {
    // Admins can access all modules
    if (user?.role === 'admin') return true;
    if (!module.prerequisite) return true;
    return completedModules.has(module.prerequisite);
  };

  const handleModuleClick = (moduleId) => {
    navigate(createPageUrl(`RooftopModule${moduleId.replace('module', '')}`));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to={createPageUrl('TrainingHub')}>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Rooftop Mission v9.7.0</h1>
            <p className="text-slate-400">Complete Training Course</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="font-semibold">Course Progress</h3>
                <p className="text-sm text-slate-400">{completedModules.size} of {MODULES.length} modules completed</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-400">{Math.round((completedModules.size / MODULES.length) * 100)}%</p>
            </div>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedModules.size / MODULES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Modules List */}
        <div className="grid grid-cols-1 gap-4">
          {MODULES.map((module) => {
            const isComplete = completedModules.has(module.id);
            const canAccess = canAccessModule(module);

            return (
              <motion.button
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: module.number * 0.1 }}
                onClick={() => canAccess && handleModuleClick(module.id)}
                disabled={!canAccess}
                className={cn(
                  "rounded-2xl border p-6 text-left transition-all",
                  canAccess 
                    ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50 cursor-pointer" 
                    : "bg-slate-800/20 border-slate-700/20 opacity-60 cursor-not-allowed"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    isComplete ? "bg-emerald-500/20" : "bg-blue-500/20"
                  )}>
                    {isComplete ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <span className="text-xl font-bold text-blue-400">{module.number}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{module.title}</h3>
                        <p className="text-sm text-slate-400">{module.description}</p>
                      </div>
                      {canAccess && (
                        <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="text-xs bg-transparent">
                        <Clock className="w-3 h-3 mr-1" />
                        {module.estimatedTime}
                      </Badge>
                      {module.prerequisite && !canAccess && (
                        <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/30">
                          Requires Module {MODULES.find(m => m.id === module.prerequisite)?.number}
                        </Badge>
                      )}
                      {isComplete && (
                        <Badge className="text-xs bg-emerald-500/20 text-emerald-400">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Completion Message */}
        {completedModules.size === MODULES.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-2 border-emerald-500/30 p-8 text-center"
          >
            <Award className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Course Complete! 🎉</h2>
            <p className="text-slate-300">
              You've successfully completed all Rooftop Mission v9.7.0 training modules. 
              You're now ready to execute safe and accurate rooftop captures.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}