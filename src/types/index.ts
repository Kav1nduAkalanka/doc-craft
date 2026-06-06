/* ============================================
   Type Definitions for DocCraft Frontend
   Based on API Documentation v1.2
   ============================================ */

// ─── Enums & Literals ─────────────────────────

export type Plan = 'free' | 'pro';
export type DocumentType = 'invoice' | 'quotation' | 'proposal' | 'receipt' | 'purchase_order';
export type AuthProvider = 'email' | 'google';

export type ChatStatus = 'ok' | 'spell_correction_pending' | 'validation_error' | 'complete';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';
export type DocumentStatus = 'draft' | 'exported';
export type TemplateTier = 'free' | 'pro';

export type Alignment = 'left' | 'center' | 'right';
export type FontSize = 'small' | 'medium' | 'large';

// ─── User & Auth ──────────────────────────────

export interface User {
  user_id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  auth_provider: AuthProvider;
  plan: Plan;
  timezone?: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  user: User;
}

export interface RegisterResponse {
  user_id: string;
  email: string;
  auth_provider: AuthProvider;
  created_at: string;
}

export interface GuestSession {
  session_token: string;
  quota: {
    allowed: number;
    used: number;
  };
}

// ─── Quota & Subscription ─────────────────────

export interface Quota {
  plan: Plan;
  daily_limit: number;
  used_today: number;
  remaining: number;
  resets_at: string;
}

export interface Subscription {
  plan: string;
  status: SubscriptionStatus;
  current_period_end: string;
  stripe_customer_id: string;
}

export interface CheckoutResponse {
  checkout_url: string;
}

export interface PortalResponse {
  portal_url: string;
}

// ─── AI Chat ──────────────────────────────────

export interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
}

export interface SpellCorrection {
  original: string;
  suggested: string;
  field: string;
  confidence: number;
}

export interface ValidationError {
  field: string;
  field_label: string;
  expected_type: string;
  received_value: string;
  hint: string;
}

export interface SchemaSummary {
  total_fields: number;
  required_fields: number;
  optional_fields: number;
  computed_fields: string[];
  required_keys: string[];
}

export interface SessionStartRequest {
  document_type: DocumentType;
}

export interface SessionStartResponse {
  session_id: string;
  document_type: DocumentType;
  opening_message: string;
  schema_summary: SchemaSummary;
  collected_slots: Record<string, unknown>;
  pending_required: string[];
  pending_optional: string[];
}

export interface ChatRequest {
  session_id: string;
  document_type: DocumentType;
  current_field: string;
  message: string;
  conversation_history: ChatMessage[];
}

export interface ChatResponse {
  session_id: string;
  current_field: string | null;
  status: ChatStatus;
  ai_message: string;
  spell_corrections?: SpellCorrection[];
  validation_error?: ValidationError | null;
  collected_slots: Record<string, unknown>;
  pending_required: string[];
  pending_optional?: string[];
  ready_to_generate: boolean;
}

export interface CorrectionConfirmRequest {
  session_id: string;
  field: string;
  original_value: string;
  suggested_value: string;
  accept: boolean;
}

export interface CorrectionConfirmResponse {
  session_id: string;
  field: string;
  saved_value: string;
  accepted_correction: boolean;
  next_field: string;
  ai_message: string;
  collected_slots: Record<string, unknown>;
  pending_required: string[];
}

export interface MissingFieldsRequest {
  session_id: string;
  document_type: DocumentType;
}

export interface MissingField {
  key: string;
  label: string;
  type: string;
  example?: string;
}

export interface MissingFieldsResponse {
  session_id: string;
  document_type: DocumentType;
  collected_count: number;
  total_required: number;
  completion_percent: number;
  missing_required: MissingField[];
  missing_optional: MissingField[];
  ready_to_generate: boolean;
}

export interface AISummaryResponse {
  session_id: string;
  summary: string;
  collected_data: Record<string, unknown>;
  missing_optional: string[];
  ready_to_generate: boolean;
}

// ─── Line Items ───────────────────────────────

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ─── Document Generation ──────────────────────

export interface GenerateDocumentRequest {
  session_id: string;
  document_type: DocumentType;
  template_id: string;
  accent_color: string;
  data: Record<string, unknown>;
}

export interface LayoutState {
  headerAlignment: Alignment;
  fontSize: FontSize;
  fontFamily?: string;
  showLogo: boolean;
  showNotes: boolean;
  bold?: boolean;
  logoUrl?: string;
  sectionOrder?: string[];
  [key: string]: unknown;
}

export interface GenerateDocumentResponse {
  document_id: string;
  preview_html: string;
  layout_state: LayoutState;
}

export interface LayoutUpdateRequest {
  section: string;
  controls: Record<string, unknown>;
}

export interface LayoutUpdateResponse {
  document_id: string;
  updated_preview_html: string;
  layout_state: LayoutState;
}

export interface ContentUpdateRequest {
  slot: string;
  value: unknown;
}

export interface ContentUpdateResponse {
  document_id: string;
  updated_slot: string;
  updated_preview_html: string;
}

// ─── Templates ────────────────────────────────

export interface Template {
  template_id: string;
  name: string;
  thumbnail_url: string;
  tier: TemplateTier;
}

export interface TemplatesResponse {
  templates: Template[];
}

// ─── PDF Export ────────────────────────────────

export interface QuotaExceededResponse {
  error: 'quota_exceeded';
  message: string;
  actions: string[];
  resets_at: string;
}

// ─── API Error ────────────────────────────────

export interface ApiError {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

// ─── Document Type Metadata ───────────────────

export interface DocumentTypeInfo {
  type: DocumentType;
  label: string;
  description: string;
  icon: string;
}

export const DOCUMENT_TYPES: DocumentTypeInfo[] = [
  {
    type: 'invoice',
    label: 'Invoice',
    description: 'Bill clients for services rendered or products sold',
    icon: 'FileText',
  },
  {
    type: 'quotation',
    label: 'Quotation',
    description: 'Provide price estimates for potential work',
    icon: 'FileSearch',
  },
  {
    type: 'proposal',
    label: 'Proposal',
    description: 'Present detailed project plans to clients',
    icon: 'Presentation',
  },
  {
    type: 'receipt',
    label: 'Receipt',
    description: 'Confirm payments received from clients',
    icon: 'Receipt',
  },
  {
    type: 'purchase_order',
    label: 'Purchase Order',
    description: 'Order goods or services from suppliers',
    icon: 'ShoppingCart',
  },
];