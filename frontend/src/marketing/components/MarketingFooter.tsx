import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Logo } from './Logo';

export function MarketingFooter() {
  const navigate = useNavigate();
  const { isUK } = useTheme();
  return (
    <footer className="border-t border-up-dark-3 py-6">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <Logo to="/" size={24} />
            <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] mt-3 leading-relaxed tracking-wide">
              Q-UP.AI LLC
              <br />
              Texas, United States
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))] tracking-widest mb-3">Navigate</p>
            <ul className="space-y-2 list-none p-0 m-0">
              <li><Link to="/how-it-works" className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--muted-foreground))] no-underline transition-colors">How It Works</Link></li>
              <li><Link to="/industries" className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--muted-foreground))] no-underline transition-colors">Industries</Link></li>
              <li><Link to="/pricing" className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--muted-foreground))] no-underline transition-colors">Pricing</Link></li>
              <li><Link to="/demo" className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--muted-foreground))] no-underline transition-colors">Live Demo</Link></li>
              <li>
                <button type="button" onClick={() => navigate('/client/dashboard')} className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--muted-foreground))] bg-transparent border-none cursor-pointer p-0 transition-colors">
                  Client Portal
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))] tracking-widest mb-3">Legal</p>
            <ul className="space-y-2 list-none p-0 m-0">
              <li><Link to="/privacy-policy" className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--muted-foreground))] no-underline transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--muted-foreground))] no-underline transition-colors">Terms of Service</Link></li>
              <li><Link to="/tcpa-notice" className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--muted-foreground))] no-underline transition-colors">TCPA Notice</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-up-dark-3 font-mono text-[10px] text-[hsl(var(--muted-foreground))] tracking-wide">
          <span>© 2026 Q-UP.AI LLC. All rights reserved.</span>
          <span>{isUK ? 'PECR/TPS screening · GDPR-oriented program' : 'TCPA Compliant · STIR/SHAKEN attested traffic'}</span>
        </div>
      </div>
    </footer>
  );
}
