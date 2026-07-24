import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { loginShowcaseCompanies } from '@/data/mockData';
import { toast } from 'sonner';
import {
  Mail,
  Lock,
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  Zap,
  Globe,
  Building2,
  Eye,
  EyeOff,
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, clearAuth } = useAuth();
  const [email, setEmail] = useState('');

  useEffect(() => {
    clearAuth();
  }, [clearAuth]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showcaseId, setShowcaseId] = useState(loginShowcaseCompanies[0].id);
  const activeShowcase = loginShowcaseCompanies.find((c) => c.id === showcaseId) ?? loginShowcaseCompanies[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      
      // Dynamic redirection based on role
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('redirect');
      const savedAuth = localStorage.getItem('up100x_auth');
      if (savedAuth) {
        const { user } = JSON.parse(savedAuth);
        const isClient = !user.role.startsWith('gcc_') && !user.role.startsWith('sp_');
        
        if (redirectUrl && isClient) {
          navigate(redirectUrl);
        } else if (user.role.startsWith('gcc_')) {
          navigate('/admin/dashboard');
        } else if (user.role.startsWith('sp_')) {
          navigate('/partner/dashboard');
        } else {
          navigate('/client/dashboard');
        }
      }
    } catch (err: any) {

      toast.error(err.response?.data?.error?.message || 'Login failed. Please check your credentials.');
    } finally {

      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[hsl(var(--primary))]/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[hsl(var(--accent-blue))]/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '-2s' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side: Branding & Info (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col space-y-8 pr-12 animate-fade-in-up">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors w-fit group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--primary))]/10 rounded-xl flex items-center justify-center">
                <Zap size={24} className="text-[hsl(var(--primary))]" />
              </div>
              <span className="font-mono text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">Q-UP.AI</span>
            </div>
            <h1 className="text-4xl font-display font-bold leading-tight text-[hsl(var(--foreground))]">
              Step into the future of <span className="text-[hsl(var(--primary))]">AI Sales</span>.
            </h1>
            <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed max-w-md">
              Access your personalized dashboard to manage campaigns, monitor live AI calls, and track your ROI in real-time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                <ShieldCheck size={18} className="text-emerald-500" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Secure Access</h3>
              <p className="text-xs text-white/40">Bank-grade encryption for all your data.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                <Globe size={18} className="text-blue-500" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Global Scale</h3>
              <p className="text-xs text-white/40">Monitor outreach across multiple regions.</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <p className="text-xs font-mono text-white/30 uppercase tracking-[0.2em] mb-3">Who we run campaigns for</p>
            <div
              role="tablist"
              aria-label="Client companies"
              className="flex flex-wrap gap-2"
            >
              {loginShowcaseCompanies.map((c) => {
                const selected = c.id === showcaseId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    id={`showcase-tab-${c.id}`}
                    aria-controls={`showcase-panel-${c.id}`}
                    onClick={() => setShowcaseId(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                      selected
                        ? 'bg-[hsl(var(--primary))]/15 border-[hsl(var(--primary))]/50 text-[hsl(var(--primary))]'
                        : 'bg-white/5 border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
                    }`}
                  >
                    {c.shortLabel}
                  </button>
                );
              })}
            </div>

            <div
              role="tabpanel"
              id={`showcase-panel-${activeShowcase.id}`}
              aria-labelledby={`showcase-tab-${activeShowcase.id}`}
              className="mt-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[hsl(var(--primary))]/15 flex items-center justify-center flex-shrink-0">
                  <Building2 size={18} className="text-[hsl(var(--primary))]" />
                </div>
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="text-sm font-semibold text-white">{activeShowcase.name}</p>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/35">{activeShowcase.industry}</span>
                  </div>
                  <p className="text-sm font-display font-semibold text-[hsl(var(--primary))] leading-snug">{activeShowcase.headline}</p>
                  <p className="text-xs text-white/55 leading-relaxed">{activeShowcase.summary}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="lg:hidden mb-8">
             <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] mb-6"
            >
              <ChevronLeft size={16} />
              <span className="text-sm">Home</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-[hsl(var(--primary))]">Q-UP.AI</span>
            </div>
          </div>

          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-[32px] p-8 md:p-12 shadow-2xl backdrop-blur-md relative overflow-hidden group">
            {/* Gloss effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(var(--primary))]/5 rounded-full blur-3xl group-hover:bg-[hsl(var(--primary))]/10 transition-colors duration-500" />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-display font-bold text-[hsl(var(--foreground))] mb-2">Welcome Back</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-8">Please enter your details to sign in.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[hsl(var(--muted-foreground))] uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] group-focus-within:text-[hsl(var(--primary))] transition-colors" size={18} />
                    <input 
                      type="email" 
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[hsl(var(--primary))]/50 focus:ring-4 focus:ring-[hsl(var(--primary))]/5 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-mono text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Password</label>
                    <button type="button" className="text-[11px] font-semibold text-[hsl(var(--primary))] hover:underline">Forgot password?</button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] group-focus-within:text-[hsl(var(--primary))] transition-colors" size={18} />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-[hsl(var(--primary))]/50 focus:ring-4 focus:ring-[hsl(var(--primary))]/5 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-white/10 bg-white/5 text-[hsl(var(--primary))] focus:ring-0 focus:ring-offset-0" />
                  <label htmlFor="remember" className="text-xs text-[hsl(var(--muted-foreground))] select-none">Remember for 30 days</label>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[hsl(var(--primary))] text-black font-bold py-4 rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In to Portal
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
{/* 
              <p className="text-center text-sm text-[hsl(var(--muted-foreground))] mt-10">
                Don't have an account? {' '}
                <button className="font-bold text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors">Contact Administrator</button>
              </p> */}
            </div>
          </div>
          
          <p className="mt-8 text-center text-[11px] font-mono text-white/20 uppercase tracking-[0.2em]">
            Secure Infrastructure · ISO 27001 Certified
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
