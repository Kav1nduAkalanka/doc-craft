import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, FileText, Settings, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useQuotaStore } from '../store/quotaStore';
import UpgradeModal from '../components/UpgradeModal';
import DocumentTypeSelector from '../components/DocumentTypeSelector';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { quota, fetchQuota, fetchSubscription, openPortal, setShowUpgradeModal } = useQuotaStore();

  useEffect(() => {
    fetchQuota();
    fetchSubscription();
  }, [fetchQuota, fetchSubscription]);

  const navigate = useNavigate();

  const isPro = user?.plan === 'pro';

  return (
    <motion.div 
      className="min-h-screen bg-[#080B1A] font-sans selection:bg-brand-500/30 pt-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[500px] opacity-30 mix-blend-screen pointer-events-none">
        <div
          className="absolute inset-0 bg-gradient-to-b from-brand-500/20 via-brand-500/5 to-transparent blur-3xl"
          style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-surface-400 text-lg">
              Ready to create your next professional document?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Plan Info Card */}
          <div className="glass-card p-8 border border-white/5 rounded-[2rem] bg-[#111421] shadow-xl relative overflow-hidden flex flex-col justify-between h-[220px]">
            {isPro && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            )}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPro ? 'bg-amber-500/20 text-amber-400' : 'bg-surface-800 text-surface-300'}`}>
                  {isPro ? <Crown size={20} /> : <FileText size={20} />}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{isPro ? 'Pro Plan' : 'Free Plan'}</h3>
                  <p className="text-surface-400 text-sm">{isPro ? 'Unlimited generation' : 'Basic features'}</p>
                </div>
              </div>
            </div>
            
            <div>
              {isPro ? (
                <button 
                  onClick={openPortal}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Settings size={16} />
                  Manage Subscription
                </button>
              ) : (
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Sparkles size={16} />
                  Upgrade to Pro
                </button>
              )}
            </div>
          </div>

          {/* Quota Usage Card */}
          <div className="glass-card p-8 border border-white/5 rounded-[2rem] bg-[#111421] shadow-xl relative overflow-hidden flex flex-col justify-between h-[220px] lg:col-span-2">
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">Today's Usage</h3>
              <p className="text-surface-400 text-sm mb-6">
                {isPro 
                  ? "You have unlimited document generations." 
                  : "Free tier includes 3 document generations per day."}
              </p>
              
              {!isPro && quota && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-300 font-medium">{quota.used_today} / {quota.daily_limit} Documents</span>
                    <span className="text-brand-400 font-medium">{quota.remaining} remaining</span>
                  </div>
                  <div className="w-full h-3 bg-surface-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-brand-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(quota.used_today / quota.daily_limit) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
              {isPro && (
                <div className="flex items-center gap-3 text-emerald-400 font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Unlimited generation active
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Document Type Selector embedded directly on dashboard */}
        <DocumentTypeSelector onSelect={(type) => navigate('/builder', { state: { autoSelectType: type } })} />

      </div>

      <UpgradeModal />
    </motion.div>
  );
};

export default DashboardPage;
