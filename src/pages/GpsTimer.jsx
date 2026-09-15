import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Satellite } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Timer from '@/components/Timer';
import InfoCard from '@/components/InfoCard';

export default function GpsTimer() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-lg mx-auto px-5 py-6 pb-32">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl('Home'))}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">GPS Stabilization Timer</h1>
            <p className="text-slate-400 text-sm">Runs in background — navigate freely</p>
          </div>
          <Satellite className="w-5 h-5 text-blue-400" />
        </div>

        <InfoCard variant="info" title="How to use" className="mb-6">
          <p className="text-sm">
            Start the timer when you power on your drone. It keeps running even if you leave this page or switch apps.
            Use it for initial stabilization or battery swap stabilization.
          </p>
        </InfoCard>

        <Timer
          targetMinutes={2}
          label="GPS Stabilisation Timer (2 min)"
        />
      </div>
    </div>
  );
}