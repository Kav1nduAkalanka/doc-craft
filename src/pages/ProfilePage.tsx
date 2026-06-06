import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Globe, Crown, CreditCard, Loader2, Save } from 'lucide-react';
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
      className="min-h-screen pt-24 pb-20 px-4 bg-transparent" 
      id="profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8 animate-fade-in">Profile Settings</h1>

        {/* User info card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-16 h-16 rounded-2xl border-2 border-surface-600" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {(user?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-white">{user?.full_name || 'User'}</h2>
              <p className="text-sm text-surface-400">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                {user?.plan === 'pro' ? (
                  <span className="badge-pro text-xs">Pro</span>
                ) : (
                  <span className="badge-free text-xs">Free</span>
                )}
                <span className="text-xs text-surface-500 capitalize">
                  via {user?.auth_provider}
                </span>
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="profile-name" className="field-label flex items-center gap-1.5">
                <User size={12} /> Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="profile-email" className="field-label flex items-center gap-1.5">
                <Mail size={12} /> Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={user?.email || ''}
                disabled
                className="input-field opacity-60 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="profile-timezone" className="field-label flex items-center gap-1.5">
                <Globe size={12} /> Timezone
              </label>
              <select
                id="profile-timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="input-field"
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

            {saveMessage && (
              <p className={`text-sm ${saveMessage.includes('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>
                {saveMessage}
              </p>
            )}

            <button onClick={handleSave} disabled={isSaving} className="btn-primary" id="profile-save">
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </div>

        {/* Quota card */}
        {quota && (
          <div className="glass-card p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Crown size={16} className="text-brand-400" />
              Usage & Quota
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-surface-500 mb-1">Plan</p>
                <p className="text-sm font-semibold text-white capitalize">{quota.plan}</p>
              </div>
              <div>
                <p className="text-xs text-surface-500 mb-1">Daily Limit</p>
                <p className="text-sm font-semibold text-white">
                  {quota.plan === 'pro' ? 'Unlimited' : quota.daily_limit}
                </p>
              </div>
              <div>
                <p className="text-xs text-surface-500 mb-1">Used Today</p>
                <p className="text-sm font-semibold text-white">{quota.used_today}</p>
              </div>
              <div>
                <p className="text-xs text-surface-500 mb-1">Remaining</p>
                <p className="text-sm font-semibold text-white">
                  {quota.plan === 'pro' ? '∞' : quota.remaining}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription card */}
        {subscription && (
          <div className="glass-card p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard size={16} className="text-brand-400" />
              Subscription
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-surface-500 mb-1">Status</p>
                <p className={`text-sm font-semibold capitalize ${subscription.status === 'active' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                  {subscription.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-surface-500 mb-1">Renews</p>
                <p className="text-sm font-semibold text-white">
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button onClick={openPortal} className="btn-secondary text-sm" id="manage-subscription">
              Manage Subscription
            </button>
          </div>
        )}

        {/* Demo Admin Controls */}
        {localStorage.getItem('doccraft_token') === 'demo_token_for_testing' && (
          <div className="glass-card p-6 border border-emerald-500/30 bg-emerald-500/5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
              <Crown size={16} />
              Demo Admin Controls
            </h3>
            <p className="text-xs text-surface-400 mb-4">
              You are currently exploring the app in Demo Mode without a backend. Use this toggle to switch between the Free and Pro plans to test premium features (like templates and unlimited quota).
            </p>
            <div className="flex items-center justify-between p-4 bg-surface-900/50 rounded-xl border border-surface-700">
              <div>
                <p className="text-sm font-semibold text-white">Pro Plan</p>
                <p className="text-xs text-surface-500">Enable premium templates and unlimited quota</p>
              </div>
              <button
                onClick={() => {
                  toggleDemoPlan();
                  setTimeout(() => {
                    fetchQuota();
                    fetchSubscription();
                  }, 100); // give state time to settle
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${user?.plan === 'pro' ? 'bg-emerald-500' : 'bg-surface-600'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user?.plan === 'pro' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;
