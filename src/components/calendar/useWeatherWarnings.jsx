import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SITES } from '@/components/siteintel/siteData';
import { addDays, parseISO } from 'date-fns';

async function fetchWeatherForLocations(locationGroups) {
  const results = {};
  await Promise.all(locationGroups.map(async ({ key, lat, lng, date }) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=precipitation_sum,windspeed_10m_max&timezone=auto&start_date=${date}&end_date=${date}`;
      const res = await fetch(url);
      const data = await res.json();
      const wind = data?.daily?.windspeed_10m_max?.[0] ?? 0;
      const rain = data?.daily?.precipitation_sum?.[0] ?? 0;
      results[key] = { wind, rain };
    } catch (e) {
      // silently fail - no weather data is fine
    }
  }));
  return results;
}

export function useWeatherWarnings(missions) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = addDays(today, 14);

  const relevantMissions = useMemo(() => {
    return missions.filter(m => {
      if (!m.scheduled_date || !m.site_id) return false;
      const d = parseISO(m.scheduled_date);
      return d >= today && d <= maxDate;
    });
  }, [missions]);

  const locationGroups = useMemo(() => {
    const seen = new Set();
    return relevantMissions.flatMap(m => {
      const site = SITES.find(s => s.id === m.site_id);
      if (!site) return [];
      const key = `${site.lat},${site.lng},${m.scheduled_date}`;
      if (seen.has(key)) return [];
      seen.add(key);
      return [{ key, lat: site.lat, lng: site.lng, date: m.scheduled_date }];
    });
  }, [relevantMissions]);

  const queryKey = locationGroups.map(l => l.key).join('|');

  const { data: weatherData } = useQuery({
    queryKey: ['weather', queryKey],
    queryFn: () => fetchWeatherForLocations(locationGroups),
    enabled: locationGroups.length > 0,
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  return useMemo(() => {
    if (!weatherData) return {};
    const map = {};
    relevantMissions.forEach(m => {
      const site = SITES.find(s => s.id === m.site_id);
      if (!site) return;
      const key = `${site.lat},${site.lng},${m.scheduled_date}`;
      const w = weatherData[key];
      if (!w) return;
      const windWarn = w.wind > 20;
      const rainWarn = w.rain > 0.1;
      if (windWarn || rainWarn) {
        map[m.id] = {
          hasWarning: true,
          wind: Math.round(w.wind),
          rain: parseFloat(w.rain.toFixed(1)),
          reasons: [
            windWarn ? `Wind ${Math.round(w.wind)} km/h` : null,
            rainWarn ? `Rain ${w.rain.toFixed(1)} mm` : null,
          ].filter(Boolean),
        };
      }
    });
    return map;
  }, [weatherData, relevantMissions]);
}