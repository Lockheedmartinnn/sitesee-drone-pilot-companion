import React from 'react';
import RooftopModulePage from '@/components/RooftopModulePage';

const MODULE_DATA = {
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
};

export default function RooftopModule3() {
  return <RooftopModulePage moduleData={MODULE_DATA} totalModules={5} />;
}