import React, { useState } from 'react';
import { Flame, Sparkles, X, Clock, Zap, Target, ArrowRight } from 'lucide-react';
import { TaskItem } from '../types';
import { ProjectLogo } from './ProjectLogo';

interface OverclockSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOverclock: (durationMinutes: number) => void;
  pendingTasksCount: number;
  userName: string;
}

export const OverclockSetupModal: React.FC<OverclockSetupModalProps> = ({
  isOpen,
  onClose,
  onStartOverclock,
  pendingTasksCount,
  userName,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [customInput, setCustomInput] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  if (!isOpen) return null;

  const presets = [
    { mins: 15, title: 'Sprint Relâmpago', icon: '⚡', desc: 'Ação rápida e sem distrações' },
    { mins: 25, title: 'Pomodoro Overclock', icon: '🎯', desc: 'Hiperfoco padrão de alto rendimento' },
    { mins: 45, title: 'Sprint Intenso', icon: '🔥', desc: 'Foco contínuo para zerar tarefas difíceis' },
    { mins: 60, title: 'Deep Work Máximo', icon: '🧠', desc: 'Imersão total sem interrupções' },
  ];

  const handleSelectPreset = (mins: number) => {
    setSelectedMinutes(mins);
    setIsCustom(false);
  };

  const handleStart = () => {
    let finalMins = selectedMinutes;
    if (isCustom) {
      const parsed = parseInt(customInput, 10);
      if (parsed && parsed > 0 && parsed <= 360) {
        finalMins = parsed;
      } else {
        finalMins = 25;
      }
    }
    onStartOverclock(finalMins);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      id="overclock-setup-modal"
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-[#220c10] via-[#160a0d] to-[#0c0d11] border-2 border-[#ff1744]/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_80px_rgba(255,23,68,0.3)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow de fundo vermelho */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#ff1744]/25 rounded-full blur-3xl pointer-events-none" />

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#8b8e97] hover:text-[#f3f2ee] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-4">
          <ProjectLogo size="md" isBlinking={true} withGlow={true} className="border border-[#ff1744]/70" />
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#ff5252] bg-[#ff1744]/15 px-2 py-0.5 rounded-md border border-[#ff1744]/30 mb-0.5">
              <Zap className="w-3 h-3 fill-[#ff5252]" />
              <span>SISTEMA DE HIPERFOCO</span>
            </div>
            <h2 className="text-xl font-extrabold font-display text-[#f3f2ee] tracking-tight">
              MODO OVERCLOCK
            </h2>
          </div>
        </div>

        {/* Descrição & Alvo */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-[#ff1744]/20 mb-5">
          <p className="text-xs sm:text-sm text-[#f3f2ee] leading-relaxed">
            Olá, <strong className="text-[#ff5252]">{userName}</strong>! No <strong>Modo Overclock</strong>, você define um tempo de sprint cronometrado para zerar suas tarefas com energia máxima.
          </p>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.06] text-xs text-[#8b8e97]">
            <Target className="w-3.5 h-3.5 text-[#ff5252]" />
            <span>
              Meta atual: Zerar <strong>{pendingTasksCount} {pendingTasksCount === 1 ? 'tarefa pendente' : 'tarefas pendentes'}</strong> antes do tempo esgotar.
            </span>
          </div>
        </div>

        {/* Seleção de Tempo */}
        <div className="mb-5">
          <label className="flex items-center justify-between text-xs font-bold text-[#8b8e97] uppercase tracking-wider mb-2.5">
            <span className="flex items-center gap-1.5 text-[#f3f2ee]">
              <Clock className="w-3.5 h-3.5 text-[#ff5252]" />
              Escolha o Tempo do Sprint
            </span>
            <span className="text-[#ff5252] font-mono text-xs">
              {isCustom ? `${customInput || 0} min` : `${selectedMinutes} minutos`}
            </span>
          </label>

          {/* Grid de Presets */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {presets.map((p) => {
              const isSelected = !isCustom && selectedMinutes === p.mins;
              return (
                <button
                  key={p.mins}
                  type="button"
                  onClick={() => handleSelectPreset(p.mins)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#ff1744]/25 to-[#ff5252]/10 border-[#ff1744] shadow-[0_0_15px_rgba(255,23,68,0.35)]'
                      : 'bg-white/[0.02] border-white/[0.07] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{p.icon}</span>
                    <span
                      className={`text-xs font-mono font-extrabold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#ff1744] text-white'
                          : 'bg-white/[0.06] text-[#8b8e97]'
                      }`}
                    >
                      {p.mins}m
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#f3f2ee]">{p.title}</div>
                    <div className="text-[10px] text-[#8b8e97] line-clamp-1">{p.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tempo Personalizado */}
          <div className="flex items-center gap-2">
            <div
              onClick={() => setIsCustom(true)}
              className={`flex-1 flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-colors cursor-pointer ${
                isCustom
                  ? 'border-[#ff1744] bg-[#ff1744]/10'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
              }`}
            >
              <span className="text-xs text-[#8b8e97]">Tempo customizado:</span>
              <input
                type="number"
                min="1"
                max="360"
                value={customInput}
                placeholder="Ex: 35"
                onFocus={() => setIsCustom(true)}
                onChange={(e) => {
                  setIsCustom(true);
                  setCustomInput(e.target.value);
                }}
                className="w-16 bg-transparent text-sm font-bold text-[#f3f2ee] outline-none text-center border-b border-[#ff1744]/40"
              />
              <span className="text-xs text-[#8b8e97]">min</span>
            </div>
          </div>
        </div>

        {/* Botão de Início */}
        <button
          onClick={handleStart}
          className="btn-sweep w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-[#ff1744] via-[#ff3d00] to-[#ff1744] text-white shadow-[0_0_30px_rgba(255,23,68,0.5)] hover:shadow-[0_0_40px_rgba(255,23,68,0.7)] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Flame className="w-5 h-5 fill-white animate-flame" />
          <span>LIGAR MODO OVERCLOCK</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
