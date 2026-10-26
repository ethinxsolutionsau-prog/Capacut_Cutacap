import React, { useState, useEffect, useRef } from 'react';
import { CapCutTemplateStrategy, CapCutScene } from '../types/template';
import { generateBeatMarkers, formatTime } from '../utils/template-calculator';
import { Play, Pause, RotateCcw, Volume2, Type, Video, Shuffle, Sparkles, Layers } from 'lucide-react';

interface CapCutTimelineProps {
  strategy: CapCutTemplateStrategy;
  selectedSceneIndex: number;
  onSelectScene: (index: number) => void;
}

export const CapCutTimeline: React.FC<CapCutTimelineProps> = ({
  strategy,
  selectedSceneIndex,
  onSelectScene,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const totalLength = strategy.target_length_seconds || 15;
  const scenes = strategy.scenes || [];
  const beatMarkers = generateBeatMarkers(strategy.pacing?.bpm_range || '128 BPM', totalLength);

  // Playhead loop animation
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= totalLength) {
          return 0; // loop
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, totalLength]);

  // Keep selected scene in sync with current playhead time
  useEffect(() => {
    const currentSceneIdx = scenes.findIndex(
      (s) => currentTime >= s.start_time && currentTime <= s.end_time
    );
    if (currentSceneIdx !== -1 && currentSceneIdx !== selectedSceneIndex) {
      onSelectScene(currentSceneIdx);
    }
  }, [currentTime, scenes, selectedSceneIndex, onSelectScene]);

  // Handle clicking timeline to scrub
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = Number((percentage * totalLength).toFixed(2));
    setCurrentTime(targetTime);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    onSelectScene(0);
  };

  // Generate ruler tick marks (every 1 second)
  const rulerTicks = Array.from({ length: Math.ceil(totalLength) + 1 }, (_, i) => i);

  // Colors for scenes
  const sceneColors = [
    'from-cyan-900/60 to-blue-900/40 border-cyan-500/40 hover:border-cyan-400',
    'from-indigo-900/60 to-violet-900/40 border-indigo-500/40 hover:border-indigo-400',
    'from-emerald-900/60 to-teal-900/40 border-emerald-500/40 hover:border-emerald-400',
    'from-amber-900/60 to-orange-900/40 border-amber-500/40 hover:border-amber-400',
    'from-rose-900/60 to-pink-900/40 border-rose-500/40 hover:border-rose-400',
    'from-purple-900/60 to-fuchsia-900/40 border-purple-500/40 hover:border-purple-400',
  ];

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Timeline Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleTogglePlay}
              className="w-9 h-9 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 flex items-center justify-center transition shadow-md shadow-cyan-500/20 cursor-pointer font-bold"
              aria-label={isPlaying ? 'Pause timeline playback' : 'Play timeline preview'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-zinc-950" /> : <Play className="w-4 h-4 fill-zinc-950 ml-0.5" />}
            </button>
            <button
              onClick={handleReset}
              className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition border border-zinc-700 cursor-pointer"
              title="Reset to 0s"
              aria-label="Reset playhead to beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Time Counter */}
          <div className="flex items-baseline gap-2 bg-zinc-950 px-3.5 py-1.5 rounded-xl border border-zinc-800 font-mono">
            <span className="text-base font-bold text-cyan-400">{formatTime(currentTime)}</span>
            <span className="text-xs text-zinc-500">/</span>
            <span className="text-xs text-zinc-400">{formatTime(totalLength)}</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400">
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
              {scenes.length} Scenes
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-300 font-medium">{strategy.pacing?.tempo || 'Fast-Paced'}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-amber-400 font-semibold">{strategy.pacing?.bpm_range}</span>
          </div>
        </div>

        {/* Playback Status Note */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Click anywhere to scrub playhead</span>
        </div>
      </div>

      {/* Multi-Track Timeline Canvas */}
      <div className="relative select-none overflow-x-auto pb-2">
        <div
          ref={timelineRef}
          onClick={handleTimelineClick}
          className="relative min-w-[700px] w-full bg-zinc-950 rounded-xl border border-zinc-800 p-2 cursor-pointer transition"
          style={{ minHeight: '260px' }}
        >
          {/* Time Ruler */}
          <div className="h-6 relative border-b border-zinc-800/80 mb-2 flex items-center">
            {rulerTicks.map((sec) => {
              const leftPercent = (sec / totalLength) * 100;
              if (leftPercent > 100) return null;
              return (
                <div
                  key={sec}
                  className="absolute top-0 flex flex-col items-center pointer-events-none"
                  style={{ left: `${leftPercent}%` }}
                >
                  <span className="text-[10px] font-mono text-zinc-500">{sec}s</span>
                  <div className="h-2 w-px bg-zinc-700 mt-0.5" />
                </div>
              );
            })}
          </div>

          {/* Red Playhead Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-20 pointer-events-none transition-all duration-75"
            style={{ left: `${(currentTime / totalLength) * 100}%` }}
          >
            {/* Playhead Handle */}
            <div className="w-3.5 h-3.5 bg-rose-500 rotate-45 -ml-[6px] -mt-1 shadow-lg shadow-rose-500/50" />
            <div className="absolute top-7 -left-7 px-1.5 py-0.5 bg-rose-600 text-[9px] font-mono font-bold text-white rounded shadow-sm">
              {currentTime.toFixed(1)}s
            </div>
          </div>

          {/* TRACK 1: Video Scenes Track */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 px-1">
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span>Video Clips & Framing</span>
            </div>
            <div className="relative h-16 w-full flex gap-1">
              {scenes.map((scene, idx) => {
                const widthPercent = (scene.duration_seconds / totalLength) * 100;
                const isSelected = selectedSceneIndex === idx;
                const colorClass = sceneColors[idx % sceneColors.length];

                return (
                  <div
                    key={scene.scene_number}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectScene(idx);
                      setCurrentTime(scene.start_time);
                    }}
                    className={`relative rounded-lg p-2 border transition flex flex-col justify-between overflow-hidden bg-gradient-to-b ${colorClass} ${
                      isSelected
                        ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-zinc-950 shadow-lg shadow-cyan-500/20'
                        : 'opacity-85 hover:opacity-100'
                    }`}
                    style={{ width: `${widthPercent}%` }}
                    title={`Scene ${scene.scene_number}: ${scene.shot_type}`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-zinc-900/90 text-cyan-400 flex items-center justify-center text-[10px]">
                          {scene.scene_number}
                        </span>
                        <span className="truncate hidden sm:inline">{scene.shot_type}</span>
                      </span>
                      <span className="text-[10px] font-mono px-1 rounded bg-black/40 text-cyan-300">
                        {scene.duration_seconds}s
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-300 truncate font-medium">
                      {scene.visual_action}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 2: Transition Markers Track */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 px-1">
              <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Transition Cuts & Motion Presets</span>
            </div>
            <div className="relative h-8 w-full bg-zinc-900/60 rounded-lg border border-zinc-800/80 flex items-center px-1 overflow-hidden">
              {scenes.map((scene, idx) => {
                if (idx === scenes.length - 1) return null;
                const leftPos = (scene.end_time / totalLength) * 100;
                return (
                  <div
                    key={`trans-${idx}`}
                    className="absolute -translate-x-1/2 flex items-center gap-1 bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-200 px-1.5 py-0.5 rounded text-[9px] font-medium transition shadow-sm z-10 cursor-pointer truncate max-w-[140px]"
                    style={{ left: `${leftPos}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectScene(idx);
                      setCurrentTime(scene.end_time);
                    }}
                    title={`Transition to Scene ${idx + 2}: ${scene.transition_type}`}
                  >
                    <Shuffle className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{scene.transition_type}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 3: Text Animation Track */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 px-1">
              <Type className="w-3.5 h-3.5 text-amber-400" />
              <span>On-Screen Kinetic Text & Hooks</span>
            </div>
            <div className="relative h-9 w-full bg-zinc-900/60 rounded-lg border border-zinc-800/80 flex items-center gap-1 p-1">
              {scenes.map((scene, idx) => {
                const widthPercent = (scene.duration_seconds / totalLength) * 100;
                return (
                  <div
                    key={`text-${idx}`}
                    className="h-full rounded bg-amber-950/30 border border-amber-500/30 px-2 flex items-center justify-between text-[10px] text-amber-200 overflow-hidden"
                    style={{ width: `${widthPercent}%` }}
                    title={`Text: "${scene.text_overlay}" (${scene.text_animation_style})`}
                  >
                    <span className="truncate font-medium">{scene.text_overlay}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono hidden md:inline shrink-0">
                      {scene.text_animation_style}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 4: Audio Beat Sync & Waveform Track */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 px-1">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Audio Beat Grid ({strategy.pacing?.bpm_range || '128 BPM'})</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">
                {strategy.trending_audio_category}
              </span>
            </div>

            <div className="relative h-11 w-full bg-zinc-900/80 rounded-lg border border-zinc-800/80 overflow-hidden flex items-center px-1">
              {/* Simulated Waveform bars background */}
              <div className="absolute inset-0 flex items-center justify-between px-1 opacity-25 pointer-events-none">
                {Array.from({ length: 60 }).map((_, i) => {
                  const h = 20 + Math.sin(i * 0.4) * 15 + ((i % 5 === 0) ? 15 : 0);
                  return (
                    <div
                      key={i}
                      className="w-1 bg-cyan-400 rounded-full"
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
              </div>

              {/* BPM Beat markers */}
              {beatMarkers.map((beatTime, bIdx) => {
                const leftPos = (beatTime / totalLength) * 100;
                if (leftPos > 100) return null;
                const isMajorBeat = bIdx % 4 === 0;
                return (
                  <div
                    key={`beat-${bIdx}`}
                    className={`absolute bottom-0 w-px pointer-events-none ${
                      isMajorBeat ? 'h-7 bg-cyan-400/80' : 'h-3.5 bg-zinc-700'
                    }`}
                    style={{ left: `${leftPos}%` }}
                  />
                );
              })}

              {/* Audio Cue tags on drop scenes */}
              {scenes.map((scene, idx) => {
                const leftPos = (scene.start_time / totalLength) * 100;
                return (
                  <div
                    key={`cue-${idx}`}
                    className="absolute z-10 flex items-center gap-1 bg-rose-950/90 border border-rose-500/50 text-rose-200 px-1.5 py-0.5 rounded text-[9px] font-mono shadow-sm pointer-events-none truncate max-w-[130px]"
                    style={{ left: `${leftPos}%` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                    <span className="truncate">{scene.audio_cue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
