import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChecklistCard } from './components/ChecklistCard';
import { PerformanceWidget } from './components/PerformanceWidget';
import { ProfileWidget } from './components/ProfileWidget';
import { HistoryModal } from './components/HistoryModal';
import { NotesModal } from './components/NotesModal';
import { AIStudioModal } from './components/AIStudioModal';
import { AIQuickBreakdownModal } from './components/AIQuickBreakdownModal';
import { CelebrationModal } from './components/CelebrationModal';
import { OverclockSetupModal } from './components/OverclockSetupModal';
import { OverclockTimerBar } from './components/OverclockTimerBar';
import { OverclockTimeoutModal } from './components/OverclockTimeoutModal';
import { OverclockVictoryModal } from './components/OverclockVictoryModal';
import { WelcomeModal } from './components/WelcomeModal';
import { AIShortcutsWidget } from './components/AIShortcutsWidget';
import { PlayerIDModal } from './components/PlayerIDModal';
import { MacDock } from './components/MacDock';
import {
  TaskItem,
  HistoryEntry,
  ProfileData,
  GeneratedImageRecord,
  WidgetBoxId,
  OverclockSession,
  PlayerDataBundle,
} from './types';
import {
  getStoredTasks,
  saveStoredTasks,
  getStoredTitle,
  saveStoredTitle,
  getStoredHistory,
  saveStoredHistory,
  getStoredProfile,
  saveStoredProfile,
  getStoredNotes,
  saveStoredNotes,
  getStoredBoxOrder,
  saveStoredBoxOrder,
  getStoredAIGallery,
  saveStoredAIGallery,
  getStoredCurrentPlayerId,
  saveCurrentPlayerId,
  savePlayerBundle,
  generateRandomPlayerId,
} from './utils/storage';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>(getStoredTasks);
  const [title, setTitle] = useState<string>(getStoredTitle);
  const [history, setHistory] = useState<HistoryEntry[]>(getStoredHistory);
  const [profile, setProfile] = useState<ProfileData>(getStoredProfile);
  const [notes, setNotes] = useState<string>(getStoredNotes);
  const [boxOrder, setBoxOrder] = useState<WidgetBoxId[]>(getStoredBoxOrder);
  const [gallery, setGallery] = useState<GeneratedImageRecord[]>(getStoredAIGallery);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>(getStoredCurrentPlayerId);

  // Modals & layout modes
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);
  const [isPlayerIDModalOpen, setIsPlayerIDModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isAIStudioOpen, setIsAIStudioOpen] = useState(false);
  const [isQuickBreakdownOpen, setIsQuickBreakdownOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isEditLayoutMode, setIsEditLayoutMode] = useState(false);
  const [draggedBoxId, setDraggedBoxId] = useState<WidgetBoxId | null>(null);

  // Overclock Mode States
  const [overclockSession, setOverclockSession] = useState<OverclockSession | null>(null);
  const [isOverclockSetupOpen, setIsOverclockSetupOpen] = useState(false);
  const [isOverclockTimeoutOpen, setIsOverclockTimeoutOpen] = useState(false);
  const [isOverclockVictoryOpen, setIsOverclockVictoryOpen] = useState(false);

  // PWA Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Overclock Countdown Timer Effect
  useEffect(() => {
    if (!overclockSession || !overclockSession.isActive || overclockSession.isPaused) {
      return;
    }

    const interval = setInterval(() => {
      setOverclockSession((prev) => {
        if (!prev || !prev.isActive || prev.isPaused) return prev;
        if (prev.remainingSeconds <= 1) {
          clearInterval(interval);

          // Time expired! Evaluate status
          const allTasksCompleted = tasks.length > 0 && tasks.every((t) => t.done);
          if (allTasksCompleted) {
            setIsOverclockVictoryOpen(true);
          } else {
            setIsOverclockTimeoutOpen(true);
          }

          return {
            ...prev,
            remainingSeconds: 0,
            isActive: false,
          };
        }

        return {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [overclockSession?.isActive, overclockSession?.isPaused, tasks]);

  const addHistory = (type: HistoryEntry['type'], text: string) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      type,
      text,
      at: Date.now(),
    };
    setHistory((prev) => {
      const updated = [newEntry, ...prev];
      saveStoredHistory(updated);
      return updated;
    });
  };

  // Overclock Session Handlers
  const handleStartOverclock = (durationMinutes: number) => {
    const totalSecs = durationMinutes * 60;
    const now = Date.now();
    const newSession: OverclockSession = {
      isActive: true,
      durationMinutes,
      startTime: now,
      endTime: now + totalSecs * 1000,
      isPaused: false,
      remainingSeconds: totalSecs,
      totalInitialSeconds: totalSecs,
      initialPendingCount: tasks.filter((t) => !t.done).length,
    };
    setOverclockSession(newSession);
    addHistory('overclock_start', `Iniciou Overclock Mode (${durationMinutes} min)`);
  };

  const handlePauseOverclock = () => {
    setOverclockSession((prev) => (prev ? { ...prev, isPaused: !prev.isPaused } : null));
  };

  const handleStopOverclock = () => {
    setOverclockSession(null);
    setIsOverclockTimeoutOpen(false);
  };

  const handleExtendOverclock = (extraMinutes: number) => {
    setOverclockSession((prev) => {
      if (!prev) return null;
      const extraSec = extraMinutes * 60;
      return {
        ...prev,
        isActive: true,
        isPaused: false,
        durationMinutes: prev.durationMinutes + extraMinutes,
        totalInitialSeconds: prev.totalInitialSeconds + extraSec,
        remainingSeconds: prev.remainingSeconds + extraSec,
        endTime: prev.endTime + extraSec * 1000,
      };
    });
    setIsOverclockTimeoutOpen(false);
    addHistory('overclock_start', `Adicionou +${extraMinutes} min ao Overclock Mode`);
  };

  // Sync current player bundle to storage for 4-digit ID persistence (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const bundle: PlayerDataBundle = {
        id: currentPlayerId,
        profile,
        tasks,
        title,
        notes,
        history,
        updatedAt: Date.now(),
      };
      savePlayerBundle(bundle);
    }, 400);

    return () => clearTimeout(timer);
  }, [currentPlayerId, profile, tasks, title, notes, history]);

  const handleLoadPlayerBundle = (bundle: PlayerDataBundle) => {
    setCurrentPlayerId(bundle.id);
    saveCurrentPlayerId(bundle.id);
    if (bundle.profile) {
      setProfile(bundle.profile);
      saveStoredProfile(bundle.profile);
    }
    if (bundle.tasks) {
      setTasks(bundle.tasks);
      saveStoredTasks(bundle.tasks);
    }
    if (bundle.title) {
      setTitle(bundle.title);
      saveStoredTitle(bundle.title);
    }
    if (bundle.notes !== undefined) {
      setNotes(bundle.notes);
      saveStoredNotes(bundle.notes);
    }
    if (bundle.history) {
      setHistory(bundle.history);
      saveStoredHistory(bundle.history);
    }
    addHistory('ai_generated', `Carregou perfil do Jogador #${bundle.id}`);
  };

  const handleGenerateNewPlayerId = () => {
    const newId = generateRandomPlayerId();
    const newBundle: PlayerDataBundle = {
      id: newId,
      profile: {
        name: `Jogador #${newId}`,
        profession: 'Especialista em Alta Performance',
        photo: '',
        communityUrl: 'https://overclock.com.br',
      },
      tasks: [
        {
          id: 't1',
          text: 'Definir as 3 metas essenciais da sessão',
          done: false,
          createdAt: Date.now(),
          completedAt: null,
          priority: true,
        },
        {
          id: 't2',
          text: 'Executar sprint de hiperfoco no modo Overclock',
          done: false,
          createdAt: Date.now(),
          completedAt: null,
        },
        {
          id: 't3',
          text: 'Utilizar os atalhos de IA (Claude, Gemini, DeepSeek, ChatGPT)',
          done: false,
          createdAt: Date.now(),
          completedAt: null,
        },
      ],
      title: `Missões do Jogador #${newId}`,
      notes: `Anotações estratégicas do Jogador #${newId}...`,
      history: [
        {
          id: 'h1',
          type: 'added',
          text: `Conta do Jogador #${newId} iniciada`,
          at: Date.now(),
        },
      ],
      updatedAt: Date.now(),
    };
    handleLoadPlayerBundle(newBundle);
  };

  // Task operations
  const handleAddTask = (text: string, isPriority?: boolean) => {
    const newItem: TaskItem = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      text,
      done: false,
      createdAt: Date.now(),
      completedAt: null,
      priority: isPriority,
    };

    setTasks((prev) => {
      const updated = isPriority ? [newItem, ...prev] : [...prev, newItem];
      saveStoredTasks(updated);
      return updated;
    });

    addHistory('added', `Criou "${text}"`);
  };

  const handleAddMultipleTasks = (newItems: { text: string; isPriority?: boolean }[]) => {
    const created: TaskItem[] = newItems.map((item) => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      text: item.text,
      done: false,
      createdAt: Date.now(),
      completedAt: null,
      priority: item.isPriority,
    }));

    setTasks((prev) => {
      const updated = [...created, ...prev];
      saveStoredTasks(updated);
      return updated;
    });

    addHistory('ai_generated', `Adicionou ${newItems.length} tarefas geradas por IA`);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === id) {
          const nextDone = !t.done;
          return {
            ...t,
            done: nextDone,
            completedAt: nextDone ? Date.now() : null,
          };
        }
        return t;
      });
      saveStoredTasks(updated);

      const target = updated.find((t) => t.id === id);
      if (target) {
        addHistory(
          target.done ? 'done' : 'undone',
          (target.done ? 'Concluiu "' : 'Reabriu "') + target.text + '"'
        );
      }

      // If in Overclock Mode and all tasks are completed now
      if (overclockSession?.isActive) {
        const remainingPending = updated.filter((t) => !t.done).length;
        if (remainingPending === 0 && updated.length > 0) {
          setIsOverclockVictoryOpen(true);
        }
      }

      return updated;
    });
  };

  const handleDeleteTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveStoredTasks(updated);
      return updated;
    });

    if (target) {
      addHistory('deleted', `Removeu "${target.text}"`);
    }
  };

  const handleEditTask = (id: string, newText: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, text: newText } : t));
      saveStoredTasks(updated);
      return updated;
    });
    addHistory('renamed', `Renomeou tarefa para "${newText}"`);
  };

  const handleClearCompleted = () => {
    const doneCount = tasks.filter((t) => t.done).length;
    setTasks((prev) => {
      const updated = prev.filter((t) => !t.done);
      saveStoredTasks(updated);
      return updated;
    });
    if (doneCount > 0) {
      addHistory('deleted', `Limpou ${doneCount} tarefas concluídas`);
    }
  };

  const handleReorderTasks = (newTasks: TaskItem[]) => {
    setTasks(newTasks);
    saveStoredTasks(newTasks);
  };

  // Title operations
  const handleUpdateTitle = (newTitle: string) => {
    setTitle(newTitle);
    saveStoredTitle(newTitle);
    addHistory('renamed', `Renomeou lista para "${newTitle}"`);
  };

  // Profile operations
  const handleUpdateProfile = (updated: Partial<ProfileData>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      saveStoredProfile(next);
      return next;
    });
  };

  const handleApplyAvatarFromAI = (photoUrl: string) => {
    handleUpdateProfile({ photo: photoUrl });
    addHistory('ai_generated', 'Definiu novo avatar gerado por IA');
  };

  // Notes
  const handleSaveNotes = (val: string) => {
    setNotes(val);
    saveStoredNotes(val);
  };

  // AI Gallery
  const handleAddToGallery = (record: GeneratedImageRecord) => {
    setGallery((prev) => {
      const updated = [record, ...prev];
      saveStoredAIGallery(updated);
      return updated;
    });
  };

  // Clear History
  const handleClearHistory = () => {
    setHistory([]);
    saveStoredHistory([]);
  };

  // Extract side boxes from boxOrder (profile, ai_shortcuts, performance) - history is now a top header button
  const defaultSideBoxes: WidgetBoxId[] = ['profile', 'ai_shortcuts', 'performance'];
  const sideBoxIds: WidgetBoxId[] = (() => {
    const filtered = boxOrder.filter((id) => id !== 'checklist' && id !== 'history');
    const valid = filtered.filter((id) => defaultSideBoxes.includes(id));
    defaultSideBoxes.forEach((b) => {
      if (!valid.includes(b)) valid.push(b);
    });
    return valid;
  })();

  // Widget box reordering for the vertical sidebar stack
  const handleMoveBox = (id: WidgetBoxId, direction: 'up' | 'down') => {
    const currentList = [...sideBoxIds];
    const idx = currentList.indexOf(id);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentList.length) return;

    const [moved] = currentList.splice(idx, 1);
    currentList.splice(targetIdx, 0, moved);
    const newOrder: WidgetBoxId[] = ['checklist', ...currentList];
    setBoxOrder(newOrder);
    saveStoredBoxOrder(newOrder);
  };

  const handleBoxDragStart = (id: WidgetBoxId) => {
    setDraggedBoxId(id);
  };

  const handleBoxDragOver = (e: React.DragEvent, targetId: WidgetBoxId) => {
    e.preventDefault();
    if (!draggedBoxId || draggedBoxId === targetId || draggedBoxId === 'checklist' || targetId === 'checklist') return;

    const currentList = [...sideBoxIds];
    const sourceIdx = currentList.indexOf(draggedBoxId);
    const targetIdx = currentList.indexOf(targetId);

    if (sourceIdx < 0 || targetIdx < 0) return;

    const [moved] = currentList.splice(sourceIdx, 1);
    currentList.splice(targetIdx, 0, moved);
    const newOrder: WidgetBoxId[] = ['checklist', ...currentList];
    setBoxOrder(newOrder);
    saveStoredBoxOrder(newOrder);
  };

  const handleBoxDragEnd = () => {
    setDraggedBoxId(null);
  };

  const isOverclockActive = Boolean(overclockSession?.isActive);

  // Format Overclock Remaining string for Header
  const formatOverclockTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderSideWidget = (boxId: WidgetBoxId, idx: number) => {
    const canMoveUp = isEditLayoutMode && idx > 0;
    const canMoveDown = isEditLayoutMode && idx < sideBoxIds.length - 1;

    switch (boxId) {
      case 'profile':
        return (
          <ProfileWidget
            key="profile"
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onOpenAIStudio={() => setIsAIStudioOpen(true)}
            currentPlayerId={currentPlayerId}
            onOpenPlayerIDModal={() => setIsPlayerIDModalOpen(true)}
            isEditLayoutMode={isEditLayoutMode}
            onDragStart={() => handleBoxDragStart('profile')}
            onDragOver={(e) => handleBoxDragOver(e, 'profile')}
            onDragEnd={handleBoxDragEnd}
            isOverclockActive={isOverclockActive}
            onMoveUp={canMoveUp ? () => handleMoveBox('profile', 'up') : undefined}
            onMoveDown={canMoveDown ? () => handleMoveBox('profile', 'down') : undefined}
          />
        );

      case 'ai_shortcuts':
        return (
          <AIShortcutsWidget
            key="ai_shortcuts"
            isEditLayoutMode={isEditLayoutMode}
            onDragStart={() => handleBoxDragStart('ai_shortcuts')}
            onDragOver={(e) => handleBoxDragOver(e, 'ai_shortcuts')}
            onDragEnd={handleBoxDragEnd}
            isOverclockActive={isOverclockActive}
            onMoveUp={canMoveUp ? () => handleMoveBox('ai_shortcuts', 'up') : undefined}
            onMoveDown={canMoveDown ? () => handleMoveBox('ai_shortcuts', 'down') : undefined}
          />
        );

      case 'performance':
        return (
          <PerformanceWidget
            key="performance"
            tasks={tasks}
            isEditLayoutMode={isEditLayoutMode}
            onDragStart={() => handleBoxDragStart('performance')}
            onDragOver={(e) => handleBoxDragOver(e, 'performance')}
            onDragEnd={handleBoxDragEnd}
            isOverclockActive={isOverclockActive}
            onMoveUp={canMoveUp ? () => handleMoveBox('performance', 'up') : undefined}
            onMoveDown={canMoveDown ? () => handleMoveBox('performance', 'down') : undefined}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden flex justify-center py-10 pb-28 sm:pb-36 px-4 sm:px-6 transition-colors duration-700 ${
        isOverclockActive ? 'bg-[#080204]' : 'bg-[#090a0d]'
      }`}
    >
      {/* Background Glow */}
      <div className={isOverclockActive ? 'overclock-glow' : 'ambient-glow'} />

      {/* Main Container */}
      <div className="w-full max-w-5xl relative z-10">
        <Header
          onOpenNotes={() => setIsNotesOpen(true)}
          onOpenAIStudio={() => setIsAIStudioOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenWelcome={() => setIsWelcomeOpen(true)}
          historyCount={history.length}
          isEditLayoutMode={isEditLayoutMode}
          onToggleEditLayout={() => setIsEditLayoutMode(!isEditLayoutMode)}
          deferredPrompt={deferredPrompt}
          onInstallApp={handleInstallApp}
          isOverclockActive={isOverclockActive}
          overclockRemainingFormatted={
            overclockSession ? formatOverclockTime(overclockSession.remainingSeconds) : undefined
          }
          onOpenOverclock={() => setIsOverclockSetupOpen(true)}
        />

        {/* Active Overclock Timer HUD Bar */}
        {overclockSession && overclockSession.isActive && (
          <div className="mb-6">
            <OverclockTimerBar
              session={overclockSession}
              onPauseToggle={handlePauseOverclock}
              onAddMinutes={handleExtendOverclock}
              onCancelSession={handleStopOverclock}
              totalTasks={tasks.length}
              completedTasks={tasks.filter((t) => t.done).length}
              pendingTasks={tasks.filter((t) => !t.done).length}
              userName={profile.name}
            />
          </div>
        )}

        {/* 2-Column Fixed Stack Layout: Checklist on left, Side Widgets fixed one below another on right */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* Main Checklist Card (Left Column) */}
          <div className="w-full lg:flex-1 min-w-0">
            <ChecklistCard
              title={title}
              onUpdateTitle={handleUpdateTitle}
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              onClearCompleted={handleClearCompleted}
              onReorderTasks={handleReorderTasks}
              onOpenQuickBreakdown={() => setIsQuickBreakdownOpen(true)}
              userName={profile.name}
              onTriggerCelebration={() => setIsCelebrationOpen(true)}
              isEditLayoutMode={isEditLayoutMode}
              isOverclockActive={isOverclockActive}
            />
          </div>

          {/* Side Column: Profile and Performance stacked neatly */}
          <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-5">
            {sideBoxIds.map((boxId, idx) => renderSideWidget(boxId, idx))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-[#8b8e97] mt-10 pb-4 tracking-wide">
          Criado com dedicação por{' '}
          <strong
            className={`font-semibold transition-colors ${
              isOverclockActive ? 'text-[#ff5252]' : 'text-[#f3f2ee]'
            }`}
          >
            Marcio Lira
          </strong>{' '}
          — Overclock Web System
        </footer>
      </div>

      {/* Overclock Sprint Setup Modal */}
      <OverclockSetupModal
        isOpen={isOverclockSetupOpen}
        onClose={() => setIsOverclockSetupOpen(false)}
        onStartOverclock={handleStartOverclock}
        pendingTasksCount={tasks.filter((t) => !t.done).length}
        userName={profile.name}
      />

      {/* Overclock Time-Up Alert Modal ("você ainda tem tempo, nao pare faca acontecer") */}
      <OverclockTimeoutModal
        isOpen={isOverclockTimeoutOpen}
        onClose={() => setIsOverclockTimeoutOpen(false)}
        onAddMinutes={handleExtendOverclock}
        onFinishOverclock={handleStopOverclock}
        userName={profile.name}
        pendingTasksCount={tasks.filter((t) => !t.done).length}
      />

      {/* Overclock Victory Modal ("Parabéns campeão, mais uma meta batida, você e foda !") */}
      <OverclockVictoryModal
        isOpen={isOverclockVictoryOpen}
        onClose={() => setIsOverclockVictoryOpen(false)}
        userName={profile.name}
        totalCompleted={tasks.filter((t) => t.done).length}
        remainingTimeFormatted={
          overclockSession ? formatOverclockTime(overclockSession.remainingSeconds) : undefined
        }
        onStartNewSprint={() => setIsOverclockSetupOpen(true)}
      />

      {/* Welcome Greeting Dialog Box on App Opening */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        userName={profile.name}
        userTitle={profile.title}
        pendingTasksCount={tasks.filter((t) => !t.done).length}
        totalTasksCount={tasks.length}
        onStartOverclock={() => setIsOverclockSetupOpen(true)}
        isOverclockActive={isOverclockActive}
      />

      {/* Activity History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        isOverclockActive={isOverclockActive}
      />

      {/* 4-Digit Player ID Management Modal */}
      <PlayerIDModal
        isOpen={isPlayerIDModalOpen}
        onClose={() => setIsPlayerIDModalOpen(false)}
        currentPlayerId={currentPlayerId}
        onLoadPlayerBundle={handleLoadPlayerBundle}
        onGenerateNewPlayerId={handleGenerateNewPlayerId}
        currentProfile={profile}
        currentTasks={tasks}
        currentTitle={title}
        currentNotes={notes}
        currentHistory={history}
        isOverclockActive={isOverclockActive}
      />

      {/* Standard Modals */}
      <NotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        notes={notes}
        onSaveNotes={handleSaveNotes}
        tasks={tasks}
      />

      <AIStudioModal
        isOpen={isAIStudioOpen}
        onClose={() => setIsAIStudioOpen(false)}
        onApplyAvatar={handleApplyAvatarFromAI}
        onAddMultipleTasks={handleAddMultipleTasks}
        currentTasks={tasks}
        gallery={gallery}
        onAddToGallery={handleAddToGallery}
      />

      <AIQuickBreakdownModal
        isOpen={isQuickBreakdownOpen}
        onClose={() => setIsQuickBreakdownOpen(false)}
        onAddMultipleTasks={handleAddMultipleTasks}
        currentTasks={tasks}
      />

      <CelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        userName={profile.name}
        totalCompleted={tasks.filter((t) => t.done).length}
        onAddNewGoal={() => setIsQuickBreakdownOpen(true)}
      />

      {/* MacOS Floating Bottom AI Dock & Notes */}
      <MacDock
        notes={notes}
        onSaveNotes={handleSaveNotes}
        onOpenFullNotes={() => setIsNotesOpen(true)}
        onStartOverclock={() => setIsOverclockSetupOpen(true)}
        onOpenAIStudio={() => setIsAIStudioOpen(true)}
        isOverclockActive={isOverclockActive}
        tasks={tasks}
      />
    </div>
  );
}

