"use client";

import type { ComponentType, SVGProps, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  name: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onDoubleClick?: (event: MouseEvent<HTMLDivElement>) => void;
  x?: number;
  y?: number;
  className?: string;
  isSelected?: boolean;
}

export function DesktopIcon({
  icon: IconComponent,
  name,
  onClick,
  onDoubleClick,
  x,
  y,
  className,
  isSelected = false,
}: DesktopIconProps) {
  const style = (x !== undefined && y !== undefined) ? { left: `${x}px`, top: `${y}px` } : {};

  return (
    <div
      className={cn(
        'absolute flex flex-col items-center w-24 p-2 text-center hover:bg-primary/20 default-cursor',
        isSelected && 'bg-primary/40',
        className
      )}
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      role="button"
      tabIndex={0}
      aria-label={name}
    >
      <IconComponent className="w-10 h-10 mb-1 text-foreground" />
      <span 
        className={cn(
          'text-xs text-foreground select-none break-words w-full',
          isSelected && 'bg-primary text-primary-foreground p-0.5'
        )}
      >
        {name}
      </span>
    </div>
  );
}
