import React, { useEffect, useRef, useState } from 'react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDUDTg2qpuIh3Yf0b80T0aViBmP2Dv1x7s';

export interface DashboardLocation {
  id: string;
  name: string;
  state: string;
  district: string;
  description: string;
  coordinates: { lat: number; lng: number };
  elevation: number;
  population: number;
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  historicallyAffected: boolean;
  lastIncident?: string;
}

interface NerDashboardMapProps {
  locations: DashboardLocation[];
  selectedLocation: string | null;
  onLocationSelect: (locationId: string | null) => void;
  zoom?: number;
}

const riskColors: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  moderate: '#d97706',
  low: '#16a34a',
};

const riskIcons: Record<string, string> = {
  critical: '⚠️',
  high: '🔶',
  moderate: '🟡',
  low: '✅',
};

declare global {
  interface Window {
    google: any;
  }
}

export default function NerDashboardMap({
  locations,
  selectedLocation,
  onLocationSelect,
  zoom = 7,
}: NerDashboardMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Google Maps API
  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError('Failed to load Google Maps.');
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript && !window.google?.maps) {
        existingScript.remove();
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const google = window.google;

    // NER center
    const nerCenter = { lat: 25.5, lng: 92.5 };

    const map = new google.maps.Map(mapRef.current, {
      center: nerCenter,
      zoom,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      mapTypeId: 'terrain',
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
        { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
        { featureType: 'land', elementType: 'geometry', stylers: [{ color: '#16213e' }] },
        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283e59' }] },
        { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6f9ba5' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
        { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6675' }] },
        { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e6d70' }] },
      ],
    });

    mapInstanceRef.current = map;
    infoWindowRef.current = new google.maps.InfoWindow();
  }, [isLoaded, zoom]);

  // Add location markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    const google = window.google;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    locations.forEach((loc) => {
      const color = riskColors[loc.riskLevel];
      const isSelected = selectedLocation === loc.id;

      // Create custom marker with label
      const marker = new google.maps.Marker({
        position: loc.coordinates,
        map: mapInstanceRef.current,
        title: `${loc.name}, ${loc.state}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 14 : 10,
          fillColor: color,
          fillOpacity: isSelected ? 1 : 0.85,
          strokeColor: '#ffffff',
          strokeWeight: isSelected ? 3 : 2,
        },
        animation: isSelected ? google.maps.Animation.BOUNCE : undefined,
        zIndex: isSelected ? 100 : 1,
      });

      // Info window content
      const infoContent = `
        <div style="padding: 10px 14px; font-family: system-ui, -apple-system, sans-serif; min-width: 200px; max-width: 260px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${color}; flex-shrink: 0;"></div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${loc.name}</div>
              <div style="font-size: 11px; color: #64748b;">${loc.district}, ${loc.state}</div>
            </div>
          </div>
          <div style="display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 10px; font-weight: 700; color: white; background: ${color}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
            ${loc.riskLevel} Risk — Score ${loc.riskScore}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <div>📍 ${loc.elevation}m elev.</div>
            <div>👥 ${(loc.population / 1000).toFixed(0)}K pop.</div>
            <div>🏔️ ${loc.coordinates.lat.toFixed(2)}°N</div>
            <div>🌐 ${loc.coordinates.lng.toFixed(2)}°E</div>
          </div>
          ${loc.historicallyAffected ? `<div style="margin-top: 6px; font-size: 10px; color: #dc2626; font-weight: 600;">⚠ Previously affected${loc.lastIncident ? ` (${loc.lastIncident})` : ''}</div>` : ''}
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({ content: infoContent });

      marker.addListener('click', () => {
        infoWindow.open({ anchor: marker, map: mapInstanceRef.current });
        onLocationSelect(loc.id);
      });

      marker.addListener('mouseover', () => {
        if (selectedLocation !== loc.id) {
          infoWindow.open({ anchor: marker, map: mapInstanceRef.current });
        }
      });

      marker.addListener('mouseout', () => {
        if (selectedLocation !== loc.id) {
          infoWindow.close();
        }
      });

      markersRef.current.push(marker);
    });
  }, [isLoaded, locations, selectedLocation, onLocationSelect]);

  // Zoom to selected location
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;

    const loc = locations.find((l) => l.id === selectedLocation);
    if (loc) {
      mapInstanceRef.current.panTo(loc.coordinates);
      mapInstanceRef.current.setZoom(11);
    }
  }, [selectedLocation, locations]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800/40 rounded-2xl border border-slate-700/50">
        <div className="text-center p-8">
          <p className="text-red-400 text-sm mb-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800/40 rounded-2xl border border-slate-700/50" style={{ minHeight: '500px' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-2xl overflow-hidden"
      style={{ minHeight: '500px' }}
    />
  );
}
