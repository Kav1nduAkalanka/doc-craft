import React from 'react';
import { Check, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDocumentStore } from '../store/documentStore';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { renderTemplate } from '../utils/templateRenderer';
import type { Template } from '../types';

const TemplateSelector: React.FC = () => {
  const { templates, selectedTemplate, selectTemplate, accentColor } = useDocumentStore();
  const { user } = useAuthStore();
  const isPro = user?.plan === 'pro';

  if (templates.length === 0) return null;

  return (
    <div className="p-4 border-b border-surface-700/50" id="template-selector">
      <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
        Choose Template
      </h4>
      <div className="grid grid-cols-3 gap-2">
        {templates.map((template: Template) => {
          const isSelected = selectedTemplate === template.template_id;
          const isLocked = template.tier === 'pro' && !isPro;

          return (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: isLocked ? 1 : 1.05 }}
              whileTap={{ scale: isLocked ? 1 : 0.95 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
              key={template.template_id}
              onClick={() => !isLocked && selectTemplate(template.template_id)}
              disabled={isLocked}
              id={`template-${template.template_id}`}
              className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 group
                ${isSelected 
                  ? 'border-brand-500 shadow-glow' 
                  : 'border-surface-700 hover:border-surface-500'
                }
                ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Thumbnail */}
              <div className="aspect-[3/4] bg-surface-800 flex items-center justify-center relative overflow-hidden">
                {template.thumbnail_url ? (
                  <img
                    src={template.thumbnail_url}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg viewBox="0 0 800 1066" className="w-full h-full pointer-events-none">
                    <foreignObject width="800" height="1066">
                      <div 
                        className="w-full h-full bg-white"
                        dangerouslySetInnerHTML={{ 
                          __html: renderTemplate(
                            template.template_id, 
                            {
                              businessName: 'Business Name',
                              clientName: 'Client Name',
                              invoiceNumber: 'INV-123',
                              quoteNumber: 'QT-123',
                              proposalNumber: 'PRP-123',
                              poNumber: 'PO-123',
                              receiptNumber: 'RCP-123',
                              lineItems: [{ description: 'Service', quantity: 1, unitPrice: 100, total: 100 }],
                              subtotal: 100,
                              totalDue: 100,
                            }, 
                            {
                              headerAlignment: 'left',
                              fontSize: 'medium',
                              showLogo: false,
                              showNotes: true,
                              sectionOrder: ['header', 'client_details', 'line_items', 'total', 'notes'],
                            }, 
                            accentColor,
                            useChatStore.getState().documentType || 'invoice'
                          ) 
                        }}
                      />
                    </foreignObject>
                  </svg>
                )}
              </div>

              {/* Label */}
              <div className="px-1.5 py-1.5 bg-surface-800">
                <p className="text-[10px] text-surface-300 font-medium truncate">{template.name}</p>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </div>
              )}

              {/* Pro lock */}
              {isLocked && (
                <div className="absolute inset-0 bg-surface-900/60 flex items-center justify-center">
                  <div className="flex items-center gap-1 bg-surface-800 px-2 py-1 rounded-full">
                    <Lock size={10} className="text-amber-400" />
                    <span className="text-[9px] text-amber-400 font-semibold">PRO</span>
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
