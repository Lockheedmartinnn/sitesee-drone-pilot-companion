import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Clock, BookOpen, Lightbulb, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_STYLES = {
  optimal: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  good: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  marginal: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  avoid: 'bg-red-500/20 text-red-300 border-red-500/30',
  authorised: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  illegal: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function EnvGuidePage({ guideData, totalGuides }) {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isComplete, setIsComplete] = useState(() => {
    try { return localStorage.getItem(`env_guide_complete_${guideData.id}`) === 'true'; } catch { return false; }
  });

  const toggleSection = (i) => setExpandedSection(expandedSection === i ? null : i);

  const handleQuizAnswer = (qIdx, aIdx) => {
    if (!quizSubmitted) setQuizAnswers(prev => ({ ...prev, [qIdx]: aIdx }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    const allCorrect = guideData.quiz.every((q, i) => quizAnswers[i] === q.correct);
    if (allCorrect) {
      try { localStorage.setItem(`env_guide_complete_${guideData.id}`, 'true'); } catch {}
      setIsComplete(true);
    }
  };

  const score = quizSubmitted
    ? guideData.quiz.filter((q, i) => quizAnswers[i] === q.correct).length
    : 0;

  const allAnswered = guideData.quiz.every((_, i) => quizAnswers[i] !== undefined);

  const nextPage = guideData.number < totalGuides ? `EnvGuide${guideData.number + 1}` : null;
  const prevPage = guideData.number > 1 ? `EnvGuide${guideData.number - 1}` : 'EnvGuideModules';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-5 py-8 pb-24">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl('EnvGuideModules'))}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${guideData.textClass}`}>
              Guide {guideData.number} of {totalGuides} · {guideData.estimatedTime}
            </p>
          </div>
          {isComplete && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto flex-shrink-0" />
          )}
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-6 mb-6 ${guideData.bgClass} ${guideData.borderClass}`}
        >
          <div className="text-5xl mb-4">{guideData.emoji}</div>
          <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${guideData.textClass}`}>{guideData.subtitle}</p>
          <h1 className="text-2xl font-bold text-white mb-3">{guideData.title}</h1>
          <p className="text-slate-300 text-sm leading-relaxed">{guideData.intro}</p>
        </motion.div>

        {/* Key Rule */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Key Rule</p>
            <p className="text-sm text-slate-200 leading-relaxed">{guideData.keyRule}</p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3 mb-6">
          {guideData.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection(i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${guideData.bgClass} ${guideData.textClass}`}>
                    {i + 1}
                  </div>
                  <span className="font-semibold text-white text-sm">{section.title}</span>
                </div>
                {expandedSection === i
                  ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                }
              </button>
              <AnimatePresence>
                {expandedSection === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-slate-700 pt-4">
                      <p className="text-slate-300 text-sm leading-relaxed mb-4">{section.content}</p>
                      {section.keyPoints && (
                        <ul className="space-y-2">
                          {section.keyPoints.map((pt, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${guideData.textClass}`} />
                              {pt}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Time Windows */}
        {guideData.timeWindows && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Time Windows</p>
            </div>
            <div className="space-y-2">
              {guideData.timeWindows.map((w, i) => (
                <div key={i} className={`border rounded-lg px-3 py-2 text-xs font-medium ${STATUS_STYLES[w.status] || STATUS_STYLES.marginal}`}>
                  <span className="font-bold">{w.window}</span> — {w.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Failure Mode Warning */}
        {guideData.failureMode && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Primary Failure Mode</p>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{guideData.failureMode}</p>
          </div>
        )}

        {/* Quiz */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white">Knowledge Check</h3>
          </div>

          {guideData.quiz.map((q, qIdx) => (
            <div key={qIdx} className="mb-6 last:mb-0">
              <p className="text-sm font-semibold text-white mb-3">{qIdx + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, aIdx) => {
                  const selected = quizAnswers[qIdx] === aIdx;
                  const isCorrect = aIdx === q.correct;
                  let cls = 'border border-slate-600 bg-slate-700/50 text-slate-300 hover:bg-slate-700';
                  if (selected && !quizSubmitted) cls = 'border border-blue-500 bg-blue-500/20 text-white';
                  if (quizSubmitted && isCorrect) cls = 'border border-emerald-500 bg-emerald-500/20 text-emerald-300';
                  if (quizSubmitted && selected && !isCorrect) cls = 'border border-red-500 bg-red-500/20 text-red-300';
                  return (
                    <button
                      key={aIdx}
                      onClick={() => handleQuizAnswer(qIdx, aIdx)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${cls}`}
                    >
                      <div className="flex items-center gap-2">
                        {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                        {quizSubmitted && selected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                        {opt}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!quizSubmitted ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={!allAnswered}
              className="w-full bg-blue-500 hover:bg-blue-600 mt-4 disabled:opacity-40"
            >
              Submit Answers
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-4 rounded-xl p-4 text-center border ${score === guideData.quiz.length ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}
            >
              <div className="text-3xl mb-2">{score === guideData.quiz.length ? '🎯' : '📖'}</div>
              <p className="font-bold text-white">{score}/{guideData.quiz.length} correct</p>
              <p className="text-sm text-slate-400 mt-1">
                {score === guideData.quiz.length
                  ? 'Excellent — guide marked complete.'
                  : 'Review the sections above and try again.'}
              </p>
              {score < guideData.quiz.length && (
                <Button
                  onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                  variant="outline"
                  className="mt-3 border-slate-600 text-sm"
                >
                  Retry Quiz
                </Button>
              )}
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl(prevPage))}
            className="flex-1 border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {guideData.number === 1 ? 'All Guides' : 'Previous'}
          </Button>
          {nextPage && (
            <Button
              onClick={() => navigate(createPageUrl(nextPage))}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              Next Guide
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {!nextPage && (
            <Button
              onClick={() => navigate(createPageUrl('EnvGuideModules'))}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              All Guides
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}