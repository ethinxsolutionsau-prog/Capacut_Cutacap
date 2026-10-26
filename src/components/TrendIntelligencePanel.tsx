import React from 'react';
import { CapCutTemplateStrategy } from '../types/template';
import { Flame, Music2, Gauge, Type, ShieldCheck, Sparkles, ExternalLink, SlidersHorizontal, Wand2 } from 'lucide-react';

interface TrendIntelligencePanelProps {
  strategy: CapCutTemplateStrategy;
}

export const TrendIntelligencePanel: React.FC<TrendIntelligencePanelProps> = ({ strategy }) => {
  if (!strategy) return null;

  const {
    trend_summary,
    trending_audio_category,
    recommended_audio_tracks = [],
    pacing,
    text_animation_style,
    viral_hook_tactics = [],
    capcut_effect_recommendations = [],
    search_grounding_sources = [],
  } = strategy;

  return (
    <div className="space-y-4">
      {/* Trend Overview Card */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Flame className="w-4 h-4 fill-cyan-400" />
            <span>Algorithm & Trend Intelligence</span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-medium">
            CapCut Viral Blueprint
          </span>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          {trend_summary}
        </p>

        {/* Viral Hook Tactics */}
        {viral_hook_tactics.length > 0 && (
          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Retention Engineering (First 3 Seconds)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {viral_hook_tactics.map((tactic, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 text-xs text-zinc-300 flex items-start gap-2"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{tactic}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Audio, Pacing, Text & Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Audio & Music Intelligence */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Music2 className="w-4 h-4" />
            <span>Trending Audio Category</span>
          </div>
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 space-y-2">
            <div className="text-sm font-bold text-white">
              {trending_audio_category}
            </div>
            {recommended_audio_tracks.length > 0 && (
              <div className="space-y-1 pt-1 border-t border-zinc-900">
                <span className="text-[10px] text-zinc-500 font-semibold uppercase">Recommended Sounds:</span>
                {recommended_audio_tracks.map((track, i) => (
                  <div key={i} className="text-xs text-zinc-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span className="truncate">{track}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pacing & Rhythm Meter */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Gauge className="w-4 h-4" />
            <span>Pacing & Tempo Sync</span>
          </div>
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Tempo:</span>
              <span className="text-xs font-bold text-white">{pacing?.tempo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">BPM Target:</span>
              <span className="text-xs font-mono font-bold text-amber-400">{pacing?.bpm_range}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Cut Frequency:</span>
              <span className="text-xs text-cyan-300 font-mono">{pacing?.cut_frequency}</span>
            </div>
            <p className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-900">
              {pacing?.description}
            </p>
          </div>
        </div>

        {/* Text Animation & Typography Style */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Type className="w-4 h-4" />
            <span>Text Animation Style</span>
          </div>
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 space-y-2">
            <div className="text-xs font-bold text-white">
              {text_animation_style?.style_name}
            </div>
            <div className="text-[11px] text-zinc-400 space-y-1">
              <div><strong className="text-zinc-300">Font:</strong> {text_animation_style?.font_recommendation}</div>
              <div><strong className="text-zinc-300">Preset:</strong> {text_animation_style?.animation_preset}</div>
              <div><strong className="text-zinc-300">Colors:</strong> {text_animation_style?.color_and_effects}</div>
            </div>
            <p className="text-[10px] text-indigo-300 pt-1 border-t border-zinc-900">
              📍 {text_animation_style?.placement_tip}
            </p>
          </div>
        </div>
      </div>

      {/* CapCut Effects Stack & Search Grounding Citations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended CapCut Effects */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-xl space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Wand2 className="w-4 h-4" />
            <span>Recommended CapCut Effects Stack</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {capcut_effect_recommendations.map((effect, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 font-medium"
              >
                ✨ {effect}
              </span>
            ))}
          </div>
        </div>

        {/* Google Search Grounding Sources */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-xl space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Search Grounding Intelligence</span>
          </div>
          {search_grounding_sources && search_grounding_sources.length > 0 ? (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {search_grounding_sources.map((source, i) => (
                <a
                  key={i}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 text-xs text-zinc-300 transition group"
                >
                  <span className="truncate pr-2 group-hover:text-cyan-400 font-medium">
                    {source.title || source.uri}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 shrink-0" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 italic">
              Strategy generated via real-time algorithm trend grounding synthesizing CapCut velocity benchmarks and viral retention structures.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
