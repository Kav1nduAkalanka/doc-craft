/**
 * Document Generation API endpoints
 * Maps to: POST /documents/generate, PATCH /documents/{id}/layout,
 *          PATCH /documents/{id}/content, GET /templates, POST /documents/{id}/export/pdf
 */

import { post, patch, get, apiRequest } from './client';
import type {
  GenerateDocumentRequest,
  GenerateDocumentResponse,
  LayoutUpdateRequest,
  LayoutUpdateResponse,
  ContentUpdateRequest,
  ContentUpdateResponse,
  TemplatesResponse,
  DocumentType,
} from '../types';

/** POST /documents/generate — Generate a document preview */
export function generateDocument(data: GenerateDocumentRequest): Promise<GenerateDocumentResponse> {
  return post<GenerateDocumentResponse>('/documents/generate', data);
}

/** PATCH /documents/{id}/layout — Update layout/formatting */
export function updateLayout(documentId: string, data: LayoutUpdateRequest): Promise<LayoutUpdateResponse> {
  return patch<LayoutUpdateResponse>(`/documents/${documentId}/layout`, data);
}

/** PATCH /documents/{id}/content — Update data content fields */
export function updateContent(documentId: string, data: ContentUpdateRequest): Promise<ContentUpdateResponse> {
  return patch<ContentUpdateResponse>(`/documents/${documentId}/content`, data);
}

/** GET /templates?document_type=... — Get available templates */
export function getTemplates(documentType: DocumentType): Promise<TemplatesResponse> {
  return get<TemplatesResponse>(`/templates?document_type=${documentType}`);
}

/** POST /documents/{id}/export/pdf — Generate and download PDF */
export function exportPdf(documentId: string): Promise<Blob> {
  return apiRequest<Blob>(`/documents/${documentId}/export/pdf`, {
    method: 'POST',
    responseType: 'blob',
  });
}
