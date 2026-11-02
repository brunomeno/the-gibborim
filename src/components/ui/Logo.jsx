// Shield + sword mark. Gold gradient, works at any size.
export default function Logo({ className = 'size-10' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gib-gold" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f7e3a1" />
          <stop offset="0.5" stopColor="#e9b949" />
          <stop offset="1" stopColor="#b8860b" />
        </linearGradient>
      </defs>
      <path
        d="M24 3 6 9.5v13.2C6 34 13.8 41.8 24 45c10.2-3.2 18-11 18-22.3V9.5L24 3Z"
        fill="#0d0d12"
        stroke="url(#gib-gold)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M24 11v24" stroke="url(#gib-gold)" strokeWidth="3" strokeLinecap="round" />
      <path d="M17 18h14" stroke="url(#gib-gold)" strokeWidth="3" strokeLinecap="round" />
      <path d="m20.5 35 3.5 4 3.5-4" stroke="url(#gib-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
