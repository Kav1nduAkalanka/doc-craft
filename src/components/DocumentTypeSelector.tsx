import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  FileSearch,
  Presentation,
  Receipt,
  ShoppingCart,
} from 'lucide-react';
import type { DocumentType } from '../types';
import { DOCUMENT_TYPES } from '../types';

interface DocumentTypeSelectorProps {
  onSelect: (type: DocumentType) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText size={28} />,
  FileSearch: <FileSearch size={28} />,
  Presentation: <Presentation size={28} />,
  Receipt: <Receipt size={28} />,
  ShoppingCart: <ShoppingCart size={28} />,
};

const gradients = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
];

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8" id="document-type-selector">
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-2">What would you like to create?</h2>
        <p className="text-surface-400 text-sm">Choose a document type to get started</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
        {DOCUMENT_TYPES.map((doc, i) => (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            key={doc.type}
            onClick={() => onSelect(doc.type)}
            id={`doc-type-${doc.type}`}
            className="glass-card p-4 text-left hover:bg-white/10 hover:border-brand-500/50 
                       transition-colors duration-300 group cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradients[i]} flex items-center 
                            justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {iconMap[doc.icon]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors">
                  {doc.label}
                </h3>
                <p className="text-xs text-surface-400 mt-0.5 line-clamp-2">{doc.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DocumentTypeSelector;
