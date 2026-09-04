import React, { useState, useEffect } from 'react';
import {
  Shield, X, RefreshCw, Users, Database, Globe2, AlertCircle,
  CheckCircle2, Lock, LogOut, Radio, Sparkles, TrendingUp, Filter
} from 'lucide-react';
import { Article, UserProfile, DemandGap } from '../types.ts';
import { TranslationDict } from '../i18n/translations.ts';
import { TypewriterText } from './TypewriterText.tsx';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDict;
  onRefreshArticles: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  t,
  onRefreshArticles
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'liveFeeds' | 'demandGaps'>('users');
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [fetchingRss, setFetchingRss] = useState(false);
  const [fetchNotification, setFetchNotification] = useState<string | null>(null);

  // Fetch admin data
  const loadAdminData = () => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => setUsersList(data))
      .catch(console.error);

    fetch('/api/analytics')
      .then(r => r.json())
      .then(data => setAnalytics(data))
      .catch(console.error);

    fetch('/api/articles?isAnonymous=false')
      .then(r => r.json())
      .then(data => setArticlesList(data.articles || []))
      .catch(console.error);
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAdminData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(r => {
        if (!r.ok) throw new Error('Credenciais inválidas');
        return r.json();
      })
      .then(() => {
        setIsAuthenticated(true);
        loadAdminData();
      })
      .catch(() => {
        setLoginError('Acesso negado. Utilize usuário admin e senha admin123');
      });
  };

  // Handle Force Fetch All
  const handleForceFetchAll = () => {
    setFetchingRss(true);
    setFetchNotification(null);
    fetch('/api/feeds/fetch-all', { method: 'POST' })
      .then(r => r.json())
      .then(res => {
        setFetchingRss(false);
        setFetchNotification(`Varredura concluída! ${res.addedCount} novos artigos indexados.`);
        loadAdminData();
        onRefreshArticles();
        setTimeout(() => setFetchNotification(null), 5000);
      })
      .catch(err => {
        setFetchingRss(false);
        setFetchNotification('Erro ao disparar varredura de feeds.');
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#121217] border border-purple-600/40 rounded-3xl shadow-[0_0_80px_rgba(138,43,226,0.3)] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#161622]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-cyan-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white font-['Poppins']">
                  CapyNews <span className="font-light text-purple-400">// Painel do Administrador</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                  SECURE OSINT OPS
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Gerenciamento de base JSON/SQLite, monitor de fluxo e telemetria de público
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.logout}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content View: Login Gate or Admin Operations */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md p-8 rounded-2xl bg-[#171722] border border-neutral-800 shadow-2xl space-y-6 text-center">
              {/* Brand Header with Typewriter Effect */}
              <div className="flex flex-col items-center gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-[#8A2BE2] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(138,43,226,0.6)]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 11a9 9 0 0 1 9 9" />
                      <path d="M4 4a16 16 0 0 1 16 16" />
                      <circle cx="5" cy="19" r="1" />
                      <path d="M12 4c2 0 4 2 4 4s-2 4-4 4-4-2-4-4 2-4 4-4z" opacity="0.5" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-white font-['Poppins']">
                    Capy<span className="text-[#8A2BE2]">News</span>
                    <span className="text-[#00e5ff] text-2xl font-black">.</span>
                  </span>
                </div>
                <TypewriterText className="text-[10px] font-mono tracking-widest text-[#00e5ff] uppercase font-bold" />
              </div>

              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(138,43,226,0.4)]">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white font-['Poppins']">Acesso Restrito ao Núcleo</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Insira as credenciais de segurança para administrar o CapyNews
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-mono text-neutral-300 block mb-1">USUÁRIO OU EMAIL</label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    placeholder="admin"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-neutral-700 text-sm text-white focus:border-purple-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-300 block mb-1">SENHA</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-neutral-700 text-sm text-white focus:border-purple-500 outline-none font-mono"
                  />
                  <div className="text-[11px] font-mono text-neutral-500 mt-1">
                    Dica rápida: usuário <span className="text-purple-400">admin</span> / senha <span className="text-purple-400">admin123</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-lg cursor-pointer"
                >
                  Autenticar Operador
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Action Bar with Metric Badges & Force Fetch All */}
            <div className="px-6 py-3.5 border-b border-neutral-800/80 bg-[#15151e] flex flex-wrap items-center justify-between gap-4">
              {/* Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-purple-900/60 text-white border border-purple-500/60'
                      : 'text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 inline mr-1.5" />
                  Usuários ({usersList.length})
                </button>

                <button
                  onClick={() => setActiveTab('demandGaps')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                    activeTab === 'demandGaps'
                      ? 'bg-purple-900/60 text-white border border-purple-500/60'
                      : 'text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  <Globe2 className="w-3.5 h-3.5 inline mr-1.5 text-cyan-400" />
                  Cruzamento Geográfico
                </button>

                <button
                  onClick={() => setActiveTab('liveFeeds')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                    activeTab === 'liveFeeds'
                      ? 'bg-purple-900/60 text-white border border-purple-500/60'
                      : 'text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 inline mr-1.5 text-emerald-400" />
                  Fluxo ao Vivo ({articlesList.length})
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                    activeTab === 'analytics'
                      ? 'bg-purple-900/60 text-white border border-purple-500/60'
                      : 'text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 inline mr-1.5 text-yellow-400" />
                  Telemetria Geral
                </button>
              </div>

              {/* Force Fetch Button */}
              <div className="flex items-center gap-3">
                {fetchNotification && (
                  <span className="text-xs font-mono text-cyan-400 animate-fadeIn">
                    {fetchNotification}
                  </span>
                )}
                <button
                  onClick={handleForceFetchAll}
                  disabled={fetchingRss}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${fetchingRss ? 'animate-spin' : ''}`} />
                  <span>{fetchingRss ? 'EXECUTANDO VARREDURA...' : 'FORCE FETCH ALL'}</span>
                </button>
              </div>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              {/* TAB 1: USERS MANAGEMENT */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white font-['Poppins']">Gerenciamento de Contas (/data/users.json)</h4>
                      <p className="text-xs text-neutral-400">Controle de papéis, permissões de curadoria OSINT e status</p>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">
                      Armazenamento: JSON & SQLite síncronos
                    </span>
                  </div>

                  <div className="rounded-2xl border border-neutral-800 bg-[#16161d] overflow-hidden">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-[#1b1b26] text-neutral-400 border-b border-neutral-800">
                        <tr>
                          <th className="p-3.5">OPERADOR</th>
                          <th className="p-3.5">FUNÇÃO / TIER</th>
                          <th className="p-3.5">LOCALIZAÇÃO</th>
                          <th className="p-3.5">DISPOSITIVO</th>
                          <th className="p-3.5 text-center">LEITURAS</th>
                          <th className="p-3.5 text-center">NOTAS OSINT</th>
                          <th className="p-3.5">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/80">
                        {usersList.map(u => (
                          <tr key={u.id} className="hover:bg-[#1f1f2c] transition-colors">
                            <td className="p-3.5">
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                {u.username}
                                {u.verified && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" title="Verificado" />
                                )}
                              </div>
                              <div className="text-[10px] text-neutral-500">{u.email}</div>
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  u.tier === 'Premium'
                                    ? 'bg-purple-950 text-purple-300 border border-purple-700/60'
                                    : 'bg-neutral-800 text-neutral-300'
                                }`}
                              >
                                {u.tier} ({u.role})
                              </span>
                            </td>
                            <td className="p-3.5 text-neutral-300">
                              {u.location?.country} • {u.location?.city}
                            </td>
                            <td className="p-3.5 uppercase text-neutral-400">
                              {u.device}
                            </td>
                            <td className="p-3.5 text-center font-bold text-purple-300">
                              {u.readCount || 0}
                            </td>
                            <td className="p-3.5 text-center text-cyan-400 font-bold">
                              {u.communityNotesCount || 0}
                            </td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                Ativo
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: GEOLOCATION CROSS-REFERENCING (Demand Gaps) */}
              {activeTab === 'demandGaps' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-[#181824] border border-cyan-500/30">
                    <h4 className="text-base font-bold text-white font-['Poppins'] flex items-center gap-2">
                      <Globe2 className="w-5 h-5 text-cyan-400" />
                      Cruzamento de Localização vs. Cobertura Editorial
                    </h4>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                      O sistema monitora a origem dos leitores e compara com o catálogo de jornais de cada país. Caso haja demanda crescente em regiões com poucas fontes nativas (ex: México ou Colômbia), o algoritmo sugere novas fontes para ingestão imediata.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {analytics?.regionalDemandGaps?.map((gap: DemandGap, idx: number) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#16161f] border border-neutral-800 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-white font-['Poppins']">
                              {gap.country}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/60 text-red-300 border border-red-800">
                              GAP {gap.gapScore.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-neutral-400 mb-3">
                            <span className="text-purple-300 font-bold">{gap.userCount} leitores</span> ativos • Apenas {gap.activeSources} fonte cadastrada
                          </div>
                          <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                            {gap.notes}
                          </p>
                          <div className="space-y-1">
                            <div className="text-[10px] font-mono text-neutral-400">FONTES RECOMENDADAS:</div>
                            <div className="flex flex-wrap gap-1.5">
                              {gap.recommendedSources.map((s, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/40 text-cyan-300 border border-purple-800/40"
                                >
                                  + {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => alert(`Solicitação enviada para incluir fontes de ${gap.country} no catálogo.`)}
                          className="mt-4 w-full py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/50 text-xs font-mono text-purple-200 transition-colors cursor-pointer"
                        >
                          Programar Varredura em {gap.country}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: LIVE FEED MONITOR */}
              {activeTab === 'liveFeeds' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white font-['Poppins']">Matérias Entrando no Agregador em Tempo Real</h4>
                      <p className="text-xs text-neutral-400">Total de {articlesList.length} fatos cadastrados no banco</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {articlesList.map(a => (
                      <div
                        key={a.id}
                        className="p-3.5 rounded-xl bg-[#16161d] border border-neutral-800 flex items-center justify-between gap-4 hover:border-purple-600/40 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 mb-1">
                            <span className="text-cyan-400 font-bold">{a.source}</span>
                            <span>•</span>
                            <span>{a.region}</span>
                            <span>•</span>
                            <span className="text-purple-300">{a.topic}</span>
                            {a.aheadDaHora && (
                              <span className="px-1.5 py-0.2 rounded bg-purple-900 text-purple-200 font-bold text-[9px]">
                                AHEAD
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-neutral-100 line-clamp-1">
                            {a.title}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 font-mono text-xs">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              a.biasScore < -20
                                ? 'text-cyan-400 bg-cyan-950'
                                : a.biasScore > 20
                                ? 'text-rose-400 bg-rose-950'
                                : 'text-emerald-400 bg-emerald-950'
                            }`}
                          >
                            VIÉS: {a.biasScore > 0 ? `+${a.biasScore}` : a.biasScore}
                          </span>
                          <span className="text-[11px] text-neutral-400 hidden sm:inline">
                            {new Date(a.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: GENERAL TELEMETRY */}
              {activeTab === 'analytics' && analytics && (
                <div className="space-y-6">
                  {/* Key Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-[#16161f] border border-neutral-800">
                      <div className="text-[10px] font-mono text-neutral-400">SESSÕES RASTREADAS</div>
                      <div className="text-2xl font-black text-white font-['Poppins'] mt-1">
                        {analytics.totalSessions}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#16161f] border border-neutral-800">
                      <div className="text-[10px] font-mono text-neutral-400">CONTAS REGISTRADAS</div>
                      <div className="text-2xl font-black text-purple-400 font-['Poppins'] mt-1">
                        {analytics.totalRegisteredUsers}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#16161f] border border-neutral-800">
                      <div className="text-[10px] font-mono text-neutral-400">ARTIGOS INDEXADOS</div>
                      <div className="text-2xl font-black text-cyan-400 font-['Poppins'] mt-1">
                        {analytics.totalArticlesIndexed}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#16161f] border border-neutral-800">
                      <div className="text-[10px] font-mono text-neutral-400">DISPOSITIVOS (DESKTOP/MOB)</div>
                      <div className="text-sm font-mono text-emerald-400 font-bold mt-2">
                        {analytics.deviceDistribution?.desktop || 0} Desk / {analytics.deviceDistribution?.mobile || 0} Mob
                      </div>
                    </div>
                  </div>

                  {/* Topic Interests Breakdown */}
                  <div className="p-5 rounded-2xl bg-[#16161d] border border-neutral-800">
                    <h5 className="text-xs font-mono uppercase text-neutral-400 mb-3">
                      Distribuição de Interesses por Tópico
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                      {Object.entries(analytics.topicInterests || {}).map(([topic, count]) => (
                        <div key={topic} className="p-2 rounded-lg bg-[#111116] border border-neutral-800 flex justify-between">
                          <span className="text-neutral-300">{topic}</span>
                          <span className="text-cyan-400 font-bold">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
