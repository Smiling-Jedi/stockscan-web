import { AnalysisRecord } from '@/types';

const STORAGE_KEY = 'stockscan_history';

export function getHistory(): AnalysisRecord[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addRecord(record: AnalysisRecord): void {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  history.unshift(record);
  // Keep last 100 records
  const trimmed = history.slice(0, 100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function deleteRecord(id: string): void {
  if (typeof window === 'undefined') return;
  const history = getHistory().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
