import React from 'react';
import EnvGuidePage from '@/components/EnvGuidePage';

const GUIDE_DATA = {
  id: 'env-guide-3',
  number: 3,
  title: 'High Interference',
  subtitle: 'Dense Commercial & Infrastructure',
  emoji: '🟠',
  estimatedTime: '10 min',
  bgClass: 'bg-orange-500/10',
  borderClass: 'border-orange-500/30',
  textClass: 'text-orange-400',
  intro: 'High interference sites are locations where the GPS signal environment is actively hostile, not just partially degraded. The sky overhead may still be visible, but the signals reaching your aircraft\'s antenna are a contaminated mix of direct satellite contact and reflected, refracted, or re-radiated signals. The result: signal bars show strong, lock indicator is green — but the position being reported is not accurate. The failure is invisible until you check your data.',
  keyRule: 'If aircraft position drifts while stationary before arming, wait 10 minutes. If it hasn\'t settled, return the next morning before 08:00. A pilot who arms and flies on a drifting position will produce corrupted data — and won\'t know it until 48 hours later.',
  sections: [
    {
      title: 'What Creates This Environment',
      content: 'High interference has two primary sources, and most high interference sites involve both simultaneously.',
      keyPoints: [
        'Physical reflection — large steel-framed buildings, hospital complexes, university structures, dense commercial blocks reflect GPS signals off their facades',
        'Your aircraft receives both the direct signal from the satellite and the reflected version arriving a fraction of a second later from a different direction',
        'Electromagnetic interference — broadcast towers, mobile network infrastructure, high-voltage powerline corridors, rail electrification systems',
        'Some of this radiation overlaps with GPS frequency bands and degrades the receiver\'s ability to isolate satellite signals cleanly',
        'Hospital campuses combine both sources — dense multi-wing building reflections + concentrated medical equipment EMI',
        'A site can exhibit high interference even with a clear sky view — the problem is signal quality, not satellite geometry',
      ]
    },
    {
      title: 'What You Will Experience',
      content: 'The most reliable indicator is position drift while stationary. Power on your aircraft, set it on the ground, and watch the position marker on your ground station app.',
      keyPoints: [
        'At a clean site the marker settles and holds. At a high interference site the marker will move while the aircraft is perfectly still.',
        '3 to 8 metres of drift in a 2-minute period = high interference site, regardless of what signal strength bars say',
        'GPS lock takes longer than expected — at a low site 90 seconds produces solid fix. At high interference, 3 minutes may produce a fix that looks stable but isn\'t.',
        'Inconsistency is a third indicator — come back the next day at the same time and conditions may be markedly different',
        'Early morning electromagnetic activity is lower — less hospital/university equipment operating, mobile networks under less load',
      ]
    },
    {
      title: 'When Things Go Wrong',
      content: 'High interference produces two categories of failure — and the worse one is the one you don\'t see coming.',
      keyPoints: [
        'Primary failure: invisible positional error corrupts photogrammetric data. No warnings triggered. Pilot has no indication anything went wrong.',
        'Surfaces show distortion, ground control points don\'t align, vertical error exceeds project specification',
        'By the time this is discovered, the pilot may be 48 hours removed from the site — reshoot required',
        'Secondary failure: mid-mission position warning large enough to trigger aircraft alert systems',
        'Aircraft may initiate return-to-home based on corrupted position fix — potentially flying toward an obstacle',
        'Battery drain is also higher — flight controller making constant small corrections to compensate for noisy position signal',
      ]
    },
    {
      title: 'The Morning Window — Why It\'s Non-Negotiable',
      content: 'The 06:00 to 08:30 window is not just preferred at high interference sites — it is the boundary between a viable mission and a compromised one. Three things converge in this window.',
      keyPoints: [
        'Satellite geometry peaks — more high-elevation satellites visible, better geometric spread, receiver drawing from direct signals rather than low-angle reflected signals',
        'Electromagnetic background noise at its lowest — hospitals, universities, commercial facilities running minimal equipment before 07:00',
        'Thermal stability — calm, stable morning air produces fewer atmospheric gradients that affect GPS signal propagation',
        'The 10:00–15:00 window is not just non-recommended — it is the consistent finding of practitioners globally that survey missions in this window at high interference sites produce unreliable data',
        'Secondary window 15:30–17:00 is usable for inspection-grade work only — not recommended for survey deliverables',
      ]
    },
  ],
  timeWindows: [
    { window: '06:00 – 08:30', status: 'optimal', label: '✅ Only recommended window for survey — satellite geometry + EM at peak, noise at minimum' },
    { window: '08:30 – 10:00', status: 'marginal', label: '⚠️ Marginal — proceed only if position holds steady and drift is under 2m in 2 minutes' },
    { window: '10:00 – 15:00', status: 'avoid', label: '🚫 Do not fly survey — GPS at worst, EM interference at peak. Consistent data quality failure window.' },
    { window: '15:30 – 17:00', status: 'marginal', label: '⚠️ Inspection only — visual documentation acceptable. Not for survey deliverables.' },
    { window: 'After sunset', status: 'avoid', label: '🚫 Do Not Fly' },
  ],
  failureMode: 'Invisible positional error. The aircraft completes the mission without triggering any warnings. The pilot has no indication anything went wrong. The processed dataset returns 48 hours later showing errors that cannot be corrected in post-processing.',
  quiz: [
    {
      question: 'What is the most reliable on-site indicator that you are at a high interference site?',
      options: [
        'Low satellite count (below 20)',
        'Position drift while the aircraft is stationary on the ground',
        'RTK link failure',
        'Aircraft compass warning'
      ],
      correct: 1
    },
    {
      question: 'Why can a site have high GPS interference even when it has a completely clear sky view?',
      options: [
        'Cloud cover interferes with satellites',
        'Clear sky doesn\'t guarantee clean signals — electromagnetic interference from infrastructure degrades signal quality regardless of sky view',
        'The satellites above are older models',
        'Clear sky creates more thermal gradients'
      ],
      correct: 1
    },
    {
      question: 'You arrive at a hospital campus site at 09:45. Position drift is 5m over 2 minutes. What should you do?',
      options: [
        'Arm and fly — GPS will stabilise during the mission',
        'Wait another 30 minutes on site',
        'Postpone — you are outside the morning window at a high interference site with active drift',
        'Switch to manual flight mode'
      ],
      correct: 2
    },
    {
      question: 'What makes the 15:30–17:00 secondary window acceptable for some work at high interference sites?',
      options: [
        'GPS geometry has fully recovered',
        'It\'s acceptable for visual inspection and facade documentation, not survey deliverables',
        'Electromagnetic interference is zero in late afternoon',
        'Battery life is better in the afternoon'
      ],
      correct: 1
    },
  ]
};

export default function EnvGuide3() {
  return <EnvGuidePage guideData={GUIDE_DATA} totalGuides={5} />;
}