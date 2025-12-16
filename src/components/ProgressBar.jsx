import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ProgressBar({ current, total, labels = [] }) {
  const progress = (current / total) * 100;
  
  return (
    <div className="w-full">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-2 px-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
              i + 1 < current 
                ? "bg-emerald-500 text-white"
                : i + 1 === current
                  ? "bg-blue-500 text-white ring-4 ring-blue-500/30"
                  : "bg-slate-700 text-slate-400"
            )}
          >
            {i + 1}
          </div>
        ))}
      </div>
      
      {/* Progress track */}
      <div className="relative h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      
      {/* Current step label */}
      {labels[current - 1] && (
        <p className="text-center text-sm text-slate-400 mt-3 font-medium">
          {labels[current - 1]}
        </p>
      )}
    </div>
  );
}