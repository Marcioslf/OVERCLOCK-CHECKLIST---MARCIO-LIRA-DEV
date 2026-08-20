import React, { useEffect } from 'react';
import { Trophy, Flame, Zap, X, Sparkles, CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OverclockVictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  totalCompleted: number;
  remainingTimeFormatted?: string;
  onStartNewSprint?: () => void;
}

export const OverclockVictoryModal: React.FC<OverclockVictoryModalProps> = ({
  isOpen,
  onClose,
  userName,
  totalCompleted,
  remainingTimeFormatted,
  onStartNewSprint,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Chuva intensa de confetes vermelhos, dourados e neon
      const count = 250;
      const defaults = {
        origin: { y: 0.65 },
        zIndex: 9999,
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 30,
        startVelocity: 60,
        colors: ['#ff1744', '#ff5252', '#ffd700', '#ffffff'],
      });
      fire(0.2, {
        spread: 70,
        colors: ['#ff1744', '#b9ff5f', '#ff9100', '#ffd700'],
      });
      fire(0.35, {
        spread: 110,
        decay: 0.92,
        scalar: 0.9,
        colors: ['#ff1744', '#ffffff', '#ffd700'],
      });
      fire(0.1, {
        spread: 130,
        startVelocity: 30,
        decay: 0.94,
        scalar: 1.3,
        colors: ['#ff1744', '#ff5252', '#ff1744'],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.6 },
          zIndex: 9999,
          colors: ['#ff1744', '#ffd700', '#ffffff'],
        });
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.6 },
          zIndex: 9999,
          colors: ['#ff5252', '#ffd700', '#b9ff5f'],
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayName = userName?.trim() || 'Campeão';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      id="overclock-victory-modal"
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-[#2a0c10] via-[#1a080c] to-[#0c0d11] border-2 border-[#ff1744] rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_100px_rgba(255,23,68,0.5)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow vermelho de fundo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#ff1744]/35 rounded-full blur-3xl pointer-events-none" />

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#8b8e97] hover:text-[#f3f2ee] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Troféu Flamejante */}
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="absolute inset-0 rounded-full bg-[#ff1744]/40 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#ff1744] via-[#ff5252] to-[#ffd700] flex items-center justify-center text-[#10130a] shadow-[0_10px_35px_rgba(255,23,68,0.6)] border border-white/40 rotate-3 hover:rotate-0 transition-transform">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.3] text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#10130a] border-2 border-[#ff1744] text-[#ff1744]">
            <Flame className="w-4 h-4 fill-[#ff1744]" />
          </div>
        </div>

        {/* Tag de Vitória Overclock */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#ff1744] to-[#ff5252] shadow-[0_0_20px_rgba(255,23,68,0.5)] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OVERCLOCK CONCLUÍDO COM SUCESSO</span>
        </div>

        {/* Título & Mensagem Exata Solicitada */}
        <h2 className="text-2xl sm:text-3xl font-black font-display text-[#f3f2ee] tracking-tight leading-snug mb-3">
          Parabéns campeão, <span className="text-[#ff5252]">mais uma meta batida</span>!
        </h2>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#ff1744]/30 mb-6 backdrop-blur-sm">
          <p className="text-xl sm:text-2xl font-black text-[#ffffff] font-display mb-1 flex items-center justify-center gap-2">
            <span>Você é foda, {displayName}! 🔥</span>
          </p>
          <p className="text-sm sm:text-base font-bold text-[#ff8a80] mt-1">
            Todas as {totalCompleted} tarefas foram aniquiladas no tempo recorde! ⚡
          </p>

          {remainingTimeFormatted && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#ffd700] font-semibold mt-2.5 pt-2.5 border-t border-white/[0.06]">
              <Clock className="w-3.5 h-3.5" />
              <span>Tempo restante no cronômetro: <strong>{remainingTimeFormatted}</strong></span>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="btn-sweep w-full sm:w-auto px-6 py-3 rounded-2xl font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-[#ff1744] to-[#ff5252] text-white shadow-[0_0_25px_rgba(255,23,68,0.5)] hover:shadow-[0_0_35px_rgba(255,23,68,0.7)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Celebrar Vitória</span>
          </button>

          {onStartNewSprint && (
            <button
              onClick={() => {
                onClose();
                onStartNewSprint();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-sm bg-white/[0.06] hover:bg-white/[0.1] text-[#f3f2ee] border border-white/10 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Novo Sprint</span>
              <ArrowRight className="w-4 h-4 text-[#ff5252]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
