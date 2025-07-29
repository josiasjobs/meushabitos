
import React from 'react';
import { Habit } from '@/types/habit';
import { getTodayDay } from '@/utils/habitStorage';
import HabitCard from './HabitCard';
import PWAInstallButton from './PWAInstallButton';
import Footer from './Footer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className="flex flex-col h-full overflow-hidden animate-slide-up">
      {/* Header fixo */}
      <div className="flex-shrink-0 text-center mb-6">
        <h1 className="text-3xl font-light text-white mb-4">
          Meus Hábitos
        </h1>
        
        {/* Botões centralizados */}
        <div className="flex justify-center gap-3 flex-wrap">
          <Button
            variant="default"
            size="icon"
            onClick={onAddHabit}
            title="Novo Hábito"
            className="gradient-primary text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ➕
          </Button>
          
          <Button
            variant="default"
            size="icon"
            onClick={onManageHabits}
            title="Gerenciar Hábitos"
            className="gradient-primary text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ⚙️
          </Button>
          
          <Button
            variant="default"
            size="icon"
            onClick={onShowHistory}
            title="Ver Histórico"
            className="gradient-primary text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            📜
          </Button>
          
          <PWAInstallButton />
        </div>
      </div>
      
      {/* Lista de tarefas com scroll controlado */}
      <div className="flex-1 overflow-hidden mb-6">
        <ScrollArea className="h-full w-full">
          <div className="space-y-4 pr-2">
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
                  showDays={false}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Footer fixo */}
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  );
};

export default HabitsView;
