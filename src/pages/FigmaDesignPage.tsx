import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import type { DocumentType } from '../types';
import { NotionHero } from '../components/NotionHero';
import { FeaturesSection } from '../components/FeaturesSection';
import { PricingSection } from '../components/PricingSection';
import { Footer } from '../components/Footer';

const templates: { title: string; description: string; imgSrc: string; variant: string; type: DocumentType }[] = [
  {
    title: "Invoice",
    description: "Professional invoices with automated calculations.",
    imgSrc: "/invoice.webp",
    variant: "blue", // Royal Blue
    type: "invoice",
  },
  {
    title: "Quotation",
    description: "Clear price estimates to win clients over seamlessly.",
    imgSrc: "/quotation.webp",
    variant: "violet", // Violet
    type: "quotation",
  },
  {
    title: "Proposal",
    description: "Detailed project scope and pricing laid out beautifully.",
    imgSrc: "/proposal.webp",
    variant: "orange", // Burnt Orange
    type: "proposal",
  },
  {
    title: "Receipt",
    description: "Instantly generate verifiable proof of payment.",
    imgSrc: "/receipt.webp",
    variant: "teal", // Teal
    type: "receipt",
  },
  {
    title: "Purchase Order",
    description: "Streamline procurement with clear purchase details.",
    imgSrc: "/purchase oder.webp",
    variant: "amber", // Amber
    type: "purchase_order",
  },
];

const variantStyles: Record<string, { bg: string; accent: string }> = {
  blue: { bg: "bg-gradient-to-br from-[#2563EB] to-[#1D4ED8]", accent: "text-[#BFDBFE]" }, // Royal Blue
  violet: { bg: "bg-gradient-to-br from-[#7C3AED] to-[#6D28D9]", accent: "text-[#DDD6FE]" }, // Violet
  teal: { bg: "bg-gradient-to-br from-[#0D9488] to-[#0F766E]", accent: "text-[#99F6E4]" }, // Teal
  orange: { bg: "bg-gradient-to-br from-[#EA580C] to-[#C2410C]", accent: "text-[#FED7AA]" }, // Burnt Orange
  amber: { bg: "bg-gradient-to-br from-[#CA8A04] to-[#A16207]", accent: "text-[#FEF08A]" }, // Amber
};

interface TemplateCardProps {
  title: string;
  description: string;
  imgSrc: string;
  variant: string;
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ title, description, imgSrc, variant, onClick }) => {
  const cardAnimation: Variants = {
    hover: {
      scale: 1.02,
      y: -4,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const imageAnimation: Variants = {
    hover: {
      scale: 1.05,
      y: -5,
      rotate: -2,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const arrowAnimation: Variants = {
    hover: {
      x: 5,
      transition: { duration: 0.3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
    }
  };

  const styles = variantStyles[variant] || variantStyles.blue;

  return (
    <motion.div
      variants={cardAnimation}
      whileHover="hover"
      onClick={onClick}
      className={`group cursor-pointer relative flex flex-col justify-between w-full p-8 h-[260px] overflow-hidden rounded-[2rem] shadow-lg transition-shadow duration-300 ease-out hover:shadow-2xl ${styles.bg} text-white`}
    >
      <div className="relative z-10 flex flex-col h-full w-[60%]">
        <h3 className="text-[1.35rem] font-bold tracking-tight leading-tight text-white mb-2">{title}</h3>
        <p className="text-[0.85rem] text-white/80 font-medium leading-relaxed mb-6">{description}</p>
        
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className={`mt-auto flex items-center text-xs font-bold tracking-wider hover:opacity-80 transition-opacity ${styles.accent}`}
        >
          CREATE NOW
          <motion.div variants={arrowAnimation}>
            <ArrowRight className="ml-2 h-4 w-4" />
          </motion.div>
        </a>
      </div>
      
      {/* 3D Image at bottom right */}
      <motion.img
        variants={imageAnimation}
        src={imgSrc}
        alt={`${title} illustration`}
        className="absolute -right-4 -bottom-4 w-[10rem] h-[10rem] sm:w-[11rem] sm:h-[11rem] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.35)]"
      />
    </motion.div>
  );
};

const FigmaDesignPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleSelectType = (type: DocumentType) => {
    if (isAuthenticated) {
      navigate('/builder', { state: { autoSelectType: type } });
    } else {
      navigate('/login', { state: { autoSelectType: type } });
    }
  };

  useEffect(() => {
    if (location.hash) {
      // Small timeout to ensure DOM is ready and animations have settled
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#080B1A] font-sans selection:bg-brand-500/30 relative overflow-clip"
    >
      
      <NotionHero />

      <section className="relative pb-32 px-4 z-10 -mt-10" id="solution">
        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">What would you like to create?</h2>
            <p className="text-lg text-gray-400">Select a template to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {templates.map((template) => (
               <TemplateCard
                key={template.title}
                title={template.title}
                description={template.description}
                imgSrc={template.imgSrc}
                variant={template.variant}
                onClick={() => handleSelectType(template.type)}
              />
            ))}
          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* Pricing Section */}
      <section className="relative py-32 px-4 z-10 bg-[#080B1A]" id="pricing">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Plans that scale with your team
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Start for free, upgrade when you need advanced customization and unlimited generation. No hidden fees.
            </p>
          </div>
          
          <PricingSection />
        </div>
      </section>

      <div id="about">
        <Footer />
      </div>
    </motion.div>
  );
};

export default FigmaDesignPage;
