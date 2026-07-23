"use client";

export function CrescentProgress({ percent, size = 168 }: { percent: number; size?: number }) {
  const clamped = Math.max(2, Math.min(100, percent));
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={9}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#crescentGradient)"
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="crescentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3F9364" />
            <stop offset="100%" stopColor="#D4B458" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* crescent moon glyph, fill grows with progress via mask */}
        <svg width={size * 0.34} height={size * 0.34} viewBox="0 0 100 100" className="mb-1">
          <defs>
            <clipPath id="moonClip">
              <path d="M50 5 A45 45 0 1 0 50 95 A35 35 0 1 1 50 5 Z" />
            </clipPath>
          </defs>
          <path
            d="M50 5 A45 45 0 1 0 50 95 A35 35 0 1 1 50 5 Z"
            fill="rgba(255,255,255,0.06)"
          />
          <rect
            x="0"
            y={100 - clamped}
            width="100"
            height={clamped}
            fill="#C9A227"
            clipPath="url(#moonClip)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="font-display text-2xl text-beige-50">{Math.round(clamped)}%</span>
        <span className="text-[11px] uppercase tracking-wide text-sand-400">du chemin</span>
      </div>
    </div>
  );
}
