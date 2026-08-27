import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elementName: string]: any;
    }
  }
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                <Mountain className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">
                Landsafe<span className="text-emerald-400">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered early warning and landslide risk monitoring system for Northeast India.
              Protecting communities through technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/dashboard', label: 'NER Dashboard' },
                { to: '/search', label: 'Check Location' },
                { to: '/about', label: 'About Us' },
                { to: '/how-it-works', label: 'How It Works' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* NER States */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">NER Coverage</h3>
            <ul className="space-y-2.5 text-slate-400 text-sm">
              <li>Assam</li>
              <li>Meghalaya</li>
              <li>Manipur</li>
              <li>Mizoram</li>
              <li>Nagaland</li>
              <li>Arunachal Pradesh</li>
              <li>Tripura</li>
              <li>Sikkim</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Emergency Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>NDRF: <span className="text-white font-medium">112</span></span>
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>SDRF Helpline: <span className="text-white font-medium">1070</span></span>
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>help@landsafe.ai</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>NER Disaster Management Authority, Guwahati, Assam</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} LandsafeAI. Built for Northeast India Landslide Prevention.
          </p>
          <p className="text-slate-600 text-xs">
            Data is for demonstration purposes. Always follow official government advisories.
          </p>
        </div>
      </div>
    </footer>
  );
}
