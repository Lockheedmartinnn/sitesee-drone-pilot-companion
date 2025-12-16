import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ActionButton({ 
  icon: Icon, 
  label, 
  sublabel,
  variant = 'default',
  onClick,
  className,
  index = 0
}) {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl shadow-blue-500/25",
    default: "bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/50",
    warning: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30",
    success: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200",
        variants[variant],
        className
      )}
    >
      {Icon && (
        <div className={cn(
          "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
          variant === 'primary' ? "bg-white/20" : "bg-slate-700/50"
        )}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className="flex-1 text-left min-w-0">
        <p className="font-semibold text-lg">{label}</p>
        {sublabel && (
          <p className={cn(
            "text-sm mt-0.5",
            variant === 'primary' ? "text-blue-100" : "text-slate-400"
          )}>
            {sublabel}
          </p>
        )}
      </div>
      <ChevronRight className={cn(
        "w-5 h-5 flex-shrink-0",
        variant === 'primary' ? "text-blue-200" : "text-slate-500"
      )} />
    </motion.button>
  );
}