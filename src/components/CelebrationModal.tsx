import React, { useEffect } from 'react';
import { Trophy, Sparkles, X, Flame, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  totalCompleted: number;
  onAddNewGoal?: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  userName,
  totalCompleted,
  onAddNewGoal,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Disparo inicial de confetes
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
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
        spread: 26,
        startVelocity: 55,
        colors: ['#b9ff5f', '#ffffff', '#e0ff85'],
      });
      fire(0.2, {
        spread: 60,
        colors: ['#7a8dff', '#b9ff5f', '#ff8a7a'],
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ['#b9ff5f', '#ffffff', '#ffd166'],
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
        colors: ['#b9ff5f', '#4ade80', '#22c55e'],
      });

      // Segunda onda após 500ms
      const timer = setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.65 },
          zIndex: 9999,
          colors: ['#b9ff5f', '#e0ff85', '#ffffff'],
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.65 },
          zIndex: 9999,
          colors: ['#7a8dff', '#b9ff5f', '#ffd166'],
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayName = userName?.trim() || 'Campeão';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      id="celebration-modal"
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-[#1c1f26] via-[#14161c] to-[#0d0e12] border-2 border-[#b9ff5f]/40 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_80px_rgba(185,255,95,0.25)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow de fundo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#b9ff5f]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#8b8e97] hover:text-[#f3f2ee] transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ícone de Troféu com pulso */}
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="absolute inset-0 rounded-full bg-[#b9ff5f]/30 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#b9ff5f] to-[#e0ff85] flex items-center justify-center text-[#10130a] shadow-[0_10px_30px_rgba(185,255,95,0.4)] border border-white/40 rotate-3 hover:rotate-0 transition-transform">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
          </div>
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#10130a] border-2 border-[#b9ff5f] text-[#b9ff5f]">
            <Flame className="w-4 h-4 fill-[#b9ff5f]" />
          </div>
        </div>

        {/* Tag de 100% Concluído */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-[#10130a] bg-[#b9ff5f] shadow-[0_0_15px_rgba(185,255,95,0.4)] mb-4">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Missão 100% Cumprida</span>
        </div>

        {/* Mensagem Principal Solicitada */}
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#f3f2ee] tracking-tight leading-snug mb-3">
          Parabéns, <span className="text-[#b9ff5f] underline decoration-[#b9ff5f]/40 decoration-wavy">{displayName}</span>!
        </h2>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 backdrop-blur-sm">
          <p className="text-lg sm:text-xl font-black text-[#f3f2ee] font-display mb-1 flex items-center justify-center gap-2">
            <span>Você é foda!</span>
            <Zap className="w-5 h-5 text-[#b9ff5f] fill-[#b9ff5f] animate-bounce" />
          </p>
          <p className="text-base sm:text-lg font-bold text-[#b9ff5f]">
            Vamos pra cima campeão! 🚀
          </p>
          <div className="text-xs text-[#8b8e97] mt-2 pt-2 border-t border-white/[0.06]">
            Você finalizou com sucesso todas as <strong>{totalCompleted} {totalCompleted === 1 ? 'tarefa' : 'tarefas'}</strong> da sua lista Overclock.
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="btn-sweep w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-sm bg-[#b9ff5f] hover:bg-[#a8f24a] text-[#10130a] transition-all shadow-[0_0_20px_rgba(185,255,95,0.4)] cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Continuar Focado</span>
          </button>

          {onAddNewGoal && (
            <button
              onClick={() => {
                onClose();
                onAddNewGoal();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm bg-white/[0.06] hover:bg-white/[0.1] text-[#f3f2ee] border border-white/10 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Próxima Meta</span>
              <ArrowRight className="w-4 h-4 text-[#b9ff5f]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
