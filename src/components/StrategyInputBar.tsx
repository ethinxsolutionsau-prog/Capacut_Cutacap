import React, { useState } from 'react';
import { Search, Sparkles, Clock, Compass, Flame, Loader2 } from 'lucide-react';

interface StrategyInputBarProps {
  onGenerate: (niche: string, targetLength: number, stylePreference?: string) => Promise<void>;
  isLoading: boolean;
  activeNiche: string;
  activeLength: number;
}

const QUICK_NICHES = [
  'Streetwear & GRWM',
  'Travel Cinematic',
  'Fitness PR Reveal',
  'Luxury Real Estate',
  'Tech Desk Setup',
  'Food / Recipe ASMR',
  'Anime Velocity Edit',
  'Podcast Hook Clip',
];

const POPULAR_LENGTHS = [
  { sec: 7, label: '7s (Micro-loop)' },
  { sec: 10, label: '10s (Auto-Velocity)' },
  { sec: 12, label: '12s (Beat Drop)' },
  { sec: 15, label: '15s (Standard Reel)' },
  { sec: 30, label: '30s (Storytelling)' },
  { sec: 45, label: '45s (Tutorial/Recipe)' },
];

const STYLE_OPTIONS = [
  'Viral Beat Drop / Velocity',
  'Cinematic Ambient / Aesthetic',
  'High-Retention Story Hook',
  'Fast-Cut Montagem / Phonk',
  'Minimalist ASMR Luxury',
];

export const StrategyInputBar: React.FC<StrategyInputBarProps> = ({
  onGenerate,
  isLoading,
  activeNiche,
  activeLength,
}) => {
  const [niche, setNiche] = useState(activeNiche || 'Streetwear & GRWM');
  const [targetLength, setTargetLength] = useState<number>(activeLength || 12);
  const [stylePreference, setStylePreference] = useState('Viral Beat Drop / Velocity');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim() || isLoading) return;
    onGenerate(niche.trim(), targetLength, stylePreference);
  };

  const handleSelectQuickNiche = (presetNiche: string) => {
    setNiche(presetNiche);
    // Auto-suggest optimal length for selected preset
    if (presetNiche.includes('Fitness')) setTargetLength(10);
    else if (presetNiche.includes('Streetwear')) setTargetLength(12);
    else if (presetNiche.includes('Travel')) setTargetLength(15);
    else if (presetNiche.includes('Real Estate')) setTargetLength(25);
    else if (presetNiche.includes('Food')) setTargetLength(18);
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main inputs row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Niche input */}
          <div className="md:col-span-6 space-y-1.5">
            <label htmlFor="niche-input" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Content Niche / Concept
            </label>
            <div className="relative">
              <input
                id="niche-input"
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Streetwear GRWM, Travel Cinematic, Muscle Transformation..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                required
              />
            </div>
          </div>

          {/* Target Length */}
          <div className="md:col-span-3 space-y-1.5">
            <label htmlFor="target-length-select" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Target Length: <span className="text-cyan-400 font-mono">{targetLength}s</span>
            </label>
            <select
              id="target-length-select"
              value={targetLength}
              onChange={(e) => setTargetLength(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition cursor-pointer"
            >
              {POPULAR_LENGTHS.map((item) => (
                <option key={item.sec} value={item.sec}>
                  {item.label}
                </option>
              ))}
              <option value={20}>20s Custom</option>
              <option value={25}>25s Custom</option>
              <option value={60}>60s Deep Dive</option>
            </select>
          </div>

          {/* Style / Vibe preference */}
          <div className="md:col-span-3 space-y-1.5">
            <label htmlFor="style-preference-select" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Vibe / Edit Style
            </label>
            <select
              id="style-preference-select"
              value={stylePreference}
              onChange={(e) => setStylePreference(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition cursor-pointer"
            >
              {STYLE_OPTIONS.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick select pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-medium text-zinc-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Popular Niches:
          </span>
          {QUICK_NICHES.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => handleSelectQuickNiche(item)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                niche === item
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-semibold'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            Searches live TikTok & CapCut algorithms for viral cut counts, transition presets & audio drops.
          </div>

          <button
            type="submit"
            disabled={isLoading || !niche.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Generate CapCut Template Strategy"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 text-zinc-950 animate-spin" />
                <span>Grounding Trends & Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-zinc-950 fill-zinc-950" />
                <span>Identify Trending Structure</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
