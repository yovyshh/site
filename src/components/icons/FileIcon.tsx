import type { SVGProps } from 'react';

export function FileIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M6 2H20L26 8V30H6V2Z" fill="white" stroke="black" strokeWidth="1.5" />
      <path d="M20 2V8H26" stroke="black" strokeWidth="1.5" />
      <line x1="10" y1="14" x2="22" y2="14" stroke="black" strokeWidth="1.5" />
      <line x1="10" y1="18" x2="22" y2="18" stroke="black" strokeWidth="1.5" />
      <line x1="10" y1="22" x2="18" y2="22" stroke="black" strokeWidth="1.5" />
    </svg>
  );
}
