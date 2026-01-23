import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
      'Safely plan missions in obstacle-dense rooftop environments',
      'Correctly classify and mark enveloped vs non-enveloped obstacles',
      'Identify and mitigate neighbouring high-rise risks',
      'Interpret the 3D flight plan colour logic'
    ],
    sections: [
      {
        title: 'Marking On-Roof Obstacles',
        content: 'Obstacles must be marked individually. The system does not assume heights, boundaries, or risk zones.',
        keyPoints: [
          'Enveloped obstacles: Drone flies around and above with safe clearance',
          'Each obstacle needs height and boundary points marked',
          'If you don\'t mark it, the drone does not respect it'
        ]
      },
      {
        title: 'Neighbouring High-Rise Buildings',
        content: 'Neighbouring high-rises are the most dangerous obstacles.',
        keyPoints: [
          'Mark height and boundary even if outside rooftop',
          'Creates a no-fly constraint in mission planner',
          'Failure to mark can result in collision trajectory'
        ]
      },
      {
        title: '3D Plan Colour Key',
        content: 'Understanding the colour coding in the 3D mission plan.',
        keyPoints: [
          'Dark Blue → Building structure',
          'Green → Equipment clusters',
          'Pink → Enveloped obstacles',
          'Grey → Non-enveloped obstacles',
          'Light Blue → Drone trajectory'
        ]
      }
    ],
    quiz: [
      {
        question: 'Why must equipment be marked before obstacles?',
        options: [
          'It speeds up marking',
          'It defines the reference for all obstacle clearance calculations',
          'It reduces orbits',
          'It improves panorama quality'
        ],
        correct: 1
      },
      {
        question: 'What happens if a neighbouring building is not marked?',
        options: [
          'The drone avoids it automatically',
          'The flight plan may intersect with it',
          'Processing fails',
          'Panorama is skipped'
        ],
        correct: 1
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
      'Correctly plan a Greenfields rooftop mission',
      'Understand why the system requires a reference object',
      'Resolve the "Missing marking for equipment or obstacles" error',
      'Select an appropriate proxy obstacle when no equipment exists'
    ],
    sections: [
      {
        title: 'System Constraint',
        content: 'NexDT cannot generate a mission without at least one vertical reference object.',
        keyPoints: [
          'System requires Equipment OR Obstacle to be marked',
          'This defines relative rooftop geometry',
          'No exceptions to this rule'
        ]
      },
      {
        title: 'The Greenfields Workaround',
        content: 'When no equipment exists, identify any vertical rooftop feature.',
        keyPoints: [
          'Mark any vertical feature as a reference obstacle',
          'Examples: Small shelter, vent, lift overrun, HVAC unit',
          'This is a geometry anchor, not a hazard'
        ]
      },
      {
        title: 'Creating a Reference Obstacle',
        content: 'Step-by-step process for marking a reference object.',
        keyPoints: [
          'Identify a small rooftop feature',
          'Mark it as an Obstacle',
          'Fly to its height and mark height/boundary',
          'System can now generate the flight path'
        ]
      }
    ],
    quiz: [
      {
        question: 'Why does the system require at least one marked object?',
        options: [
          'To increase image overlap',
          'To define relative rooftop geometry',
          'To improve battery efficiency',
          'To enable panorama capture'
        ],
        correct: 1
      },
      {
        question: 'What should happen if no equipment exists on a Greenfields rooftop?',
        options: [
          'Skip the mission',
          'Mark a small vertical feature as reference obstacle',
          'Only fly panorama',
          'Contact support immediately'
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
      'Understand the Maximum Height Difference constraint',
      'Correctly identify when a mission cannot be generated',
      'Know exactly when to stop and escalate',
      'Communicate issues clearly to SiteSee Support'
    ],
    sections: [
      {
        title: 'The 25m Height Limit',
        content: 'NexDT enforces a maximum 25m height difference between lowest and highest marked points.',
        keyPoints: [
          'Calculated as: Highest point - Lowest point',
          'Example: 40m - 8m = 32m (EXCEEDS LIMIT)',
          'This is a hard system constraint'
        ]
      },
      {
        title: 'This Is a STOP Condition',
        content: 'This is not a pilot error and cannot be fixed in the field.',
        keyPoints: [
          'The mission cannot be generated',
          'Retrying will not help',
          'Adjusting boundaries will not help'
        ]
      },
      {
        title: 'Escalation Protocol',
        content: 'What to do when you encounter this error.',
        keyPoints: [
          'Stop mission creation immediately',
          'Capture screenshots of equipment heights and error message',
          'Contact SiteSee Support with: site name, height values, confirmation of delta',
          'Request manual mission adjustment or alternative workflow'
        ]
      }
    ],
    quiz: [
      {
        question: 'What is the maximum allowed height difference in a single rooftop mission?',
        options: ['15m', '20m', '25m', '30m'],
        correct: 2
      },
      {
        question: 'A rooftop has equipment clusters at 10m and 38m. What should the pilot do?',
        options: [
          'Retry marking',
          'Reduce boundary size',
          'Disable panorama',
          'Stop and contact SiteSee Support'
        ],
        correct: 3
      }
    ]
  }
];

export default function RooftopTrainingModules() {
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedSection, setExpandedSection] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [completedModules, setCompletedModules] = useState(new Set());

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const toggleSection = (moduleId, sectionIndex) => {
    const key = `${moduleId}-${sectionIndex}`;
    setExpandedSection(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleQuizAnswer = (moduleId, questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [`${moduleId}-${questionIndex}`]: answerIndex
    }));
  };

  const calculateQuizScore = (moduleId) => {
    const module = MODULES.find(m => m.id === moduleId);
    if (!module?.quiz) return 0;

    let correct = 0;
    module.quiz.forEach((q, i) => {
      if (quizAnswers[`${moduleId}-${i}`] === q.correct) {
        correct++;
      }
    });
    return Math.round((correct / module.quiz.length) * 100);
  };

  const isModuleComplete = (moduleId) => {
    const module = MODULES.find(m => m.id === moduleId);
    if (!module?.quiz) return false;

    return module.quiz.every((_, i) => 
      quizAnswers[`${moduleId}-${i}`] !== undefined
    );
  };

  const canAccessModule = (module) => {
    // Admins can access all modules
    if (user?.role === 'admin') return true;
    if (!module.prerequisite) return true;
    return completedModules.has(module.prerequisite);
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
        <div className="space-y-4">
          {MODULES.map((module) => {
            const isExpanded = expandedModule === module.id;
            const isComplete = completedModules.has(module.id);
            const canAccess = canAccessModule(module);
            const quizScore = calculateQuizScore(module.id);
            const quizComplete = isModuleComplete(module.id);

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: module.number * 0.1 }}
                className={cn(
                  "rounded-2xl border overflow-hidden",
                  canAccess 
                    ? "bg-slate-800/50 border-slate-700/50" 
                    : "bg-slate-800/20 border-slate-700/20 opacity-60"
                )}
              >
                {/* Module Header */}
                <button
                  onClick={() => canAccess && toggleModule(module.id)}
                  disabled={!canAccess}
                  className="w-full p-6 text-left hover:bg-slate-700/30 transition-colors disabled:cursor-not-allowed"
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
                          <ChevronDown className={cn(
                            "w-5 h-5 text-slate-400 transition-transform flex-shrink-0",
                            isExpanded && "rotate-180"
                          )} />
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline" className="text-xs bg-transparent">
                          <Clock className="w-3 h-3 mr-1" />
                          {module.estimatedTime}
                        </Badge>
                        {module.prerequisite && (
                          <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/30">
                            Requires Module {MODULES.find(m => m.id === module.prerequisite)?.number}
                          </Badge>
                        )}
                        {quizComplete && (
                          <Badge className={cn(
                            "text-xs",
                            quizScore >= 70 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                          )}>
                            Quiz: {quizScore}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Module Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-700/50"
                    >
                      <div className="p-6 space-y-6">
                        {/* Goals */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Target className="w-5 h-5 text-blue-400" />
                            <h4 className="font-semibold">Module Goals</h4>
                          </div>
                          <ul className="space-y-2">
                            {module.goals.map((goal, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                {goal}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Video */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <PlayCircle className="w-5 h-5 text-red-400" />
                            <h4 className="font-semibold">Training Video</h4>
                          </div>
                          <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${module.videoId}`}
                              title={module.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>

                        {/* Sections */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="w-5 h-5 text-emerald-400" />
                            <h4 className="font-semibold">Key Topics</h4>
                          </div>
                          <div className="space-y-2">
                            {module.sections.map((section, idx) => (
                              <div key={idx} className="rounded-xl border border-slate-700/50 overflow-hidden">
                                <button
                                  onClick={() => toggleSection(module.id, idx)}
                                  className="w-full p-4 text-left hover:bg-slate-700/30 transition-colors flex items-center justify-between"
                                >
                                  <span className="font-medium">{section.title}</span>
                                  <ChevronDown className={cn(
                                    "w-4 h-4 text-slate-400 transition-transform",
                                    expandedSection[`${module.id}-${idx}`] && "rotate-180"
                                  )} />
                                </button>
                                <AnimatePresence>
                                  {expandedSection[`${module.id}-${idx}`] && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="border-t border-slate-700/50 p-4 bg-slate-900/30"
                                    >
                                      <p className="text-sm text-slate-300 mb-3">{section.content}</p>
                                      <ul className="space-y-2">
                                        {section.keyPoints.map((point, i) => (
                                          <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                            <Circle className="w-2 h-2 fill-blue-400 text-blue-400 flex-shrink-0 mt-1.5" />
                                            {point}
                                          </li>
                                        ))}
                                      </ul>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quiz */}
                        {module.quiz && (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold">Knowledge Check</h4>
                              {quizComplete && (
                                <Badge className={cn(
                                  quizScore >= 70 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                                )}>
                                  Score: {quizScore}%
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-4">
                              {module.quiz.map((question, qIdx) => {
                                const userAnswer = quizAnswers[`${module.id}-${qIdx}`];
                                const hasAnswered = userAnswer !== undefined;
                                const isCorrect = userAnswer === question.correct;

                                return (
                                  <div key={qIdx} className="rounded-xl border border-slate-700/50 p-4 bg-slate-900/30">
                                    <p className="font-medium mb-3">{qIdx + 1}. {question.question}</p>
                                    <div className="space-y-2">
                                      {question.options.map((option, oIdx) => {
                                        const isSelected = userAnswer === oIdx;
                                        const isCorrectOption = oIdx === question.correct;
                                        
                                        return (
                                          <button
                                            key={oIdx}
                                            onClick={() => handleQuizAnswer(module.id, qIdx, oIdx)}
                                            className={cn(
                                              "w-full text-left p-3 rounded-lg border transition-all",
                                              isSelected && hasAnswered && isCorrect && "border-emerald-500 bg-emerald-500/10",
                                              isSelected && hasAnswered && !isCorrect && "border-red-500 bg-red-500/10",
                                              !isSelected && hasAnswered && isCorrectOption && "border-emerald-500/50 bg-emerald-500/5",
                                              !hasAnswered && "border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50"
                                            )}
                                            disabled={hasAnswered}
                                          >
                                            <div className="flex items-center gap-3">
                                              <div className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                                isSelected && hasAnswered && isCorrect && "border-emerald-500 bg-emerald-500",
                                                isSelected && hasAnswered && !isCorrect && "border-red-500 bg-red-500",
                                                !isSelected && hasAnswered && isCorrectOption && "border-emerald-500",
                                                !hasAnswered && "border-slate-600"
                                              )}>
                                                {isSelected && hasAnswered && (
                                                  isCorrect ? (
                                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                                  ) : (
                                                    <span className="text-white text-xs">✕</span>
                                                  )
                                                )}
                                                {!isSelected && hasAnswered && isCorrectOption && (
                                                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                )}
                                              </div>
                                              <span className="text-sm">{option}</span>
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            {((quizComplete && quizScore >= 70) || user?.role === 'admin') && !isComplete && (
                              <Button
                                onClick={() => setCompletedModules(prev => new Set([...prev, module.id]))}
                                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Mark Module as Complete {user?.role === 'admin' && '(Admin)'}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
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