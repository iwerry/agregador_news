import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Head } from './components/Head.tsx';
import { BackgroundEffect } from './components/BackgroundEffect.tsx';
import { SplashScreen } from './components/SplashScreen.tsx';
import { Navbar } from './components/Navbar.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { NewsCard } from './components/NewsCard.tsx';
import { WeatherWidget } from './components/WeatherWidget.tsx';
import { CapyScanModal } from './components/CapyScanModal.tsx';
import { CapyMatrixModal } from './components/CapyMatrixModal.tsx';
import { ManifestoModal } from './components/ManifestoModal.tsx';
import { AboutModal } from './components/AboutModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { DraftStudio } from './components/DraftStudio.tsx';
import { Footer } from './components/Footer.tsx';
import { translations } from './i18n/translations.ts';
import { Article, Language, UserProfile } from './types.ts';
import { Sparkles, Compass, AlertCircle, RefreshCw } from 'lucide-react';

export function App() {
  const [splashFinished, setSplashFinished] = useState(false);
  const [lang, setLang] = useState<Language>('pt');
  const t = translations[lang] || translations.pt;

  // Data states
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User Profile / Telemetry
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Global');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [aheadOnly, setAheadOnly] = useState(false);

  // Modals
  const [weatherOpen, setWeatherOpen] = useState(false);
  const [manifestoOpen, setManifestoOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [activeCapyScanArticle, setActiveCapyScanArticle] = useState<Article | null>(null);
  const [activeCapyMatrixArticle, setActiveCapyMatrixArticle] = useState<Article | null>(null);
  const [draftStudioState, setDraftStudioState] = useState<{
    isOpen: boolean;
    targetSection?: string;
  }>({ isOpen: false });

  const handleOpenDraftStudio = useCallback((targetSection?: string) => {
    setDraftStudioState({ isOpen: true, targetSection });
  }, []);

  // Sync hash routing for #draft-studio, #tech, #media, #invest
  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash === '#draft-studio' || hash === '#tech' || hash === '#media' || hash === '#invest') {
        const target = hash === '#draft-studio' ? undefined : hash.replace('#', '');
        setDraftStudioState({ isOpen: true, targetSection: target });
      }
    };
    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  // Initialize User Profile Telemetry & Cookie (Draft protocol)
  useEffect(() => {
    // Collect non-invasive device data
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
    const userAgent = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);

    // Invisible cookie extraction or creation
    let visitorId = '';
    try {
      const match = document.cookie.match(/(^|;\s*)capy_uid=([^;]*)/);
      if (match && match[2]) {
        visitorId = decodeURIComponent(match[2]);
      } else {
        visitorId = 'guest_' + Math.random().toString(36).substring(2, 9);
        const exp = new Date();
        exp.setTime(exp.getTime() + 365 * 24 * 60 * 60 * 1000);
        document.cookie = `capy_uid=${encodeURIComponent(visitorId)};expires=${exp.toUTCString()};path=/;SameSite=Lax`;
      }
    } catch {
      visitorId = 'guest_' + Math.random().toString(36).substring(2, 9);
    }

    const initialProfile: UserProfile = {
      id: visitorId,
      username: 'Operador Anônimo',
      email: 'anonimo@capynews.org',
      role: 'guest',
      tier: 'Free',
      location: {
        country: 'Brasil',
        city: 'Brasília',
        timezone: tz,
        isUtcNegative: true
      },
      preferredTopics: ['Tech & AI', 'Business & Finance'],
      readCount: 0,
      status: 'active',
      lastActive: new Date().toISOString(),
      device: isMobile ? 'mobile' : 'desktop'
    };

    setUserProfile(initialProfile);

    // Save profile telemetry to server (feeds data_users.json & data_user.json)
    fetch('/api/users/save-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(initialProfile)
    }).catch(() => {
      // Non-blocking telemetry
    });
  }, []);

  // Silent click telemetry tracking
  const handleArticleClick = useCallback((article: Article) => {
    setUserProfile(prev => {
      if (!prev) return prev;
      const topics = prev.preferredTopics.includes(article.topic)
        ? prev.preferredTopics
        : [article.topic, ...prev.preferredTopics.slice(0, 4)];
      return {
        ...prev,
        readCount: (prev.readCount || 0) + 1,
        preferredTopics: topics
      };
    });

    fetch('/api/users/save-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: userProfile?.id || 'guest_reader',
        country: userProfile?.location?.country || 'Brasil',
        region: userProfile?.location?.city || 'Distrito Federal',
        timezone: userProfile?.location?.timezone || 'America/Sao_Paulo',
        device: userProfile?.device || 'desktop',
        preferredTopics: [article.topic],
        articleTitle: article.title,
        source: article.source
      })
    }).catch(() => {});
  }, [userProfile]);

  // Fetch articles from API
  const fetchArticles = useCallback(() => {
    setLoading(true);
    setError(null);

    const tz = userProfile?.location?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
    const params = new URLSearchParams();
    if (selectedRegion && selectedRegion !== 'Global') params.append('region', selectedRegion);
    if (selectedTopic && selectedTopic !== 'All') params.append('topic', selectedTopic);
    params.append('timezone', tz);
    params.append('isAnonymous', isAnonymous ? 'true' : 'false');

    fetch(`/api/articles?${params.toString()}`)
      .then(r => {
        if (!r.ok) throw new Error('Falha ao comunicar com o servidor');
        return r.json();
      })
      .then(data => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Articles fetch error:', err);
        setError('Não foi possível carregar os artigos. Verifique a conexão com o servidor.');
        setLoading(false);
      });
  }, [selectedRegion, selectedTopic, userProfile, isAnonymous]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Filter articles based on client-side search query and aheadOnly flag
  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      // Ahead da hora filter
      if (aheadOnly && !a.aheadDaHora) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const title = (a.title || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const summary = (a.summary || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const source = (a.source || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const topic = (a.topic || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        return title.includes(q) || summary.includes(q) || source.includes(q) || topic.includes(q);
      }

      return true;
    });
  }, [articles, aheadOnly, searchQuery]);

  // Toggle anonymous mode (which suppresses Ahead da Hora as required)
  const toggleAnonymousMode = () => {
    const nextVal = !isAnonymous;
    setIsAnonymous(nextVal);
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        role: nextVal ? 'guest' : 'reader'
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0e0e12] text-neutral-100 font-sans selection:bg-purple-600 selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Dynamic Head SEO & Title */}
      <Head t={t} selectedRegion={selectedRegion} selectedTopic={selectedTopic} />

      {/* Cyber Ambient Animated Background */}
      <BackgroundEffect />

      {/* Splash Screen on Initial Visit */}
      {!splashFinished && <SplashScreen onComplete={() => setSplashFinished(true)} />}

      {/* Sticky Main Navigation */}
      <Navbar
        currentLang={lang}
        onLanguageChange={setLang}
        t={t}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        articles={articles}
        onSelectArticle={art => {
          setActiveCapyScanArticle(art);
        }}
        onOpenWeather={() => setWeatherOpen(true)}
        onOpenManifesto={() => setManifestoOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenDraftStudio={handleOpenDraftStudio}
        userProfile={userProfile}
        onToggleAnonymous={toggleAnonymousMode}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        selectedTopic={selectedTopic}
        onSelectTopic={setSelectedTopic}
        aheadOnly={aheadOnly}
        onToggleAheadOnly={() => setAheadOnly(!aheadOnly)}
        totalCount={filteredArticles.length}
      />

      {/* Main App Content Viewport */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Global Anonymous Notice Banner (if active) */}
        {isAnonymous && (
          <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-white/60 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff]" />
              <span>{t.anonymousWarning} As etiquetas "Ahead da Hora" estão ocultas.</span>
            </div>
            <button
              onClick={toggleAnonymousMode}
              className="text-[#8A2BE2] hover:text-[#00e5ff] underline cursor-pointer font-bold"
            >
              Ativar Localização
            </button>
          </div>
        )}

        {/* Hero Header Minimalist */}
        <div className="py-6 border-b border-white/10 mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#8A2BE2]/30 text-[#00e5ff] border border-white/10 tracking-wider">
                AGREGADOR GLOBAL DE NOTÍCIAS
              </span>
              <span className="text-xs font-mono text-white/30">•</span>
              <span className="text-xs font-mono text-white/60 tracking-wider">FEEDS RSS EM TEMPO REAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.tagline}
            </h1>
          </div>

          <div className="text-xs font-mono text-white/40 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>339 FEEDS CONECTADOS • LATÊNCIA 12ms</span>
          </div>
        </div>

        {/* Filter Bar Component */}
        <FilterBar
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
          aheadOnly={aheadOnly}
          onToggleAheadOnly={() => setAheadOnly(!aheadOnly)}
          t={t}
          totalCount={filteredArticles.length}
        />

        {/* News Grid / Loading / Error States */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
            <p className="text-xs font-mono text-neutral-400">
              Cruzando telemetria de horários e analisando matrizes léxicas...
            </p>
          </div>
        ) : error ? (
          <div className="my-12 p-8 rounded-2xl bg-red-950/20 border border-red-900/40 text-center max-w-lg mx-auto space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <p className="text-sm font-mono text-red-200">{error}</p>
            <button
              onClick={fetchArticles}
              className="px-4 py-2 rounded-xl bg-red-900/40 hover:bg-red-800/60 text-white text-xs font-mono font-bold transition-all cursor-pointer"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="my-16 p-10 rounded-2xl bg-[#14141c] border border-neutral-800 text-center max-w-md mx-auto space-y-3">
            <Compass className="w-10 h-10 text-purple-400 mx-auto" />
            <h3 className="text-base font-bold text-white font-['Poppins']">{t.noResults}</h3>
            <p className="text-xs text-neutral-400">
              Tente redefinir os filtros de região, tópico ou a busca digitada.
            </p>
            <button
              onClick={() => {
                setSelectedRegion('Global');
                setSelectedTopic('All');
                setAheadOnly(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-purple-900/40 text-purple-300 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer border border-purple-700/40"
            >
              Limpar Todos os Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredArticles.map(article => (
              <NewsCard
                key={article.id}
                article={article}
                t={t}
                onOpenCapyScan={art => setActiveCapyScanArticle(art)}
                isAnonymousUser={isAnonymous}
                onArticleClick={handleArticleClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Global Meteorological Radar Modal */}
      <WeatherWidget
        isOpen={weatherOpen}
        onClose={() => setWeatherOpen(false)}
        t={t}
      />

      {/* CapyScan Speedometer Modal */}
      <CapyScanModal
        article={activeCapyScanArticle}
        isOpen={!!activeCapyScanArticle}
        onClose={() => setActiveCapyScanArticle(null)}
        onOpenCapyMatrix={art => {
          setActiveCapyScanArticle(null);
          setActiveCapyMatrixArticle(art);
        }}
        t={t}
      />

      {/* CapyMatrix Comparative Modal */}
      <CapyMatrixModal
        article={activeCapyMatrixArticle}
        isOpen={!!activeCapyMatrixArticle}
        onClose={() => setActiveCapyMatrixArticle(null)}
        t={t}
      />

      {/* Manifesto & Doutrina Modal */}
      <ManifestoModal
        isOpen={manifestoOpen}
        onClose={() => setManifestoOpen(false)}
        t={t}
      />

      {/* Quem Somos Modal */}
      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        onOpenManifesto={() => setManifestoOpen(true)}
        t={t}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        t={t}
        onRefreshArticles={fetchArticles}
      />

      {/* Draft Creative Studio Hub (Internal Page & Services Hub) */}
      <DraftStudio
        isOpen={draftStudioState.isOpen}
        onClose={() => setDraftStudioState({ isOpen: false })}
        targetSection={draftStudioState.targetSection}
        t={t}
      />

      {/* Footer */}
      <Footer
        t={t}
        onOpenManifesto={() => setManifestoOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenWeather={() => setWeatherOpen(true)}
        onSelectRegion={reg => setSelectedRegion(reg)}
        onSelectTopic={top => setSelectedTopic(top)}
        onOpenDraftStudio={handleOpenDraftStudio}
      />
    </div>
  );
}

export default App;
