import React from 'react';
import RooftopModulePage from '@/components/RooftopModulePage';

const MODULE_DATA = {
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
};

export default function RooftopModule4() {
  return <RooftopModulePage moduleData={MODULE_DATA} totalModules={5} />;
}