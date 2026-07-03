import type { ReactNode } from 'react';
import { GradientCanvas } from './GradientCanvas';
import { MarketingNav } from './MarketingNav';
import { MarketingFooter } from './MarketingFooter';
import { useScrollReveal } from '../hooks/useScrollReveal';
import type { NavVariant } from '../types';

interface MarketingShellProps {
  children: ReactNode;
  navVariant?: NavVariant;
  verticalLabel?: string;
  ctaHref?: string;
  ctaLabel?: string;
  canvasOpacity?: number;
}

export function MarketingShell({
  children,
  navVariant = 'full',
  verticalLabel,
  ctaHref,
  ctaLabel,
  canvasOpacity = 0.07,
}: MarketingShellProps) {
  useScrollReveal([children]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <GradientCanvas opacity={canvasOpacity} />
      <div className="relative z-[1]">
        <MarketingNav
          variant={navVariant}
          verticalLabel={verticalLabel}
          ctaHref={ctaHref}
          ctaLabel={ctaLabel}
        />
        <main>{children}</main>
        <MarketingFooter />
      </div>
    </div>
  );
}
