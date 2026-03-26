import React from 'react';
import EnvGuidePage from '@/components/EnvGuidePage';

const GUIDE_DATA = {
  id: 'env-guide-5',
  number: 5,
  title: 'Harbour & Airport',
  subtitle: 'Specialist Environments',
  emoji: '🔵',
  estimatedTime: '12 min',
  bgClass: 'bg-blue-500/10',
  borderClass: 'border-blue-500/30',
  textClass: 'text-blue-400',
  intro: 'Two environments with failure modes found nowhere else. Harbour and waterfront sites where water surface multipath is the primary GPS challenge, and airport proximity sites where airspace compliance is the governing factor — not GPS at all. Both are common in the Sydney market. Both require specialist awareness before you arrive on site.',
  keyRule: 'Harbour: position launch so open water is BEHIND the antenna, not in front. Fly before 09:00 before sea breeze builds. Airport: confirm authorisation FIRST — before assessing weather, before setting up equipment, before anything else. Do not assess conditions at an airport proximity site until you have confirmed you are authorised to fly.',
  sections: [
    {
      title: 'Part A — Harbour Multipath: What Creates It',
      content: 'Water is one of the most reflective surfaces for radio frequency signals. A calm harbour surface reflects GPS signals with high efficiency in a horizontal direction — directly into the path of an aircraft antenna flying above or near the waterline.',
      keyPoints: [
        'GPS signals from satellites near the horizon travel at a low angle relative to Earth\'s surface — when they pass over water, a portion reflects off the surface and continues upward',
        'Your antenna receives both the direct signal from above and the reflected signal from below, arriving from different angles with a slight time delay',
        'A flat, calm harbour surface under high midday sun produces maximum reflection intensity — signal angle and surface reflectivity align worst-case',
        'A choppy surface under an early morning low-angle sun produces less coherent reflection — this is why the 06:00–09:00 window matters',
        'Water reflections are omnidirectional and vary with surface conditions — more unpredictable than building multipath which is directional',
        'Warmer water evaporates more actively — water vapour close to the surface slightly refracts GPS signals in summer',
      ]
    },
    {
      title: 'Part A — Harbour Multipath: What You\'ll Experience',
      content: 'The hallmark of a harbour multipath site is position accuracy that looks acceptable from the ground but degrades the closer your aircraft flies to the water surface.',
      keyPoints: [
        'A mission at 80m altitude over a harbour foreshore may produce clean data. The same path at 30m may show systematic position errors over open water.',
        'Altitude dependency is critical for mission planning — adjust flight altitude where the deliverable permits to reduce exposure',
        'Façade documentation at 10–20m above water is significantly more vulnerable than a survey at 60m covering the same site',
        'Sea breeze at Sydney harbour is not random — it is a highly predictable daily phenomenon driven by land/ocean temperature differential',
        'Sea breeze begins strengthening around 09:00–10:00 and reaches 20–35 km/h between 13:00–15:00 on clear summer days',
        'A pilot arriving before 08:00 operates in near-calm conditions. The same pilot at 10:30 may find mission-postponing wind speeds.',
      ]
    },
    {
      title: 'Part A — Harbour: Antenna Position Practice',
      content: 'One practical and effective mitigation for harbour multipath is launch position selection relative to the water.',
      keyPoints: [
        'Position launch so open water is BEHIND the aircraft at launch and throughout the primary mission area',
        'Reflected signals from the water arrive behind the antenna at angles that partially reduce their impact compared to signals from directly in front',
        'This is not a technical solution — it is a positioning practice that reduces worst-case exposure during the most critical phase',
        'Particularly important during low-altitude proximity work near the water\'s edge',
        'Combined with the morning window, antenna orientation is the most effective on-site mitigation available without equipment changes',
      ]
    },
    {
      title: 'Part B — Airport Proximity: The Regulatory Environment',
      content: 'Airport proximity sites are not defined by their GPS environment — they are defined by their regulatory environment. A site within 5.5km of a controlled aerodrome requires CASA authorisation regardless of visual characteristics, pilot experience, or mission duration.',
      keyPoints: [
        'Sydney Airport (Mascot), Bankstown Airport, Camden Aerodrome, and Richmond RAAF Base all generate proximity zones that regularly capture commercial drone work in Sydney',
        'Sydney Airport\'s controlled airspace is particularly extensive — it handles high-volume international and domestic jet traffic on instrument approaches',
        'The visual environment gives you no indication you are in controlled airspace — there is no boundary marker',
        'This specific danger: the regulatory environment is invisible and the consequences of ignoring it are significant',
        'CASA enforcement of unauthorised drone operations in controlled airspace has become more active — penalties include substantial fines and cancellation of operator credentials',
        'Authorisation must be confirmed before ANY other aspect of mission planning for an airport proximity site',
      ]
    },
    {
      title: 'Part B — Airport: Authorisation and RF Interference',
      content: 'The GPS conditions at airport proximity sites vary significantly — some are clean suburban environments, some are high interference near industrial zones adjacent to airports. GPS is secondary. Airspace status governs.',
      keyPoints: [
        'Regular commercial operations near controlled aerodromes: standard pathway is CASA Part 101 approval specifying operating area, altitude ceiling, and operating times',
        'One-off jobs: some authorisations obtainable through AirShare or ATC facility — but this requires planning time that cannot be compressed into a same-day request at most aerodromes',
        'Airport environments generate a specific type of electromagnetic interference — VOR beacons, ILS, DME, and precision approach radar operate near GPS frequency spectrum',
        'RF interference at airport sites explains why some locations show GPS degradation that is not explained by the visual environment alone',
        'The solution for airport sites is not GPS management — it is regulatory compliance. Get authorisation. Then assess conditions.',
      ]
    },
  ],
  timeWindows: [
    { window: '06:00 – 09:00', status: 'optimal', label: '✅ Best — low sun angle, minimal water reflection intensity, sea breeze not yet building' },
    { window: '09:00 – 14:00', status: 'marginal', label: '⚠️ Workable — multipath increasing as sun rises, sea breeze building, monitor wind closely' },
    { window: '14:00 – 16:00', status: 'marginal', label: '⚠️ Wind risk — sea breeze at daily peak, verify conditions before committing' },
    { window: '15:30 – 17:30', status: 'good', label: '✅ Good secondary — sun dropping, reflection reducing, wind often easing' },
    { window: 'Any time without CASA authorisation (airport sites)', status: 'avoid', label: '🚫 Illegal — Do Not Fly regardless of conditions or experience level' },
    { window: 'Any time with current authorisation (airport sites)', status: 'authorised', label: '✅ Authorised — proceed, check NOTAMs on the day' },
  ],
  failureMode: 'Harbour: position accuracy that looks acceptable from the ground but degrades over open water at lower altitudes. Sea breeze arriving faster than expected, forcing mission postponement mid-setup. Airport: regulatory non-compliance — flying without authorisation in controlled airspace. Not a data quality failure — a legal and safety failure.',
  quiz: [
    {
      question: 'What makes water surface multipath different from building-based multipath in urban environments?',
      options: [
        'Water multipath only affects lower satellite frequencies',
        'Building reflections are directional from specific facades; water reflections are omnidirectional and vary dynamically with surface conditions',
        'Water multipath is less severe than building multipath',
        'Water does not reflect GPS signals — only radio signals'
      ],
      correct: 1
    },
    {
      question: 'What is the recommended launch position at a harbour or waterfront site?',
      options: [
        'As close to the water as possible for the clearest satellite view',
        'Position so open water is in FRONT of the aircraft for best antenna coverage',
        'Position so open water is BEHIND the aircraft at launch and throughout the mission',
        'Elevation above the water surface is the only factor that matters'
      ],
      correct: 2
    },
    {
      question: 'You arrive at a harbour site at 10:30 on a clear summer day. Wind is 18 km/h from the south. What is the most significant risk for the next 2 hours?',
      options: [
        'GPS multipath from morning water reflection',
        'Sea breeze continuing to build toward its 13:00–15:00 peak of 20–35 km/h',
        'Satellite geometry degrading at midday',
        'RTK link interference from the water surface'
      ],
      correct: 1
    },
    {
      question: 'You are planning a job at a site 4km from Bankstown Airport. What is the first thing you must confirm?',
      options: [
        'GPS satellite count at the site',
        'Wind speed and direction',
        'CASA authorisation to fly in the controlled airspace',
        'Time of day for optimal GPS conditions'
      ],
      correct: 2
    },
    {
      question: 'Why does flight altitude matter more at harbour sites than at most other environment types?',
      options: [
        'Wind is stronger at lower altitudes near water',
        'Position accuracy that looks acceptable at 80m can show systematic errors at 30m over open water due to water reflection angle',
        'Battery consumption increases near water',
        'CASA requires minimum altitude at harbour sites'
      ],
      correct: 1
    },
  ]
};

export default function EnvGuide5() {
  return <EnvGuidePage guideData={GUIDE_DATA} totalGuides={5} />;
}