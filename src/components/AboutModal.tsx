import React from 'react';
import {
  X,
  Users,
  Compass,
  Shield,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Server,
  Globe2,
  Cpu,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { TranslationDict } from '../i18n/translations.ts';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenManifesto: () => void;
  t: TranslationDict;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onOpenManifesto,
  t
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn isolate">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#121216] border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-white/10 bg-black/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/20 border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#00e5ff] uppercase">
                  INSTITUCIONAL
                </span>
                <span className="text-white/20 text-xs">•</span>
                <span className="text-[10px] font-mono text-white/50 uppercase">
                  DRAFT CREATIVE STUDIO
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Quem Somos
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Fechar (Esc)"
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-8">
          {/* Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#1b1528] via-[#0d1219] to-[#0a0a0f] p-6 sm:p-8">
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#8A2BE2]/20 text-[#00e5ff] border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AGREGADOR DE NOTÍCIAS & DEFESA MENTAL</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                CapyNews: A Tecnologia por trás da Autonomia da Informação
              </h1>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl">
                O CapyNews foi desenvolvido pela <strong className="text-white">Draft Creative Studio Ltda</strong> como uma resposta direta à saturação de feeds algoritmicamente viciantes e à polarização superficial. Conectamos leitores diretamente às fontes jornalísticas originais através de uma interface limpa, rápida e transparente.
              </p>
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: O Que Fazemos */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-[#00e5ff]">
                <Globe2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">O Que Fazemos</h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Agregamos dados abertos e feeds RSS públicos de centenas de redações do Brasil e do mundo (como Nikkei Asia, BBC, Folha de S.Paulo, Le Monde, ABC News e agências multilaterais).
              </p>
              <p className="text-xs text-white/70 leading-relaxed">
                Cada notícia é apresentada com seu título e pequeno snippet autorizado, com link direto abrindo o portal original em nova aba para fortalecer o tráfego das fontes jornalísticas.
              </p>
            </div>

            {/* Box 2: O Que NÃO Fazemos */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-[#ff1744]">
                <Shield className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">O Que NÃO Fazemos</h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Não realizamos clipping invasivo ou reprodução não autorizada do corpo integral das matérias, mantendo total harmonia com os direitos autorais e o julgamento do STJ (REsp 2.008.122/SP).
              </p>
              <p className="text-xs text-white/70 leading-relaxed">
                Não nos colocamos como "tribunal da verdade" ou árbitros ideológicos: aplicamos métricas matemáticas de processamento de linguagem natural (NLP) para expor enquadramentos de forma fria e neutra.
              </p>
            </div>

            {/* Box 3: Ahead da Hora & Fusos */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-[#8A2BE2]">
                <Compass className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Tecnologia "Ahead da Hora"</h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                O planeta gira em 24 fusos horários. Notícias publicadas em Tóquio, Sydney ou Seul chegam ao agregador muitas horas à frente do horário oficial do Brasil.
              </p>
              <p className="text-xs text-white/70 leading-relaxed">
                Identificamos essas assimetrias em tempo real através do marcador inteligente "Ahead da Hora", antecipando tendências financeiras, ecológicas e geopolíticas antes do início do dia no Ocidente.
              </p>
            </div>

            {/* Box 4: Infraestrutura Offshore */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Server className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Infraestrutura Internacional</h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                A infraestrutura do CapyNews opera em data centers globais de alta redundância com latência de resposta média inferior a 15 milissegundos.
              </p>
              <p className="text-xs text-white/70 leading-relaxed">
                Combinamos bancos locais síncronos (JSON & SQLite) com rotinas contínuas de telemetria e checagem de feeds RSS sem depender de APIs de IA caras ou propensas a alucinação.
              </p>
            </div>
          </div>

          {/* Action Callout: Read Full Manifesto */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#8A2BE2]/15 border border-[#8A2BE2]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start text-xs font-mono font-bold text-[#00e5ff] uppercase">
                <BookOpen className="w-4 h-4" />
                <span>White Paper Editorial & Doutrina</span>
              </div>
              <h4 className="text-base font-bold text-white">
                Deseja aprofundar-se na tese científica do CapyNews?
              </h4>
              <p className="text-xs text-white/70">
                Leia o diagnóstico científico de Agnes Callard, Nature Communications e a fundamentação legal completa.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenManifesto();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#8A2BE2] hover:bg-[#7b1fa2] text-white text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(138,43,226,0.5)]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Doutrina e Manifesto</span>
            </button>
          </div>

          {/* Legal Identity Card */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/60">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase text-white/40 tracking-wider block">PROPRIEDADE & OPERAÇÃO</span>
              <strong className="text-white text-sm block">Draft Creative Studio Ltda</strong>
              <span className="text-[11px] text-[#8A2BE2]">Tecnologia, Dados e Engenharia Cognitiva</span>
            </div>

            <div className="flex items-center gap-2 text-emerald-400 font-bold bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <CheckCircle className="w-4 h-4" />
              <span>CNPJ: 21.964.187/0001-13</span>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/70 flex items-center justify-between shrink-0">
          <span className="text-xs font-mono text-white/40">
            CapyNews • Draft Creative Studio
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {t.close || 'Fechar'}
          </button>
        </div>
      </div>
    </div>
  );
};
