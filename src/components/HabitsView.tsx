
import React from 'react';
import { Habit } from '@/types/habit';
import { getTodayDay } from '@/utils/habitStorage';
import Header from './Header';
import HabitCard from './HabitCard';

interface HabitsViewProps {
  habits: Habit[];
  onToggleHabit: (habit: Habit) => void;
  onAddHabit: () => void;
  onManageHabits: () => void;
  onShowHistory: () => void;
}

const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  onToggleHabit,
  onAddHabit,
  onManageHabits,
  onShowHistory
}) => {
  const today = getTodayDay();
  const todayHabits = habits.filter(habit => habit.days.includes(today));

  return (
    <div className="animate-slide-up">
      <Header
        title="Hábitos de Hoje"
        rightButton={{
          icon: "➕",
          onClick: onAddHabit,
          title: "Novo Hábito"
        }}
        rightButtons={[
          {
            icon: "⚙️",
            onClick: onManageHabits,
            title: "Gerenciar Hábitos"
          },
          {
            icon: "📜",
            onClick: onShowHistory,
            title: "Ver Histórico"
          }
        ]}
      />
      
      <div className="space-y-4">
        {todayHabits.length === 0 ? (
          <div className="card-gradient rounded-xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              Nenhum hábito para hoje!
            </h3>
            <p className="text-gray-600">
              Aproveite seu dia livre ou adicione novos hábitos!
            </p>
          </div>
        ) : (
          todayHabits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={onToggleHabit}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HabitsView;
