import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  PlayCircle, 
  FileText, 
  ClipboardCheck, 
  BookOpen, 
  Map, 
  MessageSquare,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import ActionCard from '@/components/ActionCard';
import WeatherWidget from '@/components/WeatherWidget';

export default function TrainingHub() {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState('hub'); // 'hub', 'mission-training', 'content'
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Level 1: Hub
  const hubTiles = [
    {
      icon: PlayCircle,
      title: 'Mission Training',
      description: 'Video tutorials and guides for all capture types',
      onClick: () => setCurrentLevel('mission-training'),
      variant: 'primary'
    },
    {
      icon: FileText,
      title: 'Resources and Documentation',
      description: 'Manuals, guides, and reference materials',
      onClick: () => navigate(createPageUrl('ToolsLinks')),
      variant: 'default'
    },
    {
      icon: ClipboardCheck,
      title: 'Onboarding Quiz',
      description: 'Complete required quizzes before starting captures',
      onClick: () => window.open('https://forms.gle/3VdjyDQ9LK8UkjgHA', '_blank'),
      variant: 'success'
    },
    {
      icon: BookOpen,
      title: 'Quick Reference',
      description: 'Field bible with essential checklists',
      onClick: () => navigate(createPageUrl('QuickReference')),
      variant: 'default'
    },
    {
      icon: Map,
      title: 'Scenarios',
      description: 'Practice with real-world situations',
      onClick: () => navigate(createPageUrl('Scenarios')),
      variant: 'default'
    },
    {
      icon: MessageSquare,
      title: 'AI Support',
      description: 'Get instant help from the AI copilot',
      onClick: () => window.dispatchEvent(new CustomEvent('openChat')),
      variant: 'success',
      badge: 'NEW'
    }
  ];

  // Level 2: Mission Training Sub-Menu
  const missionTrainingTiles = [
    {
      icon: PlayCircle,
      title: 'Rooftop Capture',
      description: 'Complete guide for rooftop site captures',
      onClick: () => {
        setSelectedCategory('rooftop');
        setCurrentLevel('content');
      },
      variant: 'primary'
    },
    {
      icon: PlayCircle,
      title: 'Monopole / Tower Capture',
      description: 'Standard tower capture procedures',
      onClick: () => {
        setSelectedCategory('tower');
        setCurrentLevel('content');
      },
      variant: 'primary'
    },
    {
      icon: PlayCircle,
      title: 'Panorama Capture',
      description: 'Panorama mission setup and execution',
      onClick: () => navigate(createPageUrl('PanoramaGuide')),
      variant: 'primary'
    },
    {
      icon: PlayCircle,
      title: 'Other Training Videos',
      description: 'Additional tutorials and guides',
      onClick: () => navigate(createPageUrl('TrainingVideos')),
      variant: 'default'
    }
  ];

  // Level 3: Content (Videos and Documentation)
  const contentData = {
    rooftop: {
      videos: [
        { title: 'Rooftop Capture Overview', url: 'https://forms.gle/3VdjyDQ9LK8UkjgHA' },
        { title: 'Rooftop Safety Procedures', url: '#' }
      ],
      docs: [
        { title: 'Rooftop Capture Manual (PDF)', url: '#' },
        { title: 'Rooftop Checklist', url: createPageUrl('QuickReference') }
      ]
    },
    tower: {
      videos: [
        { title: 'Tower Capture Overview', url: '#' },
        { title: 'Tower Marking Tutorial', url: '#' }
      ],
      docs: [
        { title: 'Tower Capture Manual (PDF)', url: '#' },
        { title: 'Tower Checklist', url: createPageUrl('QuickReference') }
      ]
    }
  };

  const handleBack = () => {
    if (currentLevel === 'content') {
      setCurrentLevel('mission-training');
      setSelectedCategory(null);
    } else if (currentLevel === 'mission-training') {
      setCurrentLevel('hub');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {currentLevel !== 'hub' && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
            )}
            <div>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                {currentLevel === 'hub' ? 'Training & Onboarding' : 'Mission Training'}
              </p>
              <h1 className="text-3xl font-bold text-white">
                {currentLevel === 'hub' && 'Training Hub'}
                {currentLevel === 'mission-training' && 'Mission Training'}
                {currentLevel === 'content' && `${selectedCategory === 'rooftop' ? 'Rooftop' : 'Tower'} Capture`}
              </h1>
            </div>
          </div>
          <WeatherWidget />
        </div>

        {/* Level 1: Hub */}
        {currentLevel === 'hub' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hubTiles.map((tile, index) => (
              <ActionCard key={index} {...tile} />
            ))}
          </div>
        )}

        {/* Level 2: Mission Training */}
        {currentLevel === 'mission-training' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missionTrainingTiles.map((tile, index) => (
              <ActionCard key={index} {...tile} />
            ))}
          </div>
        )}

        {/* Level 3: Content */}
        {currentLevel === 'content' && selectedCategory && (
          <div className="space-y-8">
            {/* Videos Section */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-blue-400" />
                Training Videos
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {contentData[selectedCategory].videos.map((video, index) => (
                  <a
                    key={index}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <PlayCircle className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">{video.title}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Documentation Section */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Documentation
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {contentData[selectedCategory].docs.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      <span className="text-white font-medium">{doc.title}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}