export interface TaskItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
  completedAt: number | null;
  priority?: boolean;
}

export type HistoryActionType =
  | 'added'
  | 'done'
  | 'undone'
  | 'deleted'
  | 'renamed'
  | 'ai_generated'
  | 'reordered'
  | 'overclock_start';

export interface HistoryEntry {
  id: string;
  type: HistoryActionType;
  text: string;
  at: number;
}

export interface ProfileData {
  name: string;
  profession: string;
  photo?: string;
  communityUrl?: string;
}

export type ImageModelType = 'gemini-3-pro-image-preview' | 'gemini-3.1-flash-image-preview';

export type AspectRatioType =
  | '1:1'
  | '2:3'
  | '3:2'
  | '3:4'
  | '4:3'
  | '9:16'
  | '16:9'
  | '21:9';

export type ImageSizeType = '1K' | '2K' | '4K' | '512px';

export interface GeneratedImageRecord {
  id: string;
  url: string;
  prompt: string;
  model: ImageModelType;
  aspectRatio: AspectRatioType;
  imageSize: ImageSizeType;
  createdAt: number;
}

export type WidgetBoxId = 'checklist' | 'performance' | 'profile' | 'history' | 'ai_shortcuts';

export interface PlayerDataBundle {
  id: string; // 4 digits e.g. "4829"
  profile: ProfileData;
  tasks: TaskItem[];
  title: string;
  notes: string;
  history: HistoryEntry[];
  updatedAt: number;
}

export interface OverclockSession {
  isActive: boolean;
  durationMinutes: number;
  startTime: number;
  endTime: number;
  isPaused: boolean;
  remainingSeconds: number;
  totalInitialSeconds: number;
  initialPendingCount: number;
}
