import React from 'react';
import { Flame, Pause, Play, Plus, X, Zap, Target, CheckCircle2 } from 'lucide-react';
import { OverclockSession } from '../types';

interface OverclockTimerBarProps {
  session: OverclockSession;
  onPauseToggle: () => void;
  onAddMinutes: (mins: number) => void;
  onCancelSession: () => void;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  userName: string;
}

export const OverclockTimerBar: React.FC<OverclockTimerBarProps> = ({
  session,
  onPauseToggle,
  onAddMinutes,
  onCancelSession,
  totalTasks,
  completedTasks,
  pendingTasks,
  userName,
}) => {
  if (!session.isActive) return null;

  const mins = Math.floor(session.remainingSeconds / 60);
  const secs = session.remainingSeconds % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const progressPct = session.totalInitialSeconds > 0
    ? Math.max(0, Math.min(100, Math.round(((session.totalInitialSeconds - session.remainingSeconds) / session.totalInitialSeconds) * 100)))
    : 0;

  const isLowTime = session.remainingSeconds <= 120 && session.remainingSeconds > 0;

  return (
    <div
      className="relative z-20 mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#2a0c12] via-[#1a080c] to-[#120508] border-2 border-[#ff1744] shadow-[0_0_50px_rgba(255,23,68,0.35)] animate-in fade-in slide-in-from-top-3 overflow-hidden"
      id="overclock-timer-hud"
    >
      {/* Background Animated Flare */}
      <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#ff1744]/20 to-transparent pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-60 h-20 bg-[#ff5252]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Overclock Pulse Status */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff1744] to-[#ff5252] text-white shadow-[0_0_25px_rgba(255,23,68,0.6)] shrink-0">
            <Flame className="w-6 h-6 fill-white animate-flame" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5252] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff1744]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#ff5252] font-display">
                MODO OVERCLOCK ATIVO
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-[#ff1744] text-white">
                {session.isPaused ? 'PAUSADO' : 'CORRENDO'}
              </span>
            </div>
            <div className="text-sm font-bold text-[#f3f2ee] font-display">
              Foco Total: <span className="text-[#ff5252]">{userName}</span>
            </div>
          </div>
        </div>

        {/* Center: Big Digital Countdown Clock */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="text-center">
            <div
              className={`font-mono text-3xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-[0_0_20px_rgba(255,23,68,0.7)] ${
                isLowTime ? 'text-[#ff1744] animate-pulse' : 'text-[#ffffff]'
              }`}
            >
              {formattedTime}
            </div>
            <div className="text-[10px] text-[#ff8a80] font-semibold uppercase tracking-wider">
              Tempo Restante
            </div>
          </div>

          {/* Pending Tasks Progress */}
          <div className="hidden sm:flex flex-col items-center pl-4 border-l border-white/10 text-center">
            <div className="flex items-center gap-1 text-lg font-black text-[#f3f2ee] font-display">
              <Target className="w-4 h-4 text-[#ff5252]" />
              <span>{pendingTasks}</span>
            </div>
            <div className="text-[10px] text-[#8b8e97] font-semibold uppercase tracking-wider">
              {pendingTasks === 1 ? 'Pendente' : 'Pendentes'}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onPauseToggle}
            className={`btn-sweep inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              session.isPaused
                ? 'bg-[#ff1744] text-white shadow-[0_0_15px_rgba(255,23,68,0.5)]'
                : 'bg-white/[0.08] hover:bg-white/[0.14] text-[#f3f2ee] border border-white/10'
            }`}
            title={session.isPaused ? 'Retomar timer' : 'Pausar timer'}
          >
            {session.isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            <span>{session.isPaused ? 'Retomar' : 'Pausar'}</span>
          </button>

          <button
            onClick={() => onAddMinutes(5)}
            className="btn-sweep inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-[#ff1744]/20 text-[#f3f2ee] hover:text-[#ff5252] border border-white/10 hover:border-[#ff1744]/40 transition-all cursor-pointer"
            title="Adicionar 5 minutos extras ao tempo de sprint"
          >
            <Plus className="w-3 h-3 text-[#ff5252]" />
            <span>+5m</span>
          </button>

          <button
            onClick={onCancelSession}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-[#ff1744]/20 text-[#8b8e97] hover:text-[#ff5252] border border-white/10 transition-colors cursor-pointer"
            title="Sair do Modo Overclock"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar of Time Expended */}
      <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden mt-3.5">
        <div
          className="h-full bg-gradient-to-r from-[#ff1744] via-[#ff5252] to-[#ff9100] transition-all duration-1000 shadow-[0_0_12px_rgba(255,23,68,0.8)]"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
};
