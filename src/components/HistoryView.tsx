
import React from 'react';
import { HabitHistory } from '@/types/habit';
import Header from './Header';

interface HistoryViewProps {
  history: HabitHistory[];
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onBack }) => {
  return (
    <div className="animate-slide-up">
      <Header
        title="Histórico"
        leftButton={{
          icon: "←",
          onClick: onBack,
          title: "Voltar"
        }}
      />
      
      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="card-gradient rounded-xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              Nenhuma atividade registrada
            </h3>
            <p className="text-gray-600">
              Complete seus primeiros hábitos para ver o histórico!
            </p>
          </div>
        ) : (
          history.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="card-gradient rounded-lg p-4 shadow-md border-l-4 border-green-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">
                    {item.habitName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {new Date(item.date).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-green-500 text-xl">
                  ✓
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryView;
