
"use client";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode, MouseEvent } from "react";
import { useClickSound } from "@/hooks/useClickSound";

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  active?: boolean; // For toggle buttons like taskbar items
}

export function RetroButton({ children, className, active = false, onClick, ...props }: RetroButtonProps) {
  const playClickSound = useClickSound();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    playClickSound();
    if (onClick) {
      onClick(event);
    }
  };
  
  return (
    <button
      className={cn(
        "px-3 py-1 bg-card text-card-foreground select-none focus:outline-none focus:ring-1 focus:ring-ring active:shadow-inner",
        active ? "bevel-inset-light" : "bevel-light",
        "active:translate-x-px active:translate-y-px", // Slight press effect
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
