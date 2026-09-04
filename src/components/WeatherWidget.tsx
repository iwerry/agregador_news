import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  Snowflake,
  Wind,
  Droplets,
  MapPin,
  X,
  Globe,
  Radio,
  Compass,
  Gauge,
  Layers,
  Search,
  Flame,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  CloudLightning,
  Eye
} from 'lucide-react';
import { WeatherCity } from '../types.ts';
import { TranslationDict } from '../i18n/translations.ts';
import { OpenStreetMapWidget } from './OpenStreetMapWidget.tsx';
import { AtmosphericScene } from './AtmosphericScene.tsx';

interface WeatherWidgetProps {
  t: TranslationDict;
  isOpen: boolean;
  onClose: () => void;
}

type ViewTab = 'broadcast' | 'map' | 'apis';

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ t, isOpen, onClose }) => {
  const [cities, setCities] = useState<WeatherCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<WeatherCity | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>('broadcast');
  const [models, setModels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [samplingPoint, setSamplingPoint] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/weather')
        .then(r => r.json())
        .then(data => {
          if (data.cities && data.cities.length > 0) {
            setCities(data.cities);
            setSelectedCity(data.cities[0]); // Default to Brasilia or Nairobi
            if (data.models) setModels(data.models);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load weather:', err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  // City Search Handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        setSearching(true);
        fetch(`/api/weather/search?q=${encodeURIComponent(searchQuery.trim())}`)
          .then(r => r.json())
          .then(data => {
            setSearchResults(data.results || []);
            setSearching(false);
          })
          .catch(() => setSearching(false));
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click on map coordinates
  const handleMapClickPoint = async (lat: number, lon: number) => {
    setSamplingPoint(true);
    try {
      const resp = await fetch(`/api/weather/point?lat=${lat}&lon=${lon}`);
      if (resp.ok) {
        const pointData: WeatherCity = await resp.json();
        // Add or replace temporary point in cities list
        setCities(prev => {
          const filtered = prev.filter(c => !c.city.startsWith('Ponto ['));
          return [pointData, ...filtered];
        });
        setSelectedCity(pointData);
      }
    } catch (e) {
      console.error('Erro ao buscar ponto no mapa:', e);
    } finally {
      setSamplingPoint(false);
    }
  };

  // Select searched city
  const handleSelectSearchResult = async (item: any) => {
    setSearching(true);
    try {
      const resp = await fetch(`/api/weather/point?lat=${item.lat}&lon=${item.lon}`);
      if (resp.ok) {
        const fullCityData: WeatherCity = await resp.json();
        fullCityData.city = item.name;
        fullCityData.country = item.countryCode || item.country;
        setCities(prev => [fullCityData, ...prev.filter(c => c.city !== item.name)]);
        setSelectedCity(fullCityData);
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  if (!isOpen) return null;

  const getWeatherIcon = (code?: string) => {
    switch (code) {
      case 'sunny':
        return <Sun className="w-5 h-5 text-amber-400 animate-[spin_20s_linear_infinite]" />;
      case 'rain':
        return <CloudRain className="w-5 h-5 text-cyan-400" />;
      case 'snow':
        return <Snowflake className="w-5 h-5 text-blue-200 animate-pulse" />;
      case 'thunder':
        return <CloudLightning className="w-5 h-5 text-amber-300 animate-pulse" />;
      case 'cloudy':
      default:
        return <Cloud className="w-5 h-5 text-neutral-300" />;
    }
  };

  const getTemperatureBadgeColor = (temp: number) => {
    if (temp <= 0) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    if (temp < 18) return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
    if (temp < 25) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (temp < 30) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-red-500/20 text-red-300 border-red-500/40';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-[#0d0e12] border border-cyan-500/30 rounded-2xl shadow-[0_0_60px_rgba(0,229,255,0.18)] flex flex-col overflow-hidden my-auto">
        {/* Top Broadcast News Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-800 bg-[#12141a]/95 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.25)]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white font-['Poppins'] tracking-tight">
                  Radar Climatológico Global
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  OPEN-METEO VIRTUAL BROADCAST
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Telemetria meteorológica de alta resolução com OpenStreetMap, ECMWF, GFS e WMO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors cursor-pointer"
              title="Fechar Radar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Newsroom Extremes Ticker */}
        <div className="bg-neutral-900/90 border-b border-neutral-800 px-4 py-2 flex items-center gap-3 text-xs overflow-hidden shrink-0">
          <span className="px-2 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/40 font-mono font-bold text-[10px] uppercase shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            EXTREMOS GLOBAIS
          </span>
          <div className="text-neutral-300 font-mono text-[11px] truncate flex-1 flex items-center gap-4">
            <span className="text-amber-300 flex items-center gap-1">
              ☀️ <strong className="text-white">Nairobi (Quênia):</strong> 27°C sol tropical radiante
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-cyan-300 flex items-center gap-1">
              ❄️ <strong className="text-white">Estação McMurdo (Antártica):</strong> -24°C a -33°C com vento polar
            </span>
            <span className="text-zinc-600 hidden md:inline">•</span>
            <span className="text-emerald-300 hidden md:flex items-center gap-1">
              🇧🇷 <strong className="text-white">Brasília:</strong> 21°C estabilidade atmosférica
            </span>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#101217] border-b border-neutral-800/80 gap-2 flex-wrap shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('broadcast')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'broadcast'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Dossiê Visual & Imagens</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mapa Aberto OpenStreetMap</span>
            </button>

            <button
              onClick={() => setActiveTab('apis')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'apis'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Modelos & APIs Open-Meteo</span>
            </button>
          </div>

          {/* Quick Extreme Climate Jumpers */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="text-zinc-500 text-[10px] hidden lg:inline">COMPARAR:</span>
            {cities.find(c => c.city === 'Nairobi') && (
              <button
                onClick={() => setSelectedCity(cities.find(c => c.city === 'Nairobi')!)}
                className="px-2 py-1 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Flame className="w-3 h-3" />
                <span>Nairobi (Calor 27°C)</span>
              </button>
            )}
            {cities.find(c => c.country === 'AQ' || c.city.includes('McMurdo')) && (
              <button
                onClick={() => setSelectedCity(cities.find(c => c.country === 'AQ' || c.city.includes('McMurdo'))!)}
                className="px-2 py-1 rounded-md bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Snowflake className="w-3 h-3" />
                <span>Antártica (-24°C)</span>
              </button>
            )}
            {cities.find(c => c.city === 'Brasília') && (
              <button
                onClick={() => setSelectedCity(cities.find(c => c.city === 'Brasília')!)}
                className="px-2 py-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer hidden sm:flex"
              >
                <span>Brasília (21°C)</span>
              </button>
            )}
          </div>
        </div>

        {/* Global City Search Bar */}
        <div className="px-4 sm:px-6 py-2 bg-[#0b0c10] border-b border-neutral-800/80 flex items-center gap-3 relative shrink-0">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Pesquisar qualquer cidade do planeta no Open-Meteo (ex: Roma, Dubai, Manaus, Cairo, Tóquio)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-700/60 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-cyan-400 border-t-transparent animate-spin" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-4 sm:left-6 right-4 sm:right-6 mt-1 bg-[#14161f] border border-cyan-500/40 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border-b border-neutral-800">
                RESULTADOS GEOCODING OPEN-METEO
              </div>
              {searchResults.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-800 border-b border-neutral-800/50 flex items-center justify-between text-xs text-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-neutral-400 font-mono text-[11px]">{item.admin1 ? `${item.admin1}, ` : ''}{item.country}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {item.lat.toFixed(2)}°, {item.lon.toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Body Content with scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
          {loading ? (
            <div className="h-72 flex flex-col items-center justify-center gap-3">
              <div className="w-9 h-9 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shadow-[0_0_15px_rgba(0,229,255,0.3)]" />
              <p className="text-xs font-mono text-neutral-300">Conectando aos satélites meteorológicos e Open-Meteo...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: Visual Broadcast & Dossier */}
              {activeTab === 'broadcast' && selectedCity && (
                <div className="space-y-6">
                  {/* Atmospheric Imagery Header Card */}
                  <AtmosphericScene city={selectedCity} />

                  {/* Main Grid: City Selector + Deep Telemetry */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Global City Monitor List */}
                    <div className="lg:col-span-4 space-y-2 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="text-[11px] font-mono font-bold text-neutral-400 flex items-center justify-between px-1 mb-1">
                        <span>ESTAÇÕES MONITORADAS</span>
                        <span>TEMPERATURA</span>
                      </div>
                      {cities.map(c => {
                        const isSelected = selectedCity?.city === c.city;
                        const badgeColor = getTemperatureBadgeColor(c.temperature);
                        return (
                          <button
                            key={c.city}
                            onClick={() => setSelectedCity(c)}
                            className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_15px_rgba(0,229,255,0.2)] scale-[1.01]'
                                : 'bg-[#13151c] border-neutral-800/80 hover:border-neutral-700 hover:bg-[#181a24]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-neutral-400'}`} />
                              <div>
                                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                                  <span>{c.city}</span>
                                  {c.country === 'AQ' && <span className="text-[10px]">🧊</span>}
                                  {c.city === 'Nairobi' && <span className="text-[10px]">☀️</span>}
                                </div>
                                <div className="text-[10px] font-mono text-neutral-400">
                                  {c.country} • {c.condition}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {getWeatherIcon(c.conditionCode)}
                              <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md border ${badgeColor}`}>
                                {c.temperature > 0 ? `+${c.temperature}` : c.temperature}{c.unit}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right: Rich Atmospheric Telemetry Telejornal */}
                    <div className="lg:col-span-8 space-y-4">
                      {/* Metric Cards Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {/* Wind */}
                        <div className="p-3 rounded-xl bg-[#13151c] border border-neutral-800 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-neutral-400">
                            <span className="text-[10px] font-mono">VENTO REAL</span>
                            <Wind className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div className="mt-2">
                            <div className="text-base font-bold text-white font-mono">{selectedCity.windSpeed}</div>
                            <div className="text-[10px] text-neutral-400 font-mono">
                              {selectedCity.windDirection ? `Direção: ${selectedCity.windDirection}°` : 'Variação estável'}
                            </div>
                          </div>
                        </div>

                        {/* Humidity */}
                        <div className="p-3 rounded-xl bg-[#13151c] border border-neutral-800 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-neutral-400">
                            <span className="text-[10px] font-mono">UMIDADE DO AR</span>
                            <Droplets className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="mt-2">
                            <div className="text-base font-bold text-white font-mono">{selectedCity.humidity}%</div>
                            <div className="text-[10px] text-neutral-400 font-mono">
                              {selectedCity.humidity > 70 ? 'Ponto de orvalho alto' : selectedCity.humidity < 30 ? 'Ar muito seco' : 'Conforto térmico'}
                            </div>
                          </div>
                        </div>

                        {/* Barometric Pressure */}
                        <div className="p-3 rounded-xl bg-[#13151c] border border-neutral-800 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-neutral-400">
                            <span className="text-[10px] font-mono">PRESSÃO</span>
                            <Gauge className="w-4 h-4 text-purple-400" />
                          </div>
                          <div className="mt-2">
                            <div className="text-base font-bold text-white font-mono">{selectedCity.pressure || 1013} hPa</div>
                            <div className="text-[10px] text-neutral-400 font-mono">
                              {(selectedCity.pressure || 1013) > 1013 ? 'Alta Pressão' : 'Baixa Pressão'}
                            </div>
                          </div>
                        </div>

                        {/* Elevation */}
                        <div className="p-3 rounded-xl bg-[#13151c] border border-neutral-800 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-neutral-400">
                            <span className="text-[10px] font-mono">ALTITUDE</span>
                            <Compass className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="mt-2">
                            <div className="text-base font-bold text-white font-mono">{selectedCity.elevation || 0} m</div>
                            <div className="text-[10px] text-neutral-400 font-mono">Acima do nível do mar</div>
                          </div>
                        </div>
                      </div>

                      {/* 5-Day Open-Meteo Forecast Row */}
                      {selectedCity.forecast && selectedCity.forecast.length > 0 && (
                        <div className="p-4 rounded-xl bg-[#13151c] border border-neutral-800">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                              <span>PROJEÇÃO METEOROLÓGICA (5 DIAS)</span>
                            </div>
                            <span className="text-[10px] font-mono text-neutral-400">Modelos ECMWF & GFS</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {selectedCity.forecast.map((f, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex flex-col items-center text-center"
                              >
                                <span className="text-[11px] font-mono font-bold text-zinc-300 uppercase">{f.day}</span>
                                <div className="my-1">{getWeatherIcon(f.code)}</div>
                                <div className="text-xs font-mono font-bold text-white">
                                  {f.max}° <span className="text-zinc-500 font-normal">/ {f.min}°</span>
                                </div>
                                <span className="text-[9px] text-neutral-400 truncate w-full mt-0.5">{f.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Open-Meteo Telemetry Context Banner */}
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-purple-950/30 border border-cyan-800/30 text-xs text-neutral-300 flex items-start gap-3">
                        <Radio className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <strong className="text-white font-mono">CAPY-CLIMATE TELEMETRY:</strong>{' '}
                          {selectedCity.themeDescription ||
                            'Dados em tempo real processados através da API Open-Meteo, cruzando variáveis barométricas e de satélite para subsidiar investigações jornalísticas baseadas em evidências climáticas concretas.'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Interactive OpenStreetMap with Leaflet */}
              {activeTab === 'map' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>
                        <strong>Navegação Aberta OpenStreetMap:</strong> Arraste o mapa pelo globo, dê zoom e clique em qualquer lugar (continentes ou oceanos) para ler o clima ao vivo no Open-Meteo!
                      </span>
                    </div>
                    {samplingPoint && (
                      <span className="text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        Sondando coordenadas...
                      </span>
                    )}
                  </div>

                  {/* Leaflet Map Widget */}
                  <OpenStreetMapWidget
                    cities={cities}
                    selectedCity={selectedCity}
                    onSelectCity={c => setSelectedCity(c)}
                    onMapClickPoint={handleMapClickPoint}
                  />

                  {/* Quick Selected City Banner beneath map */}
                  {selectedCity && (
                    <div className="p-4 rounded-xl bg-[#13151c] border border-neutral-800 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-black/60 border border-white/10">
                          {getWeatherIcon(selectedCity.conditionCode)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white font-['Poppins'] flex items-center gap-2">
                            <span>{selectedCity.city} ({selectedCity.country})</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                              {selectedCity.lat.toFixed(2)}°, {selectedCity.lon.toFixed(2)}°
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400">
                            {selectedCity.condition} • Vento: {selectedCity.windSpeed} • Umidade: {selectedCity.humidity}% • Altitude: {selectedCity.elevation || 0}m
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-3xl font-black text-white font-mono">
                            {selectedCity.temperature > 0 ? `+${selectedCity.temperature}` : selectedCity.temperature}{selectedCity.unit}
                          </div>
                          <div className="text-[10px] font-mono text-neutral-400">
                            Sensação: {selectedCity.apparentTemperature || selectedCity.temperature}°C
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab('broadcast')}
                          className="px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Ver Dossiê</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Complete Open-Meteo Suite Catalog */}
              {activeTab === 'apis' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-neutral-900 to-cyan-950/40 border border-purple-500/30 text-xs text-neutral-300">
                    <h4 className="text-sm font-bold text-white font-['Poppins'] mb-1 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      Ecossistema e Catálogo de APIs Open-Meteo Integradas
                    </h4>
                    <p className="text-neutral-400">
                      O CapyNews utiliza os modelos numéricos de previsão do tempo (NWP) de código aberto do Open-Meteo, combinando centros meteorológicos mundiais sem cobranças abusivas ou paywalls proprietários.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      {
                        title: 'Weather Forecast API',
                        status: 'Ativa no CapyNews',
                        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                        desc: 'Previsões horárias e diárias de 1 a 16 dias com resolução de até 1 km.'
                      },
                      {
                        title: 'ECMWF API (Europeu)',
                        status: 'Ativa no CapyNews',
                        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
                        desc: 'European Centre for Medium-Range Weather Forecasts, líder mundial em precisão.'
                      },
                      {
                        title: 'GFS & HRRR Forecast API (NOAA)',
                        status: 'Ativa no CapyNews',
                        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
                        desc: 'Modelos operacionais dos EUA com alta resolução para tempestades e frentes frias.'
                      },
                      {
                        title: 'Météo-France API',
                        status: 'Integrado',
                        badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                        desc: 'Modelos ARPEGE e AROME para a Europa Ocidental e coberturas de alta densidade.'
                      },
                      {
                        title: 'DWD ICON API (Alemanha)',
                        status: 'Integrado',
                        badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                        desc: 'Deutscher Wetterdienst ICON com malha não hidrostática global de alta performance.'
                      },
                      {
                        title: 'JMA API (Japão)',
                        status: 'Integrado',
                        badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                        desc: 'Japan Meteorological Agency para tufões e clima do Pacífico e Ásia.'
                      },
                      {
                        title: 'Met Norway API',
                        status: 'Integrado',
                        badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                        desc: 'Especialista em climatologia nórdica, calotas polares e nevascas marítimas.'
                      },
                      {
                        title: 'GEM API (Canadá)',
                        status: 'Integrado',
                        badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                        desc: 'Global Environmental Multiscale Model para o Ártico e Américas.'
                      },
                      {
                        title: 'Geocoding API',
                        status: 'Ativa no CapyNews',
                        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                        desc: 'Busca rápida de coordenadas geográficas de qualquer cidade ou povoado do planeta.'
                      },
                      {
                        title: 'Elevation API',
                        status: 'Ativa no CapyNews',
                        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                        desc: 'Topografia com modelos digitais de elevação de 90 metros (SRTM e Copernicus).'
                      },
                      {
                        title: 'Historical Weather API',
                        status: 'Disponível',
                        badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                        desc: 'Arquivo de reanálise ERA5 desde 1940 para contextualização de mudanças climáticas.'
                      },
                      {
                        title: 'Air Quality API',
                        status: 'Disponível',
                        badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                        desc: 'Índices de qualidade do ar (AQI), PM2.5, PM10, Ozônio e Monóxido de Carbono.'
                      },
                      {
                        title: 'Marine Weather API',
                        status: 'Disponível',
                        badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                        desc: 'Ondas oceânicas, temperatura da água do mar e correntes marítimas.'
                      },
                      {
                        title: 'Flood API',
                        status: 'Disponível',
                        badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                        desc: 'Previsões hidrológicas do GloFAS da Comissão Europeia contra enchentes.'
                      },
                      {
                        title: 'Climate Change API',
                        status: 'Disponível',
                        badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                        desc: 'Projeções climáticas globais do CMIP6 para os próximos 80 anos.'
                      }
                    ].map((api, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#13151c] border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-semibold text-xs text-white font-['Poppins']">{api.title}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${api.badge}`}>
                              {api.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 leading-relaxed">{api.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                    <span>Documentação oficial e termos de uso livre (CC-BY 4.0):</span>
                    <a
                      href="https://open-meteo.com/en/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span>open-meteo.com/en/docs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-4 sm:px-6 py-3 border-t border-neutral-800 bg-[#12141a] flex items-center justify-between text-xs text-neutral-400 shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-zinc-500">FONTES:</span>
            <span className="text-zinc-300">Open-Meteo</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300">OpenStreetMap</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300">WMO</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              {t.weatherClose || 'Fechar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
