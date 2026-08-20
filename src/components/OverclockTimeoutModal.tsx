import React from 'react';
import { Flame, Clock, X, Plus, RotateCcw, ArrowRight, Zap, Target } from 'lucide-react';

interface OverclockTimeoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMinutes: (mins: number) => void;
  onFinishOverclock: () => void;
  userName: string;
  pendingTasksCount: number;
}

export const OverclockTimeoutModal: React.FC<OverclockTimeoutModalProps> = ({
  isOpen,
  onClose,
  onAddMinutes,
  onFinishOverclock,
  userName,
  pendingTasksCount,
}) => {
  if (!isOpen) return null;

  const displayName = userName?.trim() || 'Campeão';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      id="overclock-timeout-modal"
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-[#2a0c10] via-[#1a080c] to-[#0c0d11] border-2 border-[#ff1744] rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_90px_rgba(255,23,68,0.45)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow de Fundo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#ff1744]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#8b8e97] hover:text-[#f3f2ee] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ícone Pulsante de Tempo Esgotado / Alerta Overclock */}
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="absolute inset-0 rounded-full bg-[#ff1744]/40 blur-xl animate-ping" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#ff1744] to-[#ff5252] flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,23,68,0.7)] border border-white/40">
            <Flame className="w-10 h-10 fill-white stroke-[2.2] animate-flame" />
          </div>
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#10130a] border-2 border-[#ff1744] text-[#ff1744]">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Tag de Alerta de Foco */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white bg-[#ff1744] shadow-[0_0_15px_rgba(255,23,68,0.5)] mb-3">
          <Zap className="w-3.5 h-3.5 fill-white" />
          <span>O TEMPO DE SPRINT ESGOTOU</span>
        </div>

        {/* Mensagem Exata Solicitada */}
        <h2 className="text-2xl sm:text-3xl font-black font-display text-[#f3f2ee] tracking-tight leading-snug mb-3">
          Você ainda tem tempo, <span className="text-[#ff5252]">não pare</span>!
        </h2>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#ff1744]/30 mb-6 backdrop-blur-sm">
          <p className="text-lg sm:text-xl font-extrabold text-[#ffffff] font-display mb-1 flex items-center justify-center gap-2">
            <span>Faça acontecer, {displayName}! 🔥</span>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#ff8a80] font-semibold mt-2 pt-2 border-t border-white/[0.06]">
            <Target className="w-4 h-4 text-[#ff5252]" />
            <span>
              Ainda {pendingTasksCount === 1 ? 'resta' : 'restam'} <strong>{pendingTasksCount} {pendingTasksCount === 1 ? 'tarefa' : 'tarefas'}</strong> na sua checklist para zerar a missão.
            </span>
          </div>
        </div>

        {/* Ações de Extensão e Continuidade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <button
            onClick={() => {
              onAddMinutes(5);
              onClose();
            }}
            className="btn-sweep px-4 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider bg-gradient-to-r from-[#ff1744] to-[#ff5252] hover:from-[#ff2d55] hover:to-[#ff6b6b] text-white shadow-[0_0_20px_rgba(255,23,68,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+5 Minutos Extras</span>
          </button>

          <button
            onClick={() => {
              onAddMinutes(10);
              onClose();
            }}
            className="btn-sweep px-4 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider bg-white/[0.08] hover:bg-[#ff1744]/20 text-[#f3f2ee] hover:text-[#ff5252] border border-white/10 hover:border-[#ff1744]/40 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#ff5252] stroke-[3]" />
            <span>+10 Minutos Extras</span>
          </button>
        </div>

        <button
          onClick={() => {
            onFinishOverclock();
            onClose();
          }}
          className="text-xs text-[#8b8e97] hover:text-[#f3f2ee] underline transition-colors cursor-pointer py-1"
        >
          Encerrar Modo Overclock por enquanto
        </button>
      </div>
    </div>
  );
};
