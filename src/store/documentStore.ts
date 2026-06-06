/**
 * Document Store — Zustand
 * Manages document generation, preview, layout, templates, and PDF export.
 * Includes DEMO MODE with mock templates and a sample invoice preview.
 */

import { create } from 'zustand';
import type {
  DocumentType,
  Template,
  LayoutState,
  GenerateDocumentResponse,
} from '../types';
import { persist } from 'zustand/middleware';
import * as documentsApi from '../api/documents';
import { useChatStore } from './chatStore';

function isDemoMode(): boolean {
  return localStorage.getItem('doccraft_token') === 'demo_token_for_testing';
}

// Demo templates for any document type
const DEMO_TEMPLATES: Template[] = [
  { template_id: 'tmpl_modern_01', name: 'Modern Blue', thumbnail_url: '', tier: 'free' },
  { template_id: 'tmpl_minimal_02', name: 'Minimal Grey', thumbnail_url: '', tier: 'free' },
  { template_id: 'tmpl_classic_03', name: 'Classic Pro', thumbnail_url: '', tier: 'pro' },
];

import { renderTemplate } from '../utils/templateRenderer';

interface DocumentState {
  documentId: string | null;
  previewHtml: string | null;
  layoutState: LayoutState | null;
  templates: Template[];
  selectedTemplate: string | null;
  accentColor: string;
  isGenerating: boolean;
  isExporting: boolean;
  isSidebarOpen: boolean;
  error: string | null;

  fetchTemplates: (documentType: DocumentType) => Promise<void>;
  selectTemplate: (templateId: string) => void;
  setAccentColor: (color: string) => void;
  generateDocument: (sessionId: string, documentType: DocumentType, data: Record<string, unknown>) => Promise<void>;
  updateLayout: (section: string, controls: Record<string, unknown>) => Promise<void>;
  updateContent: (slot: string, value: unknown) => Promise<void>;
  exportPdf: () => Promise<void>;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  resetDocument: () => void;
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
  documentId: null,
  previewHtml: null,
  layoutState: null,
  templates: [],
  selectedTemplate: null,
  accentColor: '#6366f1',
  isGenerating: false,
  isExporting: false,
  isSidebarOpen: false,
  error: null,

  fetchTemplates: async (documentType: DocumentType) => {
    // ── DEMO MODE ──
    if (isDemoMode()) {
      set({
        templates: DEMO_TEMPLATES,
        selectedTemplate: DEMO_TEMPLATES[0].template_id,
      });
      return;
    }

    try {
      const response = await documentsApi.getTemplates(documentType);
      const templates = response.templates;
      set({
        templates,
        selectedTemplate: templates.length > 0 ? templates[0].template_id : null,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load templates.';
      set({ error: message });
    }
  },

  selectTemplate: async (templateId: string) => {
    set({ selectedTemplate: templateId });
    const state = get();
    if (state.documentId && isDemoMode()) {
      const chatState = useChatStore.getState();
      if (chatState.collectedData) {
        set({ 
          previewHtml: renderTemplate(
            templateId, 
            chatState.collectedData, 
            state.layoutState, 
            state.accentColor,
            chatState.documentType || 'invoice'
          ) 
        });
      }
    }
  },

  setAccentColor: (color: string) => {
    set({ accentColor: color });
    const state = get();
    if (state.documentId) {
      state.updateLayout('accent_color', { color });
    }
  },

  generateDocument: async (sessionId, documentType, data) => {
    const state = get();
    const templateId = state.selectedTemplate || 'tmpl_modern_01';
    if (!state.selectedTemplate) set({ selectedTemplate: templateId });

    set({ isGenerating: true, error: null });

    // ── DEMO MODE ──
    if (isDemoMode()) {
      await new Promise(r => setTimeout(r, 800));
      const initialLayout: LayoutState = {
        headerAlignment: 'left',
        fontSize: 'medium',
        showLogo: false,
        showNotes: true,
        logoUrl: '',
        sectionOrder: ['header', 'client_details', 'line_items', 'total', 'notes'],
      };
      const previewHtml = renderTemplate(
        templateId, 
        data, 
        initialLayout, 
        state.accentColor, 
        documentType
      );
      set({
        documentId: 'demo_doc_001',
        previewHtml,
        layoutState: initialLayout,
        isGenerating: false,
      });
      return;
    }

    try {
      const response: GenerateDocumentResponse = await documentsApi.generateDocument({
        session_id: sessionId,
        document_type: documentType,
        template_id: templateId,
        accent_color: state.accentColor,
        data,
      });
      set({
        documentId: response.document_id,
        previewHtml: response.preview_html,
        layoutState: response.layout_state,
        isGenerating: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate document.';
      set({ error: message, isGenerating: false });
    }
  },

  updateLayout: async (section, controls) => {
    const state = get();
    if (!state.documentId) return;

    // ── DEMO MODE — dynamically update and re-render ──
    if (isDemoMode()) {
      const collectedData = useChatStore.getState().collectedData;
      
      const newLayoutState = { ...state.layoutState } as LayoutState;
      if (controls.color) set({ accentColor: controls.color as string });
      if (controls.alignment) {
        newLayoutState.headerAlignment = controls.alignment as any; // fallback
        newLayoutState[`${section}_alignment`] = controls.alignment;
      }
      if (controls.visible !== undefined) {
        if (section === 'logo') newLayoutState.showLogo = controls.visible as boolean;
        if (section === 'notes') newLayoutState.showNotes = controls.visible as boolean;
      }
      if (controls.showQuantityColumn !== undefined) {
        newLayoutState.showQuantityColumn = controls.showQuantityColumn as boolean;
      }
      if (controls.logoUrl !== undefined) newLayoutState.logoUrl = controls.logoUrl as string;
      if (controls.sectionOrder !== undefined) newLayoutState.sectionOrder = controls.sectionOrder as string[];
      
      if (controls.fontSize !== undefined) {
        newLayoutState.fontSize = controls.fontSize as any; // fallback
        newLayoutState[`${section}_fontSize`] = controls.fontSize;
      }
      if (controls.fontFamily !== undefined) newLayoutState.fontFamily = controls.fontFamily as string;
      if (controls.bold !== undefined) {
        newLayoutState.bold = controls.bold as boolean; // fallback
        newLayoutState[`${section}_bold`] = controls.bold;
      }

      const updatedAccent = controls.color ? (controls.color as string) : state.accentColor;
      
      set({ layoutState: newLayoutState });

      if (collectedData && state.selectedTemplate) {
        const previewHtml = renderTemplate(
          state.selectedTemplate!, 
          collectedData, 
          newLayoutState, 
          updatedAccent,
          useChatStore.getState().documentType || 'invoice'
        );
        set({ previewHtml });
      }
      return;
    }

    try {
      const response = await documentsApi.updateLayout(state.documentId, { section, controls });
      set({
        previewHtml: response.updated_preview_html,
        layoutState: response.layout_state,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update layout.';
      set({ error: message });
    }
  },

  updateContent: async (slot, value) => {
    const state = get();
    if (!state.documentId) return;
    if (isDemoMode()) return;

    try {
      const response = await documentsApi.updateContent(state.documentId, { slot, value });
      set({ previewHtml: response.updated_preview_html });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update content.';
      set({ error: message });
    }
  },

  exportPdf: async () => {
    const state = get();
    if (!state.documentId) return;

    set({ isExporting: true, error: null });

    // ── DEMO MODE — use html2pdf.js for client-side PDF ──
    if (isDemoMode() && state.previewHtml) {
      try {
        const html2pdf = (await import('html2pdf.js')).default;
        const container = document.createElement('div');
        container.innerHTML = state.previewHtml;
        container.style.width = '800px';
        container.style.background = 'white';
        document.body.appendChild(container);
        await html2pdf().from(container).set({
          margin: 10,
          filename: 'DocCraft-Demo-Invoice.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, windowWidth: 800, width: 800, useCORS: true, letterRendering: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        }).save();
        document.body.removeChild(container);
        set({ isExporting: false });
      } catch {
        // Fallback: just alert
        alert('Demo mode: PDF export requires html2pdf.js. In production, the server generates the PDF.');
        set({ isExporting: false });
      }
      return;
    }

    try {
      const blob = await documentsApi.exportPdf(state.documentId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      set({ isExporting: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to export PDF.';
      set({ error: message, isExporting: false });
      throw err;
    }
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSidebarOpen: (open: boolean) => {
    set({ isSidebarOpen: open });
  },

  resetDocument: () => {
    set({
      documentId: null,
      previewHtml: null,
      layoutState: null,
      templates: [],
      selectedTemplate: null,
      accentColor: '#6366f1',
      isGenerating: false,
      isExporting: false,
      isSidebarOpen: false,
      error: null,
    });
  },
}),
{
  name: 'doccraft-document-storage',
}
));
