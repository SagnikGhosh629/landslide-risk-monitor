import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Shield, AlertTriangle, Clock, Phone, CheckCircle, ChevronRight, Info, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function SafetyRecommendations() {
  const { selectedLocation, predictionData } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedLocation || !predictionData) navigate('/search');
  }, [selectedLocation, predictionData]);

  if (!selectedLocation || !predictionData) return null;

  const highPriority = predictionData.recommendations.filter((r) => r.priority === 'high');
  const mediumPriority = predictionData.recommendations.filter((r) => r.priority === 'medium');
  const lowPriority = predictionData.recommendations.filter((r) => r.priority === 'low');

  const priorityConfig = {
    high: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', badge: 'bg-red-500/15 text-red-400', label: 'HIGH PRIORITY' },
    medium: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', badge: 'bg-amber-500/15 text-amber-400', label: 'MEDIUM' },
    low: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', badge: 'bg-green-500/15 text-green-400', label: 'LOW' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/prediction')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Safety <span className="text-emerald-400">Recommendations</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {selectedLocation.name}, {selectedLocation.state} — AI-generated safety guidance
          </p>
        </div>

        {/* Critical alert */}
        {highPriority.length > 0 && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-600/15 to-red-600/5 border border-red-500/30 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-red-400 font-bold text-lg mb-1">Critical Alerts Active</h2>
                <p className="text-slate-300 text-sm">
                  {highPriority.length} high-priority actions require immediate attention for {selectedLocation.name}.
                  These measures are essential for community safety.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendation sections */}
        {[
          { items: highPriority, priority: 'high' as const },
          { items: mediumPriority, priority: 'medium' as const },
          { items: lowPriority, priority: 'low' as const },
        ].filter((s) => s.items.length > 0).map((section) => (
          <div key={section.priority} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${priorityConfig[section.priority].badge}`}>
                {priorityConfig[section.priority].label}
              </span>
              <h2 className="text-white font-semibold text-base capitalize">
                {section.priority === 'high' ? 'Urgent Actions' : section.priority === 'medium' ? 'Recommended Actions' : 'Preventive Measures'}
              </h2>
            </div>

            <div className="space-y-3">
              {section.items.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-5 rounded-xl border ${priorityConfig[section.priority].bg}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className={`w-4 h-4 ${priorityConfig[section.priority].color}`} />
                      <h3 className="text-white font-semibold text-sm">{rec.title}</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800/50 text-slate-400 text-[10px] font-medium">
                      {rec.category}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">{rec.description}</p>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-400">Timeframe:</span>
                    <span className={`font-medium ${
                      rec.timeframe.toLowerCase().includes('immediate') ? 'text-red-400' : 'text-slate-300'
                    }`}>
                      {rec.timeframe}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Emergency contacts */}
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-400" />
            Emergency Contacts
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: 'National Emergency', number: '112', desc: 'All emergencies' },
              { name: 'NDRF Helpline', number: '112', desc: 'National Disaster Response Force' },
              { name: 'SDRF Control Room', number: '1070', desc: 'State Disaster Response Force' },
              { name: 'NDMA Helpline', number: '1078', desc: 'National Disaster Management Authority' },
            ].map((contact) => (
              <div key={contact.name} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/20">
                <p className="text-white font-medium text-sm">{contact.name}</p>
                <p className="text-emerald-400 text-2xl font-bold mt-1">{contact.number}</p>
                <p className="text-slate-500 text-xs mt-0.5">{contact.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-8 justify-center">
          <button
            onClick={() => navigate('/risk-map')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700/50 text-white border border-slate-600/50 rounded-lg font-semibold hover:bg-slate-700 transition-all text-sm"
          >
            View Google Map
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all text-sm"
          >
            Check Another Location
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
