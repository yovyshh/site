"use client";

import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import { useEffect, useState, useRef } from 'react';
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import { XIcon, MinusIcon,Maximize2Icon, Minimize2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WindowProps {
  id: string;
  title: string;
  children: ReactNode;
  isOpen: boolean;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number | string; height: number | string };
  zIndex?: number;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  isMinimized?: boolean;
  isMaximized?: boolean;
  isMinimizedNotTaskbar?: boolean; // true if minimized to taskbar, window itself not visible
  className?: string;
}

export function SystemWindow({
  id,
  title,
  children,
  isOpen,
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 500, height: 400 },
  zIndex = 10,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  isMinimized = false,
  isMaximized = false,
  isMinimizedNotTaskbar = false,
  className,
}: WindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const nodeRef = useRef(null);

  useEffect(() => {
    if(isOpen) {
        onFocus(id);
    }
  }, [isOpen, id, onFocus]);
  
  // Reset position when re-opened if it was maximized
  useEffect(() => {
    if (isOpen && isMaximized) {
      // If re-opening a maximized window, might want to restore to non-maximized or handle as per OS
    } else if (isOpen && !isMaximized) {
      setPosition(prev => ({x: prev.x < 0 ? 50 : prev.x, y: prev.y < 0 ? 50 : prev.y}));
    }
  }, [isOpen, isMaximized]);


  if (!isOpen || isMinimizedNotTaskbar) {
    return null;
  }

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    if (isMaximized) return;
    setPosition({ x: data.x, y: data.y });
  };

  const handleMouseDown = (e: ReactMouseEvent) => {
    onFocus(id);
    // Prevent text selection during drag in content area
    if ((e.target as HTMLElement).closest('.window-content')) {
        // Allow text selection in content
    } else {
        e.preventDefault();
    }
  };
  
  const finalPosition = isMaximized ? { x: 0, y: 0 } : position;
  const finalSize = isMaximized 
    ? { width: 'calc(100% - 4px)', height: 'calc(100vh - 44px)' } // Adjust for taskbar and borders
    : size;

  return (
    <Draggable
      handle=".window-title-bar"
      position={finalPosition}
      onDrag={handleDrag}
      onStart={() => onFocus(id)}
      nodeRef={nodeRef}
      bounds="parent"
      disabled={isMaximized}
    >
      <div
        ref={nodeRef}
        className={cn(
          "absolute bg-card border-2 border-t-btn-highlight border-l-btn-highlight border-b-btn-shadow border-r-btn-shadow flex flex-col shadow-lg default-cursor",
          isMinimized && "hidden", // Hide if minimized (actual hiding, not taskbar state)
          className
        )}
        style={{
          width: typeof finalSize.width === 'number' ? `${finalSize.width}px` : finalSize.width,
          height: typeof finalSize.height === 'number' ? `${finalSize.height}px` : finalSize.height,
          zIndex,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="window-title-bar h-7 bg-primary text-primary-foreground flex items-center justify-between px-1 select-none">
          <span className="font-bold text-sm pl-1 truncate">{title}</span>
          <div className="flex space-x-1">
            <button onClick={() => onMinimize(id)} className="p-0.5 hover:bg-black/20 focus:outline-none">
              <MinusIcon size={16} />
            </button>
            <button onClick={() => onMaximize(id)} className="p-0.5 hover:bg-black/20 focus:outline-none">
              {isMaximized ? <Minimize2Icon size={16} /> : <Maximize2Icon size={16} /> }
            </button>
            <button onClick={() => onClose(id)} className="p-0.5 bg-red-600 hover:bg-red-700 focus:outline-none">
              <XIcon size={16} />
            </button>
          </div>
        </div>
        <div className="window-content flex-grow p-1 bg-card text-card-foreground overflow-auto bevel-inset-light">
          {children}
        </div>
      </div>
    </Draggable>
  );
}
