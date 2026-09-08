import { STORAGE_KEYS } from '@/constants';

function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to remove from localStorage', e);
  }
}

function clearAll(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    console.error('Failed to clear localStorage', e);
  }
}

export const storage = {
  getItem,
  setItem,
  removeItem,
  clearAll,
};
