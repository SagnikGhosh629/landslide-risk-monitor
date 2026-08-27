import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, AlertTriangle, Layers, Eye, Info, Navigation, Maximize2, RotateCcw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import GoogleMap from '../component/GoogleMap';

export default function RiskMap() {
  const { selectedLocation, predictionData } = useAppStore();
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedLocation || !predictionData) navigate('/search');
  }, [selectedLocation, predictionData]);

  const handleZoneSelect = useCallback((zoneId: string | null) => {
    setSelectedZone(zoneId);
  }, []);

  if (!selectedLocation || !predictionData) return null;

  const zones = predictionData.riskZones;

  const riskBg = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'moderate': return 'bg-amber-500/20 border-amber-500/50 text-amber-400';
      default: return 'bg-green-500/20 border-green-500/50 text-green-400';
    }
  };

  const riskDot = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-amber-500';
      default: return 'bg-green-500';
    }
  };

  const riskBorderColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'moderate': return 'border-l-amber-500';
      default: return 'border-l-green-500';
    }
  };

  const selectedZoneData = zones.find((z) => z.id === selectedZone);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/prediction')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Risk <span className="text-emerald-400">Map</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {selectedLocation.name}, {selectedLocation.state} — Interactive Google Maps zone analysis
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                {selectedLocation.coordinates.lat.toFixed(4)}°N, {selectedLocation.coordinates.lng.toFixed(4)}°E
              </span>
              <span>•</span>
              <span>{selectedLocation.elevation}m elevation</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Google Map */}
          <div className="lg:col-span-2 bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden" style={{ minHeight: '520px' }}>
            <GoogleMap
              center={selectedLocation.coordinates}
              zoom={11}
              zones={zones}
              selectedZone={selectedZone}
              onZoneSelect={handleZoneSelect}
              locationName={selectedLocation.name}
            />
          </div>

          {/* Zone panel */}
          <div className="space-y-4">
            {/* Legend */}
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/30 p-4">
              <h3 className="text-white text-xs font-bold tracking-wider mb-3 uppercase">Risk Levels</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { level: 'critical', label: 'Critical', color: '#dc2626', count: zones.filter((z) => z.riskLevel === 'critical').length },
                  { level: 'high', label: 'High', color: '#ea580c', count: zones.filter((z) => z.riskLevel === 'high').length },
                  { level: 'moderate', label: 'Moderate', color: '#d97706', count: zones.filter((z) => z.riskLevel === 'moderate').length },
                  { level: 'low', label: 'Low', color: '#16a34a', count: zones.filter((z) => z.riskLevel === 'low').length },
                ].map((item) => (
                  <div key={item.level} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-xs font-medium">{item.label}</p>
                    </div>
                    <span className="text-slate-500 text-xs font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone list */}
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-emerald-400" />
                Risk Zones ({zones.length})
              </h2>

              {zones.length === 0 ? (
                <div className="bg-slate-800/40 rounded-xl border border-slate-700/30 p-6 text-center">
                  <Info className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No specific risk zones identified for this location.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {zones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                      className={`w-full text-left p-3.5 rounded-xl border-l-4 transition-all ${
                        selectedZone === zone.id
                          ? 'bg-slate-700/50 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                          : `bg-slate-800/40 hover:bg-slate-800/60 ${riskBorderColor(zone.riskLevel)}`
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${riskDot(zone.riskLevel)}`} />
                          <h3 className="text-white text-sm font-medium">{zone.name}</h3>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${riskBg(zone.riskLevel)}`}>
                          {zone.riskLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 ml-[18px]">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {zone.radius}km
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {zone.population.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected zone detail */}
            {selectedZoneData && (
              <div className="bg-slate-800/60 rounded-xl border border-emerald-500/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white text-sm font-bold">{selectedZoneData.name}</h3>
                  <button
                    onClick={() => setSelectedZone(null)}
                    className="text-slate-400 hover:text-white text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Risk Level</span>
                    <span className={`font-bold uppercase ${
                      selectedZoneData.riskLevel === 'critical' ? 'text-red-400' :
                      selectedZoneData.riskLevel === 'high' ? 'text-orange-400' :
                      selectedZoneData.riskLevel === 'moderate' ? 'text-amber-400' : 'text-green-400'
                    }`}>{selectedZoneData.riskLevel}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Radius</span>
                    <span className="text-white font-medium">{selectedZoneData.radius}km</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Population at Risk</span>
                    <span className="text-white font-medium">{selectedZoneData.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Coordinates</span>
                    <span className="text-white font-mono text-[10px]">
                      {selectedZoneData.coordinates.lat.toFixed(3)}°, {selectedZoneData.coordinates.lng.toFixed(3)}°
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/30 p-4">
              <h3 className="text-white text-xs font-bold tracking-wider mb-2 uppercase">Summary</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                {zones.length > 0 ? (
                  <>
                    <span className="text-red-400 font-semibold">{zones.filter((z) => z.riskLevel === 'critical').length}</span> critical,{' '}
                    <span className="text-orange-400 font-semibold">{zones.filter((z) => z.riskLevel === 'high').length}</span> high,{' '}
                    <span className="text-amber-400 font-semibold">{zones.filter((z) => z.riskLevel === 'moderate').length}</span> moderate risk zones.{' '}
                    Total affected: <span className="text-white font-semibold">{zones.reduce((sum, z) => sum + z.population, 0).toLocaleString()}</span> people.
                  </>
                ) : (
                  'No significant risk zones currently identified.'
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/recommendations')}
                className="flex-1 px-3 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold text-xs hover:from-emerald-400 hover:to-teal-500 transition-all text-center"
              >
                Safety Guidance
              </button>
              <button
                onClick={() => navigate('/details')}
                className="flex-1 px-3 py-2.5 bg-slate-700/50 text-white border border-slate-600/50 rounded-lg font-semibold text-xs hover:bg-slate-700 transition-all text-center"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
