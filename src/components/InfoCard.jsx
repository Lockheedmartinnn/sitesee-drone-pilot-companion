import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  info: {
    icon: Info,
    bg: "bg-blue-500/10 border-blue-500/30",
    iconColor: "text-blue-400",
    textColor: "text-blue-300"
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-500/10 border-amber-500/30",
    iconColor: "text-amber-400",
    textColor: "text-amber-300"
  },
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-500/10 border-emerald-500/30",
    iconColor: "text-emerald-400",
    textColor: "text-emerald-300"
  },
  danger: {
    icon: XCircle,
    bg: "bg-red-500/10 border-red-500/30",
    iconColor: "text-red-400",
    textColor: "text-red-300"
  }
};

export default function InfoCard({ 
  variant = 'info', 
  title, 
  children,
  className 
}) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl border p-4",
        config.bg,
        className
      )}
    >
      <div className="flex gap-3">
        <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconColor)} />
        <div>
          {title && (
            <p className={cn("font-semibold mb-1", config.textColor)}>{title}</p>
          )}
          <div className="text-sm text-slate-300 space-y-1">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}