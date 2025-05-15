"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Using shadcn button, will be styled by theme
import { RetroButton } from '@/components/retro-ui/RetroButton';
import { DESKTOP_ITEMS, findDesktopItemById } from '@/constants/projects';

// Mock AI responses
const aiResponses = [
  "My advanced algorithms suggest you might enjoy 'Stellar Navigator'. It's truly out of this world!",
  "Based on your impeccable taste (and random chance), 'Retro Game Hub' could be your next click.",
  "I sense a curious mind. Perhaps the 'About Me' section holds the secrets you seek?",
  "The digital winds whisper of 'Project Alpha'... if it existed in this demo!",
  "Why not explore the 'My Projects' folder? Adventure awaits!",
];

export default function AiRecommendsPage() {
  const [recommendation, setRecommendation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dots, setDots] = useState('');

  useEffect(() => {
    let dotInterval: NodeJS.Timeout;
    if (isLoading) {
      dotInterval = setInterval(() => {
        setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);
    } else {
      setDots('');
    }
    return () => clearInterval(dotInterval);
  }, [isLoading]);

  const getRecommendation = () => {
    setIsLoading(true);
    setRecommendation(''); // Clear previous recommendation
    
    // Simulate AI thinking
    setTimeout(() => {
      // Pick a random project that is a direct project or info, not a folder.
      const allProjects = DESKTOP_ITEMS.flatMap(item => item.type === 'category-folder' && item.content ? item.content : item)
                                      .filter(p => p && (p.type === 'project' || p.type === 'info') && p.id !== 'ai-recommends-shortcut');
      
      let recommendedProject;
      if (allProjects.length > 0) {
        recommendedProject = allProjects[Math.floor(Math.random() * allProjects.length)];
      }

      let finalRecommendation = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      if (recommendedProject) {
        finalRecommendation = `My sophisticated analysis (and a bit of luck!) points towards "${recommendedProject.name}". It seems like something you'd find interesting!`;
      }

      setRecommendation(finalRecommendation);
      setIsLoading(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 font-sans">
      <div className="w-full max-w-2xl bg-card border-2 border-t-btn-highlight border-l-btn-highlight border-b-btn-shadow border-r-btn-shadow shadow-lg">
        {/* Title Bar */}
        <div className="h-7 bg-primary text-primary-foreground flex items-center justify-between px-2 select-none">
          <span className="font-bold text-sm">AI Project Oracle</span>
          <Link href="/" passHref legacyBehavior>
            <a className="p-0.5 bg-red-600 hover:bg-red-700 focus:outline-none">
              {/* Simple X, lucide not available here easily without more imports */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </a>
          </Link>
        </div>
        
        {/* Content Area */}
        <div className="p-6 bevel-inset-light min-h-[300px] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-6 text-primary">Ask the AI Oracle!</h1>
          
          <RetroButton 
            onClick={getRecommendation} 
            disabled={isLoading}
            className="mb-6 px-6 py-3 text-lg"
          >
            {isLoading ? 'Consulting Spirits...' : 'Reveal My Next Adventure!'}
          </RetroButton>

          {isLoading && (
            <div className="text-center text-lg text-accent">
              <p>Calculating optimal trajectory through portfolio space{dots}</p>
              <div className="mt-4 w-full bg-muted h-6 bevel-inset-light overflow-hidden">
                <div className="bg-primary h-full animate-pulse" style={{ width: `${Math.random()*30 + 20}%` }}></div>
              </div>
            </div>
          )}

          {!isLoading && recommendation && (
            <div className="mt-4 p-4 bg-secondary bevel-light text-secondary-foreground text-center">
              <p className="text-lg">{recommendation}</p>
            </div>
          )}
           {!isLoading && !recommendation && (
            <p className="text-muted-foreground">Click the button to receive a project recommendation from the AI Oracle.</p>
          )}
        </div>
        {/* Status Bar */}
        <div className="h-6 border-t-2 border-muted flex items-center px-2 text-xs text-muted-foreground">
          <div className="bevel-inset-light px-2 flex-1">
            {isLoading ? "AI Status: Processing..." : "AI Status: Idle"}
          </div>
          <div className="bevel-inset-light px-2 ml-2">
            Oracle V0.98
          </div>
        </div>
      </div>
       <Link href="/" passHref className="mt-8">
          <RetroButton>Back to Desktop</RetroButton>
        </Link>
    </div>
  );
}
