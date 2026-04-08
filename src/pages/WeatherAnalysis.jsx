import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAccessControl, filterMissionsByAccess } from '@/components/useAccessControl';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Loader2, Cloud, CloudRain, Wind, Sun, TrendingUp, AlertTriangle } from 'lucide-react';
import { format, getMonth, getHours, parseISO } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function WeatherAnalysis() {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('all');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const permissions = useAccessControl(user);

  const { data: missionLogs = [], isLoading } = useQuery({
    queryKey: ['allMissions'],
    queryFn: () => base44.entities.MissionLog.list('-created_date', 1000),
  });

  const { data: importedMissions = [] } = useQuery({
    queryKey: ['importedMissions'],
    queryFn: () => base44.entities.Mission.list('-created_date', 500),
  });

  const allMissions = useMemo(() => {
    const combined = [...missionLogs];
    importedMissions.forEach(im => {
      const date = im.capture_timestamp || im.created_date;
      const hour = date ? getHours(parseISO(date)) : 12;
      let timeOfDay = 'Morning';
      if (hour >= 10 && hour < 14) timeOfDay = 'Midday';
      else if (hour >= 14) timeOfDay = 'Afternoon';

      combined.push({
        id: im.id,
        mission_date: date,
        region: im.region,
        country: im.country,
        province: im.province,
        latitude: im.latitude,
        longitude: im.longitude,
        weather_condition: null,
        time_of_day: timeOfDay,
        outcome: im.outcome === 'SUCCESS' ? 'Pass' : 'Fail',
        created_date: im.created_date,
        site_name: im.site_name,
        pilot_group: im.pilot_group,
        data_source: 'imported'
      });
    });
    return combined;
  }, [missionLogs, importedMissions]);

  const missions = useMemo(() => {
    if (!user) return [];
    return filterMissionsByAccess(allMissions, permissions, user.email, user);
  }, [allMissions, permissions, user]);

  // Weather pattern prediction by month
  const weatherByMonth = useMemo(() => {
    const byMonth = {};
    missions.forEach(m => {
      if (!m.mission_date || !m.weather_condition) return;
      const month = format(parseISO(m.mission_date), 'MMM');
      if (!byMonth[month]) {
        byMonth[month] = { month, Clear: 0, Cloudy: 0, Windy: 0, Rain: 0, total: 0 };
      }
      byMonth[month][m.weather_condition]++;
      byMonth[month].total++;
    });
    
    return Object.values(byMonth).map(m => ({
      month: m.month,
      Clear: ((m.Clear / m.total) * 100).toFixed(1),
      Cloudy: ((m.Cloudy / m.total) * 100).toFixed(1),
      Windy: ((m.Windy / m.total) * 100).toFixed(1),
      Rain: ((m.Rain / m.total) * 100).toFixed(1)
    }));
  }, [missions]);

  // Weather vs Outcome correlation
  const weatherOutcome = useMemo(() => {
    const stats = {};
    missions.forEach(m => {
      if (!m.weather_condition) return;
      const weather = m.weather_condition;
      if (!stats[weather]) {
        stats[weather] = { weather, total: 0, pass: 0, fail: 0, rework: 0 };
      }
      stats[weather].total++;
      if (m.outcome === 'Pass') stats[weather].pass++;
      if (m.outcome === 'Fail') stats[weather].fail++;
      if (m.outcome === 'Rework') stats[weather].rework++;
    });

    return Object.values(stats).map(s => ({
      weather: s.weather,
      passRate: ((s.pass / s.total) * 100).toFixed(1),
      failRate: ((s.fail / s.total) * 100).toFixed(1),
      reworkRate: ((s.rework / s.total) * 100).toFixed(1),
      total: s.total
    }));
  }, [missions]);

  // Time of day vs weather
  const timeWeather = useMemo(() => {
    const stats = {};
    missions.forEach(m => {
      if (!m.time_of_day || !m.weather_condition) return;
      const key = m.time_of_day;
      if (!stats[key]) {
        stats[key] = { time: key, Clear: 0, Cloudy: 0, Windy: 0, Rain: 0 };
      }
      stats[key][m.weather_condition]++;
    });
    return Object.values(stats);
  }, [missions]);

  // Historical mission records with weather
  const historicalRecords = useMemo(() => {
    return missions
      .filter(m => m.region && m.mission_date)
      .map(m => {
        const date = parseISO(m.mission_date);
        return {
          ...m,
          dateFormatted: format(date, 'MMM d, yyyy'),
          timeFormatted: format(date, 'h:mm a'),
          month: format(date, 'MMMM'),
          hour: getHours(date),
          hasWeatherData: !!m.weather_condition
        };
      })
      .sort((a, b) => new Date(b.mission_date) - new Date(a.mission_date));
  }, [missions]);

  // Detailed analysis by specific date, time, and location
  const detailedAnalysis = useMemo(() => {
    const analysis = [];
    
    missions.forEach(m => {
      if (!m.region || !m.mission_date) return;
      
      const date = parseISO(m.mission_date);
      const dayOfWeek = format(date, 'EEEE');
      const exactDate = format(date, 'MMMM d, yyyy');
      const exactTime = format(date, 'h:mm a');
      const month = format(date, 'MMMM');
      const hour = getHours(date);
      
      analysis.push({
        ...m,
        dayOfWeek,
        exactDate,
        exactTime,
        month,
        hour,
        hasWeatherData: !!m.weather_condition
      });
    });
    
    return analysis.sort((a, b) => new Date(b.mission_date) - new Date(a.mission_date));
  }, [missions]);

  // Regional patterns with exact timestamps
  const regionalTimePatterns = useMemo(() => {
    const patterns = {};
    
    missions.forEach(m => {
      if (!m.region || !m.mission_date) return;
      
      const region = m.region;
      const date = parseISO(m.mission_date);
      const hour = getHours(date);
      const month = format(date, 'MMMM');
      
      if (!patterns[region]) {
        patterns[region] = {
          region,
          missions: [],
          byMonth: {},
          byHour: {},
          successRate: { total: 0, pass: 0 }
        };
      }
      
      patterns[region].missions.push({
        exactDate: format(date, 'MMMM d, yyyy'),
        exactTime: format(date, 'h:mm a'),
        dayOfWeek: format(date, 'EEEE'),
        weather: m.weather_condition,
        outcome: m.outcome,
        site: m.site_name
      });
      
      // Track by month
      if (!patterns[region].byMonth[month]) {
        patterns[region].byMonth[month] = { Clear: 0, Cloudy: 0, Windy: 0, Rain: 0, total: 0 };
      }
      patterns[region].byMonth[month].total++;
      if (m.weather_condition) {
        patterns[region].byMonth[month][m.weather_condition]++;
      }
      
      // Track by hour
      if (!patterns[region].byHour[hour]) {
        patterns[region].byHour[hour] = { Clear: 0, Cloudy: 0, Windy: 0, Rain: 0, total: 0 };
      }
      patterns[region].byHour[hour].total++;
      if (m.weather_condition) {
        patterns[region].byHour[hour][m.weather_condition]++;
      }
      
      // Success rate
      patterns[region].successRate.total++;
      if (m.outcome === 'Pass') patterns[region].successRate.pass++;
    });
    
    return Object.values(patterns);
  }, [missions]);

  // Location-based weather patterns
  const locationWeatherPatterns = useMemo(() => {
    const byRegion = {};
    missions.forEach(m => {
      if (!m.region || !m.weather_condition || !m.mission_date) return;
      const region = m.region;
      const month = format(parseISO(m.mission_date), 'MMM');
      const hour = getHours(parseISO(m.mission_date));
      let timeOfDay = 'Morning';
      if (hour >= 10 && hour < 14) timeOfDay = 'Midday';
      else if (hour >= 14) timeOfDay = 'Afternoon';

      const key = `${region}_${month}_${timeOfDay}`;
      if (!byRegion[key]) {
        byRegion[key] = { region, month, timeOfDay, Clear: 0, Cloudy: 0, Windy: 0, Rain: 0, total: 0, missions: [] };
      }
      byRegion[key][m.weather_condition]++;
      byRegion[key].total++;
      byRegion[key].missions.push({
        date: format(parseISO(m.mission_date), 'MMM d, yyyy'),
        time: format(parseISO(m.mission_date), 'h:mm a'),
        weather: m.weather_condition,
        outcome: m.outcome
      });
    });
    return byRegion;
  }, [missions]);

  // Weather prediction for future missions
  const weatherPrediction = useMemo(() => {
    const now = new Date();
    const currentMonth = format(now, 'MMM');
    const currentHour = getHours(now);
    
    let timeOfDay = 'Morning';
    if (currentHour >= 10 && currentHour < 14) timeOfDay = 'Midday';
    else if (currentHour >= 14) timeOfDay = 'Afternoon';

    // Get all unique regions
    const regions = [...new Set(missions.filter(m => m.region).map(m => m.region))];
    
    const predictions = regions.map(region => {
      const key = `${region}_${currentMonth}_${timeOfDay}`;
      const pattern = locationWeatherPatterns[key];
      
      if (!pattern) return null;
      
      const weatherProbs = Object.entries({ Clear: pattern.Clear, Cloudy: pattern.Cloudy, Windy: pattern.Windy, Rain: pattern.Rain })
        .map(([w, count]) => ({ weather: w, probability: ((count / pattern.total) * 100).toFixed(1) }))
        .sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
      
      return {
        region,
        predicted: weatherProbs,
        sampleSize: pattern.total,
        mostLikely: weatherProbs[0]
      };
    }).filter(Boolean);

    return { timeOfDay, month: currentMonth, predictions };
  }, [missions, locationWeatherPatterns]);

  if (!isLoading && permissions.level === 'pilot') {
    window.location.href = '/';
    return null;
  }

  const weatherIcons = {
    Clear: <Sun className="w-5 h-5 text-yellow-400" />,
    Cloudy: <Cloud className="w-5 h-5 text-slate-400" />,
    Windy: <Wind className="w-5 h-5 text-blue-400" />,
    Rain: <CloudRain className="w-5 h-5 text-blue-600" />
  };

  const weatherColors = {
    Clear: '#fbbf24',
    Cloudy: '#94a3b8',
    Windy: '#60a5fa',
    Rain: '#3b82f6'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-5 py-8 pb-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold">Weather Analysis & Prediction</h1>
          <p className="text-slate-400 mt-1">Historical patterns and mission outcome correlations</p>
        </motion.div>

        {/* Detailed Regional Analysis */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-6">
          <h3 className="font-semibold mb-4">Detailed Analysis by Region, Date & Time</h3>
          <p className="text-xs text-slate-400 mb-4">Specific mission records with exact timestamps and conditions</p>
          <div className="space-y-6">
            {regionalTimePatterns.slice(0, 5).map((pattern, idx) => (
              <div key={idx} className="bg-slate-700/20 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg text-slate-200">{pattern.region}</h4>
                    <p className="text-xs text-slate-400">
                      {pattern.missions.length} missions • {((pattern.successRate.pass / pattern.successRate.total) * 100).toFixed(1)}% success rate
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {pattern.missions.slice(0, 10).map((mission, midx) => (
                    <div key={midx} className="bg-slate-800/50 rounded-lg p-3 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="font-medium text-slate-200 mb-1">
                            {mission.dayOfWeek}, {mission.exactDate}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>🕐 {mission.exactTime}</span>
                            {mission.site && <span>📍 {mission.site}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {mission.weather && (
                            <div className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded">
                              {weatherIcons[mission.weather]}
                              <span className="text-xs font-medium">{mission.weather}</span>
                            </div>
                          )}
                          <div className={`px-2 py-1 rounded text-xs font-semibold ${
                            mission.outcome === 'Pass' ? 'bg-emerald-500/20 text-emerald-400' : 
                            mission.outcome === 'Fail' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {mission.outcome}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Monthly breakdown */}
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-2">Weather patterns by month:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(pattern.byMonth).map(([month, data]) => {
                      const total = data.total;
                      const mostCommon = ['Clear', 'Cloudy', 'Windy', 'Rain'].reduce((prev, curr) => 
                        data[curr] > data[prev] ? curr : prev
                      );
                      const percentage = total > 0 ? ((data[mostCommon] / total) * 100).toFixed(0) : 0;
                      
                      return (
                        <div key={month} className="bg-slate-800/30 rounded-lg p-2 text-xs">
                          <div className="font-medium text-slate-300 mb-1">{month}</div>
                          <div className="flex items-center gap-1">
                            {data[mostCommon] > 0 && weatherIcons[mostCommon]}
                            <span className="text-slate-400">{mostCommon} ({percentage}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Location-Based Weather Prediction */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="font-semibold text-lg">Weather Prediction by Location</h3>
              <p className="text-xs text-slate-400">Based on historical patterns for {weatherPrediction.month} ({weatherPrediction.timeOfDay})</p>
            </div>
          </div>
          <div className="space-y-4">
            {weatherPrediction.predictions.map((pred, idx) => {
              const key = `${pred.region}_${weatherPrediction.month}_${weatherPrediction.timeOfDay}`;
              const pattern = locationWeatherPatterns[key];
              
              return (
                <div key={idx} className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-200">{pred.region}</h4>
                      <p className="text-xs text-slate-500">{pred.sampleSize} historical missions</p>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-2 rounded-lg">
                      {weatherIcons[pred.mostLikely.weather]}
                      <div>
                        <p className="font-semibold text-sm">{pred.mostLikely.weather}</p>
                        <p className="text-xs text-blue-400">{pred.mostLikely.probability}% likely</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {pred.predicted.map((p, pidx) => (
                      <div key={pidx} className="bg-slate-700/30 rounded-lg p-2 text-center">
                        <div className="flex justify-center mb-1">{weatherIcons[p.weather]}</div>
                        <p className="text-xs font-semibold">{p.weather}</p>
                        <p className="text-xs text-slate-400">{p.probability}%</p>
                      </div>
                    ))}
                  </div>
                  {pattern && pattern.missions.length > 0 && (
                    <div className="border-t border-slate-700/50 pt-3 mt-3">
                      <p className="text-xs text-slate-500 mb-2">Recent examples:</p>
                      <div className="space-y-1">
                        {pattern.missions.slice(0, 3).map((m, midx) => (
                          <div key={midx} className="text-xs text-slate-400 flex items-center gap-2">
                            <span>•</span>
                            <span>{m.date} at {m.time}</span>
                            <span className="text-slate-600">→</span>
                            <span className="flex items-center gap-1">
                              {weatherIcons[m.weather]}
                              {m.weather}
                            </span>
                            <span className={`ml-auto px-2 py-0.5 rounded ${
                              m.outcome === 'Pass' ? 'bg-emerald-500/20 text-emerald-400' : 
                              m.outcome === 'Fail' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {m.outcome}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Weather Impact on Mission Success */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-6">
          <h3 className="font-semibold mb-4">Weather Impact on Mission Success</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weatherOutcome}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="weather" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              <Legend />
              <Bar dataKey="passRate" fill="#10b981" name="Pass Rate %" />
              <Bar dataKey="failRate" fill="#ef4444" name="Fail Rate %" />
              <Bar dataKey="reworkRate" fill="#f59e0b" name="Rework Rate %" />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-4 gap-4 mt-6">
            {weatherOutcome.map((w, idx) => (
              <div key={idx} className="bg-slate-700/30 rounded-xl p-4 text-center">
                <div className="flex justify-center mb-2">{weatherIcons[w.weather]}</div>
                <p className="font-semibold text-sm mb-1">{w.weather}</p>
                <p className="text-xs text-slate-400">{w.total} missions</p>
                <div className={`mt-2 px-2 py-1 rounded text-xs font-bold ${parseFloat(w.failRate) > 20 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {w.failRate}% fail rate
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weather Patterns by Month */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-6">
          <h3 className="font-semibold mb-4">Weather Patterns by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weatherByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              <Legend />
              <Line type="monotone" dataKey="Clear" stroke={weatherColors.Clear} strokeWidth={2} />
              <Line type="monotone" dataKey="Cloudy" stroke={weatherColors.Cloudy} strokeWidth={2} />
              <Line type="monotone" dataKey="Windy" stroke={weatherColors.Windy} strokeWidth={2} />
              <Line type="monotone" dataKey="Rain" stroke={weatherColors.Rain} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Time of Day vs Weather */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          <h3 className="font-semibold mb-4">Weather Distribution by Time of Day</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={timeWeather}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              <Legend />
              <Bar dataKey="Clear" stackId="a" fill={weatherColors.Clear} />
              <Bar dataKey="Cloudy" stackId="a" fill={weatherColors.Cloudy} />
              <Bar dataKey="Windy" stackId="a" fill={weatherColors.Windy} />
              <Bar dataKey="Rain" stackId="a" fill={weatherColors.Rain} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Key Insights */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300 mb-1">Key Insights</p>
              <ul className="text-sm text-amber-200/80 space-y-1 list-disc list-inside">
                <li>Weather conditions significantly impact mission success rates</li>
                <li>Historical patterns can predict likely weather for mission planning</li>
                <li>Schedule missions during favorable weather windows to improve outcomes</li>
                <li>Monitor weather trends to identify seasonal risks</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}