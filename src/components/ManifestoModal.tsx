import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Shield,
  Compass,
  CheckCircle,
  ExternalLink,
  Cpu,
  Server,
  Globe2,
  FileText,
  Copy,
  Check,
  Zap,
  Scale,
  Activity,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { TranslationDict } from '../i18n/translations.ts';

interface ManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDict;
}

export const ManifestoModal: React.FC<ManifestoModalProps> = ({ isOpen, onClose, t }) => {
  const [copiedDiagram, setCopiedDiagram] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'diagnostico' | 'doutrina' | 'legal'>('all');

  if (!isOpen) return null;

  const asciiDiagram = `                     ┌───────────────────────────┐
                     │     NOTÍCIA ORIGINAL      │
                     └─────────────┬─────────────┘
                                   │
                                   ▼
                     ┌───────────────────────────┐
                     │    NLP WEB - SEM USO DE IA │
                     └─────────────┬─────────────┘
                                   │
            ┌──────────────────────┴──────────────────────┐
            ▼                                             ▼
┌───────────────────────┐                     ┌───────────────────────┐
│     CapyCompass       │                     │      CapyMatrix       │
│  (Mapeamento Léxico/  │                     │ (Consenso vs. Vieses  │
│ Similaridade Cosseno) │                     │     Multilaterais)    │
└───────────────────────┘                     └───────────────────────┘`;

  const copyDiagramToClipboard = () => {
    navigator.clipboard.writeText(asciiDiagram);
    setCopiedDiagram(true);
    setTimeout(() => setCopiedDiagram(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn isolate">
      <div className="relative w-full max-w-5xl h-[92vh] bg-[#121216] border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-white">
        {/* Editorial Top Bar / Toolbar */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10 bg-black/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8A2BE2] flex items-center justify-center text-white shadow-[0_0_15px_rgba(138,43,226,0.6)]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#8A2BE2] uppercase">
                  DOUTRINA EDITORIAL
                </span>
                <span className="text-white/20 text-xs">•</span>
                <span className="text-[10px] font-mono text-white/50 uppercase">
                  WHITE PAPER // OSINT & NLP
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Manifesto CapyNews
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Section Jump Pills (Desktop) */}
            <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setActiveSection('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeSection === 'all' ? 'bg-[#8A2BE2] text-white font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                Completo
              </button>
              <button
                onClick={() => {
                  setActiveSection('diagnostico');
                  document.getElementById('sec-diagnostico')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeSection === 'diagnostico' ? 'bg-[#8A2BE2] text-white font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                1. Crise
              </button>
              <button
                onClick={() => {
                  setActiveSection('doutrina');
                  document.getElementById('sec-doutrina')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeSection === 'doutrina' ? 'bg-[#8A2BE2] text-white font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                2. Doutrina
              </button>
              <button
                onClick={() => {
                  setActiveSection('legal');
                  document.getElementById('sec-legal')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeSection === 'legal' ? 'bg-[#8A2BE2] text-white font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                3. Legal & Infra
              </button>
            </div>

            <button
              onClick={onClose}
              title="Fechar (Esc)"
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 space-y-12">
          {/* Article Header */}
          <article className="max-w-3xl mx-auto space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#8A2BE2]/20 text-[#00e5ff] border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ARQUITETURA DE DEFESA MENTAL</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Manifesto CapyNews: Uma Arquitetura de Defesa Mental contra o Colapso do Contexto
              </h1>

              {/* Byline and metadata */}
              <div className="pt-2 pb-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-xs">
                    DC
                  </div>
                  <div>
                    <span className="text-white font-medium block">Draft Creative Studio Ltda</span>
                    <span className="text-[11px] text-[#8A2BE2]">Tecnologia, Dados e Engenharia Cognitiva</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px]">
                  <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
                    CNPJ: 21.964.187/0001-13
                  </span>
                  <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-emerald-400">
                    STATUS: ATIVO & REGULAMENTADO
                  </span>
                </div>
              </div>
            </div>

            {/* Editorial Hero Illustration Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#1a1329] via-[#0d1117] to-[#0a0a0f] p-6 sm:p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#8A2BE2]/15 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00e5ff]/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between text-xs font-mono text-white/40">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#00e5ff]" />
                    MATRIZ DISCURSIVA & VETORIAL
                  </span>
                  <span>REF: CALLARD (2020) & NATURE COMM.</span>
                </div>

                {/* Infographic Visual: Context Collapse vs Cognitive Shield */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">
                        A PATOLOGIA ATUAL
                      </span>
                      <span className="text-[10px] font-mono text-red-300">Shitty Flow</span>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed">
                      "Unicontexto Global" com feeds infinitos que hiperestimulam a dopamina por meio de indignação reativa, dor e estafa cognitiva crônica.
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-red-400/80 pt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span>Esgotamento analítico do leitor</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#00e5ff] uppercase tracking-wider">
                        A SOLUÇÃO CAPYNEWS
                      </span>
                      <span className="text-[10px] font-mono text-[#8A2BE2]">Autonomia Analítica</span>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed">
                      Telemetria fria e neutra: mapeamento léxico, similaridade de cosseno e matriz de consensos mínimos sem moralismos nem algoritmos viciantes.
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 pt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Transparência matemática discursiva</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 1 */}
            <section id="sec-diagnostico" className="space-y-5 pt-4">
              <div className="flex items-center gap-3 text-[#8A2BE2]">
                <div className="w-8 h-8 rounded-lg bg-[#8A2BE2]/20 border border-[#8A2BE2]/40 flex items-center justify-center font-bold text-base">
                  🧭
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  1. O Diagnóstico Científico da Crise da Informação
                </h2>
              </div>

              <div className="prose prose-invert max-w-none space-y-4 text-white/80 text-sm sm:text-base leading-relaxed">
                <p>
                  O ecossistema contemporâneo de circulação de notícias está profundamente quebrado. Para compreender a proposta técnica do CapyNews, é necessário diagnosticar a patologia que corrói a esfera pública digital, estruturada sobre duas dinâmicas complementares:
                </p>

                {/* Sub-item A */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="text-[#00e5ff] font-mono text-sm">A.</span>
                    O "Unicontexto Global" e a Indignação Viral
                  </h3>
                  <p className="text-sm leading-relaxed text-white/70">
                    Conforme mapeado pela filósofa <strong className="text-white">Agnes Callard (Universidade de Chicago)</strong>, a sociedade hiperconectada migrou de múltiplos contextos locais — onde as normas e valores eram mediados pela proximidade física e pelo pertencimento social — para um único <strong className="text-[#00e5ff]">"Unicontexto Global"</strong> digital.
                  </p>
                  <p className="text-sm leading-relaxed text-white/70">
                    Nesse espaço virtual unificado e claustrofóbico, as barreiras de interpretação ruíram. Para que uma informação se torne legível e de alto alcance para audiências culturalmente diversas, o algoritmo das redes sociais prioriza sistematicamente males universais (dor, tragédia, conflitos e indignação moral).
                  </p>
                </div>

                {/* Sub-item B */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="text-[#ff1744] font-mono text-sm">B.</span>
                    A Captura Atencional e o "Shitty Flow" (Fluxo Nocivo)
                  </h3>
                  <p className="text-sm leading-relaxed text-white/70">
                    Estudos empíricos de dinâmica de sistemas e física estatística (como o célebre <em>"Accelerating dynamics of collective attention"</em>, publicado na <strong>Nature Communications</strong>) demonstram que a atenção coletiva humana está se fragmentando e acelerando em ritmo insustentável.
                  </p>
                  <p className="text-sm leading-relaxed text-white/70">
                    O usuário médio é submetido ao <strong className="text-rose-400">"Shitty Flow"</strong>: um fluxo ininterrupto de feeds infinitos desenhados para dopaminar o cérebro pela reatividade emocional rápida. O resultado é uma estafa cognitiva crônica, onde os recursos analíticos do leitor são exauridos muito antes que ele consiga avaliar a veracidade ou o enquadramento de qualquer fato.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 2 */}
            <section id="sec-doutrina" className="space-y-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 text-[#00e5ff]">
                <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/20 border border-[#00e5ff]/40 flex items-center justify-center font-bold text-base">
                  🎯
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  2. A Doutrina CapyNews: Autonomia Analítica vs. O Árbitro da Verdade
                </h2>
              </div>

              <div className="space-y-4 text-white/80 text-sm sm:text-base leading-relaxed">
                <p>
                  O CapyNews recusa-se de forma veemente a atuar como um <strong className="text-white">"Árbitro da Verdade"</strong> ou um tribunal moralista da informação. Acreditamos que carimbos de validação unilaterais e selos moralistas geram atrito, alimentam a polarização e infantilizam o leitor.
                </p>

                <p>
                  Nossa doutrina baseia-se na <strong className="text-[#00e5ff]">transparência matemática aplicada ao discurso</strong>. Nós não dizemos em que você deve acreditar; nós expomos as engrenagens linguísticas e de engenharia discursiva que foram utilizadas para construir a manchete que você está lendo.
                </p>

                {/* ARCHITECTURAL DIAGRAM CARD */}
                <div className="my-6 rounded-2xl bg-black/80 border border-white/15 p-5 sm:p-7 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#8A2BE2]" />
                      <span className="text-xs font-mono font-bold text-white tracking-wide">
                        FLUXOGRAMA ARQUITETURAL DA INTELIGÊNCIA CAPYNEWS
                      </span>
                    </div>

                    <button
                      onClick={copyDiagramToClipboard}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                    >
                      {copiedDiagram ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Esquema</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Visual Node Representation */}
                  <div className="py-4 flex flex-col items-center gap-4 text-center">
                    {/* Step 1 */}
                    <div className="w-full max-w-sm p-3 rounded-xl bg-white/5 border border-white/20 shadow-md">
                      <span className="text-xs font-mono uppercase text-white/50 block">Entrada de Dados</span>
                      <strong className="text-sm text-white">NOTÍCIA ORIGINAL (Feed RSS Estruturado)</strong>
                    </div>

                    {/* Arrow Down */}
                    <div className="flex flex-col items-center">
                      <div className="w-0.5 h-5 bg-[#8A2BE2]" />
                      <div className="w-2 h-2 rotate-45 border-b-2 border-r-2 border-[#8A2BE2]" />
                    </div>

                    {/* Step 2 */}
                    <div className="w-full max-w-sm p-3 rounded-xl bg-[#8A2BE2]/20 border border-[#8A2BE2]/50 shadow-[0_0_20px_rgba(138,43,226,0.3)]">
                      <span className="text-[10px] font-mono uppercase text-[#00e5ff] font-bold block">Motor Local OSINT</span>
                      <strong className="text-sm text-white">NLP WEB — SEM USO DE IA COMERCIAL</strong>
                      <span className="text-[11px] text-white/60 block mt-0.5">Processamento vetorial matemático de alta velocidade</span>
                    </div>

                    {/* Arrow Branch */}
                    <div className="w-full max-w-md flex flex-col items-center">
                      <div className="w-0.5 h-4 bg-white/30" />
                      <div className="w-3/4 h-0.5 bg-white/30" />
                      <div className="w-3/4 flex justify-between">
                        <div className="w-0.5 h-4 bg-[#00e5ff]" />
                        <div className="w-0.5 h-4 bg-[#8A2BE2]" />
                      </div>
                    </div>

                    {/* Step 3: Two Outputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <Compass className="w-4 h-4 text-[#00e5ff]" />
                          <strong className="text-sm text-[#00e5ff]">CapyCompass</strong>
                        </div>
                        <p className="text-xs text-white/70">
                          Mapeamento Léxico e Similaridade de Cosseno em representações vetoriais geopolíticas (velocímetro visual de enquadramento).
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <Layers className="w-4 h-4 text-[#8A2BE2]" />
                          <strong className="text-sm text-[#8A2BE2]">CapyMatrix</strong>
                        </div>
                        <p className="text-xs text-white/70">
                          Consenso factual mínimo compartilhado vs. variações retóricas e vieses multilaterais de esquerda à direita global.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible/Verbatim ASCII representation */}
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[10px] font-mono text-white/40 block mb-1">REPRESENTAÇÃO ASCII DO ESQUEMA:</span>
                    <pre className="p-3 rounded-lg bg-black/60 font-mono text-[11px] sm:text-xs text-white/70 overflow-x-auto leading-tight border border-white/5">
                      {asciiDiagram}
                    </pre>
                  </div>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-2">
                    <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                      O Modelo Tradicional Falido
                    </h4>
                    <p className="text-xs leading-relaxed text-white/70">
                      Plataformas que tentam impor narrativas oficiais criam bolhas de filtro impenetráveis e geram uma reação natural de rejeição cética por parte do público.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      A Solução CapyNews
                    </h4>
                    <p className="text-xs leading-relaxed text-white/70">
                      Através de um motor proprietário de Processamento de Linguagem Natural (NLP) tradicional rodando localmente, aplicamos métricas de Similaridade de Cosseno e análise léxica para alimentar o CapyCompass e o CapyMatrix. O leitor recupera a sua elasticidade cognitiva e a sua autonomia analítica.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3 */}
            <section id="sec-legal" className="space-y-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 text-emerald-400">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-base">
                  ⚖️
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  3. Legitimidade Econômica, Direitos Autorais e Segurança Tecnológica
                </h2>
              </div>

              <div className="space-y-5 text-white/80 text-sm sm:text-base leading-relaxed">
                <p>
                  O CapyNews foi arquitetado sob os mais rígidos padrões de conformidade regulatória, operando em perfeita harmonia com a legislação de propriedade intelectual brasileira e as melhores práticas internacionais para agregadores de conteúdo digital.
                </p>

                {/* Brazilian Framework */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-base">A Conformidade Legal no Cenário Brasileiro</h3>
                  </div>

                  <p className="text-sm text-white/70 leading-relaxed">
                    O <strong>Superior Tribunal de Justiça (STJ)</strong>, no recente julgamento do <strong className="text-white">REsp 2.008.122/SP (agosto de 2023)</strong>, estabeleceu de forma definitiva que o serviço comercializado de clipping pago (que reproduz de forma sistemática a íntegra de reportagens de terceiros para fins comerciais e sem licenciamento) viola os direitos autorais das agências de imprensa.
                  </p>

                  <p className="text-sm font-semibold text-white">
                    O CapyNews adota uma postura diametralmente oposta ao clipping ilegal:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                      <span className="text-xs font-mono font-bold text-[#00e5ff] block">Preservação de Direitos</span>
                      <p className="text-xs text-white/70">
                        O sistema consome apenas dados abertos estruturados via feeds RSS fornecidos publicamente pelos próprios produtores de conteúdo.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                      <span className="text-xs font-mono font-bold text-[#8A2BE2] block">Arquitetura Baseada em Snippets</span>
                      <p className="text-xs text-white/70">
                        Nós nunca realizamos o scraping invasivo ou a indexação do corpo textual completo das reportagens. Exibimos unicamente o título e o pequeno fragmento resumido (snippet) autorizado pelo próprio veículo emissor no canal RSS.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                      <span className="text-xs font-mono font-bold text-emerald-400 block">Geração e Direcionamento de Tráfego</span>
                      <p className="text-xs text-white/70">
                        Todos os nossos painéis direcionam o usuário de forma obrigatória, transparente e legítima, via hiperlinks diretos, para o portal original do veículo parceiro. Atuamos como um canal catalisador de tráfego orgânico qualificado para as fontes jornalísticas.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                      <span className="text-xs font-mono font-bold text-amber-400 block">Monetização Ética</span>
                      <p className="text-xs text-white/70">
                        A cobrança da nossa Assinatura Premium refere-se estritamente ao acesso ilimitado às ferramentas matemáticas de análise sintática e inteligência OSINT descentralizada (CapyMatrix, CapyScan e painéis de dados), e nunca à venda ou distribuição de conteúdo jornalístico de terceiros.
                      </p>
                    </div>
                  </div>
                </div>

                {/* International Framework */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Globe2 className="w-4 h-4 text-[#00e5ff]" />
                    <h3 className="text-base">O Cenário Internacional: O Valor do Agregador</h3>
                  </div>

                  <p className="text-sm text-white/70 leading-relaxed">
                    Globalmente, a atividade de agregação inteligente baseada em indexação rápida e direcionamento de tráfego é amplamente protegida e reconhecida como um elemento essencial para a saúde da internet:
                  </p>

                  <div className="space-y-3 pt-1 text-sm text-white/70">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <strong className="text-white block mb-1">
                        🇪🇺 União Europeia (Artigo 15 da Diretiva de Direitos Autorais):
                      </strong>
                      A legislação europeia protege expressamente o uso de hiperlinks e a exibição de "palavras isoladas ou trechos muito curtos" (os chamados snippets), excluindo-os de qualquer necessidade de licenciamento prévio para garantir a livre circulação de dados na web.
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <strong className="text-white block mb-1">
                        🇺🇸 Estados Unidos (Doutrina do Fair Use - Artigo 107 da Lei de Direitos Autorais):
                      </strong>
                      Precedentes consolidados nos tribunais americanos (como <em>Kelly v. Arriba Soft</em> e os litígios que fundamentaram as ferramentas de busca globais) reconhecem que ferramentas que indexam, analisam sintaticamente e exibem snippets para guiar o usuário em direção ao link original do produtor desempenham um papel de alto valor público (caráter transformativo), sendo plenamente legais.
                    </div>
                  </div>
                </div>

                {/* Offshore Infrastructure */}
                <div className="p-5 sm:p-6 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-4">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Server className="w-4 h-4 text-[#8A2BE2]" />
                    <h3 className="text-base">Infraestrutura de Alta Performance e Resiliência Offshore</h3>
                  </div>

                  <p className="text-sm text-white/70 leading-relaxed">
                    Para garantir a máxima estabilidade operacional, imunidade contra instabilidades de conectividade local e soberania técnica de dados, <strong>100% da infraestrutura de servidores do CapyNews está hospedada em data centers internacionais (fora do Brasil)</strong>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1">
                      <strong className="text-white block text-xs">Eficiência de Custos:</strong>
                      <p className="text-white/70">
                        Ao integrar o backend em Laravel de forma local com processamento em Python em CPU internacional, reduzimos o custo de tokens das APIs comerciais tradicionais por mês, assegurando a viabilidade financeira e sustentabilidade do projeto.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1">
                      <strong className="text-white block text-xs">Soberania e Privacidade:</strong>
                      <p className="text-white/70">
                        O isolamento de servidores na nuvem internacional blinda o agregador contra picos de tráfego global e garante uma entrega ultraveloz das análises geopolíticas em milissegundos para o usuário.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Closing Signature Block */}
            <div className="pt-8 border-t border-white/15 space-y-6">
              <div className="text-center py-4">
                <p className="text-lg sm:text-xl font-bold italic text-white tracking-wide">
                  "CapyNews — Ferramentas de análise fria para mentes livres."
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest block">
                    DOCUMENTO OFICIAL ASSINADO
                  </span>
                  <div className="text-base font-bold text-white">
                    Draft Creative Studio Ltda
                  </div>
                  <div className="text-xs text-[#8A2BE2]">
                    Tecnologia, Dados e Engenharia Cognitiva
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-1 text-xs font-mono text-white/60">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>CNPJ: 21.964.187/0001-13</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/70 flex items-center justify-between shrink-0">
          <div className="text-xs font-mono text-white/40 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CapyNews OSINT White Paper</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#8A2BE2] hover:bg-[#7b1fa2] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_0_20px_rgba(138,43,226,0.4)] ml-auto"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
