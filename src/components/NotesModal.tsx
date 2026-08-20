import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Copy, Check, FileText, Trash2, CheckCircle2 } from 'lucide-react';
import { TaskItem } from '../types';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  onSaveNotes: (notes: string) => void;
  tasks: TaskItem[];
}

export const NotesModal: React.FC<NotesModalProps> = ({
  isOpen,
  onClose,
  notes,
  onSaveNotes,
  tasks,
}) => {
  const [content, setContent] = useState(notes);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    setContent(notes);
  }, [notes]);

  if (!isOpen) return null;

  const handleChange = (val: string) => {
    setContent(val);
    setSaveStatus('Salvando...');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSaveNotes(val);
      setSaveStatus('Salvo automaticamente');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (window.confirm('Deseja limpar todo o conteúdo do bloco de notas?')) {
      setContent('');
      onSaveNotes('');
    }
  };

  const handleAISummarize = async () => {
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/ai/summarize-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: content,
          tasks,
        }),
      });
      const data = await res.json();
      if (data.summary) {
        const updated = `${content}\n\n--- ⚡ Resumo Inteligente com IA ---\n${data.summary}`;
        setContent(updated);
        onSaveNotes(updated);
        setSaveStatus('Resumo gerado e salvo!');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (e) {
      console.error(e);
      setSaveStatus('Erro ao resumir com IA');
    } finally {
      setIsSummarizing(false);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md"
      onClick={onClose}
      id="notes-modal"
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#1a1c22] to-[#111216] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#b9ff5f]/15 border border-[#b9ff5f]/30">
              <FileText className="w-4 h-4 text-[#b9ff5f]" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-[#f3f2ee]">Bloco de Notas Overclock</h2>
              <span className="text-[11px] text-[#8b8e97]">
                Anotações rápidas, rascunhos e síntese com IA
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#8b8e97] hover:text-[#f3f2ee] transition-colors cursor-pointer"
            title="Fechar (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleAISummarize}
              disabled={isSummarizing}
              className={`btn-sweep inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSummarizing
                  ? 'bg-[#b9ff5f]/50 text-[#10130a] cursor-wait'
                  : 'bg-[#b9ff5f] text-[#10130a] hover:bg-[#a8f24a] shadow-[0_0_12px_rgba(185,255,95,0.3)]'
              }`}
              title="Organizar e resumir pontos-chave com inteligência artificial"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSummarizing ? 'animate-spin' : ''}`} />
              <span>{isSummarizing ? 'Sintetizando...' : 'Otimizar com IA'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-[#f3f2ee] border border-white/10 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#b9ff5f]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>

          {content && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-[#8b8e97] hover:text-[#ff8a7a] hover:bg-[#ff8a7a]/10 transition-colors"
              title="Limpar bloco"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>

        {/* Textarea */}
        <div className="flex-1 min-h-[260px] flex flex-col">
          <textarea
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Escreva suas anotações, ideias, reuniões ou insights aqui..."
            className="w-full flex-1 min-h-[260px] bg-[#0d0e12] border border-white/10 focus:border-[#b9ff5f] rounded-xl p-4 text-sm text-[#f3f2ee] placeholder-[#8b8e97] leading-relaxed outline-none resize-none transition-colors"
          />
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-[#8b8e97] mt-3 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span>{wordCount} palavras</span>
            <span>{charCount} caracteres</span>
          </div>

          {saveStatus && (
            <div className="flex items-center gap-1 text-[#b9ff5f] font-medium text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{saveStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
