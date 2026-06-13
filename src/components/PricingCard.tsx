import * as React from "react";
import { Check } from "lucide-react";

interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  titleIcon?: React.ReactNode;
  price?: string;
  priceDescription?: string;
  description: string;
  features?: { text: React.ReactNode; included: boolean }[];
  buttonText?: string;
  onButtonClick?: () => void;
  actionElement?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  heroElement?: React.ReactNode;
  topRightEmoji?: string;
  isUnique?: boolean;
  className?: string;
}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      className = "",
      title,
      titleIcon,
      price,
      priceDescription,
      description,
      features,
      buttonText,
      onButtonClick,
      actionElement,
      imageSrc,
      imageAlt,
      heroElement,
      topRightEmoji,
      isUnique = false,
      ...props
    },
    ref
  ) => {
    const priceParts = price ? price.split(" ") : [];
    const currency = priceParts.length > 1 ? priceParts[0] : "";
    const amount = priceParts.length > 1 ? priceParts.slice(1).join(" ") : price;

    return (
      <div
        ref={ref}
        className={`relative flex flex-col w-full p-8 rounded-[2rem] border transition-all duration-300 ${
          isUnique 
            ? "bg-[#141C36] border-[#2A375E] shadow-2xl" 
            : "bg-[#111421] border-[#1F2937]"
        } ${className}`}
        {...props}
      >
        {isUnique && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-fit px-4 py-1 rounded-full bg-[#4F75FF] text-white text-[11px] font-bold tracking-wider shadow-lg">
            MOST POPULAR
          </div>
        )}

        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            {titleIcon && <span className="text-blue-400">{titleIcon}</span>}
            <h3 className="text-[22px] font-bold text-white">{title}</h3>
          </div>
          {topRightEmoji && <span className="text-2xl">{topRightEmoji}</span>}
        </div>

        <p className="text-sm text-slate-400 mb-8 min-h-[40px] leading-relaxed">
          {description}
        </p>

        {price && (
          <div className="mb-8">
            <div className="flex items-end gap-1.5">
              {currency && <span className="text-[15px] font-semibold text-slate-400 mb-1.5">{currency}</span>}
              <span className="text-[52px] font-bold text-white leading-none tracking-tight">{amount}</span>
              {priceDescription && (
                <span className="text-[15px] font-medium text-slate-500 mb-1.5">{priceDescription}</span>
              )}
            </div>
          </div>
        )}

        {heroElement ? (
          <div className="w-full h-40 mb-8 rounded-2xl overflow-hidden bg-[#0A0F29] border border-white/5 relative group">
            {heroElement}
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ) : imageSrc ? (
          <div className="w-full h-40 mb-8 rounded-2xl overflow-hidden bg-white/5 border border-white/5">
            <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover opacity-80 mix-blend-screen" />
          </div>
        ) : null}

        <div className="mt-auto">
          {actionElement ? (
            <div className="mb-8">{actionElement}</div>
          ) : (
            <button 
              onClick={onButtonClick}
              className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 mb-8 ${
                isUnique 
                  ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25" 
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              {buttonText || "Get Started"}
            </button>
          )}

          {features && features.length > 0 && (
            <div className="space-y-4 pt-8 mt-2">
              {features.map((feature, idx) => (
                <div key={idx} className={`flex items-start gap-3 ${!feature.included ? 'opacity-40' : ''}`}>
                  <div className={`mt-0.5 ${feature.included ? "text-emerald-400" : "text-slate-500"}`}>
                    {feature.included ? (
                      <Check size={18} strokeWidth={2.5} />
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    )}
                  </div>
                  <span className={`text-[15px] ${feature.included ? "text-slate-300" : "text-slate-400"}`}>{feature.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

PricingCard.displayName = "PricingCard";

export { PricingCard };
