/**
 * Chat Store — Zustand
 * Manages the AI chat session state, messages, field collection progress.
 * Includes DEMO MODE — when auth token is 'demo_token_for_testing', all
 * responses are simulated locally so the full UI can be tested without a backend.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DocumentType,
  ChatMessage,
  SpellCorrection,
  SchemaSummary,
  ChatStatus,
} from '../types';
import * as aiApi from '../api/ai';
import { useDocumentStore } from './documentStore';

interface ChatState {
  // Session
  sessionId: string | null;
  documentType: DocumentType | null;
  schemaSummary: SchemaSummary | null;

  // Messages
  messages: ChatMessage[];
  currentField: string | null;
  status: ChatStatus | null;

  // Field tracking
  collectedSlots: Record<string, unknown>;
  pendingRequired: string[];
  pendingOptional: string[];
  readyToGenerate: boolean;

  // Spell correction
  spellCorrections: SpellCorrection[];
  pendingCorrection: SpellCorrection | null;

  // Summary
  summary: string | null;
  collectedData: Record<string, unknown> | null;

  // UI state
  isLoading: boolean;
  error: string | null;

  // ─── Actions ────────────────────────────────────────────────────────────────

  /** Initialize a new AI session for a specific document type */
  startSession: (documentType: DocumentType) => Promise<void>;
  
  /** Send a message to the AI and update the chat and collected fields */
  sendMessage: (message: string) => Promise<void>;
  
  /** Accept or reject a pending spelling correction proposed by the AI */
  confirmCorrection: (accept: boolean) => Promise<void>;
  
  /** Fetch an updated list of missing required and optional fields */
  fetchMissingFields: () => Promise<void>;
  
  /** Get a natural language summary of the document data collected so far */
  fetchSummary: () => Promise<void>;
  
  /** Clear the chat session state entirely */
  resetChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
  sessionId: null,
  documentType: null,
  schemaSummary: null,
  messages: [],
  currentField: null,
  status: null,
  collectedSlots: {},
  pendingRequired: [],
  pendingOptional: [],
  readyToGenerate: false,
  spellCorrections: [],
  pendingCorrection: null,
  summary: null,
  collectedData: null,
  isLoading: false,
  error: null,

  startSession: async (documentType: DocumentType) => {
    set({ isLoading: true, error: null });

    // ── REAL API ──
    try {
      const response = await aiApi.startSession({ document_type: documentType });
      set({
        sessionId: response.session_id,
        documentType: response.document_type,
        schemaSummary: response.schema_summary,
        collectedSlots: response.collected_slots,
        pendingRequired: response.pending_required,
        pendingOptional: response.pending_optional,
        currentField: response.pending_required[0] || null,
        messages: [
          { role: 'assistant', content: response.opening_message },
        ],
        readyToGenerate: false,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to start session.';
      set({ error: message, isLoading: false });
    }
  },

  sendMessage: async (message: string) => {
    const state = get();
    if (!state.sessionId || !state.documentType || !state.currentField) return;

    // Add user message to chat
    const userMsg: ChatMessage = { role: 'user', content: message };
    const updatedMessages = [...state.messages, userMsg];
    set({ messages: updatedMessages, isLoading: true, error: null });

    // ── REAL API ──
    try {
      const response = await aiApi.sendChatMessage({
        session_id: state.sessionId,
        document_type: state.documentType,
        current_field: state.currentField,
        message,
        conversation_history: updatedMessages,
        collected_slots: state.collectedSlots,
      });

      const aiMsg: ChatMessage = { role: 'assistant', content: response.ai_message };
      
      set({
        messages: [...updatedMessages, aiMsg],
        currentField: response.current_field,
        status: response.status,
        collectedSlots: response.collected_slots,
        pendingRequired: response.pending_required,
        pendingOptional: response.pending_optional || state.pendingOptional,
        readyToGenerate: response.ready_to_generate,
        spellCorrections: response.spell_corrections || [],
        pendingCorrection: response.status === 'spell_correction_pending' && response.spell_corrections?.length
          ? response.spell_corrections[0]
          : null,
        isLoading: false,
      });

      // Update real-time preview
      useDocumentStore.getState().updatePreviewRealTime(response.collected_slots, state.documentType);
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Failed to send message.';
      set({ error: errMessage, isLoading: false });
    }
  },

  confirmCorrection: async (accept: boolean) => {
    const state = get();
    if (!state.sessionId || !state.pendingCorrection) return;

    set({ isLoading: true });
    try {
      const response = await aiApi.confirmCorrection({
        session_id: state.sessionId,
        field: state.pendingCorrection.field,
        original_value: state.pendingCorrection.original,
        suggested_value: state.pendingCorrection.suggested,
        accept,
      });

      const aiMsg: ChatMessage = { role: 'assistant', content: response.ai_message };
      set({
        messages: [...state.messages, aiMsg],
        currentField: response.next_field,
        collectedSlots: response.collected_slots,
        pendingRequired: response.pending_required,
        pendingCorrection: null,
        spellCorrections: [],
        isLoading: false,
      });
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Failed to confirm correction.';
      set({ error: errMessage, isLoading: false });
    }
  },

  fetchMissingFields: async () => {
    const state = get();
    if (!state.sessionId || !state.documentType) return;

    try {
      const response = await aiApi.getMissingFields({
        session_id: state.sessionId,
        document_type: state.documentType,
      });
      set({
        pendingRequired: response.missing_required.map(f => f.key),
        pendingOptional: response.missing_optional.map(f => f.key),
        readyToGenerate: response.ready_to_generate,
      });
    } catch {
      // Silent fail — progress indicator is non-critical
    }
  },

  fetchSummary: async () => {
    const state = get();
    if (!state.sessionId) return;

    set({ isLoading: true });

    // ── REAL API ──
    try {
      const response = await aiApi.getSummary(state.sessionId);
      set({
        summary: response.summary,
        collectedData: response.collected_data,
        readyToGenerate: response.ready_to_generate,
        isLoading: false,
      });
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Failed to get summary.';
      set({ error: errMessage, isLoading: false });
    }
  },

  resetChat: () => {
    set({
      sessionId: null,
      documentType: null,
      schemaSummary: null,
      messages: [],
      currentField: null,
      status: null,
      collectedSlots: {},
      pendingRequired: [],
      pendingOptional: [],
      readyToGenerate: false,
      spellCorrections: [],
      pendingCorrection: null,
      collectedData: null,
      isLoading: false,
      error: null,
    });
  },
}),
{
  name: 'doccraft-chat-storage',
}
));
