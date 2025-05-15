import type { SVGProps } from 'react';

export function ComputerIcon(props: SVGProps<SVGSVGElement>) {
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
      {/* Monitor */}
      <rect x="4" y="4" width="24" height="18" rx="1" fill="#C0C0C0" stroke="black" strokeWidth="1.5" />
      <rect x="6" y="6" width="20" height="14" fill="#000080" /> {/* Screen */}
      {/* Stand */}
      <path d="M12 22H20V24H12Z" fill="#A0A0A0" stroke="black" strokeWidth="1.5" />
      <path d="M10 24H22V26H10Z" fill="#808080" stroke="black" strokeWidth="1.5" />
       {/* CD Drive like slot */}
      <rect x="8" y="16" width="3" height="2" fill="#E0E0E0" stroke="black" strokeWidth="0.5"/>
    </svg>
  );
}
