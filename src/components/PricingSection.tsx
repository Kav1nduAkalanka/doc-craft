import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ArrowRight } from 'lucide-react';
import { PricingCard } from './PricingCard';
import { useAuthStore } from '../store/authStore';
import { useQuotaStore } from '../store/quotaStore';
import { ArrowDown } from 'lucide-react';

const PricingSection: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { checkout, isLoading } = useQuotaStore();
  const isPro = user?.plan === 'pro';

  const freeFeatures = [
    { text: <span><span className="font-bold text-white">3 documents</span> per day</span>, included: true },
    { text: <span><span className="font-bold text-white">All 5</span> document types</span>, included: true },
    { text: "AI-assisted data entry", included: true },
    { text: "PDF export", included: true },
    { text: "Custom branding", included: false },
    { text: "Document history & revisions", included: false },
    { text: "Priority support", included: false },
  ];

  const proFeatures = [
    { text: <span><span className="font-bold text-white">Unlimited</span> documents per day</span>, included: true },
    { text: <span><span className="font-bold text-white">Unlimited</span> generation</span>, included: true },
    { text: "AI-assisted data entry", included: true },
    { text: "PDF export", included: true },
    { text: <span><span className="font-bold text-white">Custom branding</span> — your logo, colors</span>, included: true },
    { text: <span><span className="font-bold text-white">Document history & unlimited</span> revisions</span>, included: true },
    { text: <span><span className="font-bold text-white">Priority</span> support & onboarding</span>, included: true },
  ];

  const buttonClassFree = "w-full py-3 px-6 rounded-[12px] font-bold text-[15px] transition-all duration-200 bg-transparent hover:bg-white/5 text-white border border-white/20 flex items-center justify-center gap-2";
  const buttonClassPro = "w-full py-3 px-6 rounded-[12px] font-bold text-[15px] transition-all duration-200 bg-transparent hover:bg-white/5 text-white border border-white/20 flex items-center justify-center gap-2";

  return (
    <div className="relative grid md:grid-cols-2 gap-4 max-w-[850px] mx-auto w-full px-4 items-stretch">

      <PricingCard
        title="Free"
        description="Get started with no commitment. Build professional documents that make a great first impression."
        price="LKR 0"
        priceDescription="Starting from"
        features={freeFeatures}
        className="animate-slide-up h-full"
        actionElement={
          isAuthenticated ? (
            isPro ? (
              <button className={`${buttonClassFree} opacity-50 cursor-not-allowed`} disabled>Current: Pro</button>
            ) : (
              <Link to="/builder" className={buttonClassFree} id="free-cta">
                Start Creating
              </Link>
            )
          ) : (
            <Link to="/#document-types" className={buttonClassFree} id="free-register">
              Sign up free
            </Link>
          )
        }
      />

      <PricingCard
        title="Pro"
        description="For professionals who need documents that are done right, every time, without the back-and-forth."
        price="LKR 990"
        priceDescription="/mo"
        features={proFeatures}
        isUnique={true}
        className="animate-slide-up h-full"
        style={{ animationDelay: '0.1s' }}
        actionElement={
          <>
            {isAuthenticated ? (
              isPro ? (
                <button className={`${buttonClassPro} opacity-50 cursor-not-allowed`} disabled>Current Plan</button>
              ) : (
                <div className="space-y-3 w-full">
                  <button
                    onClick={() => checkout('pro_monthly')}
                    disabled={isLoading}
                    id="pro-monthly"
                    className={buttonClassPro}
                  >
                    <Crown size={18} />
                    Upgrade Monthly
                  </button>
                  <button
                    onClick={() => checkout('pro_annual')}
                    disabled={isLoading}
                    id="pro-annual"
                    className="w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 bg-transparent hover:bg-white/5 border border-white/20 text-white flex items-center justify-center gap-2"
                  >
                    Pay Annually — Save 24%
                  </button>
                </div>
              )
            ) : (
               <Link to="/#document-types" className={buttonClassPro} id="pro-register">
                Get started
                <ArrowRight size={18} />
              </Link>
            )}
          </>
        }
      />
    </div>
  );
};

export { PricingSection };
