import React, { useRef, useEffect, useState } from 'react';
import { Send, RotateCcw, FileCheck, Loader2 } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useDocumentStore } from '../store/documentStore';
import ChatMessage from './ChatMessage';
import SpellCorrectionBanner from './SpellCorrectionBanner';
import ProgressIndicator from './ProgressIndicator';

const ChatPanel: React.FC = () => {
  const {
    messages,
    currentField,
    collectedSlots,
    pendingRequired,
    readyToGenerate,
    pendingCorrection,
    schemaSummary,
    isLoading,
    error,
    sendMessage,
    confirmCorrection,
    resetChat,
    sessionId,
    documentType,
  } = useChatStore();

  const { generateDocument, isGenerating } = useDocumentStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingCorrection]);

  // Focus input when field changes
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentField, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const collectedCount = Object.keys(collectedSlots).length;
  const totalRequired = schemaSummary?.required_fields || 7;

  return (
    <div className="flex flex-col h-full bg-surface-900" id="chat-panel">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700/50 bg-surface-900/50 backdrop-blur-sm">
        <div>
          <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
          <p className="text-xs text-surface-400">
            {readyToGenerate ? 'All fields collected!' : currentField ? `Asking: ${currentField}` : 'Ready to start'}
          </p>
        </div>
        <div className="flex gap-1.5">
          {readyToGenerate && (
            <button
              onClick={() => {
                if (sessionId && documentType && collectedSlots) {
                  generateDocument(sessionId, documentType, collectedSlots);
                }
              }}
              id="btn-generate"
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/80 text-white text-xs font-medium rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={13} className="animate-spin" /> : <FileCheck size={13} />}
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          )}
          <button
            onClick={resetChat}
            id="btn-reset-chat"
            className="p-1.5 text-surface-500 hover:text-surface-300 hover:bg-surface-800 rounded-lg transition-colors"
            title="Start over"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Progress */}
      {schemaSummary && (
        <ProgressIndicator
          totalRequired={totalRequired}
          collectedCount={collectedCount}
          pendingRequired={pendingRequired}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}

        {/* Spell correction banner */}
        {pendingCorrection && (
          <SpellCorrectionBanner
            correction={pendingCorrection}
            onAccept={() => confirmCorrection(true)}
            onReject={() => confirmCorrection(false)}
            isLoading={isLoading}
          />
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-surface-500 text-xs px-2 animate-fade-in">
            <Loader2 size={14} className="animate-spin" />
            AI is thinking...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-300 animate-fade-in">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-3 pb-3 pt-1">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              readyToGenerate
                ? 'Type to add optional fields or review...'
                : pendingCorrection
                  ? 'Accept or reject the spelling suggestion above'
                  : 'Type your answer...'
            }
            disabled={isLoading || !!pendingCorrection}
            className="input-field text-sm !py-2.5 !rounded-xl"
            id="chat-input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !!pendingCorrection}
            className="btn-primary !p-2.5 !rounded-xl flex-shrink-0"
            id="chat-send"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
