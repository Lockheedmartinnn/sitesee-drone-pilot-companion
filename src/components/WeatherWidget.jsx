import React from 'react';
import { Wind, CloudRain, Cloud, Sun } from 'lucide-react';

export default function WeatherWidget() {
  // Mock weather data - in production, fetch from weather API
  const weather = {
    condition: 'Clear',
    windSpeed: '12 km/h'
  };

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'Clear':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'Cloudy':
        return <Cloud className="w-4 h-4 text-slate-400" />;
      case 'Rain':
        return <CloudRain className="w-4 h-4 text-blue-400" />;
      default:
        return <Wind className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1.5">
        {getWeatherIcon()}
        <span className="text-slate-300">{weather.condition}</span>
      </div>
      <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1.5">
        <Wind className="w-4 h-4 text-blue-400" />
        <span className="text-slate-300">{weather.windSpeed}</span>
      </div>
    </div>
  );
}