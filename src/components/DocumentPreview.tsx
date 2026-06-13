import React, { useState, useEffect } from 'react';
import { useDocumentStore } from '../store/documentStore';
import { Download, Sliders, Loader2, FileText, GripVertical, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { ApiRequestError } from '../api/client';
import { useQuotaStore } from '../store/quotaStore';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableSection(props: { id: string; html: string; isPreview?: boolean; isFinalPreview?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.id, disabled: props.isFinalPreview });

  const elementRef = React.useRef<HTMLDivElement>(null);
  const lastPropsHtmlRef = React.useRef("");

  React.useEffect(() => {
    if (elementRef.current && props.html !== lastPropsHtmlRef.current) {
      // Manually set HTML only when the external prop actually changes (e.g. layout update)
      elementRef.current.innerHTML = props.html;
      lastPropsHtmlRef.current = props.html;
    }
  }, [props.html]);

  React.useEffect(() => {
    if (elementRef.current) {
      if (props.isFinalPreview) {
        // Find all editable elements and lock them
        elementRef.current.querySelectorAll('[contenteditable="true"]').forEach(el => {
          el.setAttribute('contenteditable', 'false');
          el.setAttribute('data-was-editable', 'true');
          // Also remove focus if active
          if (document.activeElement === el) {
            (el as HTMLElement).blur();
          }
        });
      } else {
        // Unlock elements that were previously editable
        elementRef.current.querySelectorAll('[data-was-editable="true"]').forEach(el => {
          el.setAttribute('contenteditable', 'true');
          el.removeAttribute('data-was-editable');
        });
      }
    }
  }, [props.isFinalPreview]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="group mb-2 relative rounded-lg border border-transparent hover:border-brand-500/30 transition-all duration-200">
      {!props.isFinalPreview && (
        <div
          className="absolute left-0 top-6 -ml-4 p-1.5 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing bg-surface-800 rounded shadow-md text-surface-400 hover:text-brand-400 transition-all z-10 hidden sm:block"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </div>
      )}
      <div
        ref={elementRef}
        contentEditable={!props.isFinalPreview}
        suppressContentEditableWarning
        className="pointer-events-auto outline-none"
        onInput={(e) => {
          // Inline editing handling updates the central store
          const target = e.target as HTMLElement;
          const slot = target.getAttribute('data-slot');
          if (slot) {
            useChatStore.setState((state) => ({
              collectedSlots: {
                ...state.collectedSlots,
                [slot]: target.innerText
              }
            }));
          }
        }}
      />
    </div>
  );
}

const DocumentPreview: React.FC = () => {
  const {
    previewHtml,
    previewSections,
    layoutState,
    isGenerating,
    isExporting,
    exportPdf,
    toggleSidebar,
    updateLayout,
  } = useDocumentStore();

  const { readyToGenerate } = useChatStore();
  const { setShowUpgradeModal } = useQuotaStore();

  const [items, setItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'edit' | 'final'>('edit');
  const [showConfirmExport, setShowConfirmExport] = useState(false);

  useEffect(() => {
    if (layoutState?.sectionOrder) {
      setItems(layoutState.sectionOrder);
    }
  }, [layoutState?.sectionOrder]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      setItems(newOrder);
      // Update store
      updateLayout('global', { sectionOrder: newOrder });
    }
  };

  const confirmExport = async () => {
    setShowConfirmExport(false);
    try {
      await exportPdf();
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 403) {
        setShowUpgradeModal(true);
      }
    }
  };

  // Empty state
  if (!previewHtml && !previewSections && !readyToGenerate) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8" id="preview-empty">
        <div className="w-20 h-20 rounded-2xl bg-surface-800 flex items-center justify-center mb-6 animate-pulse-soft">
          <FileText size={36} className="text-surface-600" />
        </div>
        <h3 className="text-lg font-semibold text-surface-300 mb-2">Document Preview</h3>
        <p className="text-sm text-surface-500 max-w-sm">
          Your document will appear here once the AI has collected the required information.
          Start by selecting a document type and chatting with the assistant.
        </p>
      </div>
    );
  }

  // Document preview with Drag and Drop Editor
  return (
    <div className="flex flex-col h-full" id="document-preview">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700/50 bg-surface-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-white">Preview & Edit</h3>
          
          <div className="flex bg-surface-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'edit' ? 'bg-surface-600 text-white' : 'text-surface-400 hover:text-surface-300'
              }`}
            >
              Interactive
            </button>
            <button
              onClick={() => setViewMode('final')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'final' ? 'bg-brand-600 text-white' : 'text-surface-400 hover:text-surface-300'
              }`}
            >
              Final Preview
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleSidebar}
            id="btn-format-sidebar"
            className="btn-ghost text-xs"
          >
            <Sliders size={14} />
            Format
          </button>
          <button
            onClick={() => setShowConfirmExport(true)}
            disabled={isExporting}
            id="btn-export-pdf"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-surface-800/50">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 size={32} className="text-brand-400 animate-spin" />
            <p className="text-sm text-surface-400">Generating your document...</p>
          </div>
        ) : (
          <div className="max-w-[800px] mx-auto sm:pl-8">
            {previewSections && items.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={items}
                  strategy={verticalListSortingStrategy}
                >
                  <div
                    className="preview-container p-8"
                    style={{
                      fontFamily: layoutState?.fontFamily && layoutState.fontFamily !== 'default'
                        ? layoutState.fontFamily
                        : useDocumentStore.getState().selectedTemplate?.includes('_minimal')
                          ? "'Roboto', sans-serif"
                          : useDocumentStore.getState().selectedTemplate?.includes('_classic')
                            ? "'Times New Roman', serif"
                            : "'Inter', sans-serif",
                      color: '#1e293b'
                    }}
                  >
                    {items.map((id) => (
                      previewSections[id] ? <SortableSection key={id} id={id} html={previewSections[id]} isFinalPreview={viewMode === 'final'} /> : null
                    ))}
                    {useAuthStore.getState().user?.plan !== 'pro' && (
                      <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid #e2e8f0', marginTop: '16px' }}>
                        <p style={{ fontSize: '10px', color: '#cbd5e1' }}>Generated with DocCraft · doccraft.app</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div
                contentEditable={viewMode !== 'final'}
                suppressContentEditableWarning
                className="preview-container p-8 outline-none"
                dangerouslySetInnerHTML={{ __html: previewHtml || '' }}
              />
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showConfirmExport && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowConfirmExport(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-surface-900 border border-surface-700 p-6 rounded-2xl shadow-2xl max-w-sm w-full"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center mb-4 text-brand-400">
                    <Download size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Download Final PDF?</h3>
                  <p className="text-sm text-surface-400 mb-6">
                    Make sure you've reviewed the document and are happy with all the details. This will consume 1 document from your daily quota.
                  </p>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setShowConfirmExport(false)}
                      className="flex-1 px-4 py-2 bg-surface-800 text-surface-300 text-sm font-semibold rounded-lg hover:bg-surface-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmExport}
                      className="flex-1 px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-500 transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentPreview;
