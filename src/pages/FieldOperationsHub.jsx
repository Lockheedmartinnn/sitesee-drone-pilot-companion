import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Rocket, Satellite, MessageSquare, BookOpen, Map } from 'lucide-react';
import ActionCard from '@/components/ActionCard';
import WeatherWidget from '@/components/WeatherWidget';

export default function FieldOperationsHub() {
  const navigate = useNavigate();

  const tiles = [
    {
      icon: Rocket,
      title: 'Start a Capture',
      description: 'Guided step-by-step workflow for tower and rooftop captures',
      onClick: () => navigate(createPageUrl('StartCapture')),
      variant: 'primary'
    },
    {
      icon: Satellite,
      title: 'GPS Altitude Verifier',
      description: 'Verify battery swap GPS stability and altitude consistency',
      onClick: () => navigate(createPageUrl('GPSVerifier')),
      variant: 'warning'
    },
    {
      icon: MessageSquare,
      title: 'AI Copilot',
      description: 'Get instant help with procedures and troubleshooting',
      onClick: () => {
        // This will be handled by the layout's chat widget
        window.dispatchEvent(new CustomEvent('openChat'));
      },
      variant: 'success',
      badge: 'NEW'
    },
    {
      icon: BookOpen,
      title: 'Quick Reference',
      description: 'Field bible with checklists and critical procedures',
      onClick: () => navigate(createPageUrl('QuickReference')),
      variant: 'default'
    },
    {
      icon: Map,
      title: 'Scenarios',
      description: 'What-if situations and solutions for field operations',
      onClick: () => navigate(createPageUrl('Scenarios')),
      variant: 'default'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Field Operations</p>
            <h1 className="text-3xl font-bold text-white">Operations Hub</h1>
          </div>
          <WeatherWidget />
        </div>

        {/* Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tiles.map((tile, index) => (
            <ActionCard key={index} {...tile} />
          ))}
        </div>
      </div>
    </div>
  );
}