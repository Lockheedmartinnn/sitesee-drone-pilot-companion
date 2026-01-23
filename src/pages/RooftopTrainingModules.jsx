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
      'Understand what changed in Rooftop Mission v9.7.0',
      'Configure flight settings correctly for the new mission',
      'Execute rooftop captures faster, safer, and with higher reconstruction accuracy',
      'Avoid common failure modes (ghosting, poor overlap, battery-related GPS drift)'
    ],
    sections: [
      {
        title: 'What Changed in Rooftop Mission v9.7.0',
        content: 'Rooftop Mission v9.7.0 was designed to remove unnecessary complexity while improving output quality and reducing time on site.',
        keyPoints: [
          'Enhanced detail - High-resolution textures for component inspection',
          'Reduced site time - Faster flight speed, fewer images, lower battery swap likelihood',
          'Simplified flight path - Single-layer planar overview at −45°'
        ]
      },
      {
        title: 'Technical Flight Settings (Must-Know)',
        content: 'This section is non-negotiable. Incorrect settings = failed capture.',
        keyPoints: [
          'Drone speed increased 2× for planar and equipment orbit capture',
          'Capture interval MUST be set to 1 second (not 2 seconds)',
          'At higher speed, 2 seconds = insufficient overlap'
        ]
      },
      {
        title: 'Mission Marking - What\'s Now Simpler',
        content: 'The marking process has been intentionally simplified.',
        keyPoints: [
          'Planar height → auto-calculated',
          'No need to mark mid-equipment heights or MSA',
          'Rooftop boundaries can be marked clockwise OR anti-clockwise'
        ]
      },
      {
        title: 'GPS Stabilization & Battery Strategy',
        content: 'Even with faster missions, GPS discipline still matters.',
        keyPoints: [
          'Typical rooftop missions: ~20 minutes (previously ~40)',
          'Single battery strategy preferred - prevents altitude jumps',
          'Initial manual GPS stabilization still required before takeoff'
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
          'Mid-equipment heights only',
          'Manual MSA calculations only',
          'All of the above',
          'None - all still required'
        ],
        correct: 2
      },
      {
        question: 'Why is a single battery strategy preferred?',
        options: [
          'Faster uploads',
          'Better video quality',
          'More consistent GPS reference',
          'Less pilot fatigue'
        ],
        correct: 2
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
      'Correctly plan and execute a multi-level rooftop capture',
      'Mark multiple equipment clusters at different elevations',
      'Understand why orbit count differs between high and low clusters',
      'Validate the generated 3D mission plan before takeoff'
    ],
    sections: [
      {
        title: 'Scenario Overview',
        content: 'Rooftop with two equipment clusters at different elevations. Each cluster must be treated as its own vertical system.',
        keyPoints: [
          'Each equipment cluster exists in its own vertical plane',
          'Each cluster must be marked independently',
          'Heights cannot be assumed or averaged'
        ]
      },
      {
        title: 'Marking Equipment Clusters',
        content: 'Each cluster is marked separately at its specific height.',
        keyPoints: [
          'Lower cluster: Fly to equipment height (e.g., 8m), mark height/center/radius',
          'Higher cluster: Fly to its height (e.g., 13m), repeat marking process',
          'Do NOT reuse values from Cluster 1'
        ]
      },
      {
        title: 'Understanding Orbit Logic',
        content: 'Lower clusters often require more orbits to properly tie into the planar model.',
        keyPoints: [
          'Lower clusters: More orbits (e.g., 4) for stronger tie-in',
          'Higher clusters: Fewer orbits (e.g., 2) as they\'re covered by planar passes',
          'This is intentional system logic, not an error'
        ]
      }
    ],
    quiz: [
      {
        question: 'Why must the drone be physically flown to the cluster height before marking?',
        options: [
          'For GPS accuracy',
          'To correctly define the vertical orbit reference',
          'To speed up marking',
          'To reduce image count'
        ],
        correct: 1
      },
      {
        question: 'What is the biggest mistake pilots make on multi-level rooftops?',
        options: [
          'Flying too high',
          'Treating multiple clusters as one height',
          'Marking too many points',
          'Choosing wrong deliverables'
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
                        <Badge variant="outline" className="text-xs">
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
                            
                            {quizComplete && quizScore >= 70 && !isComplete && (
                              <Button
                                onClick={() => setCompletedModules(prev => new Set([...prev, module.id]))}
                                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Mark Module as Complete
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