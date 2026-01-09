import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle,
  Award,
  PlayCircle,
  BookOpen,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import InfoCard from '@/components/InfoCard';
import { cn } from '@/lib/utils';

const ROOFTOP_QUESTIONS = [
  {
    id: 1,
    question: "For rooftop captures, what is the MSA (Minimum Safe Altitude) set to?",
    options: ["Equipment height", "Roof height", "10m above roof", "Ground level"],
    correct: 1
  },
  {
    id: 2,
    question: "How should you mark the facade boundary for rooftop missions?",
    options: ["Counter-clockwise", "Clockwise with external points only", "Any direction is fine", "Clockwise with concave points"],
    correct: 1
  },
  {
    id: 3,
    question: "During rooftop battery swaps, where MUST you land and takeoff?",
    options: [
      "Anywhere safe on the roof",
      "On the ground below",
      "EXACT SAME takeoff location",
      "Near the equipment"
    ],
    correct: 2
  },
  {
    id: 4,
    question: "What must be ON during rooftop flights for safety?",
    options: ["Night lights", "Return to home", "Obstacle Avoidance", "Auto landing"],
    correct: 2
  },
  {
    id: 5,
    question: "Why might you adjust shutter speed for rooftop captures?",
    options: [
      "For faster flight",
      "To manage roof surface reflections",
      "To save battery",
      "To increase altitude"
    ],
    correct: 1
  },
  {
    id: 6,
    question: "Who MUST be present on the rooftop during marking and capture?",
    options: [
      "Only the drone",
      "Building security",
      "Pilot or spotter",
      "Customer representative"
    ],
    correct: 2
  },
  {
    id: 7,
    question: "How many facade orbits are typically set for rooftop missions?",
    options: ["2 orbits", "3 orbits", "4 orbits", "5 orbits"],
    correct: 2
  },
  {
    id: 8,
    question: "What happens if you cannot land at the same takeoff location after battery swap?",
    options: [
      "Mission continues normally",
      "You can recenter the mission",
      "Mission cannot be recentered - compromised",
      "Use RTH feature"
    ],
    correct: 2
  },
  {
    id: 9,
    question: "What should you verify after GPS stabilization on battery swap?",
    options: [
      "Only battery level",
      "GPS altitude shift and camera settings",
      "Just the propellers",
      "Wind speed only"
    ],
    correct: 1
  },
  {
    id: 10,
    question: "What components might be included in a rooftop mission?",
    options: [
      "Only facade orbits",
      "Roof, Equipment, Panorama, Orthomosaic",
      "Just equipment shots",
      "Only panorama"
    ],
    correct: 1
  }
];

const TOWER_QUESTIONS = [
  {
    id: 1,
    question: "What is the minimum number of satellites required for GPS stabilization?",
    options: ["20-24", "26-32", "32-36", "36-40"],
    correct: 1
  },
  {
    id: 2,
    question: "How long should you wait for GPS stabilization on M3E (Mavic 3 Enterprise)?",
    options: ["1-2 minutes", "3-4 minutes", "5 minutes on ground before takeoff", "5 minutes at hover after takeoff"],
    correct: 2
  },
  {
    id: 3,
    question: "What should you do after a battery swap on tower missions?",
    options: [
      "Continue flying immediately",
      "Wait 5 min GPS stabilization and re-center tower",
      "Just re-center the tower",
      "Only verify camera settings"
    ],
    correct: 1
  },
  {
    id: 4,
    question: "What is the typical MSA (Minimum Safe Altitude) range for tower captures?",
    options: ["5-8m", "10-15m", "20-25m", "30-35m"],
    correct: 1
  },
  {
    id: 5,
    question: "At what gimbal angle do you mark the tower center?",
    options: ["0° gimbal", "-45° gimbal", "-60° gimbal", "-90° gimbal"],
    correct: 3
  },
  {
    id: 6,
    question: "What buffer should you add when marking obstacle altitudes?",
    options: ["No buffer needed", "+2m buffer", "+4m buffer", "+6m buffer"],
    correct: 2
  },
  {
    id: 7,
    question: "Where should the ScalePoint be placed?",
    options: [
      "Under trees for shade",
      "On elevated surface for better visibility",
      "In clear line of sight on flat surface",
      "As close to tower as possible"
    ],
    correct: 2
  },
  {
    id: 8,
    question: "What is the main cause of 'leaning' or 'ghosting' in captures?",
    options: [
      "Poor camera settings",
      "GPS instability or drift",
      "Wind conditions",
      "Wrong gimbal angle"
    ],
    correct: 1
  },
  {
    id: 9,
    question: "What are the two main capture phases for towers?",
    options: [
      "Morning and afternoon",
      "Overview (20m above) and Detailed (equipment height)",
      "Ground and aerial",
      "Front and back"
    ],
    correct: 1
  },
  {
    id: 10,
    question: "What must be ON from hover start to mission end?",
    options: ["GPS tracking", "Screen recording", "Auto exposure", "All sensors"],
    correct: 1
  }
];

export default function MissionMarkupQuiz() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [section, setSection] = useState('rooftop'); // 'rooftop' or 'tower'
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [rooftopCompleted, setRooftopCompleted] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: rooftopAttempts = [] } = useQuery({
    queryKey: ['quizAttempts', user?.email, 'rooftop'],
    queryFn: () => base44.entities.QuizAttempt.filter({ 
      pilot_id: user?.email, 
      quiz_id: 'rooftop-markup-quiz' 
    }),
    enabled: !!user?.email
  });

  const { data: towerAttempts = [] } = useQuery({
    queryKey: ['quizAttempts', user?.email, 'tower'],
    queryFn: () => base44.entities.QuizAttempt.filter({ 
      pilot_id: user?.email, 
      quiz_id: 'tower-markup-quiz' 
    }),
    enabled: !!user?.email
  });

  const QUIZ_QUESTIONS = section === 'rooftop' ? ROOFTOP_QUESTIONS : TOWER_QUESTIONS;
  const previousAttempts = section === 'rooftop' ? rooftopAttempts : towerAttempts;

  const submitQuizMutation = useMutation({
    mutationFn: (data) => base44.entities.QuizAttempt.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizAttempts'] });
    }
  });

  const calculateResults = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correct++;
      }
    });
    return {
      correct,
      total: QUIZ_QUESTIONS.length,
      score: Math.round((correct / QUIZ_QUESTIONS.length) * 100),
      passed: (correct / QUIZ_QUESTIONS.length) >= 0.7
    };
  };

  const handleSubmit = async () => {
    const results = calculateResults();
    setShowResults(true);
    
    await submitQuizMutation.mutateAsync({
      quiz_id: section === 'rooftop' ? 'rooftop-markup-quiz' : 'tower-markup-quiz',
      pilot_id: user?.email || user?.pilot_id || 'anonymous',
      score: results.score,
      total_questions: results.total,
      correct_answers: results.correct,
      completed_at: new Date().toISOString(),
      passed: results.passed
    });
  };

  const retakeQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const moveToTowerSection = () => {
    setRooftopCompleted(true);
    setSection('tower');
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setVideoWatched(false);
  };

  const bestScore = previousAttempts.length > 0 
    ? Math.max(...previousAttempts.map(a => a.score))
    : null;

  // Video intro screen
  if (!videoWatched && !quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-5 py-6 pb-20">
          <div className="flex items-center gap-3 mb-6">
            <Link to={createPageUrl('ToolsLinks')}>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{section === 'rooftop' ? 'Rooftop' : 'Tower'} Markup Training</h1>
              <p className="text-sm text-slate-400">Watch video then take quiz {section === 'rooftop' && '(Part 1 of 2)'}</p>
            </div>
          </div>

          {bestScore !== null && (
            <InfoCard variant="success" className="mb-6">
              <div className="flex items-center justify-between">
                <span>Your best score:</span>
                <span className="text-2xl font-bold">{bestScore}%</span>
              </div>
            </InfoCard>
          )}

          <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 mb-6">
            {section === 'rooftop' ? (
              <div className="aspect-video bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/M82GH-ZcWEM"
                  title="Rooftop Markup Training"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-blue-900/20 to-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800')] bg-cover bg-center opacity-20" />
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 mb-4">
                    <PlayCircle className="w-10 h-10 text-blue-400" />
                  </div>
                  <p className="text-slate-300 font-medium">Tower Capture Training Video</p>
                  <p className="text-sm text-slate-500 mt-2">Visual: Drone flying over cell tower</p>
                </div>
              </div>
            )}
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">
                {section === 'rooftop' ? 'Rooftop Capture v9.6.0' : 'Tower Capture with Scanlink'}
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                {section === 'rooftop' 
                  ? 'Learn rooftop mission setup, facade boundaries, battery swap procedures, and safety requirements.'
                  : 'Learn tower mission setup, marking procedures, MSA settings, and capture phases for cell tower sites.'}
              </p>
              <Button
                onClick={() => setVideoWatched(true)}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                I've Watched - Start Quiz
              </Button>
            </div>
          </div>

          {previousAttempts.length > 0 && (
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
              <h4 className="font-semibold mb-3">Previous Attempts</h4>
              <div className="space-y-2">
                {previousAttempts.slice(0, 5).map((attempt, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      {new Date(attempt.completed_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-semibold",
                        attempt.passed ? "text-emerald-400" : "text-red-400"
                      )}>
                        {attempt.score}%
                      </span>
                      {attempt.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Quiz results
  if (showResults) {
    const results = calculateResults();
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className={cn(
              "inline-flex items-center justify-center w-24 h-24 rounded-full mb-4",
              results.passed ? "bg-emerald-500/20" : "bg-red-500/20"
            )}>
              {results.passed ? (
                <Award className="w-12 h-12 text-emerald-400" />
              ) : (
                <XCircle className="w-12 h-12 text-red-400" />
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {results.passed ? "Quiz Passed!" : "Keep Learning"}
            </h2>
            <p className="text-slate-400">
              {results.passed 
                ? `Great work! You've demonstrated understanding of ${section === 'rooftop' ? 'rooftop' : 'tower'} capture procedures.`
                : "Review the training video and try again. You need 70% to pass."}
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-6">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-blue-400 mb-2">{results.score}%</div>
              <p className="text-slate-400">{results.correct} of {results.total} correct</p>
            </div>
            
            <div className="space-y-2 text-sm">
              {QUIZ_QUESTIONS.map((q, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-t border-slate-700">
                  <span className="text-slate-400">Question {idx + 1}</span>
                  {selectedAnswers[idx] === q.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={retakeQuiz}
              variant="outline"
              className="flex-1 border-slate-600 bg-slate-800 hover:bg-slate-700"
            >
              Retake Quiz
            </Button>
            {section === 'rooftop' && results.passed ? (
              <Button
                onClick={moveToTowerSection}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                Next: Tower Quiz →
              </Button>
            ) : section === 'tower' && results.passed ? (
              <Button
                onClick={() => navigate(createPageUrl('ToolsLinks'))}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                Complete Training
              </Button>
            ) : (
              <Button
                onClick={() => navigate(createPageUrl('ToolsLinks'))}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                Back to Training
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 mb-4">
              <BookOpen className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Ready for the Quiz?</h1>
            <p className="text-slate-400">10 questions about {section === 'rooftop' ? 'rooftop' : 'tower'} capture procedures</p>
          </div>

          <InfoCard variant="info" className="mb-6">
            <ul className="space-y-2 text-sm">
              <li>• 10 multiple choice questions</li>
              <li>• 70% required to pass</li>
              <li>• You can retake as many times as needed</li>
              <li>• Best score is saved</li>
            </ul>
          </InfoCard>

          <div className="flex gap-3">
            <Button
              onClick={() => setVideoWatched(false)}
              variant="outline"
              className="flex-1 border-slate-600 bg-slate-800 hover:bg-slate-700"
            >
              Re-watch Video
            </Button>
            <Button
              onClick={() => setQuizStarted(true)}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              Start Quiz
            </Button>
          </div>

          {user?.role === 'admin' && section === 'rooftop' && (
            <Button
              onClick={moveToTowerSection}
              variant="outline"
              className="w-full mt-3 border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin: Skip to Tower Section
            </Button>
          )}
        </motion.div>
      </div>
    );
  }

  // Quiz questions
  const question = QUIZ_QUESTIONS[currentQuestion];
  const isLastQuestion = currentQuestion === QUIZ_QUESTIONS.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-5 py-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-slate-400">
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </div>
          <div className="flex gap-1">
            {QUIZ_QUESTIONS.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  selectedAnswers[idx] !== undefined
                    ? "bg-blue-400"
                    : idx === currentQuestion
                    ? "bg-slate-400"
                    : "bg-slate-700"
                )}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-8">{question.question}</h2>

            <div className="space-y-3 mb-8">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestion]: idx }))}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all",
                    selectedAnswers[currentQuestion] === idx
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      selectedAnswers[currentQuestion] === idx
                        ? "border-blue-500 bg-blue-500"
                        : "border-slate-600"
                    )}>
                      {selectedAnswers[currentQuestion] === idx && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                disabled={currentQuestion === 0}
                variant="outline"
                className="flex-1 border-slate-600 bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
              >
                Previous
              </Button>
              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(selectedAnswers).length !== QUIZ_QUESTIONS.length}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  Next
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}