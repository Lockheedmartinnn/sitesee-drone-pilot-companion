import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, X } from 'lucide-react';
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
            
            {/* Description */}
            <div className="px-5 py-4 border-t border-slate-800">
              <p className="text-sm text-slate-300">{selectedVideo.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}