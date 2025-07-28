
export interface Habit {
  id: string;
  name: string;
  days: number[]; // 0 = Sunday, 6 = Saturday
  lastDoneDate?: string;
  createdAt: string;
}

export interface HabitHistory {
  id: string;
  habitId: string;
  habitName: string;
  date: string;
  completed: boolean;
}

export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  streak: number;
}
