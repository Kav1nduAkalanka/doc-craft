import React from 'react';
import { X, Crown, Clock } from 'lucide-react';
import { useQuotaStore } from '../store/quotaStore';

const UpgradeModal: React.FC = () => {
  const { showUpgradeModal, setShowUpgradeModal, checkout, isLoading } = useQuotaStore();

  if (!showUpgradeModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => setShowUpgradeModal(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="upgrade-modal">
        <div className="glass-card max-w-md w-full p-6 animate-slide-up relative">
          {/* Close */}
          <button
            onClick={() => setShowUpgradeModal(false)}
            className="absolute top-4 right-4 p-1 text-surface-500 hover:text-surface-300 transition-colors"
            id="modal-close"
          >
            <X size={18} />
          </button>

          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Crown size={28} className="text-white" />
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-white text-center mb-2">
            You've reached your daily limit
          </h3>
          <p className="text-sm text-surface-400 text-center mb-6">
            Free accounts can generate up to 3 documents per day. Upgrade to Pro for unlimited documents, 
            premium templates, and no watermarks.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => checkout('pro_monthly')}
              disabled={isLoading}
              id="modal-upgrade"
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold 
                         rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg 
                         shadow-orange-500/25 hover:-translate-y-0.5 disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-2">
                <Crown size={16} />
                Upgrade to Pro — LKR 990/mo
              </div>
            </button>
            <button
              onClick={() => setShowUpgradeModal(false)}
              id="modal-remind-later"
              className="w-full py-3 px-6 bg-surface-800 text-surface-300 font-medium rounded-xl 
                         hover:bg-surface-700 transition-colors border border-surface-700"
            >
              <div className="flex items-center justify-center gap-2">
                <Clock size={14} />
                Remind me tomorrow
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpgradeModal;
