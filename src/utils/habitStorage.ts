import { Habit, HabitHistory } from '@/types/habit';

const STORAGE_KEY = 'habit-pathfinder-data';

export interface StorageData {
  habits: Habit[];
  history: HabitHistory[];
  version: string;
}

const defaultData: StorageData = {
  habits: [],
  history: [],
  version: '1.0'
};

export function loadFromStorage(): StorageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading from storage:', error);
  }
  return defaultData;
}

export function saveToStorage(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('💾 Dados salvos:', {
      habits: data.habits.length,
      history: data.history.length
    });
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
}

export function getHabits(): Habit[] {
  return loadFromStorage().habits;
}

export function saveHabits(habits: Habit[]): void {
  const data = loadFromStorage();
  data.habits = habits;
  saveToStorage(data);
}

export function getHistory(): HabitHistory[] {
  return loadFromStorage().history;
}

export function saveHistory(history: HabitHistory[]): void {
  const data = loadFromStorage();
  data.history = history;
  saveToStorage(data);
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getTodayDay(): number {
  return new Date().getDay();
}
