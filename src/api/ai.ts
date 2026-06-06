/**
 * AI / LLM API endpoints
 * Maps to: POST /ai/session/start, POST /ai/chat, POST /ai/correction/confirm,
 *          POST /ai/missing-fields, POST /ai/summary
 */

import { post } from './client';
import type {
  SessionStartRequest,
  SessionStartResponse,
  ChatRequest,
  ChatResponse,
  CorrectionConfirmRequest,
  CorrectionConfirmResponse,
  MissingFieldsRequest,
  MissingFieldsResponse,
  AISummaryResponse,
} from '../types';

/** POST /ai/session/start — Start a new AI chat session for a document type */
export function startSession(data: SessionStartRequest): Promise<SessionStartResponse> {
  return post<SessionStartResponse>('/ai/session/start', data);
}

/** POST /ai/chat — Send a user message and get AI response */
export function sendChatMessage(data: ChatRequest): Promise<ChatResponse> {
  return post<ChatResponse>('/ai/chat', data);
}

/** POST /ai/correction/confirm — Accept or reject a spelling correction */
export function confirmCorrection(data: CorrectionConfirmRequest): Promise<CorrectionConfirmResponse> {
  return post<CorrectionConfirmResponse>('/ai/correction/confirm', data);
}

/** POST /ai/missing-fields — Get list of missing fields */
export function getMissingFields(data: MissingFieldsRequest): Promise<MissingFieldsResponse> {
  return post<MissingFieldsResponse>('/ai/missing-fields', data);
}

/** POST /ai/summary — Get summary of collected data before generating */
export function getSummary(sessionId: string): Promise<AISummaryResponse> {
  return post<AISummaryResponse>('/ai/summary', { session_id: sessionId });
}
