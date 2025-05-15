"use client";

import Link from 'next/link';
import { ComputerIcon } from '@/components/icons/ComputerIcon';
import { FolderIcon } from '@/components/icons/FolderIcon';
import { FileIcon } from '@/components/icons/FileIcon'; // Generic document/settings icon
import { cn } from '@/lib/utils';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuItemClick: (action: string) => void; // For opening windows like "About Me"
}

const menuItems = [
  { id: 'projects', name: 'Projects', icon: FolderIcon, action: 'openProjectsWindow' },
  { id: 'about', name: 'About Me', icon: ComputerIcon, action: 'openAboutWindow' },
  { id: 'ai-recommends', name: 'AI Recommends', icon: FileIcon, href: '/ai-recommends', type: 'link' },
  // Add more items like "Settings", "Contact" later
];

export function StartMenu({ isOpen, onClose, onMenuItemClick }: StartMenuProps) {
  if (!isOpen) return null;

  const handleItemClick = (item: typeof menuItems[0]) => {
    if (item.type === 'link' && item.href) {
      // Navigation handled by Link component
    } else if (item.action) {
      onMenuItemClick(item.action);
    }
    onClose();
  };

  return (
    <div 
      className="fixed bottom-10 left-0 w-56 bg-card border-2 border-r-btn-shadow border-b-btn-shadow border-l-btn-highlight border-t-btn-highlight shadow-lg z-[100]"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu
    >
      <div className="flex">
        <div className="w-8 bg-primary flex flex-col items-center justify-end py-4">
          <span className="transform rotate-[-90deg] whitespace-nowrap text-primary-foreground font-bold text-xl tracking-wider">
            RetroSite
          </span>
        </div>
        <ul className="flex-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.type === 'link' && item.href ? (
                <Link href={item.href} passHref legacyBehavior>
                  <a
                    onClick={() => handleItemClick(item)}
                    className="flex items-center gap-3 p-2 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground outline-none"
                  >
                    <item.icon className="w-6 h-6" />
                    <span>{item.name}</span>
                  </a>
                </Link>
              ) : (
                <button
                  onClick={() => handleItemClick(item)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground outline-none text-left"
                >
                  <item.icon className="w-6 h-6" />
                  <span>{item.name}</span>
                </button>
              )}
            </li>
          ))}
          {/* Separator and Shut Down could be added here */}
        </ul>
      </div>
    </div>
  );
}
