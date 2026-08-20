import React from 'react';
import { ProjectLogo } from './ProjectLogo';
import { Zap, Flame, CheckCircle2, Trophy, ArrowRight, X, Sparkles } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userTitle?: string;
  pendingTasksCount: number;
  totalTasksCount: number;
  onStartOverclock: () => void;
  isOverclockActive?: boolean;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  userName,
  userTitle = 'Jogador Focado',
  pendingTasksCount,
  totalTasksCount,
  onStartOverclock,
  isOverclockActive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl transition-all duration-300 animate-fadeIn"
      id="welcome-modal-backdrop"
    >
      {/* Glow highlight behind modal box */}
      <div className="absolute w-96 h-96 bg-[#ff1744]/25 rounded-full blur-3xl pointer-events-none -translate-y-6" />

      {/* Main Glassmorphism Dialog Box */}
      <div
        className="relative w-full max-w-lg rounded-3xl border border-[#ff1744]/40 bg-[#0d070a]/85 backdrop-blur-xl shadow-[0_0_60px_rgba(255,23,68,0.35)] overflow-hidden transition-all text-[#f3f2ee]"
        id="welcome-dialog-box"
      >
        {/* Subtle top ambient red line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#ff1744] via-[#ff5252] to-[#ff9100]" />

        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-[#8b8e97] hover:text-[#f3f2ee] transition-colors cursor-pointer z-10"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Pulsing/Blinking Pixel Fire Character Logo */}
          <div className="relative mb-5 group cursor-pointer" onClick={onClose}>
            <div className="absolute -inset-3 bg-[#ff1744]/30 rounded-3xl blur-xl animate-pulse" />
            <ProjectLogo size="xl" isBlinking={true} withGlow={true} className="border-2 border-[#ff1744]/80" />
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-[#ff1744] text-white text-[10px] font-black tracking-wider shadow-lg flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>LVL UP</span>
            </div>
          </div>

          {/* Player Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs text-[#8b8e97] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#ff1744] animate-ping" />
            <span>Jogador: <strong className="text-[#f3f2ee]">{userName || 'Gamer'}</strong> ({userTitle})</span>
          </div>

          {/* Requested Exact Main Question Header */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f3f2ee] font-display tracking-tight leading-snug mb-3">
            Está pronto para bater todas as metas de hoje{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff385c] via-[#ff5252] to-[#ff9100]">
              jogador ?
            </span>
          </h2>

          <p className="text-sm text-[#b0b3bd] max-w-md mb-6 leading-relaxed">
            Foque 100% da sua energia, destrua as distrações e transforme cada tarefa em vitória. O seu próximo nível começa agora.
          </p>

          {/* Quick Metrics Bar */}
          <div className="w-full grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col items-center">
              <span className="text-[11px] text-[#8b8e97] font-semibold uppercase tracking-wider mb-1">
                Metas Pendentes
              </span>
              <div className="flex items-center gap-1.5 text-lg font-black text-[#ff5252]">
                <Flame className="w-4 h-4 fill-current" />
                <span>{pendingTasksCount} {pendingTasksCount === 1 ? 'meta' : 'metas'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col items-center">
              <span className="text-[11px] text-[#8b8e97] font-semibold uppercase tracking-wider mb-1">
                Total na Lista
              </span>
              <div className="flex items-center gap-1.5 text-lg font-black text-[#b9ff5f]">
                <CheckCircle2 className="w-4 h-4" />
                <span>{totalTasksCount} {totalTasksCount === 1 ? 'item' : 'itens'}</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="btn-sweep flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#b9ff5f] to-[#9deb42] hover:brightness-110 text-[#0b0c10] font-black text-sm transition-all shadow-[0_0_25px_rgba(185,255,95,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ESTOU PRONTO, VAMOS NESSA!</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            {!isOverclockActive && (
              <button
                onClick={() => {
                  onClose();
                  onStartOverclock();
                }}
                className="btn-sweep py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#ff1744] to-[#ff5252] hover:brightness-110 text-white font-extrabold text-sm transition-all shadow-[0_0_25px_rgba(255,23,68,0.45)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
                title="Abrir o Modo Overclock com cronômetro de foco"
              >
                <Flame className="w-4 h-4 fill-white animate-flame" />
                <span>OVERCLOCK MODE</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
