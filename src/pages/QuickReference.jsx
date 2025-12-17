import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Battery, 
  Satellite, 
  Camera,
  Shield,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import InfoCard from '@/components/InfoCard';
import { cn } from '@/lib/utils';

const Section = ({ title, icon: Icon, children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden", className)}
  >
    <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
      <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-slate-300" />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    <div className="p-5">
      {children}
    </div>
  </motion.div>
);

const RuleItem = ({ positive, children }) => (
  <div className="flex items-start gap-3 py-2">
    {positive ? (
      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
    )}
    <p className="text-sm text-slate-300">{children}</p>
  </div>
);

export default function QuickReference() {
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
              <h1 className="text-lg font-semibold">Quick Reference</h1>
              <p className="text-sm text-slate-400">Field Bible</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-5">
          {/* Non-Negotiables */}
          <Section title="Non-Negotiables" icon={AlertTriangle}>
            <InfoCard variant="danger" className="mb-4">
              <p>These rules exist because breaking them causes mission failures. No exceptions.</p>
            </InfoCard>
            
            <div className="space-y-1">
              <RuleItem positive>Always wait for GPS stabilisation (~32 satellites)</RuleItem>
              <RuleItem positive>Treat battery swaps as full reset events</RuleItem>
              <RuleItem positive>Lock exposure before takeoff, never change mid-mission</RuleItem>
              <RuleItem positive>Enable screen recording for every mission</RuleItem>
              <RuleItem>Never mark tower before GPS is stable</RuleItem>
              <RuleItem>Never skip QC checks before leaving site</RuleItem>
              <RuleItem>Never oversize obstacles "just to be safe"</RuleItem>
            </div>
          </Section>
          
          {/* Battery Swap Checklist */}
          <Section title="Battery Swap Checklist" icon={Battery}>
            <p className="text-sm text-slate-400 mb-4">
              Every battery change is a potential failure point. Follow this sequence:
            </p>
            <ol className="space-y-3">
              {[
                'Land drone safely',
                'Swap to fresh battery',
                'Power on and wait for boot',
                'Start GPS timer (2 min minimum)',
                'Verify camera settings unchanged',
                'Re-centre tower marker',
                'Resume mission'
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-300">{step}</span>
                </li>
              ))}
            </ol>
          </Section>
          
          {/* GPS Stabilisation */}
          <Section title="GPS Stabilisation" icon={Satellite}>
            <div className="space-y-4">
              <div className="bg-slate-700/30 rounded-xl p-4">
                <p className="text-2xl font-bold text-blue-400 mb-1">~32 Satellites</p>
                <p className="text-sm text-slate-400">Target lock before marking tower</p>
              </div>
              
              <div className="bg-slate-700/30 rounded-xl p-4">
                <p className="text-2xl font-bold text-blue-400 mb-1">2–5 Minutes</p>
                <p className="text-sm text-slate-400">Minimum wait time after power on</p>
              </div>
              
              <InfoCard variant="info" title="How to Verify">
                <ul className="space-y-1">
                  <li>• Check satellite count on controller</li>
                  <li>• Position should stop drifting on map</li>
                  <li>• "GPS Ready" or equivalent indicator</li>
                </ul>
              </InfoCard>
            </div>
          </Section>
          
          {/* Exposure Rules */}
          <Section title="Exposure Rules" icon={Camera}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Mode</p>
                  <p className="font-semibold">Manual</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">White Balance</p>
                  <p className="font-semibold">Daylight / Fixed K</p>
                </div>
              </div>
              
              <InfoCard variant="warning" title="Golden Rule">
                <p>Set exposure on the ground. Lock it. Don't touch it until the mission is complete.</p>
              </InfoCard>
              
              <div className="space-y-1">
                <RuleItem positive>Check histogram before takeoff</RuleItem>
                <RuleItem positive>Verify no highlight clipping</RuleItem>
                <RuleItem positive>Keep settings consistent across battery swaps</RuleItem>
                <RuleItem>Never use Auto in the field</RuleItem>
              </div>
            </div>
          </Section>
          
          {/* QC Before Leaving */}
          <Section title="Before Leaving Site" icon={Shield}>
            <p className="text-sm text-slate-400 mb-4">
              Quick spot-check to avoid return trips:
            </p>
            <div className="space-y-1">
              <RuleItem positive>Exposure consistent across all captures</RuleItem>
              <RuleItem positive>Tower centred in all mission components</RuleItem>
              <RuleItem positive>No visible drift after battery changes</RuleItem>
              <RuleItem positive>All planned components completed</RuleItem>
              <RuleItem positive>Screen recording saved and backed up</RuleItem>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}