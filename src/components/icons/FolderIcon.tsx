import type { SVGProps } from 'react';

export function FolderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 5H12L14 7H28V27H4V5Z" fill="#FFB000" stroke="#000000" strokeWidth="1.5" />
      <path d="M4 5H12L14 7H28V10H4V5Z" fill="#FFD700" stroke="#000000" strokeWidth="1.5" />
    </svg>
  );
}
