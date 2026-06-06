import React from 'react';
import type { SpellCorrection } from '../types';
import { AlertTriangle, Check, X } from 'lucide-react';

interface SpellCorrectionBannerProps {
  correction: SpellCorrection;
  onAccept: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

const SpellCorrectionBanner: React.FC<SpellCorrectionBannerProps> = ({
  correction,
  onAccept,
  onReject,
  isLoading = false,
}) => {
  return (
    <div className="mx-2 my-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl animate-slide-up" id="spell-correction-banner">
      <div className="flex items-start gap-2.5">
        <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-amber-200 font-medium mb-1">Spelling suggestion</p>
          <p className="text-xs text-surface-300">
            Did you mean <span className="font-semibold text-white">"{correction.suggested}"</span> instead
            of <span className="line-through text-surface-500">"{correction.original}"</span>?
          </p>
          <div className="flex gap-2 mt-2.5">
            <button
              onClick={onAccept}
              disabled={isLoading}
              id="spell-accept"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/80 text-white text-xs font-medium rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50"
            >
              <Check size={12} />
              Accept
            </button>
            <button
              onClick={onReject}
              disabled={isLoading}
              id="spell-reject"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-700 text-surface-300 text-xs font-medium rounded-lg hover:bg-surface-600 transition-colors disabled:opacity-50"
            >
              <X size={12} />
              Keep Original
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpellCorrectionBanner;
