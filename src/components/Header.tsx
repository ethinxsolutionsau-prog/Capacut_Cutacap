import React from 'react';
import { Sparkles, Video, Globe2, FileCode, Sliders } from 'lucide-react';

interface HeaderProps {
  onOpenJsonModal: () => void;
  onToggleChat?: () => void;
  isChatOpen?: boolean;
  groundedCount?: number;
  activeNiche?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenJsonModal,
  onToggleChat,
  isChatOpen,
  groundedCount = 0,
  activeNiche,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-teal-300 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-zinc-950 font-black tracking-tight">
            <Video className="w-5 h-5 text-zinc-950 fill-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                CapCut Template Strategist
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Trend Grounded
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400">
              Real-time viral structure, pacing, transitions, and audio intelligence
            </p>
          </div>
        </div>

        {/* Right side stats & actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Google Search Grounding:</span>
            <span className="font-semibold text-emerald-400">Active</span>
          </div>

          {onToggleChat && (
            <button
              onClick={onToggleChat}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                isChatOpen
                  ? 'bg-cyan-500 text-zinc-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-cyan-300 hover:text-cyan-200 border-zinc-700'
              }`}
              title="Open Gemini-powered template strategist chatbot"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Chat</span>
            </button>
          )}

          <button
            onClick={onOpenJsonModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-medium transition cursor-pointer"
            title="View or copy strict JSON schema"
            aria-label="View raw JSON"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Schema JSON</span>
          </button>
        </div>
      </div>
    </header>
  );
};
