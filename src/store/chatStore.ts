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

// ─── Demo mode helpers ────────────────────────

function isDemoMode(): boolean {
  return localStorage.getItem('doccraft_token') === 'demo_token_for_testing';
}

// Demo invoice field flow
const DEMO_INVOICE_FIELDS = [
  { key: 'businessName', question: "Let's build your invoice! What's your business name?" },
  { key: 'invoiceNumber', question: 'Got it! What invoice number should we use? (e.g. INV-0001)' },
  { key: 'issueDate', question: "What's the invoice date? (e.g. today, 2026-06-06)" },
  { key: 'dueDate', question: 'When is payment due? (e.g. in 14 days, 2026-06-20)' },
  { key: 'senderEmail', question: "What's your business email?" },
  { key: 'clientName', question: 'Who are you billing? (client name or company)' },
  { key: 'lineItems', question: "What items or services are you billing for? (e.g. 'Web Design, qty 1, LKR 1500')" },
  { key: 'senderAddress', question: "What's your business address? (optional — press Enter to skip)" },
  { key: 'taxRate', question: 'Tax / VAT rate? Enter a percentage or 0 (optional)' },
  { key: 'notesAndTerms', question: 'Any notes or payment terms? (optional)' },
];

const DEMO_REQUIRED_KEYS = ['businessName', 'invoiceNumber', 'issueDate', 'dueDate', 'senderEmail', 'clientName', 'lineItems'];

// ──────────────────────────────────────────────

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
  demoFieldIndex: number;

  // Actions
  startSession: (documentType: DocumentType) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  confirmCorrection: (accept: boolean) => Promise<void>;
  fetchMissingFields: () => Promise<void>;
  fetchSummary: () => Promise<void>;
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
  demoFieldIndex: 0,

  startSession: async (documentType: DocumentType) => {
    set({ isLoading: true, error: null });

    // ── DEMO MODE ──
    if (isDemoMode()) {
      await new Promise(r => setTimeout(r, 500)); // Simulate network delay
      const firstField = DEMO_INVOICE_FIELDS[0];
      set({
        sessionId: 'demo_sess_001',
        documentType,
        schemaSummary: {
          total_fields: 16,
          required_fields: 7,
          optional_fields: 9,
          computed_fields: ['lineItems[].total', 'subtotal', 'discountAmount', 'taxAmount', 'totalDue'],
          required_keys: DEMO_REQUIRED_KEYS,
        },
        collectedSlots: {},
        pendingRequired: [...DEMO_REQUIRED_KEYS],
        pendingOptional: ['senderAddress', 'senderPhone', 'clientEmail', 'clientAddress', 'bankName', 'accountNumber', 'accountName', 'discountRate', 'taxRate', 'notesAndTerms'],
        currentField: firstField.key,
        messages: [{ role: 'assistant', content: firstField.question }],
        readyToGenerate: false,
        isLoading: false,
        demoFieldIndex: 0,
      });
      return;
    }

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

    // ── DEMO MODE ──
    if (isDemoMode()) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400)); // Simulate AI thinking

      const newSlots = { ...state.collectedSlots };
      const currentKey = state.currentField;

      // Save the value
      if (currentKey === 'lineItems') {
        newSlots[currentKey] = [
          { description: message || 'Web Design', quantity: 1, unitPrice: 1500.00, total: 1500.00 }
        ];
      } else {
        newSlots[currentKey] = message;
      }

      const nextIdx = state.demoFieldIndex + 1;
      const remaining = DEMO_REQUIRED_KEYS.filter(k => !(k in newSlots));
      const allRequiredDone = remaining.length === 0;

      // Pick next field
      let nextField: typeof DEMO_INVOICE_FIELDS[0] | undefined;
      if (nextIdx < DEMO_INVOICE_FIELDS.length) {
        nextField = DEMO_INVOICE_FIELDS[nextIdx];
      }

      let aiResponse: string;
      if (allRequiredDone && nextIdx >= DEMO_REQUIRED_KEYS.length) {
        if (nextField && nextIdx < DEMO_INVOICE_FIELDS.length) {
          aiResponse = `Saved! ${nextField.question}`;
        } else {
          aiResponse = "All details collected! Click the **Review** button above to see a summary, then we'll generate your document.";
        }
      } else {
        aiResponse = nextField
          ? `Got it — "${message}". ${nextField.question}`
          : "All required details are in! Click **Review** to continue.";
      }

      const aiMsg: ChatMessage = { role: 'assistant', content: aiResponse };
      const isComplete = allRequiredDone && (!nextField || nextIdx >= DEMO_INVOICE_FIELDS.length);

      set({
        messages: [...updatedMessages, aiMsg],
        currentField: isComplete ? null : (nextField?.key || null),
        status: isComplete ? 'complete' : 'ok',
        collectedSlots: newSlots,
        pendingRequired: remaining,
        readyToGenerate: isComplete,
        isLoading: false,
        demoFieldIndex: nextIdx,
      });
      return;
    }

    // ── REAL API ──
    try {
      const response = await aiApi.sendChatMessage({
        session_id: state.sessionId,
        document_type: state.documentType,
        current_field: state.currentField,
        message,
        conversation_history: updatedMessages,
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
    if (isDemoMode()) return; // Demo tracks this locally

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

    // ── DEMO MODE ──
    if (isDemoMode()) {
      await new Promise(r => setTimeout(r, 500));
      const slots = state.collectedSlots;
      const lineItems = (slots.lineItems as Array<{description: string; quantity: number; unitPrice: number; total: number}>) || [];
      const subtotal = lineItems.reduce((sum, item) => sum + (item.total || 0), 0);

      const summaryText = `Here's your invoice summary:
- Invoice #${slots.invoiceNumber || 'INV-0001'}
- Date: ${slots.issueDate || '2026-06-06'}  |  Due: ${slots.dueDate || '2026-06-20'}
- From: ${slots.businessName || 'Your Business'} (${slots.senderEmail || 'email@example.com'})
- Bill To: ${slots.clientName || 'Client'}
- Line items: ${lineItems.map(i => `${i.description} × ${i.quantity} = LKR ${i.total.toFixed(2)}`).join(', ') || 'N/A'}
- Tax: ${slots.taxRate || '0'}%
- Total Due: LKR ${subtotal.toFixed(2)}`;

      const collectedData = {
        ...slots,
        subtotal,
        discountRate: 0,
        discountAmount: 0,
        taxRate: Number(slots.taxRate) || 0,
        taxAmount: subtotal * (Number(slots.taxRate) || 0) / 100,
        totalDue: subtotal + subtotal * (Number(slots.taxRate) || 0) / 100,
      };

      set({
        summary: summaryText,
        collectedData,
        readyToGenerate: true,
        isLoading: false,
      });
      return;
    }

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
      summary: null,
      collectedData: null,
      isLoading: false,
      error: null,
      demoFieldIndex: 0,
    });
  },
}),
{
  name: 'doccraft-chat-storage',
}
));
