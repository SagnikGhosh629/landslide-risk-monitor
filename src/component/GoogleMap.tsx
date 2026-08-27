import React, { useEffect, useRef, useState, useCallback } from 'react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDUDTg2qpuIh3Yf0b80T0aViBmP2Dv1x7s';

interface RiskZone {
  id: string;
  name: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  coordinates: { lat: number; lng: number };
  radius: number;
  population: number;
}

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  zones: RiskZone[];
  selectedZone: string | null;
  onZoneSelect: (zoneId: string | null) => void;
  locationName: string;
}

const riskColors: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  moderate: '#d97706',
  low: '#16a34a',
};

const riskFillColors: Record<string, string> = {
  critical: 'rgba(220, 38, 38, 0.18)',
  high: 'rgba(234, 88, 12, 0.16)',
  moderate: 'rgba(217, 119, 6, 0.14)',
  low: 'rgba(22, 163, 74, 0.12)',
};

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export default function GoogleMap({
  center,
  zoom = 11,
  zones,
  selectedZone,
  onZoneSelect,
  locationName,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const circlesRef = useRef<any[]>([]);
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
    script.onerror = () => setError('Failed to load Google Maps. Please check your network connection.');
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
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
    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true,
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
  }, [isLoaded, center, zoom]);

  // Update center when location changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [center, zoom]);

  // Add risk zones (circles + markers)
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    const google = window.google;

    // Clear old circles and markers
    circlesRef.current.forEach((c) => c.setMap(null));
    markersRef.current.forEach((m) => m.setMap(null));
    circlesRef.current = [];
    markersRef.current = [];

    // Add center marker
    const centerMarker = new google.maps.Marker({
      position: center,
      map: mapInstanceRef.current,
      title: locationName,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#10b981',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
      animation: google.maps.Animation.DROP,
    });

    const centerInfo = new google.maps.InfoWindow({
      content: `
        <div style="padding: 4px 8px; font-family: system-ui, sans-serif;">
          <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${locationName}</div>
          <div style="font-size: 11px; color: #64748b;">Selected Location</div>
        </div>
      `,
    });

    centerMarker.addListener('click', () => {
      centerInfo.open({ anchor: centerMarker, map: mapInstanceRef.current });
    });
    markersRef.current.push(centerMarker);

    // Add risk zone circles and markers
    zones.forEach((zone) => {
      // Circle overlay
      const circle = new google.maps.Circle({
        map: mapInstanceRef.current,
        center: zone.coordinates,
        radius: zone.radius * 1000, // Convert km to meters
        fillColor: riskFillColors[zone.riskLevel],
        fillOpacity: 0.35,
        strokeColor: riskColors[zone.riskLevel],
        strokeOpacity: 0.8,
        strokeWeight: selectedZone === zone.id ? 3 : 1.5,
        clickable: true,
        zIndex: selectedZone === zone.id ? 10 : 1,
      });

      circle.addListener('click', () => {
        onZoneSelect(zone.id === selectedZone ? null : zone.id);
      });

      circlesRef.current.push(circle);

      // Marker for the zone
      const marker = new google.maps.Marker({
        position: zone.coordinates,
        map: mapInstanceRef.current,
        title: zone.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: selectedZone === zone.id ? 9 : 7,
          fillColor: riskColors[zone.riskLevel],
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        animation: selectedZone === zone.id ? google.maps.Animation.BOUNCE : undefined,
      });

      const infoContent = `
        <div style="padding: 8px 12px; font-family: system-ui, sans-serif; min-width: 160px;">
          <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 4px;">${zone.name}</div>
          <div style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; color: white; background: ${riskColors[zone.riskLevel]}; margin-bottom: 4px;">
            ${zone.riskLevel.toUpperCase()}
          </div>
          <div style="font-size: 11px; color: #475569; line-height: 1.5;">
            Radius: ${zone.radius}km<br/>
            Population: ${zone.population.toLocaleString()}
          </div>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({ content: infoContent });

      marker.addListener('click', () => {
        infoWindow.open({ anchor: marker, map: mapInstanceRef.current });
        onZoneSelect(zone.id);
      });

      marker.addListener('mouseover', () => {
        if (selectedZone !== zone.id) {
          infoWindow.open({ anchor: marker, map: mapInstanceRef.current });
        }
      });

      marker.addListener('mouseout', () => {
        if (selectedZone !== zone.id) {
          infoWindow.close();
        }
      });

      markersRef.current.push(marker);
    });
  }, [isLoaded, zones, selectedZone, center, locationName, onZoneSelect]);

  // Fit bounds to show all zones
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || zones.length === 0) return;

    const google = window.google;
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(center);

    zones.forEach((zone) => {
      bounds.extend(zone.coordinates);
    });

    mapInstanceRef.current.fitBounds(bounds, 50);
  }, [isLoaded, zones, center]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800/40 rounded-2xl border border-slate-700/50">
        <div className="text-center p-8">
          <p className="text-red-400 text-sm mb-2">{error}</p>
          <p className="text-slate-500 text-xs">Check console for details.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800/40 rounded-2xl border border-slate-700/50">
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
      style={{ minHeight: '450px' }}
    />
  );
}
