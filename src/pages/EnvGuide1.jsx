import React from 'react';
import EnvGuidePage from '@/components/EnvGuidePage';

const GUIDE_DATA = {
  id: 'env-guide-1',
  number: 1,
  title: 'Low Interference',
  subtitle: 'Open Environments',
  emoji: '🟢',
  estimatedTime: '8 min',
  bgClass: 'bg-emerald-500/10',
  borderClass: 'border-emerald-500/30',
  textClass: 'text-emerald-400',
  intro: 'A low interference site is any location where the sky above you is largely unobstructed and the surrounding terrain does not significantly disrupt GPS signals. These are the most forgiving sites you will fly. The defining characteristic is space — signals you receive are almost entirely direct line-of-sight from satellites, which is exactly what GPS is designed around.',
  keyRule: 'The most straightforward site type. Focus on wind and light conditions rather than GPS. Low interference does not mean zero risk — environmental factors like sea breeze and power lines can still catch you out.',
  sections: [
    {
      title: 'What Creates This Environment',
      content: 'Low interference environments exist wherever human development is low-rise and spread out, or wherever natural open space dominates. GPS signals travel in straight lines from satellites 20,000 km above Earth. Any object between a satellite and your aircraft either blocks that signal entirely or reflects it, creating a degraded or false position reading.',
      keyPoints: [
        'Parks and reserves — wide sky view, minimal reflective surfaces, grass absorbs rather than reflects radio signals',
        'Industrial estates on city fringe — large flat footprints, single-storey warehouses, wide access roads, little vertical structure',
        'Cemeteries — consistently among the cleanest GPS environments in urban areas: open, flat, low monuments, positioned away from dense development',
        'Rural and open areas — best-case GPS environment with full hemisphere satellite access',
      ]
    },
    {
      title: 'What You Will Experience',
      content: 'When you power on your aircraft at a low interference site, satellite acquisition is fast. Within 60 to 90 seconds you will typically have a full constellation lock. The position indicator will settle quickly and hold steady — you will not see the position icon drifting while the aircraft sits still.',
      keyPoints: [
        'Satellite lock in 60–90 seconds — significantly faster than interference-affected sites',
        'Position holds steady on the ground — no drift while stationary',
        'Satellite count at its daily best in the early morning window',
        'These sites have low fail rates because nothing in the environment is working against you',
        'GPS performs as designed — weather and wind are your primary variables here, not signal quality',
      ]
    },
    {
      title: 'Where Things Can Still Go Wrong',
      content: 'Low interference does not mean zero risk. The most common issues at open sites are environmental rather than technical.',
      keyPoints: [
        'Coastal sites are exposed to sea breeze — 10 km/h at 07:00 can build to 25 km/h by 09:30 at beach or foreshore sites',
        'Open sites are not buffered by surrounding structures the way denser urban environments are',
        'Power lines along suburban streets are easy to miss in planning but significant on site — 22kV lines along nature strips are a return-to-home risk',
        'Open sites attract pedestrians, dog walkers, and cyclists — foot traffic matters for public safety as much as GPS',
        'Midday sun at open sites creates flat, shadowless images — poor for photogrammetry deliverables',
      ]
    },
    {
      title: 'What This Site Teaches You',
      content: 'Low interference sites are where new pilots build their foundations and where experienced pilots calibrate. The environment is cooperative. Mistakes are recoverable. GPS behaves predictably.',
      keyPoints: [
        'When something goes wrong here it is almost always operator error — misconfigured flight path, incorrect altitude, overlooked obstacle',
        'That makes this the best environment for learning — the feedback is clean and direct',
        'Experienced pilots use low sites to calibrate before complex missions — confirming equipment performance, battery health, ground station connection',
        'A low site is a baseline. If something isn\'t right here, don\'t take it somewhere harder.',
      ]
    },
  ],
  timeWindows: [
    { window: '06:30 – 09:00', status: 'optimal', label: '✅ Optimal — best satellite geometry + golden hour light + low foot traffic' },
    { window: '09:00 – 15:30', status: 'marginal', label: '⚠️ Acceptable — flat harsh light, slightly degraded GPS midday, manageable' },
    { window: '15:30 – 17:30', status: 'good', label: '✅ Good — afternoon golden hour, GPS still reliable, wind often building at coastal sites' },
    { window: 'After sunset', status: 'avoid', label: '🚫 Do Not Fly — no authorisation, no visual reference' },
  ],
  failureMode: 'Environmental, not technical. Coastal sea breeze builds faster than expected. Power lines missed in planning become obstacles during return-to-home. The GPS environment cooperates — the weather doesn\'t always.',
  quiz: [
    {
      question: 'What is the primary variable to manage at a low interference open site?',
      options: ['GPS satellite geometry', 'Electromagnetic interference', 'Wind and light conditions', 'RTK base station placement'],
      correct: 2
    },
    {
      question: 'Why do cemeteries have consistently clean GPS environments?',
      options: [
        'They use special shielding',
        'Open flat ground, low monuments, positioned away from dense development',
        'They have fewer satellites above them',
        'Signal boosters are installed nearby'
      ],
      correct: 1
    },
    {
      question: 'What is the primary failure mode at low interference coastal sites?',
      options: [
        'GPS multipath from water reflections',
        'Sea breeze building faster than expected and power lines in the return path',
        'Electromagnetic interference from nearby infrastructure',
        'Position drift while stationary'
      ],
      correct: 1
    },
    {
      question: 'How long does satellite acquisition typically take at a low interference site?',
      options: ['5–10 minutes', '3–4 minutes', '60–90 seconds', '30 seconds or less'],
      correct: 2
    },
  ]
};

export default function EnvGuide1() {
  return <EnvGuidePage guideData={GUIDE_DATA} totalGuides={5} />;
}