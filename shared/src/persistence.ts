import { emptyProgress, parseProgress, type Progress } from '../../progress/src/profile.js';

export interface DesktopProgressBridge {
  loadProgress(): Promise<unknown>;
  saveProgress(progress: Progress): Promise<void>;
}

declare global {
  interface Window {
    desktopProgress?: DesktopProgressBridge;
  }
}

const PREVIEW_KEY = 'hiragana-aero-exploration-preview-v1';

export async function loadProgress(): Promise<Progress> {
  if (window.desktopProgress) return parseProgress(await window.desktopProgress.loadProgress());
  const stored = window.localStorage.getItem(PREVIEW_KEY);
  return stored === null ? emptyProgress() : parseProgress(JSON.parse(stored) as unknown);
}

export async function saveProgress(progress: Progress): Promise<void> {
  if (window.desktopProgress) {
    await window.desktopProgress.saveProgress(progress);
    return;
  }
  window.localStorage.setItem(PREVIEW_KEY, JSON.stringify(progress));
}
