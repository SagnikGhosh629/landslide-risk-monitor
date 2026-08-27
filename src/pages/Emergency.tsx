import React from 'react';
import { Phone, AlertTriangle, MapPin, Clock, Users, Shield, Radio, ChevronRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const emergencyContacts = [
  { name: 'National Emergency Number', number: '112', available: '24/7', desc: 'All emergencies — Police, Fire, Ambulance' },
  { name: 'NDRF (National Disaster Response)', number: '112', available: '24/7', desc: 'National Disaster Response Force' },
  { name: 'SDRF Control Room', number: '1070', available: '24/7', desc: 'State Disaster Response Force' },
  { name: 'NDMA Helpline', number: '1078', available: '24/7', desc: 'National Disaster Management Authority' },
  { name: 'Nagaland SDRF', number: '1070', available: '24/7', desc: 'Nagaland State Disaster Response' },
  { name: 'Meghalaya SDMA', number: '1070', available: '24/7', desc: 'Meghalaya State Disaster Management' },
  { name: 'Assam SDRF', number: '1070', available: '24/7', desc: 'Assam State Disaster Response Force' },
  { name: 'Mizoram SDRF', number: '1070', available: '24/7', desc: 'Mizoram State Disaster Response' },
];

const beforeTips = [
  { title: 'Know Your Risk Zone', description: 'Check if your home or workplace is in a landslide-prone area using LandsafeAI.' },
  { title: 'Prepare an Emergency Kit', description: 'Keep a go-bag with water, food, medications, flashlight, whistle, important documents, and cash.' },
  { title: 'Identify Safe Routes', description: 'Know at least two evacuation routes from your home and workplace. Practice them with family.' },
  { title: 'Secure Your Home', description: 'Anchor heavy furniture, reinforce retaining walls, and ensure proper drainage around your property.' },
  { title: 'Stay Informed', description: 'Monitor weather forecasts and landslide warnings. Follow local authorities on social media.' },
  { title: 'Community Network', description: 'Join your local disaster response team. Know your neighbors, especially elderly and disabled residents.' },
];

const duringTips = [
  { title: 'Act Immediately', description: 'If you see signs of landslide (cracks, bulging ground, unusual sounds), evacuate immediately.' },
  { title: 'Move to High Ground', description: 'Move perpendicular to the landslide path, not downhill. Get to the highest safe ground nearby.' },
  { title: 'Avoid Rivers and Valleys', description: 'Landslides often follow waterways. Stay away from riverbanks and valley bottoms during events.' },
  { title: 'Call for Help', description: 'Call 112 immediately. If you cannot call, use a whistle or signal for help.' },
  { title: 'Stay Away from Steep Slopes', description: 'Do not return to the affected area until authorities confirm it is safe.' },
];

const afterTips = [
  { title: 'Check for Injuries', description: 'Provide first aid to injured persons. Call for medical help for serious injuries.' },
  { title: 'Report Damage', description: 'Report any damage or hazards to local authorities. Help others if it is safe to do so.' },
  { title: 'Check Utilities', description: 'Inspect gas, water, and electrical lines for damage before using them.' },
  { title: 'Avoid Affected Areas', description: 'Do not enter landslide zones. Hidden dangers like weakened ground may persist.' },
  { title: 'Stay Updated', description: 'Continue monitoring official channels for updates on secondary hazards and recovery information.' },
];

export default function Emergency() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Emergency Banner */}
      <section className="bg-gradient-to-r from-red-700 to-red-900 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <AlertTriangle className="w-8 h-8 text-white mx-auto mb-3 animate-pulse" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Emergency Information</h1>
          <p className="text-red-200 text-sm sm:text-base">
            If you are in immediate danger, call <strong className="text-white text-lg">112</strong> right now.
          </p>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-400" />
            Emergency Contacts
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyContacts.map((contact) => (
              <div key={contact.name} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
                <p className="text-white font-semibold text-sm mb-1">{contact.name}</p>
                <p className="text-red-400 text-2xl font-bold mb-1">{contact.number}</p>
                <p className="text-slate-400 text-xs mb-1">{contact.desc}</p>
                <div className="flex items-center gap-1 text-green-400 text-xs">
                  <Clock className="w-3 h-3" />
                  {contact.available}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Signs */}
      <section className="py-12 bg-slate-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Warning Signs of Landslide
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Cracks in ground, walls, or roads',
              'Bulging or displaced ground',
              'Trees or fence posts tilting',
              'Sudden changes in water flow',
              'Unusual sounds like cracking or rumbling',
              'Water channels suddenly blocked',
              'Ground settling or sinking',
              'New springs or seepage on slopes',
            ].map((sign) => (
              <div key={sign} className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
                <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{sign}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before, During, After */}
      {[
        { title: 'Before a Landslide', subtitle: 'Preparedness', tips: beforeTips, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/5' },
        { title: 'During a Landslide', subtitle: 'Immediate Actions', tips: duringTips, color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/5' },
        { title: 'After a Landslide', subtitle: 'Recovery', tips: afterTips, color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/5' },
      ].map((section) => (
        <section key={section.title} className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className={`text-xl font-bold text-white mb-6 flex items-center gap-2`}>
              <Shield className={`w-5 h-5 ${section.color}`} />
              {section.title}
              <span className={`text-sm font-normal ${section.color}`}>— {section.subtitle}</span>
            </h2>
            <div className="space-y-3">
              {section.tips.map((tip) => (
                <div key={tip.title} className={`p-4 rounded-xl ${section.bg} border ${section.border}`}>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${section.color} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-1">{tip.title}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Quick Access */}
      <section className="py-12 bg-slate-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Check Your Location Risk</h2>
          <p className="text-slate-400 text-sm mb-6">Know your risk before disaster strikes. Get an instant AI assessment.</p>
          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all"
          >
            <MapPin className="w-5 h-5" />
            Check Location Now
          </button>
        </div>
      </section>
    </div>
  );
}
