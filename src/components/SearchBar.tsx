import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { Article } from '../types.ts';
import { TranslationDict } from '../i18n/translations.ts';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  t: TranslationDict;
  autoFocus?: boolean;
  onClose?: () => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  articles,
  onSelectArticle,
  t,
  autoFocus = false,
  onClose,
  placeholder,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle ESC key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (value) {
        onChange('');
      } else if (onClose) {
        onClose();
      }
      setIsOpen(false);
    }
  };

  // Filter recommendations
  const suggestions = React.useMemo(() => {
    if (!value || value.trim().length < 2) return [];
    const q = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return articles
      .filter(a => {
        const title = (a.title || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const src = (a.source || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const topic = (a.topic || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return title.includes(q) || src.includes(q) || topic.includes(q);
      })
      .slice(0, 5);
  }, [value, articles]);

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div className="relative group flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t.searchPlaceholder}
          className="w-full bg-[#181818] border border-white/15 focus:border-[#00e5ff]/60 rounded-xl py-2 pl-9 pr-9 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#00e5ff]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all"
        />
        <Search className="w-4 h-4 absolute left-3 text-[#00e5ff] pointer-events-none" />

        <div className="absolute right-2.5 flex items-center gap-1">
          {value ? (
            <button
              onClick={() => {
                onChange('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              title="Limpar texto"
              className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : onClose ? (
            <button
              onClick={onClose}
              title="Fechar pesquisa (Esc)"
              className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-[#121212]/95 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50">
          <div className="px-2 py-1 text-[10px] font-mono text-white/40 flex items-center justify-between border-b border-white/5 pb-1.5 mb-1">
            <span className="flex items-center gap-1 text-[#8A2BE2] font-semibold">
              <Sparkles className="w-3 h-3" /> SUGESTÕES EM TEMPO REAL
            </span>
            <span>{suggestions.length} FATOS</span>
          </div>

          <div className="space-y-1">
            {suggestions.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectArticle(item);
                  setIsOpen(false);
                }}
                className="w-full p-2.5 rounded-xl text-left hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-start justify-between gap-2 group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-[#00e5ff] line-clamp-1">
                    {item.title}
                  </div>
                  <div className="text-[10px] font-mono text-white/40 mt-0.5 flex items-center gap-2">
                    <span className="text-[#00e5ff] font-bold">{item.source}</span>
                    <span>•</span>
                    <span>{item.topic}</span>
                    {item.aheadDaHora && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#8A2BE2] text-white font-bold">
                        AHEAD
                      </span>
                    )}
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-[#00e5ff] flex-shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
