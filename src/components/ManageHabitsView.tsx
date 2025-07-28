
import React from 'react';
import { Habit } from '@/types/habit';
import Header from './Header';
import HabitCard from './HabitCard';

interface ManageHabitsViewProps {
  habits: Habit[];
  onBack: () => void;
  onAddHabit: () => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habit: Habit) => void;
  onToggleHabit: (habit: Habit) => void;
}

const ManageHabitsView: React.FC<ManageHabitsViewProps> = ({
  habits,
  onBack,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
  onToggleHabit
}) => {
  return (
    <div className="animate-slide-up">
      <Header
        title="Gerenciar Hábitos"
        leftButton={{
          icon: "←",
          onClick: onBack,
          title: "Voltar"
        }}
        rightButton={{
          icon: "➕",
          onClick: onAddHabit,
          title: "Novo Hábito"
        }}
      />
      
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="card-gradient rounded-xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              Nenhum hábito cadastrado
            </h3>
            <p className="text-gray-600 mb-4">
              Clique em ➕ para adicionar seu primeiro hábito!
            </p>
          </div>
        ) : (
          habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={onToggleHabit}
              showActions
              onEdit={onEditHabit}
              onDelete={onDeleteHabit}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ManageHabitsView;
