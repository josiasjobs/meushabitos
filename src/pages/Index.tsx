
import React, { useState, useEffect } from 'react';
import { Habit, HabitHistory } from '@/types/habit';
import { 
  getHabits, 
  saveHabits, 
  getHistory, 
  saveHistory, 
  getTodayDate 
} from '@/utils/habitStorage';
import Layout from '@/components/Layout';
import HabitsView from '@/components/HabitsView';
import AddHabitView from '@/components/AddHabitView';
import ManageHabitsView from '@/components/ManageHabitsView';
import EditHabitView from '@/components/EditHabitView';
import HistoryView from '@/components/HistoryView';
import Notification from '@/components/Notification';

type View = 'habits' | 'add' | 'manage' | 'edit' | 'history';

interface NotificationState {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [history, setHistory] = useState<HabitHistory[]>([]);
  const [currentView, setCurrentView] = useState<View>('habits');
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'success',
    visible: false
  });

  useEffect(() => {
    setHabits(getHabits());
    setHistory(getHistory());
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type, visible: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const toggleHabit = (habit: Habit) => {
    const today = getTodayDate();
    const newHabits = habits.map(h => {
      if (h.id === habit.id) {
        const isCompleted = h.lastDoneDate === today;
        
        if (isCompleted) {
          // Remove from history
          const newHistory = history.filter(item => 
            !(item.habitId === habit.id && item.date.startsWith(new Date().toLocaleDateString('pt-BR')))
          );
          setHistory(newHistory);
          saveHistory(newHistory);
          
          showNotification(`"${habit.name}" desmarcado!`);
          return { ...h, lastDoneDate: undefined };
        } else {
          // Add to history
          const historyItem: HabitHistory = {
            id: Date.now().toString(),
            habitId: habit.id,
            habitName: habit.name,
            date: new Date().toISOString(),
            completed: true
          };
          
          const newHistory = [historyItem, ...history];
          setHistory(newHistory);
          saveHistory(newHistory);
          
          showNotification(`✅ "${habit.name}" concluído!`);
          return { ...h, lastDoneDate: today };
        }
      }
      return h;
    });
    
    setHabits(newHabits);
    saveHabits(newHabits);
  };

  const addHabit = (name: string, days: number[]) => {
    // Check for duplicates
    const existingHabit = habits.find(h => 
      h.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingHabit) {
      showNotification(`❌ Hábito duplicado! Já existe "${existingHabit.name}"`, 'error');
      return;
    }
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      days,
      createdAt: new Date().toISOString()
    };
    
    const newHabits = [...habits, newHabit];
    setHabits(newHabits);
    saveHabits(newHabits);
    
    // Removed notification for habit creation
    setCurrentView('habits');
  };

  const editHabit = (id: string, name: string, days: number[]) => {
    // Check for duplicates (excluding current habit)
    const existingHabit = habits.find(h => 
      h.id !== id && h.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingHabit) {
      showNotification(`❌ Nome duplicado! Já existe "${existingHabit.name}"`, 'error');
      return;
    }
    
    const newHabits = habits.map(h => 
      h.id === id ? { ...h, name, days } : h
    );
    
    setHabits(newHabits);
    saveHabits(newHabits);
    
    showNotification(`✅ Hábito "${name}" atualizado!`);
    setCurrentView('manage');
  };

  const deleteHabit = (habit: Habit) => {
    const confirmed = window.confirm(
      `❌ Excluir hábito?\n\n"${habit.name}"\n\nEsta ação não pode ser desfeita.`
    );
    
    if (confirmed) {
      const newHabits = habits.filter(h => h.id !== habit.id);
      setHabits(newHabits);
      saveHabits(newHabits);
      
      // Also remove from history
      const newHistory = history.filter(item => item.habitId !== habit.id);
      setHistory(newHistory);
      saveHistory(newHistory);
      
      showNotification(`🗑️ Hábito "${habit.name}" excluído!`);
    }
  };

  const startEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setCurrentView('edit');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'add':
        return (
          <AddHabitView
            onSave={addHabit}
            onCancel={() => setCurrentView('habits')}
          />
        );
      
      case 'manage':
        return (
          <ManageHabitsView
            habits={habits}
            onBack={() => setCurrentView('habits')}
            onAddHabit={() => setCurrentView('add')}
            onEditHabit={startEditHabit}
            onDeleteHabit={deleteHabit}
            onToggleHabit={toggleHabit}
          />
        );
      
      case 'edit':
        return editingHabit ? (
          <EditHabitView
            habit={editingHabit}
            onSave={editHabit}
            onCancel={() => setCurrentView('manage')}
          />
        ) : null;
      
      case 'history':
        return (
          <HistoryView
            history={history}
            onBack={() => setCurrentView('habits')}
          />
        );
      
      default:
        return (
          <HabitsView
            habits={habits}
            onToggleHabit={toggleHabit}
            onAddHabit={() => setCurrentView('add')}
            onManageHabits={() => setCurrentView('manage')}
            onShowHistory={() => setCurrentView('history')}
          />
        );
    }
  };

  return (
    <Layout>
      {renderCurrentView()}
      
      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
    </Layout>
  );
};

export default Index;
