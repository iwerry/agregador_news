import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  Cpu, 
  TrendingUp, 
  Compass, 
  Activity, 
  Radio, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Users, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import { TranslationDict } from '../i18n/translations.ts';
import { TypewriterText } from './TypewriterText.tsx';

interface FooterProps {
  t: TranslationDict;
  onOpenManifesto: () => void;
  onOpenAbout?: () => void;
  onOpenWeather: () => void;
  onSelectRegion: (reg: string) => void;
  onSelectTopic: (top: string) => void;
  onOpenDraftStudio?: (sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  t,
  onOpenManifesto,
  onOpenAbout,
  onOpenWeather,
  onSelectRegion,
  onSelectTopic,
  onOpenDraftStudio
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('investidores@capynews.com.br');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stagger container variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08
      }
    }
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 26 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <footer className="relative z-10 w-full mt-20 bg-zinc-950 text-white/60 selection:bg-purple-900 selection:text-white">
      {/* Subtle Top Neon Glow Edge (Purple / Cyan) */}
      <div className="relative w-full">
        {/* Glow blur background */}
        <div className="absolute inset-x-0 -top-px h-1 bg-gradient-to-r from-transparent via-purple-500/60 to-cyan-400/60 blur-xs" />
        {/* Crisp border line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/40 via-cyan-400/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* 4-Column Grid with Staggered Fade-In Up on Scroll */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14"
        >
          {/* Coluna 1: Brand & Manifesto (Quem Somos) - Spans 4 cols on desktop */}
          <motion.div variants={columnVariants} className="lg:col-span-4 space-y-4">
            {/* Logo: Capivara com ícone de RSS com glow suave ao passar o mouse */}
            <div 
              onClick={scrollToTop}
              className="inline-flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center shadow-[0_0_15px_rgba(138,43,226,0.45)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.85)] group-hover:scale-105 transition-all duration-300 border border-purple-400/30">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 11a9 9 0 0 1 9 9" />
                    <path d="M4 4a16 16 0 0 1 16 16" />
                    <circle cx="5" cy="19" r="1.5" fill="white" />
                    <path d="M12 4c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5-4.5-2-4.5-4.5 2-4.5 4.5-4.5z" opacity="0.6" />
                  </svg>
                </div>
                {/* Micro pulse indicator */}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-950 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white font-['Poppins'] leading-tight">
                  Capy<span className="text-[#a855f7]">News</span>
                  <span className="text-[#00e5ff] text-xl font-black">.</span>
                </span>
                <TypewriterText className="text-[9px] font-mono tracking-widest text-[#00e5ff] uppercase font-bold" />
              </div>
            </div>

            {/* Texto Descrição Oficial Reescrita Conforme Instrução */}
            <p className="text-xs leading-relaxed text-zinc-300/90 text-justify sm:text-left pt-1">
              Nascemos como o antídoto tecnológico definitivo contra o "shitty flow" e o doomscrolling que fragmentam a nossa atenção na era digital. Sem a pretensão de atuar como árbitros morais da verdade, a missão do CapyNews é utilizar programação local e matemática vetorial para desarmar as bolhas de filtro, cruzar narrativas globais em tempo real e devolver a autonomia analítica ao seu cérebro, permitindo um consumo de informação com verdadeiro propósito, clareza e accountability.
            </p>

            {/* Ações Rápidas: Quem Somos & Doutrina */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={onOpenAbout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-xs font-mono text-cyan-300 hover:text-white border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quem Somos</span>
              </button>
              <button
                onClick={onOpenManifesto}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-xs font-mono text-purple-300 hover:text-white border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                <span>Doutrina & Manifesto</span>
              </button>
            </div>
          </motion.div>

          {/* Coluna 2: Serviços Draft Studio - Spans 3 cols */}
          <motion.div variants={columnVariants} className="lg:col-span-3 space-y-4">
            <h5 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Serviços Draft Studio</span>
            </h5>
            
            <p className="text-[11px] text-zinc-400 font-mono">
              Ferramentas de desconstrução de viés e telemetria temporal.
            </p>

            <ul className="space-y-2.5 text-xs">
              {[
                { 
                  name: 'CapyScan (Análise Léxica & Framing)', 
                  badge: 'SCAN', 
                  action: () => { 
                    if (onOpenDraftStudio) onOpenDraftStudio('tech');
                    else onOpenManifesto();
                  } 
                },
                { 
                  name: 'CapyMatrix (Consenso Factual vs. Exclusiva)', 
                  badge: 'OSINT', 
                  action: () => { 
                    if (onOpenDraftStudio) onOpenDraftStudio('tech');
                    else onOpenManifesto();
                  } 
                },
                { 
                  name: 'CapyTimeline (Histórico Retroativo)', 
                  badge: 'HIST', 
                  action: () => { 
                    if (onOpenDraftStudio) onOpenDraftStudio('tech');
                    else onOpenManifesto();
                  } 
                },
                { 
                  name: 'Ahead da Hora (Fuso Relativo)', 
                  badge: 'UTC', 
                  action: () => { 
                    if (onOpenDraftStudio) onOpenDraftStudio('tech');
                    else onOpenWeather();
                  } 
                },
                { 
                  name: 'Premium / Community Notes', 
                  badge: 'PRO', 
                  action: () => { 
                    if (onOpenDraftStudio) onOpenDraftStudio('invest');
                    else onOpenManifesto();
                  } 
                },
              ].map((tool) => (
                <li key={tool.name}>
                  <button
                    onClick={tool.action}
                    className="group flex items-center gap-2 text-zinc-300 hover:text-[#c084fc] hover:translate-x-[2px] transition-all duration-300 text-left cursor-pointer w-full py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-[#a855f7] transition-colors flex-shrink-0" />
                    <span className="font-medium tracking-tight truncate">{tool.name}</span>
                    <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-purple-300 group-hover:border-purple-500/40 transition-colors">
                      {tool.badge}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Coluna 3: Radar Global & Tópicos (Navegação) - Spans 2 cols */}
          <motion.div variants={columnVariants} className="lg:col-span-2 space-y-4">
            <h5 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] font-mono flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Radar & Tópicos</span>
            </h5>

            <p className="text-[11px] text-zinc-400 font-mono">
              Filtro temático em tempo real.
            </p>

            <ul className="space-y-2 text-xs">
              {[
                { label: 'Global News', query: 'All', isGlobal: true },
                { label: 'Business & Finance', query: 'Business & Finance' },
                { label: 'Tech & AI', query: 'Tech & AI' },
                { label: 'Space & Cosmos', query: 'Space & Cosmos' },
                { label: 'Geopolitics & Science', query: 'Science' },
                { label: 'Green & Planet', query: 'Green & Planet' }
              ].map((topic) => (
                <li key={topic.label}>
                  <button
                    onClick={() => {
                      if (topic.isGlobal) {
                        onSelectRegion('Global');
                        onSelectTopic('All');
                      } else {
                        onSelectTopic(topic.query);
                      }
                      scrollToTop();
                    }}
                    className="group flex items-center gap-2 text-zinc-300 hover:text-cyan-300 hover:translate-x-[2px] transition-all duration-300 text-left cursor-pointer py-0.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-cyan-400 transition-colors" />
                    <span>{topic.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Coluna 4: Contato & B2B (Engineering & Development) - Spans 3 cols */}
          <motion.div variants={columnVariants} className="lg:col-span-3 space-y-4">
            <h5 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Engineering & Development</span>
            </h5>

            <p className="text-xs leading-relaxed text-zinc-300">
              Licensing of our proprietary technologies (such as CapyScan and CapyMatrix) via API or customized on demand for media portals. Robust programming solutions focused on enabling precision investigative journalism, linguistic analysis, and data engineering without abusive infrastructure costs.
            </p>

            {/* Contato Exclusivo: Botão ou link estilizado para investidores@capynews.com.br */}
            <div className="pt-1 space-y-2">
              <a
                href="mailto:investidores@capynews.com.br?subject=CapyNews%20Enterprise%20%26%20Engineering%20Licensing"
                className="group relative flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-purple-500/30 hover:border-purple-400 transition-all duration-300 shadow-[0_0_15px_rgba(138,43,226,0.15)] hover:shadow-[0_0_20px_rgba(138,43,226,0.35)]"
                title="Send email to investidores@capynews.com.br"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:text-white transition-all flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Contato Exclusivo B2B</span>
                    <span className="text-xs font-mono font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                      investidores@capynews.com.br
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  type="button"
                  aria-label="Copiar e-mail"
                  className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                  title="Copiar endereço de e-mail"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </a>

              {copiedEmail && (
                <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 animate-fadeIn">
                  <Check className="w-3 h-3" />
                  <span>E-mail institucional copiado para a área de transferência!</span>
                </p>
              )}

              <div className="flex items-center justify-end text-[11px] font-mono pt-1">
                {onOpenDraftStudio && (
                  <button
                    onClick={() => onOpenDraftStudio('contact')}
                    className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold hover:underline cursor-pointer group transition-colors"
                  >
                    <span>Abrir Hub B2B</span>
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Bar (Barra Inferior Sub-Footer) */}
      <div className="relative w-full bg-[#050508]">
        {/* Subtle divider line with gradient: dark to purple/blue to dark */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/40 via-cyan-500/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          {/* À esquerda: © 2026 CapyNews. All rights reserved. Rompendo o Unicontexto Global. */}
          <div className="flex flex-wrap items-center gap-2 text-center md:text-left">
            <span className="text-zinc-300">&copy; 2026 CapyNews. All rights reserved.</span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-purple-400/90 font-medium">Rompendo o Unicontexto Global.</span>
          </div>

          {/* À direita: Badge / Assinatura com link para https://draftcreative.com.br */}
          <div className="flex items-center gap-3">
            <a
              href="https://draftcreative.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-800 hover:border-purple-500/40 text-[11px] text-zinc-400 hover:text-white transition-all duration-300 shadow-sm"
              title="Acessar portal da Draft Creative Studio"
            >
              <span>Engineered & Designed by</span>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 group-hover:underline">
                Draft Creative Studio Ltda.
              </span>
              <ExternalLink className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <div className="hidden lg:flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ONLINE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
