import type { SVGProps } from 'react';

export function StartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="10" y="10" width="35" height="35" fill="#F85540"/>
      <rect x="55" y="10" width="35" height="35" fill="#35AC4F"/>
      <rect x="10" y="55" width="35" height="35" fill="#50A7F9"/>
      <rect x="55" y="55" width="35" height="35" fill="#FEC000"/>
    </svg>
  );
}
