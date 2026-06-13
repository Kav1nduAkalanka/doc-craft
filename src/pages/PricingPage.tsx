import React from 'react';
import { motion } from 'framer-motion';
import { PricingSection } from '../components/PricingSection';

const PricingPage: React.FC = () => {
  return (
    <motion.div 
      className="min-h-screen pt-24 pb-20 px-4 bg-transparent" 
      id="pricing-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Simple, transparent pricing</h1>
          <p className="text-surface-400 max-w-lg mx-auto">
            Start free. Upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Section */}
        <PricingSection />
      </div>
    </motion.div>
  );
};

export default PricingPage;
