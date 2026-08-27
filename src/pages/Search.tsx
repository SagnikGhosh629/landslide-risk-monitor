import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation as useLocationRoute } from 'react-router-dom';
import { Search, MapPin, ChevronRight, Mountain, Users, Layers, Calendar } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { predictionService } from '../services/predictionService';
import { Location } from '../types';
import { nerLocations } from '../data/locations';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [allLocations, setAllLocations] = useState<Location[]>(nerLocations);
  const { setSelectedLocation, searchQuery, setSearchQuery } = useAppStore();
  const navigate = useNavigate();
  const routeState = useLocationRoute().state as { query?: string } | null;

  useEffect(() => {
    if (routeState?.query) {
      setQuery(routeState.query);
      predictionService.searchLocations(routeState.query).then(setResults);
    }
  }, [routeState]);

  useEffect(() => {
    if (query.length >= 2) {
      predictionService.searchLocations(query).then(setResults);
    } else {
      setResults(allLocations);
    }
  }, [query]);

  useEffect(() => {
    setResults(allLocations);
  }, []);

  const handleSelect = (loc: Location) => {
    setSelectedLocation(loc);
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Search <span className="text-emerald-400">Location</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Enter a city, town, or district in Northeast India to check landslide risk
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="relative flex items-center bg-slate-800/80 border border-slate-600/50 rounded-xl overflow-hidden shadow-2xl">
            <Search className="w-5 h-5 text-slate-400 ml-5 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchQuery(e.target.value);
              }}
              placeholder="Search by city, district, or state..."
              className="w-full px-4 py-4 bg-transparent text-white placeholder-slate-400 focus:outline-none text-base"
              autoFocus
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setResults(allLocations);
                }}
                className="mr-3 text-slate-400 hover:text-white transition-colors text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="grid sm:grid-cols-2 gap-4">
          {results.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className="group text-left p-5 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-emerald-500/40 hover:bg-slate-800/60 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base group-hover:text-emerald-400 transition-colors">
                      {loc.name}
                    </h3>
                    <p className="text-slate-400 text-sm">{loc.district}, {loc.state}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors mt-1" />
              </div>

              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{loc.description}</p>

              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5" />
                  {loc.elevation}m elevation
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {loc.population.toLocaleString()} people
                </span>
                {loc.historicallyAffected && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <Calendar className="w-3.5 h-3.5" />
                    Previously affected
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {results.length === 0 && query.length >= 2 && (
          <div className="text-center py-16">
            <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No locations found matching "{query}"</p>
            <p className="text-slate-500 text-sm mt-2">Try searching for a city in Northeast India</p>
          </div>
        )}
      </div>
    </div>
  );
}
