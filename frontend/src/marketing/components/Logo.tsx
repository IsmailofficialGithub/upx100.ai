import { Link } from 'react-router-dom';

interface LogoProps {
  to?: string;
  size?: number;
  className?: string;
}

export function Logo({ to = '/', size = 32, className = '' }: LogoProps) {
  const svg = (
    <svg viewBox="0 0 32 32" fill="none" width={size} height={size} aria-hidden className="text-[hsl(var(--foreground))]">
      <rect x="4" y="6" width="18" height="4" rx="1" fill="currentColor" opacity=".4" />
      <rect x="6" y="12" width="20" height="4" rx="1" fill="currentColor" opacity=".6" />
      <rect x="8" y="18" width="20" height="4" rx="1" fill="currentColor" opacity=".8" />
      <rect x="10" y="24" width="18" height="4" rx="1" fill="currentColor" />
    </svg>
  );

  if (to) {
    return (
      <Link to={to} className={`flex items-center gap-2.5 no-underline ${className}`}>
        {svg}
        <span className="font-mono font-bold text-[17px] text-[hsl(var(--foreground))] tracking-tight">Q-UP.AI</span>
      </Link>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {svg}
      <span className="font-mono font-bold text-[17px] text-[hsl(var(--foreground))] tracking-tight">Q-UP.AI</span>
    </div>
  );
}
