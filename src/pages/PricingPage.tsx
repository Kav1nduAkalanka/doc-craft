import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Crown, Sparkles, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useQuotaStore } from '../store/quotaStore';

const PricingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { checkout, isLoading } = useQuotaStore();
  const isPro = user?.plan === 'pro';

  const freeFeatures = [
    '3 documents per day',
    'All 5 document types',
    'AI-assisted data collection',
    'Live document preview',
    'PDF download',
    'DocCraft watermark on PDFs',
  ];

  const proFeatures = [
    'Unlimited documents per day',
    'All 5 document types',
    'AI-assisted data collection',
    'Live document preview',
    'PDF download — no watermark',
    'Premium templates',
    'Custom logo upload',
    'Priority AI response queue',
  ];

  return (
    <motion.div 
      className="min-h-screen pt-24 pb-20 px-4 bg-transparent" 
      id="pricing-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Simple, transparent pricing</h1>
          <p className="text-surface-400 max-w-lg mx-auto">
            Start free. Upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="glass-card p-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-brand-400" />
              <h3 className="text-lg font-bold text-white">Free</h3>
            </div>
            <p className="text-sm text-surface-400 mb-6">Perfect for getting started</p>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-white">LKR 0</span>
              <span className="text-surface-500 text-sm">/ forever</span>
            </div>

            <ul className="space-y-3 mb-8">
              {freeFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-surface-300">
                  <Check size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {isAuthenticated ? (
              isPro ? (
                <button className="btn-secondary w-full" disabled>Current: Pro</button>
              ) : (
                <Link to="/builder" className="btn-secondary w-full text-center" id="free-cta">
                  Start Creating
                </Link>
              )
            ) : (
              <Link to="/register" className="btn-secondary w-full text-center" id="free-register">
                Sign Up Free
              </Link>
            )}
          </div>

          {/* Pro */}
          <div className="glass-card p-8 relative border-brand-500/30 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* Popular badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="badge-pro px-4 py-1 shadow-lg">Most Popular</span>
            </div>

            <div className="flex items-center gap-2 mb-1 mt-2">
              <Crown size={18} className="text-amber-400" />
              <h3 className="text-lg font-bold text-white">Pro</h3>
            </div>
            <p className="text-sm text-surface-400 mb-6">For professionals and businesses</p>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-extrabold text-white">LKR 990</span>
              <span className="text-surface-500 text-sm">/ month</span>
            </div>
            <p className="text-xs text-surface-500 mb-6">or LKR 9,000 / year (save 24%)</p>

            <ul className="space-y-3 mb-8">
              {proFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-surface-300">
                  <Check size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {isAuthenticated ? (
              isPro ? (
                <button className="btn-secondary w-full" disabled>Current Plan</button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => checkout('pro_monthly')}
                    disabled={isLoading}
                    id="pro-monthly"
                    className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold 
                               rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg 
                               shadow-orange-500/25 hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Crown size={16} />
                      Upgrade Monthly
                    </div>
                  </button>
                  <button
                    onClick={() => checkout('pro_annual')}
                    disabled={isLoading}
                    id="pro-annual"
                    className="btn-outline w-full text-sm !border-amber-500/40 !text-amber-300 hover:!bg-amber-500/10"
                  >
                    Pay Annually — Save 24%
                  </button>
                </div>
              )
            ) : (
              <Link to="/register" className="btn-primary w-full text-center" id="pro-register">
                Get Started
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PricingPage;
