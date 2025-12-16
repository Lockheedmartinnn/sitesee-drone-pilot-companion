import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChecklistItem({ 
  label, 
  sublabel,
  checked, 
  onToggle, 
  critical = false,
  disabled = false 
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "w-full flex items-start gap-4 p-4 rounded-2xl transition-all duration-200",
        "border-2 text-left",
        checked 
          ? "bg-emerald-500/10 border-emerald-500/30" 
          : critical 
            ? "bg-amber-500/5 border-amber-500/20" 
            : "bg-slate-800/50 border-slate-700/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200",
        checked 
          ? "bg-emerald-500 text-white" 
          : "bg-slate-700 text-slate-500"
      )}>
        {checked ? (
          <Check className="w-4 h-4" strokeWidth={3} />
        ) : (
          <Circle className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-base font-medium transition-colors",
          checked ? "text-emerald-400" : "text-white"
        )}>
          {label}
        </p>
        {sublabel && (
          <p className="text-sm text-slate-400 mt-0.5">{sublabel}</p>
        )}
      </div>
      {critical && !checked && (
        <span className="flex-shrink-0 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full">
          Critical
        </span>
      )}
    </motion.button>
  );
}