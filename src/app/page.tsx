
"use client";

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { DesktopIcon } from '@/components/retro-ui/DesktopIcon';
import { SystemWindow, type WindowProps as SystemWindowProps } from '@/components/retro-ui/SystemWindow';
import { Taskbar } from '@/components/retro-ui/Taskbar';
import { StartMenu } from '@/components/retro-ui/StartMenu';
import { DESKTOP_ITEMS, findDesktopItemById, type ProjectItem } from '@/constants/projects';
import { Button } from '@/components/ui/button'; // For project links if needed
import { AnimatedFace } from '@/components/AnimatedFace'; // Import the new component

// Extended Window State
interface WindowState extends SystemWindowProps {
  item: ProjectItem; // The project item this window represents
  contentOverride?: ReactNode; // For dynamic content like folder views
}

export default function HomePage() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [selectedDesktopIconId, setSelectedDesktopIconId] = useState<string | null>(null);
  const router = useRouter();

  const bringToFront = (id: string) => {
    setWindows(prevWindows =>
      prevWindows.map(win =>
        win.id === id ? { ...win, zIndex: nextZIndex } : win
      )
    );
    setActiveWindowId(id);
    setNextZIndex(prev => prev + 1);
  };

  const openWindow = useCallback((itemId: string, parentPosition?: {x: number, y: number}) => {
    const itemToOpen = findDesktopItemById(itemId);
    if (!itemToOpen) return;

    // If window for this item already exists, just bring to front and ensure it's not minimized
    const existingWindowIndex = windows.findIndex(w => w.item.id === itemId);
    if (existingWindowIndex !== -1) {
      setWindows(prev => prev.map((w, index) =>
        index === existingWindowIndex ? { ...w, isOpen: true, isMinimized: false, isMinimizedNotTaskbar: false, zIndex: nextZIndex } : w
      ));
      setActiveWindowId(itemId);
      setNextZIndex(prev => prev + 1);
      return;
    }

    // Define initial position, potentially offset from parent or default
    const initialX = parentPosition ? parentPosition.x + 30 : Math.random() * 200 + 50;
    const initialY = parentPosition ? parentPosition.y + 30 : Math.random() * 100 + 50;

    let content: ReactNode;
    let windowTitle = itemToOpen.name;

    if (itemToOpen.type === 'category-folder' && itemToOpen.content) {
      windowTitle = `Folder: ${itemToOpen.name}`;
      content = (
        <div className="p-2 grid grid-cols-3 gap-4">
          {itemToOpen.content.map(subItem => (
            <DesktopIcon
              key={subItem.id}
              icon={subItem.icon}
              name={subItem.name}
              className="!static w-full text-xs" // Override absolute for in-window icons
              onDoubleClick={() => openWindow(subItem.id, {x: initialX, y: initialY})}
            />
          ))}
        </div>
      );
    } else if (itemToOpen.url && itemToOpen.type !== 'project') { // For shortcuts like AI insights
        router.push(itemToOpen.url);
        return;
    } else {
      content = <ProjectWindowContent item={itemToOpen} />;
    }

    const newWindow: WindowState = {
      id: itemId, // Use item id for window id to link them
      title: windowTitle,
      children: content,
      isOpen: true,
      initialPosition: { x: initialX, y: initialY },
      initialSize: itemToOpen.type === 'category-folder' ? {width: 450, height:300} : { width: 600, height: 450 },
      zIndex: nextZIndex,
      onClose: handleCloseWindow,
      onMinimize: handleMinimizeWindow,
      onMaximize: handleMaximizeWindow,
      onFocus: bringToFront,
      item: itemToOpen,
      isMinimized: false,
      isMaximized: false,
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(itemId);
    setNextZIndex(prev => prev + 1);
    setIsStartMenuOpen(false); // Close start menu if open
  }, [windows, nextZIndex, router]);


  const handleCloseWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? {...w, isOpen: false} : w));
    if (activeWindowId === id) {
      // Find next highest zIndex window to activate
      const otherOpenWindows = windows.filter(w => w.isOpen && w.id !== id).sort((a,b) => (b.zIndex ?? 0) - (a.zIndex ?? 0));
      setActiveWindowId(otherOpenWindows.length > 0 ? otherOpenWindows[0].id : null);
    }
  };

  const handleMinimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true, isMinimizedNotTaskbar: true } : w));
     if (activeWindowId === id) {
      const otherOpenWindows = windows.filter(w => w.isOpen && !w.isMinimizedNotTaskbar && w.id !== id).sort((a,b) => (b.zIndex ?? 0) - (a.zIndex ?? 0));
      setActiveWindowId(otherOpenWindows.length > 0 ? otherOpenWindows[0].id : null);
    }
  };

  const handleMaximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    bringToFront(id);
  };

  const toggleStartMenu = () => {
    setIsStartMenuOpen(prev => !prev);
    if (!isStartMenuOpen) setSelectedDesktopIconId(null); // Deselect icons when opening start menu
  };

  const handleDesktopClick = () => {
    if (isStartMenuOpen) setIsStartMenuOpen(false);
    setSelectedDesktopIconId(null);
  };

  const handleDesktopIconClick = (id: string) => {
    setSelectedDesktopIconId(id);
    if (isStartMenuOpen) setIsStartMenuOpen(false);
  };

  const handleTaskbarItemClick = (id: string) => {
    const window = windows.find(w => w.id === id);
    if (window) {
      if (window.isMinimizedNotTaskbar || activeWindowId !== id) {
        // Restore or bring to front
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false, isMinimizedNotTaskbar: false, zIndex: nextZIndex } : w));
        setActiveWindowId(id);
        setNextZIndex(prev => prev + 1);
      } else {
        // Minimize if it's already active
        handleMinimizeWindow(id);
      }
    }
  };

  const handleStartMenuItemClick = (action: string) => {
    setIsStartMenuOpen(false);
    if (action === 'openProjectsWindow') {
      openWindow('projects-folder');
    } else if (action === 'openAboutWindow') {
      openWindow('about-me');
    }
    // Add more actions as needed
  };

  // Desktop icon positions
  const desktopIconLayout = [
    { id: 'projects-folder', x: 20, y: 20 },
    { id: 'about-me', x: 20, y: 120 },
    { id: 'ai-recommends-shortcut', x: 20, y: 220 },
  ];

  return (
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden flex flex-col relative" onClick={handleDesktopClick}>
      {/* Desktop Area */}
      <main className="flex-grow relative p-4" style={{height: 'calc(100vh - 40px)'}}>
        {/* Centered Face Animation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <AnimatedFace />
        </div>

        {desktopIconLayout.map(({ id, x, y }) => {
          const item = DESKTOP_ITEMS.find(dItem => dItem.id === id);
          if (!item) return null;
          return (
            <DesktopIcon
              key={item.id}
              icon={item.icon}
              name={item.name}
              x={x}
              y={y}
              onClick={(e) => { e.stopPropagation(); handleDesktopIconClick(item.id); }}
              onDoubleClick={(e) => { e.stopPropagation(); openWindow(item.id); }}
              isSelected={selectedDesktopIconId === item.id}
            />
          );
        })}

        {/* Render Windows */}
        {windows.map(win => (
          <SystemWindow key={win.id} {...win} />
        ))}
      </main>

      <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} onMenuItemClick={handleStartMenuItemClick} />
      <Taskbar
        onStartClick={toggleStartMenu}
        windows={windows}
        onTaskbarItemClick={handleTaskbarItemClick}
        activeWindowId={activeWindowId}
      />
    </div>
  );
}

// Component to display project content within a window
function ProjectWindowContent({ item }: { item: ProjectItem }) {
  return (
    <div className="p-4 text-sm">
      <h1 className="text-xl font-bold mb-2 text-primary">{item.name}</h1>
      {item.description && <p className="mb-4 text-muted-foreground">{item.description}</p>}

      {item.longDescription && (
         <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: item.longDescription }} />
      )}

      {item.images && item.images.length > 0 && (
        <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {item.images.map((img, index) => (
            <div key={index} className="border border-border bevel-inset-light p-1">
              <Image
                src={img.url}
                alt={img.alt}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                data-ai-hint={img.hint || 'project image'}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex space-x-4">
        {item.url && item.type === 'project' && (
          <Link href={item.url} target="_blank" rel="noopener noreferrer" passHref legacyBehavior>
            <Button asChild className="bevel-light !bg-secondary hover:!bg-accent !text-secondary-foreground active:bevel-inset-light"><a>Visit Site</a></Button>
          </Link>
        )}
        {item.repo && (
          <Link href={item.repo} target="_blank" rel="noopener noreferrer" passHref legacyBehavior>
            <Button asChild className="bevel-light !bg-secondary hover:!bg-accent !text-secondary-foreground active:bevel-inset-light"><a>View Code</a></Button>
          </Link>
        )}
      </div>
    </div>
  );
}

