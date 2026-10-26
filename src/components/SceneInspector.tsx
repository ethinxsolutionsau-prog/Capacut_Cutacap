import React from 'react';
import { CapCutScene } from '../types/template';
import { Camera, Shuffle, Type, Volume2, Wand2, Clock, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface SceneInspectorProps {
  scene: CapCutScene;
  totalScenes: number;
  onSelectScene: (idx: number) => void;
  currentIndex: number;
}

export const SceneInspector: React.FC<SceneInspectorProps> = ({
  scene,
  totalScenes,
  onSelectScene,
  currentIndex,
}) => {
  if (!scene) return null;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Top Header & Scene Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-sm">
            #{scene.scene_number}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Scene Inspector</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-cyan-300 border border-zinc-700">
                {scene.start_time.toFixed(1)}s → {scene.end_time.toFixed(1)}s ({scene.duration_seconds}s)
              </span>
            </h3>
            <p className="text-xs text-zinc-400">{scene.shot_type}</p>
          </div>
        </div>

        {/* Scene Navigation Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {Array.from({ length: totalScenes }).map((_, i) => (
            <button
              key={i}
              onClick={() => onSelectScene(i)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                currentIndex === i
                  ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/30'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
              aria-label={`Jump to scene ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Filming Action & Framing */}
        <div className="bg-zinc-950 rounded-xl p-3.5 border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <Camera className="w-4 h-4" />
            <span>Filming Action & Composition</span>
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed font-medium">
            {scene.visual_action}
          </p>
          <div className="text-[11px] text-zinc-400 pt-1 flex items-center gap-1.5 border-t border-zinc-900">
            <span className="text-zinc-500">Camera Angle:</span>
            <span className="text-zinc-300 font-mono">{scene.shot_type}</span>
          </div>
        </div>

        {/* CapCut Effect / Preset Tip */}
        <div className="bg-zinc-950 rounded-xl p-3.5 border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Wand2 className="w-4 h-4" />
            <span>CapCut In-App Preset & Curve</span>
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed font-medium">
            {scene.capcut_preset_tip}
          </p>
          <div className="text-[11px] text-zinc-400 pt-1 flex items-center gap-1.5 border-t border-zinc-900">
            <span className="text-zinc-500">Duration:</span>
            <span className="text-emerald-400 font-mono font-semibold">{scene.duration_seconds} seconds</span>
          </div>
        </div>

        {/* On-Screen Text & Kinetic Style */}
        <div className="bg-zinc-950 rounded-xl p-3.5 border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Type className="w-4 h-4" />
            <span>On-Screen Hook / Text Overlay</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20">
            <p className="text-sm font-bold text-amber-200">
              "{scene.text_overlay}"
            </p>
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center justify-between">
            <span className="text-zinc-500">Animation:</span>
            <span className="text-amber-300 font-mono">{scene.text_animation_style}</span>
          </div>
        </div>

        {/* Transition & Audio Cue */}
        <div className="bg-zinc-950 rounded-xl p-3.5 border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Shuffle className="w-4 h-4" />
            <span>Transition & Audio Drop Sync</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Exit Transition:</span>
              <span className="font-semibold text-indigo-300">{scene.transition_type}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Audio Beat Trigger:</span>
              <span className="font-semibold text-rose-400 font-mono flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" />
                {scene.audio_cue}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
