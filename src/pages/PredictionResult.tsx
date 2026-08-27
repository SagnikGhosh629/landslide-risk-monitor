import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MapPin, Brain, TrendingUp, ArrowRight, AlertTriangle, CloudRain, Droplets, Thermometer, Layers, ChevronRight, Info, Activity, Eye } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { predictionService } from '../services/predictionService';

function RiskGauge({ score, risk }: { score: number; risk: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 200;
    canvas.width = size;
    canvas.height = size;
    const center = size / 2;
    const radius = 75;
    const lineWidth = 12;

    const startAngle = 0.75 * Math.PI;
    const endAngle = 2.25 * Math.PI;
    const totalAngle = endAngle - startAngle;
    const scoreAngle = startAngle + (score / 100) * totalAngle;

    ctx.clearRect(0, 0, size, size);

    // Background arc
    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Gradient arc
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    if (score >= 75) {
      gradient.addColorStop(0, '#dc2626');
      gradient.addColorStop(1, '#ef4444');
    } else if (score >= 60) {
      gradient.addColorStop(0, '#ea580c');
      gradient.addColorStop(1, '#f97316');
    } else if (score >= 35) {
      gradient.addColorStop(0, '#d97706');
      gradient.addColorStop(1, '#eab308');
    } else {
      gradient.addColorStop(0, '#16a34a');
      gradient.addColorStop(1, '#22c55e');
    }

    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, scoreAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Score text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(score.toString(), center, center - 5);

    // Label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.fillText('Risk Score', center, center + 22);
  }, [score]);

  return <canvas ref={canvasRef} className="w-[200px] h-[200px]" />;
}

export default function PredictionResult() {
  const { selectedLocation, predictionData } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedLocation || !predictionData) {
      navigate('/search');
    }
  }, [selectedLocation, predictionData]);

  if (!selectedLocation || !predictionData) return null;

  const riskColor = predictionService.getRiskColor(predictionData.overallRisk);

  const keyMetrics = [
    {
      icon: CloudRain,
      label: 'Rainfall',
      value: `${predictionData.metrics.rainfall.current}mm`,
      sub: `24h: ${predictionData.metrics.rainfall.forecast24h}mm`,
      color: 'text-blue-400',
    },
    {
      icon: Droplets,
      label: 'Soil Moisture',
      value: `${predictionData.metrics.soilMoisture.current}%`,
      sub: `Depth: ${predictionData.metrics.soilMoisture.depth}`,
      color: 'text-cyan-400',
    },
    {
      icon: Thermometer,
      label: 'Temperature',
      value: `${predictionData.metrics.temperature.current}${predictionData.metrics.temperature.unit}`,
      sub: `${predictionData.metrics.temperature.min}–${predictionData.metrics.temperature.max}${predictionData.metrics.temperature.unit}`,
      color: 'text-orange-400',
    },
    {
      icon: Layers,
      label: 'Slope Angle',
      value: `${predictionData.metrics.slope.angle}°`,
      sub: `Aspect: ${predictionData.metrics.slope.aspect}`,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Location header */}
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
          <MapPin className="w-4 h-4" />
          <span>{selectedLocation.name}, {selectedLocation.district}, {selectedLocation.state}</span>
        </div>

        {/* Main result card */}
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Risk Gauge */}
            <div className="flex-shrink-0">
              <RiskGauge score={predictionData.riskScore} risk={predictionData.overallRisk} />
            </div>

            {/* Risk Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                <span
                  className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: riskColor }}
                >
                  {predictionData.overallRisk} Risk
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-sm">
                  <Brain className="w-4 h-4" />
                  {predictionData.confidence.toFixed(1)}% confidence
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Landslide Risk Assessment
              </h1>
              <p className="text-slate-400 text-sm mb-5 max-w-lg leading-relaxed">
                AI analysis of terrain, environmental, and historical data indicates a{' '}
                <span className="font-semibold" style={{ color: riskColor }}>
                  {predictionData.overallRisk}
                </span>{' '}
                landslide risk for {selectedLocation.name}.
              </p>

              {/* Quick actions */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <button
                  onClick={() => navigate('/details')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all text-sm"
                >
                  <Activity className="w-4 h-4" />
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/risk-map')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700/50 text-white border border-slate-600/50 rounded-lg font-semibold hover:bg-slate-700 transition-all text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Google Map
                </button>
                <button
                  onClick={() => navigate('/recommendations')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700/50 text-white border border-slate-600/50 rounded-lg font-semibold hover:bg-slate-700 transition-all text-sm"
                >
                  <Shield className="w-4 h-4" />
                  Recommendations
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {keyMetrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-slate-800/40 rounded-xl border border-slate-700/30 p-5"
            >
              <metric.icon className={`w-6 h-6 ${metric.color} mb-3`} />
              <p className="text-slate-400 text-xs mb-1">{metric.label}</p>
              <p className="text-white text-xl font-bold">{metric.value}</p>
              <p className="text-slate-500 text-xs mt-1">{metric.sub}</p>
            </div>
          ))}
        </div>

        {/* Risk Factors Overview */}
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Risk Factors
          </h2>
          <div className="space-y-4">
            {predictionData.factors.map((factor) => (
              <div key={factor.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300 text-sm font-medium">{factor.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">Weight: {(factor.weight * 100).toFixed(0)}%</span>
                    <span className="text-white text-sm font-semibold">{factor.value}/100</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${factor.value}%`,
                      backgroundColor:
                        factor.value >= 75
                          ? '#dc2626'
                          : factor.value >= 60
                          ? '#ea580c'
                          : factor.value >= 35
                          ? '#d97706'
                          : '#16a34a',
                    }}
                  />
                </div>
                <p className="text-slate-500 text-xs mt-1">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-400" />
            7-Day Risk Forecast
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {predictionData.forecast.map((day, idx) => (
              <div
                key={day.day}
                className={`text-center p-3 rounded-xl ${
                  idx === 0
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : 'bg-slate-800/30'
                }`}
              >
                <p className={`text-xs font-medium mb-2 ${idx === 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {day.day}
                </p>
                <p className="text-white text-lg font-bold">{day.rainfall.toFixed(0)}</p>
                <p className="text-slate-500 text-[10px]">mm rain</p>
                <div
                  className="mt-2 h-1 rounded-full"
                  style={{
                    backgroundColor:
                      day.riskScore >= 75
                        ? '#dc2626'
                        : day.riskScore >= 60
                        ? '#ea580c'
                        : day.riskScore >= 35
                        ? '#d97706'
                        : '#16a34a',
                  }}
                />
                <p className="text-slate-400 text-[10px] mt-1">Risk: {day.riskScore}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-slate-400 text-xs leading-relaxed">
            This assessment uses simulated data for demonstration purposes. Real-world predictions require validated ML models and live sensor data. Always follow official government disaster advisories.
          </p>
        </div>
      </div>
    </div>
  );
}
