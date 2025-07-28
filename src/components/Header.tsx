
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  leftButton?: {
    icon: string;
    onClick: () => void;
    title: string;
    variant?: 'default' | 'destructive';
  };
  rightButton?: {
    icon: string;
    onClick: () => void;
    title: string;
  };
  rightButtons?: Array<{
    icon: string;
    onClick: () => void;
    title: string;
  }>;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  leftButton, 
  rightButton, 
  rightButtons 
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="w-12">
        {leftButton && (
          <Button
            variant={leftButton.variant === 'destructive' ? 'destructive' : 'default'}
            size="icon"
            onClick={leftButton.onClick}
            title={leftButton.title}
            className="gradient-primary text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {leftButton.icon}
          </Button>
        )}
      </div>
      
      <h1 className="text-2xl font-light text-white text-center flex-1">
        {title}
      </h1>
      
      <div className="flex gap-2">
        {rightButton && (
          <Button
            variant="default"
            size="icon"
            onClick={rightButton.onClick}
            title={rightButton.title}
            className="gradient-primary text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {rightButton.icon}
          </Button>
        )}
        {rightButtons?.map((button, index) => (
          <Button
            key={index}
            variant="default"
            size="icon"
            onClick={button.onClick}
            title={button.title}
            className="gradient-primary text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {button.icon}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Header;
