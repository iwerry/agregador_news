import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WeatherCity } from '../types.ts';
import { Locate, Navigation, Radio } from 'lucide-react';

interface OpenStreetMapWidgetProps {
  cities: WeatherCity[];
  selectedCity: WeatherCity | null;
  onSelectCity: (city: WeatherCity) => void;
  onMapClickPoint?: (lat: number, lon: number) => void;
}

export const OpenStreetMapWidget: React.FC<OpenStreetMapWidgetProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  onMapClickPoint
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const clickMarkerRef = useRef<L.Marker | null>(null);

  // Helper to color-code by temperature
  const getTempColor = (temp: number) => {
    if (temp <= 0) return { bg: 'bg-cyan-500/90', text: 'text-cyan-200', border: 'border-cyan-400', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.8)]' };
    if (temp < 18) return { bg: 'bg-teal-500/90', text: 'text-teal-200', border: 'border-teal-400', glow: 'shadow-[0_0_15px_rgba(20,184,166,0.8)]' };
    if (temp < 25) return { bg: 'bg-emerald-500/90', text: 'text-emerald-200', border: 'border-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.8)]' };
    if (temp < 30) return { bg: 'bg-amber-500/90', text: 'text-amber-100', border: 'border-amber-400', glow: 'shadow-[0_0_18px_rgba(245,158,11,0.9)]' };
    return { bg: 'bg-red-500/90', text: 'text-white', border: 'border-red-400', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.9)]' };
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Dark-styled map centered globally
    const map = L.map(mapContainerRef.current, {
      center: selectedCity ? [selectedCity.lat, selectedCity.lon] : [-15.79, -47.88],
      zoom: 3,
      minZoom: 2,
      maxZoom: 14,
      zoomControl: false
    });

    // Dark CartoDB Matter tile layer with OpenStreetMap data
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a> | <a href="https://open-meteo.com" target="_blank" rel="noreferrer">Open-Meteo</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Zoom control in bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Click anywhere on OpenStreetMap to sample live weather at that lat/lon
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (onMapClickPoint) {
        onMapClickPoint(lat, lng);
      }

      // Show radar probe marker at clicked point
      if (clickMarkerRef.current) {
        clickMarkerRef.current.setLatLng([lat, lng]);
      } else {
        const clickIcon = L.divIcon({
          className: 'custom-click-icon',
          html: `
            <div class="relative flex items-center justify-center">
              <span class="absolute w-8 h-8 rounded-full bg-cyan-400/40 animate-ping"></span>
              <span class="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_12px_#00e5ff]"></span>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        clickMarkerRef.current = L.marker([lat, lng], { icon: clickIcon }).addTo(map);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update city markers when cities change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old city markers
    Object.values(markersRef.current).forEach((m: L.Marker) => m.remove());
    markersRef.current = {};

    cities.forEach(c => {
      const colors = getTempColor(c.temperature);
      const isSelected = selectedCity?.city === c.city;

      const markerHtml = `
        <div class="group cursor-pointer flex flex-col items-center">
          <div class="px-2 py-1 rounded-full ${colors.bg} ${colors.border} border ${colors.glow} ${isSelected ? 'ring-2 ring-white scale-110 z-50' : 'hover:scale-105'} transition-all flex items-center gap-1 text-[11px] font-mono font-bold text-white whitespace-nowrap shadow-lg">
            <span>${c.temperature > 0 ? '+' : ''}${c.temperature}°C</span>
          </div>
          <div class="mt-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/20 text-[10px] text-zinc-200 font-sans font-semibold whitespace-nowrap shadow-md">
            ${c.city}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: `weather-map-marker-${c.city.replace(/[^a-zA-Z0-9]/g, '_')}`,
        html: markerHtml,
        iconSize: [60, 42],
        iconAnchor: [30, 21]
      });

      const marker = L.marker([c.lat, c.lon], { icon: customIcon }).addTo(map);
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectCity(c);
      });

      markersRef.current[c.city] = marker;
    });
  }, [cities, selectedCity]);

  // Smooth pan to selected city
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedCity) return;
    map.flyTo([selectedCity.lat, selectedCity.lon], Math.max(map.getZoom(), 4), {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }, [selectedCity]);

  return (
    <div className="relative w-full h-[380px] sm:h-[420px] rounded-xl overflow-hidden border border-neutral-800 bg-[#0c0c10] shadow-inner">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Map HUD Bar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="pointer-events-auto px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-xs text-white font-mono flex items-center gap-2 shadow-lg">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold">OPENSTREETMAP RADAR GLOBAL</span>
          <span className="text-zinc-500 hidden sm:inline">•</span>
          <span className="text-zinc-400 text-[10px] hidden sm:inline">Clique em qualquer ponto da Terra para telemetria</span>
        </div>
      </div>

      {/* Temperature Palette Legend (bottom-left) */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 pointer-events-auto">
        <span className="text-zinc-500 font-bold mr-1">ESCALA:</span>
        <span className="px-1.5 py-0.2 rounded bg-cyan-500 text-white font-bold">&lt; 0°C Polar</span>
        <span className="px-1.5 py-0.2 rounded bg-teal-500 text-white font-bold">1-17°C Frio</span>
        <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-white font-bold">18-24°C Ameno</span>
        <span className="px-1.5 py-0.2 rounded bg-amber-500 text-black font-bold">25-29°C Calor</span>
        <span className="px-1.5 py-0.2 rounded bg-red-500 text-white font-bold">&gt; 30°C Extremo</span>
      </div>

      {/* Quick Center Shortcuts */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => {
            const map = mapInstanceRef.current;
            if (map) map.setView([-15.79, -47.88], 4);
          }}
          title="Focar na América do Sul / Brasília"
          className="px-2 py-1 rounded-lg bg-black/80 hover:bg-black border border-white/15 text-[10px] font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
        >
          <Locate className="w-3 h-3 text-emerald-400" />
          <span>América</span>
        </button>

        <button
          onClick={() => {
            const map = mapInstanceRef.current;
            if (map) map.setView([-1.29, 36.82], 4);
          }}
          title="Focar na África / Nairobi (Calor 27°C)"
          className="px-2 py-1 rounded-lg bg-black/80 hover:bg-black border border-white/15 text-[10px] font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
        >
          <Navigation className="w-3 h-3 text-amber-400" />
          <span>África</span>
        </button>

        <button
          onClick={() => {
            const map = mapInstanceRef.current;
            if (map) map.setView([-77.85, 166.67], 3);
          }}
          title="Focar na Antártica / McMurdo (Frio Polar -24°C)"
          className="px-2 py-1 rounded-lg bg-black/80 hover:bg-black border border-white/15 text-[10px] font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
        >
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>Antártica</span>
        </button>
      </div>
    </div>
  );
};
