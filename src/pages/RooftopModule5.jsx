import React from 'react';
import RooftopModulePage from '@/components/RooftopModulePage';

const MODULE_DATA = {
  id: 'module5',
  number: 5,
  title: 'Module 5: Large Height Differences (>25m)',
  estimatedTime: '2 minutes',
  prerequisite: 'module2',
  videoId: '97JINuxawVo',
  description: 'Understand the Maximum Height Difference constraint (25m limit) when marking equipment at significantly different elevations. Learn when missions require manual adjustment and how to contact SiteSee Support.',
  goals: [
    'Understand the Maximum Height Difference constraint and why it exists',
    'Correctly identify when a mission cannot be generated due to height delta',
    'Know exactly when to stop field work and escalate to support',
    'Communicate issues clearly to SiteSee Support with proper documentation',
    'Recognize height difference violations during planning phase before field deployment',
    'Understand alternative capture strategies for extreme height difference sites'
  ],
  sections: [
    {
      title: 'The 25m Maximum Height Difference Constraint',
      content: 'NexDT enforces a hard 25-meter limit on the vertical spread between the lowest and highest marked points. This constraint exists due to photogrammetry reconstruction limitations and flight safety margins.',
      keyPoints: [
        'Maximum delta: 25 meters between lowest marked point and highest marked point',
        'Calculation: Highest point elevation - Lowest point elevation = Delta',
        'Example violation: Equipment at 8m + Equipment at 40m = 32m delta (EXCEEDS LIMIT)',
        'This includes ALL marked elements: equipment clusters, obstacles, neighboring buildings',
        'The limit cannot be overridden in the field or through mission settings',
        'Technical reason: Photogrammetry reconstruction quality degrades beyond 25m vertical spread'
      ]
    },
    {
      title: 'Why This Limit Exists',
      content: 'Understanding the technical rationale helps pilots recognize when they are approaching the constraint before committing to field work.',
      keyPoints: [
        'Photogrammetry works best with consistent imaging distance and angle',
        'Large height spreads cause extreme perspective differences between images',
        'Features at 8m are close-up; features at 40m appear much smaller in same image',
        'This scale variation reduces feature matching accuracy during reconstruction',
        'Flight safety: Extreme altitude changes increase collision risk and GPS drift exposure',
        'Battery management: Large vertical movements consume more power per image'
      ]
    },
    {
      title: 'Recognizing Height Violations Early',
      content: 'Identify potential violations during mission planning phase, before arriving on site.',
      keyPoints: [
        'Review site brief: Look for "tower-on-building" or "multi-story" language',
        'Check building data: Google Earth can reveal approximate height differences',
        'Historical site data: Previous captures may indicate equipment elevation spread',
        'Site photos: Customer-provided photos may show extreme height differences',
        'If violation suspected pre-deployment: Contact support for mission strategy BEFORE field visit',
        'Early identification saves wasted field time and travel costs'
      ]
    },
    {
      title: 'This Is a STOP Condition',
      content: 'When you encounter the maximum height difference error, it is NOT a pilot mistake and CANNOT be fixed through field adjustments.',
      keyPoints: [
        'The mission cannot be generated with current marking configuration',
        'Retrying the marking process will not resolve the issue',
        'Adjusting boundary polygon size will not change the height delta',
        'Reducing orbit count will not bypass the constraint',
        'Disabling panorama/orthomosaic will not remove the height limitation',
        'This is a fundamental system constraint, not a software bug or pilot error'
      ]
    },
    {
      title: 'Field Response Protocol',
      content: 'Immediate steps to take when you encounter maximum height difference error on-site.',
      keyPoints: [
        'Step 1: STOP all marking and mission generation attempts immediately',
        'Step 2: Capture clear photos of all equipment clusters showing height differences',
        'Step 3: Screenshot the error message from mission planner',
        'Step 4: Note exact height values for lowest and highest marked points',
        'Step 5: Calculate and document the delta: "32m height difference (40m - 8m)"',
        'Step 6: Do NOT attempt workarounds like under-marking equipment heights'
      ]
    },
    {
      title: 'Support Escalation Requirements',
      content: 'What information SiteSee Support needs to provide alternative solutions.',
      keyPoints: [
        'Required info #1: Site name and customer/job reference',
        'Required info #2: Exact height values and calculated delta',
        'Required info #3: Photos showing equipment distribution and heights',
        'Required info #4: Screenshot of height difference error message',
        'Required info #5: Confirmation you have NOT attempted workarounds',
        'Support response time: Typically within 1-2 hours during business hours'
      ]
    },
    {
      title: 'Alternative Capture Strategies',
      content: 'Potential solutions that SiteSee Support may recommend for extreme height difference sites.',
      keyPoints: [
        'Option 1: Split into two separate missions (Low-level and High-level captures)',
        'Option 2: Manual mission plan with adjusted parameters (requires support approval)',
        'Option 3: Focus on single critical equipment cluster, treat others as obstacles',
        'Option 4: Panorama-only capture with manual orbit of extreme-height equipment',
        'Option 5: Hybrid approach using both autonomous and manual flight segments',
        'Decision authority: Only SiteSee Support can authorize these alternative strategies'
      ]
    },
    {
      title: 'Prevention and Planning',
      content: 'Strategies to minimize height difference violations through better planning.',
      keyPoints: [
        'Pre-site reconnaissance: Review all available site data before deployment',
        'Customer communication: Ask if site has tower-on-building configuration',
        'Historical data review: Check if previous captures exist and their approach',
        'Flagging system: Mark sites as "potential height violation" in planning system',
        'Buffer time: Schedule extra time for complex sites requiring support consultation',
        'Alternative workflows: Have panorama-only workflow ready as backup plan'
      ]
    }
  ],
  quiz: [
    {
      question: 'What is the maximum allowed height difference in a single rooftop mission?',
      options: ['15 meters', '20 meters', '25 meters', '30 meters'],
      correct: 2
    },
    {
      question: 'A rooftop has equipment clusters at 10m and 38m AGL. What should the pilot do?',
      options: [
        'Retry marking with more precise measurements',
        'Reduce boundary polygon size to fit within limit',
        'Disable panorama and orthomosaic deliverables',
        'Stop marking and contact SiteSee Support immediately'
      ],
      correct: 3
    },
    {
      question: 'Why does the 25m height difference limit exist?',
      options: [
        'Battery capacity limitations',
        'Photogrammetry reconstruction quality degrades with extreme height spreads',
        'Drone flight speed restrictions',
        'GPS accuracy limitations'
      ],
      correct: 1
    },
    {
      question: 'What information does SiteSee Support require when escalating a height difference violation?',
      options: [
        'Only site name',
        'Site name, height values, photos, error screenshot, and calculated delta',
        'Just the error message screenshot',
        'Site name and customer contact info'
      ],
      correct: 1
    },
    {
      question: 'Can the height difference limit be overridden by adjusting mission settings?',
      options: [
        'Yes, by disabling safety constraints',
        'Yes, by reducing orbit count',
        'No, it is a hard system constraint that cannot be overridden in field',
        'Yes, by using manual flight mode'
      ],
      correct: 2
    },
    {
      question: 'What should you do if you suspect a site might violate height limits BEFORE arriving on site?',
      options: [
        'Proceed to site and deal with it if it happens',
        'Contact SiteSee Support during planning phase for mission strategy',
        'Bring extra batteries to compensate',
        'Plan to fly manual orbits instead'
      ],
      correct: 1
    },
    {
      question: 'Which marking elements count toward the 25m height difference calculation?',
      options: [
        'Only equipment clusters',
        'Only equipment and obstacles',
        'All marked elements: equipment, obstacles, and neighboring buildings',
        'Only the primary equipment cluster'
      ],
      correct: 2
    },
    {
      question: 'What is a potential alternative solution for extreme height difference sites?',
      options: [
        'Pilot decides to under-mark equipment heights',
        'Skip marking highest equipment',
        'SiteSee Support may authorize splitting into two separate missions',
        'Proceed with flight despite error message'
      ],
      correct: 2
    }
  ]
};

export default function RooftopModule5() {
  return <RooftopModulePage moduleData={MODULE_DATA} totalModules={5} />;
}