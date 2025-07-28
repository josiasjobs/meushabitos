
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Habit } from '@/types/habit';
import Header from './Header';
import { cn } from '@/lib/utils';

interface EditHabitViewProps {
  habit: Habit;
  onSave: (id: string, name: string, days: number[]) => void;
  onCancel: () => void;
}

const EditHabitView: React.FC<EditHabitViewProps> = ({ 
  habit, 
  onSave, 
  onCancel 
}) => {
  const [name, setName] = useState(habit.name);
  const [selectedDays, setSelectedDays] = useState<number[]>(habit.days);

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const handleDayToggle = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSave = () => {
    if (name.trim() && selectedDays.length > 0) {
      onSave(habit.id, name.trim(), selectedDays);
    }
  };

  return (
    <div className="animate-slide-up">
      <Header
        title="Editar Hábito"
        leftButton={{
          icon: "✕",
          onClick: onCancel,
          title: "Cancelar",
          variant: "destructive"
        }}
        rightButton={{
          icon: "✓",
          onClick: handleSave,
          title: "Salvar"
        }}
      />
      
      <div className="card-gradient rounded-xl p-6 shadow-lg space-y-6">
        <div className="space-y-2">
          <Label htmlFor="edit-habit-name" className="text-gray-700 font-medium">
            Nome do hábito
          </Label>
          <Input
            id="edit-habit-name"
            type="text"
            placeholder="Nome do hábito"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
          />
        </div>
        
        <div className="space-y-4">
          <Label className="text-gray-700 font-medium">
            Dias da semana
          </Label>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
            {dayNames.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDayToggle(index)}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium",
                  selectedDays.includes(index)
                    ? "gradient-primary text-white border-purple-400"
                    : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSave}
            disabled={!name.trim() || selectedDays.length === 0}
            className="flex-1 gradient-primary text-white hover:opacity-90 transition-all duration-300"
          >
            Salvar Alterações
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditHabitView;
