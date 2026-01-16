import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PanoramaGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-lg mx-auto px-5 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Panorama Guide</h1>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <p className="text-slate-300">
            Panorama guidance has been integrated into the Start Capture workflow. 
            Please use the step-by-step checklist for panorama instructions.
          </p>
          <Link to={createPageUrl('StartCapture')}>
            <Button className="mt-4 w-full">
              Go to Start Capture
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}