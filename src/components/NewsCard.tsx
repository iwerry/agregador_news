import React from 'react';
import { Clock, ExternalLink, Activity, AlertTriangle, Sparkles } from 'lucide-react';
import { Article } from '../types.ts';
import { TranslationDict } from '../i18n/translations.ts';
import { AbstractPlaceholder } from './AbstractPlaceholder.tsx';
import { getCleanSourceName, getCleanArticleUrl } from '../utils/sourceHelper.ts';

interface NewsCardProps {
  article: Article;
  t: TranslationDict;
  onOpenCapyScan: (article: Article) => void;
  isAnonymousUser?: boolean;
  onArticleClick?: (article: Article) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  t,
  onOpenCapyScan,
  isAnonymousUser = false,
  onArticleClick
}) => {
  // Format date
  const formattedDate = React.useMemo(() => {
    try {
      const d = new Date(article.publishedAt);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(d);
    } catch {
      return article.publishedAt;
    }
  }, [article.publishedAt]);

  const cleanSourceName = React.useMemo(() => {
    return getCleanSourceName(article.source);
  }, [article.source]);

  const cleanArticleUrl = React.useMemo(() => {
    return getCleanArticleUrl(article.sourceUrl, article.source, article.title, article.originalTitle);
  }, [article.sourceUrl, article.source, article.title, article.originalTitle]);

  // If user is anonymous, suppress Ahead da Hora as required:
  // "** CASO O USUARIO APARECE ANONYMOUS, aonde nao se pode verificar a hora, enfim, so nao mostrar."
  const showAheadBadge = article.aheadDaHora && !isAnonymousUser;

  // Compute bias ratio for the sleek CapyScan micro-bar
  const { biasMultilateral, biasNacionalista } = React.useMemo(() => {
    const score = article.biasScore || 0; // -100 to +100
    // If score is -100 -> 90% cyan / 10% red
    // If score is 0 -> 50% cyan / 50% red
    // If score is +100 -> 10% cyan / 90% red
    const normalized = Math.max(-100, Math.min(100, score));
    const nac = Math.round(((normalized + 100) / 200) * 80 + 10);
    const multi = 100 - nac;
    return { biasMultilateral: multi, biasNacionalista: nac };
  }, [article.biasScore]);

  return (
    <article className="group relative flex flex-col justify-between bg-white/5 rounded-3xl border border-white/10 overflow-hidden hover:border-[#8A2BE2]/50 hover:bg-white/10 transition-all duration-300 flex-1">
      <div>
        {/* Sleek Visual Header */}
        <div className="h-40 bg-gradient-to-br from-[#121212] to-[#2a2a2a] relative overflow-hidden">
          {/* Abstract Tech Canvas / Pattern */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #00e5ff 0, #00e5ff 1px, transparent 0, transparent 50%)',
              backgroundSize: '10px 10px'
            }}
          />
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,#8A2BE2_0%,transparent_70%)]" />

          {/* "AHEAD DA HORA" Sleek Purple Tag */}
          {showAheadBadge && (
            <span className="absolute top-4 left-4 bg-[#8A2BE2] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_10px_rgba(138,43,226,0.8)]">
              {t.aheadBadge || 'AHEAD DA HORA'}
            </span>
          )}

          {/* Bureau Telemetry Bars in bottom right */}
          <div className="absolute bottom-4 right-4 flex gap-1 items-end">
            <div className="w-1 h-3 bg-[#00e5ff] rounded-full" />
            <div className="w-1 h-5 bg-[#00e5ff] rounded-full" />
            <div className="w-1 h-2 bg-white/20 rounded-full" />
          </div>

          {/* Time Badge in top right */}
          <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-mono text-white/50 bg-black/40 px-2 py-0.5 rounded-full border border-white/5 backdrop-blur-sm">
            <Clock className="w-3 h-3 text-white/40" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Topic & Bureau / Source row */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-[#00e5ff] uppercase tracking-wider">
              {article.topic}
            </span>
            <span className="text-[10px] text-white/40 truncate">
              • {cleanSourceName} ({article.country || 'Global'})
            </span>
          </div>

          {/* Inconsistency Stamp if flagged */}
          {article.hasInconsistencyStamp && (
            <div className="mb-2 p-2 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-[10px] font-mono flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">SELO RETROATIVO PERMANENTE:</span> Retratação registrada em base independente.
              </div>
            </div>
          )}

          {/* Title as clickable link opening article in new tab */}
          <a
            href={cleanArticleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onArticleClick && onArticleClick(article)}
            className="block group/title focus:outline-none"
            title={`Abrir matéria em ${cleanSourceName} (Nova aba)`}
          >
            <h2 className="text-lg font-bold leading-tight mb-2 text-white group-hover/title:text-[#00e5ff] transition-colors line-clamp-2 cursor-pointer">
              {article.title}
            </h2>
          </a>

          {/* Summary */}
          <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-4">
            {article.summary}
          </p>
        </div>
      </div>

      {/* Card Footer: CapyScan Bias Micro-Bar & Actions */}
      <div className="px-5 pb-5 pt-0 flex items-center justify-between mt-auto gap-3">
        <div className="flex flex-col">
          <span className="text-[9px] text-white/40 uppercase mb-1 font-mono tracking-wider">
            CapyScan Bias
          </span>
          <div className="w-20 sm:w-24 h-1.5 bg-white/10 rounded-full overflow-hidden flex">
            <div style={{ width: `${biasMultilateral}%` }} className="h-full bg-[#00e5ff]" />
            <div style={{ width: `${biasNacionalista}%` }} className="h-full bg-[#ff1744]/80" />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => onOpenCapyScan(article)}
            className="text-xs font-bold text-white/60 hover:text-white flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <span>{t.capyScanBtn || 'READ MORE'}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12l5-5-5-5" />
            </svg>
          </button>

          {/* Clear Source Link with Newspaper Name & Opens in New Tab */}
          <a
            href={cleanArticleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onArticleClick && onArticleClick(article)}
            className="text-xs font-mono text-white/70 hover:text-[#00e5ff] flex items-center gap-1.5 transition-all px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00e5ff]/40 max-w-[170px] sm:max-w-[210px] group/source cursor-pointer"
            title={`Ir para ${cleanSourceName} (Abre em nova aba)`}
          >
            <span className="text-white/40 text-[10px] uppercase font-mono hidden sm:inline">Fonte:</span>
            <span className="truncate font-semibold text-white/90 group-hover/source:text-[#00e5ff]">
              {cleanSourceName}
            </span>
            <ExternalLink className="w-3 h-3 text-white/40 group-hover/source:text-[#00e5ff] shrink-0" />
          </a>
        </div>
      </div>
    </article>
  );
};
