
import React from 'react';
import { Habit } from '@/types/habit';
import { getTodayDate } from '@/utils/habitStorage';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habit: Habit) => void;
  showActions?: boolean;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habit: Habit) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  onToggle, 
  showActions = false,
  onEdit,
  onDelete 
}) => {
  const isCompletedToday = habit.lastDoneDate === getTodayDate();
  
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  return (
    <div
      className={cn(
        "card-gradient rounded-xl p-6 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20",
        isCompletedToday && "opacity-70"
      )}
    >
      <div className="flex items-start justify-between">
        <label className="flex items-center cursor-pointer flex-1">
          <input
            type="checkbox"
            checked={isCompletedToday}
            onChange={() => onToggle(habit)}
            className="sr-only"
          />
          <div className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 mr-4",
            isCompletedToday 
              ? "bg-green-500 border-green-500" 
              : "border-purple-400 hover:border-purple-500"
          )}>
            {isCompletedToday && (
              <span className="text-white text-sm">✓</span>
            )}
          </div>
          <div className="flex-1">
            <h3 className={cn(
              "text-lg font-medium transition-all duration-300",
              isCompletedToday ? "line-through text-gray-500" : "text-gray-800"
            )}>
              {habit.name}
            </h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {habit.days.map(day => (
                <span
                  key={day}
                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                >
                  {dayNames[day]}
                </span>
              ))}
            </div>
          </div>
        </label>
        
        {showActions && (
          <div className="flex gap-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(habit)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="Editar"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(habit)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Excluir"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitCard;
