import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VideoCard({ 
  title, 
  description, 
  duration, 
  thumbnail,
  index = 0,
  onClick 
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 text-left group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-slate-700/50 flex items-center justify-center">
              <Play className="w-8 h-8 text-slate-500" />
            </div>
          </div>
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <div className={cn(
            "w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center",
            "opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100",
            "transition-all duration-300 shadow-xl shadow-blue-500/30"
          )}>
            <Play className="w-7 h-7 text-white ml-1" fill="white" />
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-lg">
          <Clock className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-xs font-medium text-white">{duration}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">{description}</p>
        )}
      </div>
    </motion.button>
  );
}