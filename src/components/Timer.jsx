import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGpsTimer } from '@/hooks/useGpsTimer';

export default function Timer({
  targetMinutes = 2,
  onComplete,
  onSkip,
  onStart,
  label = "GPS Stabilisation Timer",
  isAdmin = false
}) {
  const {
    elapsedSeconds,
    progress,
    isComplete,
    isRunning,
    isStarted,
    start,
    pause,
    resume,
    reset,
    completeNow,
    targetSeconds,
  } = useGpsTimer(targetMinutes);

  const onStartRef = useRef(onStart);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onStartRef.current = onStart; }, [onStart]);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // Fire onStart when timer transitions to running (not on mount if already running)
  const prevRunning = useRef(isRunning);
  useEffect(() => {
    if (isRunning && !prevRunning.current) {
      onStartRef.current?.();
    }
    prevRunning.current = isRunning;
  }, [isRunning]);

  // Fire onComplete when timer completes (including on mount if already complete)
  const prevComplete = useRef(false);
  useEffect(() => {
    if (isComplete && !prevComplete.current) {
      onCompleteRef.current?.();
    }
    prevComplete.current = isComplete;
  }, [isComplete]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggle = useCallback(() => {
    if (isComplete) {
      start();
    } else if (isRunning) {
      pause();
    } else if (isStarted) {
      resume();
    } else {
      start();
    }
  }, [isComplete, isRunning, isStarted, start, pause, resume]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const handleSkip = useCallback(() => {
    completeNow();
    onSkip?.();
  }, [completeNow, onSkip]);

  return (
    <div className={cn(
      "rounded-3xl p-6 transition-all duration-500",
      isComplete
        ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-2 border-emerald-500/30"
        : "bg-gradient-to-br from-slate-800 to-slate-800/50 border-2 border-slate-700/50"
    )}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-400 text-center flex-1">{label}</p>
        {isAdmin && !isComplete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
          >
            Skip ({targetMinutes}m)
          </Button>
        )}
      </div>

      {/* Circular Progress */}
      <div className="relative w-40 h-40 mx-auto mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-slate-700"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className={isComplete ? "text-emerald-500" : "text-blue-500"}
            strokeDasharray={283}
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="complete"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-emerald-500"
              >
                <CheckCircle2 className="w-12 h-12" />
              </motion.div>
            ) : (
              <motion.span
                key="time"
                className="text-4xl font-bold text-white tabular-nums"
              >
                {formatTime(elapsedSeconds)}
              </motion.span>
            )}
          </AnimatePresence>
          {!isComplete && (
            <span className="text-sm text-slate-500 mt-1">
              / {formatTime(targetSeconds)}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          className="w-12 h-12 rounded-full border-slate-600 bg-slate-800 hover:bg-slate-700"
        >
          <RotateCcw className="w-5 h-5 text-slate-300" />
        </Button>
        <Button
          onClick={handleToggle}
          className={cn(
            "w-16 h-16 rounded-full transition-all duration-300",
            isComplete
              ? "bg-emerald-500 hover:bg-emerald-600"
              : isRunning
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-blue-500 hover:bg-blue-600"
          )}
        >
          {isRunning ? (
            <Pause className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7 ml-1" />
          )}
        </Button>
        <div className="w-12 h-12" /> {/* Spacer for balance */}
      </div>

      {isComplete && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-emerald-400 font-medium mt-4"
        >
          GPS stabilization complete. Ready to proceed.
        </motion.p>
      )}
    </div>
  );
}