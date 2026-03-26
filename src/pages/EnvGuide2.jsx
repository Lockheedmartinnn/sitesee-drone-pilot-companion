import React from 'react';
import EnvGuidePage from '@/components/EnvGuidePage';

const GUIDE_DATA = {
  id: 'env-guide-2',
  number: 2,
  title: 'Moderate Interference',
  subtitle: 'Suburban & Light Commercial',
  emoji: '🟡',
  estimatedTime: '9 min',
  bgClass: 'bg-yellow-500/10',
  borderClass: 'border-yellow-500/30',
  textClass: 'text-yellow-400',
  intro: 'A moderate interference site sits between the clean openness of a low environment and the demanding complexity of high interference. These are the most common sites you will encounter in a busy Australian metro market — shopping centre surveys, station precincts, medium-density residential. The defining characteristic is partial sky obstruction: clear overhead, but taller structures at the edge of your view cut off the lower horizon.',
  keyRule: 'GPS works but can drift in the afternoon as satellite geometry degrades. The failure mode here is overconfidence — everything looks fine at power-on, but the data tells a different story by 12:00. Watch the position indicator before arming. It tells you something real at this site type.',
  sections: [
    {
      title: 'What Creates This Environment',
      content: 'Moderate interference is created by the transition zone between open suburban land and denser urban development. Low-angle satellites — those near the horizon — contribute to the geometric spread that makes GPS positioning accurate. When buildings block them, your satellite geometry degrades slightly and your position fix becomes less precise.',
      keyPoints: [
        'Shopping centres — large low-rise structure, but surrounded by multi-level carparks, service towers, loading dock structures',
        'Railway station precincts — overhead wiring, steel platform canopies, signal gantries, concentrated electrical infrastructure',
        'Medium-density residential (4–8 storey) — from ground level the sky appears mostly open, but your aircraft at 60m is flying in the gap between building tops',
        'At moderate sites you are never more than 100m from something that partially interrupts satellite geometry in at least one direction',
      ]
    },
    {
      title: 'What You Will Experience',
      content: 'You will typically get a solid GPS lock within 2 to 3 minutes. The initial fix will look good. The challenge is not acquiring a fix — it is maintaining consistent position accuracy throughout the flight, particularly when the path takes the aircraft near taller structures at the site edge.',
      keyPoints: [
        'Position drift that is subtle enough not to trigger a warning but significant enough to affect data quality',
        'Slight misalignment between flight lines, or irregular overlap in photogrammetry datasets',
        'Afternoon flights demonstrably worse than morning flights — satellite geometry degrades meaningfully between 11:00 and 14:00',
        'The difference between an 07:00 flight and a 12:00 flight can be the difference between a clean dataset and one that requires rework',
        'RTK connections can fluctuate at railway corridors, steel-frame retail structures, and medium-rise apartment cores',
      ]
    },
    {
      title: 'The RTK Instability Problem',
      content: 'Partial RTK data mixed with non-corrected GPS data is actually harder to manage than a clean failure, because it produces inconsistent accuracy across the dataset.',
      keyPoints: [
        'Railway corridors, large steel-frame retail structures, and medium-rise cores can disrupt the RTK link between aircraft and base station',
        'The link doesn\'t fail completely — it fluctuates. This creates inconsistent accuracy within a single dataset',
        'Solution: switch to PPK before the mission rather than hoping the connection holds',
        'PPK processes corrections after the flight with no live dependency — intermittent link quality during flight becomes irrelevant',
        'Watch for RTK indicator flickering during your stationary ground check — if it fluctuates before takeoff, it will fluctuate during the mission',
      ]
    },
    {
      title: 'Launch Position Selection',
      content: 'Moderate sites are where launch position selection starts to matter. On an open oval you can set down anywhere. At a shopping centre you are choosing between meaningfully different GPS environments within the same site.',
      keyPoints: [
        'A spot 30m from a multi-level carpark vs 80m from it with a clear sky view to the north — that choice matters',
        'Identify the tallest structure on or adjacent to the site and position away from it',
        'North-facing open exposure is valuable in the morning because it aligns with the satellite geometry at that time',
        'The habit of choosing your launch point based on GPS exposure — not just convenience — comes from moderate site experience',
        'Watching your position indicator while the aircraft sits still before arming: at low sites it\'s a formality. At moderate sites it tells you something real.',
      ]
    },
  ],
  timeWindows: [
    { window: '06:30 – 09:00', status: 'optimal', label: '✅ Optimal — satellite geometry at best, soft directional light, minimal foot traffic' },
    { window: '09:00 – 11:00', status: 'marginal', label: '⚠️ Acceptable — monitor closely, GPS starting to degrade' },
    { window: '11:00 – 13:30', status: 'avoid', label: '🚫 Avoid survey — GPS unreliable midday, overhead harsh light, highest failure rate' },
    { window: '15:30 – 17:30', status: 'good', label: '✅ Good secondary — GPS recovers in afternoon, directional light angle' },
    { window: 'After sunset', status: 'avoid', label: '🚫 Do Not Fly' },
  ],
  failureMode: 'Overconfidence. Everything looks fine at power-on. The lock is good. The numbers look acceptable. The problem surfaces 48 hours later when the processed dataset shows drift errors or misaligned patches that are difficult to correct in post-processing.',
  quiz: [
    {
      question: 'What is the defining characteristic of a moderate interference environment?',
      options: [
        'Full sky obstruction on all sides',
        'Partial sky obstruction — clear overhead but taller structures cut the lower horizon',
        'Electromagnetic interference from industrial equipment',
        'Proximity to water bodies'
      ],
      correct: 1
    },
    {
      question: 'Why is RTK instability at moderate sites harder to manage than a clean RTK failure?',
      options: [
        'It drains the battery faster',
        'The aircraft won\'t arm without RTK lock',
        'Partial RTK data mixed with non-corrected GPS creates inconsistent accuracy across the dataset',
        'It triggers a warning and ends the mission'
      ],
      correct: 2
    },
    {
      question: 'What is the best solution for RTK instability at a moderate interference site?',
      options: [
        'Move the base station closer to the aircraft',
        'Fly higher to improve signal strength',
        'Switch to PPK before the mission',
        'Wait until afternoon when signal stabilises'
      ],
      correct: 2
    },
    {
      question: 'What time window should you avoid for survey or photogrammetry work at a moderate site?',
      options: ['06:30 – 09:00', '09:00 – 11:00', '11:00 – 13:30', '15:30 – 17:30'],
      correct: 2
    },
  ]
};

export default function EnvGuide2() {
  return <EnvGuidePage guideData={GUIDE_DATA} totalGuides={5} />;
}