/**
 * Document Store — Zustand
 *
 * Manages the full document lifecycle:
 *   - Template selection and listing
 *   - Document generation (from collected AI chat slots)
 *   - Live preview HTML rendering
 *   - Layout controls (alignment, font, logo toggle, section reorder)
 *   - PDF export (server-side)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DocumentType,
  Template,
  LayoutState,
  GenerateDocumentResponse,
} from '../types';
import * as documentsApi from '../api/documents';
import { ApiRequestError } from '../api/client';
import { useChatStore } from './chatStore';
import { useQuotaStore } from './quotaStore';
import { renderTemplate, renderTemplateSections } from '../utils/templateRenderer';

interface DocumentState {
  documentId: string | null;
  previewHtml: string | null;
  previewSections: Record<string, string> | null;
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
  updatePreviewRealTime: (data: Record<string, unknown>, documentType?: DocumentType) => void;
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documentId: null,
      previewHtml: null,
      previewSections: null,
      layoutState: null,
      templates: [],
      selectedTemplate: null,
      accentColor: '#6366f1',
      isGenerating: false,
      isExporting: false,
      isSidebarOpen: false,
      error: null,

      fetchTemplates: async (documentType: DocumentType) => {
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

      selectTemplate: (templateId: string) => {
        set({ selectedTemplate: templateId });
        const state = get();
        if (state.layoutState) {
          const chatStore = useChatStore.getState();
          const slots = chatStore.collectedData || chatStore.collectedSlots || {};
          const docType = chatStore.documentType || 'invoice';
          const newHtml = renderTemplate(templateId, slots, state.layoutState, state.accentColor, docType);
          const newSections = renderTemplateSections(templateId, slots, state.layoutState, state.accentColor, docType);
          set({ previewHtml: newHtml, previewSections: newSections });
        }
      },

      setAccentColor: (color: string) => {
        set({ accentColor: color });
        const state = get();
        if (state.layoutState) {
          // Re-render the template with the new accent color directly
          const chatStore = useChatStore.getState();
          const slots = chatStore.collectedData || chatStore.collectedSlots || {};
          const docType = chatStore.documentType || 'invoice';
          const newHtml = renderTemplate(
            state.selectedTemplate || 'inv_standard',
            slots,
            state.layoutState,
            color,
            docType
          );
          const newSections = renderTemplateSections(
            state.selectedTemplate || 'inv_standard',
            slots,
            state.layoutState,
            color,
            docType
          );
          set({ previewHtml: newHtml, previewSections: newSections });
        }
      },

      generateDocument: async (sessionId, documentType, data) => {
        const state = get();
        const templateId = state.selectedTemplate || (state.templates[0]?.template_id ?? 'inv_standard');
        if (!state.selectedTemplate) set({ selectedTemplate: templateId });

        set({ isGenerating: true, error: null });

        const initialLayout: LayoutState = {
          headerAlignment: 'left',
          fontSize: 'medium',
          showLogo: true,
          logoUrl: '',
          showNotes: true,
          showClientDetails: true,
          showQuantityColumn: true,
          lineItemsOrder: [],
          totalAlignment: 'right',
          totalFontSize: 'medium',
        };

        // Render locally regardless of backend success
        const previewHtml = renderTemplate(templateId, data, initialLayout, state.accentColor, documentType);
        const previewSections = renderTemplateSections(templateId, data, initialLayout, state.accentColor, documentType);

        // Try to save to backend, but use a local fallback ID if it fails
        let docId: string;
        try {
          const response: GenerateDocumentResponse = await documentsApi.generateDocument({
            session_id: sessionId,
            document_type: documentType,
            template_id: templateId,
            accent_color: state.accentColor,
            data,
          });
          docId = response.document_id;
        } catch (err: unknown) {
          console.warn('Backend document save failed (using local ID):', err);
          docId = `local_${crypto.randomUUID()}`;
        }

        set({
          documentId: docId,
          previewHtml: previewHtml,
          previewSections: previewSections,
          layoutState: initialLayout,
          isGenerating: false,
        });
      },

      updateLayout: async (section, controls) => {
        const state = get();
        if (!state.layoutState) return;

        // 1. Optimistic Local Update
        const mappedControls: Record<string, any> = {};

        if (section === 'global' || section === 'section_order') {
          Object.assign(mappedControls, controls);
        } else if (section === 'accent_color') {
          // Accent color is handled by setAccentColor directly — no layout key needed
          // This branch is kept as a no-op to avoid the generic else creating bad keys
        } else if (section === 'logo') {
          if ('visible' in controls) mappedControls.showLogo = controls.visible;
          if ('logoUrl' in controls) mappedControls.logoUrl = controls.logoUrl;
        } else if (section === 'line_items') {
          Object.assign(mappedControls, controls); // showQuantityColumn etc
        } else if (section === 'notes') {
          if ('visible' in controls) mappedControls.showNotes = controls.visible;
          if ('fontSize' in controls) mappedControls.notes_fontSize = controls.fontSize;
          if ('bold' in controls) mappedControls.notes_bold = controls.bold;
        } else {
          // For header, total, client_details, etc.
          for (const [key, value] of Object.entries(controls)) {
            if (key === 'visible' && section === 'client_details') {
              mappedControls.showClientDetails = value;
            } else {
              mappedControls[`${section}_${key}`] = value;
            }
          }
        }

        const newLayoutState = { ...state.layoutState, ...mappedControls };
        const chatStore = useChatStore.getState();
        const slots = chatStore.collectedData || chatStore.collectedSlots || {};
        const docType = chatStore.documentType || 'invoice';

        const newHtml = renderTemplate(
          state.selectedTemplate || 'inv_standard',
          slots,
          newLayoutState,
          state.accentColor,
          docType
        );
        const newSections = renderTemplateSections(
          state.selectedTemplate || 'inv_standard',
          slots,
          newLayoutState,
          state.accentColor,
          docType
        );

        set({ layoutState: newLayoutState, previewHtml: newHtml, previewSections: newSections });

        // 2. Background Sync
        if (state.documentId && !state.documentId.startsWith('local_')) {
          try {
            await documentsApi.updateLayout(state.documentId, { section, controls });
          } catch (err: unknown) {
            console.error("Failed to sync layout to backend:", err);
          }
        }
      },

      updateContent: async (slot, value) => {
        const state = get();

        // 1. Optimistic Local Update
        const chatStore = useChatStore.getState();
        const baseSlots = chatStore.collectedData || chatStore.collectedSlots || {};
        const slots = { ...baseSlots, [slot]: value };
        const docType = chatStore.documentType || 'invoice';

        const newHtml = renderTemplate(
          state.selectedTemplate || 'inv_standard',
          slots,
          state.layoutState || ({} as any),
          state.accentColor,
          docType
        );
        const newSections = renderTemplateSections(
          state.selectedTemplate || 'inv_standard',
          slots,
          state.layoutState || ({} as any),
          state.accentColor,
          docType
        );

        set({ previewHtml: newHtml, previewSections: newSections });

        // 2. Background Sync
        if (state.documentId && !state.documentId.startsWith('local_')) {
          try {
            await documentsApi.updateContent(state.documentId, { slot, value });
          } catch (err: unknown) {
            console.error("Failed to sync content to backend:", err);
          }
        }
      },

      exportPdf: async () => {
        const state = get();
        if (!state.previewHtml) return;

        set({ isExporting: true, error: null });

        try {
          // 0. Auto-generate document if not yet saved to the database
          let documentId = state.documentId;
          if (!documentId || documentId.startsWith('local_')) {
            const chatStore = useChatStore.getState();
            const data = chatStore.collectedSlots;
            if (chatStore.sessionId && chatStore.documentType && data && Object.keys(data).length > 0) {
              try {
                await get().generateDocument(chatStore.sessionId, chatStore.documentType, data);
                documentId = get().documentId;
              } catch (genErr) {
                console.warn('Auto-generate before export failed:', genErr);
              }
            }
          }

          // 1. Check quota with the backend — only block if quota is explicitly exceeded (403)
          if (documentId && !documentId.startsWith('local_')) {
            try {
              await documentsApi.exportPdf(documentId);
              useQuotaStore.getState().fetchQuota();
            } catch (backendErr: unknown) {
              if (backendErr instanceof ApiRequestError && backendErr.status === 403) {
                // Quota exceeded — block the download and let the caller show the upgrade modal
                set({ isExporting: false, error: backendErr.message });
                throw backendErr;
              }
              // Any other backend error (auth, network, server down) — log but continue
              // The PDF generation is client-side and shouldn't be blocked by backend issues
              console.warn('Backend export tracking failed (non-blocking):', backendErr);
            }
          }

          // 2. Local PDF Generation (always runs unless quota is exceeded)
          const html2pdfModule = await import('html2pdf.js');
          const html2pdf = (html2pdfModule.default || html2pdfModule) as any;

          const element = document.querySelector('.preview-container');
          if (!element) throw new Error("Preview container not found on screen");

          const container = element.cloneNode(true) as HTMLElement;

          // Remove drag handles from the cloned PDF
          container.querySelectorAll('.cursor-grab').forEach(el => el.remove());
          // Remove contenteditable outlines
          container.querySelectorAll('[contenteditable="true"]').forEach(el => {
            (el as HTMLElement).style.outline = 'none';
            (el as HTMLElement).removeAttribute('contenteditable');
          });

          container.style.width = '800px';
          container.style.background = 'white';
          container.style.height = 'auto';

          // Temporarily append off-screen for rendering
          const wrapper = document.createElement('div');
          wrapper.style.position = 'absolute';
          wrapper.style.left = '-9999px';
          wrapper.style.top = '0';
          wrapper.appendChild(container);
          document.body.appendChild(wrapper);

          await html2pdf().from(container).set({
            margin: 10,
            filename: 'DocCraft-Document.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, windowWidth: 800, width: 800, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          }).save();

          document.body.removeChild(wrapper);
          set({ isExporting: false });
        } catch (err: unknown) {
          set({ isExporting: false });

          // Re-throw API errors (e.g. 403 quota exceeded) so the caller can show the upgrade modal
          if (err instanceof ApiRequestError) {
            throw err;
          }

          const message = err instanceof Error ? err.message : 'Failed to export PDF locally.';
          set({ error: message });
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
          previewSections: null,
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

      updatePreviewRealTime: (data, documentType = 'invoice') => {
        const state = get();
        const templateId = state.selectedTemplate || (state.templates[0]?.template_id ?? 'inv_standard');
        const initialLayout: LayoutState = state.layoutState || {
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
        const previewSections = renderTemplateSections(
          templateId,
          data,
          initialLayout,
          state.accentColor,
          documentType
        );
        set({
          previewHtml,
          previewSections,
          layoutState: initialLayout,
        });
      },
    }),
    {
      name: 'doccraft-document-storage',
    }
  ));
