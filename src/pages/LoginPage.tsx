import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, FileText, Play } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage: React.FC = () => {
  const { login, guestLogin, googleAuth, demoLogin, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/builder');
    } catch {
      // Error displayed via store
    }
  };

  const handleGuest = async () => {
    try {
      await guestLogin();
      navigate('/builder');
    } catch {
      // Error displayed via store
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center px-4 py-20 bg-transparent" 
      id="login-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white">
            Doc<span className="text-brand-400">Craft</span>
          </span>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Welcome back</h2>
          <p className="text-surface-400 text-center mb-8 text-sm">
            Log in to continue building documents.
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
              <span className="mt-0.5 shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <button
              type="button"
              onClick={googleAuth}
              className="btn-secondary w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-700"></div>
            </div>
            <span className="relative bg-[#172033] px-4 text-xs text-surface-500 uppercase tracking-wider">Or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-surface-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) clearError();
                  }}
                  className="input-field pl-11"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-surface-300">Password</label>
                <Link to="/password-reset" className="text-xs text-brand-400 hover:text-brand-300">Forgot password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-surface-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) clearError();
                  }}
                  className="input-field pl-11 pr-11"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-surface-500 hover:text-surface-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full" id="login-submit">
              {isLoading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            </button>
          </form>

          {/* Guest */}
          <div className="mt-4">
            <button onClick={handleGuest} disabled={isLoading} className="btn-ghost w-full text-sm" id="login-guest">
              Continue as Guest
            </button>
          </div>

          {/* Demo Mode */}
          <div className="mt-3 pt-3 border-t border-surface-700/50">
            <button
              onClick={() => { demoLogin(); navigate('/builder'); }}
              id="login-demo"
              className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold 
                         rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg 
                         shadow-emerald-600/25 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Play size={16} />
              Enter Demo Mode
            </button>
            <p className="text-[10px] text-surface-500 text-center mt-2">
              Explore the full app with mock data — no backend needed
            </p>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-surface-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
