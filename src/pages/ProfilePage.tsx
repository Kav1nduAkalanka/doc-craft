import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Globe, Crown, CreditCard, Loader2, Save, ArrowLeft, Sparkles, CheckCircle2, X, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useQuotaStore } from '../store/quotaStore';
import * as usersApi from '../api/users';

const ProfilePage: React.FC = () => {
  const { user, setUser, toggleDemoPlan } = useAuthStore();
  const { quota, subscription, fetchQuota, fetchSubscription, openPortal } = useQuotaStore();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Colombo');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchQuota();
    fetchSubscription();
  }, [fetchQuota, fetchSubscription]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const updated = await usersApi.updateProfile({ full_name: fullName, timezone });
      setUser({ ...user!, full_name: updated.full_name, timezone: updated.timezone });
      setSaveMessage('Profile updated successfully.');
    } catch {
      setSaveMessage('Failed to update profile.');
    }
    setIsSaving(false);
  };

  return (
    <motion.div 
      className="min-h-screen py-12 px-4 bg-transparent" 
      id="profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors mb-4">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight animate-fade-in">Profile Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Hero Header Card */}
            <div className="glass-card relative overflow-hidden p-8 border border-white/5 bg-[#111421] rounded-[2rem] shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-brand-500/20 via-purple-500/10 to-transparent"></div>
              
              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-brand-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="relative w-24 h-24 rounded-2xl border border-white/10 object-cover shadow-xl" />
                  ) : (
                    <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900 border border-white/5 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                      {(user?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                    </div>
                  )}
                  {user?.plan === 'pro' && (
                    <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-500 w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#111421] shadow-lg" title="Pro Account">
                      <Crown size={14} className="text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
                  <h2 className="text-2xl font-bold text-white mb-1">{user?.full_name || 'User'}</h2>
                  <p className="text-surface-400 text-sm mb-3">{user?.email}</p>
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-800/50 border border-surface-700/50 backdrop-blur-sm">
                    {user?.plan === 'pro' ? (
                      <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={12} className="text-amber-400" /> Pro Plan
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Free Plan</span>
                    )}
                    <span className="w-1 h-1 rounded-full bg-surface-600"></span>
                    <span className="text-xs text-surface-500 capitalize">
                      {user?.auth_provider} Login
                    </span>
                  </div>
                </div>
              </div>

              {/* Editable settings */}
              <div className="mt-8 pt-8 border-t border-surface-800/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label htmlFor="profile-name" className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-2">
                      <User size={14} /> Full Name
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-surface-900/50 border border-surface-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-surface-600 hover:border-surface-600"
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="profile-email" className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-2">
                      <Mail size={14} /> Email Address
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-surface-900/30 border border-surface-800 text-surface-500 rounded-xl px-4 py-3 text-sm cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="profile-timezone" className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-2">
                      <Globe size={14} /> Timezone
                    </label>
                    <select
                      id="profile-timezone"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-surface-900/50 border border-surface-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all hover:border-surface-600 appearance-none"
                    >
                      <option value="Asia/Colombo">Asia/Colombo (UTC+5:30)</option>
                      <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (UTC-5)</option>
                      <option value="Europe/London">Europe/London (UTC+0)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                      <option value="Australia/Sydney">Australia/Sydney (UTC+11)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {saveMessage ? (
                    <p className={`text-sm flex items-center gap-2 ${saveMessage.includes('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>
                      {saveMessage.includes('Failed') ? <X size={16} /> : <CheckCircle2 size={16} />}
                      {saveMessage}
                    </p>
                  ) : (
                    <div></div>
                  )}

                  <button 
                    onClick={handleSave} 
                    disabled={isSaving} 
                    className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-white text-black hover:bg-surface-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-white/10"
                    id="profile-save"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Demo Admin Controls */}
            {localStorage.getItem('doccraft_token') === 'demo_token_for_testing' && (
              <div className="glass-card p-6 border border-emerald-500/30 bg-emerald-500/5 rounded-[1.5rem] animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                  <Crown size={16} />
                  Demo Admin Controls
                </h3>
                <p className="text-xs text-surface-400 mb-4 leading-relaxed">
                  You are currently exploring the app in Demo Mode without a backend. Use this toggle to switch between the Free and Pro plans to test premium features.
                </p>
                <div className="flex items-center justify-between p-4 bg-surface-900/50 rounded-xl border border-surface-700/50">
                  <div>
                    <p className="text-sm font-medium text-white">Simulate Pro Plan</p>
                  </div>
                  <button
                    onClick={() => {
                      toggleDemoPlan();
                      setTimeout(() => {
                        fetchQuota();
                        fetchSubscription();
                      }, 100);
                    }}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${user?.plan === 'pro' ? 'bg-emerald-500' : 'bg-surface-600'
                      }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${user?.plan === 'pro' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Widgets */}
          <div className="space-y-6">
            
            {/* Usage Widget */}
            {quota && (
              <div className="glass-card p-6 border border-white/5 bg-[#111421] rounded-[2rem] shadow-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Zap size={18} className="text-brand-400" />
                    Usage & Limits
                  </h3>
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${quota.plan === 'pro' ? 'bg-amber-500/20 text-amber-400' : 'bg-surface-800 text-surface-300'}`}>
                    {quota.plan}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-0.5">Documents Generated</p>
                      <p className="text-2xl font-bold text-white leading-none">
                        {quota.used_today} <span className="text-sm font-medium text-surface-500">/ {quota.plan === 'pro' ? '∞' : quota.daily_limit}</span>
                      </p>
                    </div>
                  </div>
                  
                  {quota.plan === 'free' ? (
                    <div className="w-full h-2 bg-surface-800 rounded-full overflow-hidden mt-3">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(quota.used_today / quota.daily_limit) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-2 bg-surface-800 rounded-full overflow-hidden mt-3">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-full opacity-50" />
                    </div>
                  )}
                  
                  {quota.plan === 'free' && (
                    <p className="text-xs text-surface-400 mt-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                      {quota.remaining} generations remaining today
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Subscription Widget */}
            {subscription && (
              <div className="glass-card p-6 border border-white/5 bg-[#111421] rounded-[2rem] shadow-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
                  <CreditCard size={18} className="text-brand-400" />
                  Billing
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-4 border-b border-surface-800/50">
                    <div>
                      <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-1">Status</p>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${subscription.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                        <p className={`text-sm font-semibold capitalize ${subscription.status === 'active' ? 'text-white' : 'text-amber-400'}`}>
                          {subscription.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-1">Current Period Ends</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(subscription.current_period_end).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <button onClick={openPortal} className="w-full py-2.5 px-4 rounded-xl text-sm font-medium bg-surface-800 hover:bg-surface-700 text-white transition-colors border border-surface-700 flex items-center justify-center gap-2" id="manage-subscription">
                  Manage Subscription
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
