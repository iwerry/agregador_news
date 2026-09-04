import React from 'react';
import { X, Activity, Layers, AlertTriangle, ShieldCheck, Sparkles, Compass, ExternalLink } from 'lucide-react';
import { Article } from '../types.ts';
import { TranslationDict } from '../i18n/translations.ts';
import { getCleanSourceName, getCleanArticleUrl } from '../utils/sourceHelper.ts';

interface CapyScanModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCapyMatrix: (article: Article) => void;
  t: TranslationDict;
}

export const CapyScanModal: React.FC<CapyScanModalProps> = ({
  article,
  isOpen,
  onClose,
  onOpenCapyMatrix,
  t
}) => {
  if (!isOpen || !article) return null;

  // Bias score is between -100 (left) and +100 (right)
  const score = article.biasScore || 0;

  // Map -100..+100 to needle angle: -75 deg (far left/blue) to +75 deg (far right/red)
  const needleRotation = Math.round((score / 100) * 75);

  const getVerdict = (val: number) => {
    if (val < -30) return { label: 'Enquadramento Multilateral / Progressista', color: 'text-cyan-400', badgeBg: 'bg-cyan-950/60 border-cyan-800/60' };
    if (val < -10) return { label: 'Tendência Levemente Multilateral', color: 'text-cyan-300', badgeBg: 'bg-cyan-950/40 border-cyan-800/40' };
    if (val > 30) return { label: 'Enquadramento Nacionalista / Soberanista', color: 'text-red-400', badgeBg: 'bg-red-950/60 border-red-800/60' };
    if (val > 10) return { label: 'Tendência Levemente Nacionalista', color: 'text-rose-300', badgeBg: 'bg-rose-950/40 border-rose-800/40' };
    return { label: 'Zona Neutra / Consenso Noticioso Factual', color: 'text-emerald-400', badgeBg: 'bg-emerald-950/60 border-emerald-800/60' };
  };

  const verdict = getVerdict(score);
  const cleanSourceName = getCleanSourceName(article.source);
  const cleanArticleUrl = getCleanArticleUrl(article.sourceUrl, article.source, article.title, article.originalTitle);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#131318] border border-purple-500/40 rounded-3xl shadow-[0_0_60px_rgba(138,43,226,0.35)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#181822]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white font-['Poppins']">
                  CapyScan <span className="font-light text-purple-400">// Bússola de Enquadramento</span>
                </h3>
              </div>
              <p className="text-xs text-neutral-400">Análise de densidade vetorial e matrizes léxicas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Article snippet */}
          <div className="p-3.5 rounded-xl bg-[#181820] border border-neutral-800">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{cleanSourceName}</span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400">{article.region}</span>
              </div>
              <a
                href={cleanArticleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-white/70 hover:text-[#00e5ff] transition-colors"
                title={`Abrir matéria original em ${cleanSourceName} (Nova aba)`}
              >
                <span>Ir para a matéria</span>
                <ExternalLink className="w-3 h-3 text-[#00e5ff]" />
              </a>
            </div>
            <a
              href={cleanArticleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/title block"
              title={`Abrir matéria original em ${cleanSourceName} (Nova aba)`}
            >
              <h4 className="text-sm font-bold text-neutral-100 group-hover/title:text-[#00e5ff] font-['Poppins'] line-clamp-2 transition-colors cursor-pointer flex items-baseline gap-1.5">
                <span>{article.title}</span>
              </h4>
            </a>
          </div>

          {/* High-Tech Animated Speedometer Gauge */}
          <div className="relative flex flex-col items-center justify-center py-4 bg-[#0e0e13] rounded-2xl border border-neutral-800/80 p-6 overflow-hidden">
            {/* SVG Speedometer Semi-circle */}
            <div className="relative w-72 sm:w-80 h-40">
              <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
                <defs>
                  {/* Gauge Arc Gradient: Cyan to Gray to Red */}
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00E5FF" />
                    <stop offset="25%" stopColor="#00B4D8" />
                    <stop offset="50%" stopColor="#64748B" />
                    <stop offset="75%" stopColor="#F43F5E" />
                    <stop offset="100%" stopColor="#FF1744" />
                  </linearGradient>

                  <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#A855F7" />
                  </filter>
                </defs>

                {/* Background track */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#262630"
                  strokeWidth="14"
                  strokeLinecap="round"
                />

                {/* Colored Active Gradient Track */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  opacity="0.85"
                />

                {/* Center markers */}
                <line x1="100" y1="18" x2="100" y2="28" stroke="#94A3B8" strokeWidth="2" strokeDasharray="1 2" />
                <line x1="40" y1="45" x2="47" y2="52" stroke="#00E5FF" strokeWidth="1.5" />
                <line x1="160" y1="45" x2="153" y2="52" stroke="#FF1744" strokeWidth="1.5" />

                {/* Needle Pivot & Needle Arm */}
                <g
                  transform={`rotate(${needleRotation}, 100, 100)`}
                  style={{ transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  {/* Needle Pointer */}
                  <polygon
                    points="97,100 100,22 103,100"
                    fill="#C084FC"
                    filter="url(#needleGlow)"
                  />
                  <line x1="100" y1="100" x2="100" y2="20" stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* Needle Pivot Cap */}
                  <circle cx="100" cy="100" r="8" fill="#1E1B4B" stroke="#A855F7" strokeWidth="3" />
                  <circle cx="100" cy="100" r="3" fill="#00E5FF" />
                </g>
              </svg>

              {/* Gauge Scale Labels */}
              <div className="absolute -bottom-1 left-2 text-[10px] font-mono text-cyan-400 font-bold">
                -100 (AZUL)
              </div>
              <div className="absolute -bottom-1 right-2 text-[10px] font-mono text-red-400 font-bold">
                +100 (VERMELHO)
              </div>
              <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-mono text-neutral-400">
                0 (CENTRO FACTUAL)
              </div>
            </div>

            {/* Score & Dynamic Classification */}
            <div className="mt-4 text-center">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border ${verdict.badgeBg} ${verdict.color}`}>
                <Activity className="w-3.5 h-3.5" />
                <span>{verdict.label}</span>
                <span className="px-1.5 py-0.2 rounded bg-black/50 text-white text-[11px]">
                  {score > 0 ? `+${score}` : score}
                </span>
              </div>
            </div>
          </div>

          {/* Lexical Markers Section */}
          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              {t.detectedTerms} (Matriz /data/dicionario_lexico.json)
            </h5>
            <div className="flex flex-wrap gap-2">
              {article.detectedKeywords && article.detectedKeywords.length > 0 ? (
                article.detectedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-purple-950/40 text-purple-300 border border-purple-800/50 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>"{kw}"</span>
                  </span>
                ))
              ) : (
                <span className="text-xs font-mono text-neutral-500 italic">
                  Nenhum marcador extremista identificado no resumo. Texto próximo da neutralidade objetiva.
                </span>
              )}
            </div>
          </div>

          {/* Scientific Disclaimer from Manifesto */}
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 leading-relaxed font-sans">
            <span className="text-white font-bold">Autonomia Analítica:</span> O CapyScan não atua como "Árbitro da Verdade" acusando o jornal de mentir. O algoritmo apenas mede matematicamente a similaridade de cosseno e o léxico geopolítico empregado pelo veículo para devolver a você a soberania cognitiva.
          </div>

          {/* Inconsistency Stamp if flagged */}
          {article.hasInconsistencyStamp && article.inconsistencyDetails && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/70 text-red-200 text-xs space-y-1 font-mono">
              <div className="flex items-center gap-2 font-bold text-red-300">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                {article.inconsistencyDetails.historicalWarning}
              </div>
              <p className="text-neutral-300 text-[11px] pt-1">
                Auditoria: {article.inconsistencyDetails.agency} em {article.inconsistencyDetails.date}
              </p>
              <p className="text-neutral-400 text-[11px]">
                Veredito: {article.inconsistencyDetails.verdict}
              </p>
            </div>
          )}

          {/* Actions: Open CapyMatrix & Open Original Article */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={cleanArticleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-4 rounded-xl bg-[#1a1a24] hover:bg-[#232332] text-white/90 hover:text-white border border-white/10 hover:border-[#00e5ff]/50 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer group"
              title={`Ler matéria completa em ${cleanSourceName} (Nova aba)`}
            >
              <span>Ir para a matéria na fonte</span>
              <ExternalLink className="w-4 h-4 text-[#00e5ff] group-hover:translate-x-0.5 transition-transform" />
            </a>

            <button
              onClick={() => {
                onOpenCapyMatrix(article);
              }}
              className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(138,43,226,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Layers className="w-4 h-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
              <span>{t.capyMatrixBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
