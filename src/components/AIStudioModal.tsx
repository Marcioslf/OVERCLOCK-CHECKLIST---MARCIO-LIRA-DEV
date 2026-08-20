import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Image as ImageIcon,
  CheckCircle,
  Download,
  UserCheck,
  Zap,
  Layers,
  Crop,
  Sliders,
  Check,
  Copy,
  AlertCircle,
  ListPlus
} from 'lucide-react';
import { ImageModelType, AspectRatioType, ImageSizeType, GeneratedImageRecord, TaskItem } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface AIStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAvatar: (imageUrl: string) => void;
  onAddMultipleTasks: (tasks: { text: string; isPriority?: boolean }[]) => void;
  currentTasks: TaskItem[];
  gallery: GeneratedImageRecord[];
  onAddToGallery: (record: GeneratedImageRecord) => void;
}

export const AIStudioModal: React.FC<AIStudioModalProps> = ({
  isOpen,
  onClose,
  onApplyAvatar,
  onAddMultipleTasks,
  currentTasks,
  gallery,
  onAddToGallery,
}) => {
  const [activeTab, setActiveTab] = useState<'image' | 'breakdown'>('image');

  // Image Generation Form State
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<ImageModelType>('gemini-3-pro-image-preview');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1');
  const [imageSize, setImageSize] = useState<ImageSizeType>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{
    imageUrl: string;
    modelUsed: string;
    aspectRatio: string;
    imageSize: string;
    textFeedback?: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [appliedAvatarSuccess, setAppliedAvatarSuccess] = useState(false);

  // Task Breakdown Form State
  const [goalPrompt, setGoalPrompt] = useState('');
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [breakdownResult, setBreakdownResult] = useState<{
    tasks: { text: string; isPriority?: boolean }[];
    motivationalTip?: string;
  } | null>(null);
  const [selectedBreakdownTasks, setSelectedBreakdownTasks] = useState<{ [index: number]: boolean }>({});
  const [addedTasksSuccess, setAddedTasksSuccess] = useState(false);

  if (!isOpen) return null;

  const promptPresets = [
    'Avatar estilo cyberpunk 3D futurista com iluminação neon verde e headset high-tech',
    'Mascote robô minimalista Overclock em render 3D fosco com detalhes luminosos',
    'Emblema de conquista Gamer Pro com raio de energia e textura de fibra de carbono',
    'Wallpaper abstrato tech escuro com circuitos brilhantes e linhas geométricas neon',
    'Foto realista cinematográfica de profissional de tecnologia focado em setup futurista',
  ];

  const goalPresets = [
    'Lançar uma nova feature no app em 1 semana',
    'Organizar rotina de estudos de alta performance e foco profundo',
    'Setup completo de gravação de conteúdo e redes sociais',
    'Treino e dieta para atingir pico de energia e disciplina diária',
  ];

  const handleGenerateImage = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setErrorMsg('Por favor, digite uma descrição para a imagem.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setAppliedAvatarSuccess(false);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          model: selectedModel,
          aspectRatio,
          imageSize,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Falha na geração de imagem');
      }

      setGeneratedResult(data);

      // Keep lightweight thumbnail for gallery to respect storage quotas
      const optimizedThumbnail = await compressImage(data.imageUrl, 280, 280, 0.75);

      const record: GeneratedImageRecord = {
        id: Date.now().toString(),
        url: optimizedThumbnail,
        prompt: trimmed,
        model: selectedModel,
        aspectRatio,
        imageSize,
        createdAt: Date.now(),
      };
      onAddToGallery(record);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao conectar ao serviço de IA.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSetAvatar = async (url: string) => {
    const optimized = await compressImage(url, 320, 320, 0.82);
    onApplyAvatar(optimized);
    setAppliedAvatarSuccess(true);
    setTimeout(() => setAppliedAvatarSuccess(false), 3000);
  };

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `overclock-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Task Breakdown
  const handleBreakdownGoal = async () => {
    const trimmed = goalPrompt.trim();
    if (!trimmed) return;

    setIsBreakingDown(true);
    setErrorMsg(null);
    setAddedTasksSuccess(false);

    try {
      const res = await fetch('/api/ai/breakdown-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: trimmed,
          currentTasks,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Falha ao quebrar meta');
      }

      setBreakdownResult(data);
      const initialSelection: { [idx: number]: boolean } = {};
      data.tasks?.forEach((_: any, idx: number) => {
        initialSelection[idx] = true;
      });
      setSelectedBreakdownTasks(initialSelection);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao processar com IA.');
    } finally {
      setIsBreakingDown(false);
    }
  };

  const handleAddSelectedTasks = () => {
    if (!breakdownResult?.tasks) return;
    const selected = breakdownResult.tasks.filter((_, idx) => selectedBreakdownTasks[idx]);
    if (selected.length === 0) return;

    onAddMultipleTasks(selected);
    setAddedTasksSuccess(true);
    setTimeout(() => {
      setAddedTasksSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
      id="ai-studio-modal"
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#1a1c22] to-[#111216] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#8b8e97] hover:text-[#f3f2ee] transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-[#b9ff5f]/15 border border-[#b9ff5f]/30">
            <Sparkles className="w-5 h-5 text-[#b9ff5f]" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-[#f3f2ee]">Estúdio de IA Overclock</h2>
            <p className="text-xs text-[#8b8e97]">
              Geração de imagens de alta performance e inteligência para tarefas
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 my-4 border-b border-white/[0.08] pb-3">
          <button
            onClick={() => {
              setActiveTab('image');
              setErrorMsg(null);
            }}
            className={`btn-sweep flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'image'
                ? 'bg-[#b9ff5f] text-[#10130a] shadow-[0_0_12px_rgba(185,255,95,0.3)]'
                : 'bg-white/[0.03] text-[#8b8e97] hover:text-[#f3f2ee] hover:bg-white/[0.06]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gerador de Imagens & Avatares</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('breakdown');
              setErrorMsg(null);
            }}
            className={`btn-sweep flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'breakdown'
                ? 'bg-[#b9ff5f] text-[#10130a] shadow-[0_0_12px_rgba(185,255,95,0.3)]'
                : 'bg-white/[0.03] text-[#8b8e97] hover:text-[#f3f2ee] hover:bg-white/[0.06]'
            }`}
          >
            <ListPlus className="w-4 h-4" />
            <span>Quebra de Metas com IA</span>
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-[#ff8a7a]/10 border border-[#ff8a7a]/30 text-xs text-[#ff8a7a]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: IMAGE GENERATION */}
        {activeTab === 'image' && (
          <div className="space-y-4">
            {/* Prompt Input */}
            <div>
              <label className="block text-xs font-semibold text-[#8b8e97] uppercase tracking-wider mb-1.5">
                Descreva a imagem ou avatar desejado
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Avatar cyberpunk futurista com iluminação neon verde, óculos táticos e alta definição..."
                rows={3}
                className="w-full bg-[#0d0e12] border border-white/10 focus:border-[#b9ff5f] rounded-xl p-3 text-sm text-[#f3f2ee] placeholder-[#8b8e97] outline-none resize-none transition-colors"
              />
            </div>

            {/* Presets */}
            <div>
              <span className="block text-[10px] uppercase font-semibold text-[#8b8e97] tracking-wider mb-1.5">
                Sugestões Rápidas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {promptPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[#8b8e97] hover:text-[#f3f2ee] border border-white/[0.06] transition-colors text-left"
                  >
                    {preset.slice(0, 48)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Controls: Model, Aspect Ratio, Image Size */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0d0e12]/70 border border-white/[0.06]">
              {/* Model selection */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8b8e97] uppercase tracking-wider mb-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#b9ff5f]" />
                  <span>Modelo de IA</span>
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as ImageModelType)}
                  className="w-full bg-white/[0.05] border border-white/10 focus:border-[#b9ff5f] rounded-xl p-2 text-xs text-[#f3f2ee] outline-none cursor-pointer"
                >
                  <option value="gemini-3-pro-image-preview" className="bg-[#121317]">
                    gemini-3-pro-image-preview (Studio HD)
                  </option>
                  <option value="gemini-3.1-flash-image-preview" className="bg-[#121317]">
                    gemini-3.1-flash-image-preview (Rápido)
                  </option>
                </select>
              </div>

              {/* Aspect ratio selection */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8b8e97] uppercase tracking-wider mb-1.5">
                  <Crop className="w-3.5 h-3.5 text-[#b9ff5f]" />
                  <span>Proporção (Aspect Ratio)</span>
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatioType)}
                  className="w-full bg-white/[0.05] border border-white/10 focus:border-[#b9ff5f] rounded-xl p-2 text-xs text-[#f3f2ee] outline-none cursor-pointer"
                >
                  <option value="1:1" className="bg-[#121317]">1:1 (Avatar / Quadrado)</option>
                  <option value="9:16" className="bg-[#121317]">9:16 (Story / Mobile)</option>
                  <option value="16:9" className="bg-[#121317]">16:9 (Widescreen / Banner)</option>
                  <option value="4:3" className="bg-[#121317]">4:3 (Padrão)</option>
                  <option value="3:4" className="bg-[#121317]">3:4 (Retrato)</option>
                  <option value="3:2" className="bg-[#121317]">3:2 (Fotografia)</option>
                  <option value="2:3" className="bg-[#121317]">2:3 (Pôster)</option>
                  <option value="21:9" className="bg-[#121317]">21:9 (Ultrawide)</option>
                </select>
              </div>

              {/* Image Size Selection */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8b8e97] uppercase tracking-wider mb-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#b9ff5f]" />
                  <span>Tamanho da Imagem</span>
                </label>
                <select
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value as ImageSizeType)}
                  className="w-full bg-white/[0.05] border border-white/10 focus:border-[#b9ff5f] rounded-xl p-2 text-xs text-[#f3f2ee] outline-none cursor-pointer"
                >
                  <option value="1K" className="bg-[#121317]">1K (1024px)</option>
                  <option value="2K" className="bg-[#121317]">2K (2048px)</option>
                  <option value="4K" className="bg-[#121317]">4K (Alta Definição 4096px)</option>
                  {selectedModel === 'gemini-3.1-flash-image-preview' && (
                    <option value="512px" className="bg-[#121317]">512px (Compacto)</option>
                  )}
                </select>
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className={`btn-sweep w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                isGenerating
                  ? 'bg-[#b9ff5f]/50 text-[#10130a] cursor-wait'
                  : 'bg-[#b9ff5f] hover:bg-[#a8f24a] text-[#10130a] shadow-[0_0_20px_rgba(185,255,95,0.4)]'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Gerando Imagem com IA...' : 'Gerar Imagem de Alta Performance'}</span>
            </button>

            {/* Generated Image Result Card */}
            {generatedResult && (
              <div className="p-4 rounded-xl bg-[#0d0e12] border border-[#b9ff5f]/40 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#b9ff5f] font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Imagem Gerada com Sucesso!</span>
                  </div>
                  <span className="text-[10px] text-[#8b8e97] uppercase">
                    {generatedResult.aspectRatio} • {generatedResult.imageSize}
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 flex items-center justify-center max-h-[380px]">
                  <img
                    src={generatedResult.imageUrl}
                    alt="Generated artwork"
                    className="max-h-[380px] w-auto object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {generatedResult.textFeedback && (
                  <p className="text-xs text-[#8b8e97] italic">
                    "{generatedResult.textFeedback}"
                  </p>
                )}

                {/* Actions on Generated Image */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleSetAvatar(generatedResult.imageUrl)}
                    className="btn-sweep flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-[#b9ff5f] text-[#10130a] hover:bg-[#a8f24a] transition-all cursor-pointer"
                  >
                    {appliedAvatarSuccess ? <Check className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    <span>{appliedAvatarSuccess ? 'Avatar Aplicado!' : 'Definir como Meu Avatar'}</span>
                  </button>

                  <button
                    onClick={() => handleDownload(generatedResult.imageUrl)}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-white/[0.06] hover:bg-white/[0.12] text-[#f3f2ee] border border-white/10 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar PNG</span>
                  </button>

                  <button
                    onClick={() => handleCopy(generatedResult.imageUrl)}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-white/[0.06] hover:bg-white/[0.12] text-[#f3f2ee] border border-white/10 transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-[#b9ff5f]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copiado' : 'Copiar Data'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Previous Gallery */}
            {gallery.length > 0 && (
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8b8e97] uppercase tracking-wider mb-2">
                  <Layers className="w-3.5 h-3.5 text-[#b9ff5f]" />
                  <span>Galeria de Criações Recentes</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {gallery.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setGeneratedResult({
                        imageUrl: item.url,
                        modelUsed: item.model,
                        aspectRatio: item.aspectRatio,
                        imageSize: item.imageSize,
                      })}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-[#b9ff5f] cursor-pointer transition-all bg-black/40"
                    >
                      <img
                        src={item.url}
                        alt={item.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-[#f3f2ee] font-semibold transition-opacity p-1 text-center">
                        Ver
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TASK BREAKDOWN */}
        {activeTab === 'breakdown' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8b8e97] uppercase tracking-wider mb-1.5">
                Qual meta ou projeto você deseja quebrar em tarefas práticas?
              </label>
              <input
                type="text"
                value={goalPrompt}
                onChange={(e) => setGoalPrompt(e.target.value)}
                placeholder="Ex: Lançar produto digital, Organizar sprint semanal, Preparar apresentação..."
                className="w-full bg-[#0d0e12] border border-white/10 focus:border-[#b9ff5f] rounded-xl px-3.5 py-2.5 text-sm text-[#f3f2ee] placeholder-[#8b8e97] outline-none transition-colors"
              />
            </div>

            {/* Presets */}
            <div>
              <span className="block text-[10px] uppercase font-semibold text-[#8b8e97] tracking-wider mb-1.5">
                Exemplos de Metas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {goalPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGoalPrompt(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[#8b8e97] hover:text-[#f3f2ee] border border-white/[0.06] transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleBreakdownGoal}
              disabled={isBreakingDown}
              className={`btn-sweep w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                isBreakingDown
                  ? 'bg-[#b9ff5f]/50 text-[#10130a] cursor-wait'
                  : 'bg-[#b9ff5f] hover:bg-[#a8f24a] text-[#10130a] shadow-[0_0_20px_rgba(185,255,95,0.4)]'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isBreakingDown ? 'animate-spin' : ''}`} />
              <span>{isBreakingDown ? 'Analisando e Planejando com IA...' : 'Gerar Checklist Estratégica'}</span>
            </button>

            {/* Breakdown Result */}
            {breakdownResult && (
              <div className="p-4 rounded-xl bg-[#0d0e12] border border-[#b9ff5f]/40 space-y-3">
                {breakdownResult.motivationalTip && (
                  <div className="p-2.5 rounded-lg bg-[#b9ff5f]/10 border border-[#b9ff5f]/20 text-xs text-[#b9ff5f] font-medium">
                    ⚡ {breakdownResult.motivationalTip}
                  </div>
                )}

                <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                  {breakdownResult.tasks.map((task, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={!!selectedBreakdownTasks[idx]}
                        onChange={(e) =>
                          setSelectedBreakdownTasks({
                            ...selectedBreakdownTasks,
                            [idx]: e.target.checked,
                          })
                        }
                        className="rounded accent-[#b9ff5f]"
                      />
                      <span className="flex-1 text-[#f3f2ee]">{task.text}</span>
                      {task.isPriority && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase text-[#b9ff5f] bg-[#b9ff5f]/15 border border-[#b9ff5f]/40">
                          Prioridade
                        </span>
                      )}
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleAddSelectedTasks}
                  className="btn-sweep w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs bg-[#b9ff5f] text-[#10130a] hover:bg-[#a8f24a] transition-all cursor-pointer"
                >
                  {addedTasksSuccess ? <Check className="w-4 h-4" /> : <ListPlus className="w-4 h-4" />}
                  <span>{addedTasksSuccess ? 'Tarefas Inseridas na Checklist!' : 'Adicionar Tarefas Selecionadas à Checklist'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
