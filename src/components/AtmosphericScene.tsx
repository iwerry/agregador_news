import React from 'react';
import { Sun, Snowflake, CloudRain, Wind, AlertTriangle, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { WeatherCity } from '../types.ts';

interface AtmosphericSceneProps {
  city: WeatherCity;
}

export const AtmosphericScene: React.FC<AtmosphericSceneProps> = ({ city }) => {
  const isPolar = city.temperature <= 0 || city.conditionCode === 'snow';
  const isHot = city.temperature >= 26 || (city.temperature >= 24 && city.conditionCode === 'sunny');
  const isRain = city.conditionCode === 'rain' || city.conditionCode === 'thunder';

  // High-fidelity background images matching conditions
  const getBackgroundImage = () => {
    if (city.country === 'AQ' || isPolar) {
      // Antarctica / Polar Glaciers
      return 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=1200&q=80';
    }
    if (city.city === 'Nairobi' || isHot) {
      // Kenyan Savanna / Golden Tropical Sun
      return city.city === 'Nairobi'
        ? 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80'
        : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80';
    }
    if (isRain) {
      // Rain drenched city
      return 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1200&q=80';
    }
    // Mild / Temperate / Brasilia / Modern metropolis
    return 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=1200&q=80';
  };

  return (
    <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-white/15 shadow-2xl group">
      {/* Background Image with Ambient Zoom */}
      <img
        src={getBackgroundImage()}
        alt={city.condition}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
      />

      {/* Atmospheric Overlays & Color Gradients */}
      {isPolar && (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-cyan-950/60 to-transparent mix-blend-multiply" />
      )}
      {isHot && (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-amber-950/50 to-orange-900/20 mix-blend-multiply" />
      )}
      {isRain && (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-blue-950/60 to-slate-900/40" />
      )}
      {!isPolar && !isHot && !isRain && (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
      )}

      {/* Dynamic Animated Particles Simulation */}
      {isPolar && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Simulated Falling Snow flakes */}
          <div className="absolute inset-0 opacity-80 flex justify-around">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse translate-y-6 blur-[0.5px]" />
            <span className="w-2 h-2 rounded-full bg-cyan-100 animate-ping translate-y-16 blur-[0.5px]" />
            <span className="w-1 h-1 rounded-full bg-white animate-pulse translate-y-12" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-200/90 animate-bounce translate-y-8 blur-[1px]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse translate-y-20" />
          </div>
          {/* Frost border vignette */}
          <div className="absolute inset-0 border-4 border-cyan-300/30 rounded-2xl pointer-events-none" />
        </div>
      )}

      {isHot && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Heat Mirage / Warm Flare */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-500/25 blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 left-1/3 w-60 h-24 rounded-full bg-orange-600/20 blur-2xl" />
        </div>
      )}

      {/* Foreground Broadcast HUD Overlay */}
      <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between z-10 text-white select-none">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase border flex items-center gap-1.5 backdrop-blur-md shadow-lg ${
              isPolar
                ? 'bg-cyan-950/80 text-cyan-200 border-cyan-400/50'
                : isHot
                ? 'bg-amber-950/80 text-amber-200 border-amber-400/50'
                : isRain
                ? 'bg-blue-950/80 text-blue-200 border-blue-400/50'
                : 'bg-emerald-950/80 text-emerald-200 border-emerald-400/50'
            }`}>
              {isPolar ? <Snowflake className="w-3.5 h-3.5 text-cyan-400 animate-spin" /> :
               isHot ? <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> :
               isRain ? <CloudRain className="w-3.5 h-3.5 text-cyan-300" /> :
               <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{city.themeBadge || (isPolar ? 'VÓRTICE POLAR & NEVE' : isHot ? 'CALOR TROPICAL INTENSO' : 'ATMOSFERA ESTÁVEL')}</span>
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SATÉLITE OPEN-METEO AO VIVO</span>
          </div>
        </div>

        {/* Bottom Metrics Bar with Big Contrast Temperature */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs sm:text-sm font-mono text-zinc-300 flex items-center gap-1.5">
              <span>{city.city} ({city.country})</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 font-sans">{city.condition}</span>
            </div>

            <div className="flex items-baseline gap-3 mt-0.5">
              <span className={`text-4xl sm:text-6xl font-black font-['Poppins'] tracking-tight drop-shadow-md ${
                isPolar ? 'text-cyan-200' : isHot ? 'text-amber-300' : 'text-white'
              }`}>
                {city.temperature > 0 ? `+${city.temperature}` : city.temperature}
                <span className="text-2xl sm:text-3xl font-light text-zinc-400 ml-1">{city.unit}</span>
              </span>

              {city.apparentTemperature !== undefined && (
                <span className="text-xs sm:text-sm font-mono text-zinc-300 bg-black/60 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-sm">
                  Sensação: <span className="font-bold text-white">{city.apparentTemperature > 0 ? `+${city.apparentTemperature}` : city.apparentTemperature}°C</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Atmospheric Tags */}
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-zinc-200 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>{city.windSpeed}</span>
            </div>
            {city.uvIndex !== undefined && (
              <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-zinc-200 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>UV {city.uvIndex.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
