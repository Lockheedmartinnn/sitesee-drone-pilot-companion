import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, X, BookOpen, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoCard from '@/components/VideoCard';

const VIDEOS = [
  {
    id: 1,
    title: "Rooftop Markup v9.6.0 (Latest)",
    description: "WATCH BEFORE FLYING - Mission setup walkthrough",
    duration: "12:30",
    thumbnail: "https://img.youtube.com/vi/M82GH-ZcWEM/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/M82GH-ZcWEM"
  },
  {
    id: 2,
    title: "Rooftop Markup v8.6.1 (Reference)",
    description: "Previous version for comparison",
    duration: "10:15",
    thumbnail: "https://img.youtube.com/vi/ta1A0MXqLWI/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/ta1A0MXqLWI"
  },
  {
    id: 13,
    title: "Rooftop Mission v9.7.0: Overview & Key Improvements",
    description: "Introduction to v9.7.0 updates: 2x faster flight speeds, simplified marking, single-layer planar overview at -45°, enhanced detail reconstruction, and reduced site time. Learn about the new 1-second capture interval and GPS stabilization requirements.",
    duration: "12:00",
    thumbnail: "https://img.youtube.com/vi/uZwFc9uqKts/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/uZwFc9uqKts",
    docUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69534bd8b3474c3c3a70cbc1/9bb19a332_Rooftopsv970Introductionandoverviewdocx.pdf"
  },
  {
    id: 14,
    title: "Use Case 2: Multi-Level Rooftop Capture",
    description: "Learn how to mark equipment clusters at two different elevations (high and low). Covers marking equipment height, center, and radius for each cluster, plus panorama/orthomosaic configuration. Includes trajectory logic for multi-level sites.",
    duration: "3:00",
    thumbnail: "https://img.youtube.com/vi/jRtZF30265Y/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/jRtZF30265Y",
    docUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69534bd8b3474c3c3a70cbc1/bbc313207_Rooftopv970usecase2docx.pdf"
  },
  {
    id: 15,
    title: "Use Case 3: Complex Obstacle Environment",
    description: "Master marking on-roof enveloped obstacles, non-enveloped obstacles, and neighboring high-rise buildings. Learn proper boundary marking, height settings, and flight path optimization around multiple obstacle types. Includes 3D plan color-coding.",
    duration: "3:30",
    thumbnail: "https://img.youtube.com/vi/M4t7QHfmgOA/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/M4t7QHfmgOA",
    docUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69534bd8b3474c3c3a70cbc1/94530344a_Rooftopv970usecase3docx.pdf"
  },
  {
    id: 16,
    title: "Use Case 4: Greenfields (No Equipment/Obstacles)",
    description: "Handle rooftops with no visible equipment or obstacles. Learn the critical system requirement: at least one obstacle or equipment must be marked to define rooftop geometry. Shows error handling and resolution steps.",
    duration: "2:30",
    thumbnail: "https://img.youtube.com/vi/GQoFmwoT06c/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/GQoFmwoT06c",
    docUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69534bd8b3474c3c3a70cbc1/c6da4cd02_Rooftopv970usecase4docx.pdf"
  },
  {
    id: 17,
    title: "Use Case 5: Large Height Differences (>25m)",
    description: "Understand the Maximum Height Difference constraint (25m limit) when marking equipment at significantly different elevations. Learn when missions require manual adjustment and how to contact SiteSee Support for assistance.",
    duration: "2:00",
    thumbnail: "https://img.youtube.com/vi/97JINuxawVo/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/97JINuxawVo",
    docUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69534bd8b3474c3c3a70cbc1/34353262a_Rooftopv970usecase5docx.pdf"
  },
  {
    id: 18,
    title: "Advanced Rooftop Techniques",
    description: "Additional rooftop mission planning strategies and best practices for complex scenarios.",
    duration: "15:00",
    thumbnail: "https://img.youtube.com/vi/Q5fDIXUTOlQ/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/Q5fDIXUTOlQ"
  },
  {
    id: 3,
    title: "Equipment & Pre-Flight",
    description: "Complete walkthrough of equipment checks and pre-flight preparation.",
    duration: "8:30",
    thumbnail: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&h=450&fit=crop",
    videoUrl: null
  },
  {
    id: 4,
    title: "Camera Settings & Battery Resets",
    description: "How to configure exposure and maintain settings through battery changes.",
    duration: "7:45",
    thumbnail: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=450&fit=crop",
    videoUrl: null
  },
  {
    id: 5,
    title: "GPS Stabilisation & Battery Changes",
    description: "Using Nomacs EXIF data to verify GPS stability and proper procedures.",
    duration: "9:15",
    thumbnail: "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&h=450&fit=crop",
    videoUrl: null
  },
  {
    id: 6,
    title: "On-Site QC Walkthrough",
    description: "Step-by-step quality control process before leaving the site.",
    duration: "6:20",
    thumbnail: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&h=450&fit=crop",
    videoUrl: null
  },
  {
    id: 7,
    title: "Understanding Leaning Issues",
    description: "How to identify and prevent model leaning during capture.",
    duration: "5:45",
    thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=450&fit=crop",
    videoUrl: null
  },
  {
    id: 8,
    title: "Avoiding Ghosting Effects",
    description: "Tips for capturing clear images without ghosting artifacts.",
    duration: "6:50",
    thumbnail: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=450&fit=crop",
    videoUrl: null
  },
  {
    id: 9,
    title: "Proper Georeferencing Workflow",
    description: "Step-by-step guide to ensure accurate georeferencing.",
    duration: "8:15",
    thumbnail: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&h=450&fit=crop",
    videoUrl: null
  },
  {
    id: 10,
    title: "Rooftop Capture Techniques",
    description: "Best practices for complex rooftop site captures.",
    duration: "7:30",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop",
    videoUrl: null
  },
  {
    id: 11,
    title: "Wind Management & Stability",
    description: "Flying safely and capturing quality data in windy conditions.",
    duration: "6:00",
    thumbnail: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&h=450&fit=crop",
    videoUrl: null
  },
  {
    id: 12,
    title: "Low Light & Sun Glare Solutions",
    description: "Techniques for managing challenging lighting conditions.",
    duration: "5:20",
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=450&fit=crop",
    videoUrl: null
  }
];

export default function TrainingVideos() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  
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
              <h1 className="text-lg font-semibold">Training Videos</h1>
              <p className="text-sm text-slate-400">Short IRL tutorials</p>
            </div>
          </div>
        </div>
        
        {/* Quiz CTA */}
        <Link to={createPageUrl('MissionMarkupQuiz')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-2 border-emerald-500/30 rounded-2xl p-5 mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">Mission Markup Quiz</h3>
                <p className="text-sm text-emerald-200/80">Required: Watch + Quiz</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              Complete training video and 10-question quiz to verify understanding
            </p>
          </motion.div>
        </Link>

        {/* Video Grid */}
        <div className="space-y-4">
          {VIDEOS.map((video, index) => (
            <VideoCard
              key={video.id}
              title={video.title}
              description={video.description}
              duration={video.duration}
              thumbnail={video.thumbnail}
              index={index}
              onClick={() => setSelectedVideo(video)}
            />
          ))}
        </div>
        
        {/* Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-slate-500 mt-8"
        >
          Videos are designed to be watched in 10 minutes or less
        </motion.p>
      </div>
      
      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div>
                <h2 className="font-semibold text-white">{selectedVideo.title}</h2>
                <p className="text-sm text-slate-400">{selectedVideo.duration}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Video Player Area */}
            <div className="flex-1 flex items-center justify-center p-5">
              {selectedVideo.videoUrl ? (
                <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden">
                  <iframe
                    src={selectedVideo.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="w-full max-w-lg aspect-video bg-slate-800 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎬</span>
                    </div>
                    <p className="text-slate-400">Video coming soon</p>
                    <p className="text-sm text-slate-500 mt-1">Upload your training video here</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Description & PDF Link */}
            <div className="px-5 py-4 border-t border-slate-800 space-y-3">
              <p className="text-sm text-slate-300">{selectedVideo.description}</p>
              {selectedVideo.docUrl && (
                <a
                  href={selectedVideo.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm font-medium"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download PDF Guide</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}