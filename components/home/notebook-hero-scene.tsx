export function NotebookHeroScene() {
  return (
    <div className="relative min-h-[390px] w-full overflow-hidden sm:min-h-[460px] lg:min-h-[550px]" aria-hidden="true">
      <style>{`
        @keyframes ax-note-float-a { 0%,100% { transform: translate3d(0,0,0) rotate(-7deg); } 50% { transform: translate3d(0,-8px,0) rotate(-5.5deg); } }
        @keyframes ax-note-float-b { 0%,100% { transform: translate3d(0,0,0) rotate(5deg); } 50% { transform: translate3d(0,7px,0) rotate(3.5deg); } }
        @keyframes ax-note-drift { 0%,100% { transform: translate3d(0,0,0); opacity:.7; } 50% { transform: translate3d(6px,-5px,0); opacity:1; } }
        @media (prefers-reduced-motion: reduce) { .ax-note-a,.ax-note-b,.ax-note-drift { animation:none !important; } }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_57%_48%,rgba(83,154,238,0.12),transparent_30%),radial-gradient(circle_at_76%_35%,rgba(120,106,235,0.055),transparent_28%)]" />

      <svg viewBox="0 0 760 520" className="absolute inset-0 h-full w-full" role="presentation">
        <defs>
          <linearGradient id="note-page-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.96" />
            <stop offset="1" stopColor="#edf5ff" stopOpacity="0.82" />
          </linearGradient>
          <linearGradient id="note-page-b" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f8fbff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ece8ff" stopOpacity="0.68" />
          </linearGradient>
          <filter id="note-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="20" floodColor="#1f3e70" floodOpacity="0.08" />
          </filter>
        </defs>

        <g fill="none" stroke="#7da3dc" strokeWidth="1" opacity="0.22">
          <ellipse cx="422" cy="260" rx="246" ry="74" transform="rotate(-14 422 260)" strokeDasharray="6 9" />
          <ellipse cx="430" cy="264" rx="194" ry="114" transform="rotate(29 430 264)" strokeDasharray="5 10" />
        </g>

        <g className="ax-note-a" style={{ animation: "ax-note-float-a 9s ease-in-out infinite", transformOrigin: "398px 258px" }} filter="url(#note-soft-shadow)">
          <path d="M246 126 L536 106 L588 382 L292 410 Z" fill="url(#note-page-a)" stroke="#dce5f0" strokeWidth="1.2" />
          <path d="M292 181 L498 166" stroke="#9eb2cc" strokeWidth="5" strokeLinecap="round" opacity="0.26" />
          <path d="M292 205 L474 192" stroke="#aab9ce" strokeWidth="3.5" strokeLinecap="round" opacity="0.22" />
          <path d="M292 228 L454 217" stroke="#aab9ce" strokeWidth="3.5" strokeLinecap="round" opacity="0.18" />
          <text x="300" y="280" fill="#18243a" fontSize="26" fontFamily="Georgia, serif">∂u/∂t = α∇²u</text>
          <path d="M310 337 C346 295 386 298 420 331 C454 364 492 367 537 326" fill="none" stroke="#316ec0" strokeWidth="2.5" />
          <path d="M310 353 C350 325 387 322 424 345 C459 367 498 367 538 344" fill="none" stroke="#85aee6" strokeWidth="1.2" opacity="0.7" />
        </g>

        <g className="ax-note-b" style={{ animation: "ax-note-float-b 11s ease-in-out infinite", transformOrigin: "478px 278px" }} opacity="0.88">
          <path d="M430 154 L638 185 L606 374 L404 339 Z" fill="url(#note-page-b)" stroke="#dfe4ee" />
          <text x="456" y="216" fill="#75839a" fontSize="12" fontFamily="system-ui">Observation</text>
          <path d="M458 244 H583" stroke="#8ea0bb" strokeWidth="3" opacity="0.24" strokeLinecap="round" />
          <path d="M458 263 H566" stroke="#8ea0bb" strokeWidth="3" opacity="0.18" strokeLinecap="round" />
          <path d="M458 282 H592" stroke="#8ea0bb" strokeWidth="3" opacity="0.18" strokeLinecap="round" />
          <circle cx="520" cy="318" r="5" fill="#2d6fbd" opacity="0.72" />
          <circle cx="551" cy="308" r="4" fill="#5aa0df" opacity="0.65" />
          <circle cx="579" cy="295" r="3.5" fill="#7b8fe2" opacity="0.6" />
        </g>

        <g className="ax-note-drift" style={{ animation: "ax-note-drift 8s ease-in-out infinite" }}>
          <circle cx="206" cy="220" r="5" fill="#4d9ae0" opacity="0.55" />
          <circle cx="639" cy="133" r="4" fill="#7087e0" opacity="0.42" />
          <circle cx="656" cy="350" r="5" fill="#58b8d4" opacity="0.42" />
          <text x="162" y="164" fill="#7890b9" fontSize="16" fontFamily="Georgia, serif" fontStyle="italic" opacity="0.58">eᶦπ + 1 = 0</text>
          <text x="604" y="424" fill="#7890b9" fontSize="15" fontFamily="Georgia, serif" fontStyle="italic" opacity="0.48">evidence → finding</text>
        </g>
      </svg>

      <div className="absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-[var(--ax-canvas)] to-transparent" />
    </div>
  );
}
