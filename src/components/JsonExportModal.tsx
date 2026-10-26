import React, { useState } from 'react';
import { CapCutTemplateStrategy } from '../types/template';
import { validateTemplateSchema } from '../utils/template-calculator';
import { X, Copy, Check, Download, CheckCircle2, AlertCircle, FileCode } from 'lucide-react';

interface JsonExportModalProps {
  strategy: CapCutTemplateStrategy;
  isOpen: boolean;
  onClose: () => void;
}

export const JsonExportModal: React.FC<JsonExportModalProps> = ({
  strategy,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Create clean schema object (pure JSON matching schema, no internal extra fields)
  const cleanSchemaObject = {
    schema_version: '1.0',
    aspect_ratio: '9:16',
    generation_mode: strategy.generation_mode || 'offline',
    search_grounding_sources: strategy.search_grounding_sources || [],
    niche: strategy.niche,
    target_length_seconds: strategy.target_length_seconds,
    template_name: strategy.template_name,
    trend_summary: strategy.trend_summary,
    trending_audio_category: strategy.trending_audio_category,
    recommended_audio_tracks: strategy.recommended_audio_tracks,
    pacing: {
      tempo: strategy.pacing.tempo,
      bpm_range: strategy.pacing.bpm_range,
      cut_frequency: strategy.pacing.cut_frequency,
      description: strategy.pacing.description,
    },
    scene_count: strategy.scene_count,
    scenes: strategy.scenes.map((s) => ({
      scene_number: s.scene_number,
      duration_seconds: s.duration_seconds,
      start_time: s.start_time,
      end_time: s.end_time,
      shot_type: s.shot_type,
      visual_action: s.visual_action,
      transition_type: s.transition_type,
      text_overlay: s.text_overlay,
      text_animation_style: s.text_animation_style,
      audio_cue: s.audio_cue,
      capcut_preset_tip: s.capcut_preset_tip,
      media_is_editable: s.media_is_editable,
      text_is_editable: s.text_is_editable,
    })),
    transition_types: strategy.transition_types,
    text_animation_style: strategy.text_animation_style,
    viral_hook_tactics: strategy.viral_hook_tactics,
    capcut_effect_recommendations: strategy.capcut_effect_recommendations,
  };

  const jsonString = JSON.stringify(cleanSchemaObject, null, 2);
  const validation = validateTemplateSchema(cleanSchemaObject);

  const handleCopy = async () => {
    if (!validation.isValid) return;
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  const downloadMediaMap = () => {
    const map = Object.fromEntries(strategy.scenes.map(s => [String(s.scene_number), `media/scene-${s.scene_number}.mp4`]));
    const url = URL.createObjectURL(new Blob([JSON.stringify(map, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'assets.json'; a.click(); URL.revokeObjectURL(url);
  };
  const handleDownload = () => {
    if (!validation.isValid) return;
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capcut-strategy-${strategy.niche.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${strategy.target_length_seconds}s.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Schema-Compliant JSON Output</span>
                {validation.isValid ? (
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid Schema
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Issues Detected
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400">
                Pure JSON object matching CapCut template schema with zero commentary.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!validation.isValid && <p role="alert" className="p-4 text-amber-200">{validation.errors.join('; ')}</p>}
        {/* JSON Code Box */}
        <div className="flex-1 p-4 overflow-y-auto bg-zinc-950/70 font-mono text-xs text-zinc-200">
          <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 overflow-x-auto leading-relaxed text-cyan-100 selection:bg-cyan-500 selection:text-zinc-950">
            {jsonString}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-400">
            {cleanSchemaObject.scene_count} scenes • {cleanSchemaObject.target_length_seconds}s duration • {cleanSchemaObject.transition_types.length} transition types
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <button disabled={!validation.isValid} onClick={downloadMediaMap} className="px-3 py-2 rounded-xl bg-zinc-800 text-white text-xs">Download media map</button>
            <button
              disabled={!validation.isValid}
              onClick={handleDownload}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .JSON</span>
            </button>

            <button
              disabled={!validation.isValid}
              onClick={handleCopy}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Copy Raw JSON</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
