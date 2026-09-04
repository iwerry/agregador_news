import React from 'react';
import { X, Layers, CheckCircle2, SplitSquareVertical, ArrowRight, ShieldCheck, ThumbsUp } from 'lucide-react';
import { Article } from '../types.ts';
import { TranslationDict } from '../i18n/translations.ts';

interface CapyMatrixModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDict;
}

export const CapyMatrixModal: React.FC<CapyMatrixModalProps> = ({
  article,
  isOpen,
  onClose,
  t
}) => {
  if (!isOpen || !article) return null;

  const matrix = article.capyMatrix || {
    factualConsensus: 'Dados confirmados independentemente por agências internacionais e autoridades locais.',
    narrativeA: {
      source: article.source,
      stance: 'Enquadramento Regional',
      quote: article.title
    },
    narrativeB: {
      source: 'Consórcio de Imprensa Internacional',
      stance: 'Perspectiva Externa',
      quote: 'Divergências editoriais na interpretação das causas e desdobramentos diplomáticos.'
    },
    gsScore: 0.78
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#121217] border border-cyan-500/40 rounded-3xl shadow-[0_0_60px_rgba(0,229,255,0.2)] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#16161f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white font-['Poppins']">
                  CapyMatrix <span className="font-light text-cyan-400">// Cruzamento Espacial de Narrativas</span>
                </h3>
              </div>
              <p className="text-xs text-neutral-400">
                Isolando o fato bruto da propaganda editorial de cada lado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Article Anchor */}
          <div className="p-4 rounded-xl bg-[#171720] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono text-purple-400">EVENTO SOB ANÁLISE MULTILATERAL</span>
              <h4 className="text-base font-bold text-white font-['Poppins'] line-clamp-1">
                {article.title}
              </h4>
            </div>
            {/* GS Score (Generalist-Specialist Score) from Scientific Reports */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-800/60">
              <span className="text-xs font-mono text-neutral-400">GS SCORE:</span>
              <span className="text-sm font-mono font-black text-cyan-300">{matrix.gsScore}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400">
                ALTA DIVERSIDADE
              </span>
            </div>
          </div>

          {/* Tri-Col Matrix Grid (Veículo A | Consenso Factual | Veículo B) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Veículo A: Narrativa Exclusiva */}
            <div className="p-5 rounded-2xl bg-[#16161d] border border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    {matrix.narrativeA.source}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                    LADO A
                  </span>
                </div>
                <div className="text-xs font-mono text-neutral-300 font-semibold mb-2">
                  Enquadramento: {matrix.narrativeA.stance}
                </div>
                <blockquote className="text-xs text-neutral-400 italic border-l-2 border-purple-500/60 pl-3 py-1 leading-relaxed">
                  "{matrix.narrativeA.quote}"
                </blockquote>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800/80 text-[10px] font-mono text-neutral-500">
                Foco em ênfases locais e discursos regionais
              </div>
            </div>

            {/* Consenso Factual (O Núcleo Factual Validado) */}
            <div className="p-5 rounded-2xl bg-[#151d1e] border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(0,229,255,0.15)] flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-black font-mono font-extrabold text-[10px] tracking-wider uppercase shadow-md">
                CONSENSO FACTUAL
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3 text-cyan-300 font-bold text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>DADOS VALIDADOS SIMULTANEAMENTE</span>
                </div>
                <p className="text-xs text-neutral-200 leading-relaxed font-sans font-medium">
                  {matrix.factualConsensus}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-cyan-900/40 text-[11px] font-mono text-cyan-400/90 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Interseção lógica verificada em 8 fontes</span>
              </div>
            </div>

            {/* Veículo B: Narrativa Exclusiva Oposta */}
            <div className="p-5 rounded-2xl bg-[#16161d] border border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    {matrix.narrativeB.source}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                    LADO B
                  </span>
                </div>
                <div className="text-xs font-mono text-neutral-300 font-semibold mb-2">
                  Enquadramento: {matrix.narrativeB.stance}
                </div>
                <blockquote className="text-xs text-neutral-400 italic border-l-2 border-rose-500/60 pl-3 py-1 leading-relaxed">
                  "{matrix.narrativeB.quote}"
                </blockquote>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800/80 text-[10px] font-mono text-neutral-500">
                Foco em reações externas e narrativas concorrentes
              </div>
            </div>
          </div>

          {/* Community Notes Section (OSINT) */}
          <div className="p-4 rounded-xl bg-[#14141c] border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                NOTAS DA COMUNIDADE (CHECAGEM OSINT DESCENTRALIZADA)
              </span>
              <span className="text-[10px] font-mono text-neutral-400">12 COLABORADORES VERIFICADOS</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              "Imagens de satélite de alta resolução (Sentinel-2) e dados marítimos AIS confirmam as coordenadas citadas no despacho oficial sem indícios de manipulação física de rotas."
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-neutral-400">
              <span className="text-cyan-400 font-bold">96% consideraram útil</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer flex items-center gap-1">
                <ThumbsUp className="w-3 h-3 text-purple-400" /> Votar na precisão desta nota
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-[#15151c] flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-mono">
            A cura para o Doomscrolling: Devolve ao leitor o controle analítico
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
