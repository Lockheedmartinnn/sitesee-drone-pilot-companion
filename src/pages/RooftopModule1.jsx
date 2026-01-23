import React from 'react';
import RooftopModulePage from '@/components/RooftopModulePage';

const MODULE_DATA = {
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
};

export default function RooftopModule1() {
  return <RooftopModulePage moduleData={MODULE_DATA} totalModules={5} />;
}