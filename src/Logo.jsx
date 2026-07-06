/* ------------------------------------------------------------------
   Kangal Games — brand marks
   A clean, modern vector emblem of an Anatolian Kangal head plus a
   typographic wordmark. Designed to sit on dark, cinematic surfaces.
   Drop-in replacement: to use your official raster logo instead, set
   the `src` on the <img> in App.jsx's hero to /logo.png (see README).
   ------------------------------------------------------------------ */

export function KangalEmblem({ size = 120, style, glow = true }) {
  const id = 'kg-' + Math.round(size)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      role="img"
      aria-label="Kangal Games emblem"
    >
      <defs>
        <linearGradient id={`${id}-fur`} x1="120" y1="30" x2="120" y2="215" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e7c48d" />
          <stop offset="0.55" stopColor="#c99a5b" />
          <stop offset="1" stopColor="#9c6f3c" />
        </linearGradient>
        <linearGradient id={`${id}-ear`} x1="120" y1="40" x2="120" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7c5630" />
          <stop offset="1" stopColor="#4f3921" />
        </linearGradient>
        <radialGradient id={`${id}-eye`} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#ffdf9e" />
          <stop offset="0.6" stopColor="#e8a23d" />
          <stop offset="1" stopColor="#9c5a12" />
        </radialGradient>
        {glow && (
          <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.55" />
          </filter>
        )}
      </defs>

      <g filter={glow ? `url(#${id}-shadow)` : undefined}>
        {/* Ears */}
        <path d="M78 70 C52 66 40 92 46 128 C52 158 74 168 90 150 C82 118 84 88 78 70 Z" fill={`url(#${id}-ear)`} />
        <path d="M162 70 C188 66 200 92 194 128 C188 158 166 168 150 150 C158 118 156 88 162 70 Z" fill={`url(#${id}-ear)`} />

        {/* Head + muzzle silhouette */}
        <path
          d="M120 34
             C158 34 176 58 180 92
             C183 118 178 138 168 156
             C160 172 150 184 138 196
             C132 202 126 206 120 206
             C114 206 108 202 102 196
             C90 184 80 172 72 156
             C62 138 57 118 60 92
             C64 58 82 34 120 34 Z"
          fill={`url(#${id}-fur)`}
        />

        {/* Cheek fur ruff accents */}
        <path d="M70 150 C64 168 70 184 84 194 C78 178 74 164 74 152 Z" fill="#b98a4e" opacity="0.7" />
        <path d="M170 150 C176 168 170 184 156 194 C162 178 166 164 166 152 Z" fill="#b98a4e" opacity="0.7" />

        {/* Forehead furrow shading */}
        <path d="M120 60 C112 76 108 92 110 110 L118 108 L120 66 Z" fill="#8f6636" opacity="0.45" />
        <path d="M120 60 C128 76 132 92 130 110 L122 108 L120 66 Z" fill="#8f6636" opacity="0.45" />

        {/* Brows */}
        <path d="M84 108 C96 100 108 100 116 106 C106 104 96 106 88 114 Z" fill="#7c5630" />
        <path d="M156 108 C144 100 132 100 124 106 C134 104 144 106 152 114 Z" fill="#7c5630" />

        {/* Eyes */}
        <ellipse cx="97" cy="120" rx="12" ry="10" fill="#2a1c11" />
        <ellipse cx="143" cy="120" rx="12" ry="10" fill="#2a1c11" />
        <circle cx="98" cy="119" r="7.5" fill={`url(#${id}-eye)`} />
        <circle cx="142" cy="119" r="7.5" fill={`url(#${id}-eye)`} />
        <circle cx="100.5" cy="116.5" r="2.2" fill="#fff7e6" />
        <circle cx="144.5" cy="116.5" r="2.2" fill="#fff7e6" />

        {/* Black mask / muzzle (signature Kangal marking) */}
        <path
          d="M120 128
             C104 128 92 140 90 158
             C88 176 100 194 120 200
             C140 194 152 176 150 158
             C148 140 136 128 120 128 Z"
          fill="#241812"
        />
        {/* Nose */}
        <path d="M120 150 C112 150 106 156 106 162 C106 169 113 174 120 174 C127 174 134 169 134 162 C134 156 128 150 120 150 Z" fill="#0e0a08" />
        <ellipse cx="115" cy="159" rx="2.4" ry="3" fill="#3a2c22" />
        <ellipse cx="125" cy="159" rx="2.4" ry="3" fill="#3a2c22" />
        {/* Mouth line */}
        <path d="M120 174 L120 188 M120 188 C112 190 106 188 102 184 M120 188 C128 190 134 188 138 184" stroke="#0e0a08" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  )
}

export function Wordmark({ compact = false }) {
  return (
    <span className={`wordmark ${compact ? 'wordmark--compact' : ''}`}>
      <span className="wordmark__k">KANGAL</span>
      <span className="wordmark__g">GAMES</span>
    </span>
  )
}

export function LogoLockup({ emblemSize = 40 }) {
  return (
    <span className="logo-lockup">
      <KangalEmblem size={emblemSize} glow={false} />
      <Wordmark compact />
    </span>
  )
}
