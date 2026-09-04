import React from 'react';
import { Sparkles, Globe, Tag, X, Filter, RotateCcw, Check } from 'lucide-react';
import { TranslationDict } from '../i18n/translations.ts';

interface FilterBarProps {
  selectedRegion: string;
  onSelectRegion: (reg: string) => void;
  selectedTopic: string;
  onSelectTopic: (top: string) => void;
  aheadOnly: boolean;
  onToggleAheadOnly: () => void;
  t: TranslationDict;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedRegion,
  onSelectRegion,
  selectedTopic,
  onSelectTopic,
  aheadOnly,
  onToggleAheadOnly,
  t,
  totalCount
}) => {
  const hasActiveFilters = selectedRegion !== 'Global' || selectedTopic !== 'All' || aheadOnly;

  const handleResetAll = () => {
    onSelectRegion('Global');
    onSelectTopic('All');
    if (aheadOnly) onToggleAheadOnly();
  };

  if (!hasActiveFilters) {
    return (
      <div className="w-full py-2.5 px-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-white/60">
          <Globe className="w-4 h-4 text-[#00e5ff]" />
          <span>Exibindo: <strong className="text-white">Últimas Notícias Globais</strong> (Todos os continentes e assuntos)</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-white/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{totalCount} FATOS VERIFICADOS</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-2.5 px-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
      {/* Active Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-white/40 font-mono text-[11px] flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-[#8A2BE2]" />
          FILTROS ATIVOS:
        </span>

        {/* Region Chip */}
        {selectedRegion !== 'Global' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00e5ff]/15 border border-[#00e5ff]/40 text-[#00e5ff] font-medium text-xs">
            <Globe className="w-3 h-3" />
            <span>{t.regions[selectedRegion] || selectedRegion}</span>
            <button
              onClick={() => onSelectRegion('Global')}
              className="p-0.5 hover:bg-[#00e5ff]/20 rounded-full cursor-pointer ml-1"
              title="Remover filtro de continente"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Topic Chip */}
        {selectedTopic !== 'All' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8A2BE2]/20 border border-[#8A2BE2]/50 text-white font-medium text-xs">
            <Tag className="w-3 h-3 text-[#8A2BE2]" />
            <span>{t.topics[selectedTopic] || selectedTopic}</span>
            <button
              onClick={() => onSelectTopic('All')}
              className="p-0.5 hover:bg-white/20 rounded-full cursor-pointer ml-1"
              title="Remover filtro de tópico"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Ahead Only Chip */}
        {aheadOnly && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff1744]/20 border border-[#ff1744]/50 text-white font-medium text-xs">
            <Sparkles className="w-3 h-3 text-[#ff1744]" />
            <span>Ahead da Hora (Direto)</span>
            <button
              onClick={onToggleAheadOnly}
              className="p-0.5 hover:bg-white/20 rounded-full cursor-pointer ml-1"
              title="Desativar filtro Ahead da Hora"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Clear All Button */}
        <button
          onClick={handleResetAll}
          className="inline-flex items-center gap-1 text-[11px] font-mono text-white/50 hover:text-white underline cursor-pointer ml-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Limpar Tudo</span>
        </button>
      </div>

      {/* Counter */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-white/40">
        <span className="text-[#00e5ff] font-bold">{totalCount}</span>
        <span>FATOS ENCONTRADOS</span>
      </div>
    </div>
  );
};
