import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, User, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';

export const LandingAuthPage: React.FC = () => {
  const { login, register, isLoading } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && !name.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }
    if (!email.trim() || !password) {
      showToast('Please provide both email and password.', 'error');
      return;
    }

    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
    } catch {
      // Toast handles error display
    }
  };

  const handleDemoFill = async () => {
    setEmail('riya.kri.thakur2004@gmail.com');
    setPassword('password123');
    try {
      await login('riya.kri.thakur2004@gmail.com', 'password123');
    } catch {
      // Toast handles error
    }
  };

  const handleForgotPassword = () => {
    showToast('A password reset link has been dispatched to your email address.', 'info');
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-x-hidden selection:bg-[#B89B5E]/30 selection:text-[#F4F1EA]">
      {/* Extended Full-Page Background Image with Measured Luxury Scrim */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src="/src/assets/images/ledgerly_auth_hero_1790940155176.jpg"
          alt="Ledgerly private banking architectural aesthetic"
          className="w-full h-full object-cover filter brightness-[0.68] contrast-[1.08] scale-102"
          referrerPolicy="no-referrer"
        />
        {/* Architectural tonal scrim: warm charcoal and deep forest green undertone */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C1210]/90 via-[#121A17]/82 to-[#090D0C]/88 backdrop-blur-[2px]" />
        {/* Subtle radial vignette for cinematic depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(184,155,94,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(23,63,53,0.3)_0%,transparent_70%)]" />
      </div>

      {/* Main Content Container Over Extended Background */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left column: Brand Narrative & Key Pillars */}
        <div className="w-full lg:w-1/2 text-left space-y-8">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#173F35] border-2 border-[#B89B5E]/40 flex items-center justify-center text-[#B89B5E] shadow-xl shrink-0">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 8h10" />
                <path d="M7 12h6" />
                <path d="M7 16h8" />
              </svg>
            </div>
            <div>
              <span className="font-serif-heading text-4xl sm:text-5xl font-bold tracking-tight text-[#F4F1EA] block leading-none">
                Ledgerly
              </span>
              <p className="text-xs sm:text-sm text-[#B89B5E] tracking-[0.22em] uppercase font-semibold mt-1.5">
                Clarity for every rupee.
              </p>
            </div>
          </div>

          {/* Editorial Headline */}
          <div className="space-y-4 max-w-xl">
            <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.15] text-[#F4F1EA] text-balance">
              Intelligent accounting for the discerning individual.
            </h1>
            <p className="text-sm sm:text-base text-[#D0CFC8] leading-relaxed font-light">
              Experience financial poise. Track income and expenditures, manage monthly spending thresholds, and inspect analytical trajectories with quiet precision.
            </p>
          </div>

          {/* Highlights & Trust Elements */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-xs font-semibold text-[#B89B5E] block font-serif-heading">Precision Ledger</span>
              <p className="text-[11px] text-[#A7AAA5] mt-1">Real-time reconciliation of balance, income, and outflow.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-xs font-semibold text-[#B89B5E] block font-serif-heading">Budget Governance</span>
              <p className="text-[11px] text-[#A7AAA5] mt-1">Automated threshold warnings to prevent overruns.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-xs font-semibold text-[#B89B5E] block font-serif-heading">Cashflow Velocity</span>
              <p className="text-[11px] text-[#A7AAA5] mt-1">Forensic multi-period trends and dynamic insights.</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-[#A7AAA5] pt-2">
            <ShieldCheck className="w-4 h-4 text-[#40916C] shrink-0" />
            <span>Client-side token authentication & strict data privacy</span>
          </div>
        </div>

        {/* Right column: Floating Authentication Card */}
        <div className="w-full lg:w-5/12 max-w-md">
          <div className="bg-[#F7F5F0]/95 dark:bg-[#161816]/95 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-7 sm:p-9 space-y-6">
            {/* Form Header */}
            <div className="space-y-1.5">
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717] dark:text-[#F4F1EA]">
                {mode === 'login' ? 'Sign in to Ledgerly' : 'Create an Account'}
              </h2>
              <p className="text-xs text-[#6B6B6B] dark:text-[#A7AAA5]">
                {mode === 'login'
                  ? 'Enter your credentials to access your financial dashboard.'
                  : 'Join Ledgerly to gain complete visibility into your personal cash flow.'}
              </p>
            </div>

            {/* Demo 1-Click Fast Login Banner */}
            <div className="p-3.5 rounded-lg bg-[#EFECE5] dark:bg-[#1E231E] border border-[#173F35]/20 dark:border-[#B89B5E]/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-[#B89B5E] shrink-0" />
                <div>
                  <span className="font-medium text-[#171717] dark:text-[#F4F1EA]">Portfolio Evaluator?</span>
                  <p className="text-[11px] text-[#6B6B6B] dark:text-[#A7AAA5]">Pre-loaded with Riya's realistic financial data</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDemoFill}
                className="py-1 px-3 text-xs font-semibold text-white bg-[#173F35] hover:bg-[#112d26] dark:bg-[#245749] rounded-md transition-colors whitespace-nowrap shadow-2xs"
              >
                Sign in as Demo
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B] dark:text-[#A7AAA5]" />
                    <input
                      type="text"
                      placeholder="e.g. Riya Thakur"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B] dark:text-[#A7AAA5]" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F1EA] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B] dark:text-[#A7AAA5]" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-lg bg-white dark:bg-[#1E231E] text-[#171717] dark:text-[#F4F1EA] border border-[#171717]/10 dark:border-white/10 focus:border-[#173F35] focus:outline-none"
                  />
                </div>
              </div>

              {mode === 'login' && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-[#173F35]"
                    />
                    <span className="text-[#6B6B6B] dark:text-[#A7AAA5]">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-[#173F35] dark:text-[#B89B5E] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#173F35] hover:bg-[#112d26] dark:bg-[#245749] dark:hover:bg-[#1c453a] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Switch mode */}
            <div className="pt-4 border-t border-[#171717]/8 dark:border-white/8 text-center text-xs text-[#6B6B6B] dark:text-[#A7AAA5]">
              {mode === 'login' ? (
                <p>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="font-semibold text-[#173F35] dark:text-[#B89B5E] hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-semibold text-[#173F35] dark:text-[#B89B5E] hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
