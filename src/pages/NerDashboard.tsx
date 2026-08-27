import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Users, Mountain, AlertTriangle, TrendingUp, TrendingDown, Minus,
  Shield, ChevronRight, BarChart3, Layers, Eye, Activity, Search, X, Info,
  Calendar, Building2, Globe,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { predictionService } from '../services/predictionService';
import { nerLocations } from '../data/locations';
import { getPredictionData } from '../data/predictions';
import NerDashboardMap, { DashboardLocation } from '../component/NerDashboardMap';

type SortKey = 'name' | 'riskScore' | 'population' | 'elevation';
type SortDir = 'asc' | 'desc';

export default function NerDashboard() {
  const navigate = useNavigate();
  const { setSelectedLocation, setPredictionData } = useAppStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('riskScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showMap, setShowMap] = useState(true);

  // Build dashboard locations with risk scores
  const dashboardLocations: DashboardLocation[] = useMemo(() => {
    return nerLocations.map((loc) => {
      const pred = getPredictionData(loc.id);
      return {
        id: loc.id,
        name: loc.name,
        state: loc.state,
        district: loc.district,
        description: loc.description,
        coordinates: loc.coordinates,
        elevation: loc.elevation,
        population: loc.population,
        riskScore: pred.riskScore,
        riskLevel: pred.overallRisk,
        historicallyAffected: loc.historicallyAffected,
        lastIncident: loc.lastIncident,
      };
    });
  }, []);

  // Filter and sort
  const filteredLocations = useMemo(() => {
    let result = dashboardLocations;

    // Search filter
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (loc) =>
          loc.name.toLowerCase().includes(q) ||
          loc.state.toLowerCase().includes(q) ||
          loc.district.toLowerCase().includes(q)
      );
    }

    // Risk filter
    if (filterRisk !== 'all') {
      result = result.filter((loc) => loc.riskLevel === filterRisk);
    }

    // Sort
    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'riskScore':
          cmp = a.riskScore - b.riskScore;
          break;
        case 'population':
          cmp = a.population - b.population;
          break;
        case 'elevation':
          cmp = a.elevation - b.elevation;
          break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [dashboardLocations, searchQuery, filterRisk, sortKey, sortDir]);

  // Stats
  const stats = useMemo(() => {
    const total = dashboardLocations.length;
    const critical = dashboardLocations.filter((l) => l.riskLevel === 'critical').length;
    const high = dashboardLocations.filter((l) => l.riskLevel === 'high').length;
    const moderate = dashboardLocations.filter((l) => l.riskLevel === 'moderate').length;
    const low = dashboardLocations.filter((l) => l.riskLevel === 'low').length;
    const totalPop = dashboardLocations.reduce((sum, l) => sum + l.population, 0);
    const avgScore = Math.round(dashboardLocations.reduce((sum, l) => sum + l.riskScore, 0) / total);
    return { total, critical, high, moderate, low, totalPop, avgScore };
  }, [dashboardLocations]);

  const handleLocationClick = useCallback((locId: string | null) => {
    setSelectedId(locId);
  }, []);

  const handleAnalyzeLocation = useCallback(
    (locId: string) => {
      const loc = nerLocations.find((l) => l.id === locId);
      if (loc) {
        setSelectedLocation(loc);
        navigate('/analysis');
      }
    },
    [setSelectedLocation, navigate]
  );

  const riskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'moderate': return 'text-amber-400';
      default: return 'text-green-400';
    }
  };

  const riskBg = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'moderate': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default: return 'bg-green-500/15 text-green-400 border-green-500/30';
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

  const selectedLoc = selectedId ? dashboardLocations.find((l) => l.id === selectedId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-800/30 border-b border-slate-700/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-5 h-5 text-emerald-400" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  NER <span className="text-emerald-400">Dashboard</span>
                </h1>
              </div>
              <p className="text-slate-400 text-sm">
                Comprehensive landslide risk overview across all 8 Northeast India states — {stats.total} locations monitored
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMap(!showMap)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  showMap ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700/50 text-slate-300 border border-slate-600/30'
                }`}
              >
                {showMap ? '🗺️ Map View' : '📋 List View'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Total Locations', value: stats.total, icon: MapPin, color: 'text-emerald-400' },
            { label: 'Critical', value: stats.critical, icon: AlertTriangle, color: 'text-red-400' },
            { label: 'High Risk', value: stats.high, icon: TrendingUp, color: 'text-orange-400' },
            { label: 'Moderate', value: stats.moderate, icon: Minus, color: 'text-amber-400' },
            { label: 'Low Risk', value: stats.low, icon: Shield, color: 'text-green-400' },
            { label: 'Avg Risk Score', value: stats.avgScore, icon: BarChart3, color: 'text-blue-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800/40 rounded-xl border border-slate-700/30 p-4">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-white text-2xl font-bold">{stat.value}</p>
              <p className="text-slate-400 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations, states, districts..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {['all', 'critical', 'high', 'moderate', 'low'].map((level) => (
              <button
                key={level}
                onClick={() => setFilterRisk(level)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors capitalize ${
                  filterRisk === level
                    ? level === 'all'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : riskBg(level)
                    : 'bg-slate-800/40 text-slate-400 border-slate-700/30 hover:border-slate-600/50'
                }`}
              >
                {level === 'all' ? 'All Locations' : level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          {showMap && (
            <div className="lg:col-span-2 bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden" style={{ minHeight: '550px' }}>
              <NerDashboardMap
                locations={filteredLocations}
                selectedLocation={selectedId}
                onLocationSelect={handleLocationClick}
              />
            </div>
          )}

          {/* Location List */}
          <div className={`${showMap ? '' : 'lg:col-span-3'} space-y-3`}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                Locations ({filteredLocations.length})
              </h2>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <span>Sort:</span>
                {(['riskScore', 'name', 'population', 'elevation'] as SortKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (sortKey === key) {
                        setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
                      } else {
                        setSortKey(key);
                        setSortDir('desc');
                      }
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                      sortKey === key ? 'bg-emerald-500/15 text-emerald-400' : 'hover:text-slate-300'
                    }`}
                  >
                    {key === 'riskScore' ? 'Risk' : key === 'name' ? 'Name' : key === 'population' ? 'Pop' : 'Elev'}
                    {sortKey === key && (sortDir === 'desc' ? ' ↓' : ' ↑')}
                  </button>
                ))}
              </div>
            </div>

            <div className={`${showMap ? 'max-h-[calc(100vh-320px)] overflow-y-auto pr-1 space-y-2' : 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'}`}>
              {filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => handleLocationClick(loc.id)}
                  className={`p-4 rounded-xl border-l-4 cursor-pointer transition-all ${
                    selectedId === loc.id
                      ? 'bg-slate-700/50 border-emerald-500 shadow-lg shadow-emerald-500/5'
                      : `bg-slate-800/40 hover:bg-slate-800/60 ${
                          loc.riskLevel === 'critical' ? 'border-l-red-500' :
                          loc.riskLevel === 'high' ? 'border-l-orange-500' :
                          loc.riskLevel === 'moderate' ? 'border-l-amber-500' : 'border-l-green-500'
                        }`
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${riskDot(loc.riskLevel)}`} />
                      <div className="min-w-0">
                        <h3 className="text-white font-semibold text-sm truncate">{loc.name}</h3>
                        <p className="text-slate-400 text-[11px] truncate">{loc.district}, {loc.state}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${riskBg(loc.riskLevel)}`}>
                        {loc.riskLevel}
                      </span>
                      <span className="text-white text-xs font-bold">{loc.riskScore}/100</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Mountain className="w-3 h-3" />
                      {loc.elevation}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {loc.population >= 1000 ? `${(loc.population / 1000).toFixed(1)}K` : loc.population}
                    </span>
                    {loc.historicallyAffected && (
                      <span className="flex items-center gap-1 text-amber-500">
                        <AlertTriangle className="w-3 h-3" />
                        Affected
                      </span>
                    )}
                  </div>

                  {/* Risk bar */}
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${loc.riskScore}%`,
                        backgroundColor:
                          loc.riskScore >= 75 ? '#dc2626' : loc.riskScore >= 60 ? '#ea580c' : loc.riskScore >= 35 ? '#d97706' : '#16a34a',
                      }}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnalyzeLocation(loc.id);
                      }}
                      className="flex-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-[11px] font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center justify-center gap-1"
                    >
                      <Activity className="w-3 h-3" />
                      Analyze
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(loc.id);
                      }}
                      className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-[11px] font-medium hover:bg-slate-700 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Map
                    </button>
                  </div>
                </div>
              ))}

              {filteredLocations.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No locations match your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Location Detail Panel */}
        {selectedLoc && (
          <div className="mt-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${riskDot(selectedLoc.riskLevel)}`} />
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedLoc.name}</h2>
                  <p className="text-slate-400 text-sm">{selectedLoc.district}, {selectedLoc.state}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${riskBg(selectedLoc.riskLevel)}`}>
                  {selectedLoc.riskLevel} Risk
                </span>
              </div>
              <button onClick={() => setSelectedId(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {[
                { icon: BarChart3, label: 'Risk Score', value: `${selectedLoc.riskScore}/100`, color: riskColor(selectedLoc.riskLevel) },
                { icon: Mountain, label: 'Elevation', value: `${selectedLoc.elevation}m`, color: 'text-purple-400' },
                { icon: Users, label: 'Population', value: selectedLoc.population.toLocaleString(), color: 'text-blue-400' },
                { icon: MapPin, label: 'Coordinates', value: `${selectedLoc.coordinates.lat.toFixed(4)}°N, ${selectedLoc.coordinates.lng.toFixed(4)}°E`, color: 'text-emerald-400' },
              ].map((item) => (
                <div key={item.label} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/20">
                  <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
                  <p className="text-slate-400 text-xs mb-0.5">{item.label}</p>
                  <p className="text-white text-sm font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            <p className="text-slate-300 text-sm mb-4 leading-relaxed">{selectedLoc.description || nerLocations.find(l => l.id === selectedLoc.id)?.description}</p>

            {selectedLoc.historicallyAffected && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-amber-200 text-sm">
                  Historically affected by landslides{selectedLoc.lastIncident ? `. Last incident: ${selectedLoc.lastIncident}` : ''}
                </span>
              </div>
            )}

            <button
              onClick={() => handleAnalyzeLocation(selectedLoc.id)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm hover:from-emerald-400 hover:to-teal-500 transition-all"
            >
              <Activity className="w-4 h-4" />
              Run Full AI Analysis for {selectedLoc.name}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
