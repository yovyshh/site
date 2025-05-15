import type { ComponentType, SVGProps, ReactNode } from 'react';
import { FolderIcon } from '@/components/icons/FolderIcon';
import { FileIcon } from '@/components/icons/FileIcon';
import { ComputerIcon } from '@/components/icons/ComputerIcon';

export interface ProjectItem {
  id: string;
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  description?: string;
  longDescription?: string; // Markdown or HTML for detailed view
  images?: { url: string; alt: string, hint?: string }[];
  url?: string;
  repo?: string;
  category?: string; // e.g. "Web Development", "Utilities"
  type: 'project' | 'info' | 'category-folder'; // Differentiates content type
  content?: ProjectItem[]; // For category folders
  component?: ReactNode; // For special windows like "About Me"
}

export const DESKTOP_ITEMS: ProjectItem[] = [
  {
    id: 'projects-folder',
    name: 'My Projects',
    icon: FolderIcon,
    type: 'category-folder',
    category: 'Folders',
    content: [
      {
        id: 'project-stellar',
        name: 'Stellar Navigator',
        icon: FileIcon, // Could be a custom app icon
        type: 'project',
        category: 'Web Development',
        description: 'A dynamic web platform for space exploration enthusiasts.',
        longDescription: 'Stellar Navigator is built with Next.js, Tailwind CSS, and integrates with multiple space agency APIs to provide real-time data on celestial events and missions. It features interactive star maps and user-customizable dashboards.',
        images: [
          { url: 'https://placehold.co/600x400.png?text=Stellar+Screenshot+1', alt: 'Stellar Navigator Dashboard', hint: 'space dashboard' },
          { url: 'https://placehold.co/600x400.png?text=Stellar+Screenshot+2', alt: 'Stellar Navigator Star Map', hint: 'star map' },
        ],
        url: '#',
        repo: '#',
      },
      {
        id: 'project-retro-games',
        name: 'Retro Game Hub',
        icon: FileIcon,
        type: 'project',
        category: 'Games',
        description: 'A collection of classic games remade with modern tech.',
        longDescription: 'This project is a nostalgic trip, featuring remakes of beloved retro games. Each game is developed in JavaScript with a focus on capturing the original feel while improving performance and adding minor quality-of-life updates.',
        images: [ { url: 'https://placehold.co/600x400.png?text=Retro+Game+Screenshot', alt: 'Retro Game Hub', hint: 'arcade game' } ],
        url: '#',
      },
    ],
  },
  {
    id: 'about-me',
    name: 'About Me',
    icon: ComputerIcon,
    type: 'info',
    category: 'System',
    longDescription: `
      <h2 class="text-lg font-bold mb-2">Hello! I'm [Your Name/RetroSite Creator]</h2>
      <p class="mb-2">I am a passionate developer and designer with a love for all things retro and modern technology.</p>
      <p class="mb-2">This portfolio is a testament to that passion, blending the nostalgic charm of Windows 98 with a showcase of my capabilities in creating engaging user experiences.</p>
      <h3 class="text-md font-bold mt-4 mb-1">Skills:</h3>
      <ul class="list-disc list-inside mb-2">
        <li>Next.js, React, TypeScript</li>
        <li>Tailwind CSS, ShadCN UI</li>
        <li>Node.js, Firebase</li>
        <li>UI/UX Design</li>
        <li>Pixel Art & Retro Aesthetics</li>
      </ul>
      <p>Feel free to explore my projects and get in touch!</p>
    `,
  },
  {
    id: 'ai-recommends-shortcut',
    name: 'AI Insights',
    icon: FileIcon, // Could be a brain or lightbulb icon
    type: 'info', // Opens a link to the AI page
    category: 'Utilities',
    description: 'Let an AI suggest what to explore next!',
    url: '/ai-recommends', // This will navigate
  },
];

// Helper to find an item by ID, including nested items
export function findDesktopItemById(id: string, items: ProjectItem[] = DESKTOP_ITEMS): ProjectItem | undefined {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    if (item.content) {
      const foundInChild = findDesktopItemById(id, item.content);
      if (foundInChild) {
        return foundInChild;
      }
    }
  }
  return undefined;
}
