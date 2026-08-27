import React from 'react';
import { Search, MapPin, Brain, BarChart3, Shield, Bell, ArrowRight, CheckCircle2, Database, Cpu, CloudRain, Layers, Activity, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    step: 1,
    icon: Search,
    title: 'Search Location',
    description: 'Enter the name of any city, town, or district in Northeast India. Our system covers all 8 NER states with granular location data.',
    details: ['Text-based fuzzy search', 'Auto-complete suggestions', 'Administrative hierarchy lookup'],
  },
  {
    step: 2,
    icon: Database,
    title: 'Data Collection',
    description: 'The system gathers multi-source environmental data including terrain models, satellite imagery, rainfall sensors, and historical records.',
    details: ['DEM terrain analysis', 'Satellite-derived vegetation indices', 'Real-time rainfall data', 'Soil moisture sensors'],
  },
  {
    step: 3,
    icon: Cpu,
    title: 'AI Analysis',
    description: 'Machine learning models analyze all collected data simultaneously, weighing multiple risk factors to generate a comprehensive assessment.',
    details: ['Neural network-based risk scoring', 'Multi-factor weighted analysis', 'Confidence interval calculation', 'Pattern matching with historical events'],
  },
  {
    step: 4,
    icon: BarChart3,
    title: 'Risk Scoring',
    description: 'A composite risk score is generated from 6+ environmental and geological factors, each weighted by their contribution to landslide probability.',
    details: ['0-100 risk scale', 'Factor-by-factor breakdown', '7-day risk forecast', 'Trend analysis'],
  },
  {
    step: 5,
    icon: MapPin,
    title: 'Risk Mapping',
    description: 'Interactive risk maps visualize danger zones, affected areas, and population exposure across the region.',
    details: ['Zone-level risk classification', 'Population impact estimation', 'Spatial risk distribution', 'Zone interaction'],
  },
  {
    step: 6,
    icon: Shield,
    title: 'Safety Guidance',
    description: 'Actionable, prioritized recommendations are generated based on the risk level, including evacuation, monitoring, and infrastructure measures.',
    details: ['Priority-ranked actions', 'Time-frame recommendations', 'Emergency contact integration', 'Community-specific guidance'],
  },
];

const techStack = [
  { name: 'Machine Learning', desc: 'Deep learning models trained on NER terrain and landslide datasets', icon: Cpu },
  { name: 'Remote Sensing', desc: 'Satellite imagery analysis for terrain and vegetation monitoring', icon: CloudRain },
  { name: 'GIS Integration', desc: 'Geographic Information Systems for spatial analysis and mapping', icon: Layers },
  { name: 'IoT Sensors', desc: 'Ground-based sensor networks for real-time environmental data', icon: Activity },
];

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            How <span className="text-emerald-400">LandsafeAI</span> Works
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            From location search to actionable safety guidance — here's how our AI-powered system assesses landslide risk in Northeast India.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div
                key={step.step}
                className="relative flex gap-6 sm:gap-8 items-start"
              >
                {/* Step number */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-0.5 h-full bg-emerald-500/15 ml-7 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-400 text-xs font-bold tracking-wider">STEP {step.step}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{step.title}</h2>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">{step.description}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {step.details.map((detail) => (
                      <div key={detail} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-400 text-xs">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 bg-slate-800/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Technology Stack</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech) => (
              <div key={tech.name} className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/30 text-center">
                <tech.icon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold text-sm mb-1">{tech.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Flow */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Data Pipeline</h2>
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {[
                { label: 'Terrain Data', sub: 'DEM, Slope, Aspect' },
                { label: 'Weather', sub: 'Rainfall, Temp, Humidity' },
                { label: 'Sensors', sub: 'Soil, Groundwater, Tilt' },
                { label: 'History', sub: 'Past Events, Frequency' },
              ].map((item, idx) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="text-center p-3 rounded-lg bg-slate-800/60 border border-slate-700/30 w-32">
                    <p className="text-white text-xs font-semibold">{item.label}</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">{item.sub}</p>
                  </div>
                  {idx < 3 && <ArrowRight className="w-5 h-5 text-emerald-400 flex-shrink-0 hidden sm:block" />}
                </div>
              ))}
            </div>
            <div className="flex justify-center my-4">
              <ArrowRight className="w-6 h-6 text-emerald-400 rotate-90 sm:rotate-0" />
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <Brain className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-white font-bold text-lg">AI Risk Model</p>
              <p className="text-slate-400 text-sm">Multi-factor weighted analysis → Risk Score → Safety Recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Try It Yourself</h2>
          <p className="text-slate-400 mb-6">See the full analysis pipeline in action with real NER locations.</p>
          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all"
          >
            Start Analysis
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
