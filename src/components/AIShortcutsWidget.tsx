import React from 'react';
import { Bot, ExternalLink, Sparkles, GripVertical, Flame, Zap, Cpu } from 'lucide-react';
import { ClaudeLogo, GeminiLogo, DeepSeekLogo, ChatGPTLogo } from './AILogos';

interface AIShortcutsWidgetProps {
  isEditLayoutMode?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isOverclockActive?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

interface AIItem {
  id: string;
  name: string;
  subname: string;
  tag: string;
  url: string;
  accentColor: string;
  bgGradient: string;
  borderHover: string;
  glowColor: string;
  icon: React.ReactNode;
}

export const AIShortcutsWidget: React.FC<AIShortcutsWidgetProps> = ({
  isEditLayoutMode = false,
  onDragStart,
  onDragOver,
  onDragEnd,
  isOverclockActive = false,
  onMoveUp,
  onMoveDown,
}) => {
  const aiList: AIItem[] = [
    {
      id: 'claude',
      name: 'Claude Code',
      subname: 'Anthropic AI',
      tag: 'Arquitetura & Código',
      url: 'https://claude.ai',
      accentColor: '#f59e0b',
      bgGradient: 'from-[#d97706]/20 via-[#b45309]/10 to-transparent',
      borderHover: 'hover:border-[#f59e0b]/50',
      glowColor: 'rgba(245, 158, 11, 0.35)',
      icon: <ClaudeLogo className="w-5 h-5 drop-shadow-[0_2px_6px_rgba(245,158,11,0.4)]" />,
    },
    {
      id: 'gemini',
      name: 'Gemini',
      subname: 'Google AI',
      tag: 'Multimodal & Pesquisa',
      url: 'https://gemini.google.com',
      accentColor: '#60a5fa',
      bgGradient: 'from-[#3b82f6]/20 via-[#1d4ed8]/10 to-transparent',
      borderHover: 'hover:border-[#60a5fa]/50',
      glowColor: 'rgba(96, 165, 250, 0.35)',
      icon: <GeminiLogo className="w-5 h-5 drop-shadow-[0_2px_6px_rgba(96,165,250,0.4)]" />,
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      subname: 'R1 Reasoning',
      tag: 'Raciocínio Profundo',
      url: 'https://chat.deepseek.com',
      accentColor: '#38bdf8',
      bgGradient: 'from-[#0284c7]/20 via-[#0369a1]/10 to-transparent',
      borderHover: 'hover:border-[#38bdf8]/50',
      glowColor: 'rgba(56, 189, 248, 0.35)',
      icon: <DeepSeekLogo className="w-5 h-5 drop-shadow-[0_2px_6px_rgba(56,189,248,0.4)]" />,
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      subname: 'OpenAI GPT-4o',
      tag: 'Automação & Geral',
      url: 'https://chatgpt.com',
      accentColor: '#10b981',
      bgGradient: 'from-[#10a37f]/20 via-[#047857]/10 to-transparent',
      borderHover: 'hover:border-[#10b981]/50',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      icon: <ChatGPTLogo className="w-5 h-5 drop-shadow-[0_2px_6px_rgba(16,185,129,0.4)]" />,
    },
  ];

  return (
    <div
      draggable={isEditLayoutMode}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`relative rounded-2xl backdrop-blur-xl border p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] transition-all ${
        isOverclockActive
          ? 'bg-gradient-to-b from-[#220c10]/95 via-[#160a0d]/90 to-[#0e0f13]/95 border-[#ff1744]/40 shadow-[0_0_35px_rgba(255,23,68,0.25)]'
          : 'bg-gradient-to-b from-[#191b20]/90 to-[#121317]/90 border-white/10 hover:border-[#b9ff5f]/30'
      } ${
        isEditLayoutMode
          ? 'border-dashed !border-[#b9ff5f] cursor-grab active:cursor-grabbing hover:bg-white/[0.04]'
          : ''
      }`}
      id="ai-shortcuts-widget"
    >
      {isEditLayoutMode && (
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1 z-10">
          {onMoveUp && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              className="p-1 rounded-md bg-white/[0.08] hover:bg-[#b9ff5f] hover:text-[#10130a] text-xs font-bold transition-colors cursor-pointer"
              title="Mover para cima"
            >
              ▲
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              className="p-1 rounded-md bg-white/[0.08] hover:bg-[#b9ff5f] hover:text-[#10130a] text-xs font-bold transition-colors cursor-pointer"
              title="Mover para baixo"
            >
              ▼
            </button>
          )}
          <div className="p-1.5 rounded-lg bg-white/[0.08] text-[#b9ff5f] text-xs font-semibold flex items-center gap-1 shadow">
            <GripVertical className="w-3.5 h-3.5" />
            <span>Mover</span>
          </div>
        </div>
      )}

      {/* Header Tag */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
            isOverclockActive
              ? 'text-white bg-[#ff1744]/20 border-[#ff1744]/40'
              : 'text-[#f3f2ee] bg-white/[0.07] border-white/10'
          }`}
        >
          {isOverclockActive ? (
            <Flame className="w-3 h-3 text-[#ff5252] animate-flame" />
          ) : (
            <Cpu className="w-3 h-3 text-[#b9ff5f]" />
          )}
          <span>Produtividade Master Jogador</span>
        </div>

        <span className="text-[10px] font-bold text-[#b9ff5f] uppercase tracking-wider flex items-center gap-1">
          <Zap className="w-2.5 h-2.5 fill-current" />
          <span>Atalhos Rápidos</span>
        </span>
      </div>

      {/* Main Title Requested */}
      <div className="text-base font-bold text-[#f3f2ee] font-display mb-0.5">
        Atalhos para IAs
      </div>
      <div className="text-[11px] font-bold tracking-widest text-[#8b8e97] uppercase mb-4">
        PRODUTIVIDADE MASTER JOGADOR
      </div>

      {/* Grid of AI shortcuts */}
      <div className="grid grid-cols-2 gap-2.5">
        {aiList.map((ai) => (
          <a
            key={ai.id}
            href={ai.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative p-3 rounded-xl border border-white/[0.08] bg-[#0d0e12]/80 backdrop-blur-md flex flex-col justify-between transition-all duration-200 cursor-pointer overflow-hidden ${ai.borderHover} hover:scale-[1.02] hover:shadow-lg`}
            style={{
              boxShadow: `0 0 0px ${ai.glowColor}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 4px 20px ${ai.glowColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0px ${ai.glowColor}`;
            }}
            id={`ai-shortcut-${ai.id}`}
          >
            {/* Ambient Background Gradient on Hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${ai.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
            />

            {/* Top row: Icon + External link arrow */}
            <div className="relative flex items-center justify-between mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.05] border border-white/10 group-hover:border-white/20 transition-all shadow-inner"
              >
                {ai.icon}
              </div>
              <div className="p-1 rounded-md text-[#8b8e97] group-hover:text-white group-hover:bg-white/[0.08] transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Info */}
            <div className="relative z-10 text-left">
              <div className="text-sm font-extrabold text-[#f3f2ee] font-display flex items-center gap-1 group-hover:text-white transition-colors">
                <span>{ai.name}</span>
              </div>
              <div className="text-[10px] text-[#8b8e97] truncate group-hover:text-[#b0b3bd] transition-colors">
                {ai.subname}
              </div>
              <div
                className="mt-1.5 inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] truncate max-w-full"
                style={{ color: ai.accentColor }}
              >
                {ai.tag}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Bottom Hint */}
      <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#8b8e97]">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#b9ff5f]" />
          <span>Potencialize seu workflow diário</span>
        </span>
        <span className="font-mono text-[10px] text-[#b9ff5f] font-bold">4 IAs Prontas</span>
      </div>
    </div>
  );
};
