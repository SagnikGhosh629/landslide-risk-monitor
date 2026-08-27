import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CloudRain, Droplets, Thermometer, Wind, Layers, Trees, Gauge, TrendingUp, TrendingDown, Minus, AlertTriangle, Calendar, Users, BarChart3 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { predictionService } from '../services/predictionService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-white text-xs font-medium">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export default function PredictionDetails() {
  const { selectedLocation, predictionData } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedLocation || !predictionData) navigate('/search');
  }, [selectedLocation, predictionData]);

  if (!selectedLocation || !predictionData) return null;

  const radarData = predictionData.factors.map((f) => ({
    factor: f.name,
    value: f.value,
    fullMark: 100,
  }));

  const rainfallData = predictionData.forecast.map((d) => ({
    day: d.day,
    rainfall: d.rainfall,
    forecast72h: d.rainfall * 1.5,
  }));

  const trendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="w-3.5 h-3.5 text-red-400" />;
    if (trend === 'decreasing') return <TrendingDown className="w-3.5 h-3.5 text-green-400" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/prediction')}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Overview
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Detailed <span className="text-emerald-400">Analysis</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {selectedLocation.name}, {selectedLocation.state}
            </p>
          </div>
        </div>

        {/* Radar Chart + Metrics */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Risk Factor Radar */}
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Risk Factor Analysis
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="factor" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="Risk" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Environmental Metrics */}
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-400" />
              Environmental Metrics
            </h2>
            <div className="space-y-4">
              {[
                { icon: CloudRain, label: 'Rainfall (Current)', value: `${predictionData.metrics.rainfall.current}mm`, sub: `24h: ${predictionData.metrics.rainfall.forecast24h}mm • 72h: ${predictionData.metrics.rainfall.forecast72h}mm`, color: 'text-blue-400' },
                { icon: Droplets, label: 'Soil Moisture', value: `${predictionData.metrics.soilMoisture.current}%`, sub: `At depth: ${predictionData.metrics.soilMoisture.depth}`, color: 'text-cyan-400' },
                { icon: Thermometer, label: 'Temperature', value: `${predictionData.metrics.temperature.current}${predictionData.metrics.temperature.unit}`, sub: `Range: ${predictionData.metrics.temperature.min}–${predictionData.metrics.temperature.max}${predictionData.metrics.temperature.unit}`, color: 'text-orange-400' },
                { icon: Wind, label: 'Humidity', value: `${predictionData.metrics.humidity.current}${predictionData.metrics.humidity.unit}`, sub: 'Relative humidity', color: 'text-teal-400' },
                { icon: Layers, label: 'Slope', value: `${predictionData.metrics.slope.angle}°`, sub: `Aspect: ${predictionData.metrics.slope.aspect}`, color: 'text-purple-400' },
                { icon: Trees, label: 'Vegetation (NDVI)', value: predictionData.metrics.vegetation.ndvi.toFixed(2), sub: `Coverage: ${predictionData.metrics.vegetation.coverage}`, color: 'text-green-400' },
                { icon: Gauge, label: 'Groundwater', value: `${predictionData.metrics.groundwater.level}m`, sub: `Trend: ${predictionData.metrics.groundwater.trend}`, color: 'text-indigo-400' },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
                  <m.icon className={`w-5 h-5 ${m.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-400 text-xs">{m.label}</p>
                    <p className="text-white text-sm font-semibold">{m.value}</p>
                    <p className="text-slate-500 text-[11px] truncate">{m.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rainfall Chart */}
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-400" />
            Rainfall Forecast (7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rainfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} unit="mm" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rainfall" name="Forecast" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Historical Events */}
        {predictionData.historicalData.length > 0 && (
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              Historical Landslide Events
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700/50">
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Severity</th>
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-right py-3 px-4 font-medium">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {predictionData.historicalData.map((event, idx) => (
                    <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-4 text-white whitespace-nowrap">{event.date}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            event.magnitude === 'Catastrophic'
                              ? 'bg-red-500/15 text-red-400'
                              : event.magnitude === 'Major'
                              ? 'bg-orange-500/15 text-orange-400'
                              : event.magnitude === 'Moderate'
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-slate-500/15 text-slate-400'
                          }`}
                        >
                          {event.magnitude}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs">{event.description}</td>
                      <td className="py-3 px-4 text-right">
                        {event.displaced && (
                          <span className="text-slate-400 text-xs">
                            <Users className="w-3 h-3 inline mr-1" />
                            {event.displaced} displaced
                          </span>
                        )}
                        {event.casualties && (
                          <span className="text-red-400 text-xs ml-2">
                            {event.casualties} casualties
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Risk Factors Detail */}
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Detailed Risk Factors
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {predictionData.factors.map((factor) => (
              <div key={factor.name} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium text-sm">{factor.name}</h3>
                  <div className="flex items-center gap-2">
                    {trendIcon(factor.trend)}
                    <span className="text-white font-bold text-sm">{factor.value}/100</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${factor.value}%`,
                      backgroundColor:
                        factor.value >= 75 ? '#dc2626' : factor.value >= 60 ? '#ea580c' : factor.value >= 35 ? '#d97706' : '#16a34a',
                    }}
                  />
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{factor.description}</p>
                <p className="text-slate-500 text-[10px] mt-1">Weight: {(factor.weight * 100).toFixed(0)}% • Trend: {factor.trend}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
