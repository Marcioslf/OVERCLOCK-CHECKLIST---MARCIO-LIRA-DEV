import { TaskItem, HistoryEntry, ProfileData, GeneratedImageRecord, WidgetBoxId, PlayerDataBundle } from '../types';

const KEYS = {
  ITEMS: 'checklist:items',
  TITLE: 'checklist:title',
  HISTORY: 'checklist:history',
  PROFILE: 'checklist:profile',
  NOTES: 'checklist:notes',
  BOX_ORDER: 'checklist:boxOrder',
  AI_GALLERY: 'checklist:ai_gallery',
  CURRENT_PLAYER_ID: 'checklist:current_player_id',
  PLAYER_PREFIX: 'checklist:player_data:',
  ALL_PLAYER_IDS: 'checklist:all_player_ids',
};

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e: any) {
    console.warn(`LocalStorage quota exceeded on '${key}'. Initiating cleanup...`, e);
    try {
      // 1. Clear or trim heavy AI gallery records
      localStorage.removeItem(KEYS.AI_GALLERY);

      // 2. Prune old player bundles (keep max 3 newest)
      const allIdsRaw = localStorage.getItem(KEYS.ALL_PLAYER_IDS);
      if (allIdsRaw) {
        try {
          const ids: string[] = JSON.parse(allIdsRaw);
          if (ids.length > 3) {
            const toRemove = ids.slice(0, ids.length - 3);
            const toKeep = ids.slice(ids.length - 3);
            toRemove.forEach((id) => {
              try {
                localStorage.removeItem(KEYS.PLAYER_PREFIX + id);
              } catch {
                // ignore
              }
            });
            localStorage.setItem(KEYS.ALL_PLAYER_IDS, JSON.stringify(toKeep));
          }
        } catch {
          // ignore
        }
      }

      // 3. Trim main history
      const historyRaw = localStorage.getItem(KEYS.HISTORY);
      if (historyRaw) {
        try {
          const parsed = JSON.parse(historyRaw);
          if (Array.isArray(parsed) && parsed.length > 10) {
            localStorage.setItem(KEYS.HISTORY, JSON.stringify(parsed.slice(0, 10)));
          }
        } catch {
          // ignore
        }
      }

      // Retry setItem
      localStorage.setItem(key, value);
      return true;
    } catch (retryErr) {
      console.warn(`Could not save key '${key}' to localStorage:`, retryErr);
      return false;
    }
  }
}

export const defaultProfile: ProfileData = {
  name: 'Comandante Overclock',
  profession: 'Especialista em Performance',
  photo: '',
  communityUrl: 'https://overclock.com.br',
};

export const defaultTasks: TaskItem[] = [
  {
    id: '1',
    text: 'Definir as 3 principais prioridades do dia',
    done: false,
    createdAt: Date.now() - 3600000 * 2,
    completedAt: null,
    priority: true,
  },
  {
    id: '2',
    text: 'Sessão de foco profundo de 50 minutos (Pomodoro)',
    done: false,
    createdAt: Date.now() - 3600000,
    completedAt: null,
  },
  {
    id: '3',
    text: 'Revisar notas e histórico de atividades',
    done: false,
    createdAt: Date.now() - 1800000,
    completedAt: null,
  },
];

export const defaultHistory: HistoryEntry[] = [
  {
    id: 'h1',
    type: 'added',
    text: 'Criou "Definir as 3 principais prioridades do dia"',
    at: Date.now() - 3600000 * 2,
  },
  {
    id: 'h2',
    type: 'added',
    text: 'Criou "Sessão de foco profundo de 50 minutos"',
    at: Date.now() - 3600000,
  },
];

export function getStoredTasks(): TaskItem[] {
  try {
    const raw = localStorage.getItem(KEYS.ITEMS);
    if (!raw) return defaultTasks;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultTasks;
  } catch (e) {
    console.error('Error loading tasks:', e);
    return defaultTasks;
  }
}

export function saveStoredTasks(tasks: TaskItem[]): void {
  safeSetItem(KEYS.ITEMS, JSON.stringify(tasks));
}

export function getStoredTitle(): string {
  try {
    return localStorage.getItem(KEYS.TITLE) || 'Minha Checklist';
  } catch {
    return 'Minha Checklist';
  }
}

export function saveStoredTitle(title: string): void {
  safeSetItem(KEYS.TITLE, title);
}

export function getStoredHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEYS.HISTORY);
    if (!raw) return defaultHistory;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultHistory;
  } catch {
    return defaultHistory;
  }
}

export function saveStoredHistory(history: HistoryEntry[]): void {
  safeSetItem(KEYS.HISTORY, JSON.stringify(history.slice(0, 30)));
}

export function getStoredProfile(): ProfileData {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    if (!raw) return defaultProfile;
    return { ...defaultProfile, ...JSON.parse(raw) };
  } catch {
    return defaultProfile;
  }
}

export function saveStoredProfile(profile: ProfileData): void {
  safeSetItem(KEYS.PROFILE, JSON.stringify(profile));
}

export function getStoredNotes(): string {
  try {
    return localStorage.getItem(KEYS.NOTES) || '';
  } catch {
    return '';
  }
}

export function saveStoredNotes(notes: string): void {
  safeSetItem(KEYS.NOTES, notes);
}

const DEFAULT_BOX_ORDER: WidgetBoxId[] = ['checklist', 'profile', 'ai_shortcuts', 'performance'];

export function getStoredBoxOrder(): WidgetBoxId[] {
  try {
    const raw = localStorage.getItem(KEYS.BOX_ORDER);
    if (!raw) return DEFAULT_BOX_ORDER;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_BOX_ORDER;
    
    // Ensure all 5 boxes exist
    const validBoxes: WidgetBoxId[] = ['checklist', 'profile', 'ai_shortcuts', 'performance', 'history'];
    const filtered = parsed.filter((id) => validBoxes.includes(id as WidgetBoxId)) as WidgetBoxId[];
    
    // Add missing boxes
    validBoxes.forEach((id) => {
      if (!filtered.includes(id)) filtered.push(id);
    });
    return filtered;
  } catch {
    return DEFAULT_BOX_ORDER;
  }
}

export function saveStoredBoxOrder(order: WidgetBoxId[]): void {
  safeSetItem(KEYS.BOX_ORDER, JSON.stringify(order));
}

// ----------------------------------------------------
// 4-Digit Player ID System
// ----------------------------------------------------

export function generateRandomPlayerId(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function getStoredCurrentPlayerId(): string {
  try {
    let id = localStorage.getItem(KEYS.CURRENT_PLAYER_ID);
    if (!id || id.length !== 4 || !/^\d{4}$/.test(id)) {
      id = generateRandomPlayerId();
      safeSetItem(KEYS.CURRENT_PLAYER_ID, id);
    }
    return id;
  } catch {
    return '1001';
  }
}

export function saveCurrentPlayerId(id: string): void {
  if (/^\d{4}$/.test(id)) {
    safeSetItem(KEYS.CURRENT_PLAYER_ID, id);
  }
}

export function getPlayerBundle(playerId: string): PlayerDataBundle | null {
  try {
    const raw = localStorage.getItem(KEYS.PLAYER_PREFIX + playerId);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error getting player bundle for ID:', playerId, e);
    return null;
  }
}

export function savePlayerBundle(bundle: PlayerDataBundle): void {
  try {
    // Sanitize bundle to avoid storing huge histories in multiple bundles
    const sanitizedBundle: PlayerDataBundle = {
      id: bundle.id,
      profile: bundle.profile,
      tasks: bundle.tasks,
      title: bundle.title,
      notes: bundle.notes?.slice(0, 5000) || '',
      history: bundle.history?.slice(0, 15) || [],
      updatedAt: bundle.updatedAt || Date.now(),
    };

    safeSetItem(KEYS.PLAYER_PREFIX + bundle.id, JSON.stringify(sanitizedBundle));
    
    // Also track in all saved IDs list
    const allIdsRaw = localStorage.getItem(KEYS.ALL_PLAYER_IDS);
    let ids: string[] = allIdsRaw ? JSON.parse(allIdsRaw) : [];
    if (!ids.includes(bundle.id)) {
      ids.push(bundle.id);
      if (ids.length > 5) {
        ids = ids.slice(ids.length - 5);
      }
      safeSetItem(KEYS.ALL_PLAYER_IDS, JSON.stringify(ids));
    }
  } catch (e) {
    console.error('Error saving player bundle:', e);
  }
}

export function getAllSavedPlayerBundles(): { id: string; name: string; profession: string; photo?: string; updatedAt: number }[] {
  try {
    const allIdsRaw = localStorage.getItem(KEYS.ALL_PLAYER_IDS);
    const ids: string[] = allIdsRaw ? JSON.parse(allIdsRaw) : [];
    const list: { id: string; name: string; profession: string; photo?: string; updatedAt: number }[] = [];
    
    for (const id of ids) {
      const b = getPlayerBundle(id);
      if (b) {
        list.push({
          id: b.id,
          name: b.profile?.name || `Jogador #${b.id}`,
          profession: b.profile?.profession || 'Membro Overclock',
          photo: b.profile?.photo,
          updatedAt: b.updatedAt || Date.now(),
        });
      }
    }
    return list;
  } catch {
    return [];
  }
}

export function getStoredAIGallery(): GeneratedImageRecord[] {
  try {
    const raw = localStorage.getItem(KEYS.AI_GALLERY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredAIGallery(gallery: GeneratedImageRecord[]): void {
  // Keep only the 6 latest images to prevent localStorage quota exhaustion
  safeSetItem(KEYS.AI_GALLERY, JSON.stringify(gallery.slice(0, 6)));
}

export function formatTimeAgo(ts: number): string {
  const diffSec = Math.floor((Date.now() - ts) / 1000);
  if (diffSec < 45) return 'agora mesmo';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `há ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `há ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'ontem';
  return `há ${diffD}d`;
}
