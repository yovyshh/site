"use client";

import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { StartIcon } from '@/components/icons/StartIcon';
import { RetroButton } from './RetroButton';
import type { WindowProps } from './SystemWindow'; // Assuming WindowProps will be defined here or imported
import { cn } from '@/lib/utils';

interface TaskbarProps {
  onStartClick: () => void;
  windows: WindowProps[]; // Simplified for now
  onTaskbarItemClick: (id: string) => void;
  activeWindowId?: string | null;
}

export function Taskbar({ onStartClick, windows, onTaskbarItemClick, activeWindowId }: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timerId = setInterval(updateClock, 1000 * 60); // Update every minute
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-card border-t-2 border-btn-highlight flex items-center px-1 z-50">
      <RetroButton onClick={onStartClick} className="h-full mr-2 flex items-center gap-1 !px-2">
        <StartIcon className="w-5 h-5" />
        <span className="font-bold text-sm">Start</span>
      </RetroButton>
      
      <div className="flex-grow h-full flex items-center space-x-1 overflow-x-auto">
        {windows.filter(w => w.isOpen && !w.isMinimizedNotTaskbar).map(win => (
          <RetroButton
            key={win.id}
            onClick={() => onTaskbarItemClick(win.id)}
            className={cn(
              "h-[calc(100%-4px)] text-xs truncate max-w-36",
              activeWindowId === win.id && "!bevel-inset-light" // Active style
            )}
            active={activeWindowId === win.id}
          >
            {win.title}
          </RetroButton>
        ))}
      </div>

      <div className="bevel-inset-light px-2 py-1 h-[calc(100%-4px)] ml-auto text-sm text-card-foreground flex items-center">
        <span>{currentTime}</span>
      </div>
    </div>
  );
}
