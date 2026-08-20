import React from 'react';
import { TrendingUp, GripVertical } from 'lucide-react';
import { TaskItem } from '../types';

interface PerformanceWidgetProps {
  tasks: TaskItem[];
  isEditLayoutMode: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isOverclockActive?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const PerformanceWidget: React.FC<PerformanceWidgetProps> = ({
  tasks,
  isEditLayoutMode,
  onDragStart,
  onDragOver,
  onDragEnd,
  isOverclockActive = false,
  onMoveUp,
  onMoveDown,
}) => {
  const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const fullDayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  // Compute 7 days
  const now = new Date();
  const days: { date: Date; start: number; end: number; count: number; name: string; label: string }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const start = d.getTime();
    const end = start + 24 * 60 * 60 * 1000;
    const count = tasks.filter((it) => it.completedAt && it.completedAt >= start && it.completedAt < end).length;
    days.push({
      date: d,
      start,
      end,
      count,
      name: fullDayNames[d.getDay()],
      label: dayLabels[d.getDay()],
    });
  }

  const maxCount = Math.max(1, ...days.map((d) => d.count));
  const weekDoneTotal = days.reduce((acc, d) => acc + d.count, 0);
  const sevenDaysAgo = days[0].start;
  const weekCreatedTotal = tasks.filter((it) => it.createdAt && it.createdAt >= sevenDaysAgo).length;
  const denom = Math.max(weekCreatedTotal, weekDoneTotal, 1);
  const productivity = weekCreatedTotal === 0 && weekDoneTotal === 0 ? 0 : Math.min(100, Math.round((weekDoneTotal / denom) * 100));

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
      id="performance-widget"
    >
      {isEditLayoutMode && (
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1">
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

      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border mb-2">
        <TrendingUp className={`w-3 h-3 ${isOverclockActive ? 'text-[#ff5252]' : 'text-[#b9ff5f]'}`} />
        <span className={isOverclockActive ? 'text-white' : 'text-[#f3f2ee]'}>Desempenho</span>
      </div>

      <div className="text-base font-bold text-[#f3f2ee] font-display mb-0.5">Sua Semana</div>
      <div className="text-[11px] font-bold tracking-widest text-[#8b8e97] uppercase mb-3.5">
        TAREFAS E PRODUTIVIDADE
      </div>

      <div
        className={`rounded-xl backdrop-blur-md border p-4 transition-all ${
          isOverclockActive
            ? 'bg-[#150709]/80 border-[#ff1744]/20'
            : 'bg-[#0d0e12]/70 border-white/[0.06]'
        }`}
      >
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[10px] uppercase font-semibold text-[#8b8e97] mb-1">Concluídas (7d)</div>
            <div
              className={`text-lg font-bold font-display ${
                isOverclockActive ? 'text-[#ff5252]' : 'text-[#b9ff5f]'
              }`}
            >
              {weekDoneTotal}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[10px] uppercase font-semibold text-[#8b8e97] mb-1">Produtividade</div>
            <div className="text-lg font-bold text-[#f3f2ee] font-display">{productivity}%</div>
          </div>
        </div>

        {/* Week Chart */}
        <div className="flex items-end justify-between gap-1.5 pt-2">
          {days.map((d, idx) => {
            const heightPct = Math.round((d.count / maxCount) * 100);
            const isToday = idx === 6;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                {/* Tooltip */}
                <div
                  className={`absolute -top-7 scale-0 group-hover:scale-100 transition-all text-[10px] px-1.5 py-0.5 rounded border whitespace-nowrap z-20 pointer-events-none ${
                    isOverclockActive
                      ? 'bg-black/90 text-[#ff5252] border-[#ff1744]/40'
                      : 'bg-black/90 text-[#b9ff5f] border-[#b9ff5f]/30'
                  }`}
                >
                  {d.name}: {d.count} {d.count === 1 ? 'feita' : 'feitas'}
                </div>

                <div className="w-full max-w-[18px] h-14 bg-white/[0.06] rounded-md overflow-hidden flex items-end">
                  <div
                    className={`w-full rounded-md transition-all duration-500 ${
                      isOverclockActive
                        ? isToday
                          ? 'bg-[#ff1744] shadow-[0_0_8px_rgba(255,23,68,0.7)]'
                          : 'bg-[#ff5252]/70'
                        : isToday
                        ? 'bg-[#b9ff5f] shadow-[0_0_8px_rgba(185,255,95,0.6)]'
                        : 'bg-[#b9ff5f]/70'
                    }`}
                    style={{ height: `${Math.max(d.count > 0 ? 15 : 0, heightPct)}%` }}
                  ></div>
                </div>
                <span
                  className={`text-[10px] uppercase font-medium ${
                    isToday
                      ? isOverclockActive
                        ? 'text-[#ff5252] font-bold'
                        : 'text-[#b9ff5f] font-bold'
                      : 'text-[#8b8e97]'
                  }`}
                >
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
