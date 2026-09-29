import { useId } from "react";

type ZelioLogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
};

/**
 * ZELIO wordmark. The Z mark is two interlocking gradient ribbons forming a Z,
 * drawn as inline SVG (no image assets).
 */
export default function ZelioLogo({
  className = "",
  markClassName = "h-8 w-8",
  wordmarkClassName = "text-[22px] font-extrabold tracking-tight text-ink",
}: ZelioLogoProps) {
  const uid = useId();
  const g1 = `zelio-z1-${uid}`;
  const g2 = `zelio-z2-${uid}`;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 24 24" className={markClassName} aria-hidden="true">
        <defs>
          <linearGradient id={g1} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#258BFF" />
            <stop offset="100%" stopColor="#6157FF" />
          </linearGradient>
          <linearGradient id={g2} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B642FF" />
            <stop offset="100%" stopColor="#FF3E9D" />
          </linearGradient>
        </defs>
        {/* Ribbon one: top bar + diagonal */}
        <path
          d="M5.5 5.5 H18.5 L8.2 18.5"
          fill="none"
          stroke={`url(#${g1})`}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Ribbon two: bottom bar, woven over the first at the joint */}
        <path
          d="M8.2 18.5 H18.5"
          fill="none"
          stroke={`url(#${g2})`}
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </svg>
      <span className={wordmarkClassName}>ZELIO</span>
    </span>
  );
}
