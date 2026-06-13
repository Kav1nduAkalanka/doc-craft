import React from 'react';
import { Zap } from 'lucide-react';
import { useQuotaStore } from '../store/quotaStore';

const QuotaBar: React.FC = () => {
  const { quota } = useQuotaStore();

  if (!quota) return null;

  const percent = quota.daily_limit > 0 ? (quota.used_today / quota.daily_limit) * 100 : 0;
  const isLow = quota.remaining <= 1;
  const isExhausted = quota.remaining <= 0;

  return (
    <div className={`px-4 py-2 border-t border-surface-700/50 ${isExhausted ? 'bg-red-500/5' : ''}`} id="quota-bar">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Zap size={12} className={isLow ? 'text-amber-400' : 'text-surface-400'} />
          <span className="text-xs text-surface-400">
            {quota.plan === 'pro' ? 'Pro — Unlimited' : `${quota.remaining} of ${quota.daily_limit} remaining`}
          </span>
        </div>
        {quota.plan === 'free' && (
          <span className="text-[10px] text-surface-500">
            Resets {new Date(quota.resets_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
      {quota.plan === 'free' && (
        <div className="w-full h-1 bg-surface-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isExhausted
                ? 'bg-red-500'
                : isLow
                  ? 'bg-amber-500'
                  : 'bg-brand-500'
              }`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default QuotaBar;
