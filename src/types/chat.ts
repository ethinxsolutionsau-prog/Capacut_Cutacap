export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  modelUsed?: string;
  isError?: boolean;
}

export type GeminiModelChoice = 'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon';

export interface ChatRequestPayload {
  messages: Array<{
    role: ChatRole;
    content: string;
  }>;
  model?: GeminiModelChoice;
  context?: {
    templateName?: string;
    niche?: string;
    targetLength?: number;
    sceneCount?: number;
    activeSceneIndex?: number;
    strategySummary?: string;
    scenes?: Array<{
      scene_number: number;
      duration_seconds: number;
      shot_type: string;
      visual_action: string;
      transition_type: string;
      text_overlay: string;
      media_is_editable: boolean;
      text_is_editable: boolean;
      audio_cue?: string;
    }>;
  };
}

export interface ChatResponsePayload {
  reply: string;
  modelUsed: string;
}
