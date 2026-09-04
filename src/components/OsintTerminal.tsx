import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, CheckCircle2, RotateCcw, Play, Pause } from 'lucide-react';

interface OsintTerminalProps {
  className?: string;
  autoStart?: boolean;
}

export const OsintTerminal: React.FC<OsintTerminalProps> = ({
  className = '',
  autoStart = true
}) => {
  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Terminal Script State
  // Step tracker:
  // 0: Initial prompt cursor
  // 1: Typing command 1: wget ...
  // 2: wget outputs (resolving, connected, http 200, progress bar)
  // 3: Typing command 2: exiftool ...
  // 4: Processing delay
  // 5: Exif metadata outputs
  // 6: Anomaly warnings (pulsing alert)
  // 7: Finished hold (5s) -> loop reset
  const [step, setStep] = useState(0);
  const [typedCmd1, setTypedCmd1] = useState('');
  const [typedCmd2, setTypedCmd2] = useState('');
  const [progressWidth, setProgressWidth] = useState(0);
  const [metadataLinesVisible, setMetadataLinesVisible] = useState(0);
  const [alertsVisible, setAlertsVisible] = useState(false);

  const cmd1Full = 'wget https://news-server.com/assets/img_conflito_01.jpg';
  const cmd2Full = 'exiftool img_conflito_01.jpg | grep -i "GPS\\|Date\\|Software"';

  // Intersection Observer to trigger when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reset state helper
  const resetTerminal = () => {
    setStep(0);
    setTypedCmd1('');
    setTypedCmd2('');
    setProgressWidth(0);
    setMetadataLinesVisible(0);
    setAlertsVisible(false);
  };

  // Main animation runner
  useEffect(() => {
    if (!inView || !isPlaying) return;

    let timeoutId: NodeJS.Timeout;

    // Step 0: Initial wait before typing command 1
    if (step === 0) {
      timeoutId = setTimeout(() => {
        setStep(1);
      }, 700);
    }

    // Step 1: Type command 1 character by character
    else if (step === 1) {
      if (typedCmd1.length < cmd1Full.length) {
        timeoutId = setTimeout(() => {
          setTypedCmd1(cmd1Full.slice(0, typedCmd1.length + 1));
        }, 28 + Math.random() * 25);
      } else {
        timeoutId = setTimeout(() => {
          setStep(2);
        }, 350);
      }
    }

    // Step 2: Show network response + progress bar
    else if (step === 2) {
      if (progressWidth < 100) {
        timeoutId = setTimeout(() => {
          setProgressWidth(prev => Math.min(100, prev + 25));
        }, 120);
      } else {
        timeoutId = setTimeout(() => {
          setStep(3);
        }, 500);
      }
    }

    // Step 3: Type command 2
    else if (step === 3) {
      if (typedCmd2.length < cmd2Full.length) {
        timeoutId = setTimeout(() => {
          setTypedCmd2(cmd2Full.slice(0, typedCmd2.length + 1));
        }, 30 + Math.random() * 20);
      } else {
        timeoutId = setTimeout(() => {
          setStep(4);
        }, 400);
      }
    }

    // Step 4: Simulated exif parsing delay
    else if (step === 4) {
      timeoutId = setTimeout(() => {
        setStep(5);
      }, 450);
    }

    // Step 5: Reveal metadata lines sequentially (3 lines)
    else if (step === 5) {
      if (metadataLinesVisible < 3) {
        timeoutId = setTimeout(() => {
          setMetadataLinesVisible(prev => prev + 1);
        }, 220);
      } else {
        timeoutId = setTimeout(() => {
          setStep(6);
        }, 900);
      }
    }

    // Step 6: Reveal flashing anomaly alerts
    else if (step === 6) {
      setAlertsVisible(true);
      timeoutId = setTimeout(() => {
        setStep(7);
      }, 5500); // Hold for 5.5 seconds
    }

    // Step 7: Clear screen and loop back
    else if (step === 7) {
      resetTerminal();
    }

    return () => clearTimeout(timeoutId);
  }, [inView, isPlaying, step, typedCmd1, typedCmd2, progressWidth, metadataLinesVisible]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl bg-slate-950/85 border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden font-mono text-xs ${className}`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800/80 select-none">
        {/* Three Mac-style window control dots */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetTerminal}
            title="Reiniciar Terminal"
            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center group"
          />
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pausar" : "Executar"}
            className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center group"
          />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] opacity-90" />
          
          <span className="ml-2 text-[11px] text-zinc-400 font-medium hidden sm:inline-flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>draft_osint_forensics.sh &mdash; bash &mdash; 80x24</span>
          </span>
        </div>

        {/* Live Status & Interactive Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400">LIVE OSINT EMULATION</span>
          </div>

          <div className="h-3 w-[1px] bg-slate-700 hidden sm:block" />

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-[10px] text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 flex items-center gap-1 transition-colors cursor-pointer"
            title={isPlaying ? "Pausar animação" : "Continuar animação"}
          >
            {isPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={resetTerminal}
            className="text-[10px] text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 flex items-center gap-1 transition-colors cursor-pointer"
            title="Reiniciar animação"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div className="p-4 sm:p-6 min-h-[300px] sm:min-h-[330px] overflow-x-auto space-y-3 leading-relaxed text-zinc-300 custom-scrollbar">
        {/* Command 1 Prompt */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-emerald-400 font-bold">analyst@draft-osint:~$</span>
          <span className="text-white font-medium break-all">{typedCmd1}</span>
          {step === 1 && (
            <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse align-middle" />
          )}
        </div>

        {/* Command 1 Output (wget progress) */}
        {step >= 2 && (
          <div className="space-y-1.5 text-zinc-400 text-[11px] sm:text-xs pl-2 border-l border-slate-800 animate-fadeIn">
            <div className="text-zinc-400">Resolving news-server.com (198.51.100.42)... connected.</div>
            <div className="text-zinc-300">HTTP request sent, awaiting response... <span className="text-emerald-400 font-bold">200 OK</span></div>
            <div className="text-zinc-400">Length: 4,821,904 bytes (4.6M) [image/jpeg]</div>
            
            {/* Download Progress Bar */}
            <div className="flex items-center gap-2 pt-1 font-mono">
              <span className="text-zinc-500">Saving to: 'img_conflito_01.jpg'</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-cyan-400">
              <span className="text-zinc-400">[</span>
              <span className="text-cyan-400 font-bold tracking-tighter">
                {'='.repeat(Math.floor(progressWidth / 2.5))}
                {progressWidth < 100 ? '>' : ''}
                {'.'.repeat(Math.max(0, 40 - Math.floor(progressWidth / 2.5) - (progressWidth < 100 ? 1 : 0)))}
              </span>
              <span className="text-zinc-400">]</span>
              <span className="text-white font-bold">{progressWidth}%</span>
              <span className="text-zinc-400 text-[10px]">3.4MB/s eta 0s</span>
            </div>
            {progressWidth === 100 && (
              <div className="text-emerald-400 text-[10px] font-bold">
                ✓ 'img_conflito_01.jpg' saved [4821904/4821904]
              </div>
            )}
          </div>
        )}

        {/* Command 2 Prompt (exiftool) */}
        {step >= 3 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-emerald-400 font-bold">analyst@draft-osint:~$</span>
            <span className="text-white font-medium break-all">{typedCmd2}</span>
            {step === 3 && (
              <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse align-middle" />
            )}
          </div>
        )}

        {/* Step 4: Spinner / Searching */}
        {step === 4 && (
          <div className="flex items-center gap-2 text-zinc-500 text-[11px] pl-2">
            <span className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Parsing EXIF headers & GPS rational coordinates...</span>
          </div>
        )}

        {/* Step 5: Extracted Metadata (Line by Line) */}
        {step >= 5 && (
          <div className="space-y-1.5 pl-2 border-l border-cyan-900/50 text-[11px] sm:text-xs">
            {metadataLinesVisible >= 1 && (
              <div className="flex flex-wrap gap-x-3 text-zinc-300 animate-fadeIn">
                <span className="text-zinc-500 w-36 sm:w-44 shrink-0 font-medium">Date/Time Original</span>
                <span className="text-zinc-400 font-mono">:</span>
                <span className="text-zinc-200 font-semibold">2018-04-12 14:22:00</span>
              </div>
            )}
            {metadataLinesVisible >= 2 && (
              <div className="flex flex-wrap gap-x-3 text-zinc-300 animate-fadeIn">
                <span className="text-zinc-500 w-36 sm:w-44 shrink-0 font-medium">Software</span>
                <span className="text-zinc-400 font-mono">:</span>
                <span className="text-cyan-300 font-semibold">Adobe Photoshop 2024</span>
              </div>
            )}
            {metadataLinesVisible >= 3 && (
              <div className="flex flex-wrap gap-x-3 text-zinc-300 animate-fadeIn">
                <span className="text-zinc-500 w-36 sm:w-44 shrink-0 font-medium">GPS Position</span>
                <span className="text-zinc-400 font-mono">:</span>
                <span className="text-amber-300 font-semibold">55°45'20.8"N, 37°37'03.5"E</span>
              </div>
            )}
          </div>
        )}

        {/* Step 6: Flashing Alert / Anomaly Detection */}
        {alertsVisible && (
          <div className="pt-2 space-y-2 animate-fadeIn">
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-300 text-[11px] sm:text-xs shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold shrink-0">&gt; [!]</span>
                <span className="font-bold tracking-wide">
                  ANOMALY DETECTED: Metadata date precedes the event by 8 years.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/60 text-red-300 text-[11px] sm:text-xs shadow-[0_0_25px_rgba(239,68,68,0.25)] animate-pulse">
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0">&gt; [!]</span>
                <span className="font-bold tracking-wide">
                  OSINT MATCH: Location coordinates contradict the published narrative.
                </span>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono pt-1 flex items-center justify-between">
              <span>FORENSIC VERDICT: MISINFORMATION / RECYCLED ARCHIVE MEDIA</span>
              <span className="text-cyan-400">RESTARTING CYCLE IN 5S...</span>
            </div>
          </div>
        )}

        {/* Prompt cursor when idle */}
        {step === 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">analyst@draft-osint:~$</span>
            <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse" />
          </div>
        )}
      </div>

      {/* Terminal Footer Bar */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 text-[10px] font-mono text-zinc-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">DRAFT_OSINT_KERNEL_v4.2</span>
          <span>&bull;</span>
          <span>EXIFTOOL_12.70</span>
          <span>&bull;</span>
          <span>GEO_RADAR</span>
        </div>
        <div className="text-zinc-400">
          STATUS: <span className={alertsVisible ? "text-red-400 font-bold animate-pulse" : "text-emerald-400 font-bold"}>
            {alertsVisible ? "BREACH_IDENTIFIED" : "MONITORING_STREAM"}
          </span>
        </div>
      </div>
    </div>
  );
};
