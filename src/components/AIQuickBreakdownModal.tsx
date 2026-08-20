import React, { useState } from 'react';
import { Sparkles, X, ListPlus, Check, AlertCircle } from 'lucide-react';
import { TaskItem } from '../types';

interface AIQuickBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMultipleTasks: (tasks: { text: string; isPriority?: boolean }[]) => void;
  currentTasks: TaskItem[];
}

export const AIQuickBreakdownModal: React.FC<AIQuickBreakdownModalProps> = ({
  isOpen,
  onClose,
  onAddMultipleTasks,
  currentTasks,
}) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    tasks: { text: string; isPriority?: boolean }[];
    motivationalTip?: string;
  } | null>(null);
  const [selected, setSelected] = useState<{ [key: number]: boolean }>({});
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const suggestions = [
    'Lançar novo projeto / produto digital',
    'Organizar rotina matinal de alta performance',
    'Sprint semanal de programação e entrega',
    'Planejamento de estudos e leitura diária',
  ];

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/breakdown-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: goal.trim(),
          currentTasks,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Falha ao processar com IA');
      }

      setResult(data);
      const sel: { [k: number]: boolean } = {};
      data.tasks?.forEach((_: any, i: number) => {
        sel[i] = true;
      });
      setSelected(sel);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Erro ao gerar tarefas.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result?.tasks) return;
    const toAdd = result.tasks.filter((_, idx) => selected[idx]);
    if (toAdd.length === 0) return;

    onAddMultipleTasks(toAdd);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md"
      onClick={onClose}
      id="quick-breakdown-modal"
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-[#1a1c22] to-[#111216] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#8b8e97] hover:text-[#f3f2ee] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-[#b9ff5f]/15 border border-[#b9ff5f]/30">
            <Sparkles className="w-4 h-4 text-[#b9ff5f]" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-[#f3f2ee]">Quebrar Meta em Tarefas</h3>
            <span className="text-[11px] text-[#8b8e97]">Gere ações práticas com a inteligência artificial</span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-2.5 mb-3 rounded-xl bg-[#ff8a7a]/10 border border-[#ff8a7a]/30 text-xs text-[#ff8a7a]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-[#8b8e97] mb-1.5">
              Qual é o seu objetivo?
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Ex: Fazer revisão do projeto Overclock..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerate();
              }}
              className="w-full bg-[#0d0e12] border border-white/10 focus:border-[#b9ff5f] rounded-xl px-3.5 py-2.5 text-sm text-[#f3f2ee] placeholder-[#8b8e97] outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setGoal(s)}
                className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[#8b8e97] hover:text-[#f3f2ee] border border-white/[0.05]"
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !goal.trim()}
            className={`btn-sweep w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
              loading || !goal.trim()
                ? 'bg-[#b9ff5f]/40 text-[#10130a] cursor-not-allowed'
                : 'bg-[#b9ff5f] hover:bg-[#a8f24a] text-[#10130a] shadow-[0_0_12px_rgba(185,255,95,0.3)]'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Analisando...' : 'Gerar Tarefas'}</span>
          </button>
        </div>

        {result && (
          <div className="p-3.5 rounded-xl bg-[#0d0e12] border border-[#b9ff5f]/30 space-y-3 animate-in fade-in">
            {result.motivationalTip && (
              <p className="text-xs text-[#b9ff5f] italic">
                ⚡ {result.motivationalTip}
              </p>
            )}

            <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
              {result.tasks.map((t, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={!!selected[idx]}
                    onChange={(e) =>
                      setSelected({
                        ...selected,
                        [idx]: e.target.checked,
                      })
                    }
                    className="rounded accent-[#b9ff5f]"
                  />
                  <span className="flex-1 text-[#f3f2ee]">{t.text}</span>
                  {t.isPriority && (
                    <span className="px-1 py-0.5 rounded text-[8px] font-bold uppercase text-[#b9ff5f] bg-[#b9ff5f]/15">
                      Prioridade
                    </span>
                  )}
                </label>
              ))}
            </div>

            <button
              onClick={handleApply}
              className="btn-sweep w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-[#b9ff5f] text-[#10130a] hover:bg-[#a8f24a] transition-all"
            >
              {success ? <Check className="w-3.5 h-3.5" /> : <ListPlus className="w-3.5 h-3.5" />}
              <span>{success ? 'Adicionado com Sucesso!' : 'Inserir na Minha Checklist'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
