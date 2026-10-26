import React, { useState, useEffect, useRef } from 'react';
import { CapCutTemplateStrategy } from '../types/template';
import { ChatMessage, GeminiModelChoice, ChatRole } from '../types/chat';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  Cpu,
  Layers,
  ArrowDownCircle,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface ChatbotProps {
  strategy: CapCutTemplateStrategy;
  selectedSceneIndex?: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  strategy,
  selectedSceneIndex = 0,
  isOpen,
  onToggle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome-1',
        role: 'model',
        content: `👋 **Hey creator!** I'm your **CapCut Template Strategist & Video Director**.

I'm loaded with context for your current project:
- **Template**: *${strategy.template_name}*
- **Niche**: \`${strategy.niche}\` (${strategy.target_length_seconds}s across ${strategy.scene_count} scenes)
- **Active Scene**: Scene ${selectedSceneIndex + 1} (${strategy.scenes[selectedSceneIndex]?.shot_type || 'Selected Cut'})

Ask me anything about refining hooks, optimizing replaceable creator slots, setting CapCut speed ramps, or timing cuts to viral music!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.8-flash',
      },
    ];
  });

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<GeminiModelChoice>('gemini-3.8-flash');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus textarea when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Update initial message or notify context switch when template changes
  const prevTemplateRef = useRef<string>(strategy.template_name);
  useEffect(() => {
    if (prevTemplateRef.current !== strategy.template_name) {
      prevTemplateRef.current = strategy.template_name;
      const contextNotice: ChatMessage = {
        id: `context-${Date.now()}`,
        role: 'model',
        content: `🔄 **Workspace Context Updated:** Switched to **"${strategy.template_name}"** (${strategy.target_length_seconds}s, ${strategy.scene_count} scenes in *${strategy.niche}*).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      };
      setMessages((prev) => [...prev, contextNotice]);
    }
  }, [strategy.template_name, strategy.target_length_seconds, strategy.scene_count, strategy.niche, selectedModel]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: `History cleared. I'm ready with context for **"${strategy.template_name}"**. How can I help with your template?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  const sendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend !== undefined ? textToSend : input).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Prepare context payload
    const context = {
      templateName: strategy.template_name,
      niche: strategy.niche,
      targetLength: strategy.target_length_seconds,
      sceneCount: strategy.scene_count,
      strategySummary: strategy.trend_summary,
      activeSceneIndex: selectedSceneIndex,
      scenes: strategy.scenes.map((s) => ({
        scene_number: s.scene_number,
        duration_seconds: s.duration_seconds,
        shot_type: s.shot_type,
        visual_action: s.visual_action,
        transition_type: s.transition_type,
        text_overlay: s.text_overlay,
        media_is_editable: s.media_is_editable,
        text_is_editable: s.text_is_editable,
        audio_cue: s.audio_cue,
      })),
    };

    // Filter messages for Gemini API
    const apiMessages = newMessages
      .filter((m) => !m.isError)
      .map((m) => ({
        role: m.role as ChatRole,
        content: m.content,
      }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          context,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.reply || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.error('Chat generation error:', err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        content: `⚠️ **Request Notice:** ${err.message || 'Unable to reach Gemini API'}.\n\n*Tip: Check that a valid GEMINI_API_KEY is configured in your Secrets panel.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        modelUsed: selectedModel,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    `Audit the hook in Scene 1 for ${strategy.niche}`,
    `Check if my editable creator slots are balanced`,
    `Suggest CapCut speed curves and transition sync for Scene ${selectedSceneIndex + 1}`,
    `Write 3 viral caption variations for Scene ${selectedSceneIndex + 1}`,
    `How do I match this rhythm to trending TikTok audios?`,
  ];

  // Helper to format basic markdown text cleanly
  const renderFormattedContent = (content: string) => {
    // Break into paragraphs and lines
    return (
      <div className="space-y-2 text-xs leading-relaxed text-zinc-200 break-words">
        {content.split('\n\n').map((paragraph, pIdx) => {
          // Check for bullet lists
          const lines = paragraph.split('\n');
          const isList = lines.every((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));

          if (isList) {
            return (
              <ul key={pIdx} className="list-disc pl-4 space-y-1 text-zinc-300">
                {lines.map((item, iIdx) => (
                  <li key={iIdx}>
                    {renderInlineFormatting(item.replace(/^[-*]\s+/, ''))}
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <p key={pIdx}>
              {lines.map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  {renderInlineFormatting(line)}
                  {lIdx < lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        })}
      </div>
    );
  };

  // Helper for bold and code backticks
  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-300 font-mono text-[11px] border border-zinc-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="text-amber-200 italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating launcher trigger button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-zinc-950 font-bold text-xs shadow-xl shadow-cyan-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer group"
          aria-label="Open AI Strategist Chat"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-zinc-950 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-zinc-950" />
          </div>
          <span>AI Strategist Chat</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-950/20 font-mono text-zinc-900 font-extrabold">
            Gemini
          </span>
        </button>
      )}

      {/* Main Chat Drawer / Dock */}
      {isOpen && (
        <div
          className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-black/80 transition-all duration-200 ${
            isExpanded
              ? 'w-full h-full sm:w-[620px] sm:h-[85vh]'
              : 'w-full h-[85vh] sm:w-[440px] sm:h-[620px]'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 rounded-t-2xl">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-zinc-950 shadow-md shadow-cyan-500/20 shrink-0">
                <Bot className="w-4 h-4 text-zinc-950" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white tracking-tight">CapCut Strategist</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-zinc-400 truncate">
                  Context: <span className="text-cyan-400 font-medium">{strategy.template_name}</span>
                </p>
              </div>
            </div>

            {/* Actions: Model Switcher & Window Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                title={isExpanded ? 'Restore size' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleClearHistory}
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onToggle}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model selector bar & context indicator */}
          <div className="px-3.5 py-2 bg-zinc-900/40 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as GeminiModelChoice)}
                className="bg-zinc-900 text-zinc-200 border border-zinc-700 rounded px-2 py-0.5 text-[11px] focus:outline-none focus:border-cyan-500 cursor-pointer font-mono"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (General)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
                <option value="gemini-4-argon">gemini-4-argon (Complex)</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-zinc-400">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>{strategy.scenes.length} Scenes • {strategy.target_length_seconds}s</span>
            </div>
          </div>

          {/* Scrollable Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-zinc-800 text-cyan-400 border border-zinc-700'
                        : 'bg-gradient-to-tr from-cyan-600 to-teal-500 text-zinc-950 shadow'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-zinc-950" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs group relative shadow-sm ${
                      isUser
                        ? 'bg-cyan-500/15 border border-cyan-500/30 text-white rounded-tr-none'
                        : message.isError
                        ? 'bg-rose-950/40 border border-rose-500/30 text-rose-200 rounded-tl-none'
                        : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200 rounded-tl-none'
                    }`}
                  >
                    {/* Header line for message */}
                    <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-zinc-400">
                      <span className="font-semibold text-zinc-400">
                        {isUser ? 'You' : `AI Strategist (${message.modelUsed || selectedModel})`}
                      </span>
                      <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition">
                        <span>{message.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => handleCopy(message.id, message.content)}
                            className="text-zinc-400 hover:text-white p-0.5"
                            title="Copy response"
                          >
                            {copiedId === message.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Formatted Content */}
                    {renderFormattedContent(message.content)}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-zinc-950" />
                </div>
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl rounded-tl-none p-3 max-w-[80%] flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    Strategizing with {selectedModel}...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context Prompt Suggestions */}
          <div className="px-3 py-2 border-t border-zinc-900 bg-zinc-950/80 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            <span className="text-[10px] text-zinc-400 shrink-0 font-medium">Suggestions:</span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-cyan-300 text-[10px] transition cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-900/60 rounded-b-2xl">
            <div className="relative flex items-end gap-2 bg-zinc-950 border border-zinc-800 focus-within:border-cyan-500 rounded-xl p-2 transition">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about hooks, scene pacing, or CapCut cuts...`}
                rows={1}
                disabled={isLoading}
                className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none max-h-28 py-1 px-1 font-sans"
              />

              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold transition disabled:opacity-40 disabled:hover:bg-cyan-500 cursor-pointer shrink-0 shadow"
                title="Send message (Enter)"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-400 mt-1.5 flex items-center justify-between px-1">
              <span>Press <kbd className="font-mono text-zinc-400">Enter</kbd> to send, <kbd className="font-mono text-zinc-400">Shift+Enter</kbd> for line break</span>
              <span className="text-cyan-500/80">Context-Aware AI</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
