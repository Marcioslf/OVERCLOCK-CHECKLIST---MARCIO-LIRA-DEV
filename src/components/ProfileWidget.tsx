import React, { useRef } from 'react';
import { User, Sparkles, Camera, ExternalLink, GripVertical, Flame, Zap, KeyRound } from 'lucide-react';
import { ProfileData } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface ProfileWidgetProps {
  profile: ProfileData;
  onUpdateProfile: (updated: Partial<ProfileData>) => void;
  onOpenAIStudio: () => void;
  currentPlayerId: string;
  onOpenPlayerIDModal: () => void;
  isEditLayoutMode: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isOverclockActive?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const ProfileWidget: React.FC<ProfileWidgetProps> = ({
  profile,
  onUpdateProfile,
  onOpenAIStudio,
  currentPlayerId,
  onOpenPlayerIDModal,
  isEditLayoutMode,
  onDragStart,
  onDragOver,
  onDragEnd,
  isOverclockActive = false,
  onMoveUp,
  onMoveDown,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const rawDataUrl = reader.result as string;
      const optimized = await compressImage(rawDataUrl, 320, 320, 0.82);
      onUpdateProfile({ photo: optimized });
    };
    reader.readAsDataURL(file);
  };

  const initialLetter = (profile.name || 'Overclock').trim().charAt(0).toUpperCase() || 'O';

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
      id="profile-widget"
    >
      {/* 4-Digit Player ID Badge & Action Button in the corner */}
      <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
        {isEditLayoutMode ? (
          <div className="flex items-center gap-1">
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
        ) : (
          <div className="flex items-center gap-1.5 p-1 pl-2 rounded-xl bg-black/50 border border-white/10 shadow-inner group hover:border-[#b9ff5f]/40 transition-all">
            <span className="font-mono text-xs font-extrabold text-[#f3f2ee] tracking-wider">
              #{currentPlayerId}
            </span>
            <button
              onClick={onOpenPlayerIDModal}
              className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                isOverclockActive
                  ? 'bg-[#ff1744]/20 hover:bg-[#ff1744] text-[#ff5252] hover:text-white'
                  : 'bg-[#b9ff5f]/20 hover:bg-[#b9ff5f] text-[#b9ff5f] hover:text-[#10130a]'
              }`}
              title="Carregar ou trocar Jogador por ID de 4 números"
              id="player-id-btn"
            >
              <KeyRound className="w-2.5 h-2.5" />
              <span>ID</span>
            </button>
          </div>
        )}
      </div>

      {/* Badge */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
            isOverclockActive
              ? 'text-white bg-[#ff1744]/20 border-[#ff1744]/40'
              : 'text-[#f3f2ee] bg-white/[0.07] border-white/10'
          }`}
        >
          {isOverclockActive ? (
            <Flame className="w-3 h-3 text-[#ff5252] animate-flame" />
          ) : (
            <User className="w-3 h-3 text-[#b9ff5f]" />
          )}
          <span>{isOverclockActive ? 'Modo Overclock' : 'Perfil'}</span>
        </div>

        {isOverclockActive && (
          <span className="text-[10px] font-black uppercase text-[#ff5252] tracking-wider animate-pulse flex items-center gap-1">
            <Zap className="w-3 h-3 fill-[#ff5252]" />
            <span>Hiperfoco Ativo</span>
          </span>
        )}
      </div>

      <div className="text-base font-bold text-[#f3f2ee] font-display mb-0.5">Seu Perfil</div>
      <div className="text-[11px] font-bold tracking-widest text-[#8b8e97] uppercase mb-3.5">
        QUEM ESTÁ NA MISSÃO
      </div>

      <div
        className={`rounded-xl backdrop-blur-md border p-4 flex flex-col items-center text-center transition-all ${
          isOverclockActive
            ? 'bg-[#150709]/80 border-[#ff1744]/20 shadow-[0_0_20px_rgba(255,23,68,0.15)]'
            : 'bg-[#0d0e12]/70 border-white/[0.06]'
        }`}
      >
        {/* Avatar with Red Glowing Ring in Overclock Mode (Static, No Rotation) */}
        <div className="relative group mb-3 flex items-center justify-center">
          {isOverclockActive ? (
            <div className="overclock-avatar-ring relative p-[3px]">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full border-2 border-[#ff1744] bg-[#120508] overflow-hidden flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(255,23,68,0.7)] hover:scale-105 transition-transform"
                title="Clique para trocar a foto ou use o botão de IA abaixo"
              >
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-2xl font-black font-display text-[#ff5252]">{initialLetter}</span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-[#f3f2ee] transition-opacity rounded-full">
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>Trocar</span>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-full border-2 border-[#b9ff5f] bg-[#121317] overflow-hidden flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(185,255,95,0.3)] hover:scale-105 transition-transform"
              title="Clique para trocar a foto ou use o botão de IA abaixo"
            >
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-2xl font-black font-display text-[#b9ff5f]">{initialLetter}</span>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-[#f3f2ee] transition-opacity rounded-full">
                <Camera className="w-4 h-4 mb-0.5" />
                <span>Trocar</span>
              </div>
            </div>
          )}

          <button
            onClick={onOpenAIStudio}
            className={`absolute -bottom-1 -right-1 p-1.5 rounded-full border-2 shadow hover:scale-110 transition-transform cursor-pointer z-10 ${
              isOverclockActive
                ? 'bg-[#ff1744] text-white border-[#0e0f13] shadow-[0_0_10px_rgba(255,23,68,0.8)]'
                : 'bg-[#b9ff5f] text-[#10130a] border-[#0b0c10]'
            }`}
            title="Gerar avatar exclusivo com IA (Gemini 3 Pro)"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Name input */}
        <input
          type="text"
          value={profile.name}
          onChange={(e) => onUpdateProfile({ name: e.target.value })}
          placeholder="Seu Nome"
          maxLength={40}
          className={`w-full text-center font-bold text-base text-[#f3f2ee] bg-transparent border-b border-transparent px-2 py-0.5 outline-none font-display mb-1 transition-colors ${
            isOverclockActive ? 'focus:border-[#ff1744]' : 'focus:border-[#b9ff5f]'
          }`}
        />

        {/* Profession input */}
        <input
          type="text"
          value={profile.profession}
          onChange={(e) => onUpdateProfile({ profession: e.target.value })}
          placeholder="Sua Profissão / Cargo"
          maxLength={50}
          className={`w-full text-center text-xs text-[#8b8e97] bg-transparent border-b border-transparent px-2 py-0.5 outline-none mb-3 transition-colors ${
            isOverclockActive ? 'focus:border-[#ff1744]' : 'focus:border-[#b9ff5f]'
          }`}
        />

        {/* Quick AI Avatar Button */}
        <button
          onClick={onOpenAIStudio}
          className={`btn-sweep w-full mb-2 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            isOverclockActive
              ? 'text-[#ff5252] bg-[#ff1744]/15 hover:bg-[#ff1744]/25 border border-[#ff1744]/35'
              : 'text-[#b9ff5f] bg-[#b9ff5f]/10 hover:bg-[#b9ff5f]/20 border border-[#b9ff5f]/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Criar Avatar com IA</span>
        </button>

        {/* Community Link */}
        <a
          href={profile.communityUrl || 'https://overclock.com.br'}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-sweep w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isOverclockActive
              ? 'text-white bg-gradient-to-r from-[#ff1744] to-[#ff5252] hover:from-[#ff2d55] hover:to-[#ff6b6b] shadow-[0_0_20px_rgba(255,23,68,0.4)]'
              : 'text-[#10130a] bg-[#b9ff5f] hover:bg-[#a8f24a] shadow-[0_0_15px_rgba(185,255,95,0.3)]'
          }`}
        >
          <span>Junte-se à comunidade</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
