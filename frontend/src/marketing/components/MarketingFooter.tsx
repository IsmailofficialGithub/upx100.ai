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
            <p className="font-mono text-[10px] text-[#555] mt-3 leading-relaxed tracking-wide">
              Q-UP.AI LLC
              <br />
              Texas, United States
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase text-[#555] tracking-widest mb-3">Navigate</p>
            <ul className="space-y-2 list-none p-0 m-0">
              <li><a href="/#how-it-works" className="font-mono text-[11px] text-[#555] hover:text-[#a0a0a0] no-underline transition-colors">How It Works</a></li>
              <li><Link to="/industries" className="font-mono text-[11px] text-[#555] hover:text-[#a0a0a0] no-underline transition-colors">Industries</Link></li>
              <li><a href="/#pricing" className="font-mono text-[11px] text-[#555] hover:text-[#a0a0a0] no-underline transition-colors">Pricing</a></li>
              <li><a href="/#demo" className="font-mono text-[11px] text-[#555] hover:text-[#a0a0a0] no-underline transition-colors">Live Demo</a></li>
              <li>
                <button type="button" onClick={() => navigate('/client/dashboard')} className="font-mono text-[11px] text-[#555] hover:text-[#a0a0a0] bg-transparent border-none cursor-pointer p-0 transition-colors">
                  Client Portal
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase text-[#555] tracking-widest mb-3">Legal</p>
            <ul className="space-y-2 list-none p-0 m-0">
              <li><span className="font-mono text-[11px] text-[#555]">Privacy Policy</span></li>
              <li><span className="font-mono text-[11px] text-[#555]">Terms of Service</span></li>
              <li><span className="font-mono text-[11px] text-[#555]">TCPA Notice</span></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-up-dark-3 font-mono text-[10px] text-[#555] tracking-wide">
          <span>© 2026 Q-UP.AI LLC. All rights reserved.</span>
          <span>{isUK ? 'PECR/TPS screening · GDPR-oriented program' : 'TCPA Compliant · STIR/SHAKEN attested traffic'}</span>
        </div>
      </div>
    </footer>
  );
}
