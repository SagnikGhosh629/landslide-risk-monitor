import React from 'react';
import { Mountain, Users, Globe, Brain, Shield, Target, Heart, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const team = [
  { name: 'AI Research', role: 'Machine Learning & Risk Models', description: 'Developing and training landslide prediction algorithms using terrain and environmental data.' },
  { name: 'Remote Sensing', role: 'Satellite & GIS Analysis', description: 'Processing satellite imagery and GIS data for terrain analysis and change detection.' },
  { name: 'Field Operations', role: 'Ground Truth & Validation', description: 'Conducting ground-level surveys and sensor deployments for model validation.' },
  { name: 'Community Outreach', role: 'Awareness & Training', description: 'Training local communities on disaster preparedness and early warning response.' },
];

const milestones = [
  { year: '2024', event: 'NER Coverage Expansion', detail: 'Extended monitoring to all 8 NER states' },
  { year: '2023', event: 'AI Model v2.0', detail: 'Deployed improved ML model with 91% accuracy' },
  { year: '2022', event: 'Pilot Launch', detail: 'Initial pilot in Meghalaya with 5 monitoring stations' },
  { year: '2021', event: 'Project Inception', detail: 'Research initiative began with IIT Guwahati partnership' },
];

export default function About() {
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Our Mission
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            About <span className="text-emerald-400">LandsafeAI</span>
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Building AI-powered early warning systems to protect communities in Northeast India from landslide disasters. Our mission is to combine cutting-edge technology with community resilience to save lives and livelihoods.
          </p>
        </div>
      </section>

      {/* Mission pillars */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Our Mission', desc: 'To provide accurate, timely landslide risk assessments for all communities in Northeast India using AI and environmental monitoring.' },
              { icon: Globe, title: 'Our Vision', desc: 'A Northeast India where no community is caught unprepared by landslide disasters, through technology-driven early warning systems.' },
              { icon: Shield, title: 'Our Promise', desc: 'Transparent, science-based risk assessments that empower communities and authorities to make informed safety decisions.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                <item.icon className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About content */}
      <section className="py-16 bg-slate-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-white mb-6">The Challenge</h2>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              Northeast India is one of the most landslide-prone regions in the world. The combination of steep terrain, heavy monsoon rainfall, seismic activity, and increasing human development creates a persistent and growing threat to millions of people.
            </p>
            <p>
              Traditional monitoring methods often fail to provide timely warnings, especially in remote and underserved communities. LandsafeAI aims to bridge this gap by leveraging artificial intelligence, satellite imagery, and ground sensor networks to provide accurate, real-time landslide risk assessments.
            </p>
            <p>
              Our system analyzes multiple risk factors simultaneously — including terrain geometry, soil moisture, rainfall patterns, vegetation cover, groundwater levels, and historical landslide data — to generate comprehensive risk scores and actionable safety recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-white mb-8">Our Journey</h2>
          <div className="space-y-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 text-xs font-bold">{m.year.slice(-2)}</span>
                  </div>
                  {idx < milestones.length - 1 && <div className="w-px h-full bg-emerald-500/20 min-h-[40px]" />}
                </div>
                <div className="pb-6">
                  <p className="text-emerald-400 text-xs font-bold mb-0.5">{m.year}</p>
                  <h3 className="text-white font-semibold">{m.event}</h3>
                  <p className="text-slate-400 text-sm">{m.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-slate-800/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Teams</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t) => (
              <div key={t.name} className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/30 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-0.5">{t.name}</h3>
                <p className="text-emerald-400 text-xs mb-2">{t.role}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Check Your Area?</h2>
          <p className="text-slate-400 mb-6">Get an instant AI-powered landslide risk assessment for any location in Northeast India.</p>
          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all"
          >
            Check Risk Now
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
