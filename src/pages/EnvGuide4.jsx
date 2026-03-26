import React from 'react';
import EnvGuidePage from '@/components/EnvGuidePage';

const GUIDE_DATA = {
  id: 'env-guide-4',
  number: 4,
  title: 'Urban Canyon',
  subtitle: 'CBD High-Rise Corridors',
  emoji: '🔴',
  estimatedTime: '11 min',
  bgClass: 'bg-red-500/10',
  borderClass: 'border-red-500/30',
  textClass: 'text-red-400',
  intro: 'An urban canyon is the most technically demanding environment you will fly in regularly. Tall buildings on both sides create a corridor that severely restricts GPS sky view — instead of a hemisphere of accessible sky, your antenna can only see a narrow strip directly overhead. The GPS receiver cannot distinguish between a direct satellite signal and one that reflected off a glass tower. In a canyon, the majority of received signals may be reflected, meaning your displayed position can be metres away from your actual location.',
  keyRule: 'Higher launch point = better GPS. Rooftop, elevated carpark, or building setback strongly preferred over street level. Never launch from street level if an elevated alternative exists — it changes the fundamental quality of the GPS environment your aircraft operates in.',
  sections: [
    {
      title: 'What Creates This Environment',
      content: 'The critical variable is the ratio of building height to street width. In Sydney\'s CBD the combination of historical narrow street grids — many from colonial-era surveying — and modern high-rise infill creates some of the most severe urban canyon conditions in the country.',
      keyPoints: [
        'A narrow lane with 40-storey buildings is far worse than a wide boulevard with the same building heights',
        'As buildings get taller, the number of satellites visible above the obstruction threshold drops sharply',
        'A satellite at 15° above the horizon is accessible from an open field but completely blocked by a 40-storey building on the same bearing',
        'Every glass and metal facade facing your aircraft is a potential multipath source — hundreds of millions of cm² of reflective surface within signal range',
        'In a CBD canyon, multipath contamination is often the dominant input to your receiver — not a minor perturbation',
        'The reflective surface area for multipath signals increases dramatically with building height and density',
      ]
    },
    {
      title: 'What You Will Experience',
      content: 'Three specific experiences distinguish canyon sites from all other environment types.',
      keyPoints: [
        'GPS lock takes unusually long — often 5 to 10 minutes rather than 90 seconds. When lock appears, satellite count may look acceptable but is drawn from a narrow overhead window.',
        'Significant drift before arming — at moderate sites, 2–5m drift over 2 minutes is a warning. At canyon sites, 5–20m is not unusual.',
        'Positional jumps — your position indicator suddenly shifts 8m, holds, then shifts back. This happens when the receiver cycles through satellite selections and multipath geometry changes abruptly.',
        'For a hovering aircraft, positional jumps are dangerous — the flight controller interprets the jump as the aircraft having moved and issues corrective thrust, potentially toward a building.',
        'Battery drain is higher — constant small thrust corrections to compensate for noisy position signal.',
      ]
    },
    {
      title: 'Height and GPS Quality',
      content: 'One of the most practically important principles for urban canyon operations: GPS quality improves significantly with altitude. Your launch point selection directly determines the GPS quality during the entire mission.',
      keyPoints: [
        'At street level CBD: sky view limited to ~40° arc directly overhead',
        'At 30m (above podium parapet): view opens to ~80–100°',
        'At 80m (clear of most mid-rise): view may be 150° or greater',
        'Find an elevated carpark rooftop, building setback terrace, or clear plaza at the base of a taller structure',
        'The 20 minutes spent finding a better launch point is not overhead — it is mission-critical work',
        'Never launch from street level in an urban canyon if an elevated alternative exists within reasonable proximity',
      ]
    },
    {
      title: 'Battery Strategy for Urban Captures',
      content: 'In urban canyon environments, battery discipline is not just about range — it directly determines data quality and GPS consistency throughout the capture.',
      keyPoints: [
        'One battery = best chance of success. GPS lock and position hold tend to degrade with each power cycle in canyon environments.',
        'Markup on battery 1, flight on battery 2 — if you must use two batteries, complete all ground markup and planning on the first battery, land, swap, then fly immediately at full charge.',
        'Large site? Split into two missions — rather than mid-mission battery swaps, run each half as a complete independent mission. This preserves GPS consistency and data integrity within each capture.',
        'Mid-mission battery swaps in canyon conditions compound the GPS instability — each power cycle is a new GPS acquisition in a hostile environment.',
      ]
    },
    {
      title: 'What This Site Teaches You',
      content: 'Urban canyon operations are the highest expression of skills built across every other environment type. Everything you learned converges here.',
      keyPoints: [
        'Everything from satellite geometry at low sites, position drift at moderate sites, and time-of-day at high interference sites — all converge at the canyon',
        'The GPS environment at a canyon site is not a fixed condition you adapt to — it is a variable you manage through timing, launch position, and willingness to postpone',
        'The canyon does not become easier. You become better at reading it.',
        'The pilot who thrives here has internalised one principle: the GPS environment is a variable you manage, not a given you accept',
      ]
    },
  ],
  timeWindows: [
    { window: '06:00 – 08:00', status: 'optimal', label: '✅ Only window for survey-grade work — best satellite geometry of day, lower multipath intensity' },
    { window: '08:00 – 10:00', status: 'marginal', label: '⚠️ Marginal — inspection possible, not survey. Proceed only if position holds steady.' },
    { window: '10:00 – 15:30', status: 'avoid', label: '🚫 Avoid — sky geometry degraded, peak reflective surface heating, maximum EM background noise' },
    { window: '15:30 – 17:00', status: 'marginal', label: '⚠️ Experienced pilots only — facade documentation near structure, not across canyon floor' },
    { window: 'After sunset', status: 'avoid', label: '🚫 Do Not Fly' },
  ],
  failureMode: 'Two categories: data quality failure (mission completes, pilot lands with no incident, dataset returns with significant orthomosaic errors, vertical inaccuracy, surface distortion) and in-flight incident (positional jump causes flight controller to issue corrective thrust toward a building). The second is rarer. The first is consistent.',
  quiz: [
    {
      question: 'Why do positional jumps occur in urban canyon environments?',
      options: [
        'Wind moves the aircraft suddenly',
        'The receiver cycles through satellite selections and the multipath geometry changes abruptly, causing the displayed position to shift',
        'The aircraft compass is incorrect',
        'Battery voltage fluctuations affect the GPS module'
      ],
      correct: 1
    },
    {
      question: 'What is the approximate sky view angle at street level in a CBD canyon vs 80m altitude?',
      options: [
        'Same at all altitudes — sky view is fixed',
        'Street level ~40°, at 80m ~150° or greater',
        'Street level ~90°, at 80m ~180°',
        'Sky view depends on time of day, not altitude'
      ],
      correct: 1
    },
    {
      question: 'You need to fly a large CBD rooftop site that requires two batteries. What is the recommended battery strategy?',
      options: [
        'Fly continuously, swap mid-mission without landing',
        'Fly the full site, land, swap, and reshoot any missing areas',
        'Split the site into two independent missions, one per battery',
        'Use one battery for the full site at reduced resolution'
      ],
      correct: 2
    },
    {
      question: 'What is the ONLY time window for survey-grade work at urban canyon sites?',
      options: ['Any time before noon', '06:00 – 08:00', '09:00 – 11:00', '15:30 – 17:00'],
      correct: 1
    },
    {
      question: 'You are setting up on a CBD street. An elevated carpark rooftop is 15 minutes walk away. What should you do?',
      options: [
        'Launch from street level — 15 minutes is too long to add to the job',
        'Walk to the carpark rooftop — launch position selection is mission-critical work in a canyon',
        'Launch from street level but fly higher to compensate',
        'Use manual flight mode at street level'
      ],
      correct: 1
    },
  ]
};

export default function EnvGuide4() {
  return <EnvGuidePage guideData={GUIDE_DATA} totalGuides={5} />;
}