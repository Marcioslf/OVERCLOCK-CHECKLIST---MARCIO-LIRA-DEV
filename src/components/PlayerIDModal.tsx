import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  UserCheck,
  KeyRound,
  DownloadCloud,
  PlusCircle,
  Users,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ProfileData, TaskItem, HistoryEntry, PlayerDataBundle } from '../types';
import {
  generateRandomPlayerId,
  getPlayerBundle,
  savePlayerBundle,
  getAllSavedPlayerBundles,
} from '../utils/storage';

interface PlayerIDModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlayerId: string;
  onLoadPlayerBundle: (bundle: PlayerDataBundle) => void;
  onGenerateNewPlayerId: () => void;
  currentProfile: ProfileData;
  currentTasks: TaskItem[];
  currentTitle: string;
  currentNotes: string;
  currentHistory: HistoryEntry[];
  isOverclockActive?: boolean;
}

export const PlayerIDModal: React.FC<PlayerIDModalProps> = ({
  isOpen,
  onClose,
  currentPlayerId,
  onLoadPlayerBundle,
  onGenerateNewPlayerId,
  currentProfile,
  currentTasks,
  currentTitle,
  currentNotes,
  currentHistory,
  isOverclockActive = false,
}) => {
  const [inputID, setInputID] = useState('');
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const savedList = getAllSavedPlayerBundles();

  const handleCopyID = () => {
    navigator.clipboard.writeText(currentPlayerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCurrentToID = () => {
    const bundle: PlayerDataBundle = {
      id: currentPlayerId,
      profile: currentProfile,
      tasks: currentTasks,
      title: currentTitle,
      notes: currentNotes,
      history: currentHistory,
      updatedAt: Date.now(),
    };
    savePlayerBundle(bundle);
    setSaveSuccess(true);
    setSuccessMsg(`Perfil e Metas do Jogador #${currentPlayerId} salvos com sucesso!`);
    setTimeout(() => {
      setSaveSuccess(false);
      setSuccessMsg('');
    }, 3000);
  };

  const handleLoadByID = (targetId?: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    const idToLoad = (targetId || inputID).trim();

    if (!idToLoad || idToLoad.length !== 4 || !/^\d{4}$/.test(idToLoad)) {
      setErrorMsg('Por favor, digite um ID válido com exatamente 4 números (ex: 4829).');
      return;
    }

    const bundle = getPlayerBundle(idToLoad);
    if (bundle) {
      onLoadPlayerBundle(bundle);
      setSuccessMsg(`Perfil do Jogador #${idToLoad} (${bundle.profile.name || 'Jogador'}) carregado!`);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      // Create new bundle for this ID
      const newBundle: PlayerDataBundle = {
        id: idToLoad,
        profile: {
          name: `Jogador #${idToLoad}`,
          profession: 'Especialista em Foco',
          photo: '',
          communityUrl: 'https://overclock.com.br',
        },
        tasks: [
          {
            id: 't1',
            text: 'Definir as metas prioritárias do dia',
            done: false,
            createdAt: Date.now(),
            completedAt: null,
            priority: true,
          },
          {
            id: 't2',
            text: 'Executar sprint de foco total no modo Overclock',
            done: false,
            createdAt: Date.now(),
            completedAt: null,
          },
        ],
        title: `Checklist do Jogador #${idToLoad}`,
        notes: `Notas pessoais do jogador #${idToLoad}...`,
        history: [
          {
            id: 'h1',
            type: 'added',
            text: `Iniciou conta do Jogador #${idToLoad}`,
            at: Date.now(),
          },
        ],
        updatedAt: Date.now(),
      };
      savePlayerBundle(newBundle);
      onLoadPlayerBundle(newBundle);
      setSuccessMsg(`Novo perfil criado para o ID #${idToLoad} com sucesso!`);
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl animate-fadeIn"
      id="player-id-modal"
    >
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all text-[#f3f2ee] ${
          isOverclockActive
            ? 'bg-[#120508]/95 border-[#ff1744]/40 shadow-[0_0_50px_rgba(255,23,68,0.3)]'
            : 'bg-[#12141a]/95 border-white/10'
        }`}
      >
        {/* Top Gradient accent line */}
        <div
          className={`h-1.5 w-full bg-gradient-to-r ${
            isOverclockActive
              ? 'from-[#ff1744] via-[#ff5252] to-[#ff9100]'
              : 'from-[#b9ff5f] via-[#7ae53b] to-[#38bdf8]'
          }`}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-[#8b8e97] hover:text-[#f3f2ee] transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className={`p-3 rounded-2xl border ${
                isOverclockActive
                  ? 'bg-[#ff1744]/20 border-[#ff1744]/40 text-[#ff5252]'
                  : 'bg-[#b9ff5f]/15 border-[#b9ff5f]/30 text-[#b9ff5f]'
              }`}
            >
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#b9ff5f] bg-[#b9ff5f]/10 px-2 py-0.5 rounded-md mb-0.5">
                <ShieldCheck className="w-3 h-3" />
                <span>Sincronização por ID de 4 Dígitos</span>
              </div>
              <h3 className="text-xl font-extrabold font-display text-[#f3f2ee]">
                ID do Jogador & Perfis
              </h3>
            </div>
          </div>

          {/* Current Active ID Box */}
          <div
            className={`p-4.5 rounded-2xl border mb-5 transition-all ${
              isOverclockActive
                ? 'bg-[#1e080d]/80 border-[#ff1744]/30'
                : 'bg-white/[0.03] border-white/[0.08]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#8b8e97] uppercase tracking-wider">
                Seu ID Atual de Jogador:
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#b9ff5f]/15 text-[#b9ff5f] font-bold">
                Ativo
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black font-mono tracking-widest text-[#f3f2ee] bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/10 shadow-inner">
                  #{currentPlayerId}
                </span>
                <button
                  onClick={handleCopyID}
                  className="btn-sweep px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-[#f3f2ee] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copiar código ID de 4 números"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#b9ff5f]" />
                      <span className="text-[#b9ff5f]">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveCurrentToID}
                  className="btn-sweep px-3.5 py-2 rounded-xl bg-[#b9ff5f]/15 hover:bg-[#b9ff5f]/25 border border-[#b9ff5f]/30 text-xs font-bold text-[#b9ff5f] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Salvar Dados no ID</span>
                </button>

                <button
                  onClick={onGenerateNewPlayerId}
                  className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs text-[#8b8e97] hover:text-white transition-colors cursor-pointer"
                  title="Gerar Novo ID aleatório para novo perfil"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-2 text-[11px] text-[#8b8e97] leading-relaxed">
              Jogador atual:{' '}
              <strong className="text-[#f3f2ee]">{currentProfile.name || 'Sem nome'}</strong> •{' '}
              {currentTasks.length} metas cadastradas • Produtividade sincronizada.
            </div>
          </div>

          {/* Load ID Form */}
          <div className="p-4.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] mb-5">
            <h4 className="text-xs font-bold text-[#f3f2ee] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <DownloadCloud className="w-4 h-4 text-[#38bdf8]" />
              <span>Carregar ou Entrar com outro ID (4 Dígitos)</span>
            </h4>
            <p className="text-xs text-[#8b8e97] mb-3 leading-relaxed">
              Digite a ID de 4 números para carregar instantaneamente o nome, foto, descrição, checklist completa e estatísticas do jogador.
            </p>

            <div className="flex items-center gap-2.5">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-base text-[#8b8e97]">
                  #
                </span>
                <input
                  type="text"
                  maxLength={4}
                  value={inputID}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setInputID(clean);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLoadByID();
                  }}
                  placeholder="Ex: 4829"
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/15 focus:border-[#b9ff5f] text-lg font-mono font-bold tracking-widest text-[#f3f2ee] outline-none placeholder-[#555] transition-colors"
                />
              </div>

              <button
                onClick={() => handleLoadByID()}
                disabled={inputID.length !== 4}
                className="btn-sweep px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b9ff5f] to-[#9deb42] disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 text-[#10130a] font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-[0_0_15px_rgba(185,255,95,0.25)]"
              >
                <span>Carregar ID</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-2.5 text-xs text-[#ff5252] font-semibold bg-[#ff1744]/10 p-2 rounded-lg border border-[#ff1744]/20">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mt-2.5 text-xs text-[#b9ff5f] font-semibold bg-[#b9ff5f]/10 p-2 rounded-lg border border-[#b9ff5f]/20">
                {successMsg}
              </div>
            )}
          </div>

          {/* Saved Players On This Device */}
          {savedList.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-[#8b8e97] uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#b9ff5f]" />
                  <span>IDs Salvos neste Dispositivo ({savedList.length})</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {savedList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadByID(item.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer group ${
                      item.id === currentPlayerId
                        ? 'bg-[#b9ff5f]/10 border-[#b9ff5f]/40'
                        : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {item.photo ? (
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/20"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center font-bold text-xs text-[#b9ff5f] shrink-0">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#f3f2ee] truncate group-hover:text-[#b9ff5f] transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-[#8b8e97] font-mono">
                          ID: #{item.id}
                        </div>
                      </div>
                    </div>

                    <button
                      className="px-2 py-1 rounded-lg bg-white/[0.06] group-hover:bg-[#b9ff5f] group-hover:text-[#10130a] text-[10px] font-bold transition-colors shrink-0"
                    >
                      {item.id === currentPlayerId ? 'Atual' : 'Abrir'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
