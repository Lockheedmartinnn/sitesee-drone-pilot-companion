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
      combined.push({
        id: im.id,
        mission_date: im.capture_timestamp || im.created_date,
        weather_condition: null,
        time_of_day: null,
        outcome: im.outcome === 'SUCCESS' ? 'Pass' : 'Fail',
        created_date: im.created_date
      });
    });
    return combined;
  }, [missionLogs, importedMissions]);

  const missions = useMemo(() => {
    if (!user) return [];
    return filterMissionsByAccess(allMissions, permissions, user.email, user);
  }, [allMissions, permissions, user]);

  if (!isLoading && permissions.level === 'pilot') {
    window.location.href = '/';
    return null;
  }

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

  // Weather prediction for future missions
  const weatherPrediction = useMemo(() => {
    const now = new Date();
    const currentMonth = format(now, 'MMM');
    const currentHour = getHours(now);
    
    let timeOfDay = 'Morning';
    if (currentHour >= 10 && currentHour < 14) timeOfDay = 'Midday';
    else if (currentHour >= 14) timeOfDay = 'Afternoon';

    // Find historical pattern for this month and time
    const relevantMissions = missions.filter(m => {
      if (!m.mission_date || !m.weather_condition) return false;
      const missionMonth = format(parseISO(m.mission_date), 'MMM');
      return missionMonth === currentMonth && m.time_of_day === timeOfDay;
    });

    const weatherCounts = { Clear: 0, Cloudy: 0, Windy: 0, Rain: 0 };
    relevantMissions.forEach(m => {
      weatherCounts[m.weather_condition]++;
    });

    const total = relevantMissions.length;
    const predicted = Object.entries(weatherCounts)
      .map(([w, count]) => ({ weather: w, probability: total ? ((count / total) * 100).toFixed(1) : 0 }))
      .sort((a, b) => b.probability - a.probability);

    return { timeOfDay, month: currentMonth, predicted, sampleSize: total };
  }, [missions]);

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

        {/* Weather Prediction Card */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="font-semibold text-lg">Weather Prediction for Today</h3>
              <p className="text-xs text-slate-400">Based on {weatherPrediction.sampleSize} historical missions in {weatherPrediction.month} ({weatherPrediction.timeOfDay})</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weatherPrediction.predicted.map((p, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  {weatherIcons[p.weather]}
                  <span className="font-semibold">{p.weather}</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">{p.probability}%</p>
                <p className="text-xs text-slate-500">probability</p>
              </div>
            ))}
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