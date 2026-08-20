import React from 'react';
import { Sparkles, FileText, LayoutGrid, Download, Check, Flame, Zap, History } from 'lucide-react';
import { ProjectLogo } from './ProjectLogo';

interface HeaderProps {
  onOpenNotes: () => void;
  onOpenAIStudio: () => void;
  onOpenHistory: () => void;
  onOpenWelcome?: () => void;
  historyCount?: number;
  isEditLayoutMode: boolean;
  onToggleEditLayout: () => void;
  deferredPrompt: any;
  onInstallApp: () => void;
  isOverclockActive: boolean;
  overclockRemainingFormatted?: string;
  onOpenOverclock: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotes,
  onOpenAIStudio,
  onOpenHistory,
  onOpenWelcome,
  historyCount = 0,
  isEditLayoutMode,
  onToggleEditLayout,
  deferredPrompt,
  onInstallApp,
  isOverclockActive,
  overclockRemainingFormatted,
  onOpenOverclock,
}) => {
  return (
    <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-7" id="app-header">
      {/* Brand */}
      <div
        className="flex items-center gap-2.5 cursor-pointer group"
        onClick={onOpenWelcome}
        title="Ver mensagem do jogador"
      >
        <ProjectLogo
          size="sm"
          isBlinking={true}
          withGlow={true}
          className="border border-[#ff1744]/70 group-hover:scale-105 transition-transform"
        />
        <div className="font-display font-extrabold text-base tracking-wide text-[#f3f2ee]">
          OVERCLOCK{' '}
          <span className={`font-bold transition-colors ${isOverclockActive ? 'text-[#ff5252]' : 'text-[#b9ff5f]'}`}>
            CHECKLIST
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Chamativo: OVERCLOCK MODE BUTTON */}
        <button
          onClick={onOpenOverclock}
          className={`btn-sweep inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-lg ${
            isOverclockActive
              ? 'bg-gradient-to-r from-[#ff1744] via-[#ff5252] to-[#ff1744] text-white border-2 border-[#ffffff]/40 shadow-[0_0_25px_rgba(255,23,68,0.7)] animate-pulse'
              : 'bg-gradient-to-r from-[#ff1744]/25 via-[#ff3d00]/20 to-[#ff1744]/25 text-[#ff5252] hover:text-white border-2 border-[#ff1744]/60 hover:border-[#ff1744] hover:bg-gradient-to-r hover:from-[#ff1744] hover:to-[#ff5252] shadow-[0_0_15px_rgba(255,23,68,0.3)] hover:shadow-[0_0_25px_rgba(255,23,68,0.6)]'
          }`}
          title="Ativar Sprint de Alta Performance com Cronômetro e Metas"
        >
          <Flame className={`w-3.5 h-3.5 ${isOverclockActive ? 'fill-white animate-flame' : 'fill-current'}`} />
          <span>
            {isOverclockActive ? `OVERCLOCK: ${overclockRemainingFormatted}` : 'OVERCLOCK MODE'}
          </span>
        </button>

        {deferredPrompt && (
          <button
            onClick={onInstallApp}
            className="btn-sweep inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#b9ff5f] bg-[#b9ff5f]/10 border border-[#b9ff5f]/30 hover:bg-[#b9ff5f]/20 transition-all shadow-sm"
            title="Instalar como aplicativo no dispositivo"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </button>
        )}

        <button
          onClick={onOpenAIStudio}
          className="btn-sweep inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#b9ff5f] bg-gradient-to-r from-[#b9ff5f]/15 to-[#7a8dff]/15 border border-[#b9ff5f]/40 hover:border-[#b9ff5f] hover:shadow-[0_0_12px_rgba(185,255,95,0.35)] transition-all cursor-pointer"
          title="Abrir Estúdio de IA (Gerar Imagens, Avatares e Quebra de Metas)"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#b9ff5f]" />
          <span>Estúdio IA</span>
        </button>

        <button
          onClick={onOpenHistory}
          className="btn-sweep inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#f3f2ee] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#b9ff5f]/40 transition-all cursor-pointer"
          title="Ver Histórico Completo de Atividades"
        >
          <History className={`w-3.5 h-3.5 ${isOverclockActive ? 'text-[#ff5252]' : 'text-[#b9ff5f]'}`} />
          <span>Histórico</span>
          {historyCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white/[0.08] text-[#8b8e97]">
              {historyCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenNotes}
          className="btn-sweep inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#f3f2ee] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#b9ff5f]/40 transition-all cursor-pointer"
          title="Abrir bloco de notas rápido com IA"
        >
          <FileText className="w-3.5 h-3.5 text-[#b9ff5f]" />
          <span>Notas</span>
        </button>

        <button
          onClick={onToggleEditLayout}
          className={`btn-sweep inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
            isEditLayoutMode
              ? 'bg-[#b9ff5f] text-[#10130a] font-bold border-[#b9ff5f] shadow-[0_0_14px_rgba(185,255,95,0.4)]'
              : 'bg-white/[0.04] text-[#8b8e97] hover:text-[#f3f2ee] border-white/10 hover:border-white/20'
          }`}
          title={isEditLayoutMode ? 'Concluir reordenação dos blocos' : 'Reordenar blocos da tela'}
        >
          {isEditLayoutMode ? <Check className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
          <span>{isEditLayoutMode ? 'Concluir' : 'Reordenar'}</span>
        </button>
      </div>
    </header>
  );
};
