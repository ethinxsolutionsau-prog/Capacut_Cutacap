/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CapCutTemplateStrategy } from './types/template';
import { PRESET_TEMPLATES } from './data/presetTemplates';
import { Header } from './components/Header';
import { StrategyInputBar } from './components/StrategyInputBar';
import { CapCutTimeline } from './components/CapCutTimeline';
import { SceneInspector } from './components/SceneInspector';
import { TrendIntelligencePanel } from './components/TrendIntelligencePanel';
import { CreatorChecklist } from './components/CreatorChecklist';
import { JsonExportModal } from './components/JsonExportModal';
import { Chatbot } from './components/Chatbot';
import { Sparkles, Sliders, Film, FileCode, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export default function App() {
  const [strategy, setStrategy] = useState<CapCutTemplateStrategy>(PRESET_TEMPLATES[0]);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'intelligence' | 'checklist' | 'json'>('timeline');

  const handleGenerate = async (niche: string, targetLength: number, stylePreference?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, targetLength, stylePreference }),
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.statusText}`);
      }

      const data: CapCutTemplateStrategy = await response.json();
      setStrategy(data);
      setSelectedSceneIndex(0);
    } catch (err: any) {
      console.error('Error generating CapCut strategy:', err);
      setError('Encountered an issue with generation. Showing a preset, not live trend research.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentScene = strategy.scenes?.[selectedSceneIndex] || strategy.scenes?.[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-zinc-950">
      {/* Top Header */}
      <Header
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        groundedCount={strategy.search_grounding_sources?.length || 0}
        activeNiche={strategy.niche}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        <p className="text-sm text-amber-200">{strategy.generation_mode === 'grounded' ? 'Search sources supplied. Check dates and audio rights before use.' : 'Creative suggestion / preset. Current popularity and audio rights are not verified.'}</p>
        {/* Input Bar */}
        <StrategyInputBar
          onGenerate={handleGenerate}
          isLoading={isLoading}
          activeNiche={strategy.niche}
          activeLength={strategy.target_length_seconds}
        />

        {/* Error Notification if any */}
        {error && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-amber-400 hover:text-amber-300 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Strategy Meta Summary Banner */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {strategy.niche}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                {strategy.target_length_seconds}s Total Duration
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-amber-300 border border-zinc-700">
                {strategy.scene_count} Scene Cuts
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {strategy.template_name}
            </h2>
          </div>

          {/* Quick View Tabs */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Timeline & Scenes</span>
            </button>

            <button
              onClick={() => setActiveTab('intelligence')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'intelligence'
                  ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trend Intelligence</span>
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'checklist'
                  ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Creator Workflow</span>
            </button>

            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer flex items-center gap-1.5"
              title="View clean schema JSON"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Raw JSON</span>
            </button>

            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                isChatOpen
                  ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-cyan-400 hover:text-cyan-300 hover:bg-zinc-850'
              }`}
              title="Toggle AI Strategist Chatbot"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Chatbot</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Timeline & Scene Inspector View */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <CapCutTimeline
              strategy={strategy}
              selectedSceneIndex={selectedSceneIndex}
              onSelectScene={(idx) => setSelectedSceneIndex(idx)}
            />

            <SceneInspector
              scene={currentScene}
              totalScenes={strategy.scenes?.length || 0}
              currentIndex={selectedSceneIndex}
              onSelectScene={(idx) => setSelectedSceneIndex(idx)}
            />

            <TrendIntelligencePanel strategy={strategy} />
          </div>
        )}

        {/* Tab 2: Full Intelligence View */}
        {activeTab === 'intelligence' && (
          <div className="space-y-6">
            <TrendIntelligencePanel strategy={strategy} />

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Film className="w-4 h-4 text-cyan-400" />
                <span>Scene Breakdown Matrix</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Timing</th>
                      <th className="py-2.5 px-3">Shot Type</th>
                      <th className="py-2.5 px-3">Visual Action</th>
                      <th className="py-2.5 px-3">Text Hook</th>
                      <th className="py-2.5 px-3">Exit Transition</th>
                      <th className="py-2.5 px-3">Audio Cue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {strategy.scenes.map((s) => (
                      <tr key={s.scene_number} className="hover:bg-zinc-800/40 transition">
                        <td className="py-2.5 px-3 font-bold text-cyan-400">{s.scene_number}</td>
                        <td className="py-2.5 px-3 font-mono text-zinc-300">
                          {s.start_time}s - {s.end_time}s ({s.duration_seconds}s)
                        </td>
                        <td className="py-2.5 px-3 text-zinc-200 font-medium">{s.shot_type}</td>
                        <td className="py-2.5 px-3 text-zinc-300 max-w-xs truncate">{s.visual_action}</td>
                        <td className="py-2.5 px-3 text-amber-300 font-medium max-w-xs truncate">"{s.text_overlay}"</td>
                        <td className="py-2.5 px-3 text-indigo-300">{s.transition_type}</td>
                        <td className="py-2.5 px-3 text-rose-300 font-mono">{s.audio_cue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Creator Checklist & Production Workflow */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <CreatorChecklist strategy={strategy} />
            <TrendIntelligencePanel strategy={strategy} />
          </div>
        )}
      </main>

      {/* JSON Schema Export Modal */}
      <JsonExportModal
        strategy={strategy}
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
      />

      {/* Context-Aware Multi-Turn Gemini Chatbot */}
      <Chatbot
        strategy={strategy}
        selectedSceneIndex={selectedSceneIndex}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />

      {/* Bottom Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 px-4 text-center text-xs text-zinc-400">
        <p>CapCut Template Strategist • Grounded with Google Search intelligence for trending cuts, pacing & viral audio.</p>
      </footer>
    </div>
  );
}
