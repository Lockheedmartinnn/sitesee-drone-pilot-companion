import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  ExternalLink,
  Cloud,
  Map,
  FileText,
  MessageSquare,
  Camera,
  Compass,
  Settings,
  BookOpen,
  PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LINKS = [
  {
    category: "Mission Markup Videos (REQUIRED)",
    items: [
      {
        icon: PlayCircle,
        title: "Rooftop Markup v9.6.0 (Latest)",
        description: "WATCH BEFORE FLYING - Mission setup walkthrough",
        url: "https://youtu.be/M82GH-ZcWEM",
        color: "text-red-400 bg-red-500/20"
      },
      {
        icon: PlayCircle,
        title: "Rooftop Markup v8.6.1 (Reference)",
        description: "Previous version for comparison",
        url: "https://youtu.be/ta1A0MXqLWI",
        color: "text-orange-400 bg-orange-500/20"
      }
    ]
  },
  {
    category: "Resources & Documentation",
    items: [
      {
        icon: BookOpen,
        title: "How to Capture",
        description: "Complete capture documentation and guides (Confluence)",
        url: "https://sitesee.atlassian.net/wiki/spaces/CSE/pages/3132424197/SiteSee+Web+Portal+Legacy+-+Getting+Started",
        color: "text-blue-400 bg-blue-500/20"
      },
      {
        icon: Settings,
        title: "Web Portal Guide",
        description: "Portal documentation and user guides (Confluence)",
        url: "https://sitesee.atlassian.net/wiki/spaces/CSE/pages/3132981249/SiteSee+Web+Portal+Legacy",
        color: "text-violet-400 bg-violet-500/20"
      },
      {
        icon: BookOpen,
        title: "Introduction to Scanlink",
        description: "Learn about Scanlink and what to expect",
        url: "https://support.dronelink.com/hc/en-us/articles/360063769833-Introduction-to-Scanlink-and-What-to-Expect",
        color: "text-purple-400 bg-purple-500/20"
      }
    ]
  },
  {
    category: "Weather & Airspace",
    items: [
      {
        icon: Cloud,
        title: "Weather Forecast",
        description: "Local weather conditions",
        url: "https://weather.com",
        color: "text-blue-400 bg-blue-500/20"
      },
      {
        icon: Map,
        title: "Airspace Check",
        description: "Verify flight restrictions",
        url: "https://www.casa.gov.au/knowyourdrone",
        color: "text-cyan-400 bg-cyan-500/20"
      }
    ]
  },

  {
    category: "Tools",
    items: [
      {
        icon: FileText,
        title: "Standard Capture Checklist",
        description: "Complete capture process checklist (v20)",
        url: createPageUrl('StandardCaptureChecklist'),
        color: "text-purple-400 bg-purple-500/20",
        internal: true
      },
      {
        icon: Camera,
        title: "GPS Altitude Verifier",
        description: "Check Y-axis altitude stability (battery swaps)",
        url: createPageUrl('GPSVerifier'),
        color: "text-emerald-400 bg-emerald-500/20",
        internal: true
      },
      {
        icon: Camera,
        title: "Nomacs Image Viewer",
        description: "EXIF data & image review",
        url: "https://nomacs.org",
        color: "text-amber-400 bg-amber-500/20"
      },
      {
        icon: Compass,
        title: "Sun Position Calculator",
        description: "Plan for optimal lighting",
        url: "https://www.suncalc.org",
        color: "text-orange-400 bg-orange-500/20"
      }
    ]
  },
  {
    category: "Quick Reference",
    items: [
      {
        icon: Settings,
        title: "Camera Settings Cheat Sheet",
        description: "Common configuration presets",
        url: "#",
        color: "text-slate-400 bg-slate-500/20"
      },
      {
        icon: BookOpen,
        title: "Pilot Handbook",
        description: "Complete operations manual",
        url: "#",
        color: "text-pink-400 bg-pink-500/20"
      }
    ]
  }
];

const LinkCard = ({ item, index }) => {
  const Icon = item.icon;
  
  const content = (
    <>
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
        item.color
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white">{item.title}</p>
        <p className="text-sm text-slate-400">{item.description}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-slate-500 flex-shrink-0" />
    </>
  );

  const className = "flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-200";
  
  if (item.internal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link to={item.url} className={className}>
          {content}
        </Link>
      </motion.div>
    );
  }
  
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {content}
    </motion.a>
  );
};

export default function TrainingResources() {
  let itemIndex = 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-lg mx-auto px-5 py-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6941e5b42ede03ae0cffdd74/bcd43d370_image.png"
              alt="SiteSee"
              className="h-6"
            />
            <div>
              <h1 className="text-lg font-semibold">Onboarding / Training</h1>
              <p className="text-sm text-slate-400">Complete training & quizzes before production</p>
            </div>
          </div>
        </div>
        
        {/* Required Quizzes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/30 rounded-2xl p-5 mb-8"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Required Quizzes</h2>
              <p className="text-sm text-blue-200/80">Complete these before production captures</p>
            </div>
          </div>

          <div className="space-y-2">
            <a href="https://forms.gle/3VdjyDQ9LK8UkjgHA" target="_blank" rel="noopener noreferrer">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-2 border-emerald-500/50 hover:border-emerald-500 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    1
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">Rooftop Markup Quiz</p>
                  <p className="text-sm text-emerald-300">START HERE: Required before rooftop captures</p>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </motion.div>
            </a>

            <a href="https://forms.gle/671jRKFk27ybs82eA" target="_blank" rel="noopener noreferrer">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/50 hover:border-blue-500 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    2
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">Tower Markup Quiz</p>
                  <p className="text-sm text-blue-300">Required before tower captures</p>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0" />
              </motion.div>
            </a>
          </div>
        </motion.div>

        {/* Training Videos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
            Training Videos
          </h2>
          <Link to={createPageUrl('TrainingVideos')}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-500/20 text-red-400">
                <PlayCircle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">Training Videos</p>
                <p className="text-sm text-slate-400">Mission markup & tutorials</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 flex-shrink-0" />
            </motion.div>
          </Link>
        </motion.div>

        {/* Categories */}
        <div className="space-y-8">
          {LINKS.map((category, catIndex) => (
            <div key={catIndex}>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1"
              >
                {category.category}
              </motion.h2>
              <div className="space-y-2">
                {category.items.map((item) => (
                  <LinkCard key={itemIndex} item={item} index={itemIndex++} />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-slate-600 mt-10"
        >
          Links open in new tab
        </motion.p>
      </div>
    </div>
  );
}