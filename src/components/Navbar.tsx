import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Menu,
  X,
  Globe,
  ChevronDown,
  ChevronRight,
  CloudSun,
  BookOpen,
  Shield,
  User,
  Sparkles,
  Search,
  Check,
  Radio,
  ExternalLink,
  Layers,
  Compass,
  Users,
  Cpu,
  Camera,
  Database,
  Building2
} from 'lucide-react';
import { Language, Article, UserProfile } from '../types.ts';
import { TranslationDict } from '../i18n/translations.ts';
import { SearchBar } from './SearchBar.tsx';
import { TypewriterText } from './TypewriterText.tsx';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  t: TranslationDict;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onOpenWeather: () => void;
  onOpenManifesto: () => void;
  onOpenAbout?: () => void;
  onOpenAdmin: () => void;
  onOpenDraftStudio?: (sectionId?: string) => void;
  userProfile: UserProfile | null;
  onToggleAnonymous: () => void;
  // Continent & Topics filter integration (Euronews style)
  selectedRegion: string;
  onSelectRegion: (reg: string) => void;
  selectedTopic: string;
  onSelectTopic: (top: string) => void;
  aheadOnly: boolean;
  onToggleAheadOnly: () => void;
  totalCount: number;
  weatherSummary?: { temp: number; conditionCode: string; city: string } | null;
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' }
];

const CONTINENTS: { id: string; name: string; icon: string }[] = [
  { id: 'Global', name: 'Todos os Continentes', icon: '🌐' },
  { id: 'América do Sul', name: 'América do Sul', icon: '🌎' },
  { id: 'América do Norte', name: 'América do Norte', icon: '🌎' },
  { id: 'Europe', name: 'Europa', icon: '🌍' },
  { id: 'Ásia & Oriente Médio', name: 'Ásia & Oriente Médio', icon: '🌏' },
  { id: 'Oceania', name: 'Oceania', icon: '🌏' },
  { id: 'África', name: 'África', icon: '🌍' }
];

// All available topics with icons and default labels
const ALL_TOPICS = [
  { id: 'Tech & AI', label: 'Tech & IA', icon: '⚡' },
  { id: 'Business & Finance', label: 'Negócios & Finanças', icon: '📈' },
  { id: 'Green & Planet', label: 'Planeta & Meio Ambiente', icon: '🌱' },
  { id: 'Science', label: 'Ciência & Pesquisa', icon: '🔬' },
  { id: 'Health & Wellness', label: 'Saúde & Bem-Estar', icon: '🩺' },
  { id: 'Culture & Arts', label: 'Cultura & Artes', icon: '🎨' },
  { id: 'Space & Cosmos', label: 'Espaço & Cosmos', icon: '🚀' },
  { id: 'Design & Architecture', label: 'Design & Arquitetura', icon: '🏛️' },
  { id: 'Lifestyle', label: 'Estilo de Vida', icon: '☕' },
  { id: 'Gaming & Sports', label: 'Games & Esportes', icon: '🎮' },
  { id: 'Mobility & Auto', label: 'Mobilidade & Automotivo', icon: '🚗' }
];

// Single quick-access topic displayed directly on ultra-wide screens (2xl: 1536px+)
const ULTRA_WIDE_TOPICS = [
  { id: 'Tech & AI', label: 'Tech & IA' }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  t,
  searchQuery,
  onSearchChange,
  articles,
  onSelectArticle,
  onOpenWeather,
  onOpenManifesto,
  onOpenAbout,
  onOpenAdmin,
  onOpenDraftStudio,
  userProfile,
  onToggleAnonymous,
  selectedRegion,
  onSelectRegion,
  selectedTopic,
  onSelectTopic,
  aheadOnly,
  onToggleAheadOnly,
  totalCount,
  weatherSummary
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [continentsDropdownOpen, setContinentsDropdownOpen] = useState(false);
  const [moreTopicsDropdownOpen, setMoreTopicsDropdownOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [drawerContinentsExpanded, setDrawerContinentsExpanded] = useState(false);
  const [drawerTopicsExpanded, setDrawerTopicsExpanded] = useState(false);

  // Live weather temperature tracker for navbar display
  const [liveTemp, setLiveTemp] = useState<number | null>(weatherSummary?.temp ?? null);

  useEffect(() => {
    if (weatherSummary?.temp !== undefined) {
      setLiveTemp(weatherSummary.temp);
      return;
    }
    fetch('/api/weather')
      .then(r => r.json())
      .then(data => {
        if (data.cities && data.cities.length > 0) {
          setLiveTemp(data.cities[0].temperature);
        }
      })
      .catch(() => {});
  }, [weatherSummary]);

  const continentsRef = useRef<HTMLDivElement>(null);
  const moreTopicsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (continentsRef.current && !continentsRef.current.contains(event.target as Node)) {
        setContinentsDropdownOpen(false);
      }
      if (moreTopicsRef.current && !moreTopicsRef.current.contains(event.target as Node)) {
        setMoreTopicsDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        if (!searchQuery) {
          setSearchExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  // Keyboard shortcuts: Escape to close drawer/search, Ctrl+K or / to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setContinentsDropdownOpen(false);
        setMoreTopicsDropdownOpen(false);
        if (!searchQuery) {
          setSearchExpanded(false);
        }
      }
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchExpanded(true);
      }
      // "/" to open search if not focused on an input
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setSearchExpanded(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  // Prevent background scrolling when slide-out drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const isLatestActive = selectedRegion === 'Global' && selectedTopic === 'All';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121212]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
      {/* 1. TOP UTILITY BAR (Euronews Style Subheader) */}
      <div className="h-8 border-b border-white/5 px-3 sm:px-4 lg:px-8 flex items-center justify-between text-[11px] text-white/50 bg-black/40 overflow-hidden w-full">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
          {/* Language Selector Dropdown */}
          <div className="relative shrink-0" ref={langRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#00e5ff] shrink-0" />
              <span className="font-medium">{LANGUAGES.find(l => l.code === currentLang)?.label || 'Português'}</span>
              <ChevronDown className="w-3 h-3 text-white/40 shrink-0" />
            </button>

            {langMenuOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-36 rounded-xl bg-[#181818] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl py-1 z-50 animate-fadeIn">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      currentLang === lang.code
                        ? 'bg-[#8A2BE2]/30 text-white font-bold'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span>{lang.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-white/20 hidden sm:inline">|</span>

          {/* Quick Hub Links: Radar Clima com Ícone, Nome e Temperatura */}
          <button
            onClick={onOpenWeather}
            title="Abrir Radar Meteorológico Global & Telejornal de Clima em Tempo Real"
            className="flex items-center gap-1.5 px-2 py-0.5 sm:py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00e5ff]/40 text-white/80 hover:text-white transition-all cursor-pointer group shrink-0"
          >
            <CloudSun className="w-3.5 h-3.5 text-[#00e5ff] group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-medium text-xs hidden sm:inline">Radar Clima</span>
            <span className="px-1.5 py-0.2 sm:py-0.5 rounded text-[10px] font-mono font-bold bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/30 shrink-0">
              {liveTemp !== null ? `${liveTemp > 0 ? '+' : ''}${liveTemp}°C` : '21°C'}
            </span>
          </button>

          <button
            onClick={onOpenAbout}
            className="hidden xl:flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <Users className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>Quem Somos</span>
          </button>

          <button
            onClick={onOpenManifesto}
            className="hidden xl:flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#8A2BE2]" />
            <span>Doutrina & Manifesto</span>
          </button>
        </div>

        {/* Right Utility: Telemetry & Count */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-[10px] shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="hidden md:inline text-white/60">339 FEEDS ATIVOS</span>
            <span className="text-white/30 hidden md:inline">•</span>
            <span className="text-[#00e5ff] font-semibold">{totalCount} FATOS</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAV BAR (Euronews Layout) */}
      <div className="h-14 sm:h-16 px-3 sm:px-4 lg:px-8 flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 w-full max-w-7xl mx-auto">
        {/* Left: Hamburger Menu + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Euronews-style Hamburger Menu Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Menu de Seções"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer border border-white/5 hover:border-white/20 group shrink-0"
          >
            <Menu className="w-5 h-5 text-white group-hover:text-[#00e5ff] transition-colors" />
          </button>

          {/* Brand Emblem */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectRegion('Global');
              onSelectTopic('All');
              onSearchChange('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#8A2BE2] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(138,43,226,0.6)] group-hover:scale-105 transition-transform shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 11a9 9 0 0 1 9 9" />
                <path d="M4 4a16 16 0 0 1 16 16" />
                <circle cx="5" cy="19" r="1" />
                <path d="M12 4c2 0 4 2 4 4s-2 4-4 4-4-2-4-4 2-4 4-4z" opacity="0.5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-['Poppins'] leading-tight whitespace-nowrap">
                Capy<span className="text-[#8A2BE2]">News</span>
                <span className="text-[#00e5ff] text-xl sm:text-2xl font-black leading-none">.</span>
              </span>
              <TypewriterText className="hidden lg:inline-flex text-[9px] font-mono tracking-widest text-[#00e5ff] uppercase font-bold" />
            </div>
          </a>
        </div>

        {/* Center: Topics & Continents Navigation Row (Clean Priority Navigation) */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold shrink-0">
          {/* "Últimas" (All / Reset) */}
          <button
            onClick={() => {
              onSelectRegion('Global');
              onSelectTopic('All');
            }}
            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              isLatestActive
                ? 'text-white bg-white/10 font-bold border-b-2 border-[#8A2BE2]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Últimas
          </button>

          {/* CONTINENTES DROPDOWN */}
          <div className="relative shrink-0" ref={continentsRef}>
            <button
              onClick={() => setContinentsDropdownOpen(!continentsDropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedRegion !== 'Global'
                  ? 'text-[#00e5ff] bg-[#00e5ff]/10 font-bold border border-[#00e5ff]/30 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span>
                {selectedRegion !== 'Global'
                  ? (t.regions[selectedRegion] || selectedRegion)
                  : 'Continentes'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  continentsDropdownOpen ? 'rotate-180 text-white' : 'text-white/50'
                }`}
              />
            </button>

            {/* Continents Dropdown Menu */}
            {continentsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#141414] border border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.95)] backdrop-blur-2xl py-2 z-50 animate-fadeIn">
                <div className="px-3.5 py-1.5 text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/5">
                  Navegar por Continente
                </div>
                {CONTINENTS.map(c => {
                  const isSelected = selectedRegion === c.id;
                  const label = c.id === 'Global' ? t.allRegions : (t.regions[c.id] || c.name);
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectRegion(c.id);
                        setContinentsDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#8A2BE2]/30 text-white font-bold border-l-2 border-[#00e5ff]'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{c.icon}</span>
                        <span>{label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#00e5ff]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Access Topic on 2xl screens (1536px+) */}
          {ULTRA_WIDE_TOPICS.map(topic => {
            const isSelected = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className={`hidden 2xl:inline-flex px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'text-[#00e5ff] bg-white/10 font-bold border-b-2 border-[#00e5ff]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.topics[topic.id] || topic.label}
              </button>
            );
          })}

          {/* "Mais Tópicos ▾" Dropdown (Containing all other topics cleanly organized) */}
          <div className="relative shrink-0" ref={moreTopicsRef}>
            {(() => {
              const isTopicInUltraWide = ULTRA_WIDE_TOPICS.some(t => t.id === selectedTopic);
              const isDropdownTopicActive = selectedTopic !== 'All' && !isTopicInUltraWide;
              const activeTopicObj = ALL_TOPICS.find(tp => tp.id === selectedTopic);
              const activeTopicLabel = activeTopicObj ? (t.topics[activeTopicObj.id] || activeTopicObj.label) : 'Mais';

              return (
                <>
                  <button
                    onClick={() => setMoreTopicsDropdownOpen(!moreTopicsDropdownOpen)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      isDropdownTopicActive
                        ? 'text-[#8A2BE2] bg-[#8A2BE2]/20 font-bold border border-[#8A2BE2]/40 shadow-[0_0_10px_rgba(138,43,226,0.3)]'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{isDropdownTopicActive ? activeTopicLabel : 'Mais'}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        moreTopicsDropdownOpen ? 'rotate-180 text-white' : 'text-white/40'
                      }`}
                    />
                  </button>

                  {moreTopicsDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-[#141414] border border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.95)] backdrop-blur-2xl py-2 z-50 animate-fadeIn max-h-84 overflow-y-auto no-scrollbar">
                      <div className="px-3.5 py-1.5 text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/5 flex items-center justify-between">
                        <span>Todos os Tópicos</span>
                        <span className="text-[#00e5ff]">{ALL_TOPICS.length} EDITORIAS</span>
                      </div>
                      {ALL_TOPICS.map(tItem => {
                        const isSelected = selectedTopic === tItem.id;
                        return (
                          <button
                            key={tItem.id}
                            onClick={() => {
                              onSelectTopic(tItem.id);
                              setMoreTopicsDropdownOpen(false);
                            }}
                            className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#8A2BE2]/30 text-white font-bold border-l-2 border-[#8A2BE2]'
                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{tItem.icon}</span>
                              <span>{t.topics[tItem.id] || tItem.label}</span>
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#8A2BE2]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </nav>

        {/* Right Section: Expandable Search (Lupa) + User Profile + DIRETO (Ahead) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 shrink-0">
          {/* Expandable Search Button / Bar (A Lupa que expande ao clicar) */}
          <div className="relative shrink-0" ref={searchContainerRef}>
            {!searchExpanded && !searchQuery ? (
              <button
                onClick={() => setSearchExpanded(true)}
                title="Buscar notícias e veículos (Ctrl+K ou /)"
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00e5ff]/50 text-white/75 hover:text-[#00e5ff] transition-all cursor-pointer group shrink-0"
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="sr-only">Pesquisar</span>
              </button>
            ) : !searchExpanded && searchQuery ? (
              <button
                onClick={() => setSearchExpanded(true)}
                title={`Filtro de busca ativo: "${searchQuery}" (clique para abrir)`}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#8A2BE2]/25 border border-[#8A2BE2]/60 text-[#00e5ff] hover:bg-[#8A2BE2]/40 transition-all cursor-pointer group shrink-0 shadow-[0_0_12px_rgba(138,43,226,0.3)]"
              >
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs font-mono max-w-[80px] sm:max-w-[110px] truncate">{searchQuery}</span>
                <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse shrink-0" />
              </button>
            ) : (
              <div className="flex items-center w-52 sm:w-64 md:w-80 lg:w-96 transition-all duration-300 animate-fadeIn">
                <SearchBar
                  value={searchQuery}
                  onChange={onSearchChange}
                  articles={articles}
                  onSelectArticle={art => {
                    onSelectArticle(art);
                    setSearchExpanded(false);
                  }}
                  t={t}
                  autoFocus={true}
                  onClose={() => {
                    if (searchQuery) onSearchChange('');
                    setSearchExpanded(false);
                  }}
                />
              </div>
            )}
          </div>

          {/* User Session Profile / Anonymous Toggle */}
          <button
            onClick={onToggleAnonymous}
            title={userProfile?.role === 'guest' ? t.anonymousWarning : 'Perfil Conectado'}
            className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs transition-colors cursor-pointer shrink-0"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden bg-gradient-to-tr from-[#8A2BE2] to-[#00e5ff] p-0.5 shrink-0">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
            </div>
            <span className="hidden lg:inline font-mono text-[11px] whitespace-nowrap">
              {userProfile?.role === 'guest' ? 'Anônimo' : 'Sessão'}
            </span>
          </button>

          {/* EURONEWS-INSPIRED "DIRETO" (AHEAD DA HORA) PILL */}
          <button
            onClick={onToggleAheadOnly}
            title="Filtrar matérias publicadas em fusos adiantados (Ásia / Oceania)"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold font-mono tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              aheadOnly
                ? 'bg-[#ff1744] text-white shadow-[0_0_18px_rgba(255,23,68,0.8)] border border-white/30 animate-pulse'
                : 'bg-[#8A2BE2] hover:bg-[#7b2cbf] text-white shadow-[0_0_12px_rgba(138,43,226,0.4)] hover:shadow-[0_0_20px_rgba(138,43,226,0.7)]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
            <span className="hidden sm:inline">{aheadOnly ? 'DIRETO • AHEAD' : 'DIRETO'}</span>
            <span className="sm:hidden">DIRETO</span>
          </button>

          {/* Admin Shield Icon */}
          <button
            onClick={onOpenAdmin}
            title={t.adminDashboard}
            className="hidden lg:flex p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <Shield className="w-4 h-4 text-[#00e5ff]" />
          </button>
        </div>
      </div>

      {/* 3. EURONEWS SLIDE-OVER DRAWER (Rendered into document.body to sit above all page content) */}
      {drawerOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] flex isolate">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity cursor-pointer"
          />

          {/* Drawer Panel */}
          <div className="relative w-84 max-w-[88vw] h-screen bg-[#121212] border-r border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col z-[100000] animate-slideInLeft overflow-hidden text-white">
            {/* Drawer Header with Close Button */}
            <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#8A2BE2] rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(138,43,226,0.5)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 11a9 9 0 0 1 9 9" />
                    <path d="M4 4a16 16 0 0 1 16 16" />
                    <circle cx="5" cy="19" r="1" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white tracking-tight leading-tight">
                    Capy<span className="text-[#8A2BE2]">News</span>.
                  </span>
                  <TypewriterText className="text-[8px] font-mono tracking-widest text-[#00e5ff] uppercase font-bold" />
                </div>
              </div>

              {/* Close Button X */}
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search input inside drawer */}
            <div className="p-4 border-b border-white/10 md:hidden bg-white/5">
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                articles={articles}
                onSelectArticle={art => {
                  onSelectArticle(art);
                  setDrawerOpen(false);
                }}
                t={t}
              />
            </div>

            {/* Scrollable Drawer Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 no-scrollbar">
              {/* 1 - IDIOMAS */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] font-mono text-white/40 uppercase mb-1.5 px-1 font-bold flex items-center justify-between">
                  <span>1. Idiomas da Edição</span>
                  <span className="text-[9px] text-[#00e5ff]">{currentLang.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => onLanguageChange(lang.code)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        currentLang === lang.code
                          ? 'bg-[#8A2BE2] text-white font-bold'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span>{lang.flag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2 - ÚLTIMAS NOTÍCIAS & CONTINENTE */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-white/40 uppercase px-1 font-bold">
                  2. Notícias Globais
                </div>

                {/* Últimas Notícias Button */}
                <button
                  onClick={() => {
                    onSelectRegion('Global');
                    onSelectTopic('All');
                    onSearchChange('');
                    setDrawerOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isLatestActive
                      ? 'bg-[#8A2BE2]/25 text-white border border-[#8A2BE2]/50 shadow-[0_0_15px_rgba(138,43,226,0.25)]'
                      : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-[#00e5ff]" />
                    <span>Últimas Notícias (Tempo Real)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </button>

                {/* Accordion: CONTINENTES */}
                <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <button
                    onClick={() => setDrawerContinentsExpanded(!drawerContinentsExpanded)}
                    className="w-full p-2.5 text-left text-xs font-bold text-white flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-[#00e5ff]" />
                      <span>Continentes ({CONTINENTS.length})</span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-white/50 transition-transform ${
                        drawerContinentsExpanded ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>

                  {drawerContinentsExpanded && (
                    <div className="px-2 pb-2 space-y-1 border-t border-white/5 pt-1">
                      {CONTINENTS.map(c => {
                        const isSelected = selectedRegion === c.id;
                        const label = c.id === 'Global' ? t.allRegions : (t.regions[c.id] || c.name);
                        return (
                          <button
                            key={c.id}
                            onClick={() => {
                              onSelectRegion(c.id);
                              setDrawerOpen(false);
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#8A2BE2] text-white font-bold'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{c.icon}</span>
                              <span>{label}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 3 - TÓPICOS */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-white/40 uppercase px-1 font-bold">
                  3. Tópicos
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <button
                    onClick={() => setDrawerTopicsExpanded(!drawerTopicsExpanded)}
                    className="w-full p-2.5 text-left text-xs font-bold text-white flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#8A2BE2]" />
                      <span>Tópicos & Assuntos ({ALL_TOPICS.length})</span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-white/50 transition-transform ${
                        drawerTopicsExpanded ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>

                  {drawerTopicsExpanded && (
                    <div className="px-2 pb-2 space-y-1 border-t border-white/5 pt-1 max-h-60 overflow-y-auto no-scrollbar">
                      {ALL_TOPICS.map(topic => {
                        const isSelected = selectedTopic === topic.id;
                        const label = t.topics[topic.id] || topic.label;
                        return (
                          <button
                            key={topic.id}
                            onClick={() => {
                              onSelectTopic(topic.id);
                              setDrawerOpen(false);
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#00e5ff]/20 text-[#00e5ff] font-bold border border-[#00e5ff]/40'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span>{label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#00e5ff]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 4 - RECURSOS E SERVIÇOS */}
              <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 space-y-1.5">
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-1 font-bold">
                  4. Recursos e Serviços
                </div>

                {/* Ahead da Hora toggle */}
                <button
                  onClick={() => {
                    onToggleAheadOnly();
                  }}
                  className={`w-full p-2 rounded-lg text-xs flex items-center justify-between transition-all cursor-pointer ${
                    aheadOnly
                      ? 'bg-[#ff1744] text-white font-bold shadow-[0_0_15px_rgba(255,23,68,0.5)]'
                      : 'bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-white" />
                    <span>Ahead da Hora (Direto)</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${aheadOnly ? 'bg-black/30 text-white' : 'bg-white/10 text-white/60'}`}>
                    {aheadOnly ? 'ATIVO' : 'OFF'}
                  </span>
                </button>

                {/* Weather Radar com Ícone, Radar Clima e Temperatura */}
                <button
                  onClick={() => {
                    onOpenWeather();
                    setDrawerOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl text-xs flex items-center justify-between text-white/90 hover:bg-white/10 hover:text-white transition-colors cursor-pointer bg-white/5 border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <CloudSun className="w-4 h-4 text-[#00e5ff]" />
                    <span className="font-semibold">Radar Clima</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30">
                    {liveTemp !== null ? `${liveTemp > 0 ? '+' : ''}${liveTemp}°C` : '21°C'}
                  </span>
                </button>

                {/* Quem Somos */}
                <button
                  onClick={() => {
                    onOpenAbout?.();
                    setDrawerOpen(false);
                  }}
                  className="w-full p-2 rounded-lg text-xs flex items-center gap-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span>Quem Somos</span>
                </button>

                {/* Manifesto */}
                <button
                  onClick={() => {
                    onOpenManifesto();
                    setDrawerOpen(false);
                  }}
                  className="w-full p-2 rounded-lg text-xs flex items-center gap-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#8A2BE2]" />
                  <span>Doutrina e Manifesto</span>
                </button>

                {/* Admin */}
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setDrawerOpen(false);
                  }}
                  className="w-full p-2 rounded-lg text-xs flex items-center gap-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Painel Administrativo</span>
                </button>
              </div>

              {/* 5 - SERVIÇOS DRAFT STUDIO */}
              <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 overflow-hidden">
                <div className="p-2.5 border-b border-purple-500/20 bg-purple-900/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                      5. Serviços Draft Studio
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/40 font-bold">
                    B2B & TECH
                  </span>
                </div>

                <div className="p-2 space-y-1.5">
                  {/* Botão Principal de Entrada no Hub */}
                  <button
                    onClick={() => {
                      onOpenDraftStudio?.();
                      setDrawerOpen(false);
                    }}
                    className="w-full p-2.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-purple-600/50 via-indigo-600/50 to-purple-600/50 hover:from-purple-600/70 hover:to-indigo-600/70 border border-purple-500/40 flex items-center justify-between transition-all cursor-pointer shadow-[0_0_15px_rgba(138,43,226,0.2)]"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                      <span>Hub Institucional & Serviços</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-purple-300" />
                  </button>

                  {/* Verticais Estratégicas (#tech, #media, #invest) */}
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => {
                        onOpenDraftStudio?.('tech');
                        setDrawerOpen(false);
                      }}
                      className="p-1.5 rounded-lg text-[10px] font-mono text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 flex flex-col items-center gap-1 transition-colors cursor-pointer text-center"
                      title="Code & Data Solutions"
                    >
                      <Database className="w-3 h-3 text-purple-400" />
                      <span className="truncate w-full font-bold">#tech</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenDraftStudio?.('media');
                        setDrawerOpen(false);
                      }}
                      className="p-1.5 rounded-lg text-[10px] font-mono text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 flex flex-col items-center gap-1 transition-colors cursor-pointer text-center"
                      title="Media Draft Audiovisual"
                    >
                      <Camera className="w-3 h-3 text-cyan-400" />
                      <span className="truncate w-full font-bold">#media</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenDraftStudio?.('contact');
                        setDrawerOpen(false);
                      }}
                      className="p-1.5 rounded-lg text-[10px] font-mono text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 flex flex-col items-center gap-1 transition-colors cursor-pointer text-center"
                      title="Strategic Partnerships & Services"
                    >
                      <Building2 className="w-3 h-3 text-purple-400" />
                      <span className="truncate w-full font-bold">#contact</span>
                    </button>
                  </div>

                  {/* Ferramentas do Ecossistema Capy */}
                  <div className="pt-1.5 pb-0.5 px-1 border-t border-purple-500/20">
                    <div className="text-[9px] font-mono text-purple-300/70 uppercase tracking-wider">
                      Ferramentas de Desconstrução de Viés
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    {[
                      { name: 'CapyScan (Análise Léxica & Framing)', badge: 'SCAN', section: 'tech' },
                      { name: 'CapyMatrix (Consenso Factual vs. Exclusiva)', badge: 'OSINT', section: 'tech' },
                      { name: 'CapyTimeline (Histórico Retroativo)', badge: 'HIST', section: 'tech' },
                      { name: 'Ahead da Hora (Fuso Relativo)', badge: 'UTC', section: 'tech' },
                      { name: 'Premium / Community Notes', badge: 'PRO', section: 'contact' },
                    ].map(tool => (
                      <button
                        key={tool.name}
                        onClick={() => {
                          onOpenDraftStudio?.(tool.section);
                          setDrawerOpen(false);
                        }}
                        className="w-full px-2 py-1 rounded text-[10.5px] text-zinc-300 hover:text-white hover:bg-white/10 flex items-center justify-between transition-colors cursor-pointer text-left"
                      >
                        <span className="truncate">{tool.name}</span>
                        <span className="text-[8.5px] font-mono px-1 rounded bg-black/50 text-purple-300 border border-purple-500/30 shrink-0 ml-1">
                          {tool.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-white/10 bg-black/60 text-[11px] font-mono text-white/40 flex items-center justify-between shrink-0">
              <span>CapyNews OSINT</span>
              <button
                onClick={() => {
                  onOpenDraftStudio?.();
                  setDrawerOpen(false);
                }}
                className="text-[#8A2BE2] hover:text-white transition-colors cursor-pointer"
              >
                Draft Creative Studio &rarr;
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
