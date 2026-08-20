import React, { useState, useRef, useEffect } from 'react';
import {
  ClaudeLogo,
  GeminiLogo,
  DeepSeekLogo,
  ChatGPTLogo,
  MacNotesLogo,
} from './AILogos';
import { ProjectLogo } from './ProjectLogo';
import {
  Sparkles,
  Flame,
  ExternalLink,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Trash2,
  X,
  Zap,
  Bot,
  FileText,
} from 'lucide-react';
import { TaskItem } from '../types';

interface MacDockProps {
  notes: string;
  onSaveNotes: (notes: string) => void;
  onOpenFullNotes: () => void;
  onStartOverclock: () => void;
  onOpenAIStudio: () => void;
  isOverclockActive?: boolean;
  tasks: TaskItem[];
}

export const MacDock: React.FC<MacDockProps> = ({
  notes,
  onSaveNotes,
  onOpenFullNotes,
  onStartOverclock,
  onOpenAIStudio,
  isOverclockActive = false,
  tasks,
}) => {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notesContent, setNotesContent] = useState(notes);
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const saveTimeoutRef = useRef<any>(null);

  useEffect(() => {
    setNotesContent(notes);
  }, [notes]);

  const handleNotesChange = (val: string) => {
    setNotesContent(val);
    setSaveStatus('Salvando...');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      onSaveNotes(val);
      setSaveStatus('Salvo');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 500);
  };

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(notesContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearNotes = () => {
    if (window.confirm('Deseja limpar as anotações do dock?')) {
      setNotesContent('');
      onSaveNotes('');
    }
  };

  const handleAISummarize = async () => {
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/ai/summarize-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: notesContent,
          tasks,
        }),
      });
      const data = await res.json();
      if (data.summary) {
        const updated = `${notesContent}\n\n--- ⚡ Resumo IA (Dock) ---\n${data.summary}`;
        setNotesContent(updated);
        onSaveNotes(updated);
        setSaveStatus('Resumo gerado!');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (e) {
      console.error(e);
      setSaveStatus('Erro IA');
    } finally {
      setIsSummarizing(false);
    }
  };

  const dockApps = [
    {
      id: 'claude',
      name: 'Claude Code',
      category: 'Anthropic AI',
      url: 'https://claude.ai',
      icon: <ClaudeLogo className="w-8 h-8 drop-shadow-[0_2px_8px_rgba(217,119,6,0.5)]" />,
      bg: 'from-[#d97706]/20 to-[#b45309]/30 hover:border-[#d97706]/70',
      activeDot: '#f59e0b',
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      category: 'Google AI',
      url: 'https://gemini.google.com',
      icon: <GeminiLogo className="w-8 h-8 drop-shadow-[0_2px_8px_rgba(66,133,244,0.5)]" />,
      bg: 'from-[#3b82f6]/20 to-[#1d4ed8]/30 hover:border-[#60a5fa]/70',
      activeDot: '#60a5fa',
    },
    {
      id: 'deepseek',
      name: 'DeepSeek R1',
      category: 'DeepSeek AI',
      url: 'https://chat.deepseek.com',
      icon: <DeepSeekLogo className="w-8 h-8 drop-shadow-[0_2px_8px_rgba(14,165,233,0.5)]" />,
      bg: 'from-[#0284c7]/20 to-[#0369a1]/30 hover:border-[#38bdf8]/70',
      activeDot: '#38bdf8',
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT 4o',
      category: 'OpenAI',
      url: 'https://chatgpt.com',
      icon: <ChatGPTLogo className="w-8 h-8 drop-shadow-[0_2px_8px_rgba(16,185,129,0.5)]" />,
      bg: 'from-[#10a37f]/20 to-[#047857]/30 hover:border-[#10b981]/70',
      activeDot: '#10b981',
    },
  ];

  return (
    <>
      {/* Floating Mini Notes Drawer from Dock */}
      {isNotesOpen && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md bg-[#12141a]/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all animate-fadeIn"
          id="dock-floating-notes"
        >
          {/* Top Yellow Mac Notes Banner Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f97316]" />

          {/* Header */}
          <div className="p-3.5 px-4 flex items-center justify-between border-b border-white/[0.08] bg-black/30">
            <div className="flex items-center gap-2">
              <MacNotesLogo className="w-5 h-5" />
              <div>
                <div className="text-xs font-extrabold text-[#f3f2ee] font-display flex items-center gap-1.5">
                  <span>Bloco de Notas Mac</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#f59e0b]/20 text-[#f59e0b] font-bold">
                    Dock Rápido
                  </span>
                </div>
                <div className="text-[10px] text-[#8b8e97]">
                  {saveStatus ? (
                    <span className="text-[#b9ff5f] font-semibold">{saveStatus}</span>
                  ) : (
                    <span>{notesContent.length} caracteres • Sincronizado</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleAISummarize}
                disabled={isSummarizing || !notesContent.trim()}
                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-[#b9ff5f]/20 hover:text-[#b9ff5f] text-[#8b8e97] text-xs transition-colors cursor-pointer disabled:opacity-40"
                title="Resumir com IA"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSummarizing ? 'animate-spin text-[#b9ff5f]' : ''}`} />
              </button>

              <button
                onClick={handleCopyNotes}
                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-[#8b8e97] hover:text-[#f3f2ee] text-xs transition-colors cursor-pointer"
                title="Copiar texto"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#b9ff5f]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleClearNotes}
                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-red-500/20 text-[#8b8e97] hover:text-red-400 text-xs transition-colors cursor-pointer"
                title="Limpar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setIsNotesOpen(false);
                  onOpenFullNotes();
                }}
                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-[#8b8e97] hover:text-[#f3f2ee] text-xs transition-colors cursor-pointer"
                title="Expandir tela cheia"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsNotesOpen(false)}
                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-[#8b8e97] hover:text-[#f3f2ee] transition-colors cursor-pointer"
                title="Fechar Dock Notes"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div className="p-3 bg-[#0d0e12]">
            <textarea
              value={notesContent}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Digite suas anotações, comandos de prompt, ideias ou rascunhos rápidos aqui..."
              rows={6}
              className="w-full bg-transparent border-0 text-sm text-[#f3f2ee] placeholder-[#666] outline-none resize-none leading-relaxed font-sans scrollbar-thin"
              autoFocus
            />
          </div>

          {/* Footer of Floating Notes */}
          <div className="px-3.5 py-2 bg-black/40 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#8b8e97]">
            <span className="flex items-center gap-1 text-[10px]">
              <Zap className="w-3 h-3 text-[#f59e0b]" />
              <span>Salvo automaticamente no seu dispositivo</span>
            </span>
            <button
              onClick={() => {
                setIsNotesOpen(false);
                onOpenFullNotes();
              }}
              className="text-[#b9ff5f] hover:underline font-semibold cursor-pointer text-[11px]"
            >
              Abrir Completo →
            </button>
          </div>
        </div>
      )}

      {/* MacOS Floating Glass Dock Bar */}
      <div
        className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] px-3 py-2 rounded-2xl sm:rounded-3xl border border-white/20 bg-[#0d0e13]/85 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.75)] flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:border-white/30"
        id="macos-ai-dock"
        style={{
          boxShadow: isOverclockActive
            ? '0 10px 45px rgba(255, 23, 68, 0.3), inset 0 1px 1px rgba(255,255,255,0.25)'
            : '0 15px 45px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255,255,255,0.2)',
        }}
      >
        {/* Specular Top Shine Line */}
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* AI Apps Group */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {dockApps.map((app) => (
            <a
              key={app.id}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredApp(app.name)}
              onMouseLeave={() => setHoveredApp(null)}
              className={`group relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-b ${app.bg} backdrop-blur-md flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-2 hover:scale-115 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-pointer`}
              id={`dock-app-${app.id}`}
              title={`${app.name} (${app.category})`}
            >
              {/* App Icon */}
              <div className="transition-transform duration-200 group-hover:scale-105">
                {app.icon}
              </div>

              {/* Running indicator dot */}
              <div
                className="w-1 h-1 rounded-full mt-1 transition-all group-hover:w-2 group-hover:h-1"
                style={{ backgroundColor: app.activeDot }}
              />

              {/* Tooltip on Hover */}
              {hoveredApp === app.name && (
                <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-[#181920]/95 backdrop-blur-md border border-white/15 text-[11px] font-bold text-[#f3f2ee] shadow-xl whitespace-nowrap pointer-events-none animate-fadeIn flex items-center gap-1">
                  <span>{app.name}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[#8b8e97]" />
                </div>
              )}
            </a>
          ))}
        </div>

        {/* Vertical Divider */}
        <div className="h-7 w-[1px] bg-white/15 mx-0.5" />

        {/* Notes & Quick Tools Group */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mac Notes Button */}
          <button
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            onMouseEnter={() => setHoveredApp('Bloco de Notas')}
            onMouseLeave={() => setHoveredApp(null)}
            className={`group relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-2 hover:scale-115 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-pointer ${
              isNotesOpen
                ? 'bg-gradient-to-b from-[#f59e0b]/30 to-[#b45309]/40 border-[#f59e0b]'
                : 'border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] hover:border-[#f59e0b]/60'
            }`}
            id="dock-app-notes"
            title="Abrir Bloco de Notas"
          >
            <div className="transition-transform duration-200 group-hover:scale-105">
              <MacNotesLogo className="w-8 h-8 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]" />
            </div>
            <div
              className={`w-1 h-1 rounded-full mt-1 transition-all group-hover:w-2 ${
                isNotesOpen ? 'bg-[#f59e0b] w-2' : 'bg-white/40'
              }`}
            />

            {hoveredApp === 'Bloco de Notas' && (
              <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-[#181920]/95 backdrop-blur-md border border-white/15 text-[11px] font-bold text-[#f3f2ee] shadow-xl whitespace-nowrap pointer-events-none animate-fadeIn flex items-center gap-1">
                <span>Bloco de Notas Mac</span>
                <span className="text-[9px] text-[#f59e0b]">⚡</span>
              </div>
            )}
          </button>

          {/* Overclock Mode Button */}
          <button
            onClick={onStartOverclock}
            onMouseEnter={() => setHoveredApp('Modo Overclock')}
            onMouseLeave={() => setHoveredApp(null)}
            className={`group relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-2 hover:scale-115 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-pointer ${
              isOverclockActive
                ? 'bg-gradient-to-b from-[#ff1744]/30 to-[#990014]/40 border-[#ff1744]'
                : 'border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] hover:border-[#ff1744]/60'
            }`}
            id="dock-app-overclock"
            title="Ativar Modo Overclock"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <ProjectLogo size="sm" isBlinking={true} withGlow={true} className="rounded-lg w-7 h-7" />
            </div>
            <div
              className={`w-1 h-1 rounded-full mt-1 transition-all group-hover:w-2 ${
                isOverclockActive ? 'bg-[#ff1744] w-2' : 'bg-white/40'
              }`}
            />

            {hoveredApp === 'Modo Overclock' && (
              <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-[#181920]/95 backdrop-blur-md border border-white/15 text-[11px] font-bold text-[#ff5252] shadow-xl whitespace-nowrap pointer-events-none animate-fadeIn flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                <span>Modo Overclock</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
