export default function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {/* Icône stylisée Skolr */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#2463EB" />
            <stop offset="100%" stopColor="#5EEAD4" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="64"
          height="64"
          rx="14"
          fill="url(#g)"
        />
        <path
          d="M18 24c0-4.418 5.373-8 12-8h4c6.627 0 12 3.582 12 8 0 4.418-5.373 8-12 8h-8c-6.627 0-12 3.582-12 8s5.373 8 12 8h4c6.627 0 12-3.582 12-8"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {withText && (
        <span className="font-poppins text-xl font-semibold text-ink">
          Skolr
        </span>
      )}
    </div>
  );
}
