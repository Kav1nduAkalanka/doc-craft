import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { DocumentType } from '../types';

interface DocumentTypeSelectorProps {
  onSelect: (type: DocumentType) => void;
}

const templates: { title: string; description: string; imgSrc: string; variant: string; type: DocumentType }[] = [
  {
    title: "Invoice",
    description: "Professional invoices with automated calculations.",
    imgSrc: "/invoice.webp",
    variant: "blue",
    type: "invoice",
  },
  {
    title: "Quotation",
    description: "Clear price estimates to win clients over seamlessly.",
    imgSrc: "/quotation.webp",
    variant: "violet",
    type: "quotation",
  },
  {
    title: "Proposal",
    description: "Detailed project scope and pricing laid out beautifully.",
    imgSrc: "/proposal.webp",
    variant: "orange",
    type: "proposal",
  },
  {
    title: "Receipt",
    description: "Instantly generate verifiable proof of payment.",
    imgSrc: "/receipt.webp",
    variant: "teal",
    type: "receipt",
  },
  {
    title: "Purchase Order",
    description: "Streamline procurement with clear purchase details.",
    imgSrc: "/purchase%20oder.webp",
    variant: "amber",
    type: "purchase_order",
  },
];

const variantStyles: Record<string, { bg: string; accent: string }> = {
  blue: { bg: "bg-gradient-to-br from-[#2563EB] to-[#1D4ED8]", accent: "text-[#BFDBFE]" },
  violet: { bg: "bg-gradient-to-br from-[#7C3AED] to-[#6D28D9]", accent: "text-[#DDD6FE]" },
  teal: { bg: "bg-gradient-to-br from-[#0D9488] to-[#0F766E]", accent: "text-[#99F6E4]" },
  orange: { bg: "bg-gradient-to-br from-[#EA580C] to-[#C2410C]", accent: "text-[#FED7AA]" },
  amber: { bg: "bg-gradient-to-br from-[#CA8A04] to-[#A16207]", accent: "text-[#FEF08A]" },
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

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="w-full mt-12 animate-fade-in" id="document-type-selector">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
          Create a new document
        </h2>
        <p className="text-surface-400 text-base">
          Choose a document type below to start building it with our AI assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.type}
            title={template.title}
            description={template.description}
            imgSrc={template.imgSrc}
            variant={template.variant}
            onClick={() => onSelect(template.type)}
          />
        ))}
      </div>
    </div>
  );
};

export default DocumentTypeSelector;
