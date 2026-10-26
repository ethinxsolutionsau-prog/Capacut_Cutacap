export interface CapCutScene {
  scene_number: number;
  duration_seconds: number;
  start_time: number;
  end_time: number;
  shot_type: string;
  visual_action: string;
  transition_type: string;
  text_overlay: string;
  text_animation_style: string;
  audio_cue: string;
  capcut_preset_tip: string;
  media_is_editable: boolean;
  text_is_editable: boolean;
}

export interface PacingDetails {
  tempo: string; // e.g. "Fast-Paced / Beat-Drop"
  bpm_range: string; // e.g. "126 - 132 BPM"
  cut_frequency: string; // e.g. "0.4s to 0.8s on drop, 1.5s on intro"
  description: string;
  beat_intervals_seconds?: number[];
}

export interface TextAnimationStyleDetails {
  style_name: string; // e.g. "Bold Pop-Up Kinetic", "Minimal Clean Typewriter"
  font_recommendation: string; // e.g. "Montserrat Black", "The Bold Font", "Futura Condensed"
  animation_preset: string; // e.g. "Spring Bounce In", "Zoom In + Blur Out", "Glitch Flicker"
  color_and_effects: string; // e.g. "White with 40% Black Shadow & Yellow Keyword Glow"
  placement_tip: string; // e.g. "Center 1/3 viewport, away from TikTok side UI buttons"
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface CapCutTemplateStrategy {
  niche: string;
  target_length_seconds: number;
  template_name: string;
  trend_summary: string;
  trending_audio_category: string;
  recommended_audio_tracks: string[];
  pacing: PacingDetails;
  scene_count: number;
  scenes: CapCutScene[];
  transition_types: string[];
  text_animation_style: TextAnimationStyleDetails;
  viral_hook_tactics: string[];
  capcut_effect_recommendations: string[];
  search_grounding_sources?: GroundingSource[];
  generated_at?: string;
  generation_mode?: 'grounded' | 'offline';
  aspect_ratio?: string;
  schema_version?: string;
}

export interface GenerateStrategyRequest {
  niche: string;
  targetLength: number; // in seconds
  stylePreference?: string; // e.g. "Velocity", "Aesthetic", "Storytelling", "ASMR"
}
