import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Clock, Wind, Cloud, AlertTriangle,
  CheckCircle2, XCircle, RefreshCw, Navigation, Thermometer,
  Zap, Building2, Waves, Plane, TreePine, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

// Environment classification rules based on GPS + reverse geocode + known zones
const ENVIRONMENT_TYPES = {
  AIRPORT: {
    id: 'AIRPORT',
    label: 'Airport Proximity',
    emoji: '✈️',
    color: 'red',
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/40',
    textClass: 'text-red-400',
    icon: Plane,
    description: 'Within controlled airspace (~5.5km of aerodrome). Authorisation required before anything else.',
    keyRule: 'Confirm CASA authorisation FIRST. Do not assess weather or set up equipment until authorisation is confirmed.',
    windows: [
      { window: 'Any time without authorisation', status: 'avoid', label: '🚫 Do Not Fly — Illegal regardless of time or conditions' },
      { window: 'Any time with current authorisation', status: 'optimal', label: '✅ Proceed — Check NOTAMs on the day' }
    ]
  },
  URBAN_CANYON: {
    id: 'URBAN_CANYON',
    label: 'Urban Canyon',
    emoji: '🔴',
    color: 'red',
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/40',
    textClass: 'text-red-400',
    icon: Building2,
    description: 'CBD high-rise corridor. Buildings both sides, strip of sky overhead. GPS reflections off glass/concrete are your main threat.',
    keyRule: 'Higher launch point = better GPS. Rooftop or elevated carpark strongly preferred over street level.',
    windows: [
      { window: '06:00 – 08:00', status: 'optimal', label: '✅ Only window for survey work' },
      { window: '08:00 – 10:00', status: 'marginal', label: '⚠️ Marginal — inspection possible, not survey' },
      { window: 'After 10:00', status: 'avoid', label: '🚫 Avoid — sky geometry too degraded for survey' },
      { window: '15:30 – 17:00', status: 'marginal', label: '⚠️ Inspection only — not photogrammetry' },
      { window: 'After sunset', status: 'avoid', label: '🚫 Do Not Fly' }
    ]
  },
  HIGH_INTERFERENCE: {
    id: 'HIGH_INTERFERENCE',
    label: 'High Interference',
    emoji: '🟠',
    color: 'orange',
    bgClass: 'bg-orange-500/10',
    borderClass: 'border-orange-500/40',
    textClass: 'text-orange-400',
    icon: Zap,
    description: 'Dense commercial, hospital, uni campus, towers, or rail. Signal looks fine but position can wander — watch for ground drift before takeoff.',
    keyRule: 'If aircraft position drifts while stationary, wait 10 min. If not settled, return next morning before 08:00.',
    windows: [
      { window: '06:00 – 08:30', status: 'optimal', label: '✅ Only recommended window — satellite geometry at peak' },
      { window: '08:30 – 10:00', status: 'marginal', label: '⚠️ Marginal — proceed only if position holds steady' },
      { window: '10:00 – 15:00', status: 'avoid', label: '🚫 Avoid survey — GPS at worst, interference compounds it' },
      { window: '15:30 – 17:00', status: 'marginal', label: '⚠️ Secondary window — inspection only, not survey' },
      { window: 'After sunset', status: 'avoid', label: '🚫 Do Not Fly' }
    ]
  },
  HARBOUR: {
    id: 'HARBOUR',
    label: 'Harbour / Water Multipath',
    emoji: '🔵',
    color: 'blue',
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/40',
    textClass: 'text-blue-400',
    icon: Waves,
    description: 'Within ~300m of open water, harbour, river, or bay. Water reflects GPS signals and wind builds fast from the water.',
    keyRule: 'Position launch so open water is BEHIND the antenna, not in front. Direction at launch matters more here than anywhere else.',
    windows: [
      { window: '06:00 – 09:00', status: 'optimal', label: '✅ Best — low sun angle, minimal water reflection, wind light' },
      { window: '09:00 – 14:00', status: 'marginal', label: '⚠️ Workable — multipath increases as sun rises, wind building' },
      { window: '14:00 – 16:00', status: 'marginal', label: '⚠️ Wind risk — sea breeze at peak, check before committing' },
      { window: '15:30 – 17:30', status: 'good', label: '✅ Good secondary — sun dropping, reflection reducing' },
      { window: 'After sunset', status: 'avoid', label: '🚫 Do Not Fly' }
    ]
  },
  MODERATE: {
    id: 'MODERATE',
    label: 'Moderate — Suburban / Light Commercial',
    emoji: '🟡',
    color: 'yellow',
    bgClass: 'bg-yellow-500/10',
    borderClass: 'border-yellow-500/40',
    textClass: 'text-yellow-400',
    icon: Building2,
    description: 'Mix of 2–5 storey buildings within 50–150m. Sky overhead is clear but taller structures cut the low horizon in one or two directions.',
    keyRule: 'GPS works but can drift in the afternoon as satellite geometry degrades and buildings cast longer shadows across your signal path.',
    windows: [
      { window: '06:30 – 09:00', status: 'optimal', label: '✅ Optimal — satellite geometry at best, soft directional light' },
      { window: '09:00 – 11:00', status: 'marginal', label: '⚠️ Acceptable — monitor closely, GPS starting to degrade' },
      { window: '11:00 – 13:30', status: 'avoid', label: '🚫 Avoid survey — GPS unreliable midday, overhead harsh light' },
      { window: '15:30 – 17:30', status: 'good', label: '✅ Good — GPS recovers in afternoon, good light angle' },
      { window: 'After sunset', status: 'avoid', label: '🚫 Do Not Fly' }
    ]
  },
  LOW: {
    id: 'LOW',
    label: 'Low — Open Environment',
    emoji: '🟢',
    color: 'green',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/40',
    textClass: 'text-emerald-400',
    icon: TreePine,
    description: 'Clear sky in most directions. Low-rise or no structures nearby. GPS locks fast, position holds steady. Conditions are in your favour.',
    keyRule: 'The most straightforward site type. Focus on wind and light conditions rather than GPS.',
    windows: [
      { window: '06:30 – 09:00', status: 'optimal', label: '✅ Optimal — best satellite geometry + golden hour light' },
      { window: '09:00 – 15:30', status: 'marginal', label: '⚠️ Acceptable — flat harsh light, slightly degraded GPS midday' },
      { window: '15:30 – 17:30', status: 'good', label: '✅ Good — afternoon golden hour, GPS still reliable' },
      { window: 'After sunset', status: 'avoid', label: '🚫 Do Not Fly — no authorisation, no visual reference' }
    ]
  }
};

// Sydney airport zones (approximate centres + radius in km)
const AIRPORT_ZONES = [
  { name: 'Sydney Airport (Mascot)', lat: -33.9461, lon: 151.1772, radiusKm: 5.5 },
  { name: 'Bankstown Airport', lat: -33.9244, lon: 150.9883, radiusKm: 5.5 },
  { name: 'Camden Airport', lat: -34.0403, lon: 150.6872, radiusKm: 5.5 },
  { name: 'Richmond RAAF', lat: -33.6006, lon: 150.7811, radiusKm: 5.5 },
];

// Water bodies around Sydney (approximate polygon centres)
const WATER_ZONES = [
  { name: 'Sydney Harbour', lat: -33.8568, lon: 151.2153, radiusKm: 2.5 },
  { name: 'Parramatta River', lat: -33.8150, lon: 151.0200, radiusKm: 1.5 },
  { name: 'Botany Bay', lat: -33.9800, lon: 151.1900, radiusKm: 3.0 },
  { name: 'Pittwater', lat: -33.6300, lon: 151.3100, radiusKm: 2.0 },
  { name: 'Port Hacking', lat: -34.0700, lon: 151.1000, radiusKm: 2.0 },
  { name: 'Narrabeen Lagoon', lat: -33.7200, lon: 151.2950, radiusKm: 1.0 },
];

// CBD / urban canyon zones
const URBAN_CANYON_ZONES = [
  { name: 'Sydney CBD', lat: -33.8688, lon: 151.2093, radiusKm: 1.2 },
  { name: 'Parramatta CBD', lat: -33.8150, lon: 151.0050, radiusKm: 0.7 },
  { name: 'North Sydney CBD', lat: -33.8401, lon: 151.2092, radiusKm: 0.6 },
];

// High interference zones (hospitals, universities, transit hubs)
const HIGH_INTERFERENCE_ZONES = [
  { name: 'Westmead Hospital Precinct', lat: -33.8028, lon: 150.9872, radiusKm: 1.0 },
  { name: 'Royal Prince Alfred Hospital', lat: -33.8889, lon: 151.1869, radiusKm: 0.8 },
  { name: 'Central Station', lat: -33.8833, lon: 151.2063, radiusKm: 0.7 },
  { name: 'Macquarie Park', lat: -33.7757, lon: 151.1211, radiusKm: 1.2 },
  { name: 'Redfern', lat: -33.8927, lon: 151.2024, radiusKm: 0.7 },
  { name: 'UNSW Campus', lat: -33.9173, lon: 151.2313, radiusKm: 0.8 },
  { name: 'University of Sydney', lat: -33.8882, lon: 151.1873, radiusKm: 0.8 },
  { name: 'Macquarie University', lat: -33.7738, lon: 151.1123, radiusKm: 0.8 },
  { name: 'Wynyard Station', lat: -33.8657, lon: 151.2058, radiusKm: 0.5 },
];

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function classifyEnvironment(lat, lon) {
  // Check airport first (highest priority)
  for (const zone of AIRPORT_ZONES) {
    if (haversineKm(lat, lon, zone.lat, zone.lon) <= zone.radiusKm) {
      return { type: ENVIRONMENT_TYPES.AIRPORT, matchedZone: zone.name };
    }
  }
  // Check urban canyon
  for (const zone of URBAN_CANYON_ZONES) {
    if (haversineKm(lat, lon, zone.lat, zone.lon) <= zone.radiusKm) {
      return { type: ENVIRONMENT_TYPES.URBAN_CANYON, matchedZone: zone.name };
    }
  }
  // Check high interference
  for (const zone of HIGH_INTERFERENCE_ZONES) {
    if (haversineKm(lat, lon, zone.lat, zone.lon) <= zone.radiusKm) {
      return { type: ENVIRONMENT_TYPES.HIGH_INTERFERENCE, matchedZone: zone.name };
    }
  }
  // Check harbour/water
  for (const zone of WATER_ZONES) {
    if (haversineKm(lat, lon, zone.lat, zone.lon) <= zone.radiusKm) {
      return { type: ENVIRONMENT_TYPES.HARBOUR, matchedZone: zone.name };
    }
  }
  // Default to moderate or low — use LLM for nuanced classification
  return null; // Will fall back to LLM-based classification
}

function getTimeStatus(envType, localHour) {
  if (localHour < 6 || localHour >= 20) return 'dark';

  const windows = {
    AIRPORT: null, // handled separately
    URBAN_CANYON: [
      { start: 6, end: 8, status: 'optimal' },
      { start: 8, end: 10, status: 'marginal' },
      { start: 10, end: 15.5, status: 'avoid' },
      { start: 15.5, end: 17, status: 'marginal' },
    ],
    HIGH_INTERFERENCE: [
      { start: 6, end: 8.5, status: 'optimal' },
      { start: 8.5, end: 10, status: 'marginal' },
      { start: 10, end: 15, status: 'avoid' },
      { start: 15, end: 17, status: 'marginal' },
    ],
    HARBOUR: [
      { start: 6, end: 9, status: 'optimal' },
      { start: 9, end: 14, status: 'marginal' },
      { start: 14, end: 15.5, status: 'marginal' },
      { start: 15.5, end: 17.5, status: 'good' },
    ],
    MODERATE: [
      { start: 6.5, end: 9, status: 'optimal' },
      { start: 9, end: 11, status: 'marginal' },
      { start: 11, end: 13.5, status: 'avoid' },
      { start: 15.5, end: 17.5, status: 'good' },
    ],
    LOW: [
      { start: 6.5, end: 9, status: 'optimal' },
      { start: 9, end: 15.5, status: 'marginal' },
      { start: 15.5, end: 17.5, status: 'good' },
    ],
  };

  const wset = windows[envType] || windows.LOW;
  for (const w of wset) {
    if (localHour >= w.start && localHour < w.end) return w.status;
  }
  return 'marginal';
}

function getWindAdvice(windKmh) {
  if (windKmh >= 35) return { level: 'danger', label: `${windKmh} km/h — Dangerous. Do not fly.`, color: 'text-red-400' };
  if (windKmh >= 25) return { level: 'warning', label: `${windKmh} km/h — High wind. Sea breeze likely at peak.`, color: 'text-orange-400' };
  if (windKmh >= 15) return { level: 'caution', label: `${windKmh} km/h — Moderate. Monitor carefully.`, color: 'text-yellow-400' };
  return { level: 'ok', label: `${windKmh} km/h — Calm. Good conditions.`, color: 'text-emerald-400' };
}

const STATUS_STYLES = {
  optimal: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  good: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  marginal: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  avoid: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function LocationBriefing() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('idle'); // idle | locating | loading | ready | error
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [briefing, setBriefing] = useState(null);
  const [localTime, setLocalTime] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const startBriefing = () => {
    setPhase('locating');
    setBriefing(null);
    setWeather(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLocation({ lat, lon });
        setPhase('loading');

        const now = new Date();
        setLocalTime(now);
        const localHour = now.getHours() + now.getMinutes() / 60;
        const isDark = localHour < 6 || localHour >= 20;

        // Fetch weather from Open-Meteo (free, no key)
        let weatherData = null;
        try {
          const wx = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weathercode&wind_speed_unit=kmh`
          );
          const wxJson = await wx.json();
          weatherData = {
            tempC: Math.round(wxJson.current.temperature_2m),
            windKmh: Math.round(wxJson.current.wind_speed_10m),
            weatherCode: wxJson.current.weathercode,
          };
          setWeather(weatherData);
        } catch (e) {
          console.warn('Weather fetch failed', e);
        }

        // Try coordinate-based classification first
        const coordClassification = classifyEnvironment(lat, lon);

        // Use LLM to classify and generate full briefing
        const windText = weatherData ? `Wind: ${weatherData.windKmh} km/h, Temp: ${weatherData.tempC}°C` : 'Weather data unavailable';
        const timeStr = now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true });
        const coordHint = coordClassification ? `Coordinate analysis suggests: ${coordClassification.type.id} (near ${coordClassification.matchedZone})` : 'No known zone matched by coordinates';

        const prompt = `You are a drone operations expert. A pilot has opened the SiteSee Pilot Companion app to get a pre-flight location briefing.

Location: ${lat.toFixed(5)}, ${lon.toFixed(5)}
Local time: ${timeStr}
${isDark ? '⚠️ IT IS CURRENTLY DARK OR NEAR-DARK — this is a critical safety issue.' : ''}
${windText}
${coordHint}

Based on this location, classify the environment as ONE of: LOW, MODERATE, HIGH_INTERFERENCE, URBAN_CANYON, HARBOUR_MULTIPATH, AIRPORT_PROXIMITY.

Then provide a tailored briefing for this pilot RIGHT NOW at this exact time and location. Be direct, practical, and specific to the current conditions.

Respond with a JSON object:
{
  "environment_type": "LOW|MODERATE|HIGH_INTERFERENCE|URBAN_CANYON|HARBOUR_MULTIPATH|AIRPORT_PROXIMITY",
  "location_name": "best guess suburb/area name",
  "is_flyable_now": true|false,
  "overall_status": "optimal|good|marginal|avoid|dark",
  "headline": "One sentence direct advice for RIGHT NOW",
  "conditions_summary": "2-3 sentences about current conditions and what the pilot should watch for",
  "time_advice": "Specific advice about current time of day for this environment",
  "wind_advice": "Specific wind advice based on current conditions",
  "top_risks": ["risk 1", "risk 2", "risk 3"],
  "immediate_actions": ["action 1", "action 2", "action 3"]
}`;

        try {
          const result = await base44.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: {
              type: 'object',
              properties: {
                environment_type: { type: 'string' },
                location_name: { type: 'string' },
                is_flyable_now: { type: 'boolean' },
                overall_status: { type: 'string' },
                headline: { type: 'string' },
                conditions_summary: { type: 'string' },
                time_advice: { type: 'string' },
                wind_advice: { type: 'string' },
                top_risks: { type: 'array', items: { type: 'string' } },
                immediate_actions: { type: 'array', items: { type: 'string' } }
              }
            }
          });

          // Map env type to our config
          const envKey = result.environment_type?.replace('HARBOUR_MULTIPATH', 'HARBOUR').replace('AIRPORT_PROXIMITY', 'AIRPORT') || 'LOW';
          const envConfig = ENVIRONMENT_TYPES[envKey] || ENVIRONMENT_TYPES.LOW;
          const timeStatus = isDark ? 'dark' : getTimeStatus(envKey, localHour);

          setBriefing({
            env: envConfig,
            locationName: result.location_name || 'Your Location',
            isFlyableNow: !isDark && result.is_flyable_now,
            overallStatus: isDark ? 'dark' : (result.overall_status || timeStatus),
            headline: isDark ? '🌙 It is currently dark. Do not fly — no authorisation or visual reference.' : result.headline,
            conditionsSummary: result.conditions_summary,
            timeAdvice: isDark ? 'Current time is outside all approved flying windows. Wait until at least 06:00 local time.' : result.time_advice,
            windAdvice: result.wind_advice,
            topRisks: result.top_risks || [],
            immediateActions: result.immediate_actions || [],
            isDark,
            localTime: now,
            weatherData,
          });
          setPhase('ready');
        } catch (e) {
          console.error('LLM briefing failed', e);
          // Fallback with coordinate classification
          const envConfig = coordClassification?.type || ENVIRONMENT_TYPES.LOW;
          const timeStatus = isDark ? 'dark' : getTimeStatus(envConfig.id, localHour);
          setBriefing({
            env: envConfig,
            locationName: coordClassification?.matchedZone || 'Your Location',
            isFlyableNow: !isDark && timeStatus !== 'avoid',
            overallStatus: isDark ? 'dark' : timeStatus,
            headline: isDark ? '🌙 It is currently dark. Do not fly.' : `${envConfig.emoji} ${envConfig.label} environment detected.`,
            conditionsSummary: envConfig.description,
            timeAdvice: isDark ? 'Wait until at least 06:00 local time.' : 'Check the time windows below.',
            windAdvice: weatherData ? getWindAdvice(weatherData.windKmh).label : 'Wind data unavailable.',
            topRisks: [],
            immediateActions: [],
            isDark,
            localTime: now,
            weatherData,
            fallback: true,
          });
          setPhase('ready');
        }
      },
      (err) => {
        setErrorMsg('Location access denied. Please enable location in your browser settings.');
        setPhase('error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const statusConfig = {
    dark: { label: 'Dark — Do Not Fly', bg: 'bg-slate-500/20', border: 'border-slate-500/40', text: 'text-slate-300' },
    optimal: { label: 'Optimal Window', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-300' },
    good: { label: 'Good Conditions', bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-300' },
    marginal: { label: 'Marginal — Proceed with Caution', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-300' },
    avoid: { label: 'Avoid — Not Recommended', bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-300' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-lg mx-auto px-5 py-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl('FieldOperationsHub'))}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-white">Location Briefing</h1>
            <p className="text-xs text-slate-400">GPS-based pre-flight environment assessment</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* IDLE */}
          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-10"
            >
              <div className="w-24 h-24 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
                <Navigation className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Start Briefing</h2>
              <p className="text-slate-400 mb-2 text-sm leading-relaxed">
                The app will read your GPS location, check current time and weather, then deliver a tailored briefing card for your environment.
              </p>
              <p className="text-xs text-slate-500 mb-8">Covers: GPS risk, time windows, wind, environment type, and immediate actions.</p>
              <Button
                onClick={startBriefing}
                className="w-full max-w-xs mx-auto bg-blue-500 hover:bg-blue-600 text-white py-4 text-base font-semibold rounded-xl"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Get My Briefing
              </Button>
            </motion.div>
          )}

          {/* LOCATING / LOADING */}
          {(phase === 'locating' || phase === 'loading') && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
              <p className="text-lg font-semibold text-white mb-2">
                {phase === 'locating' ? 'Reading GPS location…' : 'Analysing your environment…'}
              </p>
              <p className="text-sm text-slate-400">
                {phase === 'locating' ? 'Allow location access when prompted' : 'Checking weather, time, and environment type'}
              </p>
            </motion.div>
          )}

          {/* ERROR */}
          {phase === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10"
            >
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <p className="text-white font-semibold mb-2">Location Unavailable</p>
              <p className="text-slate-400 text-sm mb-6">{errorMsg}</p>
              <Button onClick={() => setPhase('idle')} variant="outline" className="border-slate-600">
                Try Again
              </Button>
            </motion.div>
          )}

          {/* READY */}
          {phase === 'ready' && briefing && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Location + Time Header */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white text-sm">{briefing.locationName}</p>
                    <p className="text-xs text-slate-400">{location?.lat?.toFixed(4)}, {location?.lon?.toFixed(4)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-white">
                      {briefing.localTime.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {briefing.localTime.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>

              {/* Overall Status Banner */}
              {(() => {
                const sc = statusConfig[briefing.overallStatus] || statusConfig.marginal;
                return (
                  <div className={`${sc.bg} border ${sc.border} rounded-2xl p-4`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className={`text-xs font-bold uppercase tracking-wider ${sc.text} mb-1`}>{sc.label}</div>
                        <p className="text-white font-semibold text-sm leading-snug">{briefing.headline}</p>
                      </div>
                      <span className="text-3xl">{briefing.env.emoji}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Environment Type */}
              <div className={`${briefing.env.bgClass} border ${briefing.env.borderClass} rounded-2xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${briefing.env.textClass}`}>Environment Type</span>
                </div>
                <p className={`font-bold text-base mb-1 ${briefing.env.textClass}`}>{briefing.env.label}</p>
                <p className="text-slate-300 text-sm leading-relaxed">{briefing.conditionsSummary || briefing.env.description}</p>
              </div>

              {/* Weather Row */}
              {briefing.weatherData && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Wind className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-400">Wind</span>
                    </div>
                    <p className={`font-bold text-sm ${getWindAdvice(briefing.weatherData.windKmh).color}`}>
                      {getWindAdvice(briefing.weatherData.windKmh).label}
                    </p>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Thermometer className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-400">Temperature</span>
                    </div>
                    <p className="font-bold text-sm text-white">{briefing.weatherData.tempC}°C</p>
                  </div>
                </div>
              )}

              {/* Time Advice */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Time Assessment</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{briefing.timeAdvice}</p>
              </div>

              {/* Top Risks */}
              {briefing.topRisks?.length > 0 && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Key Risks Right Now</span>
                  </div>
                  <ul className="space-y-2">
                    {briefing.topRisks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Immediate Actions */}
              {briefing.immediateActions?.length > 0 && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Immediate Actions</span>
                  </div>
                  <ul className="space-y-2">
                    {briefing.immediateActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Rule */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Key Rule for This Environment</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{briefing.env.keyRule}</p>
              </div>

              {/* Time Windows */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Time Windows — {briefing.env.label}</p>
                <div className="space-y-2">
                  {briefing.env.windows.map((w, i) => (
                    <div key={i} className={`border rounded-lg px-3 py-2 text-xs font-medium ${STATUS_STYLES[w.status] || STATUS_STYLES.marginal}`}>
                      <span className="font-bold">{w.window}</span> — {w.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Refresh */}
              <Button
                onClick={startBriefing}
                variant="outline"
                className="w-full border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Briefing
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}