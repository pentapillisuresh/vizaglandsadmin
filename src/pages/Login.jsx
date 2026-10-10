
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import ApiService from '../hooks/ApiService';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await ApiService.post(
        '/auth/login/admin',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response?.token && response?.admin) {
        localStorage.setItem('token', response?.token);
        localStorage.setItem('isLogin', true);
        localStorage.setItem(
          'adminDetails',
          JSON.stringify(response?.admin)
        );

        navigate('/');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#080D16] p-3 text-white sm:p-4 lg:p-5">
      <div className="mx-auto grid h-full w-full max-w-[1600px] grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0D1421] lg:grid-cols-2">

        {/* LEFT SIDE - PROPERTY SHOWCASE */}
        <div className="relative hidden min-h-0 flex-col justify-between overflow-hidden p-10 xl:p-12 lg:flex">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85"
            alt="Premium residential property"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#080D16]/70 via-[#080D16]/30 to-[#080D16]/95" />

          {/* COMPANY BRANDING */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D6B477]/50 bg-[#D6B477]/15 backdrop-blur-md">
              <span className="font-serif text-2xl font-bold text-[#E4C58D]">
                V
              </span>
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-[0.18em] text-white xl:text-xl">
                VMRDA PLOTS
              </h1>

              <p className="mt-1 text-[9px] tracking-[0.22em] text-[#E4C58D] xl:text-[10px]">
                PROPERTY MANAGEMENT PORTAL
              </p>
            </div>
          </div>

          {/* HERO CONTENT */}
          <div className="relative z-10 max-w-lg py-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px w-9 bg-[#D6B477]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#E4C58D] xl:text-xs">
                Your Gateway to Excellence
              </span>
            </div>

            <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight xl:text-5xl 2xl:text-6xl">
              Managing Properties.
              <br />
              <span className="italic text-[#E4C58D]">
                Building Trust.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-6 text-white/75">
              Your central workspace to manage properties, oversee
              enquiries, and deliver exceptional real estate experiences.
            </p>

            <div className="mt-7 flex items-center gap-3 border-t border-white/20 pt-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D6B477]/40 bg-black/20">
                <ShieldCheck size={20} className="text-[#E4C58D]" />
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  Secure Administration
                </p>

                <p className="mt-1 text-xs text-white/60">
                  Authorized access to your management portal
                </p>
              </div>
            </div>
          </div>

          {/* LEFT FOOTER */}
          <div className="relative z-10 flex items-center justify-between gap-3 border-t border-white/15 pt-4 text-[9px] uppercase tracking-[0.14em] text-white/55 xl:text-[10px]">
            <span>Visakhapatnam, India</span>
            <span>VMRDA PLOTS</span>
          </div>
        </div>

        {/* RIGHT SIDE - LOGIN FORM */}
        <div className="flex min-h-0 items-center justify-center overflow-y-auto bg-[#0D1421] px-5 py-5 sm:px-10 lg:px-10 xl:px-14">
          <div className="w-full max-w-md">

            {/* MOBILE BRANDING */}
            <div className="mb-7 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D6B477]/40 bg-[#D6B477]/10">
                <span className="font-serif text-xl font-bold text-[#E4C58D]">
                  V
                </span>
              </div>

              <div>
                <h1 className="text-base font-semibold tracking-[0.18em] text-white">
                  VMRDA PLOTS
                </h1>

                <p className="mt-1 text-[9px] tracking-[0.18em] text-[#D6B477]">
                  ADMINISTRATION PORTAL
                </p>
              </div>
            </div>

            {/* LOGIN HEADING */}
            <div className="mb-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#D6B477]/25 bg-[#D6B477]/10">
                <Lock size={22} className="text-[#E4C58D]" />
              </div>

              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#D6B477] sm:text-xs">
                Welcome Back
              </p>

              <h2 className="font-serif text-3xl font-medium tracking-tight text-white sm:text-4xl">
                Admin Login
              </h2>

              <p className="mt-2 text-sm leading-5 text-slate-400">
                Sign in to manage properties, enquiries and your dashboard.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-xs font-medium tracking-wide text-slate-300"
                >
                  Email Address
                </label>

                <div className="group flex items-center gap-3 rounded-xl border border-white/10 bg-[#111B2B] px-4 transition-all duration-300 focus-within:border-[#D6B477]/70 focus-within:ring-4 focus-within:ring-[#D6B477]/5">
                  <Mail
                    size={18}
                    className="shrink-0 text-slate-500 transition-colors group-focus-within:text-[#D6B477]"
                  />

                  <input
                    id="admin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-xs font-medium tracking-wide text-slate-300"
                >
                  Password
                </label>

                <div className="group flex items-center gap-3 rounded-xl border border-white/10 bg-[#111B2B] px-4 transition-all duration-300 focus-within:border-[#D6B477]/70 focus-within:ring-4 focus-within:ring-[#D6B477]/5">
                  <Lock
                    size={18}
                    className="shrink-0 text-slate-500 transition-colors group-focus-within:text-[#D6B477]"
                  />

                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="h-12 w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex h-10 w-8 shrink-0 items-center justify-center text-slate-500 transition-colors hover:text-[#E4C58D]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <Eye size={19} />
                    ) : (
                      <EyeOff size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#D6B477] px-5 py-3.5 text-sm font-semibold text-[#111827] shadow-lg shadow-[#D6B477]/10 transition-all duration-300 hover:bg-[#E8CB99] hover:shadow-[#D6B477]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {loading ? 'Logging in...' : 'Sign In to Dashboard'}
                </span>

                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* SECURITY NOTE */}
            <div className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] text-slate-500">
              <ShieldCheck
                size={14}
                className="shrink-0 text-[#D6B477]/80"
              />

              <span>Protected access for authorized administrators</span>
            </div>

            {/* FOOTER */}
            <div className="mt-6 border-t border-white/[0.07] pt-4 text-center">
              <p className="text-[10px] leading-5 tracking-wide text-slate-500">
                © {new Date().getFullYear()} VMRDA PLOTS.
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
