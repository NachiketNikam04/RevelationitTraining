export function BackgroundTexture() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-brand-bg select-none"
      aria-hidden="true"
    >
      {/* Subtle radial ambient gradients for warm depth */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-brand-orange/5 via-brand-blue/5 to-transparent blur-3xl opacity-70 rounded-full pointer-events-none" />
      <div className="absolute top-[35%] -left-48 w-96 h-96 bg-brand-blue/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-[55%] -right-48 w-96 h-96 bg-brand-orange/5 blur-3xl rounded-full pointer-events-none" />

      {/* SVG Grid of rounded squares with diamond/star-shaped intersection gaps */}
      <svg
        className="absolute inset-0 h-full w-full opacity-70"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="rounded-square-pattern"
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            {/* Rounded square tile */}
            <rect
              x="3"
              y="3"
              width="38"
              height="38"
              rx="9"
              ry="9"
              fill="none"
              stroke="#000000"
              strokeOpacity="0.045"
              strokeWidth="1.2"
            />
            {/* Subtle diamond / 4-pointed star gap accent at the 4-corner intersection */}
            <path
              d="M0 -3 C0 -1 1 0 3 0 C1 0 0 1 0 3 C0 1 -1 0 -3 0 C-1 0 0 -1 0 -3 Z"
              fill="#000000"
              fillOpacity="0.04"
            />
            <path
              d="M44 41 C44 43 45 44 47 44 C45 44 44 45 44 47 C44 45 43 44 41 44 C43 44 44 43 44 41 Z"
              fill="#000000"
              fillOpacity="0.04"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rounded-square-pattern)" />
      </svg>
    </div>
  );
}
