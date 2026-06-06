import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

const PasswordResetPage: React.FC = () => {
  const { passwordReset, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const msg = await passwordReset(email);
      setMessage(msg);
      setSent(true);
    } catch {
      // Error displayed via store
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center px-4 py-20 bg-transparent" 
      id="password-reset-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="w-full max-w-md animate-slide-up">
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
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
              <p className="text-sm text-surface-400 mb-6">{message || 'We sent a password reset link to your email.'}</p>
              <Link to="/login" className="btn-primary">
                <ArrowLeft size={16} />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white text-center mb-1">Reset password</h1>
              <p className="text-sm text-surface-400 text-center mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="reset-email" className="field-label">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearError(); }}
                      placeholder="you@email.com"
                      required
                      className="input-field !pl-10"
                    />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full" id="reset-submit">
                  {isLoading ? <LoadingSpinner size="sm" /> : 'Send Reset Link'}
                </button>
              </form>

              <Link to="/login" className="flex items-center justify-center gap-1.5 mt-4 text-sm text-surface-500 hover:text-surface-300 transition-colors">
                <ArrowLeft size={14} />
                Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PasswordResetPage;
