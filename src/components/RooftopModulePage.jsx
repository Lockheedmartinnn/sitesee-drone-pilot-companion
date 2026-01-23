import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Circle, 
  ChevronDown,
  ChevronRight,
  PlayCircle,
  BookOpen,
  Target,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function RooftopModulePage({ moduleData, totalModules }) {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showCongrats, setShowCongrats] = useState(false);

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

  const [completedModules, setCompletedModules] = useState(getCompletedModules());

  const toggleSection = (sectionIndex) => {
    setExpandedSection(prev => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex]
    }));
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const calculateQuizScore = () => {
    if (!moduleData.quiz) return 0;
    let correct = 0;
    moduleData.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) {
        correct++;
      }
    });
    return Math.round((correct / moduleData.quiz.length) * 100);
  };

  const isQuizComplete = () => {
    if (!moduleData.quiz) return false;
    return moduleData.quiz.every((_, i) => quizAnswers[i] !== undefined);
  };

  const quizScore = calculateQuizScore();
  const quizComplete = isQuizComplete();
  const isModuleComplete = completedModules.has(moduleData.id);

  const handleCompleteModule = () => {
    const updated = new Set([...completedModules, moduleData.id]);
    setCompletedModules(updated);
    localStorage.setItem('rooftop_completed_modules', JSON.stringify([...updated]));
    setShowCongrats(true);
    setTimeout(() => setShowCongrats(false), 3000);
  };

  const handleNext = () => {
    if (moduleData.number < totalModules) {
      navigate(createPageUrl(`RooftopModule${moduleData.number + 1}`));
    } else {
      navigate(createPageUrl('RooftopTrainingModules'));
    }
  };

  const handlePrevious = () => {
    if (moduleData.number > 1) {
      navigate(createPageUrl(`RooftopModule${moduleData.number - 1}`));
    } else {
      navigate(createPageUrl('RooftopTrainingModules'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(createPageUrl('RooftopTrainingModules'))}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Course</span>
          </button>
          <Badge variant="outline" className="text-xs bg-transparent">
            Module {moduleData.number} of {totalModules}
          </Badge>
        </div>

        {/* Module Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0",
              isModuleComplete ? "bg-emerald-500/20" : "bg-blue-500/20"
            )}>
              {isModuleComplete ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              ) : (
                <span className="text-2xl font-bold text-blue-400">{moduleData.number}</span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{moduleData.title}</h1>
              <p className="text-slate-400">{moduleData.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="text-xs bg-transparent">
                  {moduleData.estimatedTime}
                </Badge>
                {isModuleComplete && (
                  <Badge className="text-xs bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-lg">Learning Objectives</h3>
            </div>
            <ul className="space-y-3">
              {moduleData.goals.map((goal, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <ChevronRight className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <PlayCircle className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold text-lg">Training Video</h3>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${moduleData.videoId}`}
                title={moduleData.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </motion.div>

        {/* Key Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-lg">Key Topics</h3>
            </div>
            <div className="space-y-3">
              {moduleData.sections.map((section, idx) => (
                <div key={idx} className="rounded-xl border border-slate-700/50 overflow-hidden">
                  <button
                    onClick={() => toggleSection(idx)}
                    className="w-full p-4 text-left hover:bg-slate-700/30 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium">{section.title}</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-slate-400 transition-transform",
                      expandedSection[idx] && "rotate-180"
                    )} />
                  </button>
                  <AnimatePresence>
                    {expandedSection[idx] && (
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
        </motion.div>

        {/* Quiz */}
        {moduleData.quiz && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Knowledge Check</h3>
                {quizComplete && (
                  <Badge className={cn(
                    quizScore >= 70 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                  )}>
                    Score: {quizScore}%
                  </Badge>
                )}
              </div>
              <div className="space-y-4">
                {moduleData.quiz.map((question, qIdx) => {
                  const userAnswer = quizAnswers[qIdx];
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
                              onClick={() => handleQuizAnswer(qIdx, oIdx)}
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
              
              {((quizComplete && quizScore >= 70) || user?.role === 'admin') && !isModuleComplete && (
                <Button
                  onClick={handleCompleteModule}
                  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete Module {user?.role === 'admin' && '(Admin)'}
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* Congratulations Message */}
        <AnimatePresence>
          {showCongrats && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-2 border-emerald-500/50 rounded-2xl p-8 text-center backdrop-blur-xl">
                <Award className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Module Complete! 🎉</h2>
                <p className="text-slate-300">Great work! Ready for the next module?</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-700/50">
          <Button
            onClick={handlePrevious}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {moduleData.number > 1 ? 'Previous Module' : 'Course Overview'}
          </Button>
          
          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {moduleData.number < totalModules ? 'Next Module' : 'Course Overview'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}