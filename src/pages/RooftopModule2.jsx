import React from 'react';
import RooftopModulePage from '@/components/RooftopModulePage';

const MODULE_DATA = {
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
};

export default function RooftopModule2() {
  return <RooftopModulePage moduleData={MODULE_DATA} totalModules={5} />;
}