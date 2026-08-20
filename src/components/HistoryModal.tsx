import React, { useState } from 'react';
import {
  History,
  X,
  Plus,
  Check,
  RotateCcw,
  Trash2,
  Sparkles,
  Flame,
  Search,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { HistoryEntry, HistoryActionType } from '../types';
import { formatTimeAgo } from '../utils/storage';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onClearHistory: () => void;
  isOverclockActive?: boolean;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  isOverclockActive = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const getActionIcon = (type: HistoryActionType) => {
    switch (type) {
      case 'done':
        return <Check className={`w-3.5 h-3.5 ${isOverclockActive ? 'text-[#ff5252]' : 'text-[#b9ff5f]'}`} />;
      case 'undone':
        return <RotateCcw className="w-3.5 h-3.5 text-[#7a8dff]" />;
      case 'deleted':
        return <Trash2 className="w-3.5 h-3.5 text-[#ff8a7a]" />;
      case 'ai_generated':
        return <Sparkles className={`w-3.5 h-3.5 ${isOverclockActive ? 'text-[#ff5252]' : 'text-[#b9ff5f]'}`} />;
      case 'overclock_start':
        return <Flame className="w-3.5 h-3.5 text-[#ff1744]" />;
      case 'added':
      default:
        return <Plus className={`w-3.5 h-3.5 ${isOverclockActive ? 'text-[#ff5252]' : 'text-[#b9ff5f]'}`} />;
    }
  };

  const getActionBg = (type: HistoryActionType) => {
    switch (type) {
      case 'done':
        return isOverclockActive ? 'bg-[#ff1744]/20 border-[#ff1744]/40' : 'bg-[#b9ff5f]/15 border-[#b9ff5f]/30';
      case 'undone':
        return 'bg-[#7a8dff]/15 border-[#7a8dff]/30';
      case 'deleted':
        return 'bg-[#ff8a7a]/15 border-[#ff8a7a]/30';
      case 'ai_generated':
        return isOverclockActive ? 'bg-[#ff1744]/25 border-[#ff1744]/45' : 'bg-[#b9ff5f]/20 border-[#b9ff5f]/40';
      case 'overclock_start':
        return 'bg-[#ff1744]/25 border-[#ff1744]/50';
      case 'added':
      default:
        return 'bg-white/[0.05] border-white/10';
    }
  };

  const getActionLabel = (type: HistoryActionType) => {
    switch (type) {
      case 'done':
        return 'Concluída';
      case 'undone':
        return 'Desmarcada';
      case 'deleted':
        return 'Removida';
      case 'ai_generated':
        return 'IA';
      case 'overclock_start':
        return 'Overclock';
      case 'added':
      default:
        return 'Criada';
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'all') return true;
    if (filterType === 'done') return item.type === 'done';
    if (filterType === 'added') return item.type === 'added';
    if (filterType === 'ai') return item.type === 'ai_generated';
    if (filterType === 'deleted') return item.type === 'deleted';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" id="history-modal-overlay">
      <div
        className={`relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isOverclockActive
            ? 'bg-gradient-to-b from-[#1b0a0e] via-[#120608] to-[#0c0d11] border-[#ff1744]/40 shadow-[0_0_50px_rgba(255,23,68,0.25)]'
            : 'bg-gradient-to-b from-[#18191f] via-[#121318] to-[#0c0d11] border-white/10'
        }`}
        id="history-modal-content"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-inner ${
                isOverclockActive
                  ? 'bg-[#ff1744]/20 border-[#ff1744]/40 text-[#ff5252]'
                  : 'bg-[#b9ff5f]/15 border-[#b9ff5f]/30 text-[#b9ff5f]'
              }`}
            >
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#f3f2ee] font-display">Histórico de Atividades</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/[0.08] text-[#8b8e97]">
                  {history.length} {history.length === 1 ? 'registro' : 'registros'}
                </span>
              </div>
              <p className="text-xs text-[#8b8e97]">Linha do tempo de todas as ações e metas na sua checklist</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-[#8b8e97] hover:text-[#f3f2ee] transition-colors cursor-pointer"
            title="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar (Search, Filter, Clear) */}
        <div className="p-4 border-b border-white/[0.06] bg-black/20 flex flex-wrap items-center justify-between gap-2.5">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8b8e97]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar no histórico..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-[#f3f2ee] placeholder:text-[#8b8e97] focus:outline-none focus:border-[#b9ff5f]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'done', label: 'Concluídas' },
              { id: 'added', label: 'Criadas' },
              { id: 'ai', label: 'IA' },
              { id: 'deleted', label: 'Excluídas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  filterType === tab.id
                    ? isOverclockActive
                      ? 'bg-[#ff1744] text-white'
                      : 'bg-[#b9ff5f] text-[#0b0c10]'
                    : 'bg-white/[0.04] text-[#8b8e97] hover:text-[#f3f2ee] hover:bg-white/[0.08]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Clear Button */}
          {history.length > 0 && (
            <div>
              {confirmClear ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#ff8a7a]">Limpar tudo?</span>
                  <button
                    onClick={() => {
                      onClearHistory();
                      setConfirmClear(false);
                    }}
                    className="px-2 py-1 rounded-md bg-[#ff1744] hover:bg-[#d50000] text-white text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-2 py-1 rounded-md bg-white/[0.08] hover:bg-white/15 text-[#f3f2ee] text-[11px] cursor-pointer"
                  >
                    Não
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#ff1744]/20 border border-white/10 hover:border-[#ff1744]/40 text-[11px] text-[#8b8e97] hover:text-[#ff8a7a] transition-all cursor-pointer"
                  title="Limpar todos os registros do histórico"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Limpar</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Scrollable list */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 max-h-[50vh]">
          {filteredHistory.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-[#8b8e97]">
              <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                <History className="w-6 h-6 opacity-40" />
              </div>
              <p className="text-sm font-semibold text-[#f3f2ee] mb-1">
                {searchTerm ? 'Nenhum registro encontrado' : 'Nenhuma atividade registrada'}
              </p>
              <p className="text-xs max-w-xs">
                {searchTerm
                  ? 'Tente buscar com outro termo ou alterar o filtro selecionado.'
                  : 'As ações de criação, conclusão e quebra por IA aparecerão aqui automaticamente.'}
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/10 transition-all text-xs group"
              >
                {/* Type Icon */}
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${getActionBg(
                    item.type
                  )}`}
                >
                  {getActionIcon(item.type)}
                </div>

                {/* Main Text & Type Badge */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                        item.type === 'done'
                          ? isOverclockActive
                            ? 'bg-[#ff1744]/20 border-[#ff1744]/40 text-[#ff5252]'
                            : 'bg-[#b9ff5f]/15 border-[#b9ff5f]/30 text-[#b9ff5f]'
                          : 'bg-white/[0.05] border-white/10 text-[#8b8e97]'
                      }`}
                    >
                      {getActionLabel(item.type)}
                    </span>
                  </div>
                  <p className="text-xs text-[#f3f2ee] font-medium leading-relaxed break-words">{item.text}</p>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-1 text-[11px] text-[#8b8e97] shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(item.at)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/30 flex items-center justify-between text-xs text-[#8b8e97]">
          <span>Histórico armazenado localmente</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/15 text-[#f3f2ee] font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
