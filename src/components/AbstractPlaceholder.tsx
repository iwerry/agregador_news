import React, { useMemo } from 'react';

interface AbstractPlaceholderProps {
  id: string;
  topic: string;
  source: string;
  region: string;
  heightClass?: string;
}

export const AbstractPlaceholder: React.FC<AbstractPlaceholderProps> = ({
  id,
  topic,
  source,
  region,
  heightClass = 'h-48'
}) => {
  // Deterministic seed generation based on article id
  const seed = useMemo(() => {
    let s = 0;
    for (let i = 0; i < id.length; i++) {
      s = (s * 31 + id.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(s);
  }, [id]);

  // Generative points and scribbles
  const { lines, circles, polyline, accentColor, glowColor } = useMemo(() => {
    const isCyan = seed % 2 === 0;
    const accent = isCyan ? '#00E5FF' : '#A855F7';
    const glow = isCyan ? 'rgba(0, 229, 255, 0.25)' : 'rgba(168, 85, 247, 0.25)';

    // Generate scribbly cyber lines
    const genLines = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const x1 = ((seed + i * 47) % 360) + 20;
      const y1 = ((seed * (i + 1) * 29) % 140) + 20;
      const x2 = ((seed * (i + 3) * 61) % 360) + 20;
      const y2 = ((seed + i * 83) % 140) + 20;
      genLines.push({ x1, y1, x2, y2, strokeWidth: (i % 2 === 0 ? 1.5 : 0.75) });
    }

    // Nodes
    const genCircles = [];
    for (let i = 0; i < 6; i++) {
      const cx = ((seed + i * 71) % 350) + 25;
      const cy = ((seed * (i + 2) * 37) % 130) + 25;
      const r = (i % 3 === 0 ? 3.5 : 2);
      genCircles.push({ cx, cy, r });
    }

    // Scribbled tech contour
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const px = 40 + i * 70 + ((seed * (i + 1)) % 30);
      const py = 30 + ((seed * (i + 2) * 19) % 110);
      pts.push(`${px},${py}`);
    }

    return {
      lines: genLines,
      circles: genCircles,
      polyline: pts.join(' '),
      accentColor: accent,
      glowColor: glow
    };
  }, [seed]);

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden rounded-t-xl bg-[#151518] border-b border-neutral-800/80 select-none group-hover:border-purple-500/30 transition-colors`}>
      {/* Abstract Tech SVG Canvas */}
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 400 180"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e182e" />
            <stop offset="50%" stopColor="#121216" />
            <stop offset="100%" stopColor="#0f1924" />
          </linearGradient>
          <pattern id={`tech-grid-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Deep background */}
        <rect width="100%" height="100%" fill={`url(#grad-${id})`} />
        <rect width="100%" height="100%" fill={`url(#tech-grid-${id})`} />

        {/* Abstract scribble lines */}
        {lines.map((l, idx) => (
          <line
            key={`l-${idx}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={accentColor}
            strokeWidth={l.strokeWidth}
            strokeDasharray={idx % 2 === 0 ? '4 3' : undefined}
            opacity="0.25"
          />
        ))}

        {/* Scribbled polyline wave */}
        <polyline
          points={polyline}
          fill="none"
          stroke={accentColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.45"
        />

        {/* Tech crosshairs / coordinate marks */}
        <g stroke="rgba(255,255,255,0.18)" strokeWidth="1">
          <line x1="25" y1="20" x2="35" y2="20" />
          <line x1="30" y1="15" x2="30" y2="25" />
          <line x1="365" y1="155" x2="375" y2="155" />
          <line x1="370" y1="150" x2="370" y2="160" />
        </g>

        {/* Constellation nodes */}
        {circles.map((c, idx) => (
          <g key={`c-${idx}`}>
            <circle cx={c.cx} cy={c.cy} r={c.r + 3} fill={glowColor} />
            <circle cx={c.cx} cy={c.cy} r={c.r} fill={accentColor} opacity="0.8" />
          </g>
        ))}

        {/* Watermark RSS wave icon in background */}
        <path
          d="M 330 140 A 30 30 0 0 0 300 110 M 330 150 A 40 40 0 0 0 290 110"
          stroke="rgba(138, 43, 226, 0.12)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Foreground Topic & Region Badges */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5">
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider bg-black/60 text-purple-300 border border-purple-800/40 backdrop-blur-md">
          {topic.toUpperCase()}
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-neutral-900/60 text-neutral-400 border border-neutral-700/40 backdrop-blur-md">
          {region}
        </span>
      </div>

      {/* Source pill at bottom right */}
      <div className="absolute bottom-2 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono text-neutral-300">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        <span>{source}</span>
      </div>

      {/* Tech telemetry watermark */}
      <div className="absolute bottom-2 left-3 text-[9px] font-mono text-neutral-500 tracking-wider">
        SYS.NODE // #{id.slice(-4).toUpperCase()}
      </div>
    </div>
  );
};
