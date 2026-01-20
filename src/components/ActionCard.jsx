import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function ActionCard({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  variant = 'default',
  badge = null 
}) {
  const variants = {
    default: 'bg-slate-800 hover:bg-slate-700 border-slate-700',
    primary: 'bg-blue-600 hover:bg-blue-700 border-blue-500',
    success: 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500',
    warning: 'bg-amber-600 hover:bg-amber-700 border-amber-500',
    danger: 'bg-rose-600 hover:bg-rose-700 border-rose-500'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full p-6 rounded-xl border-2 transition-all duration-200 text-left group ${variants[variant]}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {badge && (
              <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-white/80">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white/80 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </motion.button>
  );
}