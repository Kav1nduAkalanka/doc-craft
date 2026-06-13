import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useDocumentStore } from '../store/documentStore';
import { useQuotaStore } from '../store/quotaStore';
import type { DocumentType } from '../types';

import ChatPanel from '../components/ChatPanel';
import DocumentPreview from '../components/DocumentPreview';
import TemplateSelector from '../components/TemplateSelector';
import FormatSidebar from '../components/FormatSidebar';
import QuotaBar from '../components/QuotaBar';
import UpgradeModal from '../components/UpgradeModal';

const BuilderPage: React.FC = () => {
  const { sessionId, documentType, startSession, resetChat } = useChatStore();
  const { fetchTemplates, resetDocument } = useDocumentStore();
  const { fetchQuota } = useQuotaStore();
  const navigate = useNavigate();
  const [mobileView, setMobileView] = useState<'chat' | 'preview'>('chat');

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  const handleSelectDocType = async (type: DocumentType) => {
    resetChat();
    resetDocument();
    await startSession(type);
    fetchTemplates(type);
  };

  const handleBackToSelector = () => {
    resetChat();
    resetDocument();
  };

  const location = useLocation();
  const autoSelectType = location.state?.autoSelectType as DocumentType | undefined;

  useEffect(() => {
    if (autoSelectType) {
      window.history.replaceState({}, document.title);
      handleSelectDocType(autoSelectType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSelectType]);

  // Auto-generate removed to allow user to review the summary first

  // Redirect to dashboard if no document is selected and no session exists
  if (!sessionId && !autoSelectType) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <motion.div
      className="h-screen bg-transparent flex flex-col"
      id="builder-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Mobile toggle */}
      <div className="md:hidden flex border-b border-surface-700/50 bg-surface-900">
        <button
          onClick={handleBackToSelector}
          className="p-3 text-surface-500 hover:text-surface-300 border-r border-surface-700/50"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => setMobileView('chat')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${mobileView === 'chat'
            ? 'text-brand-400 bg-brand-500/5 border-b-2 border-brand-500'
            : 'text-surface-400'
            }`}
          id="mobile-tab-chat"
        >
          <MessageSquare size={16} />
          Chat
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${mobileView === 'preview'
            ? 'text-brand-400 bg-brand-500/5 border-b-2 border-brand-500'
            : 'text-surface-400'
            }`}
          id="mobile-tab-preview"
        >
          <FileText size={16} />
          Preview
        </button>
      </div>

      {/* Desktop two-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel — Chat (~40%) */}
        <div className={`w-full md:w-[40%] md:min-w-[360px] md:max-w-[500px] border-r border-surface-700/50 flex flex-col
          ${mobileView === 'chat' ? 'flex' : 'hidden md:flex'}`}
        >
          {/* Back button (desktop) */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 border-b border-surface-700/50">
            <button onClick={handleBackToSelector} className="btn-ghost text-xs" id="btn-back-selector">
              <ArrowLeft size={14} />
              New Document
            </button>
            {documentType && (
              <span className="badge-free text-xs capitalize">{documentType.replace('_', ' ')}</span>
            )}
            <div className="ml-auto">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-ghost text-xs"
                id="btn-dashboard"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </button>
            </div>
          </div>

          {/* Template selector */}
          <TemplateSelector />

          {/* Chat */}
          <div className="flex-1 overflow-hidden">
            <ChatPanel />
          </div>

          {/* Quota */}
          <QuotaBar />
        </div>

        {/* Right panel — Preview (~60%) */}
        <div className={`flex-1 flex flex-col bg-surface-800/30
          ${mobileView === 'preview' ? 'flex' : 'hidden md:flex'}`}
        >
          <DocumentPreview />
        </div>
      </div>

      {/* Format sidebar (overlay) */}
      <FormatSidebar />

      {/* Upgrade modal */}
      <UpgradeModal />
    </motion.div>
  );
};

export default BuilderPage;
