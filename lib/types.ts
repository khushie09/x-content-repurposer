export interface RepurposeResult {
  id: string;       // 'x-post' | 'x-thread' | 'linkedin' | 'hooks' | 'caption' | 'cta'
  type: string;     // 'Tweet' | 'Thread' | 'Post' | 'Hooks' | 'Caption' | 'CTA'
  platform: string; // 'X / Twitter' | 'LinkedIn' | etc.
  content: string;
}

export interface RepurposeRequest {
  content: string;
  formats: string[];
  tone: string;
}

export interface RepurposeResponse {
  results: RepurposeResult[];
  historyId?: string;
  error?: string;
}

export interface HistoryItem {
  id: string;
  original_content: string;
  selected_formats: string[];
  tone: string;
  generated_results: RepurposeResult[];
  created_at: string;
}

export interface SavedItem {
  id: string;
  history_id: string | null;
  format_id: string;
  type: string;
  platform: string;
  content: string;
  character_count: number;
  created_at: string;
}
