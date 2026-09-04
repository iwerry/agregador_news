import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  X,
  ArrowRight,
  ChevronDown,
  Cpu,
  Database,
  Camera,
  Film,
  Eye,
  Activity,
  ShieldCheck,
  Terminal,
  Mail,
  Building2,
  User,
  CheckCircle2,
  Layers,
  Sparkles,
  Copy,
  Check,
  Send,
  Lock,
  Code2,
  Search,
  Compass,
  FileSearch,
  Crosshair,
  Flame,
  Radio
} from 'lucide-react';
import { TranslationDict } from '../i18n/translations.ts';
import { DraftLogo } from './DraftLogo.tsx';
import { OsintTerminal } from './OsintTerminal.tsx';

interface DraftStudioProps {
  isOpen: boolean;
  onClose: () => void;
  targetSection?: string;
  t?: TranslationDict;
}

export const DraftStudio: React.FC<DraftStudioProps> = ({
  isOpen,
  onClose,
  targetSection
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    subject: 'Consultoria Tech / Desenvolvimento Web',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [protocolNumber, setProtocolNumber] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth scroll handler
  const scrollToSection = (sectionId: string) => {
    // Support alias
    const normalizedId = sectionId === 'invest' ? 'contact' : sectionId;
    const el = document.getElementById(normalizedId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Auto-scroll to target section on open
  useEffect(() => {
    if (isOpen && targetSection) {
      const timer = setTimeout(() => {
        scrollToSection(targetSection);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen, targetSection]);

  // Lock body scroll when modal/page is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('investidores@capynews.com.br');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) return;

    setIsSubmitting(true);
    const protocol = 'DRAFT-' + Math.floor(100000 + Math.random() * 900000);

    try {
      await fetch('/api/investors/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          protocol,
          submittedAt: new Date().toISOString()
        })
      }).catch(() => {});
    } catch {
      // Graceful fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setProtocolNumber(protocol);
      setIsSuccess(true);
    }, 600);
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-zinc-950 text-white overflow-y-auto scroll-smooth custom-scrollbar isolate">
      {/* Background Cyber Grid & Ambient Dark Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e15_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_65%_50%_at_50%_0%,#000_75%,transparent_100%)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-purple-900/25 via-indigo-950/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[35%] -right-40 w-[550px] h-[550px] bg-cyan-900/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[70%] -left-40 w-[600px] h-[600px] bg-purple-950/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Floating Glassmorphism Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-zinc-950/85 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Official Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-3 cursor-pointer text-left group"
            >
              <div className="h-9 px-2 py-1 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center justify-center group-hover:border-cyan-400/50 transition-colors">
                <DraftLogo className="h-6 w-auto" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
                  Media Tech & Studio
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Draft Creative Studio Ltda.
                </span>
              </div>
            </button>
          </div>

          {/* Smooth Scroll Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-mono text-zinc-300">
            <button
              onClick={() => scrollToSection('tech')}
              className="hover:text-[#00e5ff] flex items-center gap-1.5 transition-colors cursor-pointer py-1"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Desenvolvimento (#tech)</span>
            </button>
            <button
              onClick={() => scrollToSection('media')}
              className="hover:text-purple-400 flex items-center gap-1.5 transition-colors cursor-pointer py-1"
            >
              <Camera className="w-3.5 h-3.5 text-purple-400" />
              <span>Media Draft (#media)</span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contato & Parcerias (#contact)</span>
            </button>
          </div>

          {/* Action & Close Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection('contact')}
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/30 to-cyan-600/30 hover:from-purple-600/50 hover:to-cyan-600/50 border border-purple-500/40 text-xs font-mono text-white transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Contratar Serviços</span>
            </button>

            <button
              onClick={onClose}
              className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-purple-500/50 text-xs font-mono text-zinc-200 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Voltar ao Terminal CapyNews"
            >
              <span className="text-zinc-400 group-hover:text-purple-400 transition-colors">&larr;</span>
              <span className="font-semibold">Voltar ao CapyNews</span>
              <X className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Page Content */}
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-36 py-16">
        
        {/* ============================================================ */}
        {/* 1. HERO SECTION: A ENGENHARIA E A LENTE                     */}
        {/* ============================================================ */}
        <section id="hero" className="pt-6 sm:pt-14 relative scroll-mt-28">
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto space-y-8"
          >
            {/* Top Brand Logo Banner */}
            <div className="flex justify-center mb-2">
              <div className="relative inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-[0_0_40px_rgba(0,229,255,0.15)] backdrop-blur-md">
                <DraftLogo className="h-10 sm:h-12 w-auto" />
                <div className="absolute -bottom-2 right-4 px-2 py-0.5 rounded bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40 text-[9px] font-mono uppercase font-bold tracking-wider">
                  STUDIO LTDA
                </div>
              </div>
            </div>

            {/* Authority Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-purple-500/30 text-[11px] font-mono text-purple-300 shadow-[0_0_20px_rgba(138,43,226,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-400 uppercase tracking-wider">Enterprise Media Tech //</span>
              <span className="font-bold text-white">Criadora & Mantenedora do CapyNews</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Poppins'] text-white leading-[1.12]">
              Engineering the Future of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-cyan-400">
                Global Journalism.
              </span>
            </h1>

            {/* Subheadline (Exact copy requested) */}
            <p className="text-base sm:text-xl text-zinc-300/90 leading-relaxed font-normal max-w-3xl mx-auto">
              A Draft Creative Studio é o motor tecnológico e criativo por trás do CapyNews. Unimos desenvolvimento de software avançado à produção audiovisual de campo para construir narrativas incontestáveis.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection('tech')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-mono font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(138,43,226,0.35)] transition-all cursor-pointer group"
              >
                <span>Conheça Nossas Verticais</span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/15 hover:border-cyan-400/50 font-mono text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Iniciar Conversa B2B</span>
              </button>
            </div>

            {/* Telemetry Authority Strip */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'ARQUITETURA', value: 'Web & Alta Performance', sub: 'Engenharia Sob Medida' },
                { label: 'INTELIGÊNCIA', value: 'NLP & Dados Locais', sub: 'Sem Custos Abusivos' },
                { label: 'AUDIOVISUAL', value: 'Cinema 6K & Campo', sub: 'Fotojornalismo Cru' },
                { label: 'INVESTIGAÇÃO', value: 'OSINT Avançado', sub: 'Apuração e Análise' }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm text-left hover:border-white/10 transition-colors"
                >
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                  <div className="text-sm font-bold text-white font-mono mt-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-300">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400/80 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* 2. SEÇÃO TECNOLÓGICA: DESENVOLVIMENTO & CONSULTORIA (id="tech") */}
        {/* ============================================================ */}
        <section id="tech" className="scroll-mt-28 space-y-12">
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>CODE & DATA SOLUTIONS // SEÇÃO 01</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Poppins'] tracking-tight text-white">
              Desenvolvimento & Consultoria
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Desenvolvemos sistemas digitais sob medida para empresas, veículos jornalísticos e corporações que demandam soberania tecnológica, código enxuto e processamento analítico veloz.
            </p>
          </motion.div>

          {/* Cards Grid with Glassmorphism Effect */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Desenvolvimento Customizado */}
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative p-7 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900/80 border border-white/10 hover:border-cyan-400/50 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    Web & Sistemas
                  </span>
                  <h3 className="text-lg font-bold text-white font-['Poppins'] mt-1">
                    Desenvolvimento Customizado
                  </h3>
                </div>
                <p className="text-xs text-zinc-300/90 leading-relaxed">
                  Criação de arquiteturas web complexas, portais de alta performance e engenharia de dados sob medida para o setor de comunicação e inteligência.
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 mt-6">
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-400">
                  <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">Next.js / Vite</span>
                  <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">TypeScript</span>
                  <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">Edge Latency</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Consultoria em Estruturação de Dados */}
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative p-7 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900/80 border border-white/10 hover:border-purple-400/50 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                    NLP & Eficiência
                  </span>
                  <h3 className="text-lg font-bold text-white font-['Poppins'] mt-1">
                    Consultoria em Estruturação de Dados
                  </h3>
                </div>
                <p className="text-xs text-zinc-300/90 leading-relaxed">
                  Ajudamos empresas a estruturar suas próprias soluções utilizando lógicas de processamento local (NLP) e bancos de dados otimizados.
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 mt-6">
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-400">
                  <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">NLP Local</span>
                  <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">Similaridade Vetorial</span>
                  <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">Zero Hallucinations</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Ferramentas OSINT sob Medida */}
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative p-7 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900/80 border border-white/10 hover:border-emerald-400/50 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                  <FileSearch className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                    Pesquisa & Inteligência
                  </span>
                  <h3 className="text-lg font-bold text-white font-['Poppins'] mt-1">
                    Ferramentas OSINT sob Medida
                  </h3>
                </div>
                <p className="text-xs text-zinc-300/90 leading-relaxed">
                  Desenvolvimento de painéis de monitoramento (Open-Source Intelligence) exclusivos para análise de enquadramento e pesquisa corporativa.
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 mt-6">
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-400">
                  <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">Framing Detection</span>
                  <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">Cross-Verification</span>
                  <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">Custom Dashboards</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Live Emulated OSINT & Forensics Terminal */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3 pt-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-bold uppercase tracking-wider">Simulação Forense de Campo // Exiftool & OSINT</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                Auditoria de autenticidade de imagem & coordenadas GPS em tempo real
              </span>
            </div>
            
            <OsintTerminal />
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* 3. SEÇÃO AUDIOVISUAL E JORNALISMO: MEDIA DRAFT (id="media") */}
        {/* ============================================================ */}
        <section id="media" className="scroll-mt-28 space-y-12">
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-300">
              <Camera className="w-3.5 h-3.5 text-purple-400" />
              <span>ON-LOCATION CINEMA & OSINT // SEÇÃO 02</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Poppins'] tracking-tight text-white">
              Audiovisual & Jornalismo de Campo
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              A imagem e a apuração documental como alicerces de narrativas sólidas e inquestionáveis.
            </p>
          </motion.div>

          {/* Asymmetrical Modern Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Copy & Manifesto (7 cols) */}
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-7 p-8 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-6"
            >
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Film className="w-4 h-4" />
                  <span>Media Draft Studio</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold font-['Poppins'] text-white leading-tight">
                  Media Draft: The Eyes on the Ground.
                </h3>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  A tecnologia processa os dados, mas a imagem revela a verdade. O Media Draft Studio é nosso braço tático e jornalístico. Realizamos produção audiovisual de ponta, cobertura fotográfica documental, captação de vídeo in-loco e produção de matérias especiais para grandes portais.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      Fotografia Documental
                    </span>
                    <p className="text-xs text-zinc-400">
                      Coberturas cruas em alta resolução, narrativas humanas e registro histórico sem filtros promocionais.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-purple-400" />
                      Cinema & Produção 6K
                    </span>
                    <p className="text-xs text-zinc-400">
                      Captação com perfil logarítmico, estabilização giroscópica e finalização profissional de cor para streaming.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs font-mono text-zinc-400 flex items-center justify-between">
                <span>COORDENADAS DE ATUAÇÃO // BR & INTERNACIONAL</span>
                <span className="text-emerald-400 font-bold">READY TO DEPLOY</span>
              </div>
            </motion.div>

            {/* Right Column: Photojournalism Mosaic (5 cols) */}
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-5 grid grid-cols-2 gap-3 min-h-[380px]"
            >
              {/* Mosaic Card 1: Camera sensor / Tactical focus */}
              <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 group flex flex-col justify-between p-4">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/60 to-transparent z-10" />
                <div className="relative z-20 flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span>FRAME #01</span>
                  <span className="text-cyan-400">RAW_6K</span>
                </div>
                <div className="my-auto flex items-center justify-center relative z-20 py-6">
                  <div className="w-16 h-16 rounded-full border border-dashed border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:rotate-45 transition-transform duration-700">
                    <Crosshair className="w-8 h-8" />
                  </div>
                </div>
                <div className="relative z-20">
                  <p className="text-xs font-bold text-white font-mono">Foco Tático</p>
                  <p className="text-[10px] text-zinc-400">Capturas Documentais</p>
                </div>
              </div>

              {/* Mosaic Card 2: B&W High-contrast documentary frame */}
              <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group flex flex-col justify-between p-4">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/80 to-transparent z-10" />
                <div className="relative z-20 flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span>MONOCHROME</span>
                  <span className="text-purple-400">P&B 50mm</span>
                </div>
                <div className="my-auto flex items-center justify-center relative z-20 py-6">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300">
                    <Eye className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
                <div className="relative z-20">
                  <p className="text-xs font-bold text-white font-mono">Olhar Imparcial</p>
                  <p className="text-[10px] text-zinc-400">Fotojornalismo Cru</p>
                </div>
              </div>

              {/* Mosaic Card 3: Large span card with telemetry */}
              <div className="col-span-2 relative rounded-2xl overflow-hidden bg-zinc-900/90 border border-white/10 p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold text-white font-mono">LIVE ON-LOCATION DISPATCH</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Equipamentos autônomos de gravação externa, drones táticos e áudio binaural para grandes reportagens.
                  </p>
                </div>
                <div className="hidden sm:flex text-right flex-col font-mono text-[10px] text-zinc-500">
                  <span>ISO 800 // 24FPS</span>
                  <span>TIME-CODE SYNC</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Destaque Inferior na Seção: Jornalismo Investigativo com OSINT */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900/80 to-cyan-950/30 border border-purple-500/40 shadow-[0_0_35px_rgba(168,85,247,0.15)] backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                <span>DESTAQUE DE INVESTIGAÇÃO PROFISSIONAL</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-['Poppins'] text-white">
                Jornalismo Investigativo com OSINT
              </h3>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Combinamos inteligência de dados abertos com investigação de campo para reportagens profundas. Nossa equipe cruza bases públicas, registros documentais, rotas marítimas, contratos corporativos e dados geoespaciais com apuração in-loco, produzindo matérias com evidências irrefutáveis para veículos de comunicação, fundos e instituições de pesquisa.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Cruzamento de Registros Públicos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Auditoria Geoespacial & Imagens de Satélite</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Rigor de Fonte & Conformidade Legal</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* 4. SEÇÃO DE CAPTAÇÃO E CONTATO (id="contact")               */}
        {/* ============================================================ */}
        <section id="contact" className="scroll-mt-28 space-y-12">
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-300">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>B2B & ENTERPRISE // SEÇÃO 03</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Poppins'] tracking-tight text-white">
              Strategic Partnerships & Services
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Se a sua corporação necessita de desenvolvimento tecnológico robusto, consultoria especializada ou cobertura jornalística audiovisual completa, inicie a conversa com a nossa equipe.
            </p>
          </motion.div>

          {/* Central Form Container with Glowing Neon Borders */}
          <div className="max-w-2xl mx-auto">
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-8 sm:p-10 rounded-3xl bg-zinc-900/90 border border-purple-500/40 shadow-[0_0_50px_rgba(138,43,226,0.2)] backdrop-blur-2xl relative"
            >
              {/* Form Success State */}
              {isSuccess ? (
                <div className="text-center space-y-6 py-8">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-['Poppins']">
                      Solicitação Registrada com Sucesso
                    </h3>
                    <p className="text-xs text-zinc-300 mt-2">
                      Nossa diretoria executiva entrará em contato em regime confidencial pelo e-mail informado.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-zinc-400">
                    <div>PROTOCOLO DE ATENDIMENTO CORPORATIVO:</div>
                    <div className="text-lg font-bold text-cyan-400 mt-1">{protocolNumber}</div>
                  </div>

                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: '',
                        company: '',
                        email: '',
                        subject: 'Consultoria Tech / Desenvolvimento Web',
                        message: ''
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-white transition-colors cursor-pointer"
                  >
                    Enviar Outra Solicitação
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Grid Nome & Empresa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400" />
                        <span>Nome Completo *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Carlos Albuquerque"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-zinc-600 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Empresa / Organização *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Ex: Grupo Alpha Mídia"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-zinc-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* E-mail Corporativo */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>E-mail Corporativo *</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="carlos@grupoalphamidia.com.br"
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-zinc-600 transition-colors font-mono"
                    />
                  </div>

                  {/* Assunto Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      <span>Assunto / Área de Interesse *</span>
                    </label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/70 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs text-white transition-colors cursor-pointer"
                    >
                      <option value="Consultoria Tech / Desenvolvimento Web">
                        Consultoria Tech / Desenvolvimento Web
                      </option>
                      <option value="Cobertura Audiovisual / Fotografia Documental">
                        Cobertura Audiovisual / Fotografia Documental
                      </option>
                      <option value="Jornalismo Investigativo / OSINT sob Medida">
                        Jornalismo Investigativo / OSINT sob Medida
                      </option>
                      <option value="Outros / Parceria Estratégica">
                        Outros / Parceria Estratégica
                      </option>
                    </select>
                  </div>

                  {/* Mensagem / Escopo */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-300">
                      <span>Escopo do Projeto ou Demanda</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Descreva resumidamente os objetivos técnicos ou editoriais da sua organização..."
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-zinc-600 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button with High-Vibrance Hover Effect */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-mono font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(138,43,226,0.4)] hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer group disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Enviando Requisição...</span>
                      </div>
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-200" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <span className="text-[10px] font-mono text-zinc-500">
                      Privacidade estrita. Retorno corporativo sob regime de NDA.
                    </span>
                  </div>
                </form>
              )}

              {/* Direct Mail Option */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>Contato direto da diretoria:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">investidores@capynews.com.br</span>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Copiar e-mail"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FOOTER INTERNO DA DRAFT STUDIO                               */}
        {/* ============================================================ */}
        <footer className="pt-16 pb-8 border-t border-white/10 text-xs font-mono text-zinc-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <DraftLogo className="h-5 w-auto" />
            <span>&copy; {new Date().getFullYear()} Draft Creative Studio Ltda. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Tecnologia, Dados & Engenharia</span>
            <span>&bull;</span>
            <button
              onClick={onClose}
              className="text-cyan-400 hover:text-white underline cursor-pointer"
            >
              Voltar ao CapyNews
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
