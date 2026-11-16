interface LogoProps {
  className?: string;
}

export function YapeLogo({ className = 'h-10 w-16' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 96 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Logo oficial de Yape"
    >
      <rect width="96" height="44" rx="8" fill="#742384" />
      <path
        d="M72 10C77.5 10 82 14.5 82 20C82 23.2 80.5 26 78 27.8"
        stroke="#00D0B4"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="77.5" cy="20" r="2.2" fill="#00D0B4" />
      <text
        x="42"
        y="28.5"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Montserrat, system-ui, sans-serif"
        fontSize="19"
        fontWeight="800"
        letterSpacing="-0.5"
      >
        yape
      </text>
    </svg>
  );
}

export function PlinLogo({ className = 'h-10 w-16' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 96 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Logo oficial de Plin"
    >
      <defs>
        <linearGradient
          id="plinGrad"
          x1="0"
          y1="0"
          x2="96"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#00D4B4" />
          <stop offset="55%" stopColor="#00A6E0" />
          <stop offset="100%" stopColor="#2D5BFF" />
        </linearGradient>
      </defs>
      <rect width="96" height="44" rx="8" fill="url(#plinGrad)" />
      <path
        d="M17 15L23 11L20 19H25L18 29L20.5 21.5H15.5L17 15Z"
        fill="#FFFFFF"
      />
      <text
        x="56"
        y="28.5"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Montserrat, system-ui, sans-serif"
        fontSize="19"
        fontWeight="800"
        letterSpacing="-0.3"
      >
        Plin
      </text>
    </svg>
  );
}
