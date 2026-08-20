import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Plus, Trash2, Check, Edit2, GripVertical, CheckCircle2, Trophy, Zap, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskItem } from '../types';

interface ChecklistCardProps {
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  tasks: TaskItem[];
  onAddTask: (text: string, isPriority?: boolean) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newText: string) => void;
  onClearCompleted: () => void;
  onReorderTasks: (newTasks: TaskItem[]) => void;
  onOpenQuickBreakdown: () => void;
  userName?: string;
  onTriggerCelebration?: () => void;
  isEditLayoutMode?: boolean;
  onBoxDragStart?: (e: React.DragEvent) => void;
  onBoxDragOver?: (e: React.DragEvent) => void;
  onBoxDragEnd?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isOverclockActive?: boolean;
}

export const ChecklistCard: React.FC<ChecklistCardProps> = ({
  title,
  onUpdateTitle,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onClearCompleted,
  onReorderTasks,
  onOpenQuickBreakdown,
  userName = 'Campeão',
  onTriggerCelebration,
  isEditLayoutMode = false,
  onBoxDragStart,
  onBoxDragOver,
  onBoxDragEnd,
  onMoveUp,
  onMoveDown,
  isOverclockActive = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(title);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  // Drag and drop state for task items inside the card
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleDraft(title);
  }, [title]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleSaveTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed) {
      onUpdateTitle(trimmed);
    } else {
      setTitleDraft(title);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setTitleDraft(title);
      setIsEditingTitle(false);
    }
  };

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onAddTask(trimmed);
    setInputText('');
  };

  const handleToggle = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    const wasPending = target && !target.done;
    onToggleTask(id);

    // If this toggle completes the last pending task, trigger celebration
    if (wasPending) {
      const remainingPending = tasks.filter((t) => t.id !== id && !t.done).length;
      if (remainingPending === 0 && tasks.length > 0) {
        if (onTriggerCelebration) {
          onTriggerCelebration();
        } else {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: isOverclockActive
              ? ['#ff1744', '#ff5252', '#ffd700', '#ffffff']
              : ['#b9ff5f', '#7a8dff', '#ffffff', '#e0ff85'],
          });
        }
      }
    }
  };

  const handleStartEditTask = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const handleSaveTaskEdit = (id: string) => {
    const trimmed = editingTaskText.trim();
    if (trimmed) {
      onEditTask(id, trimmed);
    }
    setEditingTaskId(null);
  };

  // Drag & drop handlers for individual tasks inside card
  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (isEditLayoutMode) return;
    e.stopPropagation();
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    if (isEditLayoutMode) return;
    e.preventDefault();
    e.stopPropagation();
    if (!draggedItemId || draggedItemId === targetId) return;

    const sourceIndex = tasks.findIndex((t) => t.id === draggedItemId);
    const targetIndex = tasks.findIndex((t) => t.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0) return;

    const updated = [...tasks];
    const [movedItem] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, movedItem);
    onReorderTasks(updated);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    setDraggedItemId(null);
  };

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pending = total - done;
  const progressPct = total === 0 ? 0 : Math.round((done / total) * 100);

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  return (
    <div
      draggable={isEditLayoutMode}
      onDragStart={onBoxDragStart}
      onDragOver={onBoxDragOver}
      onDragEnd={onBoxDragEnd}
      className={`relative rounded-2xl backdrop-blur-xl border p-5 sm:p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] transition-all ${
        isOverclockActive
          ? 'bg-gradient-to-b from-[#220c10]/95 via-[#160a0d]/90 to-[#0e0f13]/95 border-[#ff1744]/40 shadow-[0_0_40px_rgba(255,23,68,0.25)]'
          : 'bg-gradient-to-b from-[#191b20]/90 to-[#121317]/90 border-white/10'
      } ${
        isEditLayoutMode
          ? 'border-dashed !border-[#b9ff5f] cursor-grab active:cursor-grabbing hover:bg-white/[0.04]'
          : ''
      }`}
      id="checklist-card"
    >
      {/* Move Buttons in Edit Layout Mode */}
      {isEditLayoutMode && (
        <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
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
            <span>Mover Checklist</span>
          </div>
        </div>
      )}

      {/* Badge */}
      <div className="flex items-center gap-2 mb-3.5">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
            isOverclockActive
              ? 'text-white bg-[#ff1744]/20 border-[#ff1744]/40 shadow-[0_0_10px_rgba(255,23,68,0.3)]'
              : 'text-[#f3f2ee] bg-white/[0.07] border-white/10'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              isOverclockActive ? 'bg-[#ff1744]' : 'bg-[#b9ff5f]'
            }`}
          ></span>
          <span>{isOverclockActive ? 'Overclock Focus' : 'Produtividade'}</span>
        </div>
      </div>

      {/* Header with editable title */}
      <div className="flex items-center justify-between gap-3 mb-1">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={handleTitleKeyDown}
            className={`w-full text-xl sm:text-2xl font-bold font-display text-[#f3f2ee] bg-black/40 border rounded-lg px-2.5 py-1 outline-none ${
              isOverclockActive ? 'border-[#ff1744]' : 'border-[#b9ff5f]'
            }`}
            maxLength={60}
          />
        ) : (
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-[#f3f2ee]">
              {title}
            </h1>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
              className={`opacity-60 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/[0.06] text-[#8b8e97] transition-all ${
                isOverclockActive ? 'hover:text-[#ff5252]' : 'hover:text-[#b9ff5f]'
              }`}
              title="Renomear lista"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="text-[11px] font-bold tracking-widest text-[#8b8e97] uppercase mb-5">
        ORGANIZE O QUE PRECISA SER FEITO
      </div>

      {/* Inner Panel */}
      <div
        className={`rounded-xl backdrop-blur-md border p-4 sm:p-5 transition-all ${
          isOverclockActive
            ? 'bg-[#150709]/80 border-[#ff1744]/20'
            : 'bg-[#0d0e12]/70 border-white/[0.06]'
        }`}
      >
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[10px] uppercase font-semibold tracking-wider text-[#8b8e97] mb-1">Total</div>
            <div className="text-xl font-bold text-[#f3f2ee] font-display">{total}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[10px] uppercase font-semibold tracking-wider text-[#8b8e97] mb-1">Concluídos</div>
            <div
              className={`text-xl font-bold font-display ${
                isOverclockActive ? 'text-[#ff5252]' : 'text-[#b9ff5f]'
              }`}
            >
              {done}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[10px] uppercase font-semibold tracking-wider text-[#8b8e97] mb-1">Pendentes</div>
            <div className="text-xl font-bold text-[#f3f2ee] font-display">{pending}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] font-medium text-[#8b8e97] mb-1.5">
            <span>Progresso da lista</span>
            <span
              className={`font-bold ${
                isOverclockActive ? 'text-[#ff5252]' : 'text-[#b9ff5f]'
              }`}
            >
              {progressPct}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverclockActive
                  ? 'bg-gradient-to-r from-[#ff1744] to-[#ff5252] shadow-[0_0_12px_rgba(255,23,68,0.7)]'
                  : 'bg-[#b9ff5f] shadow-[0_0_10px_rgba(185,255,95,0.5)]'
              }`}
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white/10 text-[#f3f2ee] border border-white/20'
                  : 'text-[#8b8e97] hover:text-[#f3f2ee] hover:bg-white/[0.04]'
              }`}
            >
              Todas ({total})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filter === 'pending'
                  ? isOverclockActive
                    ? 'bg-[#ff1744]/20 text-[#ff5252] border border-[#ff1744]/40'
                    : 'bg-[#b9ff5f]/15 text-[#b9ff5f] border border-[#b9ff5f]/30'
                  : 'text-[#8b8e97] hover:text-[#f3f2ee] hover:bg-white/[0.04]'
              }`}
            >
              Pendentes ({pending})
            </button>
            <button
              onClick={() => setFilter('done')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filter === 'done'
                  ? 'bg-white/10 text-[#f3f2ee] border border-white/20'
                  : 'text-[#8b8e97] hover:text-[#f3f2ee] hover:bg-white/[0.04]'
              }`}
            >
              Feitas ({done})
            </button>
          </div>

          <button
            onClick={onOpenQuickBreakdown}
            className={`btn-sweep hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold hover:underline ${
              isOverclockActive ? 'text-[#ff5252]' : 'text-[#b9ff5f]'
            }`}
            title="Usar inteligência artificial para quebrar meta em tarefas"
          >
            <Sparkles className="w-3 h-3" />
            <span>Gerar com IA</span>
          </button>
        </div>

        {/* Celebration Banner when 100% completed */}
        {total > 0 && done === total && (
          <div
            className={`mb-4 p-4 rounded-2xl border relative overflow-hidden animate-in fade-in slide-in-from-top-2 ${
              isOverclockActive
                ? 'bg-gradient-to-r from-[#ff1744]/20 via-[#ff5252]/10 to-transparent border-[#ff1744]/40'
                : 'bg-gradient-to-r from-[#b9ff5f]/15 via-[#b9ff5f]/10 to-transparent border-[#b9ff5f]/40'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl text-white shadow-lg shrink-0 ${
                    isOverclockActive
                      ? 'bg-[#ff1744] shadow-[0_0_15px_rgba(255,23,68,0.5)]'
                      : 'bg-[#b9ff5f] text-[#10130a] shadow-[0_0_15px_rgba(185,255,95,0.4)]'
                  }`}
                >
                  <Trophy className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black font-display text-[#f3f2ee] flex items-center gap-1.5">
                    <span>Parabéns, {userName}! Você é foda!</span>
                    <Zap
                      className={`w-4 h-4 ${
                        isOverclockActive
                          ? 'text-[#ff5252] fill-[#ff5252]'
                          : 'text-[#b9ff5f] fill-[#b9ff5f]'
                      }`}
                    />
                  </h4>
                  <p
                    className={`text-xs font-semibold mt-0.5 ${
                      isOverclockActive ? 'text-[#ff8a80]' : 'text-[#b9ff5f]'
                    }`}
                  >
                    Vamos pra cima campeão! Todas as {total} tarefas foram finalizadas! 🚀
                  </p>
                </div>
              </div>

              {onTriggerCelebration && (
                <button
                  type="button"
                  onClick={onTriggerCelebration}
                  className={`btn-sweep px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 self-end sm:self-center ${
                    isOverclockActive
                      ? 'bg-[#ff1744] text-white hover:bg-[#ff2d55] shadow-[0_0_15px_rgba(255,23,68,0.4)]'
                      : 'bg-[#b9ff5f] text-[#10130a] hover:bg-[#a8f24a] shadow-[0_0_12px_rgba(185,255,95,0.3)]'
                  }`}
                >
                  🎉 Ver Celebração
                </button>
              )}
            </div>
          </div>
        )}

        {/* Add Input Bar */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite uma nova tarefa..."
            maxLength={140}
            className={`flex-1 bg-white/[0.03] border rounded-xl px-3.5 py-2.5 text-sm text-[#f3f2ee] placeholder-[#8b8e97] outline-none transition-colors ${
              isOverclockActive
                ? 'border-white/10 focus:border-[#ff1744]'
                : 'border-white/10 focus:border-[#b9ff5f]'
            }`}
          />
          <button
            type="submit"
            className={`btn-sweep inline-flex items-center justify-center gap-1.5 px-4 py-2.5 font-bold text-sm rounded-xl transition-all cursor-pointer ${
              isOverclockActive
                ? 'bg-gradient-to-r from-[#ff1744] to-[#ff5252] text-white shadow-[0_0_15px_rgba(255,23,68,0.4)]'
                : 'bg-[#b9ff5f] hover:bg-[#a8f24a] text-[#10130a] shadow-[0_0_12px_rgba(185,255,95,0.25)]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </form>

        {/* Task Items List */}
        <div className="space-y-2 transition-all duration-300 min-h-[60px]">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-sm text-[#8b8e97]">
              {total === 0
                ? 'Nenhum item ainda. Adicione o primeiro acima ou use a IA!'
                : filter === 'pending'
                ? 'Todas as tarefas pendentes foram concluídas! 🚀'
                : 'Nenhuma tarefa concluída ainda.'}
            </div>
          ) : (
            filteredTasks.map((task, index) => {
              const isFirstPriority = index === 0 && filter === 'all' && !task.done;
              const isDragging = draggedItemId === task.id;

              return (
                <div
                  key={task.id}
                  draggable={editingTaskId !== task.id && !isEditLayoutMode}
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragOver={(e) => handleDragOver(e, task.id)}
                  onDragEnd={handleDragEnd}
                  className={`group relative flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                    isDragging
                      ? 'opacity-50 scale-95 border-dashed border-[#b9ff5f]'
                      : isFirstPriority
                      ? isOverclockActive
                        ? 'bg-[#ff1744]/[0.08] border-[#ff1744] shadow-[0_0_15px_rgba(255,23,68,0.3)]'
                        : 'bg-[#b9ff5f]/[0.06] border-[#b9ff5f] shadow-[0_0_12px_rgba(185,255,95,0.25)]'
                      : 'bg-white/[0.02] border-transparent hover:border-white/10 hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Grip */}
                  <div
                    className="cursor-grab active:cursor-grabbing text-[#8b8e97] hover:text-[#f3f2ee] p-0.5 opacity-40 group-hover:opacity-100 transition-opacity"
                    title="Arraste para reordenar"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Custom Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggle(task.id)}
                    className={`w-5 h-5 min-w-[20px] rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                      task.done
                        ? isOverclockActive
                          ? 'bg-[#ff1744] border-[#ff1744] text-white shadow-[0_0_8px_rgba(255,23,68,0.6)]'
                          : 'bg-[#b9ff5f] border-[#b9ff5f] text-[#10130a]'
                        : isOverclockActive
                        ? 'border-[#ff1744] hover:bg-[#ff1744]/20'
                        : 'border-[#b9ff5f] hover:bg-[#b9ff5f]/15'
                    }`}
                  >
                    {task.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  {/* Text / Inline Edit */}
                  <div className="flex-1 min-w-0">
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editingTaskText}
                        onChange={(e) => setEditingTaskText(e.target.value)}
                        onBlur={() => handleSaveTaskEdit(task.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTaskEdit(task.id);
                          if (e.key === 'Escape') setEditingTaskId(null);
                        }}
                        autoFocus
                        className={`w-full bg-black/50 border rounded-lg px-2 py-0.5 text-sm text-[#f3f2ee] outline-none ${
                          isOverclockActive ? 'border-[#ff1744]' : 'border-[#b9ff5f]'
                        }`}
                      />
                    ) : (
                      <span
                        onDoubleClick={() => handleStartEditTask(task)}
                        className={`block text-sm break-words transition-all select-none ${
                          task.done ? 'line-through text-[#8b8e97]' : 'text-[#f3f2ee]'
                        }`}
                      >
                        {task.text}
                      </span>
                    )}
                  </div>

                  {/* Priority Tag */}
                  {isFirstPriority && (
                    <span
                      className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap ${
                        isOverclockActive
                          ? 'text-[#ff5252] bg-[#ff1744]/20 border border-[#ff1744]/50'
                          : 'text-[#b9ff5f] bg-[#b9ff5f]/15 border border-[#b9ff5f]/40'
                      }`}
                    >
                      Prioridade #1
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleStartEditTask(task)}
                      className={`p-1 rounded-lg text-[#8b8e97] hover:bg-white/[0.06] transition-colors ${
                        isOverclockActive ? 'hover:text-[#ff5252]' : 'hover:text-[#b9ff5f]'
                      }`}
                      title="Editar tarefa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 rounded-lg text-[#8b8e97] hover:text-[#ff8a7a] hover:bg-[#ff8a7a]/10 transition-colors"
                      title="Excluir tarefa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info & Clear done */}
        <div className="flex items-center justify-between text-xs text-[#8b8e97] mt-4 pt-3 border-t border-white/[0.06]">
          <span>
            {total} {total === 1 ? 'tarefa' : 'tarefas'} no total
          </span>

          {done > 0 && (
            <button
              onClick={onClearCompleted}
              className={`hover:underline font-semibold text-xs cursor-pointer ${
                isOverclockActive ? 'text-[#ff5252]' : 'text-[#b9ff5f]'
              }`}
            >
              Limpar {done} {done === 1 ? 'concluída' : 'concluídas'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
