import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Logo } from './Logo';
import type { NavVariant } from '../types';



interface MarketingNavProps {

  variant?: NavVariant;

  verticalLabel?: string;

  ctaHref?: string;

  ctaLabel?: string;

}



export function MarketingNav({

  variant = 'full',

  verticalLabel,

  ctaHref = '/#demo',

  ctaLabel = 'Get a Live Demo',

}: MarketingNavProps) {

  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLight, toggleMode } = useTheme();
  const isHome = location.pathname === '/';

  const hashLink = (hash: string) => (isHome ? hash : `/${hash}`);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);



  const navLinks = (

    <>

      <a href={hashLink('#how-it-works')} onClick={close} className="text-[13px] text-[#a0a0a0] hover:text-white transition-colors no-underline whitespace-nowrap">

        How It Works

      </a>

      <Link to="/industries" onClick={close} className={`text-[13px] no-underline transition-colors whitespace-nowrap ${location.pathname.startsWith('/industries') ? 'text-up-green' : 'text-[#a0a0a0] hover:text-white'}`}>

        Industries

      </Link>

      {isHome && (

        <a href="#blueprints" onClick={close} className="text-[13px] text-[#a0a0a0] hover:text-white transition-colors no-underline whitespace-nowrap">

          Blueprints

        </a>

      )}

      <a href={hashLink('#analytics')} onClick={close} className="text-[13px] text-[#a0a0a0] hover:text-white transition-colors no-underline whitespace-nowrap">

        Analytics

      </a>

      <a href={hashLink('#pricing')} onClick={close} className="text-[13px] text-[#a0a0a0] hover:text-white transition-colors no-underline whitespace-nowrap">

        Pricing

      </a>

    </>

  );



  const navActions = (

    <div className="flex items-center gap-3 shrink-0">

      <button

        type="button"

        onClick={toggleMode}

        className="p-2 rounded-lg hover:bg-white/5 text-[#a0a0a0] hover:text-white transition-colors"

        aria-label="Toggle theme"

      >

        {isLight ? <Moon size={16} /> : <Sun size={16} />}

      </button>

      <button

        type="button"

        onClick={() => navigate('/login')}

        className="text-[13px] text-[#a0a0a0] hover:text-white transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"

      >

        Login

      </button>

      <a

        href={hashLink('#demo')}

        onClick={close}

        className="font-display font-semibold text-[13px] bg-up-green text-black px-4 sm:px-5 py-2 rounded-md no-underline hover:shadow-[0_0_24px_rgba(0,255,136,0.15)] transition-all whitespace-nowrap"

      >

        Get a Live Demo

      </a>

    </div>

  );



  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-[1000] h-16 flex items-center bg-black/82 backdrop-blur-xl border-b border-up-dark-3">
        <div className="container-main w-full flex items-center justify-between gap-4">
          {variant === 'full' ? (
            <>
              {/* Left: logo + links */}
              <div className="flex items-center gap-6 lg:gap-8 min-w-0 flex-1">
                <Logo to="/" />
                <div className="hidden lg:flex items-center gap-6 xl:gap-7 min-w-0">
                  {navLinks}
                </div>
              </div>

              {/* Right: theme, login, CTA */}
              <div className="hidden lg:flex items-center">
                {navActions}
              </div>

              {/* Mobile toggle */}
              <button
                type="button"
                className="lg:hidden p-2 text-white shrink-0"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center min-w-0">
                <Logo to="/" />
                {verticalLabel && (
                  <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-[#555] border-l border-up-dark-4 pl-3.5 ml-3.5 truncate">
                    {verticalLabel}
                  </span>
                )}
              </div>
              <a
                href={ctaHref.startsWith('#') && !isHome ? `/${ctaHref}` : ctaHref}
                className="font-display font-semibold text-[13px] bg-up-green text-black px-4 sm:px-5 py-2 rounded-md no-underline hover:shadow-[0_0_24px_rgba(0,255,136,0.15)] transition-all whitespace-nowrap shrink-0"
              >
                {ctaLabel}
              </a>
            </>
          )}
        </div>
      </nav>

      {/* Outside nav: backdrop-filter on nav would trap position:fixed and clip the panel to h-16 */}
      {variant === 'full' && open && (
        <div className="lg:hidden fixed inset-0 top-16 z-[999] bg-black/96 backdrop-blur-xl overflow-y-auto">
          <div className="container-main py-8 flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              {navLinks}
            </div>
            <div className="pt-6 border-t border-up-dark-3 flex flex-col sm:flex-row sm:items-center gap-4">
              {navActions}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


