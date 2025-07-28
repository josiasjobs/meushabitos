
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        "fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-full text-white font-medium shadow-lg animate-slide-down",
        type === 'success' ? "gradient-success" : "gradient-error"
      )}
    >
      <div className="flex items-center gap-2">
        <span>{type === 'success' ? '✅' : '❌'}</span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Notification;
