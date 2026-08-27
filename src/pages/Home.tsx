import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mountain, AlertTriangle, Shield, Brain, TrendingUp, ChevronRight, MapPin, Activity, Eye, Zap, ArrowRight, Globe } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { predictionService } from '../services/predictionService';
import { Location } from '../types';

const stats = [
  { label: 'NER States Covered', value: '8', icon: MapPin },
  { label: 'Locations Monitored', value: '12+', icon: Eye },
  { label: 'Risk Factors Analyzed', value: '6+', icon: Activity },
  { label: 'Response Time', value: '<5s', icon: Zap },
];

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Machine learning models analyze terrain, rainfall, soil moisture, and seismic data to predict landslide risk with high accuracy.',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Monitoring',
    description: 'Continuous monitoring of environmental conditions with live updates on risk scores and weather patterns.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Shield,
    title: 'Early Warning System',
    description: 'Automated alerts and safety recommendations to protect communities before disaster strikes.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: AlertTriangle,
    title: 'Risk Assessment',
    description: 'Comprehensive risk maps showing danger zones, historical data, and predictive forecasts for informed decisions.',
    color: 'from-blue-500 to-cyan-500',
  },
];

const nerStates = [
  { name: 'Assam', locations: ['Guwahati', 'Dibrugarh'], risk: 'moderate' },
  { name: 'Meghalaya', locations: ['Shillong', 'Cherrapunji', 'Dawki'], risk: 'critical' },
  { name: 'Mizoram', locations: ['Aizawl'], risk: 'critical' },
  { name: 'Sikkim', locations: ['Gangtok'], risk: 'high' },
  { name: 'Arunachal Pradesh', locations: ['Itanagar', 'Tawang'], risk: 'high' },
  { name: 'Manipur', locations: ['Imphal'], risk: 'moderate' },
  { name: 'Nagaland', locations: ['Kohima'], risk: 'moderate' },
  { name: 'Tripura', locations: ['Agartala'], risk: 'low' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { setSelectedLocation } = useAppStore();

  useEffect(() => {
    if (searchQuery.length >= 2) {
      predictionService.searchLocations(searchQuery).then((results) => {
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSelectLocation = (loc: Location) => {
    setSelectedLocation(loc);
    setShowSuggestions(false);
    navigate('/analysis');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectLocation(suggestions[0]);
    } else {
      navigate('/search', { state: { query: searchQuery } });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-40 w-64 h-64 bg-cyan-500/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
              <AlertTriangle className="w-4 h-4" />
              AI-Based Landslide Risk Monitoring for Northeast India
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Protecting{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Northeast India
              </span>
              <br />
              from Landslides
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              AI-powered early warning system that monitors terrain, rainfall, and environmental conditions to predict and prevent landslide disasters across the NER region.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden shadow-2xl">
                  <MapPin className="w-5 h-5 text-slate-400 ml-5 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Search for a location in Northeast India..."
                    className="w-full px-4 py-4 bg-transparent text-white placeholder-slate-400 focus:outline-none text-base"
                  />
                  <button
                    type="submit"
                    className="m-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>

                {/* Suggestions dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600/50 rounded-xl overflow-hidden shadow-2xl z-50">
                    {suggestions.map((loc) => (
                      <button
                        key={loc.id}
                        onMouseDown={() => handleSelectLocation(loc)}
                        className="w-full px-5 py-3.5 text-left hover:bg-slate-700/50 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="text-white font-medium text-sm">{loc.name}</p>
                            <p className="text-slate-400 text-xs">{loc.district}, {loc.state}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400">
              <span>Popular:</span>
              {['Shillong', 'Aizawl', 'Gangtok', 'Cherrapunji'].map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    setSearchQuery(name);
                    predictionService.searchLocations(name).then((results) => {
                      if (results.length > 0) handleSelectLocation(results[0]);
                    });
                  }}
                  className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-16 sm:h-20">
            <path
              fill="#0f172a"
              d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,58.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 justify-center py-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white text-xl font-bold">{stat.value}</p>
                  <p className="text-slate-400 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Advanced Landslide <span className="text-emerald-400">Monitoring</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Combining AI, satellite data, and ground sensors to provide accurate landslide risk assessment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NER Coverage */}
      <section className="bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Northeast India <span className="text-emerald-400">Coverage</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Monitoring landslide-prone areas across all 8 NER states with AI-driven risk assessment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {nerStates.map((state) => (
              <div
                key={state.name}
                className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">{state.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      state.risk === 'critical'
                        ? 'bg-red-500/15 text-red-400'
                        : state.risk === 'high'
                        ? 'bg-orange-500/15 text-orange-400'
                        : state.risk === 'moderate'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-green-500/15 text-green-400'
                    }`}
                  >
                    {state.risk}
                  </span>
                </div>
                <div className="space-y-1">
                  {state.locations.map((loc) => (
                    <p key={loc} className="text-slate-400 text-sm flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                      {loc}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/20">
            <Shield className="w-14 h-14 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start Monitoring Now
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
              Check the landslide risk for any location in Northeast India. Get instant AI-powered analysis and safety recommendations.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('/search')}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-emerald-400 hover:to-teal-500 transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40"
              >
                Check Location Risk
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-800/80 text-white border border-slate-600/50 rounded-xl font-semibold text-lg hover:bg-slate-700 transition-all"
              >
                <Globe className="w-5 h-5" />
                NER Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
