import React, { useState } from 'react';
import { CapCutTemplateStrategy } from '../types/template';
import { CheckSquare, Square, Film, Sparkles, CheckCircle2 } from 'lucide-react';

interface CreatorChecklistProps {
  strategy: CapCutTemplateStrategy;
}

export const CreatorChecklist: React.FC<CreatorChecklistProps> = ({ strategy }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const steps = [
    {
      id: 'step-1',
      title: '1. Filming Setup (4K 60 FPS)',
      details: `Film all ${strategy.scene_count} scenes in vertical 9:16 format at 60 FPS to allow 50% optical slow-motion ramps without frame stutter. Lock exposure on hook scene.`,
    },
    {
      id: 'step-2',
      title: '2. Import Audio & Auto Beat Marking',
      details: `Import "${strategy.recommended_audio_tracks?.[0] || strategy.trending_audio_category}". Tap audio track → Select "Beats" → "Auto-generate: Beat 1" to place yellow dots at ~${strategy.pacing?.bpm_range || '128 BPM'}.`,
    },
    {
      id: 'step-3',
      title: '3. Trim Clips to Scene Timestamps',
      details: `Snap clip cuts directly to the beat grid according to each scene duration (${strategy.scenes.map((s) => `${s.duration_seconds}s`).join(', ')}).`,
    },
    {
      id: 'step-4',
      title: '4. Apply Velocity Curve & Transitions',
      details: `Add primary transitions (${strategy.transition_types.slice(0, 3).join(', ')}). Apply CapCut Speed → Curve → Custom to ramp fast-into-slow on drop moments.`,
    },
    {
      id: 'step-5',
      title: '5. Kinetic Text Overlay & Safe Zones',
      details: `Apply font "${strategy.text_animation_style?.font_recommendation || 'The Bold Font'}" with preset "${strategy.text_animation_style?.animation_preset || 'Spring Bounce'}". Keep text in the middle 35% safe zone.`,
    },
    {
      id: 'step-6',
      title: '6. High-Retention Loop Match & Export',
      details: `Ensure scene ${strategy.scene_count} visually connects with scene 1. Export in 1080p, 60fps, higher code rate (Bitrate Recommended) for crisp TikTok/Reels compression.`,
    },
  ];

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">
            CapCut Creator Production Workflow
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">
            {completedCount}/{steps.length} Steps
          </span>
          <div className="w-20 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {steps.map((step) => {
          const isDone = !!checkedItems[step.id];
          return (
            <div
              key={step.id}
              onClick={() => toggleItem(step.id)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                isDone
                  ? 'bg-cyan-950/20 border-cyan-500/40 text-zinc-300'
                  : 'bg-zinc-950 hover:bg-zinc-900/70 border-zinc-800/80 text-zinc-400'
              }`}
            >
              <div className="mt-0.5 text-cyan-400 shrink-0">
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-600" />
                )}
              </div>
              <div className="space-y-1">
                <h4
                  className={`text-xs font-bold ${
                    isDone ? 'line-through text-zinc-500' : 'text-zinc-200'
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  {step.details}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
